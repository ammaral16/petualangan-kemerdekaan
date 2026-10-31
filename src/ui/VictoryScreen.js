/**
 * VictoryScreen.js
 * Mengelola Layar Kemenangan setelah Level 5 tuntas, integrasi kamera WebRTC,
 * pembuatan Piagam Kemenangan, dan pengunduhan file gambar lokal.
 */

import { cameraCapture } from '../camera/CameraCapture.js';
import { VictoryFrame } from '../camera/VictoryFrame.js';
import { scoreManager } from '../game/ScoreManager.js';
import { audioManager } from '../game/AudioManager.js';

export class VictoryScreen {
  constructor(appController) {
    this.app = appController;

    // Elemen Layar Kemenangan
    this.screenElement = document.getElementById('screen-victory');
    this.statScore = document.getElementById('victory-stat-score');
    this.statCoins = document.getElementById('victory-stat-coins');
    this.statQuizzes = document.getElementById('victory-stat-quizzes');
    this.statTime = document.getElementById('victory-stat-time');

    // Tombol di layar kemenangan
    this.btnOpenPhotoModal = document.getElementById('btn-victory-photo');
    this.btnPlayAgain = document.getElementById('btn-victory-play-again');
    this.btnVictoryHome = document.getElementById('btn-victory-home');

    // Elemen Modal Foto & Kamera
    this.modalCamera = document.getElementById('modal-camera');
    this.inputPlayerName = document.getElementById('input-player-name');
    this.videoElement = document.getElementById('camera-video');
    this.cameraPreviewArea = document.getElementById('camera-preview-area');
    this.cameraMessage = document.getElementById('camera-message');

    this.btnStartCamera = document.getElementById('btn-camera-start');
    this.btnSnapPhoto = document.getElementById('btn-camera-snap');
    this.btnRetakePhoto = document.getElementById('btn-camera-retake');
    this.btnUsePhoto = document.getElementById('btn-camera-use');
    this.btnUseAvatar = document.getElementById('btn-camera-use-avatar');
    this.btnCloseCamera = document.getElementById('btn-close-camera');

    // Elemen Hasil Sertifikat & Unduhan
    this.certificateArea = document.getElementById('victory-certificate-preview');
    this.certificateImg = document.getElementById('img-certificate-preview');
    this.btnDownloadCertificate = document.getElementById('btn-download-certificate');

    this.currentPhotoData = null;
    this.generatedCertificateCanvas = null;

    this.setupListeners();
  }

  setupListeners() {
    // Tombol Ambil Foto Kemenangan (HANYA meminta izin ketika tombol ini ditekan)
    if (this.btnOpenPhotoModal) {
      this.btnOpenPhotoModal.onclick = () => {
        this.openPhotoModal();
      };
    }

    // Tombol Main Lagi
    if (this.btnPlayAgain) {
      this.btnPlayAgain.onclick = () => {
        this.hide();
        this.app.startNewGame();
      };
    }

    // Tombol Kembali ke Menu Utama
    if (this.btnVictoryHome) {
      this.btnVictoryHome.onclick = () => {
        this.hide();
        this.app.returnToMainMenu();
      };
    }

    // Kamera: Mulai Streaming
    if (this.btnStartCamera) {
      this.btnStartCamera.onclick = async () => {
        await this.handleStartCamera();
      };
    }

    // Kamera: Jepret Foto
    if (this.btnSnapPhoto) {
      this.btnSnapPhoto.onclick = () => {
        this.handleSnapPhoto();
      };
    }

    // Kamera: Foto Ulang
    if (this.btnRetakePhoto) {
      this.btnRetakePhoto.onclick = async () => {
        this.handleRetakePhoto();
      };
    }

    // Kamera: Konfirmasi Gunakan Foto Ini
    if (this.btnUsePhoto) {
      this.btnUsePhoto.onclick = async () => {
        await this.generateCertificateWithPhoto(this.currentPhotoData);
      };
    }

    // Gunakan Avatar Pejuang (Opsi tanpa webcam)
    if (this.btnUseAvatar) {
      this.btnUseAvatar.onclick = async () => {
        cameraCapture.stopCamera();
        await this.generateCertificateWithPhoto(null);
      };
    }

    // Tutup Modal Kamera
    if (this.btnCloseCamera) {
      this.btnCloseCamera.onclick = () => {
        this.closePhotoModal();
      };
    }

    // Unduh Sertifikat
    if (this.btnDownloadCertificate) {
      this.btnDownloadCertificate.onclick = () => {
        if (this.generatedCertificateCanvas) {
          const rawName = (this.inputPlayerName.value || 'Pahlawan').trim();
          const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_');
          VictoryFrame.downloadCanvas(
            this.generatedCertificateCanvas,
            `Piagam-Kemerdekaan-${cleanName}.png`
          );
        }
      };
    }
  }

  show() {
    audioManager.playGameComplete();

    if (this.statScore) this.statScore.textContent = `${scoreManager.score} Poin`;
    if (this.statCoins) this.statCoins.textContent = `${scoreManager.coins} Koin`;
    if (this.statQuizzes) this.statQuizzes.textContent = `${scoreManager.totalQuizzesCorrect}/5 Soal`;
    if (this.statTime) this.statTime.textContent = scoreManager.formatTime();

    if (this.screenElement) {
      this.screenElement.style.display = 'flex';
    }

    // Otomatis buat pratinjau sertifikat dasar dengan avatar pejuang
    this.generateCertificateWithPhoto(null);
  }

  hide() {
    if (this.screenElement) {
      this.screenElement.style.display = 'none';
    }
    this.closePhotoModal();
  }

  openPhotoModal() {
    if (this.modalCamera) {
      this.modalCamera.style.display = 'flex';
      this.resetCameraModalUI();
    }
  }

  closePhotoModal() {
    cameraCapture.stopCamera();
    if (this.modalCamera) {
      this.modalCamera.style.display = 'none';
    }
  }

  resetCameraModalUI() {
    this.currentPhotoData = null;
    this.videoElement.style.display = 'none';
    this.cameraMessage.textContent = 'Klik "Buka Kamera" untuk mengizinkan akses kamera lokal di perangkat Anda.';
    this.cameraMessage.className = 'camera-msg info';

    this.btnStartCamera.style.display = 'inline-block';
    this.btnSnapPhoto.style.display = 'none';
    this.btnRetakePhoto.style.display = 'none';
    this.btnUsePhoto.style.display = 'none';

    // Hapus snapshot canvas lama jika ada
    const oldSnap = document.getElementById('camera-snapshot-canvas');
    if (oldSnap) oldSnap.remove();
  }

  async handleStartCamera() {
    this.cameraMessage.textContent = 'Menghubungkan ke kamera...';
    this.cameraMessage.className = 'camera-msg info';

    try {
      this.videoElement.style.display = 'block';
      await cameraCapture.startCamera(this.videoElement);

      this.cameraMessage.textContent = 'Kamera aktif! Posisikan wajah Anda dan klik "Jepret Foto".';
      this.cameraMessage.className = 'camera-msg success';

      this.btnStartCamera.style.display = 'none';
      this.btnSnapPhoto.style.display = 'inline-block';
    } catch (err) {
      console.warn('Gagal akses kamera:', err);
      this.videoElement.style.display = 'none';
      this.cameraMessage.textContent = `${err.message} Anda tetap bisa membuat Piagam Kemenangan menggunakan Avatar Pejuang!`;
      this.cameraMessage.className = 'camera-msg warning';
      this.btnStartCamera.style.display = 'inline-block';
      this.btnSnapPhoto.style.display = 'none';
    }
  }

  handleSnapPhoto() {
    const photoData = cameraCapture.takeSnapshot();
    if (!photoData) return;

    this.currentPhotoData = photoData;
    this.videoElement.style.display = 'none';

    // Buat elemen gambar preview foto yang dijepret
    let snapImg = document.getElementById('camera-snapshot-canvas');
    if (!snapImg) {
      snapImg = document.createElement('img');
      snapImg.id = 'camera-snapshot-canvas';
      snapImg.className = 'snapshot-preview';
      this.cameraPreviewArea.appendChild(snapImg);
    }
    snapImg.src = photoData;
    snapImg.style.display = 'block';

    this.cameraMessage.textContent = 'Foto berhasil diambil! Klik "Gunakan Foto Ini" atau "Foto Ulang".';
    this.cameraMessage.className = 'camera-msg success';

    this.btnSnapPhoto.style.display = 'none';
    this.btnRetakePhoto.style.display = 'inline-block';
    this.btnUsePhoto.style.display = 'inline-block';
  }

  async handleRetakePhoto() {
    const snapImg = document.getElementById('camera-snapshot-canvas');
    if (snapImg) snapImg.style.display = 'none';

    this.btnRetakePhoto.style.display = 'none';
    this.btnUsePhoto.style.display = 'none';

    await this.handleStartCamera();
  }

  async generateCertificateWithPhoto(photoDataUrl) {
    cameraCapture.stopCamera();

    const playerName = (this.inputPlayerName.value || 'Pahlawan Indonesia').trim();

    const certData = {
      playerName: playerName || 'Pahlawan Indonesia',
      score: scoreManager.score,
      coins: scoreManager.coins,
      quizzesCorrect: scoreManager.totalQuizzesCorrect,
      time: scoreManager.formatTime(),
      photoDataUrl: photoDataUrl
    };

    const canvas = await VictoryFrame.createCertificate(certData);
    this.generatedCertificateCanvas = canvas;

    // Tampilkan di area preview layar kemenangan
    if (this.certificateImg) {
      this.certificateImg.src = canvas.toDataURL('image/png');
    }
    if (this.certificateArea) {
      this.certificateArea.style.display = 'block';
    }
    if (this.btnDownloadCertificate) {
      this.btnDownloadCertificate.style.display = 'inline-block';
    }

    this.closePhotoModal();
  }
}

