// Başlangıç: localStorage yoksa boş dizi oluştur
if(!localStorage.getItem("kayitlar")){
  localStorage.setItem("kayitlar", JSON.stringify([]));
}

// Menü aç/kapat
function menuAc(){document.getElementById("anaMenu").style.display="block";}
function menuKapat(){document.getElementById("anaMenu").style.display="none";}

// Sayfa geçiş
function sayfaGec(sayfa){
  document.getElementById("anasayfaDiv").style.display="none";
  document.getElementById("kayitDiv").style.display="none";
  document.getElementById("ayarlarDiv").style.display="none";
  if(sayfa==='anasayfa') filitrele();
  if(sayfa==='anasayfa') document.getElementById("anasayfaDiv").style.display="block";
  if(sayfa==='kayit') document.getElementById("kayitDiv").style.display="block";
  if(sayfa==='ayarlar'){document.getElementById("ayarlarDiv").style.display="block"; sonGuncellemeGoster();}
}

// Kayıt ekleme
function kayitEkle(){
  const tarih=document.getElementById("kayitTarih").value;
  const konu=document.getElementById("kayitKonu").value;
  const files=document.getElementById("kayitResim").files;
  if(!tarih || !konu){alert("Tarih ve konu gerekli!"); return;}
  const resimler=[];
  for(let i=0;i<files.length;i++){
    resimler.push("kayıtlar/"+files[i].name);
    // Telefon veya PC tarafında buraya kopyalama yapılması gerekiyor
  }
  const kayit={tarih,konu,resimler,timestamp:new Date().toLocaleString()};
  const kayitlar=JSON.parse(localStorage.getItem("kayitlar")||"[]");
  kayitlar.push(kayit);
  localStorage.setItem("kayitlar", JSON.stringify(kayitlar));
  alert("Kayıt eklendi!");
  sayfaGec('anasayfa');
}

// Kartları listeleme ve filtreleme
function filitrele(){
  const arama=document.getElementById("aramaInput").value.toLowerCase();
  const container=document.getElementById("kartContainer");
  container.innerHTML="";
  let kayitlar=JSON.parse(localStorage.getItem("kayitlar")||"[]");
  if(arama) kayitlar=kayitlar.filter(k=>k.tarih.toLowerCase().includes(arama)||k.konu.toLowerCase().includes(arama));
  kayitlar.forEach((k,i)=>{
    const kart=document.createElement("div"); 
    kart.className="kart";
    k.resimler.forEach(r=>{const img=document.createElement("img"); img.src=r; img.width=500; kart.appendChild(img)});
    const info=document.createElement("div");
    info.className="kartInfo";
    info.innerHTML=`<p><strong>Tarih:</strong> ${k.tarih}</p><p><strong>Konu:</strong> ${k.konu}</p>`;
    kart.appendChild(info);
    container.appendChild(kart);
  });
}

// Son güncelleme göster
function sonGuncellemeGoster(){
  const kayitlar=JSON.parse(localStorage.getItem("kayitlar")||"[]");
  const son=kayitlar.length?kayitlar[kayitlar.length-1].timestamp:"-";
  document.getElementById("sonGuncelleme").innerText="Son güncelleme: "+son;
}

// Dışa/içe aktar
function disarAktar(){alert("JSON ve kayıtlar klasörünü kopyalayın.");}
function iceriAl(){alert("Başka cihazdan JSON ve kayıtlar klasörünü buraya kopyalayın.");}

// Sayfa yüklendiğinde ana ekran
document.addEventListener("DOMContentLoaded",()=>{sayfaGec('anasayfa')});
