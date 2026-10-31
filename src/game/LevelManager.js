/**
 * LevelManager.js
 * Konfigurasi 5 level petualangan sejarah kemerdekaan Indonesia.
 * Ditingkatkan dengan tantangan rintangan bertahap yang lebih menantang:
 * musuh biasa & elite bersenjata, platform bergerak dinamis, dan jebakan duri presisi.
 */

export const LEVELS = {
  1: {
    number: 1,
    title: "Level 1: Awal Perjuangan",
    subtitle: "Mengenal Semangat Perjuangan & Uji Coba Bambu Runcing",
    worldBounds: { width: 1800, height: 600 },
    playerStart: { x: 70, y: 440 },
    theme: {
      skyTop: '#4fc3f7',
      skyBottom: '#e1f5fe',
      tileType: 'tile_grass',
      bgType: 'village'
    },
    checkpoint: { x: 620, y: 440 },
    questionBlock: { x: 880, y: 350 },
    gate: { x: 1620, y: 390 },
    platforms: [
      { x: 0, y: 500, w: 380, h: 100 },
      { x: 440, y: 500, w: 260, h: 100 },
      // Undakan tangga menuju kuis
      { x: 720, y: 430, w: 90, h: 25 },
      { x: 840, y: 390, w: 120, h: 25 },
      // Platform setelah kuis
      { x: 960, y: 500, w: 320, h: 100 },
      // Lompatan sedang
      { x: 1140, y: 430, w: 90, h: 25 },
      { x: 1280, y: 390, w: 110, h: 25 },
      // Platform akhir gerbang
      { x: 1440, y: 480, w: 360, h: 120 }
    ],
    movingPlatforms: [
      { x: 390, y: 470, w: 64, h: 20, rangeX: 35, rangeY: 0, speed: 60 }
    ],
    coins: [
      { x: 180, y: 460 },
      { x: 230, y: 460 },
      { x: 280, y: 460 },
      { x: 500, y: 460 },
      { x: 550, y: 460 },
      { x: 750, y: 390 },
      { x: 880, y: 280 }, // Di atas blok pertanyaan
      { x: 1020, y: 460 },
      { x: 1070, y: 460 },
      { x: 1170, y: 390 },
      { x: 1320, y: 350 },
      { x: 1500, y: 430 },
      { x: 1550, y: 430 }
    ],
    spikes: [
      { x: 400, y: 580 },
      { x: 930, y: 580 },
      { x: 1400, y: 580 }
    ],
    enemies: [
      // Musuh patroli awal untuk menguji serangan Bambu Runcing
      { x: 250, y: 465, patrolDist: 60, speed: 50, type: 'regular', hp: 1 },
      { x: 560, y: 465, patrolDist: 50, speed: 55, type: 'regular', hp: 1 },
      { x: 1050, y: 465, patrolDist: 65, speed: 60, type: 'regular', hp: 1 }
    ]
  },

  2: {
    number: 2,
    title: "Level 2: Menjelang Proklamasi",
    subtitle: "Rintangan Hutan Rengasdengklok & Patroli Penjaga",
    worldBounds: { width: 2000, height: 600 },
    playerStart: { x: 70, y: 440 },
    theme: {
      skyTop: '#00897b',
      skyBottom: '#80cbc4',
      tileType: 'tile_grass',
      bgType: 'jungle'
    },
    checkpoint: { x: 820, y: 440 },
    questionBlock: { x: 1020, y: 340 },
    gate: { x: 1820, y: 410 },
    platforms: [
      { x: 0, y: 500, w: 320, h: 100 },
      { x: 380, y: 480, w: 180, h: 120 },
      { x: 680, y: 500, w: 280, h: 100 },
      // Platform mengambang menuju kuis
      { x: 880, y: 420, w: 80, h: 25 },
      { x: 980, y: 380, w: 90, h: 25 },
      // Jalur tengah berpatroli
      { x: 1100, y: 490, w: 320, h: 110 },
      { x: 1320, y: 430, w: 90, h: 25 },
      { x: 1470, y: 460, w: 110, h: 30 },
      // Area akhir
      { x: 1680, y: 500, w: 320, h: 100 }
    ],
    movingPlatforms: [
      { x: 580, y: 450, w: 64, h: 20, rangeX: 60, rangeY: 0, speed: 70 },
      { x: 1600, y: 470, w: 64, h: 20, rangeX: 0, rangeY: 40, speed: 65 }
    ],
    coins: [
      { x: 150, y: 460 },
      { x: 200, y: 460 },
      { x: 420, y: 440 },
      { x: 470, y: 440 },
      { x: 720, y: 460 },
      { x: 1020, y: 280 },
      { x: 1150, y: 450 },
      { x: 1200, y: 450 },
      { x: 1350, y: 380 },
      { x: 1500, y: 420 },
      { x: 1720, y: 450 },
      { x: 1770, y: 450 }
    ],
    spikes: [
      { x: 340, y: 580 },
      { x: 640, y: 580 },
      { x: 1040, y: 580 },
      { x: 1435, y: 580 },
      { x: 1640, y: 580 }
    ],
    enemies: [
      { x: 220, y: 465, patrolDist: 60, speed: 55, type: 'regular', hp: 1 },
      { x: 460, y: 445, patrolDist: 50, speed: 65, type: 'regular', hp: 1 },
      { x: 760, y: 465, patrolDist: 70, speed: 60, type: 'regular', hp: 1 },
      { x: 1180, y: 455, patrolDist: 70, speed: 70, type: 'regular', hp: 1 },
      { x: 1510, y: 425, patrolDist: 40, speed: 60, type: 'regular', hp: 1 }
    ]
  },

  3: {
    number: 3,
    title: "Level 3: Merumuskan Kemerdekaan",
    subtitle: "Gedung Bersejarah & Pasukan Penjaga Berlapis Baja",
    worldBounds: { width: 2200, height: 600 },
    playerStart: { x: 70, y: 440 },
    theme: {
      skyTop: '#d84315',
      skyBottom: '#ffccbc',
      tileType: 'tile_brick',
      bgType: 'city'
    },
    checkpoint: { x: 960, y: 440 },
    questionBlock: { x: 1150, y: 310 },
    gate: { x: 2020, y: 410 },
    platforms: [
      { x: 0, y: 500, w: 280, h: 100 },
      // Platform bertingkat bata
      { x: 340, y: 460, w: 120, h: 30 },
      { x: 500, y: 410, w: 120, h: 30 },
      { x: 410, y: 320, w: 110, h: 25 },
      // Jalur bawah luas dengan duri
      { x: 720, y: 500, w: 380, h: 100 },
      // Platform tinggi tempat kuis berada
      { x: 980, y: 410, w: 100, h: 25 },
      { x: 1100, y: 360, w: 120, h: 25 },
      // Bagian lanjutan dengan jurang bertingkat
      { x: 1280, y: 480, w: 180, h: 120 },
      { x: 1540, y: 440, w: 120, h: 30 },
      { x: 1740, y: 410, w: 120, h: 30 },
      // Platform akhir
      { x: 1920, y: 500, w: 280, h: 100 }
    ],
    movingPlatforms: [
      { x: 640, y: 370, w: 64, h: 20, rangeX: 0, rangeY: 55, speed: 65 },
      { x: 1470, y: 470, w: 64, h: 20, rangeX: 50, rangeY: 0, speed: 75 },
      { x: 1870, y: 460, w: 64, h: 20, rangeX: 40, rangeY: 0, speed: 70 }
    ],
    coins: [
      { x: 160, y: 460 },
      { x: 380, y: 420 },
      { x: 450, y: 280 },
      { x: 550, y: 370 },
      { x: 780, y: 460 },
      { x: 840, y: 460 },
      { x: 1020, y: 360 },
      { x: 1150, y: 250 },
      { x: 1320, y: 430 },
      { x: 1580, y: 390 },
      { x: 1780, y: 360 },
      { x: 1960, y: 450 },
      { x: 2000, y: 450 }
    ],
    spikes: [
      { x: 300, y: 580 },
      { x: 670, y: 580 },
      { x: 860, y: 465 }, // Duri di atas lantai bata!
      { x: 1240, y: 580 },
      { x: 1700, y: 580 }
    ],
    enemies: [
      { x: 200, y: 465, patrolDist: 50, speed: 60, type: 'regular', hp: 1 },
      { x: 530, y: 375, patrolDist: 40, speed: 70, type: 'regular', hp: 1 },
      // Musuh Elite Lapis Emas (2 Hit) pertama
      { x: 800, y: 465, patrolDist: 60, speed: 75, type: 'elite', hp: 2 },
      { x: 920, y: 465, patrolDist: 50, speed: 65, type: 'regular', hp: 1 },
      { x: 1340, y: 445, patrolDist: 55, speed: 80, type: 'elite', hp: 2 },
      { x: 1770, y: 375, patrolDist: 40, speed: 70, type: 'regular', hp: 1 }
    ]
  },

  4: {
    number: 4,
    title: "Level 4: Semangat Perjuangan",
    subtitle: "Penyusupan Malam Berbahaya di Rumah Maeda",
    worldBounds: { width: 2400, height: 600 },
    playerStart: { x: 70, y: 440 },
    theme: {
      skyTop: '#1a237e',
      skyBottom: '#3949ab',
      tileType: 'tile_stone',
      bgType: 'night'
    },
    checkpoint: { x: 1160, y: 420 },
    questionBlock: { x: 1420, y: 300 },
    gate: { x: 2220, y: 410 },
    platforms: [
      { x: 0, y: 500, w: 260, h: 100 },
      { x: 320, y: 460, w: 100, h: 30 },
      { x: 480, y: 420, w: 110, h: 30 },
      { x: 670, y: 490, w: 280, h: 110 },
      { x: 1040, y: 450, w: 160, h: 30 },
      // Area kuis bertingkat
      { x: 1280, y: 410, w: 100, h: 25 },
      { x: 1380, y: 350, w: 110, h: 25 },
      // Jurang berbahaya dengan moving platforms
      { x: 1580, y: 480, w: 130, h: 120 },
      { x: 1840, y: 440, w: 110, h: 30 },
      { x: 2020, y: 460, w: 100, h: 30 },
      // Gerbang akhir
      { x: 2150, y: 500, w: 250, h: 100 }
    ],
    movingPlatforms: [
      { x: 430, y: 450, w: 64, h: 20, rangeX: 45, rangeY: 0, speed: 70 },
      { x: 970, y: 470, w: 64, h: 20, rangeX: 0, rangeY: 45, speed: 65 },
      { x: 1720, y: 440, w: 64, h: 20, rangeX: 60, rangeY: 0, speed: 85 },
      { x: 1950, y: 460, w: 64, h: 20, rangeX: 45, rangeY: 0, speed: 80 }
    ],
    coins: [
      { x: 140, y: 460 },
      { x: 360, y: 420 },
      { x: 520, y: 380 },
      { x: 740, y: 450 },
      { x: 800, y: 450 },
      { x: 1080, y: 400 },
      { x: 1420, y: 240 },
      { x: 1620, y: 430 },
      { x: 1880, y: 390 },
      { x: 2050, y: 420 },
      { x: 2180, y: 450 }
    ],
    spikes: [
      { x: 280, y: 580 },
      { x: 720, y: 455 }, // Duri di lantai platform tengah
      { x: 840, y: 455 }, // Duri kedua
      { x: 1220, y: 580 },
      { x: 1520, y: 580 },
      { x: 1780, y: 580 },
      { x: 2100, y: 580 }
    ],
    enemies: [
      { x: 180, y: 465, patrolDist: 40, speed: 65, type: 'regular', hp: 1 },
      { x: 510, y: 385, patrolDist: 35, speed: 75, type: 'regular', hp: 1 },
      { x: 760, y: 455, patrolDist: 50, speed: 85, type: 'elite', hp: 2 },
      { x: 900, y: 455, patrolDist: 45, speed: 70, type: 'regular', hp: 1 },
      { x: 1100, y: 415, patrolDist: 45, speed: 90, type: 'elite', hp: 2 },
      { x: 1310, y: 375, patrolDist: 35, speed: 70, type: 'regular', hp: 1 },
      { x: 1630, y: 445, patrolDist: 40, speed: 85, type: 'elite', hp: 2 },
      { x: 1870, y: 405, patrolDist: 35, speed: 75, type: 'regular', hp: 1 }
    ]
  },

  5: {
    number: 5,
    title: "Level 5: Gerbang Kemerdekaan",
    subtitle: "Ujian Pamungkas Menembus Barikade Penjaga 17 Agustus 1945",
    worldBounds: { width: 2600, height: 600 },
    playerStart: { x: 70, y: 440 },
    theme: {
      skyTop: '#c2185b',
      skyBottom: '#ff8a80',
      tileType: 'tile_stone',
      bgType: 'dawn'
    },
    checkpoint: { x: 1240, y: 410 },
    questionBlock: { x: 1500, y: 280 },
    gate: { x: 2420, y: 390 },
    platforms: [
      { x: 0, y: 500, w: 240, h: 100 },
      // Rangkaian lompatan presisi
      { x: 300, y: 460, w: 100, h: 30 },
      { x: 460, y: 410, w: 100, h: 30 },
      { x: 630, y: 480, w: 180, h: 120 },
      { x: 880, y: 430, w: 110, h: 30 },
      // Platform checkpoint tengah
      { x: 1150, y: 460, w: 170, h: 30 },
      // Menara kuis kemerdekaan terakhir
      { x: 1390, y: 390, w: 80, h: 25 },
      { x: 1470, y: 330, w: 110, h: 25 },
      // Rintangan pamungkas barikade
      { x: 1680, y: 450, w: 110, h: 30 },
      { x: 1890, y: 410, w: 100, h: 30 },
      { x: 2080, y: 460, w: 110, h: 30 },
      // Arena Gerbang Kemerdekaan Agung
      { x: 2280, y: 480, w: 320, h: 120 }
    ],
    movingPlatforms: [
      { x: 570, y: 440, w: 64, h: 20, rangeX: 45, rangeY: 0, speed: 85 },
      { x: 1040, y: 450, w: 64, h: 20, rangeX: 0, rangeY: 45, speed: 75 },
      { x: 1600, y: 420, w: 64, h: 20, rangeX: 55, rangeY: 0, speed: 90 },
      { x: 1810, y: 440, w: 64, h: 20, rangeX: 0, rangeY: 40, speed: 80 },
      { x: 2010, y: 430, w: 64, h: 20, rangeX: 50, rangeY: 0, speed: 85 }
    ],
    coins: [
      { x: 120, y: 460 },
      { x: 340, y: 410 },
      { x: 500, y: 360 },
      { x: 680, y: 440 },
      { x: 740, y: 440 },
      { x: 920, y: 380 },
      { x: 1200, y: 410 },
      { x: 1500, y: 220 }, // Bonus Kuis Pamungkas
      { x: 1720, y: 400 },
      { x: 1930, y: 360 },
      { x: 2120, y: 410 },
      { x: 2320, y: 430 },
      { x: 2370, y: 430 }
    ],
    spikes: [
      { x: 260, y: 580 },
      { x: 660, y: 455 }, // Duri di platform
      { x: 760, y: 455 },
      { x: 1100, y: 580 },
      { x: 1340, y: 580 },
      { x: 1720, y: 425 }, // Duri rintangan atas
      { x: 1840, y: 580 },
      { x: 2130, y: 435 },
      { x: 2230, y: 580 }
    ],
    enemies: [
      { x: 160, y: 465, patrolDist: 40, speed: 75, type: 'regular', hp: 1 },
      { x: 490, y: 375, patrolDist: 35, speed: 85, type: 'regular', hp: 1 },
      { x: 700, y: 445, patrolDist: 45, speed: 95, type: 'elite', hp: 2 },
      { x: 910, y: 395, patrolDist: 40, speed: 80, type: 'regular', hp: 1 },
      { x: 1190, y: 425, patrolDist: 45, speed: 100, type: 'elite', hp: 2 },
      { x: 1420, y: 355, patrolDist: 30, speed: 85, type: 'regular', hp: 1 },
      { x: 1710, y: 415, patrolDist: 40, speed: 95, type: 'elite', hp: 2 },
      { x: 1920, y: 375, patrolDist: 35, speed: 90, type: 'regular', hp: 1 },
      { x: 2110, y: 425, patrolDist: 40, speed: 105, type: 'elite', hp: 2 },
      { x: 2320, y: 445, patrolDist: 50, speed: 110, type: 'elite', hp: 2 }
    ]
  }
};
