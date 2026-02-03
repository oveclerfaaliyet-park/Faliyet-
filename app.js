const API_URL = 'https://script.google.com/macros/s/AKfycbyBR_99DMqwD_20Wq2Um-_kC3DZ_uJm0bLX9_4ZohxUk1iHxV47tbWBOkF2KbTh1RgeTw/exec';

// Base64 ikonlar
const icons = {
  add: 'data:image/png;base64,...',
  delete: 'data:image/png;base64,...',
  edit: 'data:image/png;base64,...',
  alarm: 'data:image/png;base64,...',
  done: 'data:image/png;base64,...'
};

// Tarih Saat Güncelle
function updateDateTime() {
  const lbl = document.getElementById('lblDateTime');
  if(lbl) lbl.innerText = new Date().toLocaleString();
}
setInterval(updateDateTime,1000);

// Sayfa açma
function openScreen(page) { window.location.href = page; }
function goBack() { window.history.back(); }

// API GET
function fetchData(sheet, callback){
  fetch(`${API_URL}?sheet=${encodeURIComponent(sheet)}`)
    .then(res=>res.json())
    .then(data=>callback(data))
    .catch(err=>console.error(err));
}

// API POST
function postData(payload, callback){
  fetch(API_URL,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  })
  .then(res=>res.json())
  .then(data=>callback(data))
  .catch(err=>console.error(err));
}

// Base64 resim dönüştürme
function fileToBase64(file, callback){
  const reader = new FileReader();
  reader.onload = e=>callback(e.target.result);
  reader.readAsDataURL(file);
}

// Resim küçültme
function resizeImage(file, maxWidth, maxHeight, callback){
  const reader = new FileReader();
  reader.onload = function(e){
    const img = new Image();
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

// Kart oluşturma
function createTaskCard(task){
  const div=document.createElement('div');
  div.className='card';
  div.innerHTML=`
    <strong>${task.Tarih}</strong><br>${task.Açıklama}<br>
    <button onclick="editTask('${task.id}')"><img src="${icons.edit}" width="24"></button>
    <button onclick="deleteTask('${task.id}')"><img src="${icons.delete}" width="24"></button>
    <button onclick="doneTask('${task.id}')"><img src="${icons.done}" width="24"></button>
    <button onclick="alarmTask('${task.Tarih}','${task.Açıklama}')"><img src="${icons.alarm}" width="24"></button>
  `;
  return div;
}

// Arama filtreleme
function filterTasks(listId, searchId){
  const searchText=document.getElementById(searchId).value.toLowerCase();
  const cards=document.getElementById(listId).children;
  Array.from(cards).forEach(card=>{
    const text=card.innerText.toLowerCase();
    card.style.display=text.includes(searchText)?'':'none';
  });
}

// Alarm ekleme
function alarmTask(dateTime,message){
  if('Notification' in window && Notification.permission==='granted'){
    const alarmTime=new Date(dateTime).getTime()-new Date().getTime();
    if(alarmTime>0){
      setTimeout(()=>new Notification('Görev Alarmı',{body:message}),alarmTime);
    }
  } else if('Notification' in window){
    Notification.requestPermission();
  }
}

// PDF Oluşturma
function createPDF(){
  fetchData('Park Faaliyet',parkData=>{
    fetchData('Personel',personelData=>{
      fetchData('Evrak Takip',evrakData=>{
        const doc=new jsPDF(); let y=10;
        parkData.forEach((row,i)=>{
          doc.text(`${row.Tarih} - ${row.Açıklama}`,10,y); y+=10;
          if((i+1)%12===0) doc.addPage(),y=10;
        });
        doc.addPage(); y=10;
        personelData.forEach((row,i)=>{
          doc.text(`${row.AdıSoyadı} - ${row.Başlangıç} / ${row.Bitiş}`,10,y); y+=10;
          if((i+1)%12===0) doc.addPage(),y=10;
        });
        doc.addPage(); y=10;
        evrakData.forEach((row,i)=>{
          doc.text(`${row.Tarih} - ${row.Açıklama} - ${row.GelenGiden}`,10,y); y+=10;
          if((i+1)%12===0) doc.addPage(),y=10;
        });
        doc.save('Rapor.pdf');
      });
    });
  });
}
