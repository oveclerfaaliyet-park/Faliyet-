function setBg(e,key){
  let r=new FileReader();
  r.onload=()=>localStorage.setItem("bg_"+key,r.result);
  r.readAsDataURL(e.target.files[0]);
}

function applyTheme(key){
  let bg=localStorage.getItem("bg_"+key);
  if(bg) document.body.style.backgroundImage="url("+bg+")";
}

function setVideo(e,key){
  let r=new FileReader();
  r.onload=()=>localStorage.setItem(key,r.result);
  r.readAsDataURL(e.target.files[0]);
}

function playSplash(){
  let v=localStorage.getItem("splash");
  if(!v) return;
  splashVideo.src=v;
  splash.classList.remove("hidden");
  splashVideo.onended=()=>splash.classList.add("hidden");
}
