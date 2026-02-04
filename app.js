const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw7AXQgZew2qj_q_4n78kUpdmcWWsTGuQd0UOovYZfpzKcPyicxicShDXX7endBgx7lmw/exec";
const FOLDER_ID = "1xmTD_y26fjXhIJiXbDvh5C9ozvDPDPPD";

// ------------------ VERİ ÇEKME ------------------
async function loadData(sayfa){
    const listEl = document.getElementById("list");
    if(!listEl) return;
    listEl.innerHTML = "Yükleniyor...";
    try{
        const res = await fetch(`${SCRIPT_URL}?sayfa=${encodeURIComponent(sayfa)}`);
        const data = await res.json();
        if(data.durum!="ok") throw data.mesaj;
        renderList(data.veriler,sayfa);
    }catch(err){
        listEl.innerHTML = "Hata: "+err;
    }
}

// ------------------ LİSTELEME ------------------
function renderList(veriler,sayfa){
    const listEl = document.getElementById("list");
    listEl.innerHTML = "";
    veriler.forEach((row,index)=>{
        const div = document.createElement("div");
        div.className = "listItem";

        if(row[0]){
            const img = document.createElement("img");
            img.src = row[0];
            img.width=80; img.height=80;
            img.onclick=()=>openModal(row);
            div.appendChild(img);
        }

        const info = document.createElement("div");
        info.className = "info";
        info.innerHTML = `<b>Tarih:</b> ${row[1] || ""} <br> <b>Açıklama:</b> ${row[2] || ""}`;
        div.appendChild(info);

        const chk = document.createElement("input");
        chk.type="checkbox"; chk.dataset.index=index;
        div.appendChild(chk);

        listEl.appendChild(div);
    });
}

// ------------------ MODAL ------------------
function openModal(row){
    const modal = document.createElement("div");
    modal.className="modal";
    modal.innerHTML=`<div class="modalContent">
        <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
        <img src="${row[0]}" style="max-width:90%; display:block; margin:auto">
        <p><b>Tarih:</b> ${row[1]}</p>
        <p><b>Açıklama:</b> ${row[2]}</p>
    </div>`;
    document.body.appendChild(modal);
}

// ------------------ EKLEME MODAL ------------------
function openAddModal(sayfa,maxImg){
    const modal = document.createElement("div");
    modal.className="modal";
    modal.innerHTML=`<div class="modalContent">
        <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
        <h3>Yeni Kayıt Ekle - ${sayfa}</h3>
        <input type="file" id="resimInput" ${maxImg>1?'multiple':''} accept="image/*"><br>
        Tarih: <input type="date" id="tarihInput"><br>
        Açıklama: <input type="text" id="aciklamaInput"><br>
        <button onclick="saveRecord('${sayfa}',${maxImg})">Kaydet</button>
    </div>`;
    document.body.appendChild(modal);
}

// ------------------ KAYDETME ------------------
async function saveRecord(sayfa,maxImg){
    const input = document.getElementById("resimInput");
    const tarih = document.getElementById("tarihInput").value;
    const aciklama = document.getElementById("aciklamaInput").value;
    if(!input.files.length) return alert("Resim seçin!");

    for(let i=0;i<input.files.length;i++){
        const file = input.files[i];
        const base64 = await toBase64(file);
        const url = await saveFileToDrive(base64,file.name);
        const satir = [url,tarih,aciklama];
        await fetch(SCRIPT_URL,{
            method:"POST",
            body: JSON.stringify({sayfa,satir})
        });
    }
    document.querySelector(".modal").remove();
    loadData(sayfa);
}

// ------------------ BASE64 ------------------
function toBase64(file){
    return new Promise((res,rej)=>{
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=()=>res(reader.result);
        reader.onerror=err=>rej(err);
    });
}

// ------------------ DRIVE KAYIT ------------------
async function saveFileToDrive(base64,name){
    const res = await fetch(`${SCRIPT_URL}?action=save`,{
        method:"POST",
        body: JSON.stringify({fileData:base64,fileName:name})
    });
    const data = await res.json();
    return data.url;
}

// ------------------ SEÇİLENİ SİL ------------------
async function deleteSelected(sayfa){
    const listEl = document.getElementById("list");
    const selected = Array.from(listEl.querySelectorAll("input[type=checkbox]:checked")).map(i=>parseInt(i.dataset.index));
    for(let idx of selected){
        await fetch(SCRIPT_URL,{
            method:"POST",
            body: JSON.stringify({sayfa,action:"sil",index:idx})
        });
    }
    loadData(sayfa);
}

// ------------------ SEÇİLENİ DÜZENLE ------------------
async function editSelected(sayfa){
    const listEl = document.getElementById("list");
    const selected = Array.from(listEl.querySelectorAll("input[type=checkbox]:checked"))
                          .map(i=>parseInt(i.dataset.index));
    if(selected.length!=1) return alert("Lütfen tek kayıt seçin.");

    const idx = selected[0];
    const res = await fetch(`${SCRIPT_URL}?sayfa=${encodeURIComponent(sayfa)}`);
    const data = await res.json();
    if(data.durum!="ok") return alert(data.mesaj);

    const row = data.veriler[idx];

    const modal = document.createElement("div");
    modal.className="modal";
    modal.innerHTML = `<div class="modalContent">
        <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
        <h3>Düzenle - ${sayfa}</h3>
        <img src="${row[0]}" style="width:100px;height:100px; display:block; margin:auto">
        Resim değiştir: <input type="file" id="editResim" accept="image/*"><br>
        Tarih: <input type="date" id="editTarih" value="${row[1]}"><br>
        Açıklama: <input type="text" id="editAciklama" value="${row[2]}"><br>
        <button onclick="saveEdit('${sayfa}',${idx})">Kaydet</button>
    </div>`;
    document.body.appendChild(modal);
}

// ------------------ KAYDET DÜZENLE ------------------
async function saveEdit(sayfa,idx){
    const fileInput = document.getElementById("editResim");
    const tarih = document.getElementById("editTarih").value;
    const aciklama = document.getElementById("editAciklama").value;

    let url = null;
    if(fileInput.files.length){
        const base64 = await toBase64(fileInput.files[0]);
        url = await saveFileToDrive(base64,fileInput.files[0].name);
    }

    const res = await fetch(SCRIPT_URL,{
        method:"POST",
        body: JSON.stringify({
            sayfa,
            action:"duzenle",
            index:idx,
            satir: url ? [url,tarih,aciklama] : [null,tarih,aciklama]
        })
    });
    const data = await res.json();
    if(data.durum!="ok") return alert(data.mesaj);
    document.querySelector(".modal").remove();
    loadData(sayfa);
}

// ------------------ PDF OLUŞTUR ------------------
function pdfOlustur(){
    const bas = document.getElementById("bas").value;
    const bit = document.getElementById("bit").value;
    const sayfa = document.getElementById("pdfSayfa").value;
    window.open(`pdf.html?bas=${bas}&bit=${bit}&sayfa=${sayfa}`,"_blank");
}

// ------------------ AYARLAR ------------------
// Açılış video, ekran koruyucu ve duvar kağıtlarını kaydetmek için
function saveSettings(){
    // TODO: localStorage veya e-tablo kaydı
}
