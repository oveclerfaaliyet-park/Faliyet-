const BASE_URL = "https://script.google.com/macros/s/AKfycbw7AXQgZew2qj_q_4n78kUpdmcWWsTGuQd0UOovYZfpzKcPyicxicShDXX7endBgx7lmw/exec";

async function loadData(sayfa){
  const res = await fetch(`${BASE_URL}?sayfa=${encodeURIComponent(sayfa)}`);
  const data = await res.json();
  const listDiv = document.getElementById('list');
  listDiv.innerHTML = '';
  if(data.durum !== 'ok') { listDiv.innerHTML = data.mesaj; return; }
  data.veriler.forEach((row, i)=>{
    const div = document.createElement('div');
    div.className = 'row';
    let html = `<input type="checkbox" class="rowCheck" data-index="${i}"> `;
    html += row.map(col=>{
      if(col && col.startsWith("https://drive.google.com")) return `<img src="${col}" class="thumb">`;
      return col;
    }).join(' | ');
    div.innerHTML = html;
    listDiv.appendChild(div);
  });
}

async function deleteSelected(sayfa){
  const checkboxes = document.querySelectorAll('.rowCheck:checked');
  for(let cb of checkboxes){
    const index = parseInt(cb.dataset.index);
    await fetch(BASE_URL, { method:'POST', body: JSON.stringify({ action:'sil', index, sayfa, satir:[] }) });
  }
  loadData(sayfa);
}

async function editSelected(sayfa){
  const checkboxes = document.querySelectorAll('.rowCheck:checked');
  for(let cb of checkboxes){
    const index = parseInt(cb.dataset.index);
    const text = prompt('Yeni değerleri | ile ayırın:');
    if(!text) continue;
    const satir = text.split('|').map(s=>s.trim());
    await fetch(BASE_URL,{ method:'POST', body: JSON.stringify({ action:'duzenle', index, sayfa, satir }) });
  }
  loadData(sayfa);
}

async function openAddModal(sayfa){
  const text = prompt('Yeni değerleri | ile ayırın (resim için seçiniz):');
  if(!text) return;
  let satir = text.split('|').map(s=>s.trim());
  const fileInput = document.createElement('input');
  fileInput.type='file';
  fileInput.accept='image/*';
  fileInput.onchange=async ()=>{
    if(fileInput.files.length){
      const resized = await resizeImage(fileInput.files[0]);
      const fileName = fileInput.files[0].name;
      await fetch(BASE_URL,{ method:'POST', body: JSON.stringify({ action:'ekle', sayfa, satir, fileData:resized, fileName }) });
      loadData(sayfa);
    } else {
      await fetch(BASE_URL,{ method:'POST', body: JSON.stringify({ action:'ekle', sayfa, satir }) });
      loadData(sayfa);
    }
  };
  fileInput.click();
}

function resizeImage(file, maxWidth=800){
  return new Promise((resolve)=>{
    const reader = new FileReader();
    reader.onload = e=>{
      const img = new Image();
      img.onload=()=>{
        const canvas = document.createElement('canvas');
        const ratio = img.width / img.height;
        canvas.width = Math.min(maxWidth, img.width);
        canvas.height = canvas.width / ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL("image/png",0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function pdfOlustur(){
  alert('PDF oluşturma işlevi buraya bağlanacak.');
}
