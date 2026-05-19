const taskList=document.getElementById('taskList');

function addTask(){
  let taskInput=document.getElementById('taskInput');
  let start=document.getElementById('startDateTime');
  let end=document.getElementById('endDateTime');

  if(taskInput.value.trim()==='') return;

  const task=taskInput.value.toUpperCase();
  const startVal=start.value?new Date(start.value):null;
  const startDisplay=startVal?startVal.toLocaleString('tr-TR',{hour12:false}):'';
  const endVal=end.value?new Date(end.value):null;
  const endDisplay=endVal?endVal.toLocaleString('tr-TR',{hour12:false}):'';

  const tr=document.createElement('tr');

  tr.dataset.start=startVal?startVal.getTime():0; // sıralama için timestamp

  tr.innerHTML=`
    <td>${task}</td>
    <td>${startDisplay}</td>
    <td>${endDisplay}</td>
    <td>
      <button onclick="toggleDone(this)">✔</button>
      <button onclick="deleteTask(this)">🗑</button>
    </td>
  `;

  taskList.appendChild(tr);
  sortTasks(); // her eklemede sırala

  taskInput.value='';
  start.value='';
  end.value='';
}

// Sırala fonksiyonu (başlangıç tarihine göre, büyükten küçüğe)
function sortTasks(){
  const rows = Array.from(taskList.querySelectorAll('tr'));
  rows.sort((a,b)=>{
    return (b.dataset.start - a.dataset.start);
  });
  rows.forEach(row=>taskList.appendChild(row));
}

function toggleDone(btn){
  const tr=btn.closest('tr');
  if(tr.style.backgroundColor==='red'){
    tr.style.backgroundColor='';
  }else{
    tr.style.backgroundColor='red';
  }
}

function deleteTask(btn){
  const tr=btn.closest('tr');
  if(confirm('Bu görevi silmek istediğine emin misin?')){
    tr.remove();
  }
}