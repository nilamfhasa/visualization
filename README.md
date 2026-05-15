# VSEPR 3D Explorer 🧪✨

Sebuah platform pembelajaran kimia interaktif yang menggabungkan visualisasi molekul 3D, gamifikasi petualangan, dan kuis kompetitif untuk memahami teori VSEPR dengan cara yang menyenangkan.

## 🚀 Latar Belakang
Banyak siswa kesulitan membayangkan bentuk molekul hanya dari gambar 2D di buku teks. **VSEPR 3D Explorer** hadir sebagai solusi digital untuk membantu visualisasi nyata dalam ruang tiga dimensi, sehingga konsep gaya tolak-menolak pasangan elektron (VSEPR) menjadi lebih mudah dipahami melalui interaksi langsung dan permainan.

---

## 📂 Struktur Proyek & Fungsi Kode
Proyek ini disusun secara modular untuk memudahkan pengembangan:

-   **`/index.html` & `/js/home.js`**: Halaman utama (Explorer) yang berfungsi sebagai pusat visualisasi molekul 3D dan tabel periodik interaktif.
-   **`/game/`**: Berisi engine game **Molecule Mayhem**. 
    -   `game.js`: Mengatur logika fisika, level, dan reaksi kimia antar molekul.
-   **`/quiz/`**: Berisi kuis interaktif **3D VSEPR Challenge**.
    -   `quiz.js`: Mengatur logika poin (Quizizz style), timer, dan integrasi soal 3D.
-   **`/about/`**: Halaman informasi proyek dengan desain modern Bento Grid.
-   **`/js/shared/`**: Logika inti yang digunakan di semua halaman.
    -   `engine3d.js`: Mesin utama Three.js untuk merender molekul 3D.
    -   `chemistry.js`: Database molekul, koordinat atom, dan bank soal kuis.
-   **`/css/`**: Berisi desain visual (Global, Home, Game, Quiz, About).

---

## 🎮 Cara Bermain & Penggunaan

### 1. Visualisasi 3D (Home/Explorer)
-   Klik simbol atom pada **Tabel Periodik** untuk menambahkannya ke formula.
-   Gunakan mouse untuk **merotasi** molekul 3D agar bisa melihat sudut ikatan dari berbagai arah.
-   Lihat panel informasi untuk mengetahui tipe AXE, PEB, PEI, dan geometri molekulnya.

### 2. Molecule Mayhem (Game)
-   **Tujuan**: Capai garis finish dengan mengumpulkan atom yang tepat untuk membentuk molekul pelindung.
-   **Kontrol**: Gunakan tombol **Panah (Arrow Keys)** untuk bergerak dan melompat.
-   **Mekanik Kimia**: 
    -   Gunakan **CH₄** untuk melompat tinggi (densitas rendah).
    -   Gunakan **SF₆** untuk menahan angin kencang (gas berat).
    -   Gunakan **H₂O** untuk melewati rintangan api.
    -   Hindari rintangan asam jika kamu sedang menjadi logam (Besi/Fe).

### 3. VSEPR Quiz (3D Quizizz Style)
-   Masukkan nama kamu untuk memulai.
-   Identifikasi geometri molekul yang muncul dalam bentuk 3D.
-   **Tips**: Semakin cepat kamu menjawab, semakin banyak poin bonus yang kamu dapatkan!
-   Lihat skor akhir dan evaluasi pemahamanmu di layar hasil kuis.

---

## 🛠️ Teknologi
-   **Three.js**: Engine visualisasi 3D.
-   **HTML5 Canvas**: Engine untuk platformer game 2D.
-   **Vanilla JavaScript (ES6)**: Logika aplikasi dan state management.
-   **CSS3**: Styling modern dengan Glassmorphism dan Bento Grid layout.

---
Dikembangkan dengan ❤️ untuk kemajuan pendidikan sains.
