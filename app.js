import { auth, db } from "./firebase-config.js";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const provider = new GoogleAuthProvider();

const taskList = document.getElementById("taskList");

const userInfo = document.getElementById("userInfo");

const googleLogin = document.getElementById("googleLogin");

const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;


// SPLASH

window.addEventListener("load",()=>{

  setTimeout(()=>{

    document.getElementById("splash").style.display="none";

  },1500);

});


// GOOGLE LOGIN

googleLogin.onclick = async ()=>{

  try{

    const result = await signInWithPopup(auth,provider);

    currentUser = result.user;

    loadTasks();

  }catch(err){

    alert(err.message);

  }

};


// ÇIKIŞ

logoutBtn.onclick = async ()=>{

  await signOut(auth);

  location.reload();

};


// KULLANICI KONTROL

onAuthStateChanged(auth,(user)=>{

  if(user){

    currentUser = user;

    userInfo.innerHTML = `
      ${user.displayName}
      <br>
      ${user.email}
    `;

    loadTasks();

  }else{

    userInfo.innerHTML = `
      Giriş yapılmadı
    `;

  }

});


// GÖREV EKLE

window.addTask = async function(){

  if(!currentUser){

    alert("Önce giriş yap");

    return;

  }

  let taskInput=document.getElementById('taskInput');

  let start=document.getElementById('startDateTime');

  let end=document.getElementById('endDateTime');

  if(taskInput.value.trim()==='') return;

  await addDoc(
    collection(db,"users",currentUser.uid,"tasks"),
    {
      task: taskInput.value.toUpperCase(),
      start: start.value || "",
      end: end.value || "",
      done:false,
      created:Date.now()
    }
  );

  taskInput.value='';
  start.value='';
  end.value='';

  loadTasks();

};


// GÖREVLERİ ÇEK

async function loadTasks(){

  if(!currentUser) return;

  taskList.innerHTML='';

  const q=query(
    collection(db,"users",currentUser.uid,"tasks"),
    orderBy("created","desc")
  );

  const querySnapshot=await getDocs(q);

  querySnapshot.forEach((docSnap)=>{

    const data=docSnap.data();

    const tr=document.createElement('tr');

    if(data.done){
      tr.classList.add('done');
    }

    tr.innerHTML=`
      <td>${data.task}</td>

      <td>${formatDate(data.start)}</td>

      <td>${formatDate(data.end)}</td>

      <td>

        <button onclick="toggleDone('${docSnap.id}',${data.done})">
          ✔
        </button>

        <button class="deleteBtn"
        onclick="deleteTask('${docSnap.id}')">
          🗑
        </button>

      </td>
    `;

    taskList.appendChild(tr);

  });

}


// TAMAMLANDI

window.toggleDone = async function(id,status){

  await updateDoc(
    doc(db,"users",currentUser.uid,"tasks",id),
    {
      done:!status
    }
  );

  loadTasks();

};


// SİL

window.deleteTask = async function(id){

  const ok=confirm("Silinsin mi?");

  if(!ok) return;

  await deleteDoc(
    doc(db,"users",currentUser.uid,"tasks",id)
  );

  loadTasks();

};


// TARİH FORMAT

function formatDate(dateStr){

  if(!dateStr) return "-";

  return new Date(dateStr)
  .toLocaleString("tr-TR",{
    hour12:false
  });

}
