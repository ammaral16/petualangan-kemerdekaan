/**
 * VictoryFrame.js
 * Merender Piagam Kemenangan & Bingkai Foto Pahlawan Kemerdekaan
 * beresolusi tinggi (1200 x 800) menggunakan Canvas API murni.
 */

export class VictoryFrame {
  /**
   * Menghasilkan Canvas Bingkai Kemenangan lengkap
   * @param {Object} data { playerName, score, coins, quizzesCorrect, time, photoDataUrl }
   * @returns {Promise<HTMLCanvasElement>}
   */
  static async createCertificate(data) {
    const W = 1200;
    const H = 800;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 1. LATAR BELAKANG PIAGAM (Krem Kertas Bersejarah Mewah)
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 700);
    bgGrad.addColorStop(0, '#fffdfa');
    bgGrad.addColorStop(0.7, '#fef9e7');
    bgGrad.addColorStop(1, '#faecd5');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Tekstur border ornamen luar (Merah & Putih Indonesia)
    ctx.fillStyle = '#b71c1c'; // Merah tua elegan
    ctx.fillRect(0, 0, W, 24); // Atas
    ctx.fillRect(0, H - 24, W, 24); // Bawah
    ctx.fillRect(0, 0, 24, H); // Kiri
    ctx.fillRect(W - 24, 0, 24, H); // Kanan

    // Garis Emas Ganda
    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    ctx.strokeStyle = '#c62828';
    ctx.lineWidth = 2;
    ctx.strokeRect(38, 38, W - 76, H - 76);

    // Ornamen Sudut Khas Batik Geometris di 4 Sudut
    const drawCornerOrnament = (cx, cy) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = '#ffd54f';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#c62828';
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      // Bintang sudut
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', 0, 0);
      ctx.restore();
    };

    drawCornerOrnament(42, 42);
    drawCornerOrnament(W - 42, 42);
    drawCornerOrnament(42, H - 42);
    drawCornerOrnament(W - 42, H - 42);

    // 2. HEADER: PITA MERAH PUTIH & GARUDA / LAMBANG
    // Pita Merah Putih Atas
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(W / 2 - 180, 48, 360, 14);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(W / 2 - 180, 62, 360, 14);
    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 2;
    ctx.strokeRect(W / 2 - 180, 48, 360, 28);

    ctx.fillStyle = '#b71c1c';
    ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '4px';
    ctx.fillText('★ REPUBLIK INDONESIA 1945 ★', W / 2, 67);

    // 3. JUDUL UTAMA
    ctx.fillStyle = '#b71c1c';
    ctx.font = '900 34px "Segoe UI", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('PIAGAM PENGHARGAAN PAHLAWAN', W / 2, 125);

    ctx.fillStyle = '#5d4037';
    ctx.font = 'bold 18px "Segoe UI", sans-serif';
    ctx.fillText('PETUALANGAN MENUJU KEMERDEKAAN INDONESIA', W / 2, 155);

    // Garis hias pemisah
    ctx.strokeStyle = '#ffb300';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 250, 170);
    ctx.lineTo(W / 2 + 250, 170);
    ctx.stroke();

    ctx.fillStyle = '#6d4c41';
    ctx.font = 'italic 16px "Segoe UI", Georgia, serif';
    ctx.fillText('Dengan penuh rasa bangga dan kehormatan diberikan kepada:', W / 2, 200);

    // 4. NAMA PEMAIN
    const pName = (data.playerName || 'Pahlawan Indonesia').trim();
    ctx.fillStyle = '#b71c1c';
    ctx.font = '900 38px "Segoe UI", Arial, sans-serif';
    ctx.fillText(pName.toUpperCase(), W / 2, 245);

    // 5. AREA FOTO PEMAIN & STATISTIK PENCAPAIAN
    // Frame Foto di Sisi Kiri
    const photoX = 140;
    const photoY = 280;
    const photoW = 280;
    const photoH = 280;

    // Bingkai Foto Emas & Merah Putih
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(photoX - 6, photoY - 6, photoW + 12, photoH + 12);
    ctx.strokeStyle = '#ffd54f';
    ctx.lineWidth = 6;
    ctx.strokeRect(photoX - 8, photoY - 8, photoW + 16, photoH + 16);

    // Gambar Foto Pemain jika ada
    let photoDrawn = false;
    if (data.photoDataUrl) {
      try {
        const img = await this.loadImage(data.photoDataUrl);
        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoW, photoH);
        ctx.clip();

        // Fit cover
        const scale = Math.max(photoW / img.width, photoH / img.height);
        const nw = img.width * scale;
        const nh = img.height * scale;
        const nx = photoX + (photoW - nw) / 2;
        const ny = photoY + (photoH - nh) / 2;
        ctx.drawImage(img, nx, ny, nw, nh);
        ctx.restore();
        photoDrawn = true;
      } catch (e) {
        console.warn('Gagal memuat foto pemain:', e);
      }
    }

    if (!photoDrawn) {
      // Gambar Avatar Default Petualang Kemerdekaan jika tidak menggunakan kamera
      ctx.fillStyle = '#e0f2f1';
      ctx.fillRect(photoX, photoY, photoW, photoH);

      // Gambar siluet avatar pejuang
      ctx.fillStyle = '#b71c1c';
      ctx.beginPath();
      ctx.arc(photoX + photoW / 2, photoY + 110, 55, 0, Math.PI * 2);
      ctx.fill();

      // Ikat kepala putih
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(photoX + photoW / 2 - 55, photoY + 80, 110, 16);

      // Badan
      ctx.fillStyle = '#5d4037';
      ctx.beginPath();
      ctx.arc(photoX + photoW / 2, photoY + 280, 90, Math.PI, 0);
      ctx.fill();

      ctx.fillStyle = '#2e7d32';
      ctx.font = 'bold 16px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AVATAR PEJUANG', photoX + photoW / 2, photoY + photoH - 20);
    }

    // Label di bawah foto
    ctx.fillStyle = '#d32f2f';
    ctx.font = 'bold 14px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FOTO PAHLAWAN SEBENARNYA', photoX + photoW / 2, photoY + photoH + 26);

    // 6. TEKS PENCAPAIAN DI SISI KANAN
    const textStartX = 480;

    ctx.fillStyle = '#37474f';
    ctx.font = '500 18px "Segoe UI", sans-serif';
    ctx.textAlign = 'left';

    const achievementText1 = 'Guru adalah pahlawan tanpa tanda jasa';
    const achievementText2 = 'Pengabdian tulus mereka mencerdaskan masa depan bangsa.';
    ctx.fillText(achievementText1, textStartX, 305);
    ctx.fillText(achievementText2, textStartX, 335);

    // 7. KOTAK STATISTIK HASIL PERMAINAN
    const statsBoxY = 370;
    const statsBoxW = 560;
    const statsBoxH = 180;

    // Background kotak statistik
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(textStartX, statsBoxY, statsBoxW, statsBoxH);
    ctx.strokeStyle = '#ffe082';
    ctx.lineWidth = 2;
    ctx.strokeRect(textStartX, statsBoxY, statsBoxW, statsBoxH);

    // Header statistik
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(textStartX, statsBoxY, statsBoxW, 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('REKAPITULASI PRESTASI PETUALANGAN', textStartX + statsBoxW / 2, statsBoxY + 23);

    // Data Statistik 2x2 Grid
    const statItems = [
      { label: '🏆 Total Skor Akhir', val: `${data.score || 0} Poin` },
      { label: '🪙 Koin Terkumpul', val: `${data.coins || 0} Koin` },
      { label: '📚 Kuis Sejarah Terjawab', val: `${data.quizzesCorrect || 5}/5 Soal` },
      { label: '⏱️ Waktu Selesai', val: data.time || '00:00' }
    ];

    ctx.textAlign = 'left';
    statItems.forEach((st, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const ix = textStartX + 25 + col * 270;
      const iy = statsBoxY + 75 + row * 60;

      ctx.fillStyle = '#546e7a';
      ctx.font = '13px "Segoe UI", sans-serif';
      ctx.fillText(st.label, ix, iy);

      ctx.fillStyle = '#b71c1c';
      ctx.font = '900 20px "Segoe UI", Arial, sans-serif';
      ctx.fillText(st.val, ix, iy + 25);
    });

    // 8. CAP STEMPEL RESMI EMAS & MERAH PUTIH (Di Sudut Kanan Bawah)
    const sealX = W - 180;
    const sealY = H - 140;

    // Pita stempel
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(sealX - 45, sealY + 20, 30, 70);
    ctx.fillRect(sealX + 15, sealY + 20, 30, 70);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(sealX - 35, sealY + 20, 10, 70);
    ctx.fillRect(sealX + 25, sealY + 20, 10, 70);

    // Lingkaran Stempel Emas
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 52, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#c62828';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 46, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#b71c1c';
    ctx.font = 'bold 9px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TERVERIFIKASI', sealX, sealY - 22);
    ctx.font = '900 10px "Segoe UI", sans-serif';
    ctx.fillText('PAHLAWAN', sealX, sealY - 4);
    ctx.fillText('SEJATI', sealX, sealY + 12);
    ctx.font = 'bold 6px "Segoe UI", sans-serif';

    // 9. TANGGAL & TANDA TANGAN DI SEBELAH STEMPEL
    const today = new Date();
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = today.toLocaleDateString('id-ID', dateOptions);

    ctx.fillStyle = '#455a64';
    ctx.font = '14px "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Yogyakarta, ${dateStr}`, textStartX, 620);
    ctx.fillText('Calon Guru Hebat Indonesia', textStartX, 642);

    // Garis tanda tangan
    ctx.strokeStyle = '#90a4ae';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(textStartX, 710);
    ctx.lineTo(textStartX + 260, 710);
    ctx.stroke();

    ctx.fillStyle = '#263238';
    ctx.font = 'bold 14px "Segoe UI", sans-serif';
    ctx.fillText('Tim Game Edukasi Kemerdekaan', textStartX, 730);

    return canvas;
  }

  static loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  }

  /**
   * Mengunduh canvas sebagai file PNG
   * @param {HTMLCanvasElement} canvas
   * @param {string} fileName
   */
  static downloadCanvas(canvas, fileName = 'Piagam-Pahlawan-Kemerdekaan.png') {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    }, 'image/png');
  }
}

