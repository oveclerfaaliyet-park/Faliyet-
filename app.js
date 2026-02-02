// Apps Script POST URL’nizi buraya koyun
const DEPLOY_URL = "const DEPLOY_URL = "https://script.google.com/macros/s/AKfycbxrLZEg8icXGcnmq8yVYKsUsKgVrTYfXUdkbknP3y_YA7nMbo9S5WgPqNM68FwgI5M86w/exec";;

// Tarayıcıda saklanan kayıtlar
let records = JSON.parse(localStorage.getItem("records") || "[]");

function render(){
  let html="";
  records.forEach((r,i)=>{
    html+=`
    <div class="card" onclick="openDetail(${i})">
      <div>${r.imgs.map(x=>`<img src="${x}">`).join("")}</div>
      <div>${r.date}</div>
      <div>${r.desc}</div>
    </div>`;
  });
  document.getElementById("list").innerHTML = html;
}
render();

function showSection(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  const sec = document.getElementById(id);
  if(sec) sec.classList.add("active");
}

function openAdd(){ document.getElementById("addModal").style.display="block"; }
function closeAdd(){ document.getElementById("addModal").style.display="none"; }

async function saveRecord(){
  const f1 = document.getElementById("img1").files[0];
  const f2 = document.getElementById("img2").files[0];
  const dateVal = document.getElementById("date").value;
  const descVal = document.getElementById("desc").value;

  if(!dateVal || !descVal){ alert("Tarih ve açıklama gerekli"); return; }

  const imgs = [];
  if(f1) imgs.push(await readFile(f1));
  if(f2) imgs.push(await readFile(f2));

  // Tarayıcıda kaydet
  records.push({imgs, date: dateVal, desc: descVal});
  localStorage.setItem("records", JSON.stringify(records));
  render();
  closeAdd();

  // Apps Script'e gönder
  fetch(DEPLOY_URL, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({tarih: dateVal, aciklama: descVal, resim1: imgs[0]||"", resim2: imgs[1]||""})
  })
  .then(res=>res.json())
  .then(res=>{
    if(res.status==="success") console.log("Apps Script kaydedildi");
    else console.error("Apps Script hata:", res.message);
  }).catch(err=>console.error(err));
}

function readFile(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

// Detay göster
function openDetail(i){
  const r = records[i];
  if(!r) return;
  alert(`Tarih: ${r.date}\nAçıklama: ${r.desc}\nResim sayısı: ${r.imgs.length}`);
}
