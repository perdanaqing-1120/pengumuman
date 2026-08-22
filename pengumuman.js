/* =====================================================
   PORTAL PENGUMUMAN SELEKSI SMAN 1 SOPPENG
   Theme: Amber Glass & Spatial Bento
   Cloud Database: Firebase Realtime Database (100% Pure Cloud)
   ===================================================== */
'use strict';

/* ── Kredensial Admin & Kunci Tema ── */
const ADMIN_PASSWORD = 'MPKSMANSA';
const THEME_KEY = 'mansa_portal_theme';

/* ── Firebase Configuration (Termasuk Database URL Resmi) ── */
const firebaseConfig = {
  apiKey: "AIzaSyD9r47ys6etWUw9blS_0erFGyDDV1_O1W0",
  authDomain: "pengumuman-e8aab.firebaseapp.com",
  databaseURL: "https://pengumuman-e8aab-default-rtdb.firebaseio.com",
  projectId: "pengumuman-e8aab",
  storageBucket: "pengumuman-e8aab.firebasestorage.app",
  messagingSenderId: "1044460874913",
  appId: "1:1044460874913:web:5e48c251a4ca18db8914e0",
  measurementId: "G-9M3QHV5GLM"
};

/* ── App State (100% Menggunakan Firebase Realtime Database) ── */
let peserta = [];
let isLoggedIn = false;
let dbRef = null;
let isConnectedToFirebase = false;

// Bersihkan cache lokal lama
try {
  localStorage.removeItem('pengumuman_peserta_v1');
} catch (e) {}

/* ──────────────────────────────────────────────────
   FIREBASE INITIALIZATION & REAL-TIME LISTENER
   ────────────────────────────────────────────────── */
function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        try {
          firebase.analytics();
        } catch (e) {}
      }

      const rdb = firebase.database();
      dbRef = rdb.ref('peserta');

      // Pantau status koneksi Firebase
      rdb.ref('.info/connected').on('value', snap => {
        isConnectedToFirebase = snap.val() === true;
        updateConnectionStatusBadge();
      });

      // Realtime listener untuk seluruh data peserta
      dbRef.on('value', snapshot => {
        const val = snapshot.val();
        if (val) {
          peserta = Array.isArray(val) ? val.filter(Boolean) : Object.values(val);
        } else {
          peserta = [];
        }
        renderStats();
        renderTable();
      }, error => {
        console.error('Firebase Database error:', error);
        showToast('Koneksi database Firebase bermasalah: ' + error.message, 'danger', 5000);
      });
    }
  } catch (e) {
    console.error('Inisialisasi Firebase gagal:', e);
  }
}

function updateConnectionStatusBadge() {
  const badge = document.getElementById('firebaseStatusBadge');
  if (badge) {
    if (isConnectedToFirebase) {
      badge.innerHTML = '<span style="color:#10b981;">●</span> Terhubung ke Firebase';
      badge.className = 'connection-badge online';
    } else {
      badge.innerHTML = '<span style="color:#f59e0b;">●</span> Menghubungkan Firebase...';
      badge.className = 'connection-badge connecting';
    }
  }
}

/* ──────────────────────────────────────────────────
   FIREBASE CRUD OPERATIONS (LANGSUNG KE CLOUD)
   ────────────────────────────────────────────────── */
async function savePesertaToFirebase(item) {
  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    await firebase.database().ref('peserta/' + item.nisn).set(item);
    return true;
  } catch (e) {
    console.error('Gagal menyimpan ke Firebase:', e);
    showToast('Gagal menyimpan ke server: ' + e.message, 'danger');
    return false;
  }
}

async function deletePesertaFromFirebase(nisn) {
  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    await firebase.database().ref('peserta/' + nisn).remove();
    return true;
  } catch (e) {
    console.error('Gagal menghapus dari Firebase:', e);
    showToast('Gagal menghapus dari server: ' + e.message, 'danger');
    return false;
  }
}

async function deleteAllFromFirebase() {
  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    await firebase.database().ref('peserta').remove();
    return true;
  } catch (e) {
    console.error('Gagal menghapus semua data di Firebase:', e);
    showToast('Gagal menghapus semua: ' + e.message, 'danger');
    return false;
  }
}

async function batchSaveToFirebase(list) {
  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const updates = {};
    list.forEach(p => {
      updates['peserta/' + p.nisn] = p;
    });
    await firebase.database().ref().update(updates);
    return true;
  } catch (e) {
    console.error('Gagal impor batch ke Firebase:', e);
    showToast('Gagal impor batch: ' + e.message, 'danger');
    return false;
  }
}

/* ──────────────────────────────────────────────────
   UTILITIES
   ────────────────────────────────────────────────── */
function normalize(s) {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function escapeHtml(s) {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ──────────────────────────────────────────────────
   THEME SWITCHER (Light / Dark Mode)
   ────────────────────────────────────────────────── */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  const htmlEl = document.documentElement;
  const iconFloat = document.getElementById('themeIconFloat');
  
  if (theme === 'dark') {
    htmlEl.classList.add('dark');
    htmlEl.classList.remove('light');
    if (iconFloat) iconFloat.textContent = 'light_mode';
  } else {
    htmlEl.classList.remove('dark');
    htmlEl.classList.add('light');
    if (iconFloat) iconFloat.textContent = 'dark_mode';
  }
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}

document.getElementById('btnThemeToggleFloat')?.addEventListener('click', toggleTheme);

/* ──────────────────────────────────────────────────
   TOAST & MODAL DIALOGS
   ────────────────────────────────────────────────── */
function showToast(msg, type = 'default', dur = 3200) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const icons = {
    default: 'info',
    lolos: 'check_circle',
    tidak: 'cancel',
    danger: 'warning'
  };
  const el = document.createElement('div');
  el.className = `toast ${type === 'default' ? '' : type}`;
  el.innerHTML = `<span class="material-icons-round" style="font-size:1.2rem;">${icons[type] || icons.default}</span> <span>${msg}</span>`;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.cssText = 'opacity:0;transform:translateY(10px);transition:all .3s ease';
    setTimeout(() => el.remove(), 350);
  }, dur);
}

function showModal({ icon = 'help', title, body, confirmText = 'Lanjutkan', confirmClass = 'btn-danger', onConfirm }) {
  const ov = document.createElement('div');
  ov.className = 'modal-overlay';
  ov.innerHTML = `
    <div class="modal-box">
      <div class="modal-icon">${icon}</div>
      <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-main);margin-bottom:0.5rem;">${title}</h3>
      <p style="font-size:0.9rem;color:var(--text-muted);">${body}</p>
      <div class="modal-actions">
        <button class="btn btn-outline" id="mCancel">Batal</button>
        <button class="btn ${confirmClass}" id="mConfirm">${confirmText}</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  ov.querySelector('#mCancel').addEventListener('click', () => ov.remove());
  ov.querySelector('#mConfirm').addEventListener('click', () => {
    ov.remove();
    if (typeof onConfirm === 'function') onConfirm();
  });
  ov.addEventListener('click', e => {
    if (e.target === ov) ov.remove();
  });
}

/* ──────────────────────────────────────────────────
   PAGE NAVIGATION & URL ROUTING (/admin, #admin)
   ────────────────────────────────────────────────── */
const pageSiswa  = document.getElementById('page-siswa');
const pageHasil  = document.getElementById('page-hasil');
const pageAdmin  = document.getElementById('page-admin');
const panelLogin = document.getElementById('panel-login');
const panelDash  = document.getElementById('panel-dashboard');

function showPage(id) {
  [pageSiswa, pageHasil, pageAdmin].forEach(p => {
    if (p) p.classList.remove('active');
  });
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleUrlRoute() {
  const hash = (window.location.hash || '').toLowerCase();
  const path = (window.location.pathname || '').toLowerCase();

  if (
    hash === '#admin' || 
    hash === '#/admin' || 
    path === '/admin' || 
    path === '/admin/' || 
    path.endsWith('/admin') || 
    path.endsWith('/admin/') || 
    path.endsWith('/admin.html')
  ) {
    showPage('page-admin');
    isLoggedIn ? showDashboard() : showLoginPanel();
  } else if (hash === '#hasil') {
    const container = document.getElementById('hasilContainer');
    if (container && container.innerHTML.trim()) {
      showPage('page-hasil');
    } else {
      navigateToHome();
    }
  } else {
    showPage('page-siswa');
  }
}

function navigateToHome() {
  try {
    const path = window.location.pathname;
    if (path.includes('/admin')) {
      const cleanPath = path.replace(/\/admin(\.html)?\/?$/, '') || '/';
      history.pushState(null, '', cleanPath + window.location.search);
    } else if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  } catch (e) {
    window.location.hash = '';
  }
  showPage('page-siswa');
}

window.addEventListener('hashchange', handleUrlRoute);
window.addEventListener('popstate', handleUrlRoute);
window.addEventListener('DOMContentLoaded', handleUrlRoute);

document.getElementById('btnBackFromLogin')?.addEventListener('click', () => {
  navigateToHome();
});

document.getElementById('btnLogout')?.addEventListener('click', () => {
  isLoggedIn = false;
  showToast('Anda telah keluar dari sesi panitia.', 'default');
  navigateToHome();
});

document.getElementById('btnKembali')?.addEventListener('click', () => {
  const inpNama = document.getElementById('inputNama');
  const inpNISN = document.getElementById('inputNISN');
  if (inpNama) inpNama.value = '';
  if (inpNISN) inpNISN.value = '';
  navigateToHome();
  setTimeout(() => inpNama?.focus(), 200);
});

function showLoginPanel() {
  if (panelLogin) panelLogin.style.display = 'flex';
  if (panelDash) panelDash.style.display = 'none';
  const inp = document.getElementById('inputPassword');
  if (inp) inp.value = '';
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.style.display = 'none';
  setTimeout(() => inp?.focus(), 250);
}

function showDashboard() {
  if (panelLogin) panelLogin.style.display = 'none';
  if (panelDash) panelDash.style.display = 'block';
  renderStats();
  renderTable();
}

/* ──────────────────────────────────────────────────
   LOGIN ADMIN LOGIC
   ────────────────────────────────────────────────── */
document.getElementById('formLogin')?.addEventListener('submit', e => {
  e.preventDefault();
  const pw = document.getElementById('inputPassword')?.value;
  const errEl = document.getElementById('loginError');
  if (pw === ADMIN_PASSWORD) {
    if (errEl) errEl.style.display = 'none';
    isLoggedIn = true;
    showToast('Login berhasil! Selamat datang, Panitia.', 'lolos');
    showDashboard();
  } else {
    if (errEl) errEl.style.display = 'flex';
    const inp = document.getElementById('inputPassword');
    inp?.focus();
    inp?.select();
  }
});

document.getElementById('btnTogglePass')?.addEventListener('click', () => {
  const inp = document.getElementById('inputPassword');
  const icon = document.querySelector('#btnTogglePass span');
  if (!inp || !icon) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.textContent = 'visibility_off';
  } else {
    inp.type = 'password';
    icon.textContent = 'visibility';
  }
});

/* ──────────────────────────────────────────────────
   CEK STATUS SISWA → HASIL PENGUMUMAN
   ────────────────────────────────────────────────── */
document.getElementById('formCekStatus')?.addEventListener('submit', async e => {
  e.preventDefault();
  const namaMentah = document.getElementById('inputNama')?.value || '';
  const nisnMentah = (document.getElementById('inputNISN')?.value || '').trim();
  const nama       = normalize(namaMentah);
  const nisn       = nisnMentah;
  const container  = document.getElementById('hasilContainer');

  if (!nama || !nisn) {
    container.innerHTML = buildValidasiCard();
    showPage('page-hasil');
    return;
  }

  // Cari di cache synced Firebase
  let found = peserta.find(p => normalize(p.nama) === nama && p.nisn.trim() === nisn);

  // Jika belum ditemukan di memori lokal, query langsung ke Firebase
  if (!found && typeof firebase !== 'undefined' && firebase.apps.length) {
    try {
      const snap = await firebase.database().ref('peserta/' + nisn).once('value');
      const val = snap.val();
      if (val && normalize(val.nama) === nama) {
        found = val;
      }
    } catch (err) {
      console.warn('Direct Firebase search notice:', err);
    }
  }

  if (!found) {
    container.innerHTML = buildNotFoundCard(namaMentah.trim(), nisnMentah);
  } else if (found.status === 'lolos') {
    container.innerHTML = buildLolosCard(found);
  } else {
    container.innerHTML = buildTidakCard(found);
  }

  showPage('page-hasil');
});

/* ── Builder: Kartu LOLOS (Amber Glass) ── */
function buildLolosCard(p) {
  const waGroupUrl = 'https://chat.whatsapp.com/GUUgo7cy3SB9vF96eKaIFL?s=cl&p=a&mlu=4';
  return `
    <div class="amber-glass hasil-card hasil-lolos spatial-hover">
      <span class="status-emoji">🎉</span>
      <div class="ribbon-badge">
        <span class="material-icons-round" style="font-size:1rem;">verified</span>
        <span>HASIL RESMI SELEKSI</span>
      </div>
      <h2 class="status-head">SELAMAT! ANDA DINYATAKAN<br/>LOLOS SELEKSI PANITIA</h2>
      <hr class="hasil-divider" />
      <h3 class="nama-peserta-prominent">${escapeHtml(p.nama)}</h3>
      <div class="nisn-badge-prominent">NISN: <strong>${escapeHtml(p.nisn)}</strong></div>
      ${
        p.keterangan
          ? `<div class="ket-box-prominent">
              <span class="material-icons-round" style="color:var(--primary);font-size:1.15rem;">info</span>
              <span><strong>Catatan:</strong> ${escapeHtml(p.keterangan)}</span>
            </div>`
          : ''
      }
      <p class="pesan-akhir">
        Selamat! Anda telah berhasil lolos seleksi.<br/>
        Semoga sukses di langkah berikutnya.
      </p>
      <div class="wa-group-container">
        <a href="${waGroupUrl}" target="_blank" rel="noopener noreferrer" class="btn-wa-group">
          <i class="fa-brands fa-whatsapp"></i>
          <span>Gabung Grup WhatsApp</span>
        </a>
        <p class="wa-group-subtext">Silakan segera bergabung ke grup koordinasi resmi panitia PEMILOS 2026</p>
      </div>
    </div>`;
}

/* ── Builder: Kartu TIDAK LOLOS ── */
function buildTidakCard(p) {
  return `
    <div class="amber-glass hasil-card hasil-tidak spatial-hover">
      <span class="status-emoji">🤝</span>
      <div class="ribbon-badge">
        <span class="material-icons-round" style="font-size:1rem;">info</span>
        <span>HASIL RESMI SELEKSI</span>
      </div>
      <h2 class="status-head">MOHON MAAF, ANDA<br/>BELUM LOLOS SELEKSI</h2>
      <hr class="hasil-divider" />
      <h3 class="nama-peserta-prominent">${escapeHtml(p.nama)}</h3>
      <div class="nisn-badge-prominent">NISN: <strong>${escapeHtml(p.nisn)}</strong></div>
      ${
        p.keterangan
          ? `<div class="ket-box-prominent">
              <span class="material-icons-round" style="color:var(--color-danger);font-size:1.15rem;">info</span>
              <span><strong>Catatan:</strong> ${escapeHtml(p.keterangan)}</span>
            </div>`
          : ''
      }
      <p class="pesan-akhir">
        Jangan menyerah! Setiap kegagalan adalah pelajaran berharga.<br/>
        Tetap semangat dan terus berusaha.
      </p>
    </div>`;
}

/* ── Builder: Data Tidak Ditemukan ── */
function buildNotFoundCard(nama, nisn) {
  return `
    <div class="amber-glass hasil-card spatial-hover">
      <span class="status-emoji">🔍</span>
      <div class="ribbon-badge" style="background:var(--amber-700);color:#fff;">
        <span class="material-icons-round" style="font-size:1rem;">search_off</span>
        <span>DATA TIDAK DITEMUKAN</span>
      </div>
      <h2 class="status-head" style="color:var(--amber-800);">DATA BELUM TERDAFTAR</h2>
      <hr class="hasil-divider" />
      <p style="font-size:1.05rem;color:var(--text-main);margin-bottom:0.75rem;">
        Nama <strong>${escapeHtml(nama) || '—'}</strong> dengan NISN <strong>${escapeHtml(nisn) || '—'}</strong> tidak ditemukan dalam database sistem.
      </p>
      <p style="font-size:0.88rem;color:var(--text-muted);">
        Pastikan penulisan nama lengkap dan 10 digit NISN sudah sesuai dengan data formulir pendaftaran.
      </p>
    </div>`;
}

/* ── Builder: Validasi Kosong ── */
function buildValidasiCard() {
  return `
    <div class="amber-glass hasil-card spatial-hover">
      <span class="status-emoji">⚠️</span>
      <h2 class="status-head" style="color:var(--amber-800);">MOHON LENGKAPI FORMULIR</h2>
      <hr class="hasil-divider" />
      <p style="font-size:0.92rem;color:var(--text-muted);">
        Silakan masukkan Nama Lengkap dan NISN terlebih dahulu sebelum menekan tombol periksa hasil.
      </p>
    </div>`;
}

/* ──────────────────────────────────────────────────
   ADMIN: TAMBAH PESERTA (LANGSUNG KE FIREBASE)
   ────────────────────────────────────────────────── */
document.getElementById('formTambah')?.addEventListener('submit', async e => {
  e.preventDefault();
  const nama       = (document.getElementById('addNama')?.value || '').trim();
  const nisn       = (document.getElementById('addNISN')?.value || '').trim();
  const status     = document.getElementById('addStatus')?.value || 'lolos';
  const keterangan = (document.getElementById('addKeterangan')?.value || '').trim();
  const errEl      = document.getElementById('tambahError');

  if (!nama || !nisn) {
    if (errEl) {
      errEl.textContent = 'Nama lengkap dan NISN wajib diisi.';
      errEl.style.display = 'flex';
    }
    return;
  }

  if (!/^\d{1,10}$/.test(nisn)) {
    if (errEl) {
      errEl.textContent = 'NISN harus berupa angka (maksimal 10 digit).';
      errEl.style.display = 'flex';
    }
    return;
  }

  const dup = peserta.find(p => p.nisn.trim() === nisn);
  if (dup) {
    if (errEl) {
      errEl.textContent = `NISN ${nisn} sudah terdaftar atas nama "${dup.nama}".`;
      errEl.style.display = 'flex';
    }
    return;
  }

  if (errEl) errEl.style.display = 'none';

  const newPeserta = { nama, nisn, status, keterangan };

  // Simpan langsung ke Firebase Realtime Database
  const ok = await savePesertaToFirebase(newPeserta);

  if (ok) {
    showToast(`Peserta "${nama}" berhasil disimpan ke Firebase!`, 'lolos');
    // Reset form
    document.getElementById('addNama').value = '';
    document.getElementById('addNISN').value = '';
    document.getElementById('addKeterangan').value = '';
    document.getElementById('addStatus').value = 'lolos';
    document.getElementById('addNama').focus();
  }
});

/* ──────────────────────────────────────────────────
   ADMIN: HAPUS PESERTA (LANGSUNG DARI FIREBASE)
   ────────────────────────────────────────────────── */
function hapusPeserta(idx) {
  const p = peserta[idx];
  if (!p) return;
  showModal({
    icon: '🗑️',
    title: 'Hapus Peserta?',
    body: `Data <strong>${escapeHtml(p.nama)}</strong> (NISN: ${escapeHtml(p.nisn)}) akan dihapus permanen dari database Firebase.`,
    confirmText: 'Ya, Hapus Data',
    confirmClass: 'btn-danger',
    async onConfirm() {
      await deletePesertaFromFirebase(p.nisn);
      showToast('Data peserta berhasil dihapus dari Firebase.', 'tidak');
    }
  });
}

document.getElementById('btnHapusSemua')?.addEventListener('click', () => {
  if (!peserta.length) {
    showToast('Tidak ada data yang bisa dihapus.', 'default');
    return;
  }
  showModal({
    icon: '⚠️',
    title: 'Hapus Seluruh Data Peserta?',
    body: `Anda akan menghapus <strong>${peserta.length} data peserta</strong> secara permanen dari Firebase. Tindakan ini tidak dapat dibatalkan.`,
    confirmText: 'Ya, Hapus Semua',
    confirmClass: 'btn-danger',
    async onConfirm() {
      await deleteAllFromFirebase();
      showToast('Semua data peserta telah dihapus dari Firebase.', 'tidak');
    }
  });
});

/* ──────────────────────────────────────────────────
   ADMIN: RENDER STATISTIK & TABEL DARI FIREBASE
   ────────────────────────────────────────────────── */
function renderStats() {
  const total = peserta.length;
  const lolos = peserta.filter(p => p.status === 'lolos').length;
  const tidak = peserta.filter(p => p.status === 'tidak').length;

  const statTotalEl = document.querySelector('#statTotal span strong');
  const statLolosEl = document.querySelector('#statLolos span strong');
  const statTidakEl = document.querySelector('#statTidak span strong');

  if (statTotalEl) statTotalEl.textContent = total;
  if (statLolosEl) statLolosEl.textContent = lolos;
  if (statTidakEl) statTidakEl.textContent = tidak;
}

function renderTable(filterStr = '', filterStatus = 'semua') {
  const tbody   = document.getElementById('tbodyPeserta');
  if (!tbody) return;
  const keyword = normalize(filterStr);

  const filtered = peserta.filter(p => {
    const matchKw = !keyword || normalize(p.nama).includes(keyword) || p.nisn.includes(keyword);
    const matchSt = filterStatus === 'semua' || p.status === filterStatus;
    return matchKw && matchSt;
  });

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:3rem 1rem;color:var(--text-subtle);">
          <span class="material-icons-round" style="font-size:2.5rem;display:block;margin-bottom:0.5rem;opacity:0.5;">inbox</span>
          ${!peserta.length ? 'Belum ada data peserta di database Firebase.' : 'Tidak ada data yang sesuai dengan filter pencarian.'}
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const realIdx = peserta.indexOf(p);
    const badge = p.status === 'lolos'
      ? `<span class="status-badge-pill lolos"><span class="material-icons-round" style="font-size:0.95rem;">check</span> LOLOS</span>`
      : `<span class="status-badge-pill tidak"><span class="material-icons-round" style="font-size:0.95rem;">close</span> TIDAK LOLOS</span>`;

    return `
      <tr>
        <td style="color:var(--text-subtle);font-weight:700;font-size:0.8rem;">${realIdx + 1}</td>
        <td><strong>${escapeHtml(p.nama)}</strong></td>
        <td><code style="font-family:'Geist',monospace;font-weight:700;color:var(--primary);">${escapeHtml(p.nisn)}</code></td>
        <td>${badge}</td>
        <td style="color:var(--text-muted);font-size:0.84rem;">${escapeHtml(p.keterangan) || '—'}</td>
        <td style="text-align:center;">
          <button class="btn-del-row" onclick="hapusPeserta(${realIdx})" title="Hapus peserta ini dari Firebase">
            <span class="material-icons-round" style="font-size:1.1rem;">delete</span>
          </button>
        </td>
      </tr>`;
  }).join('');
}

document.getElementById('searchPeserta')?.addEventListener('input', e => {
  const statusFilter = document.getElementById('filterStatus')?.value || 'semua';
  renderTable(e.target.value, statusFilter);
});

document.getElementById('filterStatus')?.addEventListener('change', e => {
  const searchVal = document.getElementById('searchPeserta')?.value || '';
  renderTable(searchVal, e.target.value);
});

/* ──────────────────────────────────────────────────
   ADMIN: IMPORT CSV (LANGSUNG KE FIREBASE)
   ────────────────────────────────────────────────── */
const csvInputEl = document.getElementById('csvInput');
csvInputEl?.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => parseCSV(e.target.result);
  reader.readAsText(file, 'UTF-8');
  this.value = '';
});

async function parseCSV(text) {
  const fb = document.getElementById('importFeedback');
  if (!fb) return;
  const lines = text.split(/\r?\n/).filter(l => l.trim());

  if (lines.length < 2) {
    fb.className = 'alert-bento alert-danger';
    fb.innerHTML = '<span class="material-icons-round">error</span> <span>File CSV kosong atau format header tidak sesuai.</span>';
    fb.style.display = 'flex';
    return;
  }

  let added = 0, skipped = 0, errors = [];
  const newlyAdded = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    const nama = (cols[0] || '').trim();
    const nisn = (cols[1] || '').trim();
    const stat = normalize(cols[2] || '');
    const ket  = (cols[3] || '').trim();

    if (!nama || !nisn) {
      errors.push(`Baris ${i + 1}: Nama atau NISN kosong`);
      skipped++;
      continue;
    }
    if (!['lolos', 'tidak'].includes(stat)) {
      errors.push(`Baris ${i + 1}: Status "${cols[2]}" tidak valid (gunakan 'lolos' atau 'tidak')`);
      skipped++;
      continue;
    }
    if (peserta.find(p => p.nisn.trim() === nisn)) {
      errors.push(`Baris ${i + 1}: NISN ${nisn} sudah ada di database`);
      skipped++;
      continue;
    }

    const item = { nama, nisn, status: stat, keterangan: ket };
    newlyAdded.push(item);
    added++;
  }

  // Simpan data batch langsung ke Firebase
  if (newlyAdded.length > 0) {
    await batchSaveToFirebase(newlyAdded);
  }

  let html = `<span><strong>${added} data peserta</strong> berhasil diimpor ke Firebase.</span>`;
  if (skipped) html += ` <span>(${skipped} data dilewati)</span>`;
  if (errors.length) {
    html += `<ul style="margin-top:.4rem;padding-left:1.2rem;font-size:.78rem;">${errors.slice(0, 4).map(e => `<li>${escapeHtml(e)}</li>`).join('')}${errors.length > 4 ? `<li>...dan ${errors.length - 4} baris lainnya</li>` : ''}</ul>`;
  }

  fb.className = `alert-bento ${added > 0 ? 'alert-success' : 'alert-danger'}`;
  fb.innerHTML = `<span class="material-icons-round">${added > 0 ? 'check_circle' : 'error'}</span> <div>${html}</div>`;
  fb.style.display = 'flex';

  if (added > 0) showToast(`${added} peserta berhasil disimpan ke Firebase!`, 'lolos');
}

function splitCSVLine(line) {
  const res = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQ = !inQ;
    } else if (c === ',' && !inQ) {
      res.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  res.push(cur);
  return res;
}

/* ── Drag & Drop UI ── */
const dropZone = document.getElementById('fileUploadArea');
if (dropZone) {
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
      const reader = new FileReader();
      reader.onload = ev => parseCSV(ev.target.result);
      reader.readAsText(file, 'UTF-8');
    } else {
      showToast('Hanya file spreadsheet berformat .csv yang diterima.', 'danger');
    }
  });
}

/* ──────────────────────────────────────────────────
   ADMIN: EXPORT CSV (DARI DATABASE FIREBASE)
   ────────────────────────────────────────────────── */
document.getElementById('btnExportCSV')?.addEventListener('click', () => {
  if (!peserta.length) {
    showToast('Tidak ada data untuk diekspor.', 'default');
    return;
  }
  const header = 'Nama Lengkap,NISN,Status,Keterangan\n';
  const rows = peserta.map(p =>
    `"${(p.nama || '').replace(/"/g, '""')}","${(p.nisn || '').replace(/"/g, '""')}","${p.status}","${(p.keterangan || '').replace(/"/g, '""')}"`
  ).join('\n');

  const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `peserta_pemilos_smansa_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('File CSV berhasil diunduh dari database Firebase.', 'default');
});

/* ──────────────────────────────────────────────────
   INPUT SANITIZATION (NISN Number-Only)
   ────────────────────────────────────────────────── */
['inputNISN', 'addNISN'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      el.value = el.value.replace(/\D/g, '').slice(0, 10);
    });
  }
});

/* ── Global Initialization ── */
initTheme();
initFirebase();
