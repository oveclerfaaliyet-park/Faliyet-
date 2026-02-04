const API_URL = "https://script.google.com/macros/s/AKfycbw7AXQgZew2qj_q_4n78kUpdmcWWsTGuQd0UOovYZfpzKcPyicxicShDXX7endBgx7lmw/exec";

let aktifSayfa = "";
let seciliIndex = null;

function veriGetir(sayfa){
  aktifSayfa = sayfa;
  fetch(API_URL+"?sayfa="+encodeURIComponent(sayfa))
  .then(r=>r.json()).then(d=>{
    let html="";
    d.veriler.forEach((r,i)=>{
      html+=`<div class="card" onclick="sec(${i},this)">
        ${r.join(" | ")}
      </div>`;
    });
    liste.innerHTML = html;
  });
}

function sec(i,el){
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
  if(seciliIndex==null) return alert("Seçim yok");
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({ action:"sil", sayfa:aktifSayfa, index:seciliIndex })
  }).then(()=>veriGetir(aktifSayfa));
}
