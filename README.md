# VSEPR 3D Explorer 🧪✨

 Sebuah platform pembelajaran kimia modern dan interaktif yang menggabungkan visualisasi molekul 3D, gamifikasi petualangan platformer (*Molecule Mayhem*), dan kuis kompetitif berbasis 3D (*VSEPR Challenge*). Dibuat khusus untuk membantu siswa dan akademisi memahami konsep geometri molekul serta teori **VSEPR (Valence Shell Electron Pair Repulsion)** dengan cara yang interaktif dan menyenangkan.

---

## 🚀 Latar Belakang & Urgensi Pedagogis
Dalam pembelajaran kimia, **Teori VSEPR** sangat krusial untuk menentukan bentuk geometri suatu molekul berdasarkan jumlah pasangan elektron ikatan (PEI) dan pasangan elektron bebas (PEB) di sekitar atom pusat. Namun, konsep ini sering kali sulit dipahami siswa karena:
* **Hambatan Visualisasi 2D**: Gambar statis 2D di buku teks konvensional tidak mampu merepresentasikan sudut ikatan (*bond angles*) dan orientasi ruang dalam tiga dimensi secara akurat.
* **Ketiadaan Pembelajaran Interaktif**: Siswa kesulitan memahami bagaimana konfigurasi molekul memengaruhi sifat fisik dan kimianya.

**VSEPR 3D Explorer** hadir sebagai jembatan digital berteknologi tinggi yang memfasilitasi visualisasi ruang 3D secara presisi, sehingga gaya tolak-menolak elektron dapat dipahami melalui eksplorasi langsung, permainan berbasis sains, dan kuis kompetitif.

---

## 📂 Struktur Proyek & Fungsi Kode
Proyek ini dibangun menggunakan arsitektur modular yang rapi dan optimal:

* **`/index.html` & `/js/home.js`**: Halaman utama (*Explorer*) yang memuat 3D Visualizer interaktif dan **Tabel Periodik Builder** dinamis untuk membuat molekul kustom.
* **`/game/`**: Modul game platformer **Molecule Mayhem**.
  * `index.html`: Layout game dengan panduan kontrol glassmorphism dan integrasi navigasi global.
  * `game.js`: Mesin game platformer (mengatur fisika, gravitasi, partikel, level, collision, dan reaksi kimia).
* **`/quiz/`**: Modul kuis interaktif **VSEPR Challenge** bergaya kuis kompetitif.
  * `index.html`: Antarmuka kuis dengan bar progres instan dan layar input nama.
  * `quiz.js`: Logika penilaian dinamis (skor berkurang seiring waktu), timer, dan integrasi visual 3D per soal.
* **`/about/`**: Halaman pengembang dan visi proyek dengan layout mewah berbasis **Bento Grid**.
* **`/js/shared/`**: Logika inti yang dibagikan antar halaman.
  * `engine3d.js`: Mesin render Three.js untuk visualisasi molekul dengan pencahayaan fisik dan kontrol rotasi/zoom.
  * `chemistry.js`: Database koordinat 3D atom, jenis geometri, sudut ikatan, tipe AXE, serta bank soal kuis.
* **`/css/`**: Lembar gaya (*stylesheets*) global dan spesifik modul.
  * `global.css`: CSS bersama yang berisi tema warna, navbar global, transisi masuk halaman yang mulus (*cinematic entrance transition*), dan *scrollbar shift fix* (`scrollbar-gutter: stable`).

---

## 🎮 Penjelasan Fitur & Panduan Penggunaan

### 1. 3D Molecular Visualizer & Periodic Builder (Home)
* **Periodic Table Builder**: Siswa dapat mengklik elemen-elemen pada Tabel Periodik untuk menyusun rumus kimia sendiri, lalu merendernya ke dalam bentuk 3D.
* **3D Interactive Viewer**: Lakukan *drag* menggunakan mouse/jari untuk merotasi molekul 180°, dan gunakan *scroll* untuk melakukan *zoom-in/zoom-out* guna meneliti susunan atom secara presisi.
* **Explanation & Stats**: Menyediakan informasi detail mengenai rumus geometri elektron, tipe AXE, jumlah PEI, jumlah PEB, serta sudut ikatan molekul yang aktif.

---

### 2. Molecule Mayhem (Game Platformer)
> [!IMPORTANT]  
> **Ketelitian Molekul & Sifat Fisik Kimianya**:  
> Di dalam game ini, pemain **dituntut untuk sangat teliti dan jeli dalam menganalisis molekul** yang sedang aktif serta reaksi fisik-kimianya terhadap bahaya lingkungan sekitar. Setiap molekul memiliki rumus, bobot molekul, dan karakteristik unik yang menentukan apakah pemain dapat melewati rintangan tertentu atau justru hancur!

#### 🧪 Daftar Molekul Aktif & Karakteristik Uniknya:

| Nama Molekul | Rumus Kimia | Sifat & Karakteristik dalam Game | Peran Utama & Cara Kerja |
| :--- | :---: | :--- | :--- |
| **Stickman** | *N/A* | Keadaan dasar/netral manusia karat tanpa kemampuan khusus. | Bentuk awal permainan. Tidak memiliki ketahanan kimia atau fisik apa pun. |
| **Besi** | **Fe** | Logam berat padat dengan daya tahan fisik tinggi, namun rentan terkorosi larutan asam. | Digunakan sebagai beban untuk turun dengan cepat, namun akan **hancur/getar hebat** jika menyentuh asam klorida (HCl). |
| **Metana** | **CH₄** | Gas hidrokarbon super ringan dengan densitas rendah dan mudah terbakar (*Combustion*). | Memberikan daya lompat tinggi yang luar biasa. Dapat meledak ke atas dengan menekan tombol `E` (*Combustion jump*). |
| **Sulfur Heksada** | **SF₆** | Gas anorganik super padat dan sangat berat (6 kali lebih berat dari udara). | Memberikan beban berat ekstra. Sangat krusial untuk **menahan hembusan angin kencang** agar tidak terlempar ke jurang asam. |
| **Asam Klorida** | **HCl** | Senyawa asam kuat yang bersifat sangat korosif. | Merupakan rintangan cairan asam di lantai dasar yang harus dihindari oleh wujud logam (**Fe**). |
| **Amonia** | **NH₃** | Senyawa gas polar berbau menyengat yang membentuk awan uap. | Menghasilkan kepulan awan gas gas pelindung tebal saat menekan tombol `E` untuk membingungkan musuh/sensor. |
| **Air** | **H₂O** | Senyawa polar universal dengan kapasitas panas tinggi. | Berfungsi sebagai molekul pendingin utama untuk melewati rintangan api/panas ekstrem. |
| **Helium** | **He** | Gas mulia super ringan, stabil, dan non-reaktif. | Memberikan efek melayang konstan (*anti-gravitasi*) untuk melewati jurang yang sangat lebar. |

#### 🏆 Sistem Speedrun & Mekanik Game Terbaru:
* **Leveling Berurutan (Sequential Levels)**: Tombol pemilih level instan telah dihapus untuk menjaga keadilan kompetisi. Pemain wajib menyelesaikan **Level 1 sampai Level 4 secara berurutan** untuk dapat menyelesaikan game.
* **Timer Speedrun Terintegrasi**: Timer pencatat waktu akan berjalan terus menerus dari awal Level 1 hingga pemain berhasil menyentuh pintu keluar di akhir Level 4.
* **Papan Kelulusan & Tier Penilaian**: Begitu menyelesaikan Level 4, pemain akan diberikan ucapan selamat khusus berupa nama pemain yang telah diinput di awal, catatan waktu total yang sangat presisi, serta **Tier Kelulusan (Grade)** berdasarkan kecepatan berlari mereka.
* **Spacebar Instant Restart**: Pemain/speedrunner dapat menekan tombol **`Spacebar`** kapan saja selama permainan untuk mereset seluruh run kembali ke Level 1 dengan waktu timer kembali ke 0.

#### 🎮 Panduan Tombol Kontrol:
*   **Gerakan Karakter**: Gunakan tombol panah **`←` `↑` `↓` `→`** atau tombol **`W` `A` `S` `D`** pada keyboard Anda.
*   **Ganti Power (Molekul)**: Tekan tombol **`C`** untuk menukar jenis molekul aktif yang ada di inventori Anda.
*   **Kekuatan Spesial**: Tekan tombol **`E`** untuk mengaktifkan jurus khusus molekul aktif (misal: *combustion jump* pada CH₄).
*   **Reset Speedrun**: Tekan tombol **`Spacebar`** untuk memulai ulang run dari Level 1 dengan timer 0.

---

### 3. VSEPR Challenge (Quiz 3D)
* **Sistem Skor Dinamis**: Kuis ini menggunakan sistem *score decay* bergaya Quizizz. Semakin cepat Anda menjawab soal dengan benar, semakin tinggi skor poin yang Anda dapatkan!
* **3D Visual Clues**: Soal kuis menampilkan molekul secara 3D interaktif di tengah layar. Anda dapat memutar molekul tersebut untuk meneliti bentuk geometrinya sebelum memilih jawaban.
* **Progress Bar Akurat**: Menampilkan perkembangan pengerjaan soal secara *real-time* di bagian atas layar.

---

## 🛠️ Teknologi & Fitur Visual Premium
* **Three.js**: Digunakan untuk merender grafik 3D molekul dengan pencahayaan fisik dan animasi rotasi orbital yang mulus.
* **HTML5 Canvas**: Mesin utama di balik permainan platformer 2D *Molecule Mayhem*.
* **Silky Smooth Page Entrance**: Setiap kali halaman dikunjungi, konten utama akan memudar dan naik secara perlahan dengan efek transisi premium `cubic-bezier(0.25, 1, 0.3, 1)` selama `1.2s`.
* **Scrollbar Gutter Protection**: Menggunakan `scrollbar-gutter: stable` pada CSS global untuk mencegah pergeseran layout (*layout shift*) saat berpindah halaman.
* **Responsive Glassmorphism Layout**: Tampilan UI yang futuristik dengan efek blur kaca, pendaran neon cyan, dan tata letak Bento Grid yang responsif di berbagai perangkat.

---
Dikembangkan dengan penuh dedikasi oleh **Nilam Fhasa** untuk kemajuan pendidikan sains digital interaktif di Indonesia. 🧪✨🇮🇩
