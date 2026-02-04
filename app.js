const API_URL = "https://script.google.com/macros/s/AKfycbw7AXQgZew2qj_q_4n78kUpdmcWWsTGuQd0UOovYZfpzKcPyicxicShDXX7endBgx7lmw/exec";

// KAYIT
function kaydet(sayfa, alanlar) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      sayfa: sayfa,
      satir: alanlar
    })
  })
  .then(r => r.json())
  .then(d => {
    if (d.durum == "ok") {
      alert("Kayıt Başarılı");
      location.reload();
    } else {
      alert(d.mesaj);
    }
  })
  .catch(err => alert("Bağlantı hatası"));
}

// LİSTE
function veriGetir(sayfa, hedef) {
  fetch(API_URL + "?sayfa=" + encodeURIComponent(sayfa))
    .then(r => r.json())
    .then(d => {
      let html = "";
      d.veriler.forEach(row => {
        html += "<tr>" + row.map(x => `<td>${x}</td>`).join("") + "</tr>";
      });
      document.getElementById(hedef).innerHTML = html;
    });
}

// Saat
function saatBaslat() {
  setInterval(()=>{
    document.getElementById("saat").innerText = new Date().toLocaleString();
  },1000);
}

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
