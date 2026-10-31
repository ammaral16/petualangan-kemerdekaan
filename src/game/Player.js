/**
 * Player.js
 * Logika karakter petualang pejuang kemerdekaan (Bima).
 * Mengatur pergerakan fisik, animasi, coyote-time, jump buffering,
 * dan status invulnerability.
 */

import { audioManager } from './AudioManager.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero_idle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Konfigurasi physics hitbox (sedikit lebih ramping untuk kontrol yang presisi)
    this.body.setSize(22, 42);
    this.body.setOffset(5, 6);
    this.setCollideWorldBounds(false); // World bounds dikontrol oleh level bounds

    // Kecepatan gerak & loncat
    this.SPEED = 220;
    this.JUMP_FORCE = -460;

    // Status gerakan
    this.isHurt = false;
    this.isDead = false;
    this.isVictory = false;
    this.isAttacking = false;
    this.lastAttackTime = 0;
    this.attackCooldown = 320; // ms

    // Coyote Time & Jump Buffer
    this.coyoteTime = 120; // ms
    this.lastTimeOnGround = 0;
    this.jumpBufferTime = 120; // ms
    this.lastJumpPressed = 0;

    // Input virtual untuk mobile
    this.virtualInput = {
      left: false,
      right: false,
      jump: false,
      attack: false
    };

    // Buat animasi pemain jika belum terdaftar
    this.createAnimations(scene);
  }

  createAnimations(scene) {
    if (!scene.anims.exists('hero-idle')) {
      scene.anims.create({
        key: 'hero-idle',
        frames: [{ key: 'hero_idle' }],
        frameRate: 1
      });
    }

    if (!scene.anims.exists('hero-run')) {
      scene.anims.create({
        key: 'hero-run',
        frames: [
          { key: 'hero_run_0' },
          { key: 'hero_run_1' },
          { key: 'hero_run_2' },
          { key: 'hero_run_3' }
        ],
        frameRate: 10,
        repeat: -1
      });
    }

    if (!scene.anims.exists('hero-jump')) {
      scene.anims.create({
        key: 'hero-jump',
        frames: [{ key: 'hero_jump' }],
        frameRate: 1
      });
    }

    if (!scene.anims.exists('hero-fall')) {
      scene.anims.create({
        key: 'hero-fall',
        frames: [{ key: 'hero_fall' }],
        frameRate: 1
      });
    }

    if (!scene.anims.exists('hero-hurt')) {
      scene.anims.create({
        key: 'hero-hurt',
        frames: [{ key: 'hero_hurt' }],
        frameRate: 1
      });
    }

    if (!scene.anims.exists('hero-attack')) {
      scene.anims.create({
        key: 'hero-attack',
        frames: [{ key: 'hero_attack' }],
        frameRate: 1
      });
    }

    if (!scene.anims.exists('hero-victory')) {
      scene.anims.create({
        key: 'hero-victory',
        frames: [{ key: 'hero_victory' }],
        frameRate: 1
      });
    }
  }

  update(cursors, keys, time) {
    if (this.isDead || this.isVictory) return;

    // Jika sedang knockback terkena musuh, tunggu hingga selesai
    if (this.isHurt && this.body.velocity.y === 0 && this.body.blocked.down) {
      this.isHurt = false;
      this.clearTint();
    }

    const onGround = this.body.blocked.down || this.body.touching.down;
    if (onGround) {
      this.lastTimeOnGround = time;
    }

    // Input pembacaan Keyboard + Virtual Touch
    const left = cursors.left.isDown || keys.A.isDown || this.virtualInput.left;
    const right = cursors.right.isDown || keys.D.isDown || this.virtualInput.right;
    const jumpJustDown =
      Phaser.Input.Keyboard.JustDown(cursors.up) ||
      Phaser.Input.Keyboard.JustDown(cursors.space) ||
      Phaser.Input.Keyboard.JustDown(keys.W) ||
      this.virtualInput.jump;

    // Reset single-frame virtual jump
    if (this.virtualInput.jump) {
      this.virtualInput.jump = false;
    }

    if (jumpJustDown) {
      this.lastJumpPressed = time;
    }

    // Input Serangan (Bambu Runcing)
    const attackJustDown =
      (keys.J && Phaser.Input.Keyboard.JustDown(keys.J)) ||
      (keys.F && Phaser.Input.Keyboard.JustDown(keys.F)) ||
      (keys.Z && Phaser.Input.Keyboard.JustDown(keys.Z)) ||
      this.virtualInput.attack;

    if (this.virtualInput.attack) {
      this.virtualInput.attack = false;
    }

    if (attackJustDown && time - this.lastAttackTime > this.attackCooldown && !this.isHurt) {
      this.executeAttack(time);
    }

    // Pergerakan Horisontal (jika tidak sedang knockback parah)
    if (!this.isHurt) {
      if (left) {
        this.setVelocityX(-this.SPEED);
        this.setFlipX(true);
      } else if (right) {
        this.setVelocityX(this.SPEED);
        this.setFlipX(false);
      } else {
        this.setVelocityX(0);
      }
    }

    // Melompat dengan Coyote Time & Jump Buffering
    const canCoyoteJump = time - this.lastTimeOnGround <= this.coyoteTime;
    const hasBufferedJump = time - this.lastJumpPressed <= this.jumpBufferTime;

    if (hasBufferedJump && canCoyoteJump && !this.isHurt) {
      this.setVelocityY(this.JUMP_FORCE);
      this.lastTimeOnGround = 0;
      this.lastJumpPressed = 0;
      audioManager.playJump();

      // Buat partikel debu lompat
      if (this.scene && this.scene.spawnDust) {
        this.scene.spawnDust(this.x, this.y + 20);
      }
    }

    // Pemilihan Animasi
    if (this.isHurt) {
      this.anims.play('hero-hurt', true);
    } else if (this.isAttacking) {
      this.anims.play('hero-attack', true);
    } else if (!onGround) {
      if (this.body.velocity.y < -30) {
        this.anims.play('hero-jump', true);
      } else {
        this.anims.play('hero-fall', true);
      }
    } else {
      if (Math.abs(this.body.velocity.x) > 10) {
        this.anims.play('hero-run', true);
      } else {
        this.anims.play('hero-idle', true);
      }
    }
  }

  executeAttack(time) {
    this.isAttacking = true;
    this.lastAttackTime = time;
    audioManager.playAttack();
    this.anims.play('hero-attack', true);

    // Kirim sinyal serang ke scene
    if (this.scene && this.scene.handlePlayerAttack) {
      this.scene.handlePlayerAttack(this);
    }

    // Kembalikan status serang setelah animasi selesai
    this.scene.time.delayedCall(220, () => {
      this.isAttacking = false;
    });
  }

  takeDamage(knockbackX = 0) {
    if (this.isHurt || this.invulnerable || this.isDead || this.isVictory) return false;

    this.isHurt = true;
    this.invulnerable = true;
    audioManager.playHurt();

    // Knockback pantulan
    this.setVelocity(knockbackX * 180, -250);
    this.anims.play('hero-hurt', true);

    // Efek kelap-kelip invulnerable selama 1.5 detik
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 120,
      yoyo: true,
      repeat: 6,
      onComplete: () => {
        this.alpha = 1;
        this.invulnerable = false;
        this.isHurt = false;
      }
    });

    return true;
  }

  celebrate() {
    this.isVictory = true;
    this.setVelocity(0, 0);
    this.anims.play('hero-victory', true);
  }

  setVirtualInput(key, state) {
    if (this.virtualInput.hasOwnProperty(key)) {
      this.virtualInput[key] = state;
    }
  }
}

