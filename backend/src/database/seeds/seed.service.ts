import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThemesService } from '../../modules/themes/themes.service';
import { SongsService } from '../../modules/songs/songs.service';
import { RedisService } from '../../common/redis/redis.service';
import { Song } from '../../modules/songs/schemas/song.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
  constructor(
    private readonly themesService: ThemesService,
    private readonly songsService: SongsService,
    private readonly redisService: RedisService,
    @InjectModel(Song.name) private songModel: Model<Song>,
  ) {}

  async seed() {
    await this.dropOldIndexes();
    await this.seedThemes();
  }

  private async dropOldIndexes() {
    try {
      const indexes = await this.songModel.collection.indexes();
      const uniqueYoutubeIndex = indexes.find(
        (idx: Record<string, unknown>) =>
          idx.key &&
          (idx.key as Record<string, unknown>).youtubeVideoId === 1 &&
          idx.unique === true,
      );
      if (uniqueYoutubeIndex) {
        await this.songModel.collection.dropIndex(
          uniqueYoutubeIndex.name as string,
        );
        console.log('Dropped old unique youtubeVideoId index.');
      }
    } catch {
      // Index may not exist, which is fine
    }
  }

  private async seedThemes() {
    const themes = [
      {
        name: 'लक्की Salon',
        slug: 'deluxe-salon',
        description:
          'The classic Indian roadside barbershop experience, with old scissors clicking and gossip.',
        icon: '✂️',
        accentColor: '#d32f2f',
        backgroundImage:
          'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200',
        characterImage: 'https://illustrations.popsy.co/amber/barber.svg',
        quotes: [
          'Bhaiya, thoda side se chhota kar dena.',
          'Agle Sunday aana, aaj bheed hai.',
          'Ustad, tel maalish kadak honi chahiye!',
          'Arre, Sharma ji ke ladke ki shaadi ho gayi kya?',
        ],
        ambientSound:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder ambient
        isActive: true,
      },
      {
        name: 'Bus ड्राइवर',
        slug: 'bus-driver',
        description:
          'Feel the rhythm of the highway. Loud horn blowin, colorful stickers, and high-speed turns.',
        icon: '🚌',
        accentColor: '#fbc02d',
        backgroundImage:
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200',
        characterImage: 'https://illustrations.popsy.co/amber/car-taxi.svg',
        quotes: [
          'Pichhe chalo, pichhe bahut jagah hai!',
          'Horn OK Please.',
          'Oye chhotu, do chai bol de dhabe pe!',
          'Aage se left.. thoko horn!',
        ],
        ambientSound:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        isActive: true,
      },
      {
        name: 'भोजपुरी Bangers',
        slug: 'bhojpuri-bangers',
        description:
          'High voltage energy from the heartland. Heavy auto-tuned vocals and earth-shattering bass.',
        icon: '🐘',
        accentColor: '#ef6c00',
        backgroundImage:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
        characterImage: 'https://illustrations.popsy.co/amber/musician.svg',
        quotes: [
          'Lollypop lagelu!',
          'Jiya ho Bihar ke lala.',
          'Phod denge DJ pe aaj!',
          'Bhojpuriya sher garjega!',
        ],
        ambientSound:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        isActive: true,
      },
      {
        name: 'Bartan टाइम',
        slug: 'bartan-time',
        description:
          'Therapeutic and nostalgic kitchen sounds. Clinking steel spoons and cooking pressure cooker whistles.',
        icon: '🍽️',
        accentColor: '#757575',
        backgroundImage:
          'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200',
        characterImage: 'https://illustrations.popsy.co/amber/chef.svg',
        quotes: [
          'Khana lag gaya hai!',
          'Bartan dhone ka samay ho gaya.',
          'Do seeti aur aane do dal mein.',
          'Chai peeyoge ki thanda?',
        ],
        ambientSound:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        isActive: true,
      },
      {
        name: 'Raju मिस्त्री',
        slug: 'raju-mistri',
        description:
          'The creative mechanics of a local garage or construction site. Hammer hitting, diesel engines, and oily hands.',
        icon: '🏠',
        accentColor: '#5d4037',
        backgroundImage:
          'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=1200',
        characterImage: 'https://illustrations.popsy.co/amber/mechanic.svg',
        quotes: [
          'Sahab, saria kam pad gaya.',
          'Kal pakka kaam khatam kar denge.',
          'Yeh waala paana dena zara bhaya.',
          'Engine abhi makhan chalega!',
        ],
        ambientSound:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        isActive: true,
      },
      {
        name: 'Papa Ke गाने',
        slug: 'papa-ke-gaane',
        description:
          'Vintage evergreen radio classics. A warm cup of tea, newspapers, and retro transistors playing Rafi & Kishore.',
        icon: '👨‍👩‍👧',
        accentColor: '#1976d2',
        backgroundImage:
          'https://images.unsplash.com/photo-1484755560693-a4074577af3a?q=80&w=1200',
        characterImage:
          'https://illustrations.popsy.co/amber/listening-to-music.svg',
        quotes: [
          'Aaj kal ke gaane bhi koi gaane hain?',
          'Ye asli sangeet hai.',
          'Radio Binaca Geetmala yaad hai?',
          'Kishore da ka kya kehna!',
        ],
        ambientSound:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        isActive: true,
      },
      {
        name: 'ऑफिस टाइम',
        slug: 'working-time',
        description:
          'The 9-to-5 grind. Deadlines looming, chai breaks saving the day, and colleagues gossiping by the water cooler.',
        icon: '💼',
        accentColor: '#0891b2',
        backgroundImage:
          'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200',
        characterImage: 'https://illustrations.popsy.co/amber/work-from-home.svg',
        quotes: [
          'Boss ka call aaya kya?',
          'Chai peeyoge? Kaam baad mein hoga.',
          'Deadline kal tak hai... kal tak!',
          'Thoda sa aur kaam, phir ghar.',
        ],
        isActive: true,
      },
      {
        name: 'मूड Off',
        slug: 'mood-off',
        description:
          'Dil dukhi hai. Baarish ho rahi hai. Chai thandi ho gayi. Woh gaane jo andar tak chhu jaate hain.',
        icon: '🌧️',
        accentColor: '#7c3aed',
        backgroundImage:
          'https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=1200',
        characterImage: 'https://illustrations.popsy.co/amber/sitting-with-dog.svg',
        quotes: [
          'Dil ye kya chahta hai...',
          'Baarish mein bheeg ke sochte raho.',
          'Kuch toh hai jo mann nahi maanta.',
          'Phir bhi zindagi chalti hai...',
        ],
        isActive: true,
      },
    ];

    await this.themesService.upsertMany(themes);
    console.log('Themes seeded/verified successfully.');
  }

  private async seedSongs() {
    let dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      dataDir = path.join(process.cwd(), '..', 'data');
    }

    const themeSlugs = [
      'deluxe-salon',
      'bus-driver',
      'bhojpuri-bangers',
      'bartan-time',
      'raju-mistri',
      'papa-ke-gaane',
    ];

    await this.songsService.deleteAll();
    console.log('Cleared existing songs for fresh seed.');

    let totalSeeded = 0;

    for (const slug of themeSlugs) {
      const filePath = path.join(dataDir, `${slug}.json`);
      if (fs.existsSync(filePath)) {
        try {
          const songsData = JSON.parse(
            fs.readFileSync(filePath, 'utf8'),
          ) as Record<string, unknown>[];
          await this.songsService.upsertMany(songsData);
          totalSeeded += songsData.length;
          console.log(`Seeded ${songsData.length} songs from ${slug}.json`);
        } catch (e) {
          console.error(`Failed to seed songs for theme ${slug}:`, e);
        }
      } else {
        console.warn(`Seed file not found: ${filePath}`);
      }
    }

    console.log(`Finished seeding songs. Total processed: ${totalSeeded}`);

    await this.redisService.delPattern('radio:*');
    console.log('Flushed radio cache.');
  }
}
