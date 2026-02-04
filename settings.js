function applyTheme(sayfa){
  let bg = localStorage.getItem("bg_"+sayfa);
  if(bg) document.body.style.backgroundImage=`url(${bg})`;
}

function setBg(e, sayfa){
  let reader = new FileReader();
  reader.onload = ()=>{ localStorage.setItem("bg_"+sayfa, reader.result); applyTheme(sayfa); };
  reader.readAsDataURL(e.target.files[0]);
}

function setVideo(e,type){
  let reader = new FileReader();
  reader.onload = ()=>localStorage.setItem(type+"_video", reader.result);
  reader.readAsDataURL(e.target.files[0]);
}

function playSplash(){
  let video = localStorage.getItem("splash_video");
  if(video){ let v=document.getElementById("splashVideo"); v.src=video; document.getElementById("splash").classList.remove("hidden"); }
}

function saatTarihGoster(){
  let elem = document.getElementById("saatTarih");
  setInterval(()=>{ if(elem) elem.textContent=new Date().toLocaleString(); },1000);
}
