const BASE_URL = "https://script.google.com/macros/s/AKfycbw7AXQgZew2qj_q_4n78kUpdmcWWsTGuQd0UOovYZfpzKcPyicxicShDXX7endBgx7lmw/exec";

// Veri çek
async function loadData(sayfa){
  const res = await fetch(`${BASE_URL}?sayfa=${encodeURIComponent(sayfa)}`);
  const data = await res.json();
  const listDiv = document.getElementById('list');
  listDiv.innerHTML = '';

  if(data.durum !== 'ok') { listDiv.innerHTML = data.mesaj; return; }

  data.veriler.forEach((row, i)=>{
    const div = document.createElement('div');
    div.className = 'row';
    div.innerHTML = `<span>${row.join(' | ')}</span>
                     <button onclick="editRow(${i}, '${sayfa}')">Düzenle</button>
                     <button onclick="deleteRow(${i}, '${sayfa}')">Sil</button>`;
    listDiv.appendChild(div);
  });
}

// Sil
async function deleteRow(index, sayfa){
  if(!confirm('Silmek istiyor musunuz?')) return;
  await fetch(BASE_URL, { method:'POST', body: JSON.stringify({ action:'sil', index, sayfa, satir:[] }) });
  loadData(sayfa);
}

// Düzenle
async function editRow(index, sayfa){
  const text = prompt('Yeni değerleri | ile ayırın:');
  if(!text) return;
  const satir = text.split('|').map(s=>s.trim());
  await fetch(BASE_URL,{ method:'POST', body: JSON.stringify({ action:'duzenle', index, sayfa, satir }) });
  loadData(sayfa);
}

// Yeni kayıt
async function openAddModal(sayfa){
  const text = prompt('Yeni değerleri | ile ayırın:');
  if(!text) return;
  const satir = text.split('|').map(s=>s.trim());
  await fetch(BASE_URL,{ method:'POST', body: JSON.stringify({ action:'ekle', sayfa, satir }) });
  loadData(sayfa);
}
