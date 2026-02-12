let isAdmin=false;
let hasVoted=localStorage.getItem("hasVoted")==="true";
let candidates=JSON.parse(localStorage.getItem("candidates"))||[];
let companies=JSON.parse(localStorage.getItem("companies"))||[];
let president=localStorage.getItem("president");
let electionStart=localStorage.getItem("electionStart");
let electionEnd=localStorage.getItem("electionEnd");
let termEnd=localStorage.getItem("termEnd");

// LOGIN ADMIN
function loginAdmin(){
if(document.getElementById("adminPass").value==="stareon123"){
isAdmin=true;
document.getElementById("adminPanel").style.display="block";
document.getElementById("adminStatus").innerText="Status: Admin";
}else alert("Password salah!");
}

// PROFIL
function updateProfile(){
let name=document.getElementById("username").value;
let role=document.getElementById("role").value;

document.getElementById("profileName").innerText=name;
document.getElementById("profileRole").innerText=role;

localStorage.setItem("currentUser",name);
}

function cekProfil(){
let name=document.getElementById("profileName").innerText;

if(name===president){
alert("👑 Kamu Presiden Aktif!");
return;
}

let comp=companies.find(c=>c.owner===name || c.workers.includes(name));
if(comp){
let workersList = comp.workers.length>0 ? comp.workers.join(", ") : "Belum ada pekerja";
alert(`🏢 Kamu terkait perusahaan ${comp.name}\nRole: ${comp.owner===name ? "Owner" : "Worker"}\nWorkers: ${workersList}`);
return;
}

alert("Warga Negara Biasa");
}

// DAFTAR CALON
function daftarCalon(){
let name=document.getElementById("candidateName").value;
if(!name) return;

candidates.push({name:name,votes:0});
localStorage.setItem("candidates",JSON.stringify(candidates));
render();
}

// VOTE
function vote(i){
if(hasVoted) return alert("Kamu sudah vote!");

let now=new Date();
if(!electionStart||!electionEnd) return alert("Pemilu belum diset!");

if(now<new Date(electionStart)||now>new Date(electionEnd))
return alert("Pemilu tidak aktif!");

candidates[i].votes++;
hasVoted=true;

localStorage.setItem("hasVoted","true");
localStorage.setItem("candidates",JSON.stringify(candidates));

render();
}

// RENDER PEMILU
function render(){
let list=document.getElementById("candidateList");
list.innerHTML="";
let total=0;

candidates.forEach((c,i)=>{
total+=c.votes;
list.innerHTML+=`
<li>${c.name} - ${c.votes} suara
<button onclick="vote(${i})">Vote</button></li>`;
});

document.getElementById("statTotalCalon").innerText=candidates.length;
document.getElementById("statTotalSuara").innerText=total;

if(candidates.length>0){
let leader=candidates.reduce((a,b)=>a.votes>b.votes?a:b);
document.getElementById("statLeader").innerText=leader.name;
}
}
render();

// SET WAKTU PEMILU
function setElectionTime(){
electionStart=document.getElementById("startTime").value;
electionEnd=document.getElementById("endTime").value;

localStorage.setItem("electionStart",electionStart);
localStorage.setItem("electionEnd",electionEnd);

alert("Waktu pemilu diset!");
}

// SET MASA JABATAN
function setTerm(){
let m=document.getElementById("termMinutes").value;
let end=new Date();
end.setMinutes(end.getMinutes()+parseInt(m));

termEnd=end;
localStorage.setItem("termEnd",termEnd);

alert("Masa jabatan diset!");
}

// SISTEM PERUSAHAAN
function createCompany(){
let user=document.getElementById("profileName").innerText;

if(!isAdmin && user!==president)
return alert("Hanya Presiden/Admin yang bisa buat perusahaan!");

let name=document.getElementById("companyName").value;
let type=document.getElementById("companyType").value;

if(!name||!type) return;

companies.push({
name:name,
type:type,
owner:user,
balance:0,
level:1,
workers:[]
});

localStorage.setItem("companies",JSON.stringify(companies));
renderCompany();
}

function renderCompany(){
let list=document.getElementById("companyList");
list.innerHTML="";

companies.sort((a,b)=>b.balance-a.balance);

companies.forEach((c,index)=>{
let workersList = c.workers.length>0 ? c.workers.join(", ") : "Belum ada pekerja";
list.innerHTML+=`
<li>
<b>${c.name}</b> (${c.type})<br>
Owner: ${c.owner}<br>
Level: ${c.level}<br>
Saldo: ${c.balance}<br>
Workers: ${workersList}
<button onclick="addWorker(${index})">Tambah Worker</button>
</li><br>`;
});

document.getElementById("totalCompany").innerText=companies.length;
}

// TAMBAH WORKER
function addWorker(index){
let user=prompt("Masukkan nama worker:");
if(!user) return;
companies[index].workers.push(user);
localStorage.setItem("companies",JSON.stringify(companies));
renderCompany();
}

// AUTO SYSTEM
setInterval(()=>{
let now=new Date();

// Tentukan Presiden
if(electionEnd && now>new Date(electionEnd) && !president){
let win=candidates.sort((a,b)=>b.votes-a.votes)[0];
if(win){
president=win.name;
localStorage.setItem("president",president);
}
}

if(president)
document.getElementById("presidentName").innerText=president;

// Countdown Masa Jabatan
if(termEnd){
let diff=new Date(termEnd)-now;
if(diff>0){
document.getElementById("termCountdown").innerText=
Math.floor(diff/60000)+" menit tersisa";
}else{
president=null;
localStorage.removeItem("president");
document.getElementById("termCountdown").innerText="Masa jabatan habis";
}
}
},1000);

// ⭐ Generate Random Stars
for(let i=0;i<120;i++){
let star=document.createElement("div");
star.className="star";
star.style.top=Math.random()*100+"%";
star.style.left=Math.random()*100+"%";
star.style.animationDuration=(1+Math.random()*3)+"s";
document.querySelector(".galaxy").appendChild(star);
}