# 🇮🇩 Petualangan Menuju Kemerdekaan Indonesia

**Game Platformer Edukasi 2D Berbasis Web Sejarah Kemerdekaan Republik Indonesia 17 Agustus 1945**

---

## 📌 1. Deskripsi Proyek
**Petualangan Menuju Kemerdekaan Indonesia** adalah game platformer 2D interaktif berbasis web yang memadukan petualangan aksi klasik dengan edukasi sejarah perjuangan kemerdekaan bangsa Indonesia. Karakter, lingkungan, aset visual, audio, dan identitas permainan adalah **100% orisinal** dan bebas dari aset berhak cipta pihak ketiga.

Pemain mengendalikan **Bima**, seorang petualang cilik pejuang berikat kepala Merah Putih, yang menjelajahi 5 level bersejarah, menghadapi rintangan duri bambu runcing dan robot penjaga kolonial, mengumpulkan koin emas, serta menjawab soal kuis sejarah kemerdekaan untuk membuka Gerbang Kemerdekaan. Di akhir permainan (Level 5), pemain dapat mengambil foto selfie kemenangan dan mengunduh **Piagam Penghargaan Pahlawan Kemerdekaan (Resolusi Tinggi PNG)** berbingkai Merah Putih resmi.

---

## 🎮 2. Fitur Utama

1. **5 Level Petualangan Bersejarah dengan Kesulitan Bertahap:**
   - **Level 1 — Awal Perjuangan:** Pengenalan mekanika gerak, lompatan, dan pengumpulan koin di alam pedesaan Indonesia.
   - **Level 2 — Menjelang Proklamasi:** Rintangan jurang, platform mengambang, dan robot penjaga di Hutan Rengasdengklok.
   - **Level 3 — Merumuskan Kemerdekaan:** Platform bertingkat bata merah bersejarah dan musuh patroli.
   - **Level 4 — Semangat Perjuangan:** Tantangan malam di Kediaman Laksamana Maeda dengan platform bergerak dan duri bambu runcing.
   - **Level 5 — Gerbang Kemerdekaan:** Ujian pamungkas menjelang detik-detik Proklamasi 17 Agustus 1945 menuju Gapura Kemerdekaan Agung.

2. **5 Kuis Sejarah Kemerdekaan Indonesia (Terintegrasi Langsung):**
   - Soal Level 1: Tanggal Proklamasi Kemerdekaan Indonesia (*17 Agustus 1945*).
   - Soal Level 2: Tokoh pembaca teks Proklamasi (*Ir. Soekarno*).
   - Soal Level 3: Tokoh pendamping penandatanganan teks Proklamasi (*Drs. Mohammad Hatta*).
   - Soal Level 4: Tempat perumusan naskah Proklamasi (*Kediaman Laksamana Tadashi Maeda*).
   - Soal Level 5: Penjahit Sang Saka Merah Putih (*Ibu Fatmawati*).
   - Dilengkapi umpan balik edukatif (*correct/wrong feedback*) yang mendidik tanpa menghukum pemain berlebihan.

3. **Sistem Skor, Nyawa, dan Checkpoint:**
   - Koin Emas: **+10 Poin**.
   - Kuis Benar (Percobaan 1): **+100 Poin** (Percobaan 2+: **+50 Poin**).
   - Selesai Level: **+50 Poin**.
   - Bonus Tamat 5 Level: **+200 Poin**.
   - Sistem 3 Nyawa (Hati) dengan checkpoint lentera dan masa kekebalan (*invulnerability flash*).

4. **Fitur Kamera & Pembuat Piagam Kemenangan (Canvas API & WebRTC):**
   - Kamera **HANYA** diakses jika pemain menekan tombol *"Ambil Foto Kemenangan"* di layar kemenangan level 5.
   - Tampilan cermin (*selfie mirror*), ambil foto, foto ulang, atau opsi Avatar Pejuang.
   - Render piagam beresolusi 1200 x 800 px dengan ornamen pita Merah Putih, stempel resmi, nama pemain, rekap skor, koin, kuis, waktu, dan tanggal.
   - Fitur 1-klik unduh file PNG langsung ke komputer/ponsel.
   - Semua track video langsung dimatikan setelah proses selesai guna menjaga privasi pengguna.

5. **Audio Sintesis Orisinal (Web Audio API):**
   - SFX lompatan, koin, pukul blok kuis, jawaban benar/salah, terluka, dan fanfare kemerdekaan.
   - Musik latar (*BGM*) chiptune ceria bernuansa patriotik.
   - Tombol toggle Suara (Mute/Unmute) tersimpan di `localStorage`.

6. **Kontrol Responsif Desktop & Ponsel (Mobile Touch):**
   - Desktop: Keyboard `A`/`D` atau Panah, `W`/`Spasi` untuk Melompat, `ESC`/`P` untuk Jeda.
   - Ponsel: Virtual D-Pad (Kiri, Kanan) dan tombol bulat besar LOMPAT (`touch-action: none` tanpa lag dan tanpa scrolling halaman).

---

## 📂 3. Struktur Direktori Proyek

```
petualangan-kemerdekaan/
├── index.html                  # Halaman web utama & antarmuka modal
├── start-game.bat              # Script 1-klik menjalankan server lokal Windows
├── README.md                   # Dokumentasi lengkap proyek
├── libs/
│   └── phaser.min.js           # Engine Phaser 3.80.1 (disimpan lokal, 100% offline)
├── assets/
│   └── images/                 # Direktori aset gambar
└── src/
    ├── main.js                 # Entry point inisialisasi Phaser & App Controller
    ├── styles.css              # Styling modern Merah Putih & kontrol responsif
    ├── game/
    │   ├── AssetGenerator.js   # Generator tekstur 2D orisinal via HTML5 Canvas
    │   ├── Player.js           # Fisika karakter, animasi, coyote-time, hitbox
    │   ├── LevelManager.js     # Desain & data 5 level bersejarah
    │   ├── QuizManager.js      # Data soal, jawaban benar, & umpan balik edukatif
    │   ├── ScoreManager.js     # Manajemen skor, koin, nyawa, timer, & rekor
    │   ├── AudioManager.js     # Sintesis efek suara & musik Web Audio API
    │   └── GameScene.js        # Scene utama Phaser, tabrakan, kamera, & event
    ├── ui/
    │   ├── Menu.js             # Menu utama, panduan, tentang, jeda, & modal kuis
    │   └── HUD.js              # Overlay HUD (Level, Skor, Nyawa) & tombol virtual
    └── camera/
        ├── CameraCapture.js    # Pengelolaan izin & streaming WebRTC getUserMedia
        └── VictoryFrame.js     # Generator Canvas Piagam Pahlawan Kemerdekaan (1200x800)
```

---

## 🚀 4. Cara Menjalankan Aplikasi Secara Lokal

Aplikasi menggunakan standar web modern (HTML5, CSS3, ES Modules, dan Phaser 3). Karena browser modern membatasi fitur kamera WebRTC dan ES Modules pada protokol `file://`, aplikasi harus dijalankan melalui server lokal HTTP (`localhost`).

### Cara 1: Menggunakan File Batch (Paling Praktis di Windows)
1. Buka folder proyek.
2. Klik dua kali file **`start-game.bat`**.
3. Browser default Anda akan otomatis terbuka di alamat:
   ```
   http://localhost:8080
   ```

### Cara 2: Menggunakan Terminal / Command Prompt (Python)
Buka terminal di dalam folder proyek, lalu jalankan:
```bash
python -m http.server 8080
```
Buka browser dan akses `http://localhost:8080`.

### Cara 3: Menggunakan VS Code Live Server
1. Buka folder proyek di Visual Studio Code.
2. Klik kanan pada file `index.html`.
3. Pilih **"Open with Live Server"**.

---

## 🌐 5. Petunjuk Deployment ke Hosting Online (HTTPS)

> ⚠️ **Catatan Penting Kamera:** Browser (Chrome, Safari, Edge, Firefox) mewajibkan koneksi **HTTPS** yang aman agar fitur `navigator.mediaDevices.getUserMedia` (kamera) dapat aktif di internet publik.

### A. Deploy ke Vercel (Gratis & Cepat)
1. Pastikan Anda memiliki akun di [Vercel.com](https://vercel.com).
2. Install Vercel CLI via terminal atau upload repositori ke GitHub:
   ```bash
   npx vercel
   ```
3. Vercel akan otomatis menyediakan domain HTTPS gratis (contoh: `https://petualangan-kemerdekaan.vercel.app`).

### B. Deploy ke Netlify
1. Buka [Netlify Drop](https://app.netlify.com/drop).
2. Drag-and-drop seluruh folder `petualangan-kemerdekaan`.
3. Situs Anda langsung online dengan sertifikat SSL/HTTPS gratis.

### C. Deploy ke GitHub Pages (Sangat Direkomendasikan untuk Gelar Karya PPG)
Game ini 100% statis (*client-side* murni tanpa backend database), sehingga **sangat cocok dan gratis selamanya di GitHub Pages**. GitHub Pages juga otomatis menyediakan protokol **HTTPS** yang diwajibkan oleh browser untuk mengaktifkan fitur kamera WebRTC!

#### Langkah 1: Buat Repositori di GitHub
1. Masuk ke akun [GitHub](https://github.com).
2. Klik tombol **"New"** (atau tanda `+` di kanan atas) untuk membuat repositori baru.
3. Beri nama repositori, contoh: `petualangan-kemerdekaan`.
4. Pilih opsi **Public**, lalu klik **Create repository**.

#### Langkah 2: Upload File ke GitHub
**Opsi A (Upload Langsung via Web Browser — Paling Praktis):**
1. Pada halaman repositori baru Anda di GitHub, klik tautan **"uploading an existing file"**.
2. Buka folder proyek di komputer Anda:
   `D:\PPG\Semester 2\Project Kepemimpinan\petualangan-kemerdekaan`
3. Tarik (*drag and drop*) semua file dan folder (`index.html`, `start-game.bat`, `README.md`, folder `libs/`, folder `assets/`, dan folder `src/`) ke jendela GitHub.
4. Tunggu proses upload selesai, lalu di bagian bawah klik tombol hijau **"Commit changes"**.

**Opsi B (Menggunakan Git Bash / Terminal):**
```bash
cd "D:/PPG/Semester 2/Project Kepemimpinan/petualangan-kemerdekaan"
git init
git add .
git commit -m "Initial commit - Game Petualangan Menuju Kemerdekaan Indonesia"
git branch -M main
git remote add origin https://github.com/<USERNAME-ANDA>/petualangan-kemerdekaan.git
git push -u origin main
```

#### Langkah 3: Aktifkan GitHub Pages
1. Di halaman repositori GitHub Anda, buka tab **Settings** (ikon gerigi).
2. Pada menu samping kiri, klik **Pages**.
3. Pada bagian **Build and deployment > Branch**:
   - Ganti *None* menjadi **`main`**.
   - Biarkan foldernya tetap **`/(root)`**.
   - Klik **Save**.
4. Tunggu sekitar 1–2 menit, refresh halaman Settings > Pages tersebut.
5. Anda akan mendapatkan URL web online resmi, contoh:
   ```
   https://<username-anda>.github.io/petualangan-kemerdekaan/
   ```
6. Web game Anda sekarang **sudah online di seluruh dunia**, bisa diakses lewat HP, tablet, laptop, dan proyektor saat pameran Gelar Karya PPG!

---

## 🧪 6. Ringkasan Pengujian Sistem (Test Cases)

| No | Komponen yang Diuji | Skenario Uji | Hasil yang Diharapkan | Status |
|:--:|:--------------------|:-------------|:----------------------|:------:|
| 1 | **Menu Utama** | Klik tombol Mulai, Panduan, & Tentang | Seluruh modal terbuka/tertutup dengan mulus | **LULUS** |
| 2 | **Audio Web API** | Toggle suara On / Off | Suara aktif/senyap dan status tersimpan di localStorage | **LULUS** |
| 3 | **Fisika Karakter** | Bergerak kiri/kanan, lompat, jatuh | Gerakan responsif, animasi berganti sesuai aksi | **LULUS** |
| 4 | **Koin & Skor** | Karakter menyentuh koin | Suara koin berbunyi, skor bertambah +10, koin lenyap | **LULUS** |
| 5 | **Blok Kuis** | Karakter memukul blok `[ ? ]` | Permainan jeda, modal kuis muncul di tengah layar | **LULUS** |
| 6 | **Jawaban Salah** | Memilih opsi kuis yang keliru | Umpan balik edukatif muncul, pemain bisa mencoba kembali | **LULUS** |
| 7 | **Jawaban Benar** | Memilih opsi kuis yang benar | +100 poin, blok berubah abu-abu, gerbang terbuka | **LULUS** |
| 8 | **Anti-Exploit** | Memukul blok kuis berkali-kali | Tidak memberikan poin ganda | **LULUS** |
| 9 | **Rintangan & Duri**| Karakter menyentuh duri/musuh | Hati berkurang 1, karakter kelap-kelip kebal sementara | **LULUS** |
| 10 | **Jatuh ke Jurang** | Karakter jatuh dari platform | Respawn aman di checkpoint aktif atau awal level | **LULUS** |
| 11 | **Game Over** | Nyawa mencapai 0 | Modal game over muncul dengan tombol coba lagi | **LULUS** |
| 12 | **Progres 5 Level** | Menyelesaikan Level 1 s.d. 5 | Transisi antarlevel berjalan mulus hingga level 5 | **LULUS** |
| 13 | **Layar Kemenangan**| Menuntaskan Level 5 | Layar kemenangan muncul dengan rekapitulasi data lengkap | **LULUS** |
| 14 | **Izin Kamera** | Buka halaman awal website | Kamera TIDAK diminta (privasi aman) | **LULUS** |
| 15 | **Aktivasi Kamera** | Klik *"Ambil Foto Kemenangan"* | Dialog browser meminta izin kamera | **LULUS** |
| 16 | **Snapshot & Retake**| Jepret foto lalu foto ulang | Streaming kamera dapat diulang dan dihentikan dengan aman | **LULUS** |
| 17 | **Piagam Kemenangan**| Render foto ke dalam frame 1200x800 | Sertifikat memuat nama, foto, skor, tanggal, & stempel | **LULUS** |
| 18 | **Unduh Piagam** | Klik *"Unduh Piagam (PNG)"* | File PNG terunduh ke perangkat pengguna | **LULUS** |
| 19 | **Fallback Avatar** | Kamera ditolak / tanpa webcam | Pemain tetap bisa membuat piagam dengan Avatar Pejuang | **LULUS** |
| 20 | **Kontrol Mobile** | Uji tombol sentuh di layar | Karakter bergerak dan melompat tanpa menggeser halaman web | **LULUS** |

---

## 🛡️ 7. Privasi & Keamanan Pengguna
- **Tanpa Pengunggahan Server:** Foto pemain yang diambil melalui kamera diproses 100% di browser lokal pemain melalui elemen `<canvas>`.
- **Penghentian Media Stream:** Fungsi `stream.getTracks().forEach(t => t.stop())` dipanggil segera setelah foto selesai diambil atau jendela kamera ditutup, memastikan indikator kamera fisik perangkat padam.
- **Opsi Inklusif:** Pemain yang tidak memiliki webcam atau menolak izin kamera tetap dapat menyelesaikan permainan dan mengunduh piagam menggunakan Avatar Pejuang Kemerdekaan.

---

## 🇮🇩 8. Nilai Pendidikan & Sejarah
Game ini dikembangkan sebagai karya inovasi media pembelajaran sejarah interaktif (Proyek Kepemimpinan PPG) guna menumbuhkan rasa nasionalisme, mengenalkan fakta-fakta sejarah perjuangan kemerdekaan RI 1945 secara menyenangkan (*gamification*), dan melatih ketangkasan pemecahan masalah bagi generasi muda.

**Merdeka! 🇮🇩**

