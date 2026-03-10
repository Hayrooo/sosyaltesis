const TESISLER = [
  {id:1,  name:"Altınboynuz Sosyal Tesisi",      il:"Eyüpsultan"},
  {id:2,  name:"Beykoz Sahil Sosyal Tesisi",     il:"Beykoz"},
  {id:3,  name:"Beykoz Koru Sosyal Tesisi",      il:"Beykoz"},
  {id:4,  name:"Cihangir Sosyal Tesisi",         il:"Beyoğlu"},
  {id:5,  name:"Çamlıca Sosyal Tesisi",          il:"Üsküdar"},
  {id:6,  name:"Dragos Sosyal Tesisi",           il:"Kartal"},
  {id:7,  name:"Fethipaşa Sosyal Tesisleri",     il:"Üsküdar"},
  {id:8,  name:"Florya Sosyal Tesisleri",        il:"Bakırköy"},
  {id:9,  name:"Gözdağı Sosyal Tesisi",          il:"Pendik"},
  {id:10, name:"Haliç Sosyal Tesisi",            il:"Fatih"},
  {id:11, name:"İstinye Sosyal Tesisi",          il:"Sarıyer"},
  {id:12, name:"Kasımpaşa Sosyal Tesisi",        il:"Kasımpaşa"},
  {id:13, name:"Küçük Çamlıca Sosyal Tesisi",   il:"Üsküdar"},
  {id:14, name:"Küçükçekmece Sosyal Tesisi",     il:"Küçükçekmece"},
  {id:15, name:"Pembe Köşk Sosyal Tesisi",       il:"Sarıyer"},
  {id:16, name:"Safa Tepesi Sosyal Tesisi",      il:"Sancaktepe"},
  {id:17, name:"Sultanbeyli Gölet Sosyal Tesisi",il:"Sultanbeyli"},
];

let selected = new Set();
let kvkkOk = false;
let notifTesisId = null;

function initIndex() {
  // Simüle kullanıcı sayısı
  const el = document.getElementById('stat-users');
  if (el) el.textContent = (Math.floor(Math.random()*400)+1100).toLocaleString('tr-TR');

  renderList();

  const search = document.getElementById('tesis-search');
  if (search) search.addEventListener('input', e => renderList(e.target.value));
}

function renderList(filter='') {
  const list = document.getElementById('tesis-list');
  if (!list) return;
  const q = filter.toLowerCase().replace(/ı/g,'i').replace(/İ/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c');
  list.innerHTML = '';
  TESISLER
    .filter(t => {
      const n = t.name.toLowerCase().replace(/ı/g,'i').replace(/İ/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c');
      const il = t.il.toLowerCase().replace(/ı/g,'i').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ö/g,'o').replace(/ç/g,'c');
      return n.includes(q) || il.includes(q);
    })
    .forEach(t => {
      const isSel = selected.has(t.id);
      const isDis = selected.size >= 5 && !isSel;
      const item = document.createElement('div');
      item.className = 'tesis-item' + (isSel?' selected':'') + (isDis?' disabled':'');
      item.dataset.id = t.id;
      item.innerHTML = `
        <div class="tesis-checkbox">✓</div>
        <div class="tesis-info">
          <div class="tesis-name">${t.name}</div>
          <div class="tesis-loc">📍 ${t.il}</div>
        </div>
        <a class="tesis-link" href="https://tesislerrezervasyon.ibb.istanbul/reservation/create/${t.id}" target="_blank" onclick="event.stopPropagation()">↗</a>
      `;
      if (!isDis) item.addEventListener('click', () => toggleTesis(t.id));
      list.appendChild(item);
    });
}

function toggleTesis(id) {
  if (selected.has(id)) { selected.delete(id); }
  else {
    if (selected.size >= 5) { flashLimit(); return; }
    selected.add(id);
  }
  const sc = document.getElementById('sel-count');
  if (sc) sc.textContent = selected.size + ' / 5';
  renderList(document.getElementById('tesis-search')?.value || '');
}

function flashLimit() {
  const el = document.getElementById('sel-count');
  if (!el) return;
  el.style.color = 'var(--red)';
  el.textContent = '⚠️ Max 5!';
  setTimeout(() => { el.style.color=''; el.textContent=selected.size+' / 5'; }, 1800);
}

function toggleChip(el) {
  if (el.classList.contains('locked')) return;
  el.classList.toggle('on');
}

function toggleKvkk() {
  kvkkOk = !kvkkOk;
  document.getElementById('kvkk-row').classList.toggle('checked', kvkkOk);
}

function showErr(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('show', show);
}

function submitForm() {
  const email = document.getElementById('f-email').value.trim();
  let ok = true;
  const emailOk = email && email.includes('@') && email.includes('.');
  showErr('err-email', !emailOk); if (!emailOk) ok = false;
  showErr('err-tesis', selected.size === 0); if (selected.size === 0) ok = false;
  showErr('err-kvkk', !kvkkOk); if (!kvkkOk) ok = false;
  if (!ok) return;

  const phone = document.getElementById('f-phone').value.trim();
  const wantWp = document.getElementById('chip-wp').classList.contains('on');
  const wantPopup = document.getElementById('chip-popup').classList.contains('on');
  const selNames = [...selected].map(id => TESISLER.find(t=>t.id===id).name);

  // Kayıt (demo: localStorage — gerçekte API)
  const subs = JSON.parse(localStorage.getItem('subs')||'[]');
  subs.push({ email, phone, tesisler:[...selected], wp:wantWp, popup:wantPopup, tarih:new Date().toISOString() });
  localStorage.setItem('subs', JSON.stringify(subs));

  // Başarı göster
  document.getElementById('form-card').style.display = 'none';
  const sc = document.getElementById('success-card');
  sc.style.display = 'block';
  document.getElementById('success-detail').innerHTML = `
    <div class="detail-row"><span>E-posta</span><span>${email}</span></div>
    <div class="detail-row"><span>WhatsApp</span><span>${phone||'—'}</span></div>
    <div class="detail-row"><span>Tesisler</span><span>${selNames.join(', ')}</span></div>
    <div class="detail-row"><span>Bildirim</span><span>Mail${wantWp?' + WhatsApp':''}${wantPopup?' + Ekran':''}</span></div>
  `;

  // Demo popup
  if (wantPopup) {
    const rId = [...selected][0];
    notifTesisId = rId;
    setTimeout(() => {
      const t = TESISLER.find(x=>x.id===rId);
      document.getElementById('popup-body').textContent = t.name + ' — boşluk çıktı! (Demo bildirim)';
      document.getElementById('popup-time').textContent = 'Az önce · Sosyal Tesis Takip';
      document.getElementById('popup').classList.add('show');
      setTimeout(() => closePopup(), 10000);
    }, 2500);
  }
}

function closePopup() {
  const p = document.getElementById('popup');
  if (p) p.classList.remove('show');
}

function goRezervasyon() {
  window.open('https://tesislerrezervasyon.ibb.istanbul/reservation/create/'+(notifTesisId||1),'_blank');
  closePopup();
}

function resetForm() {
  selected.clear(); kvkkOk = false;
  document.getElementById('f-email').value = '';
  document.getElementById('f-phone').value = '';
  document.getElementById('kvkk-row').classList.remove('checked');
  document.getElementById('form-card').style.display = 'block';
  document.getElementById('success-card').style.display = 'none';
  document.getElementById('sel-count').textContent = '0 / 5';
  renderList();
}
