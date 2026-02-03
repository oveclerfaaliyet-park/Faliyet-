const API_URL = 'https://script.google.com/macros/s/AKfycbyBR_99DMqwD_20Wq2Um-_kC3DZ_uJm0bLX9_4ZohxUk1iHxV47tbWBOkF2KbTh1RgeTw/exec';

// Ortak fonksiyonlar
function openScreen(page){ window.location.href = page; }
function goBack(){ window.history.back(); }
function filterTasks(listId, searchId){
    const searchText = document.getElementById(searchId).value.toLowerCase();
    const cards = document.getElementById(listId)?.children || [];
    Array.from(cards).forEach(card=>{
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(searchText)?'':'none';
    });
}

// ------------------ PARK FAALİYET ------------------
function openAddParkPopup(){ document.getElementById('addParkPopup').classList.remove('hidden'); }
function closeAddParkPopup(){ document.getElementById('addParkPopup').classList.add('hidden'); }

function savePark(){
    const tarih = document.getElementById('dpParkDate').value;
    const aciklama = document.getElementById('txtParkDesc').value;
    const img1 = document.getElementById('imgPark1').files[0];
    const img2 = document.getElementById('imgPark2').files[0];

    const files = [img1,img2].filter(f=>f);
    let resimler = [];

    if(files.length === 0){
        postPark();
    } else {
        let processed = 0;
        files.forEach(file=>{
            resizeImage(file,800,800,base64=>{
                resimler.push(base64);
                processed++;
                if(processed === files.length) postPark();
            });
        });
    }

    function postPark(){
        const payload = { tip:'park', tarih, aciklama, resimler };
        postData(payload,res=>{
            if(res.success){
                alert('Park Faaliyet Kaydedildi!');
                closeAddParkPopup();
                loadParkList();
            } else {
                alert('Hata: '+(res.error||'Bilinmeyen'));
            }
        });
    }
}

function loadParkList(){
    fetchData('Park Faaliyet', data=>{
        const lst = document.getElementById('lstPark');
        lst.innerHTML='';
        data.reverse().forEach(task=>{
            lst.appendChild(createTaskCard(task));
        });
    });
}

// ------------------ PERSONEL ------------------
function openAddPersonelPopup(){ document.getElementById('addPersonelPopup').classList.remove('hidden'); }
function closeAddPersonelPopup(){ document.getElementById('addPersonelPopup').classList.add('hidden'); }

function savePersonel(){
    const ad = document.getElementById('txtPersonelName').value;
    const bas = document.getElementById('dpStart').value;
    const bit = document.getElementById('dpEnd').value;
    const aciklama = document.getElementById('txtPersonelDesc').value;
    const img = document.getElementById('imgPersonel').files[0];

    const files = img?[img]:[];
    let resimler=[];

    if(files.length===0){ postPersonel(); } 
    else{
        resizeImage(img,800,800,base64=>{
            resimler.push(base64);
            postPersonel();
        });
    }

    function postPersonel(){
        const payload = { tip:'personel', ad, baslangic:bas, bitis:bit, aciklama, resimler };
        postData(payload,res=>{
            if(res.success){
                alert('Personel Kaydedildi!');
                closeAddPersonelPopup();
                loadPersonelList();
            } else {
                alert('Hata: '+(res.error||'Bilinmeyen'));
            }
        });
    }
}

function loadPersonelList(){
    fetchData('Personel', data=>{
        const lst = document.getElementById('lstPersonel');
        lst.innerHTML='';
        data.reverse().forEach(task=>{
            lst.appendChild(createPersonelCard(task));
        });
    });
}

// ------------------ EVRAK ------------------
function openAddEvrakPopup(){ document.getElementById('addEvrakPopup').classList.remove('hidden'); }
function closeAddEvrakPopup(){ document.getElementById('addEvrakPopup').classList.add('hidden'); }

function saveEvrak(){
    const tarih = document.getElementById('dpEvrakDate').value;
    const aciklama = document.getElementById('txtEvrakDesc').value;
    const tip = document.getElementById('spEvrakType').value;
    const img = document.getElementById('imgEvrak').files[0];

    const files = img?[img]:[];
    let resimler=[];

    if(files.length===0){ postEvrak(); } 
    else{
        resizeImage(img,800,800,base64=>{
            resimler.push(base64);
            postEvrak();
        });
    }

    function postEvrak(){
        const payload = { tip:'evrak', tarih, aciklama, evrakTip:tip, resimler };
        postData(payload,res=>{
            if(res.success){
                alert('Evrak Kaydedildi!');
                closeAddEvrakPopup();
                loadEvrakList();
            } else {
                alert('Hata: '+(res.error||'Bilinmeyen'));
            }
        });
    }
}

function loadEvrakList(){
    fetchData('Evrak Takip', data=>{
        const lstGelen = document.getElementById('lstEvrakGelen');
        const lstGiden = document.getElementById('lstEvrakGiden');
        lstGelen.innerHTML=''; lstGiden.innerHTML='';
        data.reverse().forEach(task=>{
            const card=createEvrakCard(task);
            if(task.GelenGiden==='Gelen') lstGelen.appendChild(card);
            else lstGiden.appendChild(card);
        });
    });
}

// ------------------ Ortak Fonksiyonlar ------------------
function fetchData(sheet,callback){
    fetch(`${API_URL}?sheet=${encodeURIComponent(sheet)}`)
    .then(res=>res.json())
    .then(data=>callback(data))
    .catch(err=>console.error(err));
}

function postData(payload,callback){
    fetch(API_URL,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(payload)
    })
    .then(res=>res.json())
    .then(data=>callback(data))
    .catch(err=>callback({success:false,error:err.message}));
}

function resizeImage(file,maxWidth,maxHeight,callback){
    const reader=new FileReader();
    reader.onload=e=>{
        const img=new Image();
        img.onload=function(){
            const canvas=document.createElement('canvas');
            let w=img.width,h=img.height;
            if(w>maxWidth){h=h*(maxWidth/w);w=maxWidth;}
            if(h>maxHeight){w=w*(maxHeight/h);h=maxHeight;}
            canvas.width=w; canvas.height=h;
            const ctx=canvas.getContext('2d');
            ctx.drawImage(img,0,0,w,h);
            callback(canvas.toDataURL('image/jpeg',0.8));
        }
        img.src=e.target.result;
    }
    reader.readAsDataURL(file);
}

// Task card oluşturma
function createTaskCard(task){
    const div=document.createElement('div');
    div.className='card';
    div.innerHTML=`<strong>${task.Tarih}</strong><br>${task.Açıklama}<br>
    <button onclick="editTask('${task.id}')">✏️</button>
    <button onclick="deleteTask('${task.id}')">🗑️</button>
    <button onclick="doneTask('${task.id}')">✔️</button>
    <button onclick="alarmTask('${task.Tarih}','${task.Açıklama}')">⏰</button>`;
    return div;
}

function createPersonelCard(task){
    const div=document.createElement('div');
    div.className='card';
    div.innerHTML=`<strong>${task.Ad}</strong><br>${task.Baslangic} - ${task.Bitis}<br>${task.Açıklama}<br>
    <button onclick="editPersonel('${task.id}')">✏️</button>
    <button onclick="deletePersonel('${task.id}')">🗑️</button>`;
    return div;
}

function createEvrakCard(task){
    const div=document.createElement('div');
    div.className='card';
    div.innerHTML=`<strong>${task.Tarih}</strong><br>${task.Açıklama}<br>
    <button onclick="editEvrak('${task.id}')">✏️</button>
    <button onclick="deleteEvrak('${task.id}')">🗑️</button>`;
    return div;
}
