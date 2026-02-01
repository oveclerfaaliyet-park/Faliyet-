let records = JSON.parse(localStorage.getItem("records") || "[]");

function render(){
  let html="";
  records.forEach((r,i)=>{
    html+=`
    <div class="card" onclick="openDetail(${i})">
      <div>
        ${r.imgs.map(x=>`<img src="${x}">`).join("")}
      </div>
      <div>${r.date}</div>
      <div>${r.desc}</div>
    </div>`;
  });
  document.getElementById("list").innerHTML=html;
}
render();

function openAdd(){
  document.getElementById("addModal").style.display="block";
}
function closeAdd(){
  document.getElementById("addModal").style.display="none";
}

function saveRecord(){
  let imgs=[];
  let f1=img1.files[0];
  let f2=img2.files[0];

  let reader1=new FileReader();
  reader1.onload=()=>{
    if(f2){
      let reader2=new FileReader();
      reader2.onload=()=>{
        imgs.push(reader1.result, reader2.result);
        finish(imgs);
      }
      reader2.readAsDataURL(f2);
    } else {
      imgs.push(reader1.result);
      finish(imgs);
    }
  }
  reader1.readAsDataURL(f1);
}

function finish(imgs){
  records.push({
    imgs:imgs,
    date:date.value,
    desc:desc.value
  });
  localStorage.setItem("records",JSON.stringify(records));
  closeAdd();
  render();
}

function exportZip(){
  let blob=new Blob([JSON.stringify(records)],{type:"application/json"});
  let a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="park_"+new Date().toISOString().slice(0,7)+".zip";
  a.click();
}
