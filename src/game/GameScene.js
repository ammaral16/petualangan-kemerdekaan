/**
 * GameScene.js
 * Logika inti permainan platformer 2D Phaser 3.
 * Mengatur level, fisika, kamera, rintangan, musuh, koin,
 * blok kuis interaktif, checkpoint, dan gerbang kemerdekaan.
 */

import { AssetGenerator } from './AssetGenerator.js';
import { Player } from './Player.js';
import { LEVELS } from './LevelManager.js';
import { scoreManager } from './ScoreManager.js';
import { quizManager } from './QuizManager.js';
import { audioManager } from './AudioManager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init(data) {
    this.currentLevelNum = data.level || 1;
    this.levelData = LEVELS[this.currentLevelNum] || LEVELS[1];
    this.isLevelTransitioning = false;
    this.isPausedByQuiz = false;
    this.gateUnlocked = false;
  }

  preload() {
    // Generate semua tekstur orisinal jika belum ada di cache
    AssetGenerator.generateAll(this);
  }

  create() {
    scoreManager.onLevelStart(this.currentLevelNum);
    scoreManager.startTimer();
    this.gateUnlocked = quizManager.isLevelAnswered(this.currentLevelNum);

    // 1. LATAR BELAKANG & LANGIT
    this.createBackground();

    // 2. KELOMPOK PLATFORM STATIK & BERGERAK
    this.createPlatforms();

    // 3. CHECKPOINT & BLOK KUIS
    this.createCheckpoint();
    this.createQuestionBlock();

    // 4. KOIN, DURI & MUSUH
    this.createCoins();
    this.createSpikes();
    this.createEnemies();

    // 5. GERBANG AKHIR & PENGHALANG
    this.createExitGate();

    // 6. PEMAIN (HERO BIMA)
    const startPos = scoreManager.checkpoint || this.levelData.playerStart;
    this.player = new Player(this, startPos.x, startPos.y);

    // 7. KAMERA
    this.cameras.main.setBounds(
      0,
      0,
      this.levelData.worldBounds.width,
      this.levelData.worldBounds.height
    );
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // 8. INPUT KEYBOARD
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,J,F,Z,X,ESC,P');

    // 9. TABRAKAN FISIKA (COLLISIONS & OVERLAPS)
    this.setupCollisions();

    // 10. UPDATE HUD
    this.updateHUD();

    // Keyboard listener untuk tombol jeda (ESC / P)
    this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    this.input.keyboard.on('keydown-P', () => this.pauseGame());

    // Fade in kamera
    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  createBackground() {
    const { width, height } = this.levelData.worldBounds;
    const theme = this.levelData.theme;

    // Gradien Langit
    const bgGraphics = this.add.graphics();
    bgGraphics.fillGradientStyle(
      Phaser.Display.Color.HexStringToColor(theme.skyTop).color,
      Phaser.Display.Color.HexStringToColor(theme.skyTop).color,
      Phaser.Display.Color.HexStringToColor(theme.skyBottom).color,
      Phaser.Display.Color.HexStringToColor(theme.skyBottom).color,
      1
    );
    bgGraphics.fillRect(0, 0, width, height);
    bgGraphics.setScrollFactor(0);

    // Pegunungan Siluet Parallax (Scroll factor 0.2)
    for (let x = 0; x < width + 400; x += 320) {
      const mt = this.add.image(x, height - 160, 'bg_mountain').setOrigin(0, 1);
      mt.setScrollFactor(0.2);
    }

    // Pepohonan / Hutan Parallax (Scroll factor 0.5)
    for (let x = 0; x < width + 300; x += 240) {
      const tr = this.add.image(x, height - 100, 'bg_trees').setOrigin(0, 1);
      tr.setScrollFactor(0.5);
    }

    // Awan Parallax bergerak lambat di langit (Scroll factor 0.3)
    this.clouds = this.add.group();
    for (let x = 60; x < width; x += 280) {
      const y = 50 + (x % 90);
      const cloud = this.add.image(x, y, 'bg_cloud').setScrollFactor(0.3);
      this.clouds.add(cloud);
    }
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    const tileKey = this.levelData.theme.tileType;

    this.levelData.platforms.forEach((p) => {
      // Buat tile platform berulang
      const tilesCount = Math.ceil(p.w / 32);
      for (let i = 0; i < tilesCount; i++) {
        const tx = p.x + i * 32 + 16;
        const ty = p.y + 16;
        const tile = this.platforms.create(tx, ty, tileKey);
        tile.refreshBody();
      }
    });

    // Moving Platforms
    this.movingPlatforms = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    if (this.levelData.movingPlatforms) {
      this.levelData.movingPlatforms.forEach((mp) => {
        const platform = this.movingPlatforms.create(mp.x, mp.y, 'moving_platform');
        platform.body.setFriction(1);

        const tweenConfig = {
          targets: platform,
          duration: (1000 / (mp.speed || 60)) * 100,
          ease: 'Sine.easeInOut',
          yoyo: true,
          repeat: -1
        };

        if (mp.rangeX) tweenConfig.x = mp.x + mp.rangeX;
        if (mp.rangeY) tweenConfig.y = mp.y + mp.rangeY;

        this.tweens.add(tweenConfig);
      });
    }
  }

  createCoins() {
    this.coins = this.physics.add.staticGroup();
    if (this.levelData.coins) {
      this.levelData.coins.forEach((c) => {
        const coin = this.coins.create(c.x, c.y, 'coin_0');
        // Efek putaran koin
        this.tweens.add({
          targets: coin,
          scaleY: 1.1,
          y: c.y - 4,
          duration: 600 + (c.x % 200),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      });
    }
  }

  createSpikes() {
    this.spikes = this.physics.add.staticGroup();
    if (this.levelData.spikes) {
      this.levelData.spikes.forEach((s) => {
        const sp = this.spikes.create(s.x, s.y, 'spike');
        sp.body.setSize(24, 18);
        sp.body.setOffset(4, 6);
        sp.refreshBody();
      });
    }
  }

  createEnemies() {
    this.enemies = this.physics.add.group();
    if (this.levelData.enemies) {
      this.levelData.enemies.forEach((e) => {
        const texKey = e.type === 'elite' ? 'enemy_elite_0' : 'enemy_patrol_0';
        const enemy = this.enemies.create(e.x, e.y, texKey);
        enemy.body.setSize(22, 28);
        enemy.body.setOffset(5, 4);
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1, 0);

        enemy.startX = e.x;
        enemy.patrolDist = e.patrolDist || 60;
        enemy.speed = e.speed || 60;
        enemy.enemyType = e.type || 'regular';
        enemy.hp = e.hp || 1;
        enemy.maxHp = enemy.hp;

        enemy.setVelocityX(enemy.speed);
      });
    }
  }

  createCheckpoint() {
    const cpData = this.levelData.checkpoint;
    if (!cpData) return;

    const isPassed =
      scoreManager.checkpoint &&
      scoreManager.checkpoint.x === cpData.x &&
      scoreManager.checkpoint.y === cpData.y;

    this.checkpointSprite = this.physics.add.staticSprite(
      cpData.x,
      cpData.y,
      isPassed ? 'checkpoint_on' : 'checkpoint_off'
    );
    this.checkpointSprite.isActivated = isPassed;
  }

  createQuestionBlock() {
    const qData = this.levelData.questionBlock;
    if (!qData) return;

    const answered = quizManager.isLevelAnswered(this.currentLevelNum);
    const key = answered ? 'question_block_empty' : 'question_block';

    this.questionBlock = this.physics.add.staticSprite(qData.x, qData.y, key);
    this.questionBlock.isAnswered = answered;

    // Animasi denyut glowing pada blok kuis
    if (!answered) {
      this.tweens.add({
        targets: this.questionBlock,
        scale: 1.08,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Quad.easeInOut'
      });
    }
  }

  createExitGate() {
    const g = this.levelData.gate;
    if (!g) return;

    // Tiang Bendera Pusaka Kemenangan
    this.flagPole = this.physics.add.staticSprite(g.x + 36, g.y - 40, 'flag_pole');

    // Bendera Merah Putih di tiang
    this.flagIndonesia = this.add.image(g.x + 58, g.y - 100, 'flag_indonesia');

    // Gapura Candi Kemerdekaan
    this.gateArch = this.add.image(g.x + 36, g.y - 20, 'gate_arch');

    // Penghalang Gerbang Kuis (Laser Terkunci)
    this.gateBarrier = this.physics.add.staticSprite(g.x, g.y - 10, 'gate_barrier');
    this.gateBarrier.body.setSize(30, 80);

    if (this.gateUnlocked) {
      this.gateBarrier.disableBody(true, true);
    }
  }

  setupCollisions() {
    // Player dengan platform
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms);

    // Musuh dengan platform
    this.physics.add.collider(this.enemies, this.platforms);

    // Player dengan blok kuis
    this.physics.add.collider(this.player, this.questionBlock, (player, block) => {
      this.handleQuestionBlockHit(player, block);
    });

    // Player dengan penghalang gerbang
    this.gateCollider = this.physics.add.collider(this.player, this.gateBarrier);

    // Player mengumpulkan koin
    this.physics.add.overlap(this.player, this.coins, (player, coin) => {
      this.collectCoin(coin);
    });

    // Player mengenai duri
    this.physics.add.overlap(this.player, this.spikes, () => {
      this.handleHazardHit();
    });

    // Player menyentuh checkpoint
    if (this.checkpointSprite) {
      this.physics.add.overlap(this.player, this.checkpointSprite, (player, cp) => {
        this.activateCheckpoint(cp);
      });
    }

    // Player mencapai tiang bendera kemerdekaan
    this.physics.add.overlap(this.player, this.flagPole, () => {
      this.handleReachFinish();
    });

    // Player menyentuh musuh
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      this.handleEnemyCollision(player, enemy);
    });
  }

  update(time) {
    if (this.isLevelTransitioning || this.isPausedByQuiz) return;

    // Update gerakan dan kontrol karakter
    this.player.update(this.cursors, this.keys, time);

    // Update gerakan patroli musuh
    this.enemies.children.iterate((enemy) => {
      if (!enemy || !enemy.active) return;
      const spd = enemy.speed || 60;
      if (enemy.x > enemy.startX + enemy.patrolDist) {
        enemy.setVelocityX(-spd);
        enemy.setFlipX(true);
      } else if (enemy.x < enemy.startX - enemy.patrolDist) {
        enemy.setVelocityX(spd);
        enemy.setFlipX(false);
      }
    });

    // Cek jika pemain jatuh ke jurang (bawah layar)
    if (this.player.y > this.levelData.worldBounds.height + 40) {
      this.handleHazardHit(true);
    }
  }

  // --- INTERAKSI GAMEPLAY ---

  collectCoin(coin) {
    coin.disableBody(true, true);
    audioManager.playCoin();
    scoreManager.addCoin();
    this.updateHUD();

    // Partikel berkilau saat koin diambil
    const emitter = this.add.particles(coin.x, coin.y, 'particle_sparkle', {
      speed: { min: 40, max: 90 },
      scale: { start: 1, end: 0 },
      lifespan: 350,
      quantity: 5
    });
    this.time.delayedCall(400, () => emitter.destroy());
  }

  handleQuestionBlockHit(player, block) {
    if (block.isAnswered || this.isPausedByQuiz) return;

    // Cek jika blok dipukul dari bawah atau disentuh
    this.isPausedByQuiz = true;
    this.player.setVelocity(0, 0);

    // Animasi pantulan blok ke atas
    this.tweens.add({
      targets: block,
      y: block.y - 10,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        this.physics.pause();
        scoreManager.stopTimer();
        // Buka modal kuis interaktif
        window.gameApp.menu.showQuiz(this.currentLevelNum, () => {
          this.physics.resume();
          scoreManager.startTimer();
          this.onQuizCompleted(block);
        });
      }
    });
  }

  onQuizCompleted(block) {
    this.isPausedByQuiz = false;
    block.isAnswered = true;
    block.setTexture('question_block_empty');

    // Buka gerbang kemerdekaan
    this.unlockGate();
    this.updateHUD();
  }

  unlockGate() {
    this.gateUnlocked = true;
    if (this.gateBarrier && this.gateBarrier.active) {
      audioManager.playQuizCorrect();

      // Animasi gerbang terbuka dengan partikel kembang api
      const emitter = this.add.particles(this.gateBarrier.x, this.gateBarrier.y, 'particle_sparkle', {
        speed: { min: 60, max: 150 },
        scale: { start: 1.2, end: 0 },
        lifespan: 600,
        quantity: 16
      });

      this.tweens.add({
        targets: this.gateBarrier,
        alpha: 0,
        y: this.gateBarrier.y - 40,
        duration: 600,
        onComplete: () => {
          this.gateBarrier.disableBody(true, true);
          emitter.destroy();
        }
      });
    }
  }

  activateCheckpoint(cp) {
    if (cp.isActivated) return;
    cp.isActivated = true;
    cp.setTexture('checkpoint_on');
    scoreManager.setCheckpoint(cp.x, cp.y - 10);
    audioManager.playQuizBlock();

    // Notifikasi visual kecil
    const txt = this.add.text(cp.x, cp.y - 30, '🚩 Checkpoint Aktif!', {
      fontSize: '13px',
      fontStyle: 'bold',
      fill: '#ffd54f',
      stroke: '#b71c1c',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.tweens.add({
      targets: txt,
      y: txt.y - 20,
      alpha: 0,
      duration: 1000,
      onComplete: () => txt.destroy()
    });
  }

  handleEnemyCollision(player, enemy) {
    if (player.invulnerable || !enemy.active) return;

    // Cek jika pemain menginjak musuh dari atas
    const isStomp = player.body.velocity.y > 0 && player.y < enemy.y - 12;

    if (isStomp) {
      player.setVelocityY(-320);
      enemy.hp--;

      if (enemy.hp > 0) {
        audioManager.playQuizBlock();
        this.tweens.add({
          targets: enemy,
          tint: 0xff0000,
          duration: 80,
          yoyo: true,
          repeat: 2,
          onComplete: () => enemy.clearTint()
        });
      } else {
        enemy.disableBody(true, true);
        audioManager.playEnemyDefeat();
        const pts = enemy.enemyType === 'elite' ? 50 : 25;
        scoreManager.score += pts;
        this.updateHUD();

        const expEmitter = this.add.particles(enemy.x, enemy.y, 'particle_sparkle', {
          speed: { min: 60, max: 150 },
          scale: { start: 1.4, end: 0 },
          lifespan: 350,
          quantity: 10
        });
        this.time.delayedCall(400, () => expEmitter.destroy());
      }
    } else {
      // Pemain terluka jika bertubrukan dari samping/bawah
      const dir = player.x < enemy.x ? -1 : 1;
      const damaged = player.takeDamage(dir);
      if (damaged) {
        this.processDamage();
      }
    }
  }

  handlePlayerAttack(player) {
    if (!player || !player.active) return;

    const isFacingLeft = player.flipX;
    // Jangkauan hitbox serangan bambu runcing di depan pemain
    const attackBox = {
      x: isFacingLeft ? player.x - 52 : player.x + 4,
      y: player.y - 24,
      width: 48,
      height: 48
    };

    // Efek partikel tebasan
    const slashX = isFacingLeft ? player.x - 26 : player.x + 26;
    const slashEmitter = this.add.particles(slashX, player.y - 5, 'particle_sparkle', {
      speed: { min: 80, max: 150 },
      angle: isFacingLeft ? { min: 140, max: 220 } : { min: -40, max: 40 },
      scale: { start: 1.2, end: 0 },
      lifespan: 200,
      quantity: 6
    });
    this.time.delayedCall(220, () => slashEmitter.destroy());

    // Cek tabrakan serangan dengan musuh
    this.enemies.children.iterate((enemy) => {
      if (!enemy || !enemy.active) return;

      const inX = enemy.x >= attackBox.x && enemy.x <= attackBox.x + attackBox.width;
      const inY = Math.abs(enemy.y - player.y) < 38;

      if (inX && inY) {
        enemy.hp--;

        if (enemy.hp > 0) {
          // Musuh Elite terkena 1 serangan (masih memiliki sisa HP)
          audioManager.playQuizBlock();
          this.tweens.add({
            targets: enemy,
            tint: 0xff1744,
            duration: 80,
            yoyo: true,
            repeat: 2,
            onComplete: () => enemy.clearTint()
          });
          const knockDir = isFacingLeft ? -90 : 90;
          enemy.setVelocityX(knockDir);
        } else {
          // Musuh kalah telak!
          audioManager.playEnemyDefeat();
          const pts = enemy.enemyType === 'elite' ? 50 : 30;
          scoreManager.score += pts;
          this.updateHUD();

          // Efek partikel ledakan
          const expEmitter = this.add.particles(enemy.x, enemy.y, 'particle_sparkle', {
            speed: { min: 70, max: 180 },
            scale: { start: 1.6, end: 0 },
            lifespan: 400,
            quantity: 14
          });
          this.time.delayedCall(450, () => expEmitter.destroy());

          // Teks bonus mengambang
          const txt = this.add.text(enemy.x, enemy.y - 15, `+${pts} Poin!`, {
            fontSize: '13px',
            fontStyle: 'bold',
            fill: '#ffd54f',
            stroke: '#b71c1c',
            strokeThickness: 3
          }).setOrigin(0.5);

          this.tweens.add({
            targets: txt,
            y: txt.y - 28,
            alpha: 0,
            duration: 800,
            onComplete: () => txt.destroy()
          });

          enemy.disableBody(true, true);
        }
      }
    });
  }

  handleHazardHit(isFall = false) {
    if (this.player.isHurt && !isFall) return;

    this.player.takeDamage(0);
    this.processDamage(isFall);
  }

  processDamage(isFall = false) {
    const remainingLives = scoreManager.loseLife();
    this.updateHUD();

    if (remainingLives <= 0) {
      // Game Over
      this.player.isDead = true;
      this.player.setVelocity(0, 0);
      this.time.delayedCall(400, () => {
        window.gameApp.menu.showGameOver();
      });
    } else if (isFall) {
      // Jika jatuh ke jurang, respawn di titik aman checkpoint
      const respawnPoint = scoreManager.checkpoint || this.levelData.playerStart;
      this.player.setPosition(respawnPoint.x, respawnPoint.y);
      this.player.setVelocity(0, 0);
    }
  }

  handleReachFinish() {
    if (this.isLevelTransitioning) return;

    // Jika kuis belum dijawab, pemain belum boleh selesai
    if (!quizManager.isLevelAnswered(this.currentLevelNum)) {
      this.showQuizReminder();
      return;
    }

    this.isLevelTransitioning = true;
    this.player.celebrate();
    audioManager.playLevelComplete();

    // Naikkan bendera Merah Putih ke puncak tiang
    this.tweens.add({
      targets: this.flagIndonesia,
      y: this.flagPole.y - 50,
      duration: 1000,
      ease: 'Quad.easeOut'
    });

    scoreManager.completeLevel();
    this.updateHUD();

    // Cek apakah ini level ke-5 (Puncak Permainan)
    if (this.currentLevelNum >= 5) {
      scoreManager.completeGame();
      this.time.delayedCall(1500, () => {
        this.cameras.main.fadeOut(800, 255, 255, 255);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          window.gameApp.showVictoryScreen();
        });
      });
    } else {
      // Pindah ke Level Berikutnya
      this.time.delayedCall(1500, () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.restart({ level: this.currentLevelNum + 1 });
        });
      });
    }
  }

  showQuizReminder() {
    const reminder = this.add.text(
      this.player.x,
      this.player.y - 50,
      '⚠️ Cari & Jawab Blok Kuis [?] Dahulu!',
      {
        fontSize: '14px',
        fontStyle: 'bold',
        fill: '#ffd54f',
        stroke: '#b71c1c',
        strokeThickness: 3
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: reminder,
      y: reminder.y - 25,
      alpha: 0,
      duration: 1500,
      onComplete: () => reminder.destroy()
    });
  }

  spawnDust(x, y) {
    const emitter = this.add.particles(x, y, 'particle_dust', {
      speed: { min: 10, max: 30 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      lifespan: 250,
      quantity: 3
    });
    this.time.delayedCall(300, () => emitter.destroy());
  }

  updateHUD() {
    if (window.gameApp && window.gameApp.hud) {
      window.gameApp.hud.update(
        this.currentLevelNum,
        this.levelData.title,
        scoreManager.score,
        scoreManager.coins,
        scoreManager.lives,
        quizManager.isLevelAnswered(this.currentLevelNum)
      );
    }
  }

  pauseGame() {
    if (this.isLevelTransitioning || this.isPausedByQuiz) return;
    this.physics.pause();
    scoreManager.stopTimer();
    window.gameApp.menu.showPauseModal();
  }

  resumeGame() {
    this.physics.resume();
    scoreManager.startTimer();
  }

  confirmReturnHome() {
    this.physics.pause();
    scoreManager.stopTimer();
    window.gameApp.menu.showConfirmHome();
  }
}
