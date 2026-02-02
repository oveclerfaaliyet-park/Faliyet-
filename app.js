const DEPLOY_URL = "https://script.google.com/macros/s/AKfycbxrLZEg8icXGcnmq8yVYKsUsKgVrTYfXUdkbknP3y_YA7nMbo9S5WgPqNM68FwgI5M86w/exec";

let records = JSON.parse(localStorage.getItem("records") || "[]");

function readFile(file){
  return new Promise((resolve,reject)=>{
    if(!file){resolve(""); return;}
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

document.getElementById('saveBtn').addEventListener('click', async function(){
  let tarih = document.getElementById('date').value;
  let desc = document.getElementById('desc').value;
  let resim1 = await readFile(document.getElementById('img1').files[0]);
  let resim2 = await readFile(document.getElementById('img2').files[0]);

  if(!tarih || !desc){alert("Tarih ve açıklama gerekli"); return;}

  // LocalStorage kaydet
  records.push({tarih, desc, resim1, resim2});
  localStorage.setItem("records", JSON.stringify(records));

  // Sheet'e gönder
  fetch(DEPLOY_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({tarih, aciklama:desc, resim1, resim2})
  })
  .then(res=>res.json())
  .then(res=>{
    if(res.status==="success") alert("Local ve E-Tabloya gönderildi!");
    else alert("Sheet Hatası: "+res.message);
  }).catch(err=>{
    console.error(err);
    alert("Sheet'e gönderim sırasında hata oluştu!");
  });

  // Formu temizle
  document.getElementById('date').value="";
  document.getElementById('desc').value="";
  document.getElementById('img1').value="";
  document.getElementById('img2').value="";
});
