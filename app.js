const API_URL = "https://script.google.com/macros/s/AKfycbw7AXQgZew2qj_q_4n78kUpdmcWWsTGuQd0UOovYZfpzKcPyicxicShDXX7endBgx7lmw/exec";

let seciliIndex = null;
let aktifSayfa = "";

function veriGetir(sayfa){
  aktifSayfa = sayfa;
  fetch(API_URL+"?sayfa="+encodeURIComponent(sayfa))
  .then(r=>r.json()).then(d=>{
    renderListe(d.veriler);
  });
}

function renderListe(veriler){
  let html="";
  veriler.forEach((r,i)=>{
    html+=`
    <div class="card" onclick="sec(${i},this)">
      <b>${r[0]}</b><br>
      ${r.slice(1).join(" - ")}
    </div>`;
  });
  document.getElementById("liste").innerHTML=html;
}

function sec(i,el){
  document.querySelectorAll(".card").forEach(c=>c.classList.remove("secili"));
  el.classList.add("secili");
  seciliIndex=i;
}

function kaydet(alanlar){
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({ sayfa:aktifSayfa, satir:alanlar })
  }).then(()=>veriGetir(aktifSayfa));
}

function sil(){
  if(seciliIndex==null) return alert("Seçim yok");
  if(!confirm("Silinsin mi?")) return;

  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({ action:"sil", sayfa:aktifSayfa, index:seciliIndex })
  }).then(()=>veriGetir(aktifSayfa));
}
