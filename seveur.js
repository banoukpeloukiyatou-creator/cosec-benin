const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
app.use(express.json());

const FICHIER = './agences.json';
let agences = [];
if (fs.existsSync(FICHIER)) {
  agences = JSON.parse(fs.readFileSync(FICHIER));
} else {
  agences = [
    {id:"SEC001", nom:"Agence Godomey", ville:"Godomey", statut:"Ouvert", solde:2500000},
    {id:"SEC002", nom:"Agence Calavi", ville:"Abomey-Calavi", statut:"Ouvert", solde:1800000},
    {id:"SEC003", nom:"Agence Akassato", ville:"Akassato", statut:"Fermé", solde:0},
    {id:"SEC004", nom:"Agence ouidah", ville:"OUIDAH", statut:"Ouvert", solde:3200000}
  ];
  fs.writeFileSync(FICHIER, JSON.stringify(agences, null, 2));
}
function sauver(){ fs.writeFileSync(FICHIER, JSON.stringify(agences, null, 2)); }

app.get('/', (req,res)=>{
  res.send(`
<html><head><title>COSEC V4 PRO</title>
<style>
 body{font-family:Arial;background:#f0f2f5;padding:15px}
 .card{background:white;padding:20px;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1);max-width:1000px;margin:auto}
 h1{color:#1a73e8;text-align:center;margin-bottom:5px}
 .stats{display:flex;gap:15px;justify-content:center;margin:15px 0}
 .stat{background:#1a73e8;color:white;padding:12px 20px;border-radius:8px;text-align:center;min-width:120px}
 .stat b{font-size:20px;display:block}
 table{width:100%;border-collapse:collapse;margin-top:15px}
 th{background:#1a73e8;color:white;padding:10px} td{padding:8px;border-bottom:1px solid #ddd;text-align:center}
 .ouvert{color:green;font-weight:bold} .ferme{color:red;font-weight:bold}
 .form{background:#e8f0fe;padding:15px;border-radius:10px;margin-top:20px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
 input,select{padding:8px;border-radius:6px;border:1px solid #ccc}
 button{background:#1a73e8;color:white;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;font-weight:bold}
 button:hover{background:#0d62c9}
</style></head>
<body><div class="card">
<h1>🏦 COSEC V4 - Gestion PRO + Caisse</h1>
<div class="stats"><div class="stat"><b id="nb">0</b>Agences</div><div class="stat"><b id="total">0</b>FCFA Total</div><div class="stat"><b id="ouvert">0</b>Ouvertes</div></div>
<table id="table"></table>
<div class="form">
<input id="id" placeholder="ID SEC005" style="width:90px">
<input id="nom" placeholder="Nom" style="width:130px">
<input id="ville" placeholder="Ville" style="width:90px">
<input id="solde" type="number" placeholder="Solde FCFA" style="width:110px">
<select id="statut"><option>Ouvert</option><option>Fermé</option></select>
<button onclick="ajouter()">➕ Ajouter</button>
</div>
<p style="text-align:center;margin-top:12px"><a href="/agences">API JSON</a> | Sauvegarde auto ✅</p>
</div>
<script>
let agences=[];
async function load(){ let r=await fetch('/agences'); agences=await r.json(); render(); }
function render(){
 let t=document.getElementById('table');
 let total=agences.reduce((s,a)=>s+(parseInt(a.solde)||0),0);
 let nbOuvert=agences.filter(a=>a.statut=='Ouvert').length;
 document.getElementById('nb').innerText=agences.length;
 document.getElementById('total').innerText=total.toLocaleString('fr-FR');
 document.getElementById('ouvert').innerText=nbOuvert;
 t.innerHTML='<tr><th>ID</th><th>Nom</th><th>Ville</th><th>Solde</th><th>Statut</th><th>Action</th></tr>' + 
 agences.map(a=>\`<tr><td>\${a.id}</td><td>\${a.nom}</td><td>\${a.ville}</td><td><b>\${(a.solde||0).toLocaleString('fr-FR')} FCFA</b></td><td class="\${a.statut=='Ouvert'?'ouvert':'ferme'}">\${a.statut}</td><td><button onclick="suppr('\${a.id}')">Supprimer</button></td></tr>\`).join('');
}
async function ajouter(){
 let id=document.getElementById('id').value, nom=document.getElementById('nom').value, ville=document.getElementById('ville').value, statut=document.getElementById('statut').value, solde=parseInt(document.getElementById('solde').value)||0;
 if(!id||!nom||!ville) return alert('Remplis tout Maître !');
 await fetch('/agences',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,nom,ville,statut,solde})});
 document.getElementById('id').value='';document.getElementById('nom').value='';document.getElementById('ville').value='';document.getElementById('solde').value='';
 load();
}
async function suppr(id){ if(!confirm('Supprimer '+id+' ?')) return; await fetch('/agences/'+id,{method:'DELETE'}); load(); }
load();
</script></body></html>`);
});
app.get('/agences',(req,res)=>res.json(agences));
app.post('/agences',(req,res)=>{ agences.push(req.body); sauver(); console.log('Ajouté:',req.body); res.json({ok:true}); });
app.delete('/agences/:id',(req,res)=>{ agences=agences.filter(a=>a.id!==req.params.id); sauver(); res.json({ok:true}); });
app.listen(PORT,()=>console.log('COSEC V4 PRO sur http://localhost:'+PORT+' | Total agences: '+agences.length));