const API_URL = 'https://script.google.com/macros/s/.../exec';

function updateDateTime(){
  const lbl = document.getElementById('lblDateTime');
  if(lbl) lbl.innerText = new Date().toLocaleString();
}
setInterval(updateDateTime,1000);

function openScreen(page){ window.location.href=page; }
function goBack(){ window.history.back(); }

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
  }).then(res=>res.json()).then(data=>callback(data)).catch(err=>console.error(err));
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

function createTaskCard(task){
  const div=document.createElement('div');
  div.className='card';
  div.innerHTML=`
    <strong>${task.Tarih}</strong><br>${task.Açıklama}<br>
    <button onclick="editTask('${task.id}')">✏️</button>
    <button onclick="deleteTask('${task.id}')">🗑️</button>
    <button onclick="doneTask('${task.id}')">✔️</button>
    <button onclick="alarmTask('${task.Tarih}','${task.Açıklama}')">⏰</button>
  `;
  return div;
}

function filterTasks(listId,searchId){
  const searchText=document.getElementById(searchId).value.toLowerCase();
  const cards=document.getElementById(listId).children;
  Array.from(cards).forEach(card=>{
    const text=card.innerText.toLowerCase();
    card.style.display=text.includes(searchText)?'':'none';
  });
}

function openAddParkPopup(){document.getElementById('addParkPopup').classList.remove('hidden');}
function closeAddParkPopup(){document.getElementById('addParkPopup').classList.add('hidden');}

// Kaydetme
function savePark(){
  const tarih=document.getElementById('dpParkDate').value;
  const aciklama=document.getElementById('txtParkDesc').value;
  const img1=document.getElementById('imgPark1').files[0];
  const img2=document.getElementById('imgPark2').files[0];

  if(!tarih || !aciklama){alert('Tarih ve açıklama zorunlu!');return;}

  const imgs=[]; const files=[img1,img2].filter(f=>f); let processed=0;
  if(files.length===0){postParkData();}
  else{
    files.forEach(file=>{
      resizeImage(file,800,800,base64=>{
        imgs.push(base64); processed++;
        if(processed===files.length){postParkData();}
      });
    });
  }

  function postParkData(){
    const payload={tip:'park',tarih:tarih,aciklama:aciklama,resimler:imgs};
    postData(payload,res=>{
      if(res.success){alert('Kaydedildi!');closeAddParkPopup();loadParkData();}
      else alert('Kaydetme hatası!');
    });
  }
}

function loadParkData(){
  fetchData('Park Faaliyet',data=>{
    const lst=document.getElementById('lstPark');
    lst.innerHTML='';
    data.sort((a,b)=>new Date(b.Tarih)-new Date(a.Tarih));
    data.forEach(item=>lst.appendChild(createTaskCard(item)));
  });
}

window.addEventListener('load',loadParkData);
