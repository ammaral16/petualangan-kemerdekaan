/**
 * CameraCapture.js
 * Mengelola akses kamera pengguna via Web MediaDevices API.
 * Menjamin privasi: kamera HANYA aktif saat diminta, preview lokal,
 * dan seluruh media track dihentikan segera setelah selesai.
 */

export class CameraCapture {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.capturedCanvas = null;
    this.capturedDataUrl = null;
  }

  isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  async startCamera(videoElement) {
    if (!this.isSupported()) {
      throw new Error('Kamera tidak didukung oleh browser ini atau halaman tidak dijalankan di HTTPS/localhost.');
    }

    this.stopCamera(); // Pastikan stream sebelumnya dihentikan

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      this.videoElement = videoElement;
      videoElement.srcObject = this.stream;
      await videoElement.play();
      return true;
    } catch (err) {
      this.stopCamera();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        throw new Error('Izin akses kamera ditolak oleh pengguna.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        throw new Error('Perangkat kamera tidak ditemukan pada sistem ini.');
      } else {
        throw new Error('Gagal mengakses kamera: ' + err.message);
      }
    }
  }

  takeSnapshot() {
    if (!this.videoElement || !this.stream) return null;

    const video = this.videoElement;
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Cermin selfie (flip horisontal) agar terasa natural seperti cermin
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);

    this.capturedCanvas = canvas;
    this.capturedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    return this.capturedDataUrl;
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {}
      });
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  getCapturedImage() {
    return this.capturedDataUrl;
  }

  clear() {
    this.stopCamera();
    this.capturedCanvas = null;
    this.capturedDataUrl = null;
  }
}

export const cameraCapture = new CameraCapture();

