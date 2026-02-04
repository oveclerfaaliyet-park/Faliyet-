const API_URL = "https://script.google.com/macros/s/AKfycbw7AXQgZew2qj_q_4n78kUpdmcWWsTGuQd0UOovYZfpzKcPyicxicShDXX7endBgx7lmw/exec";

let aktifSayfa = "";
let seciliIndex = null;
let veriler = [];

function veriGetir(sayfa){
  aktifSayfa = sayfa;
  fetch(API_URL+"?sayfa="+encodeURIComponent(sayfa))
    .then(r=>r.json())
    .then(d=>{
      veriler = d.veriler || [];
      let html = "";
      veriler.forEach((r,i)=>{
        html += `<div class="card" onclick="sec(${i},this)">
          ${r.join(" | ")}
        </div>`;
      });
      document.getElementById("liste").innerHTML = html;
    });
}

function sec(i, el){
  document.querySelectorAll(".card").forEach(c=>c.classList.remove("secili"));
  el.classList.add("secili");
  seciliIndex = i;
}

function kaydet(arr){
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({ sayfa:aktifSayfa, satir:arr })
  }).then(()=>veriGetir(aktifSayfa));
}

function silKayit(){
  if(seciliIndex === null) return alert("Seçili kayıt yok!");
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({ action:"sil", sayfa:aktifSayfa, index:seciliIndex })
  }).then(()=>{
    seciliIndex = null;
    veriGetir(aktifSayfa);
  });
}

function duzenleKayit(yeniArr){
  if(seciliIndex === null) return alert("Seçili kayıt yok!");
  let temp = veriler.slice(); // kopya
  temp[seciliIndex] = yeniArr;
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({ action:"duzenle", sayfa:aktifSayfa, index:seciliIndex, satir:yeniArr })
  }).then(()=>veriGetir(aktifSayfa));
}

// PDF oluşturmak için helper
function pdfOlustur(pdfSayfa, bas, bit){
  fetch(API_URL+"?sayfa="+encodeURIComponent(pdfSayfa))
    .then(r=>r.json())
    .then(d=>{
      let { jsPDF } = window.jspdf;
      let doc = new jsPDF();
      let y = 10;
      d.veriler.forEach(r=>{
        let tarih = r[0] || "";
        if(bas && tarih < bas) return;
        if(bit && tarih > bit) return;
        doc.text(r.join(" | "), 10, y);
        y += 8;
      });
      doc.save(pdfSayfa+".pdf");
    });
}

// Resim ve video işleme
function fileToDataURL(file, callback){
  let reader = new FileReader();
  reader.onload = ()=>callback(reader.result);
  reader.readAsDataURL(file);
}

// Duvar kağıdı uygulama
function applyTheme(key){
  let bg = localStorage.getItem("bg_"+key);
  if(bg) document.body.style.backgroundImage = "url("+bg+")";
}

// Splash video
function playSplash(){
  let v = localStorage.getItem("splash");
  if(!v) return;
  let splash = document.getElementById("splash");
  let splashVideo = document.getElementById("splashVideo");
  splashVideo.src = v;
  splash.classList.remove("hidden");
  splashVideo.onended = ()=>splash.classList.add("hidden");
}
