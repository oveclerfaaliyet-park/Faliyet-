// DEPLOY_URL → Apps Script’in en son deploy URL’si
const DEPLOY_URL = "https://script.google.com/macros/s/AKfycbxKIVZEkKWNguUY8CWmdc_poxJA5HA_RzboKZq8JmhFW7Hqfk6cQxzN8m2eD6lgsyZ-MA/exec";

// Dosya → Base64
function readFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) { resolve(""); return; }
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

// Kaydet fonksiyonu
async function saveRecord() {
  let tarih = document.getElementById('date').value;
  let desc = document.getElementById('desc').value;
  let resim1 = await readFile(document.getElementById('img1').files[0]);
  let resim2 = await readFile(document.getElementById('img2').files[0]);

  if (!tarih || !desc) { alert("Tarih ve açıklama gerekli"); return; }

  fetch(DEPLOY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tarih, aciklama: desc, resim1, resim2 })
  })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        alert("Kaydedildi!");
        document.getElementById('date').value = "";
        document.getElementById('desc').value = "";
        document.getElementById('img1').value = "";
        document.getElementById('img2').value = "";
      } else {
        alert("Hata: " + res.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Hata oluştu. Konsolu kontrol et.");
    });
}

// HTML’deki butona event ekle
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById('saveBtn');
  if (btn) btn.addEventListener('click', saveRecord);
});
