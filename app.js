const API_URL = 'https://script.google.com/macros/s/AKfycbyBR_99DMqwD_20Wq2Um-_kC3DZ_uJm0bLX9_4ZohxUk1iHxV47tbWBOkF2KbTh1RgeTw/exec';

// Ortak fonksiyonlar
function openScreen(page){ window.location.href=page; }
function goBack(){ window.history.back(); }
function filterTasks(listId,searchId){
  const searchText=document.getElementById(searchId).value.toLowerCase();
  const cards=document.getElementById(listId)?.children || [];
  Array.from(cards).forEach(card=>{
    const text=card.innerText.toLowerCase();
    card.style.display=text.includes(searchText)?'':'none';
  });
}

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

// Resim küçültme
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
  div.innerHTML=`
    <strong>${task.Tarih}</strong><br>${task.Açıklama}<br>
    <button onclick="editTask('${task.id}')">✏️</button>
    <button onclick="deleteTask('${task.id}')">🗑️</button>
    <button onclick="doneTask('${task.id}')">✔️</button>
    <button onclick="alarmTask('${task.Tarih}','${task.Açıklama}')">⏰</button>
  `;
  return div;
}
