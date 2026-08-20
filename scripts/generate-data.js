const fs = require('fs');
const path = require('path');

const themes = [
  {
    slug: 'deluxe-salon',
    artists: ['Kishore Kumar', 'Mohammed Rafi', 'Lata Mangeshkar', 'Asha Bhosle', 'Mukesh'],
    movies: ['Aradhana', 'Don', 'Sholay', 'Amar Akbar Anthony', 'Bobby', 'Muqaddar Ka Sikandar'],
    titleTemplates: [
      'Mere Sapno Ki Rani', 'Khaike Paan Banaraswala', 'Yeh Dosti Hum Nahi Todenge',
      'Parda Hai Parda', 'Hum Tum Ek Kamre Mein', 'O Saathi Re', 'Zindagi Ek Safar Hai Suhana',
      'Chala Jata Hoon', 'Roop Tera Mastana', 'Jai Jai Shiv Shankar', 'Ek Ajnabee Haseena Se'
    ],
    languages: ['Hindi'],
    yearMin: 1965,
    yearMax: 1985
  },
  {
    slug: 'bus-driver',
    artists: ['Bappi Lahiri', 'Amit Kumar', 'Kishore Kumar', 'Udit Narayan', 'Kumar Sanu'],
    movies: ['Disco Dancer', 'Himmatwala', 'Tridev', 'Tezaab', 'Hum', 'Aashiqui', 'Baazigar'],
    titleTemplates: [
      'I Am a Disco Dancer', 'Taki Taki', 'Oye Oye Tirchi Topiwale', 'Ek Do Teen',
      'Jumma Chumma De De', 'Dheere Dheere Se Meri Zindagi', 'Yeh Kaali Kaali Aankhen',
      'Gori Tera Nakhra', 'Chura Ke Dil Mera', 'Tip Tip Barsa Paani', 'Main Khiladi Tu Anari'
    ],
    languages: ['Hindi'],
    yearMin: 1980,
    yearMax: 1998
  },
  {
    slug: 'bhojpuri-bangers',
    artists: ['Pawan Singh', 'Manoj Tiwari', 'Khesari Lal Yadav', 'Dinesh Lal Yadav', 'Sharda Sinha'],
    movies: ['Single', 'Bhojpuri Hit', 'Ganga', 'Loha', 'Devra Bada Satawela', 'Pratigya'],
    titleTemplates: [
      'Lollypop Lagelu', 'Chat Deni Maar Deli', 'Saj Ke Sawar Ke', 'Thik Hai',
      'Chhalakata Hamro Jawaniya', 'Kaanch Hi Baans Ke Bahangiya', 'Hello Koun',
      'Piyawa Se Pahile', 'Aara Hile Chapra Hile', 'Rinkiya Ke Papa', 'Gori Tori Chunari'
    ],
    languages: ['Bhojpuri'],
    yearMin: 2000,
    yearMax: 2024
  },
  {
    slug: 'bartan-time',
    artists: ['Jagjit Singh', 'Chitra Singh', 'Pankaj Udhas', 'Lata Mangeshkar', 'Geeta Dutt'],
    movies: ['Arth', 'Saath Saath', 'Ghazals', 'Prem Rog', 'Pyaasa', 'Kagaz Ke Phool'],
    titleTemplates: [
      'Tum Itna Jo Muskuraye Ho', 'Jhuki Jhuki Si Nazar', 'Chitthi Aayi Hai',
      'Hoshwalon Ko Khabar Kya', 'Waqt Ne Kiya Kya Haseen Sitam', 'Babuji Dhire Chalna',
      'Yeh Tera Ghar Yeh Mera Ghar', 'Tum Ko Dekha To Yeh Khayal Aaya', 'Honthon Se Chhoo Lo Tum'
    ],
    languages: ['Hindi'],
    yearMin: 1955,
    yearMax: 1995
  },
  {
    slug: 'raju-mistri',
    artists: ['R.D. Burman', 'Kishore Kumar', 'Asha Bhosle', 'S.P. Balasubrahmanyam', 'Hariharan'],
    movies: ['Yaadon Ki Baaraat', 'Hum Kisise Kum Naheen', 'Gol Maal', 'Maine Pyar Kiya', 'Roja'],
    titleTemplates: [
      'Chura Liya Hai Tumne Jo Dil Ko', 'Kya Hua Tera Wada', 'Aane Wala Pal Jane Wala Hai',
      'Dil Deewana Bin Sajna Ke', 'Dil Hai Chhota Sa', 'Duniya Mein Logon Ko', 'Mehbooba Mehbooba',
      'Ek Ladki Ko Dekha', 'Pyaar Deewana Hota Hai', 'Dum Maro Dum', 'Bachna Ae Haseeno'
    ],
    languages: ['Hindi'],
    yearMin: 1970,
    yearMax: 1995
  },
  {
    slug: 'papa-ke-gaane',
    artists: ['Kishore Kumar', 'Mohammed Rafi', 'Mukesh', 'Hemant Kumar', 'Manna Dey'],
    movies: ['Anand', 'Safar', 'Guide', 'Sangam', 'Awaara', 'Waqt', 'Padosan'],
    titleTemplates: [
      'Zindagi Kaisi Hai Paheli', 'Zindagi Ka Safar', 'Din Dhal Jaye', 'Dost Dost Na Raha',
      'Awaara Hoon', 'Ae Meri Zohra Jabeen', 'Mere Samne Wali Khidki Mein', 'Ek Chatur Naar',
      'Chaudhvin Ka Chand Ho', 'Suhaana Safar Aur Ye Mausam Haseen', 'Yeh Raaten Yeh Mausam'
    ],
    languages: ['Hindi'],
    yearMin: 1950,
    yearMax: 1980
  }
];

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Fixed legit video IDs that we can play, or high-quality nostalgic tracks.
// Let's seed 100 songs for each theme.
themes.forEach(theme => {
  const songs = [];
  
  // Real YouTube Video IDs of retro songs for seeds
  const youtubeIds = [
    'S_E9v9m9x9w', 'vo1MykK4uLg', 'vo1MykK4uLg', 'h4y1_T5b6kI', 'h9rFhFwL2sQ',
    '3FGD1F07F2w', 'F29lM7_qC5o', 'G9v2C3qK5sE', 'J8H8FwK2v9E', 'K8FhP2m3v8w'
  ];

  for (let i = 1; i <= 100; i++) {
    const artist = theme.artists[i % theme.artists.length];
    const movie = theme.movies[i % theme.movies.length];
    const titleTemplate = theme.titleTemplates[i % theme.titleTemplates.length];
    const title = `${titleTemplate} (Part ${Math.floor(i / theme.titleTemplates.length) + 1})`;
    const year = theme.yearMin + (i % (theme.yearMax - theme.yearMin + 1));
    const language = theme.languages[i % theme.languages.length];
    
    // Generate a unique and valid-looking youtube id for each track
    // If it's the first few tracks, we use actual playable demo ids
    let youtubeVideoId = '';
    if (i <= 5) {
      // Use some known retro song IDs or standard YouTube IDs
      if (theme.slug === 'deluxe-salon') {
        const salonIds = ['S_E9v9m9x9w', 'vo1MykK4uLg', 'vo1MykK4uLg', 'vo1MykK4uLg', 'vo1MykK4uLg'];
        youtubeVideoId = salonIds[i - 1];
      } else if (theme.slug === 'bus-driver') {
        const busIds = ['vo1MykK4uLg', 'S_E9v9m9x9w', 'vo1MykK4uLg', 'vo1MykK4uLg', 'vo1MykK4uLg'];
        youtubeVideoId = busIds[i - 1];
      } else {
        // Fallback demo IDs
        youtubeVideoId = `demo_${theme.slug}_${i}`;
      }
    } else {
      youtubeVideoId = `${theme.slug}_video_${i}`;
    }

    songs.push({
      title,
      artist,
      movie,
      year,
      language,
      youtubeVideoId,
      thumbnail: `https://img.youtube.com/vi/${youtubeVideoId.startsWith('demo_') || youtubeVideoId.includes('_video_') ? 'dQw4w9WgXcQ' : youtubeVideoId}/hqdefault.jpg`,
      duration: 180 + (i * 3) % 180, // 3 to 6 mins
      themes: [theme.slug],
      isActive: true,
      isDemo: true
    });
  }

  const filePath = path.join(dataDir, `${theme.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(songs, null, 2));
  console.log(`Generated ${songs.length} songs for theme ${theme.slug} at ${filePath}`);
});
