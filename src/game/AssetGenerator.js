/**
 * AssetGenerator.js
 * Menghasilkan aset visual 2D orisinal bernuansa Indonesia langsung melalui Canvas API.
 * 100% orisinal, bebas hak cipta, tajam, dan tidak memerlukan aset eksternal.
 */

export class AssetGenerator {
  static generateAll(scene) {
    this.createHeroTextures(scene);
    this.createTileTextures(scene);
    this.createCollectibleTextures(scene);
    this.createObstacleTextures(scene);
    this.createEnemyTextures(scene);
    this.createGateAndFlagTextures(scene);
    this.createBackgroundTextures(scene);
    this.createParticleTextures(scene);
  }

  // Helper untuk membuat canvas dan mendaftarkan ke Phaser
  static makeCanvas(scene, key, width, height, drawFn) {
    if (scene.textures.exists(key)) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, width, height);
    scene.textures.addCanvas(key, canvas);
  }

  // --- KARAKTER UTAMA: PETUALANG CILIK PEJUANG (BIMA) ---
  static createHeroTextures(scene) {
    const W = 32;
    const H = 48;

    // Helper menggambar karakter petualang
    const drawBaseAdventurer = (ctx, anim = 'idle', frame = 0) => {
      ctx.clearRect(0, 0, W, H);

      // Bayangan kaki
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(W / 2, H - 2, 10, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      let legOffset = 0;
      let armOffset = 0;
      let bodyBob = 0;

      if (anim === 'run') {
        const cycle = [
          { leg: -6, arm: 5, bob: 0 },
          { leg: 0, arm: 0, bob: -2 },
          { leg: 6, arm: -5, bob: 0 },
          { leg: 0, arm: 0, bob: -2 }
        ];
        const c = cycle[frame % 4];
        legOffset = c.leg;
        armOffset = c.arm;
        bodyBob = c.bob;
      } else if (anim === 'jump') {
        bodyBob = -4;
        legOffset = 4;
      } else if (anim === 'fall') {
        bodyBob = 2;
        legOffset = -2;
      }

      const centerY = 24 + bodyBob;

      // 1. KAKI & SEPATU
      ctx.fillStyle = '#2c3e50'; // Celana pendek biru malam
      ctx.fillRect(W / 2 - 8, centerY + 8, 6, 8);
      ctx.fillRect(W / 2 + 2, centerY + 8, 6, 8);

      // Kaki & Sepatu Petualang (Cokelat kulit kuat)
      ctx.fillStyle = '#795548';
      // Kaki Kiri
      ctx.fillRect(W / 2 - 8 - legOffset * 0.4, centerY + 14, 6, 8);
      ctx.fillStyle = '#4e342e'; // Sol sepatu
      ctx.fillRect(W / 2 - 10 - legOffset * 0.5, centerY + 19, 8, 4);

      // Kaki Kanan
      ctx.fillStyle = '#795548';
      ctx.fillRect(W / 2 + 2 + legOffset * 0.4, centerY + 14, 6, 8);
      ctx.fillStyle = '#4e342e';
      ctx.fillRect(W / 2 + 2 + legOffset * 0.5, centerY + 19, 8, 4);

      // 2. BADAN: Kemeja Safari Petualang (Warna khaki/krem bersemangat)
      ctx.fillStyle = '#d7ccc8';
      ctx.fillRect(W / 2 - 9, centerY - 4, 18, 14);

      // Sabuk Cokelat dengan Gesper Emas
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(W / 2 - 9, centerY + 6, 18, 3);
      ctx.fillStyle = '#ffc107'; // Gesper emas
      ctx.fillRect(W / 2 - 2, centerY + 5, 4, 5);

      // Kerah baju merah putih
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(W / 2 - 3, centerY - 4, 3, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(W / 2, centerY - 4, 3, 5);

      // 3. TANGAN
      ctx.fillStyle = '#ffcc80'; // Kulit tangan
      if (anim === 'jump') {
        // Tangan ke atas
        ctx.fillRect(W / 2 - 12, centerY - 10, 4, 10);
        ctx.fillRect(W / 2 + 8, centerY - 10, 4, 10);
      } else {
        // Tangan berayun
        ctx.fillRect(W / 2 - 11 - armOffset * 0.5, centerY - 2, 4, 10);
        ctx.fillRect(W / 2 + 7 + armOffset * 0.5, centerY - 2, 4, 10);
      }

      // 4. KEPALA & WAJAH
      ctx.fillStyle = '#ffcc80'; // Kulit cerah Indonesia
      ctx.beginPath();
      ctx.arc(W / 2, centerY - 10, 9, 0, Math.PI * 2);
      ctx.fill();

      // Rambut Hitam Keren
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.arc(W / 2, centerY - 12, 9.5, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(W / 2 - 9, centerY - 12, 18, 4);

      // IKAT KEPALA MERAH PUTIH (Khas Pejuang Indonesia)
      // Pita Merah (atas)
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(W / 2 - 9.5, centerY - 13, 19, 3);
      // Pita Putih (bawah)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(W / 2 - 9.5, centerY - 10, 19, 3);

      // Ujung Pita Merah Putih berkibar di belakang
      const ribbonWave = Math.sin(frame * 0.8) * 3;
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(W / 2 - 16, centerY - 12 + ribbonWave, 7, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(W / 2 - 16, centerY - 10 + ribbonWave, 7, 2);

      // MATA & SENYUM
      if (anim === 'hurt') {
        // Mata silang saat terkena rintangan
        ctx.strokeStyle = '#d32f2f';
        ctx.lineWidth = 1.5;
        // X kiri
        ctx.beginPath();
        ctx.moveTo(W / 2 - 5, centerY - 9);
        ctx.lineTo(W / 2 - 1, centerY - 5);
        ctx.moveTo(W / 2 - 1, centerY - 9);
        ctx.lineTo(W / 2 - 5, centerY - 5);
        ctx.stroke();
        // X kanan
        ctx.beginPath();
        ctx.moveTo(W / 2 + 1, centerY - 9);
        ctx.lineTo(W / 2 + 5, centerY - 5);
        ctx.moveTo(W / 2 + 5, centerY - 9);
        ctx.lineTo(W / 2 + 1, centerY - 5);
        ctx.stroke();
      } else {
        // Mata hitam ceria dengan kilau putih
        ctx.fillStyle = '#111';
        ctx.fillRect(W / 2 - 4, centerY - 8, 3, 4);
        ctx.fillRect(W / 2 + 2, centerY - 8, 3, 4);
        ctx.fillStyle = '#fff';
        ctx.fillRect(W / 2 - 4, centerY - 8, 1, 1);
        ctx.fillRect(W / 2 + 2, centerY - 8, 1, 1);

        // Senyum ramah
        ctx.strokeStyle = '#c62828';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(W / 2, centerY - 4, 3, 0.2, Math.PI - 0.2);
        ctx.stroke();
      }

      // Pipit merona
      ctx.fillStyle = 'rgba(239, 83, 80, 0.4)';
      ctx.beginPath();
      ctx.arc(W / 2 - 6, centerY - 5, 2, 0, Math.PI * 2);
      ctx.arc(W / 2 + 6, centerY - 5, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    // Buat tekstur idle
    this.makeCanvas(scene, 'hero_idle', W, H, (ctx) => drawBaseAdventurer(ctx, 'idle', 0));

    // Buat 4 frame jalan/lari
    for (let i = 0; i < 4; i++) {
      this.makeCanvas(scene, `hero_run_${i}`, W, H, (ctx) => drawBaseAdventurer(ctx, 'run', i));
    }

    // Buat tekstur lompat & jatuh
    this.makeCanvas(scene, 'hero_jump', W, H, (ctx) => drawBaseAdventurer(ctx, 'jump', 0));
    this.makeCanvas(scene, 'hero_fall', W, H, (ctx) => drawBaseAdventurer(ctx, 'fall', 0));

    // Buat tekstur terkena rintangan (hurt)
    this.makeCanvas(scene, 'hero_hurt', W, H, (ctx) => drawBaseAdventurer(ctx, 'hurt', 0));

    // Tekstur Menyerang dengan Bambu Runcing (Attack)
    this.makeCanvas(scene, 'hero_attack', 48, 48, (ctx) => {
      ctx.save();
      ctx.translate(2, 0);
      drawBaseAdventurer(ctx, 'run', 2);
      ctx.restore();

      // Batang Bambu Runcing menjulur
      ctx.fillStyle = '#c0ca33';
      ctx.beginPath();
      ctx.moveTo(20, 27);
      ctx.lineTo(44, 21);
      ctx.lineTo(44, 24);
      ctx.lineTo(20, 30);
      ctx.closePath();
      ctx.fill();

      // Ujung tajam runcing
      ctx.fillStyle = '#f4ff81';
      ctx.beginPath();
      ctx.moveTo(38, 22);
      ctx.lineTo(48, 20);
      ctx.lineTo(40, 25);
      ctx.closePath();
      ctx.fill();

      // Ikatan Pita Merah Putih
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(26, 24, 4, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(30, 24, 4, 6);

      // Kilatan cahaya tebasan
      ctx.strokeStyle = '#ffd54f';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(42, 23, 11, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    });

    // Tekstur Selebrasi Kemenangan (Mengibarkan Bendera Merah Putih)
    this.makeCanvas(scene, 'hero_victory', 48, 56, (ctx) => {
      // Gambar karakter di sisi kiri
      ctx.save();
      ctx.translate(6, 6);
      drawBaseAdventurer(ctx, 'jump', 0);
      ctx.restore();

      // Tiang bendera di tangan kanan
      ctx.fillStyle = '#ffb300';
      ctx.fillRect(32, 4, 3, 46);

      // Bendera Merah Putih berkibar
      ctx.fillStyle = '#d32f2f'; // Merah
      ctx.fillRect(35, 6, 12, 7);
      ctx.fillStyle = '#ffffff'; // Putih
      ctx.fillRect(35, 13, 12, 7);
      ctx.strokeStyle = '#b0bec5';
      ctx.strokeRect(35, 6, 12, 14);
    });
  }

  // --- TILES & PLATFORM ---
  static createTileTextures(scene) {
    const S = 32;

    // 1. Rumput Hijau Tropis + Tanah Subur (Level 1, 2)
    this.makeCanvas(scene, 'tile_grass', S, S, (ctx) => {
      // Tanah cokelat
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(0, 0, S, S);

      // Tekstur bintik tanah
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(4, 14, 4, 4);
      ctx.fillRect(18, 20, 5, 4);
      ctx.fillRect(8, 24, 3, 3);
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(12, 16, 3, 3);
      ctx.fillRect(24, 22, 4, 3);

      // Lapisan Rumput Atas
      ctx.fillStyle = '#43a047';
      ctx.fillRect(0, 0, S, 9);
      // Sorotan rumput terang
      ctx.fillStyle = '#66bb6a';
      ctx.fillRect(0, 0, S, 3);

      // Rumput bergerigi menjorok ke tanah
      ctx.fillStyle = '#43a047';
      for (let i = 0; i < S; i += 6) {
        ctx.beginPath();
        ctx.moveTo(i, 9);
        ctx.lineTo(i + 3, 13);
        ctx.lineTo(i + 6, 9);
        ctx.fill();
      }
    });

    // 2. Bata Merah Bersejarah (Level 3 - Gedung Bersejarah)
    this.makeCanvas(scene, 'tile_brick', S, S, (ctx) => {
      ctx.fillStyle = '#8d6e63'; // Semen/mortar
      ctx.fillRect(0, 0, S, S);

      // Bata merah terracotta
      ctx.fillStyle = '#b71c1c';
      ctx.fillRect(1, 1, 14, 8);
      ctx.fillRect(17, 1, 14, 8);
      ctx.fillRect(1, 11, 22, 8);
      ctx.fillRect(25, 11, 6, 8);
      ctx.fillRect(1, 21, 12, 9);
      ctx.fillRect(15, 21, 16, 9);

      // Sorotan cahaya pada bata
      ctx.fillStyle = '#e53935';
      ctx.fillRect(1, 1, 14, 2);
      ctx.fillRect(17, 1, 14, 2);
      ctx.fillRect(1, 11, 22, 2);
      ctx.fillRect(15, 21, 16, 2);
    });

    // 3. Batu Andesit Candi / Monumen (Level 4, 5)
    this.makeCanvas(scene, 'tile_stone', S, S, (ctx) => {
      ctx.fillStyle = '#455a64';
      ctx.fillRect(0, 0, S, S);

      // Motif ukiran batu kuno
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, S - 4, S - 4);

      ctx.fillStyle = '#607d8b';
      ctx.fillRect(4, 4, S - 8, 3);

      // Pola relief khas nusantara
      ctx.fillStyle = '#37474f';
      ctx.beginPath();
      ctx.arc(S / 2, S / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Platform Mengambang Kayu Jati / Bambu
    this.makeCanvas(scene, 'moving_platform', 64, 20, (ctx) => {
      // Balok kayu utama
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(0, 0, 64, 20);

      // Serat kayu
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(0, 4, 64, 2);
      ctx.fillRect(0, 10, 64, 2);
      ctx.fillRect(0, 16, 64, 2);

      // Pengikat Merah Putih di kedua sisi
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(4, 0, 4, 20);
      ctx.fillRect(56, 0, 4, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(8, 0, 4, 20);
      ctx.fillRect(52, 0, 4, 20);

      // Lampu penanda navigasi
      ctx.fillStyle = '#ffca28';
      ctx.beginPath();
      ctx.arc(32, 10, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // --- ITEM KOLEKSI & BLOK PERTANYAAN ---
  static createCollectibleTextures(scene) {
    const S = 32;

    // 1. Koin Emas Kemerdekaan (4 Frame Putaran)
    const coinWidths = [18, 12, 5, 12];
    for (let f = 0; f < 4; f++) {
      this.makeCanvas(scene, `coin_${f}`, 24, 24, (ctx) => {
        const cw = coinWidths[f];
        const cx = 12;
        const cy = 12;

        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 2, cw / 2, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Koin Emas
        ctx.fillStyle = '#ffd54f';
        ctx.beginPath();
        ctx.ellipse(cx, cy, cw / 2, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Garis lingkar emas tua
        ctx.strokeStyle = '#ff8f00';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(cx, cy, cw / 2 - 1, 9, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Bintang / Lambang di tengah (jika koin cukup lebar)
        if (cw > 8) {
          ctx.fillStyle = '#ff6f00';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', cx, cy);
        }
      });
    }

    // 2. Blok Pertanyaan [ ? ]
    this.makeCanvas(scene, 'question_block', S, S, (ctx) => {
      // Kotak Emas Berkilau
      const grad = ctx.createLinearGradient(0, 0, S, S);
      grad.addColorStop(0, '#ffe082');
      grad.addColorStop(0.5, '#ffb300');
      grad.addColorStop(1, '#ff8f00');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, S, S);

      // Batas bingkai
      ctx.strokeStyle = '#ff6f00';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, S - 2, S - 2);

      // Sudut Merah Putih
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(2, 2, 4, 4);
      ctx.fillRect(S - 6, 2, 4, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2, S - 6, 4, 4);
      ctx.fillRect(S - 6, S - 6, 4, 4);

      // Tanda Tanya Putih Tebal
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 20px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowOffsetY = 1;
      ctx.shadowBlur = 2;
      ctx.fillText('?', S / 2, S / 2);
    });

    // 3. Blok Pertanyaan Kosong (Sudah Dipukul)
    this.makeCanvas(scene, 'question_block_empty', S, S, (ctx) => {
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, S - 2, S - 2);

      // Baut di 4 sudut
      ctx.fillStyle = '#4e342e';
      ctx.fillRect(3, 3, 3, 3);
      ctx.fillRect(S - 6, 3, 3, 3);
      ctx.fillRect(3, S - 6, 3, 3);
      ctx.fillRect(S - 6, S - 6, 3, 3);
    });
  }

  // --- RINTANGAN & DURI (BAMBU RUNCING) ---
  static createObstacleTextures(scene) {
    // Duri Bambu Runcing Tradisional
    this.makeCanvas(scene, 'spike', 32, 24, (ctx) => {
      // 3 Batang Bambu Runcing
      const spikes = [6, 16, 26];
      spikes.forEach((x, idx) => {
        const height = idx === 1 ? 22 : 18;
        // Batang Bambu Kuning Kecokelatan
        ctx.fillStyle = '#c0ca33';
        ctx.beginPath();
        ctx.moveTo(x - 4, 24);
        ctx.lineTo(x + 4, 24);
        ctx.lineTo(x, 24 - height);
        ctx.closePath();
        ctx.fill();

        // Ujung Tajam yang Dipotong Miring
        ctx.fillStyle = '#e6ee9c';
        ctx.beginPath();
        ctx.moveTo(x, 24 - height);
        ctx.lineTo(x + 3, 24 - height + 8);
        ctx.lineTo(x, 24 - height + 6);
        ctx.closePath();
        ctx.fill();

        // Ikatan Tali Merah Putih di pangkal
        ctx.fillStyle = '#d32f2f';
        ctx.fillRect(x - 4, 20, 8, 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x - 4, 22, 8, 2);
      });
    });
  }

  // --- MUSUH PATROLI (SENTINEL PENJAGA) ---
  static createEnemyTextures(scene) {
    const W = 32;
    const H = 32;

    for (let f = 0; f < 2; f++) {
      this.makeCanvas(scene, `enemy_patrol_${f}`, W, H, (ctx) => {
        const legShift = f === 0 ? 3 : -3;

        // Badan Robot Penjaga Kolonial (Besi Antik)
        ctx.fillStyle = '#37474f';
        ctx.fillRect(6, 6, 20, 16);

        // Pelindung Helm Logam
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(4, 2, 24, 6);

        // Kaca Sensor Mata Merah Menyala
        ctx.fillStyle = '#ff1744';
        ctx.fillRect(8, 9, 16, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(14, 9, 4, 2);

        // Roda Gigi / Baut Samping
        ctx.fillStyle = '#ffb300';
        ctx.beginPath();
        ctx.arc(6, 14, 3, 0, Math.PI * 2);
        ctx.arc(26, 14, 3, 0, Math.PI * 2);
        ctx.fill();

        // Kaki Mekanik Berpatroli
        ctx.fillStyle = '#263238';
        ctx.fillRect(8 + legShift, 22, 5, 8);
        ctx.fillRect(19 - legShift, 22, 5, 8);

        // Sepatu Besi
        ctx.fillStyle = '#102027';
        ctx.fillRect(6 + legShift, 27, 8, 4);
        ctx.fillRect(17 - legShift, 27, 8, 4);
      });
    }

    // Musuh Patroli Elite (Penjaga Baja Lapis Emas - 2 Hit)
    for (let f = 0; f < 2; f++) {
      this.makeCanvas(scene, `enemy_elite_${f}`, W, H, (ctx) => {
        const legShift = f === 0 ? 3 : -3;

        // Badan Besi Hitam Emas
        ctx.fillStyle = '#212121';
        ctx.fillRect(5, 5, 22, 18);

        // Pelindung Bahu Emas Bergerigi
        ctx.fillStyle = '#ffb300';
        ctx.fillRect(2, 4, 6, 8);
        ctx.fillRect(24, 4, 6, 8);

        // Helm Baja Merah
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(4, 1, 24, 7);

        // Kaca Mata Sensor Emas Menyala
        ctx.fillStyle = '#ffd54f';
        ctx.fillRect(8, 8, 16, 5);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(14, 9, 4, 3);

        // Bintang Militer di dada
        ctx.fillStyle = '#ffd54f';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★', 16, 20);

        // Kaki Baja
        ctx.fillStyle = '#37474f';
        ctx.fillRect(8 + legShift, 23, 5, 8);
        ctx.fillRect(19 - legShift, 23, 5, 8);

        ctx.fillStyle = '#ff8f00';
        ctx.fillRect(6 + legShift, 27, 8, 4);
        ctx.fillRect(17 - legShift, 27, 8, 4);
      });
    }
  }

  // --- GERBANG KEMERDEKAAN, BENDERA & CHECKPOINT ---
  static createGateAndFlagTextures(scene) {
    // 1. Tiang Bendera Pusaka Kemenangan
    this.makeCanvas(scene, 'flag_pole', 16, 160, (ctx) => {
      // Tiang Bambu / Baja Putih
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(6, 10, 4, 150);
      ctx.strokeStyle = '#9e9e9e';
      ctx.strokeRect(6, 10, 4, 150);

      // Mahkota Emas Puncak Tiang
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.arc(8, 8, 6, 0, Math.PI * 2);
      ctx.fill();

      // Dudukan Fondasi Tiang Merah Putih
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(1, 148, 14, 6);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(1, 154, 14, 6);
    });

    // 2. Sang Saka Merah Putih
    this.makeCanvas(scene, 'flag_indonesia', 44, 28, (ctx) => {
      // Merah (Atas)
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(0, 0, 44, 14);
      // Putih (Bawah)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 14, 44, 14);

      // Garis tepi tipis agar kontras
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, 44, 28);
    });

    // 3. Gapura Gerbang Kemerdekaan (Candi Bentar Modern)
    this.makeCanvas(scene, 'gate_arch', 72, 120, (ctx) => {
      // Tiang Kiri Gapura
      ctx.fillStyle = '#b71c1c';
      ctx.fillRect(0, 20, 18, 100);
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(2, 22, 14, 96);

      // Tiang Kanan Gapura
      ctx.fillStyle = '#b71c1c';
      ctx.fillRect(54, 20, 18, 100);
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(56, 22, 14, 96);

      // Ornamen Emas Pucuk Gapura
      ctx.fillStyle = '#ffd54f';
      // Pucuk Kiri
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(9, 0);
      ctx.lineTo(18, 20);
      ctx.fill();
      // Pucuk Kanan
      ctx.beginPath();
      ctx.moveTo(54, 20);
      ctx.lineTo(63, 0);
      ctx.lineTo(72, 20);
      ctx.fill();

      // Spanduk Kemerdekaan di atas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(16, 24, 40, 16);
      ctx.fillStyle = '#d32f2f';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('17-08-45', 36, 32);
    });

    // 4. Penghalang Gerbang Kuis (Terkunci sampai soal dijawab)
    this.makeCanvas(scene, 'gate_barrier', 36, 80, (ctx) => {
      // Kisi-kisi energi laser merah transparan
      ctx.fillStyle = 'rgba(211, 47, 47, 0.45)';
      ctx.fillRect(0, 0, 36, 80);

      // Garis laser
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 2;
      for (let y = 10; y < 80; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(36, y);
        ctx.stroke();
      }

      // Gembok Emas Simbol Terkunci
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.arc(18, 40, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff8f00';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Lubang kunci
      ctx.fillStyle = '#37474f';
      ctx.beginPath();
      ctx.arc(18, 38, 2.5, 0, Math.PI * 2);
      ctx.fillRect(17, 38, 2, 6);
      ctx.fill();
    });

    // 5. Checkpoint (Lentera Pejuang)
    // Checkpoint Belum Aktif
    this.makeCanvas(scene, 'checkpoint_off', 20, 32, (ctx) => {
      ctx.fillStyle = '#78909c';
      ctx.fillRect(8, 12, 4, 20); // Tiang abu-abu
      ctx.fillStyle = '#b0bec5';
      ctx.fillRect(4, 4, 12, 10);
    });

    // Checkpoint Sudah Aktif (Bercahaya Emas & Merah Putih)
    this.makeCanvas(scene, 'checkpoint_on', 20, 32, (ctx) => {
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(8, 12, 4, 20);

      // Lentera Emas Menyala
      ctx.fillStyle = '#ffca28';
      ctx.fillRect(4, 4, 12, 10);

      // Pita Merah Putih Terikat
      ctx.fillStyle = '#d32f2f';
      ctx.fillRect(2, 14, 16, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2, 16, 16, 2);
    });
  }

  // --- TEKSTUR LATAR BELAKANG & PARALLAX ---
  static createBackgroundTextures(scene) {
    // 1. Awan Putih Lembut
    this.makeCanvas(scene, 'bg_cloud', 80, 36, (ctx) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(24, 24, 14, 0, Math.PI * 2);
      ctx.arc(42, 16, 16, 0, Math.PI * 2);
      ctx.arc(58, 22, 12, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Siluet Pegunungan Nusantara
    this.makeCanvas(scene, 'bg_mountain', 320, 140, (ctx) => {
      ctx.fillStyle = '#5c6bc0';
      ctx.beginPath();
      ctx.moveTo(0, 140);
      ctx.lineTo(80, 30);
      ctx.lineTo(160, 140);
      ctx.fill();

      ctx.fillStyle = '#7986cb';
      ctx.beginPath();
      ctx.moveTo(110, 140);
      ctx.lineTo(210, 15);
      ctx.lineTo(320, 140);
      ctx.fill();
    });

    // 3. Pepohonan Tropis Siluet
    this.makeCanvas(scene, 'bg_trees', 240, 70, (ctx) => {
      ctx.fillStyle = 'rgba(46, 125, 50, 0.6)';
      for (let x = 15; x < 240; x += 35) {
        ctx.beginPath();
        ctx.arc(x, 40, 18, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  // --- PARTIKEL ---
  static createParticleTextures(scene) {
    // Bintang Kilau
    this.makeCanvas(scene, 'particle_sparkle', 12, 12, (ctx) => {
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.arc(6, 6, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6, 6, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Debu Langkah Kaki
    this.makeCanvas(scene, 'particle_dust', 8, 8, (ctx) => {
      ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
      ctx.beginPath();
      ctx.arc(4, 4, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

