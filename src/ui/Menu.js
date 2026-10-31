/**
 * Menu.js
 * Mengelola seluruh modal dan menu antarmuka pengguna:
 * Menu Utama, Panduan Bermain, Tentang Game, Panel Kuis,
 * Modal Jeda, Konfirmasi Keluar, dan Game Over.
 */

import { audioManager } from '../game/AudioManager.js';
import { quizManager } from '../game/QuizManager.js';
import { scoreManager } from '../game/ScoreManager.js';

export class Menu {
  constructor(appController) {
    this.app = appController;

    // Elemen modal
    this.screenStart = document.getElementById('screen-start');
    this.modalHowToPlay = document.getElementById('modal-how-to-play');
    this.modalAbout = document.getElementById('modal-about');
    this.modalPause = document.getElementById('modal-pause');
    this.modalConfirmHome = document.getElementById('modal-confirm-home');
    this.modalGameOver = document.getElementById('modal-game-over');
    this.modalQuiz = document.getElementById('modal-quiz');

    // Elemen kuis
    this.quizTitle = document.getElementById('quiz-title');
    this.quizQuestion = document.getElementById('quiz-question');
    this.quizOptionsContainer = document.getElementById('quiz-options');
    this.quizFeedback = document.getElementById('quiz-feedback');
    this.btnQuizContinue = document.getElementById('btn-quiz-continue');

    // Tombol audio
    this.btnToggleAudio = document.getElementById('btn-toggle-audio');

    this.setupListeners();
    this.updateAudioButton();
  }

  setupListeners() {
    // Tombol Mulai Bermain
    const btnStart = document.getElementById('btn-start-game');
    if (btnStart) {
      btnStart.onclick = () => {
        audioManager.ensureContext();
        audioManager.startBGM();
        this.hideAllModals();
        this.app.startNewGame();
      };
    }

    // Tombol Cara Bermain
    const btnHowTo = document.getElementById('btn-how-to-play');
    if (btnHowTo) {
      btnHowTo.onclick = () => {
        this.showModal(this.modalHowToPlay);
      };
    }
    const btnCloseHowTo = document.getElementById('btn-close-how-to');
    if (btnCloseHowTo) {
      btnCloseHowTo.onclick = () => {
        this.hideModal(this.modalHowToPlay);
      };
    }

    // Tombol Tentang Game
    const btnAbout = document.getElementById('btn-about');
    if (btnAbout) {
      btnAbout.onclick = () => {
        this.showModal(this.modalAbout);
      };
    }
    const btnCloseAbout = document.getElementById('btn-close-about');
    if (btnCloseAbout) {
      btnCloseAbout.onclick = () => {
        this.hideModal(this.modalAbout);
      };
    }

    // Tombol Jeda (Pause Modal Actions)
    const btnResume = document.getElementById('btn-pause-resume');
    if (btnResume) {
      btnResume.onclick = () => {
        this.hideModal(this.modalPause);
        this.app.resumeGame();
      };
    }

    const btnRestartLevel = document.getElementById('btn-pause-restart');
    if (btnRestartLevel) {
      btnRestartLevel.onclick = () => {
        this.hideModal(this.modalPause);
        this.app.restartCurrentLevel();
      };
    }

    const btnPauseHome = document.getElementById('btn-pause-home');
    if (btnPauseHome) {
      btnPauseHome.onclick = () => {
        this.hideModal(this.modalPause);
        this.showConfirmHome();
      };
    }

    // Konfirmasi Kembali ke Menu Utama
    const btnConfirmYes = document.getElementById('btn-confirm-home-yes');
    if (btnConfirmYes) {
      btnConfirmYes.onclick = () => {
        this.hideModal(this.modalConfirmHome);
        this.app.returnToMainMenu();
      };
    }
    const btnConfirmNo = document.getElementById('btn-confirm-home-no');
    if (btnConfirmNo) {
      btnConfirmNo.onclick = () => {
        this.hideModal(this.modalConfirmHome);
        this.app.resumeGame();
      };
    }

    // Game Over Actions
    const btnGameOverRetry = document.getElementById('btn-game-over-retry');
    if (btnGameOverRetry) {
      btnGameOverRetry.onclick = () => {
        this.hideModal(this.modalGameOver);
        this.app.restartCurrentLevel();
      };
    }
    const btnGameOverHome = document.getElementById('btn-game-over-home');
    if (btnGameOverHome) {
      btnGameOverHome.onclick = () => {
        this.hideModal(this.modalGameOver);
        this.app.returnToMainMenu();
      };
    }

    // Audio Toggle
    if (this.btnToggleAudio) {
      this.btnToggleAudio.onclick = () => {
        audioManager.ensureContext();
        audioManager.toggleMute();
        this.updateAudioButton();
      };
    }
  }

  updateAudioButton() {
    if (!this.btnToggleAudio) return;
    if (audioManager.isMuted) {
      this.btnToggleAudio.innerHTML = '🔇 Suara: Mati';
      this.btnToggleAudio.classList.add('muted');
    } else {
      this.btnToggleAudio.innerHTML = '🔊 Suara: Nyala';
      this.btnToggleAudio.classList.remove('muted');
    }
  }

  showModal(modalElem) {
    if (modalElem) {
      modalElem.style.display = 'flex';
    }
  }

  hideModal(modalElem) {
    if (modalElem) {
      modalElem.style.display = 'none';
    }
  }

  hideAllModals() {
    [
      this.screenStart,
      this.modalHowToPlay,
      this.modalAbout,
      this.modalPause,
      this.modalConfirmHome,
      this.modalGameOver,
      this.modalQuiz
    ].forEach((m) => {
      if (m) m.style.display = 'none';
    });
  }

  showStartScreen() {
    this.hideAllModals();
    if (this.screenStart) {
      this.screenStart.style.display = 'flex';
    }
    this.updateAudioButton();
  }

  showPauseModal() {
    this.showModal(this.modalPause);
  }

  showConfirmHome() {
    this.showModal(this.modalConfirmHome);
  }

  showGameOver() {
    this.showModal(this.modalGameOver);
  }

  // --- MODAL KUIS INTERAKTIF ---
  showQuiz(levelNum, onAnswerCorrectCallback) {
    const qData = quizManager.getQuestion(levelNum);
    if (!qData) return;

    audioManager.playQuizBlock();

    this.quizTitle.textContent = qData.title;
    this.quizQuestion.textContent = qData.question;
    this.quizFeedback.style.display = 'none';
    this.btnQuizContinue.style.display = 'none';

    // Bersihkan opsi lama
    this.quizOptionsContainer.innerHTML = '';

    qData.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span class="opt-badge">${opt.id}</span> <span class="opt-text">${opt.text}</span>`;

      btn.onclick = () => {
        const result = quizManager.submitAnswer(levelNum, opt.id);
        if (!result) return;

        if (result.isCorrect) {
          // Jawaban Benar
          audioManager.playQuizCorrect();
          btn.classList.add('correct');

          // Nonaktifkan tombol opsi lain
          const allBtns = this.quizOptionsContainer.querySelectorAll('.quiz-option-btn');
          allBtns.forEach((b) => (b.disabled = true));

          const pts = scoreManager.recordQuizResult(levelNum, result.isFirstTry);

          this.quizFeedback.className = 'quiz-feedback feedback-success';
          this.quizFeedback.innerHTML = `
            <strong>${result.feedback}</strong>
            <div style="margin-top:6px; color:#1b5e20;">+${pts} Poin! Gerbang Kemerdekaan Telah Terbuka! 🚩</div>
          `;
          this.quizFeedback.style.display = 'block';

          this.btnQuizContinue.style.display = 'inline-block';
          this.btnQuizContinue.onclick = () => {
            this.hideModal(this.modalQuiz);
            if (onAnswerCorrectCallback) {
              onAnswerCorrectCallback();
            }
          };
        } else {
          // Jawaban Belum Tepat
          audioManager.playQuizWrong();
          btn.classList.add('wrong');
          setTimeout(() => btn.classList.remove('wrong'), 1000);

          this.quizFeedback.className = 'quiz-feedback feedback-error';
          this.quizFeedback.innerHTML = `<strong>${result.feedback}</strong>`;
          this.quizFeedback.style.display = 'block';
        }
      };

      this.quizOptionsContainer.appendChild(btn);
    });

    this.showModal(this.modalQuiz);
  }
}

