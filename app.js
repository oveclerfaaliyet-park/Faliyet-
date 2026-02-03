const API_URL = 'https://script.google.com/macros/s/AKfycbyBR_99DMqwD_20Wq2Um-_kC3DZ_uJm0bLX9_4ZohxUk1iHxV47tbWBOkF2KbTh1RgeTw/exec';

const icons = {
  add: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAYAAAB...==',
  delete: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAYAAAB...==',
  edit: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAYAAAB...==',
  alarm: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAYAAAB...==',
  done: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAdCAYAAAB...=='
};

function updateDateTime() {
    const lbl = document.getElementById('lblDateTime');
    if(lbl) lbl.innerText = new Date().toLocaleString();
}
setInterval(updateDateTime, 1000);

function openScreen(page) { window.location.href = page; }
function goBack() { window.history.back(); }

function fetchData(sheet, callback){
    fetch(`${API_URL}?sheet=${encodeURIComponent(sheet)}`)
        .then(res => res.json())
        .then(data => callback(data))
        .catch(err => console.error(err));
}

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

function fileToBase64(file, callback){
    const reader = new FileReader();
    reader.onload = e => callback(e.target.result);
    reader.readAsDataURL(file);
}
