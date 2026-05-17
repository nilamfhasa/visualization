# VSEPR 3D Explorer 🧪✨

Sebuah platform pembelajaran kimia modern yang menggabungkan visualisasi molekul 3D, kuis interaktif, dan game petualangan sains untuk memahami teori **VSEPR (Valence Shell Electron Pair Repulsion)** secara menyenangkan.

---

## 📂 Panduan Modul Aplikasi
*   **3D Visualizer & Builder (Home)**: Render molekul kustom lewat Tabel Periodik interaktif. Rotasi, zoom, dan pelajari sudut ikatan secara langsung.
*   **VSEPR Challenge (Quiz)**: Kuis berwaktu (Quizizz-style) dengan visual petunjuk 3D untuk mengasah pemahaman struktur.
*   **Molecule Mayhem (Game)**: Game platformer edukatif yang mensimulasikan reaksi kimia nyata.

---

## 🎮 Cara Bermain & Penjelasan Per Level (Game)
> [!IMPORTANT]  
> **Kunci Kemenangan**: Di game ini, Anda harus **sangat teliti menganalisis sifat fisik & kimia molekul** yang aktif. Salah memilih molekul di rintangan yang salah akan membuat Anda hancur!

### 🗼 Level 1: The Iron Tower (Bentuk Dasar Besi)
*   **Misi**: Memanjat menara batu dan kayu berwujud **Besi (Fe)** untuk mengaktifkan tuas (*lever*) di dasar kanan, lalu kembali ke atas untuk masuk ke gerbang keluar.
*   **Bahaya**: Kolam air (**H₂O**) di dasar jurang dan pilar tembaga (**Cu**) yang menghalangi jalan.
*   **Kunci**: Manfaatkan wujud logam berat Fe untuk melompat stabil, hindari air agar tidak berkarat, dan aktifkan sakelar gerbang.

### 💨 Level 2: The Chamber of Gases (Metana vs Sulfur Heksada)
*   **Misi**: Melewati terowongan berangin badai kencang dan melompati jurang asam yang sangat luas.
*   **Bahaya**: Kipas raksasa (*wind blow*) dan genangan cairan asam pekat (**ACID**) di bawah.
*   **Kunci**: 
    *   Gunakan **SF₆** (Sulfur Heksada) yang super berat untuk berjalan stabil menembus tiupan angin kencang tanpa terdorong ke jurang asam.
    *   Swap ke **CH₄** (Metana) yang super ringan untuk melompat tinggi dan gunakan tombol `E` (*Combustion Jump*) untuk melesat naik ke pintu exit.

### 🏭 Level 3: The Corrosive Factory (Asam Klorida vs Amonia)
*   **Misi**: Menyusuri pabrik kimia beracun dan menghancurkan dinding penghalang batu kapur (**CaCO₃**) yang menyumbat pintu keluar.
*   **Bahaya**: Zona basa NaOH korosif, pilar besi penyumbat jalan, dan asap polusi NOx beracun.
*   **Kunci**:
    *   Gunakan **HCl** (Asam Klorida) untuk melelehkan pilar besi (**Fe**) dan menghancurkan dinding batu kapur (**CaCO₃**) lewat reaksi kimia korosif.
    *   Swap ke **NH₃** (Amonia) dan tekan tombol `E` untuk melepas awan gas pelindung agar aman menembus kabut polusi NOx.

### 🧪 Level 4: The Synthesis Maze (Lab Sintesis Puncak)
*   **Misi**: Berwujud Stickman biasa, kumpulkan atom-atom di udara untuk mensintesis molekul pelindung, lalu padamkan rintangan api berkobar.
*   **Bahaya**: Kobaran api membara (**FIRE**) di puncak lantai yang mematikan jika disentuh.
*   **Kunci**:
    *   **Sintesis CH₄**: Ambil 1 atom **C** + 4 atom **H** melayang untuk membuka kekuatan terbang.
    *   **Sintesis H₂O**: Ambil 2 atom **H** + 1 atom **O** melayang untuk mensintesis air.
    *   **Padamkan Api**: Swap ke wujud **H₂O** untuk melintasi dan memadamkan kobaran api secara aman guna meraih kemenangan akhir!

---

## ⌨️ Tombol Kontrol Game
*   **Gerakan Karakter**: Tombol panah **`←` `↑` `↓` `→`** ATAU tombol **`W` `A` `S` `D`**
*   **Swap Molekul**: Tombol **`C`** (Change Power)
*   **Kekuatan Khusus**: Tombol **`E`** (Ledakan gas / Awan pelindung)
*   **Restart Speedrun**: Tombol **`Spacebar`** (Mengulang instan dari Level 1 dengan Timer 0)

---

## 🛠️ Teknologi Utama
*   **Three.js**: Grafik visualisasi molekul 3D presisi.
*   **HTML5 Canvas**: Logika game platformer 2D.
*   **Vanilla JS (ES6)**: Sistem fisika, reaksi, dan manajemen kuis.
*   **CSS3**: Animasi masuk masuk lambat (`1.2s cubic-bezier`) & `scrollbar-gutter` stable.
