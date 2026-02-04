const SCRIPT_URL="https://script.google.com/macros/s/AKfycbw7AXQgZew2qj_q_4n78kUpdmcWWsTGuQd0UOovYZfpzKcPyicxicShDXX7endBgx7lmw/exec";
const FOLDER_ID="1xmTD_y26fjXhIJiXbDvh5C9ozvDPDPPD"; // Drive klasör

// Sayfa geçişi
function showPage(page){
    const content=document.getElementById("content");
    content.innerHTML="";
    if(page==="Park Faliyet") loadParkFaliyet(content);
    else if(page==="Personel") loadPersonel(content);
    else if(page==="Evrak") loadEvrak(content);
    else if(page==="Ayarlar") loadAyarlar(content);
}

// Dosyayı base64'e çevir
function toBase64(file){
    return new Promise(resolve=>{
        const reader=new FileReader();
        reader.onload=(e)=>resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

// Drive'a kaydet
async function saveFileToDrive(base64, name){
    const res = await fetch(SCRIPT_URL, {
        method:"POST",
        body: JSON.stringify({ action:"upload", fileData:base64, fileName:name })
    });
    const data = await res.json();
    return data.url || null;
}

// Ayarlar sayfası (dinamik)
function loadAyarlar(content){
    content.innerHTML = `
    <h2>Ayarlar</h2>
    <div class="settingGroup">
      <h3>Video Ayarları</h3>
      <label for="acilisVideo">Açılış Videosu:</label>
      <input type="file" id="acilisVideo" accept="video/*">
      <label for="ekranKoruyucu">Ekran Koruyucu Videosu:</label>
      <input type="file" id="ekranKoruyucu" accept="video/*">
    </div>
    <div class="settingGroup">
      <h3>Duvar Kağıdı Seçimi</h3>
      <label for="parkWallpaper">Park Faliyet:</label>
      <input type="file" id="parkWallpaper" accept="image/*">
      <label for="personelWallpaper">Personel:</label>
      <input type="file" id="personelWallpaper" accept="image/*">
      <label for="evrakWallpaper">Evrak:</label>
      <input type="file" id="evrakWallpaper" accept="image/*">
    </div>
    <div class="settingGroup">
      <h3>PDF Oluştur</h3>
      Başlangıç: <input type="date" id="pdfBas"><br>
      Bitiş: <input type="date" id="pdfBit"><br>
      Sayfa: <select id="pdfSayfa">
        <option>Park Faliyet</option>
        <option>Personel</option>
        <option>Evrak</option>
      </select><br>
      <button onclick="createPdf()">PDF Önizleme</button>
    </div>
    <button onclick="saveSettings()">Ayarları Kaydet</button>
    `;
}

// PDF oluştur
function createPdf(){
    const bas=document.getElementById("pdfBas").value;
    const bit=document.getElementById("pdfBit").value;
    const sayfa=document.getElementById("pdfSayfa").value;
    window.open(`pdf.html?bas=${bas}&bit=${bit}&sayfa=${sayfa}`,"_blank");
}

// Ayarlar kaydet
function saveSettings(){
    const keys=["acilisVideo","ekranKoruyucu","parkWallpaper","personelWallpaper","evrakWallpaper"];
    keys.forEach(k=>{
        const input=document.getElementById(k);
        if(input && input.files.length){
            toBase64(input.files[0]).then(base64=>{
                localStorage.setItem(k,base64);
                alert(k+" kaydedildi!");
            });
        }
    });
}

// Veri çekme ve listeleme
async function loadData(sayfa){
    const res=await fetch(`${SCRIPT_URL}?sayfa=${sayfa}`);
    const data=await res.json();
    console.log(data);
}

// Park Faliyet ekleme
async function saveParkFaliyet(){
    const r1=document.getElementById("resim1")?.files[0];
    const r2=document.getElementById("resim2")?.files[0];
    const tarih=document.getElementById("tarihPF").value;
    const aciklama=document.getElementById("aciklamaPF").value;
    alert("E-tabloya kaydediliyor...");
    const url1=r1?await saveFileToDrive(await toBase64(r1),r1.name):null;
    const url2=r2?await saveFileToDrive(await toBase64(r2),r2.name):null;
    const satir=[tarih,aciklama,url1,url2];
    await fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({sayfa:"Park Faliyet",satir})});
    alert("Kaydedildi!");
    loadData("Park Faliyet");
}

// Personel ekleme
async function savePersonel(){
    const r=document.getElementById("resimP")?.files[0];
    const ad=document.getElementById("adSoyad").value;
    const bas=document.getElementById("basT").value;
    const bit=document.getElementById("bitT").value;
    const aciklama=document.getElementById("aciklamaP").value;
    alert("E-tabloya kaydediliyor...");
    const url=r?await saveFileToDrive(await toBase64(r),r.name):null;
    const satir=[ad,bas,bit,aciklama,url];
    await fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({sayfa:"Personel",satir})});
    alert("Kaydedildi!");
    loadData("Personel");
}

// Evrak ekleme
async function saveEvrak(){
    const r=document.getElementById("resimE")?.files[0];
    const tarih=document.getElementById("tarihE").value;
    const aciklama=document.getElementById("aciklamaE").value;
    const tur=document.getElementById("turE").value;
    alert("E-tabloya kaydediliyor...");
    const url=r?await saveFileToDrive(await toBase64(r),r.name):null;
    const satir=[tarih,aciklama,tur,url];
    await fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({sayfa:"Evrak",satir})});
    alert("Kaydedildi!");
    loadData("Evrak");
}    alert("Kaydedildi!");
    loadData("Evrak");
}
