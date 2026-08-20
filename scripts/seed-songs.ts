import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';

// Load environment variables manually to avoid extra dependencies
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', 'backend', '.env'),
  ];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      for (const line of content.split('\n')) {
        const parts = line.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const val = parts.slice(1).join('=').trim();
          process.env[key] = val;
        }
      }
      break;
    }
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/retro_radio_india';

const SongSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    movie: String,
    year: Number,
    language: String,
    youtubeVideoId: { type: String, required: true, unique: true },
    thumbnail: String,
    duration: Number,
    themes: [String],
    isActive: { type: Boolean, default: true },
    playCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Song = mongoose.models.Song || mongoose.model('Song', SongSchema);

async function runSeed() {
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected successfully!');

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    console.error(`Data directory not found at: ${dataDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dataDir).filter((file) => file.endsWith('.json'));
  console.log(`Found ${files.length} JSON data files to seed.`);

  let totalSongs = 0;
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
      const songs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`Seeding ${songs.length} songs from ${file}...`);
      
      for (const song of songs) {
        await Song.updateOne(
          { youtubeVideoId: song.youtubeVideoId },
          { $set: song },
          { upsert: true }
        );
      }
      totalSongs += songs.length;
    } catch (e) {
      console.error(`Error seeding file ${file}:`, e);
    }
  }

  console.log(`Seeding complete. Seeded total of ${totalSongs} songs.`);
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

runSeed().catch((err) => {
  console.error('Seed process failed:', err);
  process.exit(1);
});
