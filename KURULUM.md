# 🚀 sosyaltesisrezervasyon.netlify.app — Kurulum Rehberi

## Proje Yapısı
```
sosyaltesis/
├── public/
│   ├── index.html      ← Ana sayfa (kayıt formu)
│   ├── forum.html      ← Forum / sohbet
│   ├── tesisler.html   ← Tüm tesisler listesi
│   ├── gizlilik.html   ← Gizlilik politikası
│   ├── style.css       ← Ortak stiller
│   └── app.js          ← Ortak JavaScript
└── netlify.toml        ← Netlify ayarları
```

---

## ADIM 1 — GitHub'a Yükle

1. https://github.com → Yeni hesap aç (varsa giriş yap)
2. "New repository" → İsim: `sosyaltesis` → Public → Create
3. Bilgisayarında bu klasörü aç
4. Sağ tık → "Git Bash Here" veya terminal aç
5. Şunları sırayla yaz:
```
git init
git add .
git commit -m "ilk yükleme"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/sosyaltesis.git
git push -u origin main
```

---

## ADIM 2 — Netlify'a Bağla

1. https://netlify.com → Ücretsiz hesap aç
2. "Add new site" → "Import from Git" → GitHub seç
3. `sosyaltesis` reposunu seç
4. Build ayarları otomatik gelir (netlify.toml sayesinde)
5. "Deploy site" → Birkaç saniye sonra site canlı!

---

## ADIM 3 — Özel İsim Ver

1. Netlify dashboard → "Site settings" → "Change site name"
2. Yaz: `sosyaltesisrezervasyon`
3. Adresin olur: **sosyaltesisrezervasyon.netlify.app** ✅

---

## ADIM 4 — Mail Sistemi Kur (Gerçek Bildirimler)

Şu an form verileri localStorage'a kaydoluyor (demo).
Gerçek mail göndermek için:

### Seçenek A — Formspree (En kolay, ücretsiz)
1. https://formspree.io → Ücretsiz hesap
2. Yeni form oluştur → Form ID al (örn: `xrgvkjpq`)
3. `app.js` içinde `submitForm()` fonksiyonuna şunu ekle:
```javascript
// submitForm() içine, localStorage satırından sonra:
fetch('https://formspree.io/f/FORM_ID_BURAYA', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, phone, tesisler: selNames.join(', ') })
});
```
4. Formspree her kayıt olduğunda sana bildirim maili atar.

### Seçenek B — Netlify Forms (Daha gelişmiş)
`index.html` form tagine `data-netlify="true"` ekle.
Netlify otomatik toplar, dashboard'dan görürsün.

---

## ADIM 5 — IBB Takip Motoru (Gerçek Boşluk Tespiti)

Referans aldığın sitedeki (ibb-tesis-rezervasyon.vercel.app) gibi
otomatik kontrol için Google Apps Script kullan:

1. https://script.google.com → Yeni proje
2. Önceki konuşmada üretilen kodu yapıştır
3. Tetikleyici: her 5 dakikada → `kontrol` fonksiyonu
4. Script IBB sitesini tarar, boşluk bulunca Formspree üzerinden
   kayıtlı kullanıcılara toplu mail atar.

---

## Site Özellikleri

| Özellik | Durum |
|---|---|
| Ana sayfa + kayıt formu | ✅ Hazır |
| 17 tesis listesi + arama | ✅ Hazır |
| Max 5 tesis seçimi | ✅ Hazır |
| Forum + yanıtlama + beğeni | ✅ Hazır |
| Ekran pop-up bildirimi | ✅ Hazır (demo) |
| WhatsApp seçeneği | ✅ UI hazır |
| Gizlilik sayfası | ✅ Hazır |
| Mobil uyumlu | ✅ Hazır |
| Gerçek mail gönderimi | ⚙️ Formspree ile 5dk kurulum |
| IBB otomatik tarama | ⚙️ Google Apps Script ile |

---

Sorular için forumu kullan! 🙌
