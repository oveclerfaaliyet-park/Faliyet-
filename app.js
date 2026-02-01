let liste = document.getElementById("liste");

let data = JSON.parse(localStorage.getItem("kayitlar") || "[]");

data.forEach((k,i)=>{
  let div = document.createElement("div");
  div.className="kart";
  div.innerHTML = `<b>${k.tarih}</b><br>${k.aciklama}`;
  liste.appendChild(div);
});
