const API_URL = 'https://script.google.com/macros/s/AKfycbyBR_99DMqwD_20Wq2Um-_kC3DZ_uJm0bLX9_4ZohxUk1iHxV47tbWBOkF2KbTh1RgeTw/exec';

// ------------------ Ortak Fonksiyonlar ------------------
function openScreen(page){ window.location.href=page; }
function goBack(){ window.history.back(); }
function filterTasks(listId,searchId){
  const txt=document.getElementById(searchId).value.toLowerCase();
  Array.from(document.getElementById(listId)?.children||[]).forEach(c=>{
    c.style.display=c.innerText.toLowerCase().includes(txt)?'':'none';
  });
}

// ------------------ Fetch & Post ------------------
async function fetchData(sheet){
  try{
    const res=await fetch(`${API_URL}?sheet=${encodeURIComponent(sheet)}`);
    return await res.json();
  }catch(err){ console.error(err); return [];}
}

async function postData(payload){
  try{
    const res=await fetch(API_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    return await res.json();
  }catch(err){ console.error(err); return {success:false,error:err.message};}
}

// ------------------ Resim Küçültme ------------------
function resizeImage(file,maxW,maxH,callback){
  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=function(){
      let w=img.width,h=img.height;
      if(w>maxW){h=h*(maxW/w);w=maxW;}
      if(h>maxH){w=w*(maxH/h);h=maxH;}
      const canvas=document.createElement('canvas');
      canvas.width=w; canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      callback(canvas.toDataURL('image/jpeg',0.8));
    }
    img.src=e.target.result;
  }
  reader.readAsDataURL(file);
}

// ------------------ Card Oluştur ------------------
function createCard(task,tip){
  const div=document.createElement('div'); div.className='card';
  div.innerHTML=`<strong>${task.Tarih||task.Baslangic}</strong> | ${task.Açıklama||task.Ad||''}<br>
  <button onclick="editTask('${task.id}','${tip}')">✏️</button>
  <button onclick="deleteTask('${task.id}','${tip}')">🗑️</button>
  <button onclick="doneTask('${task.id}','${tip}')">✔️</button>`;
  return div;
}

// ------------------ Park Faaliyet ------------------
async function loadParkList(){
  const data=await fetchData('Park Faaliyet');
  const lst=document.getElementById('lstPark');
  if(!lst) return;
  lst.innerHTML='';
  data.reverse().forEach(t=>lst.appendChild(createCard(t,'park')));
}

async function savePark(){
  const tarih=document.getElementById('dpParkDate').value;
  const aciklama=document.getElementById('txtParkDesc').value;
  const imgs=[document.getElementById('imgPark1').files[0],document.getElementById('imgPark2').files[0]].filter(f=>f);
  const resimler=[];
  if(imgs.length===0) await postPark();
  else{
    let processed=0;
    imgs.forEach(file=>resizeImage(file,800,800,base64=>{
      resimler.push(base64);
      processed++; if(processed===imgs.length) postPark();
    }));
  }
  async function postPark(){
    const res=await postData({tip:'park',tarih,aciklama,resimler});
    if(res.success){ alert('Kaydedildi!'); closeAddParkPopup(); loadParkList(); }
    else alert('Hata: '+(res.error||''));
  }
}

function closeAddParkPopup(){ document.getElementById('addParkPopup')?.classList.add('hidden'); }

// ------------------ Personel ------------------
async function loadPersonelList(){
  const data=await fetchData('Personel');
  const lst=document.getElementById('lstPersonel'); 
  if(!lst) return;
  lst.innerHTML='';
  data.reverse().forEach(t=>lst.appendChild(createCard(t,'personel')));
}

async function savePersonel(){
  const ad=document.getElementById('txtPersonelName').value;
  const bas=document.getElementById('dpStart').value;
  const bit=document.getElementById('dpEnd').value;
  const aciklama=document.getElementById('txtPersonelDesc').value;
  const img=document.getElementById('imgPersonel').files[0];
  const resimler=[];
  if(img) await resizeImage(img,800,800,base64=>{ resimler.push(base64); postPersonel(); });
  else await postPersonel();
  async function postPersonel(){
    const res=await postData({tip:'personel',ad,baslangic:bas,bitis:bit,aciklama,resimler});
    if(res.success){ alert('Kaydedildi!'); closeAddPersonelPopup(); loadPersonelList(); }
    else alert('Hata: '+(res.error||''));
  }
}

function closeAddPersonelPopup(){ document.getElementById('addPersonelPopup')?.classList.add('hidden'); }

// ------------------ Evrak Takip ------------------
async function loadEvrakList(){
  const data=await fetchData('Evrak Takip');
  const lstGelen=document.getElementById('lstEvrakGelen'); 
  const lstGiden=document.getElementById('lstEvrakGiden');
  if(!lstGelen || !lstGiden) return;
  lstGelen.innerHTML=''; lstGiden.innerHTML='';
  data.reverse().forEach(task=>{
    const card=createCard(task,'evrak');
    if(task.GelenGiden==='Gelen') lstGelen.appendChild(card);
    else lstGiden.appendChild(card);
  });
}

async function saveEvrak(){
  const tarih=document.getElementById('dpEvrakDate').value;
  const aciklama=document.getElementById('txtEvrakDesc').value;
  const tip=document.getElementById('spEvrakType').value;
  const img=document.getElementById('imgEvrak').files[0];
  const resimler=[];
  if(img) await resizeImage(img,800,800,base64=>{ resimler.push(base64); postEvrak(); });
  else await postEvrak();
  async function postEvrak(){
    const res=await postData({tip:'evrak',tarih,aciklama,evrakTip:tip,resimler});
    if(res.success){ alert('Kaydedildi!'); closeAddEvrakPopup(); loadEvrakList(); }
    else alert('Hata: '+(res.error||''));  
  }
}

function closeAddEvrakPopup(){ document.getElementById('addEvrakPopup')?.classList.add('hidden'); }

// ------------------ DOMContentLoaded ile + butonları ------------------
document.addEventListener('DOMContentLoaded',()=>{
    // Park
    const btnAddPark=document.getElementById('btnAddPark');
    if(btnAddPark) btnAddPark.addEventListener('click',()=>document.getElementById('addParkPopup').classList.remove('hidden'));
    const btnSavePark=document.getElementById('btnSavePark');
    if(btnSavePark) btnSavePark.addEventListener('click',savePark);
    // Personel
    const btnAddPersonel=document.getElementById('btnAddPersonel');
    if(btnAddPersonel) btnAddPersonel.addEventListener('click',()=>document.getElementById('addPersonelPopup').classList.remove('hidden'));
    const btnSavePersonel=document.getElementById('btnSavePersonel');
    if(btnSavePersonel) btnSavePersonel.addEventListener('click',savePersonel);
    // Evrak
    const btnAddEvrak=document.getElementById('btnAddEvrak');
    if(btnAddEvrak) btnAddEvrak.addEventListener('click',()=>document.getElementById('addEvrakPopup').classList.remove('hidden'));
    const btnSaveEvrak=document.getElementById('btnSaveEvrak');
    if(btnSaveEvrak) btnSaveEvrak.addEventListener('click',saveEvrak);
});
