/**
 * ScoreManager.js
 * Mengelola skor, koin, nyawa, progres level, dan timer permainan.
 */

export class ScoreManager {
  constructor() {
    this.resetAll();
  }

  resetAll() {
    this.currentLevel = 1;
    this.totalLevels = 5;
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.maxLives = 3;
    this.elapsedTime = 0; // dalam detik
    this.timerInterval = null;

    // Statistik kuis
    this.quizAnswers = {}; // { levelNum: { correct: true, firstTry: true, attempts: 1 } }
    this.totalQuizzesCorrect = 0;

    // Checkpoint
    this.checkpoint = null; // { x, y }

    // Simpan skor awal tiap level agar bisa di-reset dengan adil jika restart level
    this.levelStartScore = 0;
    this.levelStartCoins = 0;
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.elapsedTime++;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds = this.elapsedTime) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onLevelStart(levelNum) {
    this.currentLevel = levelNum;
    this.checkpoint = null;
    this.levelStartScore = this.score;
    this.levelStartCoins = this.coins;
  }

  addCoin() {
    this.coins++;
    this.score += 10;
    return { score: this.score, coins: this.coins };
  }

  recordQuizResult(levelNum, isFirstTry) {
    if (!this.quizAnswers[levelNum]) {
      this.quizAnswers[levelNum] = {
        correct: true,
        firstTry: isFirstTry,
        attempts: isFirstTry ? 1 : 2
      };
      this.totalQuizzesCorrect++;

      const points = isFirstTry ? 100 : 50;
      this.score += points;
      return points;
    }
    return 0; // Pertanyaan sudah pernah dijawab, tidak ada poin ganda
  }

  completeLevel() {
    this.score += 50;
    return this.score;
  }

  completeGame() {
    this.score += 200; // Bonus menyelesaikan 5 level
    this.stopTimer();

    // Simpan rekor skor tertinggi
    try {
      const high = parseInt(localStorage.getItem('petualangan_highscore') || '0', 10);
      if (this.score > high) {
        localStorage.setItem('petualangan_highscore', this.score.toString());
      }
    } catch (e) {}

    return this.score;
  }

  loseLife() {
    this.lives = Math.max(0, this.lives - 1);
    return this.lives;
  }

  resetLives() {
    this.lives = this.maxLives;
  }

  setCheckpoint(x, y) {
    this.checkpoint = { x, y };
  }

  restartLevelScore() {
    // Kembalikan skor dan koin ke titik awal level agar tidak dieksploitasi
    this.score = this.levelStartScore;
    this.coins = this.levelStartCoins;
    this.lives = this.maxLives;
    this.checkpoint = null;
  }
}

export const scoreManager = new ScoreManager();

