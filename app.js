const SCRIPT_URL="https://script.google.com/macros/s/AKfycbw7AXQgZew2qj_q_4n78kUpdmcWWsTGuQd0UOovYZfpzKcPyicxicShDXX7endBgx7lmw/exec";

// Sayfa geçişi
function showPage(page){
    const content=document.getElementById("content");
    content.innerHTML="";
    if(page==="Park Faliyet") loadParkFaliyet(content);
    else if(page==="Personel") loadPersonel(content);
    else if(page==="Evrak") loadEvrak(content);
    else if(page==="Ayarlar") loadAyarlar(content);
}

// --- Resim küçültme ---
function resizeImage(file,maxWidth=800){
    return new Promise(resolve=>{
        const img=new Image();
        const reader=new FileReader();
        reader.onload=e=>{ img.src=e.target.result; };
        img.onload=()=>{
            const scale=Math.min(maxWidth/img.width,1);
            const canvas=document.createElement("canvas");
            canvas.width=img.width*scale;
            canvas.height=img.height*scale;
            const ctx=canvas.getContext("2d");
            ctx.drawImage(img,0,0,canvas.width,canvas.height);
            resolve(canvas.toDataURL("image/png"));
        };
        reader.readAsDataURL(file);
    });
}

// Drive'a yükle
async function saveFileToDrive(base64,name){
    const res=await fetch(SCRIPT_URL,{
        method:"POST",
        body: JSON.stringify({action:"upload",fileData:base64,fileName:name})
    });
    const data=await res.json();
    return data.url || null;
}

// Veri çek
async function loadData(sayfa){
    const res=await fetch(`${SCRIPT_URL}?sayfa=${sayfa}`);
    const data=await res.json();
    if(data.durum==="ok"){
        if(sayfa==="Park Faliyet") renderParkList(data.veriler);
        else if(sayfa==="Personel") renderPersonelList(data.veriler);
        else if(sayfa==="Evrak") renderEvrakList(data.veriler);
    }
}

// --- Park Faliyet ---
function loadParkFaliyet(content){
    content.innerHTML=`
    <h2>Park Faliyet</h2>
    <label>Tarih:</label><input type="datetime-local" id="tarihPF"><br>
    <label>Açıklama:</label><textarea id="aciklamaPF"></textarea><br>
    <label>Resim 1:</label><input type="file" id="resim1" accept="image/*"><br>
    <label>Resim 2:</label><input type="file" id="resim2" accept="image/*"><br>
    <button onclick="saveParkFaliyet()">Kaydet</button>
    <div id="parkList"></div>
    `;
    loadData("Park Faliyet");
}

async function saveParkFaliyet(){
    const r1=document.getElementById("resim1")?.files[0];
    const r2=document.getElementById("resim2")?.files[0];
    const tarih=document.getElementById("tarihPF").value;
    const aciklama=document.getElementById("aciklamaPF").value;

    alert("E-tabloya kaydediliyor...");
    const urls = await Promise.all([
        r1?saveFileToDrive(await resizeImage(r1,800),r1.name):null,
        r2?saveFileToDrive(await resizeImage(r2,800),r2.name):null
    ]);
    const satir=[tarih,aciklama,urls[0],urls[1]];
    await fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({sayfa:"Park Faliyet",satir})});
    alert("Kaydedildi!");
    loadData("Park Faliyet");
}

function renderParkList(veriler){
    const container=document.getElementById("parkList");
    container.innerHTML="";
    veriler.forEach((row,i)=>{
        const div=document.createElement("div");
        div.className="listItem";
        div.innerHTML=`
        <img src="${row[2]||''}" width="80" height="80">
        <img src="${row[3]||''}" width="80" height="80">
        <span>${row[0]} - ${row[1]}</span>
        <button onclick="deleteRow('Park Faliyet',${i})">Sil</button>
        `;
        container.appendChild(div);
    });
}

// --- Personel ---
function loadPersonel(content){
    content.innerHTML=`
    <h2>Personel</h2>
    <label>Ad Soyad:</label><input id="adSoyad"><br>
    <label>Başlangıç:</label><input type="date" id="basT"><br>
    <label>Bitiş:</label><input type="date" id="bitT"><br>
    <label>Açıklama:</label><textarea id="aciklamaP"></textarea><br>
    <label>Resim:</label><input type="file" id="resimP" accept="image/*"><br>
    <button onclick="savePersonel()">Kaydet</button>
    <div id="personelList"></div>
    `;
    loadData("Personel");
}

async function savePersonel(){
    const r=document.getElementById("resimP")?.files[0];
    const ad=document.getElementById("adSoyad").value;
    const bas=document.getElementById("basT").value;
    const bit=document.getElementById("bitT").value;
    const aciklama=document.getElementById("aciklamaP").value;

    alert("E-tabloya kaydediliyor...");
    const url = r?await saveFileToDrive(await resizeImage(r,800),r.name):null;
    const satir=[ad,bas,bit,aciklama,url];
    await fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({sayfa:"Personel",satir})});
    alert("Kaydedildi!");
    loadData("Personel");
}

function renderPersonelList(veriler){
    const container=document.getElementById("personelList");
    container.innerHTML="";
    veriler.forEach((row,i)=>{
        const div=document.createElement("div");
        div.className="listItem";
        div.innerHTML=`
        <img src="${row[4]||''}" width="80" height="80">
        <span>${row[0]} - ${row[1]} / ${row[2]} - ${row[3]}</span>
        <button onclick="deleteRow('Personel',${i})">Sil</button>
        `;
        container.appendChild(div);
    });
}

// --- Evrak ---
function loadEvrak(content){
    content.innerHTML=`
    <h2>Evrak</h2>
    <label>Tarih:</label><input type="datetime-local" id="tarihE"><br>
    <label>Açıklama:</label><textarea id="aciklamaE"></textarea><br>
    <label>Gelen/Giden:</label>
    <select id="turE"><option>Gelen</option><option>Giden</option></select><br>
    <label>Resim:</label><input type="file" id="resimE" accept="image/*"><br>
    <button onclick="saveEvrak()">Kaydet</button>
    <div id="evrakList"></div>
    `;
    loadData("Evrak");
}

async function saveEvrak(){
    const r=document.getElementById("resimE")?.files[0];
    const tarih=document.getElementById("tarihE").value;
    const aciklama=document.getElementById("aciklamaE").value;
    const tur=document.getElementById("turE").value;

    alert("E-tabloya kaydediliyor...");
    const url = r?await saveFileToDrive(await resizeImage(r,800),r.name):null;
    const satir=[tarih,aciklama,tur,url];
    await fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({sayfa:"Evrak",satir})});
    alert("Kaydedildi!");
    loadData("Evrak");
}

function renderEvrakList(veriler){
    const container=document.getElementById("evrakList");
    container.innerHTML="";
    veriler.forEach((row,i)=>{
        const div=document.createElement("div");
        div.className="listItem";
        div.innerHTML=`
        <img src="${row[3]||''}" width="80" height="80">
        <span>${row[0]} - ${row[1]} (${row[2]})</span>
        <button onclick="deleteRow('Evrak',${i})">Sil</button>
        `;
        container.appendChild(div);
    });
}

// --- Silme ---
async function deleteRow(sayfa,index){
    if(!confirm("Silmek istediğinize emin misiniz?")) return;
    await fetch(SCRIPT_URL,{method:"POST",body:JSON.stringify({sayfa,index,action:"sil"})});
    loadData(sayfa);
}

// --- Ayarlar ---
function loadAyarlar(content){
    content.innerHTML = `
    <h2>Ayarlar</h2>
    <div class="settingGroup">
      <h3>Video Ayarları</h3>
      <label>Açılış Videosu:</label><input type="file" id="acilisVideo" accept="video/*"><br>
      <label>Ekran Koruyucu:</label><input type="file" id="ekranKoruyucu" accept="video/*"><br>
    </div>
    <div class="settingGroup">
      <h3>Duvar Kağıdı</h3>
      <label>Park Faliyet:</label><input type="file" id="parkWallpaper" accept="image/*"><br>
      <label>Personel:</label><input type="file" id="personelWallpaper" accept="image/*"><br>
      <label>Evrak:</label><input type="file" id="evrakWallpaper" accept="image/*"><br>
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

function saveSettings(){
    const keys=["acilisVideo","ekranKoruyucu","parkWallpaper","personelWallpaper","evrakWallpaper"];
    keys.forEach(k=>{
        const input=document.getElementById(k);
        if(input && input.files.length){
            resizeImage(input.files[0],800).then(base64=>{
                localStorage.setItem(k,base64);
                alert(k+" kaydedildi!");
            });
        }
    });
}

function createPdf(){
    const bas=document.getElementById("pdfBas").value;
    const bit=document.getElementById("pdfBit").value;
    const sayfa=document.getElementById("pdfSayfa").value;
    window.open(`pdf.html?bas=${bas}&bit=${bit}&sayfa=${sayfa}`,"_blank");
}
