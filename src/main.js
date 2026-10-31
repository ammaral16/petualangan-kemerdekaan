/**
 * main.js
 * Titik masuk utama aplikasi game "Petualangan Menuju Kemerdekaan Indonesia".
 * Menginisialisasi Phaser 3, sistem HUD, Menu, dan Layar Kemenangan.
 */

import { GameScene } from './game/GameScene.js';
import { HUD } from './ui/HUD.js';
import { Menu } from './ui/Menu.js';
import { VictoryScreen } from './ui/VictoryScreen.js';
import { scoreManager } from './game/ScoreManager.js';
import { quizManager } from './game/QuizManager.js';
import { audioManager } from './game/AudioManager.js';

class GameApp {
  constructor() {
    this.game = null;
    this.hud = null;
    this.menu = null;
    this.victoryScreen = null;

    this.init();
  }

  init() {
    // 1. Inisialisasi UI Controllers
    this.hud = new HUD(null);
    this.menu = new Menu(this);
    this.victoryScreen = new VictoryScreen(this);

    // 2. Konfigurasi Phaser 3 Game
    const config = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 960,
      height: 540,
      backgroundColor: '#81d4fa',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 950 },
          debug: false
        }
      },
      scene: [GameScene]
    };

    this.game = new Phaser.Game(config);

    // Set instance global agar scene dapat berkomunikasi dengan mudah
    window.gameApp = this;

    // Awal: Tampilkan Menu Pembuka
    this.hud.hide();
    this.menu.showStartScreen();
  }

  getGameScene() {
    return this.game.scene.getScene('GameScene');
  }

  startNewGame() {
    scoreManager.resetAll();
    quizManager.resetAll();

    this.hud.show();
    this.victoryScreen.hide();

    const scene = this.getGameScene();
    if (scene && scene.scene.isActive()) {
      scene.scene.restart({ level: 1 });
    } else {
      this.game.scene.start('GameScene', { level: 1 });
    }

    // Sambungkan scene ke HUD
    this.hud.scene = this.getGameScene();
  }

  restartCurrentLevel() {
    scoreManager.restartLevelScore();
    const currentLvl = scoreManager.currentLevel;

    const scene = this.getGameScene();
    if (scene) {
      scene.scene.restart({ level: currentLvl });
    }
  }

  resumeGame() {
    const scene = this.getGameScene();
    if (scene) {
      scene.resumeGame();
    }
  }

  returnToMainMenu() {
    audioManager.stopBGM();
    scoreManager.stopTimer();

    const scene = this.getGameScene();
    if (scene) {
      scene.scene.stop();
    }

    this.hud.hide();
    this.victoryScreen.hide();
    this.menu.showStartScreen();
  }

  showVictoryScreen() {
    this.hud.hide();
    this.victoryScreen.show();
  }
}

// Inisialisasi setelah DOM selesai dimuat
window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
