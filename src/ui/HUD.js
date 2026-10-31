/**
 * HUD.js
 * Mengelola tampilan HUD atas (Level, Skor, Koin, Nyawa, Status Kuis)
 * serta Virtual Touch Controls untuk pengguna ponsel/layar sentuh.
 */

export class HUD {
  constructor(gameScene) {
    this.scene = gameScene;
    this.hudElement = document.getElementById('game-hud');
    this.mobileControlsElement = document.getElementById('mobile-controls');

    this.levelBadge = document.getElementById('hud-level-name');
    this.scoreBadge = document.getElementById('hud-score');
    this.coinsBadge = document.getElementById('hud-coins');
    this.livesBadge = document.getElementById('hud-lives');
    this.quizBadge = document.getElementById('hud-quiz-status');
    this.btnPause = document.getElementById('btn-hud-pause');
    this.btnHome = document.getElementById('btn-hud-home');

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (this.btnPause) {
      this.btnPause.onclick = () => {
        if (this.scene && this.scene.pauseGame) {
          this.scene.pauseGame();
        }
      };
    }

    if (this.btnHome) {
      this.btnHome.onclick = () => {
        if (this.scene && this.scene.confirmReturnHome) {
          this.scene.confirmReturnHome();
        }
      };
    }

    this.setupMobileButtons();
  }

  setupMobileButtons() {
    const btnLeft = document.getElementById('btn-touch-left');
    const btnRight = document.getElementById('btn-touch-right');
    const btnJump = document.getElementById('btn-touch-jump');
    const btnAttack = document.getElementById('btn-touch-attack');

    if (!btnLeft || !btnRight || !btnJump) return;

    const bindTouch = (elem, key) => {
      if (!elem) return;
      const handleDown = (e) => {
        e.preventDefault();
        if (this.scene && this.scene.player) {
          this.scene.player.setVirtualInput(key, true);
        }
      };

      const handleUp = (e) => {
        e.preventDefault();
        if (this.scene && this.scene.player) {
          this.scene.player.setVirtualInput(key, false);
        }
      };

      elem.addEventListener('touchstart', handleDown, { passive: false });
      elem.addEventListener('touchend', handleUp, { passive: false });
      elem.addEventListener('touchcancel', handleUp, { passive: false });

      elem.addEventListener('mousedown', handleDown);
      elem.addEventListener('mouseup', handleUp);
      elem.addEventListener('mouseleave', handleUp);
    };

    bindTouch(btnLeft, 'left');
    bindTouch(btnRight, 'right');
    bindTouch(btnJump, 'jump');
    bindTouch(btnAttack, 'attack');
  }

  show() {
    if (this.hudElement) this.hudElement.style.display = 'flex';
    if (this.mobileControlsElement) this.mobileControlsElement.style.display = 'flex';
  }

  hide() {
    if (this.hudElement) this.hudElement.style.display = 'none';
    if (this.mobileControlsElement) this.mobileControlsElement.style.display = 'none';
  }

  update(levelNum, levelTitle, score, coins, lives, isQuizAnswered) {
    if (this.levelBadge) {
      this.levelBadge.textContent = levelTitle || `Level ${levelNum}`;
    }
    if (this.scoreBadge) {
      this.scoreBadge.textContent = `${score}`;
    }
    if (this.coinsBadge) {
      this.coinsBadge.textContent = `${coins}`;
    }
    if (this.livesBadge) {
      const hearts = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 3 - lives));
      this.livesBadge.textContent = hearts;
    }
    if (this.quizBadge) {
      if (isQuizAnswered) {
        this.quizBadge.innerHTML = 'Kuis: <span style="color:#2e7d32">✅ Terbuka</span>';
      } else {
        this.quizBadge.innerHTML = 'Kuis: <span style="color:#d32f2f">❓ Cari Blok</span>';
      }
    }
  }
}

