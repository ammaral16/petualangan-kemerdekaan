/**
 * QuizManager.js
 * Mengelola 5 soal kuis sejarah kemerdekaan Indonesia beserta pilihan jawaban,
 * umpan balik edukatif, dan status penyelesaian.
 */

export const QUIZ_QUESTIONS = {
  1: {
    level: 1,
    title: "Level 1: Awal Perjuangan",
    question: "Kapan Indonesia memproklamasikan kemerdekaan?",
    options: [
      { id: "A", text: "1 Juni 1945" },
      { id: "B", text: "17 Agustus 1945" },
      { id: "C", text: "10 November 1945" }
    ],
    correctAnswer: "B",
    feedbackCorrect: "Tepat sekali! 🎉 Proklamasi Kemerdekaan Indonesia dibacakan pada hari Jumat, 17 Agustus 1945 pukul 10.00 WIB oleh Ir. Soekarno di Pegangsaan Timur 56, Jakarta.",
    feedbackWrong: "Belum tepat, coba lagi! 🤔 Petunjuk: 1 Juni adalah Hari Lahir Pancasila dan 10 November adalah Hari Pahlawan. Kemerdekaan diproklamasikan di pertengahan bulan Agustus 1945."
  },
  2: {
    level: 2,
    title: "Level 2: Menjelang Proklamasi",
    question: "Siapa yang membacakan teks Proklamasi Kemerdekaan Indonesia?",
    options: [
      { id: "A", text: "Soekarno" },
      { id: "B", text: "Mohammad Hatta" },
      { id: "C", text: "Ahmad Soebardjo" }
    ],
    correctAnswer: "A",
    feedbackCorrect: "Luar biasa! 🇮🇩 Ir. Soekarno membacakan naskah Proklamasi didampingi Drs. Mohammad Hatta di hadapan rakyat Indonesia.",
    feedbackWrong: "Belum tepat, coba lagi! 🤔 Petunjuk: Tokoh ini dikenal luas sebagai 'Bung Karno' dan menjadi Presiden pertama Republik Indonesia."
  },
  3: {
    level: 3,
    title: "Level 3: Merumuskan Kemerdekaan",
    question: "Siapa yang mendampingi Soekarno dalam penandatanganan teks Proklamasi?",
    options: [
      { id: "A", text: "Sutan Sjahrir" },
      { id: "B", text: "Mohammad Hatta" },
      { id: "C", text: "Ki Hajar Dewantara" }
    ],
    correctAnswer: "B",
    feedbackCorrect: "Benar sekali! ✨ Drs. Mohammad Hatta bersama Soekarno menandatangani naskah Proklamasi 'atas nama bangsa Indonesia'.",
    feedbackWrong: "Belum tepat, coba lagi! 🤔 Petunjuk: Tokoh berjuluk 'Bung Hatta' ini adalah proklamator sekaligus Wakil Presiden pertama Republik Indonesia."
  },
  4: {
    level: 4,
    title: "Level 4: Semangat Perjuangan",
    question: "Di rumah siapa naskah Proklamasi Kemerdekaan Indonesia dirumuskan?",
    options: [
      { id: "A", text: "Jenderal Sudirman" },
      { id: "B", text: "Laksamana Tadashi Maeda" },
      { id: "C", text: "Ki Hajar Dewantara" }
    ],
    correctAnswer: "B",
    feedbackCorrect: "Hebat! 🏛️ Naskah Proklamasi dirumuskan di kediaman Laksamana Tadashi Maeda di Jalan Imam Bonjol No. 1, Jakarta pada dini hari 17 Agustus 1945.",
    feedbackWrong: "Belum tepat, coba lagi! 🤔 Petunjuk: Perumusan dilakukan di rumah seorang perwira Angkatan Laut Jepang yang bersimpati pada perjuangan kemerdekaan bangsa Indonesia."
  },
  5: {
    level: 5,
    title: "Level 5: Gerbang Kemerdekaan",
    question: "Siapa yang menjahit bendera Merah Putih yang dikibarkan saat Proklamasi Kemerdekaan Indonesia?",
    options: [
      { id: "A", R_A_Kartini: false, text: "R.A. Kartini" },
      { id: "B", Fatmawati: true, text: "Fatmawati" },
      { id: "C", Dewi_Sartika: false, text: "Dewi Sartika" }
    ],
    correctAnswer: "B",
    feedbackCorrect: "Sempurna! 🚩 Ibu Fatmawati menjahit Sang Saka Merah Putih dari bahan katun Jepang yang dikibarkan saat upacara Proklamasi 17 Agustus 1945.",
    feedbackWrong: "Belum tepat, coba lagi! 🤔 Petunjuk: Beliau adalah Ibu Negara pertama Republik Indonesia dan istri dari Bung Karno."
  }
};

export class QuizManager {
  constructor() {
    this.answeredLevels = new Set();
    this.firstTryMap = {};
  }

  resetAll() {
    this.answeredLevels.clear();
    this.firstTryMap = {};
  }

  isLevelAnswered(levelNum) {
    return this.answeredLevels.has(levelNum);
  }

  getQuestion(levelNum) {
    return QUIZ_QUESTIONS[levelNum] || null;
  }

  submitAnswer(levelNum, selectedId) {
    const q = this.getQuestion(levelNum);
    if (!q) return null;

    if (!(levelNum in this.firstTryMap)) {
      this.firstTryMap[levelNum] = true;
    }

    const isCorrect = selectedId === q.correctAnswer;
    const isFirstTry = this.firstTryMap[levelNum];

    if (isCorrect) {
      this.answeredLevels.add(levelNum);
    } else {
      this.firstTryMap[levelNum] = false;
    }

    return {
      isCorrect,
      isFirstTry,
      feedback: isCorrect ? q.feedbackCorrect : q.feedbackWrong
    };
  }
}

export const quizManager = new QuizManager();

