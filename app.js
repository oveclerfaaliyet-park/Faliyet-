const URL = "https://script.google.com/macros/library/d/1ZXDH1DH6Q86C3zazGuE1DaoGSQ1kjq6tPkhBnKkwePF1kwW-Zqnxbz8E/2";

function kaydet(satir){ 
  fetch(URL, {method:"POST", body:JSON.stringify({satir, sayfa:currentSayfa})})
  .then(r=>r.json()).then(res=>veriGetir(currentSayfa));
}

function silKayit(index){
  fetch(URL, {method:"POST", body:JSON.stringify({action:"sil", index, sayfa:currentSayfa})})
  .then(r=>r.json()).then(res=>veriGetir(currentSayfa));
}

function veriGetir(sayfa){
  window.currentSayfa = sayfa;
  fetch(URL+"?sayfa="+sayfa)
  .then(r=>r.json())
  .then(data=>{
    let html = "";
    data.veriler.forEach((v,i)=>html+=`<div class="satir" onclick="selectRow(${i})">${v.join(" | ")}</div>`);
    document.getElementById("liste").innerHTML = html;
  });
}

function selectRow(i){ window.selectedIndex=i; }
