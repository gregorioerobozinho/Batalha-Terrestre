import {gameAudio} from "../audio/audio.js";
const $=id=>document.getElementById(id), W=16,H=10, SAVE="bt-v7-save", FIRST="bt-first-local", FIRST_MACHINE="bt-first-machine";
// Quantidade inicial definida pelo usuário.
const INITIAL={tank:10,patrol:10}; const REINFORCEMENT={tank:10,patrol:10};
const AI_MEMORY_KEY="bt-provacoes-memory-v1";
function readAIMemory(){try{return JSON.parse(localStorage.getItem(AI_MEMORY_KEY))||{games:0,events:[],stats:{}}}catch{return {games:0,events:[],stats:{}}}}
function rememberHuman(kind,details={}){if(!G||G.mode!=="machine"||G.turn==="red")return;const m=readAIMemory();const event={kind,details,round:G.round||1,at:Date.now()};m.events.push(event);m.events=m.events.slice(-500);m.stats[kind]=(m.stats[kind]||0)+1;try{localStorage.setItem(AI_MEMORY_KEY,JSON.stringify(m))}catch{}}

const COLORS={blue:"Azul",green:"Verde",pink:"Rosa",yellow:"Amarela",red:"Provações"};
// Número de impactos necessários para destruir cada alvo, por arma.
const DAMAGE={
  tank:{tank:2,patrol:2,drone:1,aircraft:1},
  patrol:{tank:2,patrol:2,drone:1,aircraft:1},
  baseCenter:{tank:3,patrol:4,drone:2,aircraft:2},
  basePeripheral:{tank:null,patrol:null,drone:2,aircraft:2}
};
const SPR={tank:"tank/tank_front.svg",patrol:"patrol/patrol_front.svg",aircraft:"aircraft/aircraft_front.svg",drone:"drone/drone_front.svg"};
const lines={tank:["Não preciso provar nada a ninguém. Minha força está no Senhor.","A tentação promete atalhos, mas escolho permanecer firme.","O orgulho me chama; a humildade me mantém de pé."],patrol:["A fé não elimina a batalha, mas me ensina a atravessá-la.","Não negociarei minha consciência por prazer passageiro.","Deus é minha fortaleza quando o medo se aproxima."]};
const taunts={varao:["Há tantas mulheres à sua disposição... por que resistir?","Você merece todos os prazeres. Ceda só desta vez.","Seu orgulho pode levá-lo mais longe que sua fé."],varoa:["Há tantos homens à sua disposição... por que resistir?","Você merece todos os prazeres. Ceda só desta vez.","Seu orgulho pode levá-la mais longe que sua fé."]};
const playerEncouragements={varao:[
 "Permaneça firme. A tentação pode ser forte, mas você não precisa enfrentá-la sozinho. Busque a Deus e siga em frente.",
 "Não confie apenas na própria força. Ore, firme-se na Palavra e escolha o que agrada ao Senhor.",
 "Uma batalha exige perseverança. Se cair, levante-se em Cristo; se estiver firme, continue vigilante.",
 "Revista-se da armadura de Deus. Resista ao mal e permaneça fiel, mesmo quando o caminho parecer difícil."
],varoa:[
 "Permaneça firme. A tentação pode ser forte, mas você não precisa enfrentá-la sozinha. Busque a Deus e siga em frente.",
 "Não confie apenas na própria força. Ore, firme-se na Palavra e escolha o que agrada ao Senhor.",
 "Uma batalha exige perseverança. Se cair, levante-se em Cristo; se estiver firme, continue vigilante.",
 "Revista-se da armadura de Deus. Resista ao mal e permaneça fiel, mesmo quando o caminho parecer difícil."
]};
function showPlayerTurnMessage(){
 if(!G||G.mode!=="machine"||G.turn==="red")return;
 const human=team(G.turn),lines=playerEncouragements[human.identity||"varao"];
 startMessage("Sua vez",lines[Math.floor(Math.random()*lines.length)]);
}
let G=null,selected=null,reservePick=null,mode="machine",difficulty="easy",effects=true,music=false;
function newGame(){if($("mode").value==="machine"){const mem=readAIMemory();mem.games=(mem.games||0)+1;try{localStorage.setItem(AI_MEMORY_KEY,JSON.stringify(mem))}catch{}}mode=$("mode").value;difficulty="standard";let p1=$("p1").value,p2=mode==="local"?$("p2").value:"red";if(p1===p2){alert("Escolha cores diferentes.");return}let first=mode==="machine"?(localStorage.getItem(FIRST_MACHINE)==="human"?p1:"red"):(localStorage.getItem(FIRST)==="1"?p2:p1);if(mode==="machine")localStorage.setItem(FIRST_MACHINE,first==="red"?"human":"red");if(mode==="local")localStorage.setItem(FIRST,first===p1?"1":"0");G={mode,difficulty,teams:[{id:p1,name:COLORS[p1],color:p1,identity:(p1==="pink"||p1==="yellow")?"varoa":"varao",reserve:{...INITIAL},reinforcements:0,territory:0},{id:p2,name:COLORS[p2],color:p2,identity:(p2==="pink"||p2==="yellow")?"varoa":"varao",reserve:mode==="machine"?{...INITIAL}:{...INITIAL},reinforcements:0,territory:0}],turn:first,round:1,ops:3,used:[],units:[],bases:[],nextId:1,log:[],status:"playing",lastTerritory:[0,0],aircraftUsed:[],droneUsed:[]};selected=null;reservePick=null;$("setup").classList.add("hidden");$("game").classList.remove("hidden");save();render();startMessage("Antes da batalha","A vida espiritual é uma batalha constante. Todos os dias enfrentamos provações, tentações e escolhas que colocam nossa fé à prova. Não confie apenas em sua própria força: busque a Deus, revista-se de Sua Palavra e permaneça firme. Prepare-se para lutar!",()=>{if(first==="red")setTimeout(aiTurn,600);else showPlayerTurnMessage()})}
function team(id){return G.teams.find(t=>t.id===id)}function enemy(id){return G.teams.find(t=>t.id!==id)}function unitAt(r,c){return G.units.filter(u=>u.r===r&&u.c===c)}function baseAt(r,c){return G.bases.find(b=>b.cells.some(p=>p.r===r&&p.c===c))}function inside(r,c){return r>=0&&r<H&&c>=0&&c<W}function log(s){G.log.unshift(s);G.log=G.log.slice(0,18)}function save(){try{localStorage.setItem(SAVE,JSON.stringify(G));$("save-status").textContent="Partida salva neste aparelho."}catch{$("save-status").textContent="Falha ao salvar."}}
function startMessage(title,text,cb,art=null){$("message-title").textContent=title;$("message-text").textContent=text;const artEl=$("message-art");if(art){artEl.src=art;artEl.classList.remove("hidden")}else{artEl.removeAttribute("src");artEl.classList.add("hidden")} $("message").classList.remove("hidden");$("message-ok").onclick=()=>{$("message").classList.add("hidden");if(cb)cb()}}
function baseCell(b,r,c){return b.cells.find(p=>p.r===r&&p.c===c)}function ownerAt(r,c){let b=baseAt(r,c),cell=b&&baseCell(b,r,c);return cell&&cell.hp>0?b.owner:"neutral"}function teamIndex(id){return G.teams.findIndex(t=>t.id===id)}function calcTerritory(){for(const t of G.teams){t.territory=G.bases.reduce((n,b)=>n+b.cells.filter(p=>p.hp>0&&b.owner===t.id).length,0)}for(const t of G.teams){let idx=teamIndex(t.id),before=G.lastTerritory[idx]||0;if(before<80&&t.territory>=80){t.reserve.tank+=10;t.reserve.patrol+=10;t.reinforcements++;log(`${t.name} alcançou 50% do território: +10 tanques e +10 patrulhas na reserva.`)}G.lastTerritory[idx]=t.territory}}
function createUnit(type,owner,r,c){let u={id:G.nextId++,type,owner,r,c,hp:0,damage:{},used:false,moved:false,actionUsed:false,dodge:false,aa:false,airAvailable:type==="tank",droneAvailable:type==="patrol",direction:r===0?"back":"front"};G.units.push(u);return u}
function render(){if(!G)return;const layout=document.querySelector(".game-layout");if(layout)layout.classList.toggle("controls-left",G.mode==="local"&&G.turn===G.teams[1].id);let top=G.teams.find(t=>t.id!=="red")&&G.teams.find(t=>t.id!==G.teams[0].id);if(G.mode==="machine"){top=team("red")}else top=G.teams.find(t=>t.id!==G.turn);let bottom=G.teams.find(t=>t.id===G.turn);$("top-team").textContent=`${top.name} • ${top.territory}%`;$("bottom-team").textContent=`${bottom.name} • ${bottom.territory}%`;$("turn-title").textContent=`Vez de ${team(G.turn).name}`;$("turn-sub").textContent=`Rodada ${G.round} • ${G.ops} operação(ões) restante(s)`;$("territory").innerHTML=G.teams.map(t=>`<div class="territory-meter ${t.id}"><div class="territory-meta"><strong>${escapeHtml(t.name)}</strong><b>${Math.round(t.territory/160*100)}%</b></div><div class="territory-track"><i style="width:${Math.max(0,Math.min(100,t.territory/160*100))}%"></i></div><small>${t.territory}/160 casas ocupadas</small></div>`).join("");renderReserve();renderBoard();renderActions();$("log").innerHTML=G.log.map(x=>`<div>• ${escapeHtml(x)}</div>`).join("")}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderReserve(){
 let t=team(G.turn);
 $("reserve").innerHTML=["tank","patrol"].map(k=>`<button data-res="${k}" class="reserve-unit ${reservePick===k?'selected':''}" title="Selecionar ${k==="tank"?"tanque":"patrulha"} da reserva"><img src="assets/units/${k}/${k}_front.svg" alt=""><span class="reserve-name">${k==="tank"?"Tanques":"Patrulhas"}</span><strong>${t.reserve[k]}</strong></button>`).join("");
 document.querySelectorAll("[data-res]").forEach(b=>b.onclick=()=>{reservePick=b.dataset.res;selected=null;$("instruction").textContent=`Escolha uma casa vazia na sua linha inicial para posicionar ${reservePick}.`;render()})
}
function unitStatusText(u){
 const owner=team(u.owner)?.name||u.owner;
 const damage=Object.entries(u.damage||{}).filter(([,v])=>v>0).map(([weapon,v])=>`${weapon}: ${v} impacto(s)`).join("\\n")||"Sem danos registrados";
 const groundHits=(u.damage?.tank||0)+(u.damage?.patrol||0);
 const airHits=(u.damage?.aircraft||0)+(u.damage?.drone||0);
 const totalHits=Object.values(u.damage||{}).reduce((sum,v)=>sum+v,0);
 const remainingText=airHits? "Veículo destruído por ataque aéreo":`${Math.max(0,2-groundHits)} impacto(s) terrestre(s) restante(s) para destruição`;
 const flags=[u.aa?"Defesa antiaérea ATIVADA":"Defesa antiaérea desligada",u.dodge?"Esquiva preparada":"Esquiva não preparada",u.type==="tank"?(u.airAvailable?"Apoio aéreo disponível":"Apoio aéreo já utilizado/perdido"):(u.droneAvailable?"Drone disponível":"Drone já utilizado/perdido"),u.moved?"Já se moveu nesta rodada":"Ainda pode mover",u.actionUsed?"Já realizou ação nesta rodada":"Ação complementar disponível"];
 return `${owner} • ${u.type==="tank"?"Tanque":"Patrulha"}\\nImpactos totais: ${totalHits}\\n${remainingText}\\n${flags.join("\\n")}\\nDanos por arma:\\n${damage}`;
}
function baseStatusText(b){
 const owner=team(b.owner)?.name||b.owner,alive=b.cells.filter(p=>p.hp>0).length,occupied=unitAt(b.center.r,b.center.c).length>0;
 return `Base de ${owner}\nDefesa ${b.mode==="aa"?"ANTIAÉREA":"TERRESTRE"}\nCélulas restantes: ${alive}/9\nCentro ${occupied?"ocupado":"livre"}\nDisparos terrestres nesta rodada: ${b.lastGroundShotRound===G.round?"já utilizado":"disponível"}`;
}
function attackRangeCells(u){
 const out=new Set(),range=u.type==="tank"?5:3;
 for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]])for(let n=1;n<=range;n++){
  const r=u.r+dr*n,c=u.c+dc*n;if(!inside(r,c))break;out.add(`${r},${c}`);
  if(unitAt(r,c).length||baseAt(r,c))break;
 }
 return out;
}
function attackableCells(u){
 const out=new Set(),range=u.type==="tank"?5:3;
 for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
  for(let n=1;n<=range;n++){
   const r=u.r+dr*n,c=u.c+dc*n;if(!inside(r,c))break;
   const units=unitAt(r,c);
   if(units.length){
    if(units.some(x=>x.owner!==u.owner))out.add(`${r},${c}`);
    break;
   }
   const b=baseAt(r,c);
   if(b){if(b.center.r===r&&b.center.c===c&&b.owner!==u.owner)out.add(`${r},${c}`);break}
  }
 }
 return out;
}
function processBaseGroundDefenses(){
 let fired=false;
 for(const b of G.bases){
  if(b.mode!=="ground"||b.lastGroundShotRound===G.round)continue;
  const intruders=G.units.filter(u=>u.owner!==b.owner&&Math.abs(u.r-b.center.r)<=1&&Math.abs(u.c-b.center.c)<=1);
  if(!intruders.length)continue;
  const target=intruders[0];b.lastGroundShotRound=G.round;
  if(target.dodge){target.dodge=false;showCombatNotice(`${target.type==="tank"?"Tanque":"Patrulha"} esquivou do disparo automático da base!`,"success");log(`${team(b.owner).name}: ${target.type} esquivou do disparo automático da base.`)}
  else{damageUnit(target,"tank");showCombatNotice(`${target.type==="tank"?"Tanque":"Patrulha"} atingido pela defesa automática da base!`,"damage");log(`${team(b.owner).name}: base atingiu automaticamente ${target.type} invasor nesta rodada.`)}
  if(effects)gameAudio.playExplosion();
  showImpactSmoke(target.r,target.c);fired=true;
 }
 if(fired){calcTerritory();save();render()}
}
function renderBoard(){let el=$("board");el.innerHTML="";for(let r=0;r<H;r++)for(let c=0;c<W;c++){let cell=document.createElement("button"),us=unitAt(r,c),b=baseAt(r,c),owner=ownerAt(r,c);const moveUnit=selected?.id&&selected?.mode!=="attack"&&selected?.mode!=="air-target"?G.units.find(x=>x.id===selected.id):null;const reachable=moveUnit&&path(moveUnit,r,c,moveUnit.type==="tank"?2:3);const airUnit=selected?.mode==="air-target"?G.units.find(x=>x.id===selected.id):null;const airReach=airUnit&&Math.abs(airUnit.r-r)+Math.abs(airUnit.c-c)<=5;const attackUnit=selected?.mode==="attack"?G.units.find(x=>x.id===selected.id):null;const attackCells=attackUnit?attackableCells(attackUnit):null;const attackRange=attackUnit?attackRangeCells(attackUnit):null;const attackOption=attackCells?.has(`${r},${c}`);const attackInRange=attackRange?.has(`${r},${c}`);cell.className=`cell ${owner}`+(b?" base":"")+(selected&&selected.r===r&&selected.c===c?" selected":"")+(reachable?" move-option":"")+(airReach?" air-range":"")+(attackInRange?" attack-range":"")+(attackOption?" attack-option":"");cell.dataset.r=r;cell.dataset.c=c;let u=us[0];if(u){let variant=u.type==="tank"?(u.aa?"tank_aa_":u.dodge?"tank_dodge_":"tank_")+(u.direction||"front"):(u.dodge?"patrol_dodge_":"patrol_")+(u.direction||"front");let src=`assets/units/${u.type}/${variant}.svg`;let dmg=Object.values(u.damage||{}).reduce((a,v)=>a+v,0);cell.innerHTML=`<img class="unit-${u.owner} ${dmg?"unit-damaged":""} ${u.dodge?"unit-dodge":""} ${u.aa?"unit-aa":""}" src="${src}" onerror="this.src='assets/units/${u.type}/${u.type}_front.svg'">${u.aa?'<img class="aa-status-icon" src="assets/ui/icon_shield.svg" alt="Defesa antiaérea ativa">':""}${dmg?`<span class="damage-count" aria-label="${dmg} impactos recebidos" title="${dmg} impactos recebidos">${dmg}</span>`:""}${us.length>1?'<span class="multi">×'+us.length+'</span>':''}`;cell.title=us.map(unitStatusText).join("\n\n");cell.setAttribute("aria-label",cell.title)}else if(b){let center=b.center&&b.center.r===r&&b.center.c===c;let art=center?(b.mode==="aa"?"base_anti_air.svg":"base_ground_defense.svg"):"base_peripheral.svg";cell.innerHTML=`<img class="base-mark base-owner-${b.owner}" src="assets/bases/${art}" alt="Base ${center?(b.mode==="aa"?"antiaérea":"terrestre"):"periférica"}">${center?`<img class="base-mode" src="assets/ui/icon_${b.mode==="aa"?"shield":"settings"}.svg" alt="Modo de defesa">`:""}`;cell.title=baseStatusText(b);cell.setAttribute("aria-label",cell.title)}else{cell.title=`Terreno neutro • Linha ${r+1}, coluna ${c+1}`}cell.onclick=()=>clickCell(r,c);el.append(cell)}}
function renderActions(){
 let el=$("actions");el.innerHTML="";
 if(selected?.mode==="attack"||selected?.mode==="air-target"||selected?.mode==="move"){
  let cancel=document.createElement("button");
  cancel.textContent=selected.mode==="move"?"Desistir do movimento":"Cancelar seleção";
  cancel.onclick=()=>{
   const u=G.units.find(x=>x.id===selected?.id);
   selected=u?{id:u.id,r:u.r,c:u.c,mode:"unit"}:null;
   $("instruction").textContent=selected?.mode==="unit"?"Movimento cancelado. Nenhuma operação foi consumida. Escolha outra ação.":"Seleção cancelada. Escolha outra unidade ou ação.";
   render();
  };
  el.append(cancel);
 }
 if(selected?.baseId){
  let b=G.bases.find(x=>x.id===selected.baseId);if(!b)return;
  let occupied=unitAt(b.center.r,b.center.c).length>0;
  if(!occupied&&b.owner===G.turn){
   [["Defesa terrestre",()=>setBaseMode(b,"ground")],["Defesa antiaérea",()=>setBaseMode(b,"aa")]].forEach(([label,fn])=>{
    let x=document.createElement("button");x.textContent=label;x.onclick=fn;el.append(x)
   })
  }
  return;
 }
 if(!selected?.id)return;
 if(!selected.mode||selected.mode==="unit"){
  let clear=document.createElement("button");
  clear.textContent="Desmarcar seleção";
  clear.onclick=()=>{selected=null;reservePick=null;$("instruction").textContent="Seleção desmarcada. Escolha uma unidade ou peça da reserva.";render()};
  el.append(clear);
 }
 let u=G.units.find(x=>x.id===selected.id);
 if(!u||u.owner!==G.turn)return;
 let acts=[],slotAvailable=G.ops>0||G.used.includes(u.id);
 if(slotAvailable&&!u.moved)acts.push({label:"Mover",fn:()=>chooseMove(u)});
 if(slotAvailable&&!u.actionUsed){
  acts.push({label:"Atacar",fn:()=>chooseAttack(u)});
  acts.push({label:"Esquiva",fn:()=>activateDodge(u)});
  acts.push({label:u.aa?"Desativar defesa antiaérea":"Defesa antiaérea",fn:()=>toggleAA(u)});
  if(u.type==="tank")acts.push({label:u.airAvailable?"Apoio aéreo":"Apoio aéreo utilizado",fn:()=>airStrike(u,"aircraft"),disabled:!u.airAvailable});
  if(u.type==="patrol")acts.push({label:u.droneAvailable?"Lançar drone":"Drone utilizado",fn:()=>airStrike(u,"drone"),disabled:!u.droneAvailable});
  acts.push({label:"Construir base",fn:()=>buildBase(u,"ground")});
 }
 acts.forEach(({label,fn,disabled=false})=>{
  let b=document.createElement("button");b.textContent=label;b.disabled=disabled;
  if(disabled)b.title="Este recurso já foi utilizado e não pode ser recuperado nesta partida.";
  b.onclick=fn;el.append(b)
 });
}
function setBaseMode(b,mode){if(b.owner!==G.turn||unitAt(b.center.r,b.center.c).length){alert("Só é possível configurar a base quando seu centro estiver desocupado.");return}b.mode=mode;log(`Base alterada para defesa ${mode==="aa"?"antiaérea":"terrestre"}.`);selected=null;save();render()}
function clickCell(r,c){if(G.status!=="playing")return;if(selected?.mode==="air-target"){let u=G.units.find(x=>x.id===selected.id);if(u){executeAirStrike(u,selected.airType,r,c)}return}if(selected?.mode==="attack"){let u=G.units.find(x=>x.id===selected.id);if(u)attackAt(u,r,c);return}if(selected?.mode==="move"){let u=G.units.find(x=>x.id===selected.id);if(u){moveTo(u,r,c);return}}if(reservePick){deploy(reservePick,r,c);return}let us=unitAt(r,c);if(!us.length){let b=baseAt(r,c);if(b&&b.center.r===r&&b.center.c===c){selected={baseId:b.id,r,c};reservePick=null;$("instruction").textContent="Base selecionada: escolha defesa terrestre ou antiaérea (centro desocupado).";render();return}}if(selected&&selected.id&&us.length===0){$("instruction").textContent="Peça selecionada. Escolha “Mover” no painel de ações ou desmarque a seleção.";render();return}if(us.length){let u=us.find(x=>x.owner===G.turn)||us[0];selected={id:u.id,r,c,mode:"unit"};$("instruction").textContent=`${u.type} • ${Object.values(u.damage||{}).reduce((a,v)=>a+v,0)} impacto(s) recebido(s) • selecione uma ação.`}else{selected=null;$("instruction").textContent="Selecione uma unidade ou uma peça da reserva."}render()}
function canOp(u,kind="action"){if(G.ops<=0&&!G.used.includes(u.id)){alert("As três operações desta rodada já foram usadas.");return false}if(kind==="move"&&u.moved){alert("Esta peça já se movimentou nesta rodada.");return false}if(kind==="action"&&u.actionUsed){alert("Esta peça já realizou sua ação complementar nesta rodada.");return false}return true}function spend(u,kind="action"){if(!G.used.includes(u.id)){G.ops--;G.used.push(u.id)}if(kind==="move")u.moved=true;else u.actionUsed=true;u.used=true;save();}
function deploy(type,r,c){let t=team(G.turn),start=G.turn===G.teams[0].id&&G.mode==="local"?H-1:(G.turn==="red"?0:H-1);if(G.turn!=="red"&&G.mode==="machine")start=H-1;if(G.mode==="local")start=G.teams[0].id===G.turn?H-1:0;if(r!==start||unitAt(r,c).length||!inside(r,c)){alert("Escolha uma casa vazia na sua linha inicial.");return}if(t.reserve[type]<=0){alert("Não há unidades desse tipo na reserva.");return}if(G.ops<=0){alert("Sem operações restantes.");return}t.reserve[type]--;rememberHuman("deploy",{type,column:c});let u=createUnit(type,G.turn,r,c);G.used.push(u.id);G.ops--;u.actionUsed=true;reservePick=null;selected={id:u.id,r,c};log(`${t.name} posicionou ${type} na linha inicial.`);afterAction();}
function path(u,r,c,max){let dr=r-u.r,dc=c-u.c;if(Math.abs(dr)+Math.abs(dc)===0||dr!==0&&dc!==0||Math.abs(dr)+Math.abs(dc)>max)return null;let n=Math.max(Math.abs(dr),Math.abs(dc)),out=[];for(let i=1;i<=n;i++){let rr=u.r+Math.sign(dr)*i,cc=u.c+Math.sign(dc)*i;if(!inside(rr,cc)||unitAt(rr,cc).length)return null;out.push([rr,cc])}return out}
function chooseMove(u){if((G.round||1)===1){alert("Na primeira rodada, os veículos só podem ser posicionados na linha inicial. O movimento será liberado a partir da segunda rodada.");return}if(!canOp(u,"move"))return;$("instruction").textContent=`Escolha uma casa livre para mover (tanque: até 2; patrulha: até 3 casas ortogonais). Use “Desistir do movimento” para cancelar sem gastar operação.`;selected={id:u.id,r:u.r,c:u.c,mode:"move"};render()}
function triggerBaseGroundDefense(u,oldR,oldC){
 for(const b of G.bases){
  if(b.owner===u.owner||b.mode!=="ground")continue;
  const wasInside=Math.abs(oldR-b.center.r)<=1&&Math.abs(oldC-b.center.c)<=1;
  const nowInside=Math.abs(u.r-b.center.r)<=1&&Math.abs(u.c-b.center.c)<=1;
  if(!nowInside||wasInside)continue;
  if(b.lastGroundShotRound===G.round)continue;
  b.lastGroundShotRound=G.round;
  if(u.dodge){u.dodge=false;log(`${team(b.owner).name}: a base tentou atingir ${u.type}, mas a unidade esquivou.`);showCombatNotice(`${u.type==="tank"?"Tanque":"Patrulha"} esquivou do disparo da base!`,"success")}
  else{damageUnit(u,"tank");log(`${team(b.owner).name}: defesa terrestre da base atingiu ${u.type} invasor.`);showCombatNotice(`${u.type==="tank"?"Tanque":"Patrulha"} atingido pela defesa da base!`,"damage")}
  if(effects)gameAudio.playExplosion();
  return true;
 }
 return false;
}
function moveTo(u,r,c){if(selected?.mode!=="move"&&selected?.mode!=="unit")return;if((G.round||1)===1){alert("Movimento bloqueado na primeira rodada. Posicione suas unidades na linha inicial; o movimento será liberado na segunda rodada.");selected=null;render();return}if(!canOp(u,"move"))return;let p=path(u,r,c,u.type==="tank"?2:3);if(!p){alert("Movimento inválido: apenas em linha reta, sem atravessar peças, respeitando o alcance.");return}rememberHuman("move",{type:u.type,from:[u.r,u.c],to:[r,c]});const oldR=u.r,oldC=u.c;u.r=r;u.c=c;u.direction=c>selected.c?"right":c<selected.c?"left":r<selected.r?"front":"back";spend(u,"move");const baseHit=triggerBaseGroundDefense(u,oldR,oldC);if(effects)(u.type==="tank"?gameAudio.playTankMovement():gameAudio.playPatrolMovement());log(`${team(u.owner).name} moveu ${u.type}.`);selected={id:u.id,r,c};calcTerritory();save();render();if(baseHit)showImpactSmoke(r,c);if(checkVictory())return;}
function chooseAttack(u){if(!canOp(u))return;$("instruction").textContent=`Alvos destacados em amarelo: escolha um veículo inimigo ou o centro da base, em linha reta, até ${u.type==="tank"?5:3} casas.`;selected={id:u.id,r:u.r,c:u.c,mode:"attack"};render()}
function resolveGroundTarget(u,r,c){
 const dr=r-u.r,dc=c-u.c,range=u.type==="tank"?5:3;
 if((dr!==0&&dc!==0)||(!dr&&!dc))return {ok:false,reason:"direction"};
 const distance=Math.abs(dr)+Math.abs(dc);
 if(distance>range)return {ok:false,reason:"range"};
 for(let i=1;i<=distance;i++){
  const rr=u.r+Math.sign(dr)*i,cc=u.c+Math.sign(dc)*i;
  const occupants=unitAt(rr,cc);
  if(occupants.length){
   const target=occupants.find(x=>x.owner!==u.owner)||occupants[0];
   return i===distance?{ok:true,target,baseTarget:null}:{ok:false,reason:"blocked"};
  }
  const base=baseAt(rr,cc);
  if(base){
   const cell=baseCell(base,rr,cc);
   if(i===distance&&rr===base.center.r&&cc===base.center.c&&cell&&cell.hp>0&&base.owner!==u.owner)
    return {ok:true,target:null,baseTarget:{base,cell}};
   return {ok:false,reason:"blocked"};
  }
 }
 return {ok:false,reason:"empty"};
}
function attackAt(u,r,c,options={}){
 if(!canOp(u,"action"))return false;
 const result=resolveGroundTarget(u,r,c);
 const cancelAim=(message)=>{
  if(!options.silent)alert(message);
  selected={id:u.id,r:u.r,c:u.c,mode:"unit"};
  $("instruction").textContent="Ataque não realizado. Escolha novamente a unidade ou outra ação.";
  render();
  return false;
 };
 if(!result.ok){
  if(result.reason==="direction")return cancelAim("O ataque terrestre exige um alvo na mesma linha ou coluna.");
  if(result.reason==="range")return cancelAim(`Alvo fora do alcance. ${u.type==="tank"?"Tanque: até 5":"Patrulha: até 3"} casas ortogonais. Nenhuma operação foi consumida.`);
  return cancelAim("Nenhum alvo válido na linha de tiro. Verifique se há uma unidade inimiga ou o centro de uma base na linha de tiro.");
 }
 const {target,baseTarget}=result;
 if(target&&target.owner===u.owner&&!options.silent&&!confirm("Fogo amigo! Deseja atacar sua própria unidade?")){
  selected={id:u.id,r:u.r,c:u.c,mode:"unit"};render();return false;
 }
 rememberHuman("attack",{weapon:u.type,target:target?target.type:"base",targetPos:[r,c]});
 if(target&&target.dodge){
  target.dodge=false;
  showCombatNotice(`${target.type==="tank"?"Tanque":"Patrulha"} esquivou do ataque!`,"success");
  log(`${target.type} esquivou do ataque direto.`);
 }else if(target)damageUnit(target,u.type);
 else damageBaseCell(baseTarget.base,baseTarget.cell,u.type);
 spend(u);if(effects)gameAudio.playExplosion();
 log(`${team(u.owner).name} atacou ${target?target.type:"centro de base"}.`);
 afterAction();showImpactSmoke(r,c);
 return true;
}
function showCombatNotice(message,kind="info"){
 let el=document.getElementById("combat-notice");
 if(!el){el=document.createElement("div");el.id="combat-notice";el.className="combat-notice";document.body.append(el)}
 el.textContent=message;el.className=`combat-notice ${kind} visible`;
 clearTimeout(window.__combatNoticeTimer);
 window.__combatNoticeTimer=setTimeout(()=>el.classList.remove("visible"),2000);
}
function showImpactSmoke(r,c){
 const el=$("board");if(!el)return;
 for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
  const rr=r+dr,cc=c+dc;if(!inside(rr,cc))continue;
  const cell=el.children[rr*W+cc];if(!cell)continue;
  cell.classList.remove("smoke-impact");void cell.offsetWidth;cell.classList.add("smoke-impact");
  setTimeout(()=>cell.classList.remove("smoke-impact"),2200);
 }
}
function damageUnit(target,weapon){
 const required=DAMAGE[target.type]?.[weapon];
 if(!required){log(`Este ataque não causa dano a ${target.type}.`);return false}
 target.damage=target.damage||{};
 target.damage[weapon]=(target.damage[weapon]||0)+1;
 const airHit=weapon==="aircraft"||weapon==="drone";
 const hits=airHit?target.damage[weapon]:(target.damage.tank||0)+(target.damage.patrol||0);
 const threshold=airHit?1:2;
 if(hits>=threshold){
  G.units=G.units.filter(x=>x.id!==target.id);
  log(`${target.type} destruído após ${airHit?"um ataque aéreo":"dois impactos terrestres"}.`);
  showCombatNotice(`${target.type==="tank"?"Tanque":"Patrulha"} destruído!`,"danger");
 }else{
  log(`${target.type} atingido: ${hits}/${threshold} impactos para destruição.`);
  showCombatNotice(`${target.type==="tank"?"Tanque":"Patrulha"} atingido! ${hits}/${threshold} impactos`,"damage");
 }
 return true;
}
function damageBaseCell(base,cell,weapon){
 const isCenter=cell.r===base.center.r&&cell.c===base.center.c;
 const required=DAMAGE[isCenter?"baseCenter":"basePeripheral"][weapon];
 if(!required){log("Ataques terrestres não atingem células periféricas da base.");return false}
 cell.damage=cell.damage||{};cell.damage[weapon]=(cell.damage[weapon]||0)+1;cell.hp=Math.max(0,required-cell.damage[weapon]);
 if(cell.hp===0){
  if(isCenter){G.bases=G.bases.filter(b=>b.id!==base.id);log("Centro destruído: base inteira eliminada e suas demais casas tornaram-se neutras.")}
  else {log("Célula periférica destruída: esta casa tornou-se neutra.")}
  showCombatNotice("Parte da base foi destruída!","danger");
 }else{log(`${isCenter?"Centro":"Célula periférica"} da base atingido: ${cell.damage[weapon]}/${required}.`);showCombatNotice("Base atingida!","damage")}
 return true;
}
function checkVictory(){
 if(!G||G.status!=="playing")return false;
 const survivors=G.teams.map(t=>({team:t,units:G.units.some(u=>u.owner===t.id),reserve:t.reserve.tank+t.reserve.patrol,bases:G.bases.some(b=>b.owner===t.id)}));
 const alive=survivors.filter(x=>x.units||x.reserve>0||x.bases);
 if(alive.length<=1){G.status="finished";G.winner=alive[0]?.team.id||null;save();render();
  const title=G.winner?`${team(G.winner).name} venceu!`:"Empate";
  const msg=G.winner?"Vitória por destruição total: o adversário ficou sem unidades no campo, sem reservas e sem bases.":"As duas forças foram totalmente destruídas.";
  startMessage(title,msg,()=>startMessage("A jornada continua","A batalha terminou, mas a jornada continua. Na vida espiritual, perder uma batalha não significa perder a guerra. Não desanime, não abandone sua fé e não confie apenas em suas próprias forças. Busque a Deus, aprenda com o caminho percorrido, persevere e volte à luta! Pois é no Senhor que encontramos força para continuar."),(G.mode==="machine"&&G.winner==="red")?"assets/branding/resultado-derrota.jpg":"assets/branding/resultado-vitoria.jpg");return true;
 }
 return false;
}
function activateDodge(u){if(!canOp(u))return;u.dodge=true;spend(u);log(`${u.type} preparou esquiva para o próximo ataque direto.`);showCombatNotice(`${u.type==="tank"?"Tanque":"Patrulha"} preparou a esquiva!`,"success");afterAction()}
function toggleAA(u){if(!canOp(u))return;u.aa=!u.aa;spend(u);log(`Defesa antiaérea ${u.aa?"ativada":"desativada"}.`);afterAction()}
function buildBase(u,mode="ground"){if(!canOp(u,"action"))return;let cells=[];for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++)cells.push({r:u.r+dr,c:u.c+dc});if(cells.some(p=>!inside(p.r,p.c)||baseAt(p.r,p.c)||ownerAt(p.r,p.c)!=="neutral"&&ownerAt(p.r,p.c)!==u.owner)){alert("A base 3×3 precisa caber no tabuleiro e ocupar apenas território neutro ou próprio, sem sobreposição.");return}let b={id:G.nextId++,owner:u.owner,cells:cells.map(p=>({...p,hp:(p.r===u.r&&p.c===u.c)?DAMAGE.baseCenter.aircraft:2,damage:{}})),center:{r:u.r,c:u.c},mode:"ground",shots:1};G.bases.push(b);rememberHuman("buildBase",{mode,center:[u.r,u.c]});for(let p of cells)p.owner=u.owner;cells.forEach(p=>p.owner=u.owner);spend(u);calcTerritory();log(`${team(u.owner).name} construiu uma base; a defesa poderá ser configurada depois, com o centro livre.`);afterAction()}
function airStrike(u,type){
 if(!canOp(u,"action"))return;
 const prop=type==="aircraft"?"airAvailable":"droneAvailable";
 if(!u[prop]){alert("Este apoio aéreo já foi utilizado ou foi perdido.");return}
 selected={id:u.id,r:u.r,c:u.c,mode:"air-target",airType:type};
 $("instruction").textContent=`Escolha um alvo inimigo a até 5 casas ortogonais para ${type==="aircraft"?"o apoio aéreo":"o drone"}. O recurso só será consumido se o alvo estiver no alcance.`;
 render();
}
function buildAirRoute(fromR,fromC,toR,toC){
 const route=[];let rr=fromR,cc=fromC;
 const horizontalFirst=Math.abs(toC-cc)>=Math.abs(toR-rr);
 if(horizontalFirst){while(cc!==toC){cc+=Math.sign(toC-cc);route.push([rr,cc])}while(rr!==toR){rr+=Math.sign(toR-rr);route.push([rr,cc])}}
 else{while(rr!==toR){rr+=Math.sign(toR-rr);route.push([rr,cc])}while(cc!==toC){cc+=Math.sign(toC-cc);route.push([rr,cc])}}
 return route;
}
function findAirInterceptor(owner,route){
 for(const [r,c] of route){
  const units=unitAt(r,c);
  const aaVehicle=units.find(v=>v.owner!==owner&&v.aa);
  if(aaVehicle)return {kind:aaVehicle.type,unit:aaVehicle,r,c};
  const aaBase=G.bases.find(b=>b.owner!==owner&&b.mode==="aa"&&Math.abs(r-b.center.r)<=1&&Math.abs(c-b.center.c)<=1);
  if(aaBase)return {kind:"base",base:aaBase,r,c};
 }
 return null;
}
async function executeAirStrike(u,type,r,c){
 const prop=type==="aircraft"?"airAvailable":"droneAvailable";
 if(!canOp(u,"action"))return;
 if(!u[prop]){alert("Este apoio aéreo já foi utilizado ou foi perdido.");return}
 const target=unitAt(r,c).find(x=>x.owner!==u.owner);
 const base=baseAt(r,c);
 const enemyBase=base&&base.owner!==u.owner;
 if(!target&&!enemyBase){alert("Selecione uma unidade ou uma casa pertencente a uma base inimiga.");return}
 const distance=Math.abs(r-u.r)+Math.abs(c-u.c);
 if(distance>5){alert(`Alvo fora do alcance. O limite do ${type==="aircraft"?"apoio aéreo":"drone"} é de 5 casas ortogonais. O recurso não foi consumido.`);return}
 if(distance===0){alert("Escolha um alvo diferente da casa do veículo lançador.");return}
 // Route orthogonale partilhada com Provações; nunca percorre diagonal.
 const route=buildAirRoute(u.r,u.c,r,c);
 spend(u,"action");u[prop]=false;selected=null;reservePick=null;
 const flight=document.createElement("div");flight.className="air-flight";
 for(const [ar,ac] of route){
  $("flight-status").textContent=`${type==="aircraft"?"Avião":"Drone"} em voo — ${ar+1}, ${ac+1}`;
  renderBoard();const cell=$("board").children[ar*W+ac];
  if(cell){const img=document.createElement("img");img.src=`assets/units/${type}/${type}_front.svg`;img.className="flight-overlay";cell.append(img)}
  if(effects)gameAudio.playAirMovement();
  await new Promise(res=>setTimeout(res,125));
 }
 // Antiaircraft interception: a tank AA catches the aircraft on its exact square;
 // a base AA catches it anywhere inside the base's surviving 3x3 perimeter.
 const interceptor=findAirInterceptor(u.owner,route);
 if(interceptor){
  const label=type==="aircraft"?"Avião":"Drone";
  $("flight-status").textContent=`${label} abatido pela defesa antiaérea!`;
  if(effects)gameAudio.playExplosion();
  log(`${label} abatido pela defesa antiaérea ${interceptor.kind==="base"?"da base":`do ${interceptor.kind==="tank"?"tanque":"patrulha"}`} em ${interceptor.r+1}, ${interceptor.c+1}. Nenhum bombardeio foi realizado.`);
  showCombatNotice(`${label} abatido pela defesa antiaérea!`,"danger");
  calcTerritory();save();render();showImpactSmoke(interceptor.r,interceptor.c);await new Promise(res=>setTimeout(res,500));$("flight-status").textContent="";afterAction();return;
 }
 // The aircraft/drone attacks only the exact target selected by the player.
 if(target){damageUnit(target,type)}
 else{
  const targetCell=base&&baseCell(base,r,c);
  if(!targetCell||targetCell.hp<=0){showCombatNotice("Alvo da base inválido.","danger");afterAction();return}
  damageBaseCell(base,targetCell,type);
 }
 $("flight-status").textContent=`${type==="aircraft"?"Avião":"Drone"} atingiu somente o alvo escolhido.`;
 showCombatNotice(`${type==="aircraft"?"Avião":"Drone"} bombardeou a área!`,"damage");
 if(effects)gameAudio.playExplosion();
 log(`${type==="aircraft"?"Avião":"Drone"} atingiu somente o alvo escolhido (${r+1}, ${c+1}) após percorrer ${distance} casas.`);
 calcTerritory();save();render();showImpactSmoke(r,c);if(checkVictory())return;
 await new Promise(res=>setTimeout(res,500));$("flight-status").textContent="";afterAction();
}
function afterAction(){selected=null;reservePick=null;calcTerritory();save();render();checkVictory()}
function endTurn(){if(G.status!=="playing"||checkVictory())return;let current=G.turn;G.turn=enemy(current).id;if(G.mode==="machine"&&current==="red"||G.mode==="local"&&G.turn===G.teams[0].id){G.round=(G.round||1)+1;processBaseGroundDefenses();if(checkVictory())return}G.ops=3;G.used=[];G.units.forEach(u=>{if(u.owner===G.turn){u.used=false;u.moved=false;u.actionUsed=false}});selected=null;reservePick=null;save();render();if(G.mode==="machine"&&G.turn==="red")setTimeout(aiTurn,500);else if(G.mode==="local")startMessage(`Vez de ${team(G.turn).name}`,"Passe o aparelho para o próximo jogador. O tabuleiro permanece visível.")}

// Inteligência estratégica Provações — heurística determinística, sem acesso a informação oculta.
function aiDistance(a,b){return Math.abs(a.r-b.r)+Math.abs(a.c-b.c)}
function aiLineTarget(u,t){
 const resolved=resolveGroundTarget(u,t.r,t.c);
 if(!resolved.ok)return false;
 if(t.id)return resolved.target?.id===t.id;
 return resolved.baseTarget?.base?.id===t.id || !!resolved.baseTarget;
}
function aiDamageProgress(u){return Object.values(u.damage||{}).reduce((a,b)=>a+b,0)}
function aiRemainingHits(target,weapon){
 let n=DAMAGE[target.type]?.[weapon];if(!n)return 99;
 const d=target.damage||{};
 if(weapon==="tank"||weapon==="patrol")return Math.max(0,2-(d.tank||0)-(d.patrol||0));
 return Math.max(0,1-(d[weapon]||0));
}
function aiCanBuild(u){for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){let r=u.r+dr,c=u.c+dc;if(!inside(r,c)||baseAt(r,c)||(ownerAt(r,c)!=="neutral"&&ownerAt(r,c)!==u.owner))return false}return true}
function aiBaseThreat(b){let e=G.units.filter(u=>u.owner!=="red");return e.reduce((s,u)=>s+Math.max(0,7-aiDistance(u,b.center)),0)}
function aiMemoryProfile(){let m=readAIMemory(),s=m.stats||{};return {memory:m,aggressive:(s.attack||0)+(s.move||0),builder:s.buildBase||0,deploy:s.deploy||0}}
function aiScoreAttack(u,t){let hits=aiRemainingHits(t,u.type);if(hits>=99)return -1;const st=readAIMemory().stats||{};let score=110+(aiDamageProgress(t)*8)+(hits===1?55:0)+(t.type==="tank"?12:0)-aiDistance(u,t)*2;if(hits===1)score+=35;
 // Adapta a seleção ao estilo observado: unidades agressivas ou construtoras.
 if((st.attack||0)+(st.move||0)>(st.buildBase||0)*1.5)score+=8;
 return score}
function aiBestAttack(){
 let best=null;
 for(const u of G.units.filter(x=>x.owner==="red"&&!x.actionUsed&&(G.ops>0||G.used.includes(x.id)))){
  for(const t of G.units.filter(x=>x.owner!=="red"&&unitAt(x.r,x.c).some(v=>v.id===x.id)))if(aiLineTarget(u,t)){
   let score=aiScoreAttack(u,t);if(score>0&&(!best||score>best.score))best={kind:"attack",u,t,score};
  }
  for(const b of G.bases.filter(x=>x.owner!=="red")){
   if(aiLineTarget(u,b.center)){let cell=baseCell(b,b.center.r,b.center.c);if(cell?.hp>0){let hits=aiRemainingHits({type:"baseCenter",damage:cell.damage},u.type);let score=70+(hits===1?45:0)-aiDistance(u,b.center);const st=readAIMemory().stats||{};if((st.buildBase||0)>(st.attack||0))score+=22;if(!best||score>best.score)best={kind:"baseAttack",u,b,score}}}
  }
 }
 return best;
}
function aiBestAir(){
 let best=null;
 for(const u of G.units.filter(x=>x.owner==="red"&&!x.actionUsed&&(G.ops>0||G.used.includes(x.id)))){
  for(const [kind,prop] of [["aircraft","airAvailable"],["drone","droneAvailable"]]){
   if(!u[prop])continue;
   const candidates=[
    ...G.units.filter(x=>x.owner!=="red"&&unitAt(x.r,x.c).find(v=>v.owner!=="red")?.id===x.id).map(t=>({kind:"unit",target:t,r:t.r,c:t.c})),
    ...G.bases.filter(b=>b.owner!=="red").flatMap(b=>b.cells.filter(cell=>cell.hp>0&&!unitAt(cell.r,cell.c).some(v=>v.owner!=="red")).map(cell=>({kind:"base",base:b,target:cell,r:cell.r,c:cell.c})))
   ];
   for(const candidate of candidates){
    const distance=Math.abs(candidate.r-u.r)+Math.abs(candidate.c-u.c);
    if(distance<1||distance>5)continue;
    const route=buildAirRoute(u.r,u.c,candidate.r,candidate.c);
    if(findAirInterceptor("red",route))continue;
    let value;
    if(candidate.kind==="unit"){
     const hits=aiRemainingHits(candidate.target,kind);
     if(hits>=99)continue;
     value=(hits===1?105:48)+(candidate.target.type==="tank"?8:0)-distance*3;
    }else{
     const isCenter=candidate.base.center.r===candidate.r&&candidate.base.center.c===candidate.c;
     const targetData={type:isCenter?"baseCenter":"basePeripheral",damage:candidate.target.damage||{}};
     const hits=aiRemainingHits(targetData,kind);
     if(hits>=99)continue;
     value=(hits===1?68:34)+(isCenter?12:0)-distance*3;
    }
    if(!best||value>best.score)best={kind:"air",u,air:kind,target:candidate,score:value};
   }
  }
 }
 return best;
}
function aiBestMove(){
 if((G.round||1)===1)return null; // A abertura é exclusiva para posicionamento; nenhum lado avança.
 let best=null, enemies=G.units.filter(x=>x.owner!=="red");
 for(const u of G.units.filter(x=>x.owner==="red"&&!x.moved&&(G.ops>0||G.used.includes(x.id)))){
  const max=u.type==="tank"?2:3;
  for(let d=1;d<=max;d++)for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]){
   let r=u.r+dr*d,c=u.c+dc*d;if(!inside(r,c)||!path(u,r,c,max))continue;
   let nearest=enemies.length?Math.min(...enemies.map(e=>Math.abs(e.r-r)+Math.abs(e.c-c))):30;
   let score=20+(Math.min(12,Math.abs(u.r-r)+Math.abs(u.c-c))*0.2)+(12-nearest)*4;
   const st=readAIMemory().stats||{};
   if((st.move||0)>(st.buildBase||0))score+=4; // jogador móvel: procura interceptar suas unidades
   if((st.buildBase||0)>(st.move||0))score+=4; // jogador expansionista: pressiona bases e corredores próximos
   // Prefer a position from which an enemy becomes attackable.
   if(enemies.some(e=>((e.r===r||e.c===c)&&Math.abs(e.r-r)+Math.abs(e.c-c)<=(u.type==="tank"?5:3))))score+=32;
   // Do not expose tanks to obvious adjacent counter-fire when another move is comparable.
   const threatened=enemies.some(e=>aiLineTarget({...e,r,c},u));
   if(threatened)score-=18;
   if(!best||score>best.score)best={kind:"move",u,r,c,score};
  }
 }
 return best;
}
function aiBestBase(){
 let best=null;
 for(const u of G.units.filter(x=>x.owner==="red"&&!x.actionUsed&&(G.ops>0||G.used.includes(x.id)))){
  if(!aiCanBuild(u))continue;
  const nearby=G.bases.filter(b=>b.owner==="red").reduce((n,b)=>n+(aiDistance({r:u.r,c:u.c},b.center)<=5?1:0),0);
  const enemyNear=G.units.filter(e=>e.owner!=="red").reduce((n,e)=>n+(aiDistance(e,u)<=6?1:0),0);
  let score=48+nearby*18+enemyNear*4-(G.bases.filter(b=>b.owner==="red").length*3);
  if(!best||score>best.score)best={kind:"base",u,mode:"ground",score};
 }
 return best;
}
function aiDeploy(){
 const t=team("red");if(!t||G.ops<=0)return false;
 for(const type of ["tank","patrol"]){
  if(t.reserve[type]<=0)continue;
  for(let c=0;c<W;c++)if(!unitAt(0,c).length){
   deploy(type,0,c);
   return true;
  }
 }
 return false;
}
async function aiExecute(choice){
 if(!choice)return false;
 const u=choice.u;
 if(!u||u.owner!=="red"||(G.ops<=0&&!G.used.includes(u.id)))return false;
 if(choice.kind==="move"&&u.moved)return false;
 if(choice.kind!=="move"&&u.actionUsed)return false;
 if(choice.kind==="attack"){
  selected={id:u.id,r:u.r,c:u.c,mode:"attack"};
  return attackAt(u,choice.t.r,choice.t.c,{silent:true});
 }
 if(choice.kind==="baseAttack"){
  selected={id:u.id,r:u.r,c:u.c,mode:"attack"};
  return attackAt(u,choice.b.center.r,choice.b.center.c,{silent:true});
 }
 if(choice.kind==="air"){
  const candidate=choice.target;
  await executeAirStrike(u,choice.air,candidate.r,candidate.c);
  return true;
 }
 if(choice.kind==="move"){
  selected={id:u.id,r:u.r,c:u.c,mode:"move"};
  moveTo(u,choice.r,choice.c);
  return true;
 }
 if(choice.kind==="base"){
  selected={id:u.id,r:u.r,c:u.c,mode:"unit"};
  buildBase(u,choice.mode||"ground");
  return true;
 }
 if(choice.kind==="dodge"){
  selected={id:u.id,r:u.r,c:u.c,mode:"unit"};
  activateDodge(u);
  return true;
 }
 if(choice.kind==="aa"){
  selected={id:u.id,r:u.r,c:u.c,mode:"unit"};
  toggleAA(u);
  return true;
 }
 return false;
}
function aiFullReview(){
 const m=aiMemoryProfile(),own=G.units.filter(u=>u.owner==="red"),foe=G.units.filter(u=>u.owner!=="red");
 const ownBases=G.bases.filter(b=>b.owner==="red"),enemyBases=G.bases.filter(b=>b.owner!=="red");
 G.aiReview={round:G.round,ownUnits:own.length,enemyUnits:foe.length,ownBases:ownBases.length,enemyBases:enemyBases.length,territory:team("red").territory,playerStyle:m.aggressive>m.builder?"agressivo":"expansionista",memoryGames:m.memory.games||0};
 log(`Provações reavaliou a batalha (rodada ${G.round}) e atualizou suas prioridades.`);
}
async function aiTurn(){
 // Provações e suas frases são exclusivas do modo contra a máquina.
 if(!G||G.mode!=="machine"||G.status!=="playing"||G.turn!=="red")return;
 const human=team(G.teams.find(t=>t.id!=="red").id);
 if(!G.aiLastReview||((G.round||1)-G.aiLastReview)>=5){aiFullReview();G.aiLastReview=G.round||1}
 let safety=0;
 const hasPendingUsedVehicle=()=>G.used.some(id=>{const v=G.units.find(x=>x.id===id&&x.owner==="red");return v&&(!v.moved||!v.actionUsed)});
 while((G.ops>0||hasPendingUsedVehicle())&&safety<12&&G.status==="playing"){
  let did=false;
  // 1. Aproveita oportunidades de vitória ou eliminação imediatamente.
  let attack=aiBestAttack();
  const ownAlive=G.units.filter(u=>u.owner==="red").length+team("red").reserve.tank+team("red").reserve.patrol+G.bases.filter(b=>b.owner==="red").length;
  const foeAlive=G.units.filter(u=>u.owner!=="red").length+human.reserve.tank+human.reserve.patrol+G.bases.filter(b=>b.owner===human.id).length;
  if(attack&&foeAlive<=3)attack.score+=180;
  // 2. Testa ameaças com apoio aéreo antes de expor unidades terrestres.
  let air=aiBestAir();
  if(air&&(!attack||air.score>attack.score+12)){did=await aiExecute(air)}
  // 3. Foco ofensivo: ataque direto sempre que houver alvo válido.
  if(!did&&attack)did=await aiExecute(attack);
  // 4. Reforço imediato, respeitando a linha inicial e uma operação por peça.
  if(!did&& (team("red").reserve.tank+team("red").reserve.patrol)>0) did=aiDeploy();
  // 5. Cerco e pressão: reposiciona uma peça para abrir linhas de tiro e ameaçar bases.
  if(!did){let move=aiBestMove();if(move)did=await aiExecute(move)}
  // 6. Forma uma rede de bases se não houver ataque ou movimento mais útil.
  if(!did){let base=aiBestBase();if(base)did=await aiExecute(base)}
  // 7. Se uma unidade estiver sob ameaça imediata e ainda não houver ação ofensiva,
  // prepara esquiva (sem desperdiçar operação se não houver risco).
  if(!did){
   const endangered=G.units.filter(u=>u.owner==="red"&&!G.used.includes(u.id)&&!u.dodge&&G.units.some(e=>e.owner!=="red"&&aiLineTarget(e,u))).sort((a,b)=>aiDamageProgress(b)-aiDamageProgress(a))[0];
   if(endangered){did=await aiExecute({kind:"dodge",u:endangered});}
  }
  if(!did)break;
  safety++;
  calcTerritory();
  if(checkVictory())return;
 }
 render();save();
 const msg=taunts[human.identity||"varao"];
 startMessage("Provações",msg[Math.floor(Math.random()*msg.length)],()=>{
  if(G.status!=="playing")return;
  G.round=(G.round||1)+1;G.turn=human.id;processBaseGroundDefenses();if(checkVictory())return;G.ops=3;G.used=[];G.units.forEach(u=>{if(u.owner===G.turn){u.used=false;u.moved=false;u.actionUsed=false}});
  render();save();showPlayerTurnMessage();
 });
}
function updateSetupMode(){
 const localMode=$("mode").value==="local";
 $("difficulty-wrap").classList.toggle("hidden",localMode);
 $("p2-wrap").classList.toggle("hidden",!localMode);
 const p1=$("p1"),p2=$("p2");
 const options=localMode?[["blue","Varão — Azul"],["green","Varão — Verde"],["pink","Varoa — Rosa"],["yellow","Varoa — Amarela"]]:[["blue","Varão — Azul"],["pink","Varoa — Rosa"]];
 const current1=p1.value||"blue", current2=p2.value||"green";
 p1.innerHTML=options.map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
 p2.innerHTML=options.map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
 p1.value=options.some(x=>x[0]===current1)?current1:"blue";
 p2.value=options.some(x=>x[0]===current2&&x[0]!==p1.value)?current2:(options.find(x=>x[0]!==p1.value)?.[0]||"green");
 const sync=()=>{[...p2.options].forEach(o=>o.disabled=o.value===p1.value);if(p2.value===p1.value)p2.value=options.find(x=>x[0]!==p1.value)?.[0]||"green";[...p1.options].forEach(o=>o.disabled=localMode&&o.value===p2.value)};
 p1.onchange=sync;p2.onchange=sync;sync();
}
function openSetup(selectedMode){$("mode").value=selectedMode;updateSetupMode();$("home").classList.add("hidden");$("pieces-reference").classList.add("hidden");$("setup").classList.remove("hidden")}
$("home-machine").onclick=()=>openSetup("machine");
$("home-local").onclick=()=>openSetup("local");
$("back-home").onclick=()=>{$("setup").classList.add("hidden");$("home").classList.remove("hidden")};
$("home-pieces").onclick=()=>{$("home").classList.add("hidden");$("pieces-reference").classList.remove("hidden")};
$("pieces-close").onclick=()=>{$("pieces-reference").classList.add("hidden");$("home").classList.remove("hidden")};
$("home-credits").onclick=()=>startMessage("Créditos","Desenvolvido por Ricardo Augusto de Oliveira, criador do Google Site Renova-me Deus Meu.",()=>{});$("home-rules").onclick=()=>startMessage("Regras de Batalha Terrestre","Cada jogador tem três operações por rodada. Um veículo pode mover-se uma vez e realizar uma ação complementar. As peças começam na reserva. O tabuleiro possui 16 colunas e 10 linhas. Tanques e patrulhas têm o mesmo poder de fogo: dois impactos terrestres acumulados destroem qualquer um dos dois. Avião e drone destroem tanque ou patrulha com um único ataque, desde que a defesa antiaérea não intercepte o voo. Tanques têm alcance de tiro de até 5 casas e movimento de até 2; patrulhas têm alcance de tiro de até 3 casas e movimento de até 3. Os ataques terrestres seguem linhas retas, na horizontal ou vertical, e são bloqueados pela primeira unidade ou base. Bases ocupam 3×3 casas e podem ser configuradas em defesa terrestre ou antiaérea quando o centro estiver desocupado.",()=>{});$("mode").addEventListener("change",updateSetupMode);updateSetupMode();$("start").addEventListener("click",newGame);$("end-turn").onclick=endTurn;$("menu").onclick=()=>{if(confirm("Voltar ao menu? A partida ficará salva.")){$("game").classList.add("hidden");$("setup").classList.add("hidden");$("home").classList.remove("hidden")}};$("music").onclick=()=>{music=!music;if(music)gameAudio.startMusic();else gameAudio.stopMusic();$("music").textContent=`♫ Música: ${music?"ligada":"desligada"}`};$("sound").onclick=()=>{effects=!effects;$("sound").textContent=`Efeitos: ${effects?"ligados":"desligados"}`};
function migrateSavedCombatState(){
 if(!G||!Array.isArray(G.units))return;
 const before=G.units.length;
 G.units=G.units.filter(u=>{
  const d=u.damage||{};
  const ground=(d.tank||0)+(d.patrol||0);
  const air=(d.aircraft||0)+(d.drone||0);
  return ground<2&&air<1;
 });
 if(G.units.length<before){
  G.log=G.log||[];
  G.log.unshift("Regra de danos atualizada: veículos que já haviam recebido dois impactos terrestres ou um ataque aéreo foram removidos.");
  G.log=G.log.slice(0,18);
 }
}
$("resume").onclick=()=>{try{G=JSON.parse(localStorage.getItem(SAVE));migrateSavedCombatState();save();if(!G)throw 0;$("setup").classList.add("hidden");$("game").classList.remove("hidden");render();if(G.mode==="machine"&&G.turn==="red")setTimeout(aiTurn,500)}catch{alert("Não há partida salva válida.")}};
try{let s=JSON.parse(localStorage.getItem(SAVE));if(s&&s.status==="playing")$("resume").classList.remove("hidden")}catch{}
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));

