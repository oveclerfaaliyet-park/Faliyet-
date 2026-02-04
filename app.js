const API_URL = "https://script.google.com/macros/s/AKfycbw7AXQgZew2qj_q_4n78kUpdmcWWsTGuQd0UOovYZfpzKcPyicxicShDXX7endBgx7lmw/exec";

function kaydet(sayfa, alanlar){
  fetch(API_URL,{
    method:"POST",
    body:JSON.stringify({ sayfa:sayfa, satir:alanlar })
  }).then(r=>r.json()).then(d=>{
    if(d.durum=="ok"){ alert("Kayıt başarılı"); location.reload();}
    else alert(d.mesaj);
  });
}

function veriGetir(sayfa, hedef){
  fetch(API_URL+"?sayfa="+encodeURIComponent(sayfa))
  .then(r=>r.json()).then(d=>{
    let h="";
    d.veriler.forEach((row,i)=>{
      h+="<tr>"+row.map(x=>`<td>${x||""}</td>`).join("")+"</tr>";
    });
    document.getElementById(hedef).innerHTML=h;
  });
}

function saatBaslat(){
  setInterval(()=>{
    let s=new Date().toLocaleString();
    let e=document.getElementById("saat");
    if(e) e.innerText=s;
  },1000);
}

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js");
}
