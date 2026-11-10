
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const DB=[
['Realme 13 Plus',6.67,120,'Android'],['Realme 12 Plus',6.67,120,'Android'],['Realme 12 Pro+',6.7,120,'Android'],['Realme 11 Pro+',6.7,120,'Android'],['Realme 11',6.4,90,'Android'],['Realme 10',6.4,90,'Android'],['Realme 9 Pro+',6.4,90,'Android'],['Realme C67',6.72,90,'Android'],['Realme C55',6.72,90,'Android'],['Realme C53',6.74,90,'Android'],['Realme C35',6.6,60,'Android'],['Realme C33',6.5,60,'Android'],['Realme C25',6.5,60,'Android'],['Realme Narzo 70 Pro',6.67,120,'Android'],['Realme Narzo 60',6.43,90,'Android'],
['Redmi Note 13 Pro+',6.67,120,'Android'],['Redmi Note 13 Pro',6.67,120,'Android'],['Redmi Note 13',6.67,120,'Android'],['Redmi Note 12 Pro+',6.67,120,'Android'],['Redmi Note 12',6.67,120,'Android'],['Redmi Note 11',6.43,90,'Android'],['Redmi Note 10',6.43,60,'Android'],['Redmi 13C',6.74,90,'Android'],['Redmi 12',6.79,90,'Android'],['Redmi 10A',6.53,60,'Android'],['Redmi 9A',6.53,60,'Android'],
['POCO X6 Pro',6.67,120,'Android'],['POCO X6',6.67,120,'Android'],['POCO X5 Pro',6.67,120,'Android'],['POCO X3 Pro',6.67,120,'Android'],['POCO M6 Pro',6.67,120,'Android'],['POCO M5',6.58,90,'Android'],
['Samsung Galaxy A05',6.7,60,'Android'],['Samsung Galaxy A05s',6.7,90,'Android'],['Samsung Galaxy A14',6.6,90,'Android'],['Samsung Galaxy A15',6.5,90,'Android'],['Samsung Galaxy A24',6.5,90,'Android'],['Samsung Galaxy A25',6.5,120,'Android'],['Samsung Galaxy A34',6.6,120,'Android'],['Samsung Galaxy A35',6.6,120,'Android'],['Samsung Galaxy A54',6.4,120,'Android'],['Samsung Galaxy A55',6.6,120,'Android'],['Samsung Galaxy S21',6.2,120,'Android'],['Samsung Galaxy S22',6.1,120,'Android'],['Samsung Galaxy S23',6.1,120,'Android'],['Samsung Galaxy S24',6.2,120,'Android'],
['Infinix Hot 10',6.78,60,'Android'],['Infinix Hot 20',6.82,90,'Android'],['Infinix Hot 30',6.78,90,'Android'],['Infinix Hot 40 Pro',6.78,120,'Android'],['Infinix Hot 50 Pro+',6.78,120,'Android'],['Infinix Note 30',6.78,120,'Android'],['Infinix Note 40',6.78,120,'Android'],['Infinix GT 10 Pro',6.67,120,'Android'],['Infinix GT 20 Pro',6.78,144,'Android'],
['Tecno Spark 10',6.6,90,'Android'],['Tecno Spark 20 Pro',6.78,120,'Android'],['Tecno Spark 20',6.6,90,'Android'],['Tecno Pova 5',6.78,120,'Android'],['Tecno Pova 6 Pro',6.78,120,'Android'],['Tecno Camon 20',6.67,120,'Android'],['Tecno Camon 30',6.78,120,'Android'],
['Vivo Y20',6.51,60,'Android'],['Vivo Y27',6.64,90,'Android'],['Vivo Y36',6.64,90,'Android'],['Vivo V29',6.78,120,'Android'],['Vivo V30',6.78,120,'Android'],['OPPO A16',6.52,60,'Android'],['OPPO A57',6.56,60,'Android'],['OPPO A78',6.43,90,'Android'],['OPPO Reno 10',6.7,120,'Android'],['OPPO Reno 11',6.7,120,'Android'],
['OnePlus 8',6.55,90,'Android'],['OnePlus 8 Pro',6.78,120,'Android'],['OnePlus 9',6.55,120,'Android'],['OnePlus 9R',6.55,120,'Android'],['OnePlus Nord CE 2',6.43,90,'Android'],['OnePlus 11',6.7,120,'Android'],['OnePlus 12',6.82,120,'Android'],['Google Pixel 6a',6.1,60,'Android'],['Google Pixel 7',6.3,90,'Android'],['Google Pixel 8',6.2,120,'Android'],
['iPhone 11',6.1,60,'iOS'],['iPhone 12',6.1,60,'iOS'],['iPhone 13',6.1,60,'iOS'],['iPhone 14',6.1,60,'iOS'],['iPhone 15',6.1,60,'iOS'],['iPhone 16',6.1,60,'iOS'],
['iQOO Z7',6.38,90,'Android'],['iQOO Z9',6.67,120,'Android'],['iQOO Neo 7',6.78,120,'Android'],['iQOO Neo 9 Pro',6.78,144,'Android'],['iQOO 12',6.78,144,'Android'],
['Moto G34',6.5,120,'Android'],['Moto G54',6.5,120,'Android'],['Moto G84',6.55,120,'Android'],['Motorola Edge 40 Neo',6.55,144,'Android'],['Motorola Edge 50 Fusion',6.7,144,'Android'],
['Nothing Phone (1)',6.55,120,'Android'],['Nothing Phone (2)',6.7,120,'Android'],['Nothing Phone (2a)',6.7,120,'Android'],['Nothing Phone (2a) Plus',6.7,120,'Android'],['CMF Phone 1',6.67,120,'Android'],
['Lava Blaze 5G',6.5,90,'Android'],['Lava Blaze Curve 5G',6.67,120,'Android'],['Lava Agni 2 5G',6.78,120,'Android'],['Lava Yuva 3 Pro',6.5,90,'Android'],['Lava Storm 5G',6.78,120,'Android'],
['itel A60s',6.6,90,'Android'],['itel P40',6.6,90,'Android'],['itel P55 5G',6.6,90,'Android'],['itel S23',6.6,90,'Android'],['itel Vision 3',6.6,60,'Android'],
['Honor X7b',6.8,90,'Android'],['Honor X8b',6.7,90,'Android'],['Honor X9b',6.78,120,'Android'],['Honor 90',6.7,120,'Android'],['Honor Magic6 Lite',6.78,120,'Android'],
['ASUS ROG Phone 5',6.78,144,'Android'],['ASUS ROG Phone 6',6.78,165,'Android'],['ASUS ROG Phone 7',6.78,165,'Android'],['ASUS ROG Phone 8',6.78,165,'Android'],['ASUS Zenfone 10',5.9,144,'Android'],
['Google Pixel 6',6.4,90,'Android'],['Google Pixel 7a',6.1,90,'Android'],['Google Pixel 8a',6.1,120,'Android'],['Samsung Galaxy S25',6.2,120,'Android'],
['Redmi Note 14 Pro+',6.67,120,'Android'],['Redmi Note 14 Pro',6.67,120,'Android'],['Redmi Note 14',6.67,120,'Android'],
['iPhone 13 Pro',6.1,120,'iOS'],['iPhone 14 Pro',6.1,120,'iOS'],['iPhone 15 Pro',6.1,120,'iOS'],['iPhone 16 Pro',6.3,120,'iOS'],
['Other Android',6.5,60,'Android'],['Other iPhone',6.1,60,'iOS']
].map(x=>({name:x[0],size:x[1],hz:x[2],os:x[3]}));
const BASE=[184,176,166,155,92,145],NAMES=['General','Red Dot','2x Scope','4x Scope','Sniper Scope','Free Look'];
const GROUPS={
 goals:[['Headshot focus','Faster short drag'],['Recoil control','Steadier tracking'],['Balanced','All-round starting point']],
 modes:[['Battle Royale','BR profile'],['Clash Squad','CS profile'],['Both modes','Balanced profile']],
 weapons:[['All-round','Mixed weapons'],['Desert Eagle','Pistol focus'],['Woodpecker','Marksman focus'],['Shotgun','Close-range focus']],
 controls:[['Low','More controlled'],['Medium','Balanced drag'],['High','Faster drag']]
};
const state={phone:DB.find(x=>x.name==='Realme 13 Plus'),custom:false,ram:'4 GB',fps:'60 FPS',dpi:'',goal:0,mode:2,weapon:0,control:1,boost:5,values:[],suggested:[],made:false,page:0};
const mods={goals:[[5,8,4,0,-5,0],[-5,-6,-4,-5,-8,0],[0,0,0,0,0,0]],modes:[[0,1,1,1,0,0],[3,4,2,1,0,0],[0,0,0,0,0,0]],weapons:[[0,0,0,0,0,0],[0,4,0,0,0,0],[0,-3,-2,-2,3,0],[3,5,0,0,0,0]],controls:[[-6,-7,-4,-3,-2,0],[0,0,0,0,0,0],[5,6,4,3,2,0]]};
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2100)}
function showPage(n){n=Math.max(0,Math.min(4,n));state.page=n;document.querySelectorAll('.page').forEach((p,i)=>p.classList.toggle('active',i===n));document.querySelectorAll('#bottomNav button').forEach(b=>b.classList.toggle('active',Number(b.dataset.page)===n));window.scrollTo({top:0,behavior:'smooth'});if(n===2)renderResult()}window.alooShowPage=showPage;
function renderChips(id,key){const host=$(id);host.innerHTML=GROUPS[key].map((x,i)=>`<button type="button" class="chip${state[key]===i?' selected':''}" data-choice="${key}" data-index="${i}"><b>${x[0]}</b><small>${x[1]}</small></button>`).join('')}
function renderAllChips(){renderChips('goals','goals');renderChips('modes','modes');renderChips('weapons','weapons');renderChips('controls','controls')}
function setPhone(phone){state.phone=phone;state.custom=false;$('phoneSearch').value=phone.name;$('phoneSpecs').innerHTML=`<span class="pill">${phone.size} inch</span><span class="pill">${phone.hz} Hz</span><span class="pill">${phone.os}</span><span class="pill">Reference spec</span>`}
function calc(){const p=state.phone||{size:6.5,hz:60};const fps=parseInt(state.fps,10)||60;const ram=parseInt(state.ram,10)||4;let factor=1+(6.5-p.size)*.018+(p.hz>=120?-.008:p.hz<=60?.008:0)+(fps>=90?-.008:fps<=30?.01:0)+(ram<=3?.008:ram>=8?-.004:0);return BASE.map((v,i)=>{const extra=mods.goals[state.goal][i]+mods.modes[state.mode][i]+mods.weapons[state.weapon][i]+mods.controls[state.control][i]+(i===0?state.boost*1.05:i===1?state.boost:i===2?state.boost*.35:0);return Math.max(0,Math.min(200,Math.round(v*factor+extra)))})}
function drawValues(){const host=$('sensiValues');host.innerHTML=NAMES.map((n,i)=>`<div class="resultline"><span>${n}</span><input aria-label="${n} sensitivity" type="number" min="0" max="200" step="1" data-value="${i}" value="${state.values[i]}"></div>`).join('')}
function renderResult(){if(!state.made){$('emptyResult').hidden=false;$('resultArea').hidden=true;return}$('emptyResult').hidden=true;$('resultArea').hidden=false;$('resultPhone').textContent=state.phone.name;$('resultMeta').textContent=`${GROUPS.goals[state.goal][0][0]} · ${GROUPS.modes[state.mode][0][0]} · ${GROUPS.weapons[state.weapon][0][0]}`;$('statScreen').textContent=state.phone.size+'"';$('statHz').textContent=state.phone.hz+' Hz';$('statDpi').textContent=state.dpi?state.dpi+' (entered)':'Not provided';drawValues()}
function generate(){state.suggested=calc();state.values=[...state.suggested];state.made=true;renderResult();save();toast('Starting profile generated');showPage(2)}
function save(){try{localStorage.setItem('aloo_sensi_pro_v3',JSON.stringify({phone:state.phone.name,ram:state.ram,fps:state.fps,dpi:state.dpi,goal:state.goal,mode:state.mode,weapon:state.weapon,control:state.control,boost:state.boost,values:state.values,made:state.made}))}catch(e){toast('Browser storage unavailable')}}
function load(){try{const x=JSON.parse(localStorage.getItem('aloo_sensi_pro_v3')||'null');if(!x)return;const p=DB.find(v=>v.name===x.phone);if(p)state.phone=p;state.ram=x.ram||state.ram;state.fps=x.fps||state.fps;state.dpi=x.dpi||'';['goal','mode','weapon','control'].forEach(k=>{if(Number.isInteger(x[k]))state[k]=Math.max(0,Math.min(GROUPS[k+'s']?GROUPS[k+'s'].length-1:GROUPS[k].length-1,x[k]))});state.boost=Number.isFinite(x.boost)?Math.max(0,Math.min(15,x.boost)):5;if(Array.isArray(x.values)&&x.values.length===6)state.values=x.values.map(v=>Math.max(0,Math.min(200,Number(v)||0)));state.made=!!x.made;state.suggested=calc();}catch(e){localStorage.removeItem('aloo_sensi_pro_v3')}}
function copy(){const text=`ALOO SENSI PRO — STARTING PROFILE\n${state.phone.name}\n${NAMES.map((n,i)=>n+': '+state.values[i]).join('\n')}\nDPI: ${state.dpi||'Not provided'}\nNote: starting values only; test and adjust in Training Ground.`;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(()=>toast('Sensitivity copied'),()=>fallbackCopy(text))}else fallbackCopy(text)}
function fallbackCopy(text){const el=document.createElement('textarea');el.value=text;el.style.position='fixed';el.style.opacity='0';document.body.append(el);el.select();try{document.execCommand('copy');toast('Sensitivity copied')}catch(e){toast('Copy unavailable — select values manually')}el.remove()}
function openExternal(url,appUrl){const ua=navigator.userAgent;if(/android/i.test(ua)){window.location.href=appUrl;return}if(/iphone|ipad|ipod/i.test(ua)){if(appUrl.indexOf('://')>0&&appUrl.indexOf('intent')!==0&&appUrl!==url){window.location.href=appUrl;setTimeout(()=>{if(!document.hidden)window.location.href=url},900)}else window.location.href=url;return}window.open(url,'_blank','noopener');return;try{if(appUrl){window.location.href=appUrl;setTimeout(()=>{if(!document.hidden)window.location.href=url},700)}else window.location.href=url}catch(e){window.location.href=url}}
let accountMode='login';
function setAccountMode(mode){accountMode=mode;$('accountLoginTab').classList.toggle('selected',mode==='login');$('accountCreateTab').classList.toggle('selected',mode==='create');$('accountSubmit').textContent=mode==='login'?'LOGIN →':'CREATE ACCOUNT →';$('accountPassword').autocomplete=mode==='login'?'current-password':'new-password';$('accountHint').textContent=mode==='login'?'Enter your existing username and password.':'Choose a username and a password with at least 6 characters.';$('accountError').textContent='';$('accountError').classList.remove('ok')}
function enterAccount(username){$('gate').hidden=true;$('app').classList.add('visible');$('bottomNav').hidden=false;const chip=$('netChip');if(chip)chip.textContent='● '+username.toUpperCase();showPage(window.alooRequestedPage===3?3:0);window.alooRequestedPage=null}
$('accountLoginTab').addEventListener('click',()=>setAccountMode('login'));
$('accountCreateTab').addEventListener('click',()=>setAccountMode('create'));
$('accountSubmit').addEventListener('click',()=>{const username=$('accountUsername').value.trim(),password=$('accountPassword').value;const err=$('accountError');err.classList.remove('ok');if(!/^[a-zA-Z0-9_.-]{3,24}$/.test(username)){err.textContent='Username must be 3–24 characters (letters, numbers, . _ -).';return}if(password.length<6){err.textContent='Password must contain at least 6 characters.';return}if(!window.AlooNative){err.textContent='Account service is unavailable in this app build.';return}try{const result=accountMode==='create'?AlooNative.createAccount(username,password):AlooNative.loginAccount(username,password);if(result==='ok'){err.textContent=accountMode==='create'?'Account created. Welcome!':'Login successful.';err.classList.add('ok');setTimeout(()=>enterAccount(username),180)}else if(result==='exists')err.textContent='This username already exists. Please log in.';else if(result==='no_account')err.textContent='Account not found. Create an account first.';else if(result==='wrong_password')err.textContent='Incorrect username or password.';else err.textContent='Could not complete this request. Try again.'}catch(e){err.textContent='Something went wrong. Please try again.'}});
$('accountPassword').addEventListener('keydown',e=>{if(e.key==='Enter')$('accountSubmit').click()});
$('accountUsername').addEventListener('keydown',e=>{if(e.key==='Enter')$('accountPassword').focus()});
$('phoneSearch').addEventListener('input',()=>{const q=$('phoneSearch').value.trim().toLowerCase();const hits=DB.filter(p=>p.name.toLowerCase().includes(q)).slice(0,12);$('phoneResults').innerHTML=hits.map(p=>`<button type="button" data-phone="${p.name.replaceAll('"','&quot;')}">${p.name} · ${p.hz} Hz</button>`).join('')+`<button type="button" data-custom="1">My phone is not listed — enter custom specs</button>`;$('phoneResults').classList.add('show')});
$('phoneSearch').addEventListener('focus',()=>{if(!$('phoneSearch').value)$('phoneSearch').dispatchEvent(new Event('input'))});
$('phoneResults').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.custom){$('phoneResults').classList.remove('show');const name=prompt('Enter your phone model name:');if(!name)return;const size=Number(prompt('Screen size in inches (example 6.5):','6.5'));const hz=Number(prompt('Screen refresh rate (60, 90, 120, etc.):','60'));if(!Number.isFinite(size)||size<4||size>10||!Number.isFinite(hz)||hz<30||hz>240){toast('Please enter valid phone specs');return}state.phone={name:name.slice(0,50),size,hz,os:'Custom'};state.custom=true;$('phoneSearch').value=state.phone.name;$('phoneSpecs').innerHTML=`<span class="pill">${size} inch</span><span class="pill">${hz} Hz</span><span class="pill">Custom entered specs</span>`;return}const p=DB.find(x=>x.name===b.dataset.phone);if(p)setPhone(p);$('phoneResults').classList.remove('show')});
document.addEventListener('click',e=>{if(!e.target.closest('.searchwrap'))$('phoneResults').classList.remove('show')});
document.addEventListener('click',e=>{const b=e.target.closest('[data-choice]');if(!b)return;const key=b.dataset.choice;state[key]=Number(b.dataset.index);renderAllChips()});
$('ram').addEventListener('change',e=>state.ram=e.target.value);$('fps').addEventListener('change',e=>state.fps=e.target.value);$('dpi').addEventListener('input',e=>state.dpi=e.target.value);$('boost').addEventListener('input',e=>{state.boost=Number(e.target.value);$('boostValue').textContent='+'+state.boost});
$('next0').addEventListener('click',()=>{state.ram=$('ram').value;state.fps=$('fps').value;state.dpi=$('dpi').value;if(state.dpi&&(Number(state.dpi)<100||Number(state.dpi)>1000)){toast('Check DPI value or leave it blank');return}showPage(1)});
$('back1').addEventListener('click',()=>showPage(0));$('next1').addEventListener('click',()=>{state.ram=$('ram').value;state.fps=$('fps').value;state.dpi=$('dpi').value;generate()});
$('back2').addEventListener('click',()=>showPage(1));$('next2').addEventListener('click',()=>showPage(3));$('back3').addEventListener('click',()=>showPage(2));$('home0').addEventListener('click',()=>showPage(0));$('toSetup').addEventListener('click',()=>showPage(0));
$('bottomNav').addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(b)showPage(Number(b.dataset.page))});
$('sensiValues').addEventListener('change',e=>{const i=Number(e.target.dataset.value);if(!Number.isInteger(i))return;const v=Number(e.target.value);if(!Number.isFinite(v)){e.target.value=state.values[i];return}state.values[i]=Math.max(0,Math.min(200,Math.round(v)));e.target.value=state.values[i];save()});
$('copyValues').addEventListener('click',copy);$('saveProfile').addEventListener('click',()=>{save();toast('Profile saved on this device')});
$('recalculate').addEventListener('click',()=>{state.suggested=calc();state.values=[...state.suggested];drawValues();save();toast('Suggested values restored')});
$('clearData').addEventListener('click',()=>{if(confirm('Clear the saved sensitivity profile from this browser?')){localStorage.removeItem('aloo_sensi_pro_v3');state.made=false;state.values=[];toast('Saved profile cleared');showPage(0)}});

$('ram').value=state.ram;$('fps').value=state.fps;$('dpi').value=state.dpi;$('boost').value=state.boost;$('boostValue').textContent='+'+state.boost;setPhone(state.phone);renderAllChips();
load();$('ram').value=state.ram;$('fps').value=state.fps;$('dpi').value=state.dpi;$('boost').value=state.boost;$('boostValue').textContent='+'+state.boost;setPhone(state.phone);renderAllChips();if(state.made)renderResult();
function net(){const c=$('netChip'),on=navigator.onLine!==false;c.textContent=on?'● LOCAL MODE':'● OFFLINE';c.classList.toggle('off',!on)}addEventListener('online',net);addEventListener('offline',net);net();
$('loadProgress').style.width='100%';setTimeout(()=>$('loading').classList.add('hidden'),450);setTimeout(()=>{if(window.AlooNative&&AlooNative.isAccountLoggedIn&&AlooNative.isAccountLoggedIn()){const n=AlooNative.getAccountUsername()||'PLAYER';enterAccount(n)}else $('gate').hidden=false},550);
})();


(()=>{
const $=id=>document.getElementById(id);
const SH=[['Dot','<circle cx="50" cy="50" r="5" fill="currentColor"/>'],
['Cross','<g stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M50 14v26M50 60v26M14 50h26M60 50h26"/></g>'],
['Ring Dot','<circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" stroke-width="3.500"/><circle cx="50" cy="50" r="4" fill="currentColor"/>'],
['T-Shape','<g stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M14 50h26M60 50h26M50 60v26"/></g><circle cx="50" cy="50" r="3" fill="currentColor"/>'],
['Hybrid','<circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="3"/><g stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M50 8v18M50 74v18M8 50h18M74 50h18"/></g><circle cx="50" cy="50" r="3" fill="currentColor"/>'],
['Spin Ring','<g><circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-width="3.5" stroke-dasharray="14 10"/><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite"/></g><circle cx="50" cy="50" r="3" fill="currentColor"/>'],
['Radar','<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M50 18A32 32 0 0 1 82 50"/><path d="M50 82A32 32 0 0 1 18 50"/><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"/></g><circle cx="50" cy="50" r="3" fill="currentColor"/>'],
['Pulse','<circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" stroke-width="3"><animate attributeName="r" values="10;36" dur="1.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.4s" repeatCount="indefinite"/></circle><circle cx="50" cy="50" r="4" fill="currentColor"/>'],
['Shuriken','<g><path d="M50 8L58 42L92 50L58 58L50 92L42 58L8 50L42 42Z" fill="currentColor"/><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="5s" repeatCount="indefinite"/></g><circle cx="50" cy="50" r="5" fill="#000"/>'],
['Orbit','<circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".5"/><g><circle cx="50" cy="24" r="5" fill="currentColor"/><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1.8s" repeatCount="indefinite"/></g><circle cx="50" cy="50" r="3" fill="currentColor"/>']];
const COL=['#35f2a0','#ff3d7f','#27e6ff','#ffe14d','#ffffff','#b28bff'];
const D={on:false,k:0,size:60,x:0,y:0,o:100,c:COL[0]};
try{Object.assign(D,JSON.parse(localStorage.getItem('aloo_xh_v1')||'{}'))}catch(e){}
const SL=[['size','SIZE',20,200],['x','LEFT / RIGHT',-160,160],['y','UP / DOWN',-160,160],['o','OPACITY',20,100]];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function save(){try{localStorage.setItem('aloo_xh_v1',JSON.stringify(D))}catch(e){}}
function applyXh(){const L=$('xhLayer'),P=$('xhPanel');L.hidden=!D.on||!!window.AlooNative;P.hidden=!(D.on||MC.on)||!!window.AlooNative;$('xhOn').checked=D.on;$('xhState').textContent=D.on?'On — floating window is active':'Off';
 L.style.setProperty('--s',D.size+'px');L.style.setProperty('--x',D.x+'px');L.style.setProperty('--y',D.y+'px');L.style.setProperty('--o',D.o/100);L.style.setProperty('--c',D.c);
 $('xhShape').innerHTML=SH[D.k][1];$('xhSize').textContent=D.size;
 document.querySelectorAll('.xhitem').forEach((e,i)=>e.classList.toggle('selected',i===D.k));
 document.querySelectorAll('.sw').forEach(e=>e.classList.toggle('on',e.dataset.c===D.c));
 SL.forEach(s=>{const i=$('xs_'+s[0]);if(i){i.value=D[s[0]];$('xv_'+s[0]).textContent=D[s[0]]}});save()}
$('xhGrid').innerHTML=SH.map((s,i)=>`<button class="xhitem" data-k="${i}"><svg viewBox="0 0 100 100">${s[1]}</svg><small>${s[0]}</small></button>`).join('');
$('xhSliders').innerHTML=SL.map(s=>`<div class="rangebox"><div class="rangehead"><b>${s[1]}</b><output id="xv_${s[0]}"></output></div><input type="range" id="xs_${s[0]}" min="${s[2]}" max="${s[3]}" data-s="${s[0]}"></div>`).join('');
$('xhColors').innerHTML=COL.map(c=>`<button class="sw" data-c="${c}" style="background:${c};color:${c}" aria-label="Colour ${c}"></button>`).join('');
document.addEventListener('click',e=>{const k=e.target.closest('.xhitem');if(k){D.k=+k.dataset.k;apply()}const c=e.target.closest('.sw');if(c){D.c=c.dataset.c;apply()}
 const a=e.target.closest('[data-a]');if(a){const f=a.dataset.a,r=f==='size'?[20,200]:[-160,160];D[f]=clamp(D[f]+ +a.dataset.d,r[0],r[1]);apply()}});
$('xhSliders').addEventListener('input',e=>{const s=e.target.dataset.s;if(s){D[s]=+e.target.value;apply()}});
$('xhOn').addEventListener('change',e=>{D.on=e.target.checked;apply()});$('xhOff').onclick=()=>{D.on=false;apply()};
$('xhNext').onclick=()=>{D.k=(D.k+1)%SH.length;apply()};$('xhMin').onclick=()=>$('xhBody').classList.toggle('min');
$('xhReset').onclick=()=>{Object.assign(D,{k:0,size:60,x:0,y:0,o:100,c:COL[0]});apply()};
$('xhFull').onclick=()=>{D.on=true;apply();const r=document.documentElement.requestFullscreen;if(r)r.call(document.documentElement).catch(()=>{})};
// draggable floating window
(()=>{const P=$('xhPanel'),H=$('xhDrag');let sx,sy,ox,oy,on=false;H.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;on=true;const b=P.getBoundingClientRect();sx=e.clientX;sy=e.clientY;ox=b.left;oy=b.top;H.setPointerCapture(e.pointerId)});
H.addEventListener('pointermove',e=>{if(!on)return;P.style.left=clamp(ox+e.clientX-sx,0,innerWidth-P.offsetWidth)+'px';P.style.top=clamp(oy+e.clientY-sy,0,innerHeight-40)+'px';P.style.right='auto'});H.addEventListener('pointerup',()=>on=false)})();
// celebrate pending step after returning from YouTube / TikTok
document.addEventListener('visibilitychange',()=>{if(!document.hidden)document.querySelectorAll('.gate-card:not(.done) .gate-actions button:last-child').forEach(b=>{b.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:600,iterations:2})})});
// ===== MACRO =====
const ICONS={"fire_ring": "<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 24a15 15 0 1 0 30 0a15 15 0 1 0 -30 0Z\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M17 24a7 7 0 1 0 14 0a7 7 0 1 0 -14 0Z\"/><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M24 4v5M24 39v5M4 24h5M39 24h5\"/>", "fire_target": "<path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M11 24a13 13 0 1 0 26 0a13 13 0 1 0 -26 0Z\"/><path fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M24 4v12M24 32v12M4 24h12M32 24h12\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M21.2 24a2.8 2.8 0 1 0 5.6 0a2.8 2.8 0 1 0 -5.6 0Z\"/>", "fire_flame": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M24 3C26 11 37 15 37 28C37 37 31 44 24 44C17 44 11 37 11 29C11 23 14 19 18 16C18 21 20 24 22.5 24C21 16 22 9 24 3Z\"/><path fill=\"rgba(0,0,0,.4)\" fill-rule=\"evenodd\" d=\"M24 44C20 44 17 41 17 37C17 33 20 31 22 28C23 31 26 32 28 33C30 36 29 40 27 42C26 43 25 44 24 44Z\"/>", "fire_bullet": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M24 4C29 9 31 15 31 21V36H17V21C17 15 19 9 24 4Z\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M18.5 38h11a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1 -1.5 1.5h-11a1.5 1.5 0 0 1 -1.5 -1.5v-3a1.5 1.5 0 0 1 1.5 -1.5Z\"/><path fill=\"rgba(0,0,0,.4)\" fill-rule=\"evenodd\" d=\"M22 14h4a1 1 0 0 1 1 1v0.4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-0.4a1 1 0 0 1 1 -1Z\"/><path fill=\"rgba(0,0,0,.4)\" fill-rule=\"evenodd\" d=\"M22 19h4a1 1 0 0 1 1 1v0.4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-0.4a1 1 0 0 1 1 -1Z\"/>", "fire_burst": "<path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M24 3L27.44 15.69L38.85 9.15L32.31 20.56L45 24L32.31 27.44L38.85 38.85L27.44 32.31L24 45L20.56 32.31L9.15 38.85L15.69 27.44L3 24L15.69 20.56L9.15 9.15L20.56 15.69Z\"/><path fill=\"rgba(0,0,0,.4)\" fill-rule=\"evenodd\" d=\"M19.5 24a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0Z\"/>", "glowall": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.8\" stroke-linejoin=\"round\"><path d=\"M6 17h36v8H6zM6 27h17v8H6zM26 27h16v8H26zM6 37h36v6H6z\"/><path d=\"M24 3v9M19.5 7.5h9M37 5l-2 4M11 7l2 3\" stroke-linecap=\"round\"/></g>", "jscope": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 11L24 4L33 11\"/><circle cx=\"24\" cy=\"30\" r=\"10\"/><path d=\"M7 30h7M34 30h7M24 14v6M24 40v5\"/><circle cx=\"24\" cy=\"30\" r=\"2.5\" fill=\"currentColor\"/></g>", "scope": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.8\" stroke-linecap=\"round\"><circle cx=\"24\" cy=\"24\" r=\"16\"/><path d=\"M24 3v12M24 33v12M3 24h12M33 24h12\"/><circle cx=\"24\" cy=\"24\" r=\"5\" fill=\"currentColor\" stroke=\"none\"/></g>", "jump": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M24 42V9M13 20L24 9l11 11\"/><path d=\"M9 39h30\" opacity=\".65\"/><path d=\"M18 31l6-6 6 6\" opacity=\".8\"/></g>", "crouch": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 15l14 14 14-14M10 28l14 14 14-14M24 5v8\"/></g>", "reload": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M38 18a15 15 0 1 0 2 9\"/><path d=\"M29 6h10v10\"/><path d=\"M24 15v18M17 24h14\" opacity=\".7\"/></g>", "nade": "<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 14h12l3 5v15a9 9 0 0 1-18 0V19z\"/><path d=\"M21 14V8h6v6M30 11l8-4M20 26h8M24 22v8\"/></g>"};
const SK=[['ring','Bullseye'],['target','Target'],['flame','Flame'],['bullet','Bullet'],['burst','Burst']];
const RL=[
 {id:'fire',n:'Fire',col:'#ff2e4d',x:.86,y:.62,z:[[0,1],[1,1]],fire:1},
 {id:'fire2',n:'Fire (2nd)',col:'#ff5a36',x:.13,y:.60,z:[[0,.6],[1,.6]],fire:1},
 {id:'glowall',n:'Glow Wall',col:'#14b8d4',x:.68,y:.74,z:[]},
 {id:'jscope',n:'Jump Scope',col:'#8a63ff',x:.93,y:.50,z:[[0,.5],[2,.9],[3,.8],[4,.5]]},
 {id:'scope',n:'Scope',col:'#7b5cff',x:.74,y:.40,z:[[2,.8],[3,.7],[4,.4]]},
 {id:'jump',n:'Jump',col:'#2aa8ff',x:.93,y:.80,z:[]},
 {id:'crouch',n:'Crouch',col:'#2fc98a',x:.80,y:.88,z:[]},
 {id:'reload',n:'Reload',col:'#ffb454',x:.60,y:.84,z:[]},
 {id:'nade',n:'Grenade',col:'#ff7a2e',x:.93,y:.30,z:[]}];
const NM=['General','Red Dot','2x Scope','4x Scope','Sniper Scope','Free Look'];
const MC={on:false,lock:false,size:64,o:85,boost:4,skin:'ring',e:{fire:1,glowall:1,jscope:1,scope:1},sz:{},p:{}};
try{Object.assign(MC,JSON.parse(localStorage.getItem('aloo_mc_v1')||'{}'))}catch(e){}
if(window.AlooNative&&AlooNative.getState){try{const st=JSON.parse(AlooNative.getState()||'null');if(st){if(st.xh)Object.assign(D,st.xh);if(st.mc)Object.assign(MC,st.mc)}}catch(e){}}
if(!MC.e)MC.e={};if(!MC.sz)MC.sz={};if(!MC.p)MC.p={};
function T(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(T.t);T.t=setTimeout(()=>t.classList.remove('show'),2600)}
const ico=r=>ICONS[r.fire?'fire_'+MC.skin:r.id]||'';
const bsz=r=>MC.sz[r.id]||MC.size;
function syncNative(){const n=window.AlooNative;if(!n)return;try{n.sync(JSON.stringify({xh:{on:D.on,k:D.k,size:D.size,x:D.x,y:D.y,o:D.o,c:D.c,shapes:SH.map(s=>({n:s[0],svg:s[1]})),cols:COL},mc:{on:MC.on,lock:MC.lock,size:MC.size,o:MC.o,skin:MC.skin,e:MC.e,sz:MC.sz,p:MC.p,skins:SK.map(s=>({k:s[0],n:s[1]})),defs:RL.map(r=>({id:r.id,n:r.n,col:r.col,x:r.x,y:r.y,fire:!!r.fire}))}}))}catch(e){}}
function boosted(){let v;try{v=JSON.parse(localStorage.getItem('aloo_sensi_pro_v3')||'null').values}catch(e){}if(!Array.isArray(v)||v.length!==6)return null;const add=[0,0,0,0,0,0];RL.forEach(r=>{if(MC.e[r.id])r.z.forEach(z=>add[z[0]]+=MC.boost*z[1])});return v.map((x,i)=>[x,clamp(Math.round(x+add[i]),0,200)])}
function renderList(){
 $('mcList').innerHTML=RL.map(r=>{const s=bsz(r);return `<div class="mcitem"><div class="mci" style="background:${r.col}"><svg viewBox="0 0 48 48">${ico(r)}</svg></div><div class="mct"><b>${r.n}</b><small>${r.z.length?'Boosts '+r.z.map(z=>NM[z[0]]).join(' · '):'Position only'}</small></div><label class="switch sm"><input type="checkbox" data-en="${r.id}" ${MC.e[r.id]?'checked':''}><span></span></label><div class="mcsl"><input type="range" data-sz="${r.id}" min="30" max="130" value="${s}" aria-label="${r.n} size"><output>${s}</output></div></div>`}).join('');
 $('mcSkins').innerHTML=SK.map(k=>`<button type="button" class="skinbtn${MC.skin===k[0]?' on':''}" data-skin="${k[0]}"><svg viewBox="0 0 48 48">${ICONS['fire_'+k[0]]}</svg><small>${k[1]}</small></button>`).join('')}
function renderMc(full=true){const N=!!window.AlooNative,L=$('mcLayer');L.hidden=!MC.on||N;
 L.innerHTML=RL.filter(r=>MC.e[r.id]).map(r=>{const q=MC.p[r.id]||[r.x,r.y],s=bsz(r);return `<div class="mcb${r.fire?' fire':''}${MC.lock?' lk':''}" data-id="${r.id}" style="--b:${r.col};--sz:${s}px;width:${s}px;height:${s}px;left:${q[0]*100}%;top:${q[1]*100}%;opacity:${MC.o/100}"><svg viewBox="0 0 48 48" style="width:62%;height:62%;color:#fff">${ico(r)}</svg></div>`}).join('');
 $('mcOn').checked=MC.on;$('mcOpv').textContent=MC.o;$('mcLock').checked=MC.lock;$('mcLockBtn').textContent=MC.lock?'🔒':'🔓';$('mcLockNote').textContent=MC.lock?'Locked: buttons are fixed in place':'Unlocked: drag buttons to position them';
 if(full)renderList();
 $('mcSize').value=MC.size;$('mv_size').textContent=MC.size;$('mcO').value=MC.o;$('mv_o').textContent=MC.o+'%';$('mcBoost').value=MC.boost;$('mv_boost').textContent='+'+MC.boost;
 const b=boosted();$('mcTable').innerHTML=b?b.map((x,i)=>`<div class="mcrow"><span>${NM[i]}</span><span>${x[0]} → <b>${x[1]}</b></span></div>`).join(''):'<p class="note">Generate your profile on the Sensi tab first, then the boosted values show here.</p>';
 try{localStorage.setItem('aloo_mc_v1',JSON.stringify(MC))}catch(e){}}
function apply(noSync,noList){applyXh();renderMc(!noList);if(!noSync)syncNative()}
function needPerm(e){const n=window.AlooNative;if(!n||!e.target.checked&&e.target.id!=='xhFull')return;try{if(!n.hasPermission()){n.requestPermission();T('Allow "Display over other apps", then return here')}}catch(x){}}
['xhOn','mcOn','xhFull'].forEach(i=>$(i).addEventListener(i==='xhFull'?'click':'change',needPerm));
$('mcOn').addEventListener('change',e=>{MC.on=e.target.checked;apply()});$('mcLock').addEventListener('change',e=>{MC.lock=e.target.checked;apply()});
$('mcLockBtn').onclick=()=>{MC.lock=!MC.lock;apply()};
$('mcList').addEventListener('change',e=>{const id=e.target.dataset.en;if(id){MC.e[id]=e.target.checked?1:0;apply()}});
$('mcList').addEventListener('input',e=>{const id=e.target.dataset.sz;if(id){MC.sz[id]=+e.target.value;e.target.nextElementSibling.textContent=e.target.value;apply(false,true)}});
$('mcSkins').addEventListener('click',e=>{const b=e.target.closest('[data-skin]');if(b){MC.skin=b.dataset.skin;apply()}});
$('mcSize').addEventListener('input',e=>{MC.size=+e.target.value;MC.sz={};apply()});
$('mcO').addEventListener('input',e=>{MC.o=+e.target.value;apply()});
$('mcBoost').addEventListener('input',e=>{MC.boost=+e.target.value;apply(false,true)});
$('mcCopy').onclick=()=>{const b=boosted();if(!b){T('Generate your profile first');return}const t='ALOO SENSI PRO - MACRO BOOSTED\n'+b.map((x,i)=>NM[i]+': '+x[1]).join('\n');(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>T('Boosted values copied'),()=>T('Copy unavailable'))};
document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.seg button').forEach(x=>x.classList.toggle('on',x===b));$('page4').classList.toggle('mc',b.dataset.t==='1');renderMc()});
$('bottomNav').addEventListener('click',()=>setTimeout(renderMc,60));
// native floating menu controls (Android app only)
if(window.AlooNative){$('nativeMenu').hidden=false;$('nativeMenu').addEventListener('click',e=>{const b=e.target.closest('[data-menu]');if(!b)return;if(!AlooNative.hasPermission()){AlooNative.requestPermission();T('Allow "Display over other apps" first');return}try{AlooNative.menu(b.dataset.menu)}catch(x){}})}
// drag macro buttons in the browser preview (unlocked only)
(()=>{const L=$('mcLayer');let el=null;L.addEventListener('pointerdown',e=>{const b=e.target.closest('.mcb');if(!b||MC.lock)return;el=b;b.setPointerCapture(e.pointerId)});
L.addEventListener('pointermove',e=>{if(!el)return;el.style.left=clamp(e.clientX/innerWidth,.03,.97)*100+'%';el.style.top=clamp(e.clientY/innerHeight,.03,.97)*100+'%'});
L.addEventListener('pointerup',e=>{if(!el)return;MC.p[el.dataset.id]=[clamp(e.clientX/innerWidth,.03,.97),clamp(e.clientY/innerHeight,.03,.97)];el=null;try{localStorage.setItem('aloo_mc_v1',JSON.stringify(MC))}catch(x){}syncNative()})})();
// native overlay callbacks (floating menu changes come back here; no echo to native)
window.alooUpdate=o=>{if(o.xh)Object.assign(D,o.xh);if(o.mc)Object.assign(MC,o.mc);apply(true)};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncNative()});
$('mcPanelOn').onclick=()=>{MC.on=!MC.on;apply()};
document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{MC.o=clamp(MC.o+ +b.dataset.m,25,100);apply()});
// Fastest Emote: saved visual positioning only; no automated game input.
const emoteDefaults={x:78,y:72,size:64,spacing:50};
function readEmote(){try{return {...emoteDefaults,...JSON.parse(localStorage.getItem('aloo_emote_position')||'{}')}}catch(e){return {...emoteDefaults}}}
let emoteCfg=readEmote();
function paintEmote(){
 const x=$('emoteX'),y=$('emoteY'),sz=$('emoteSize'),sp=$('emoteSpacing');
 if(!x||!y||!sz||!sp)return;
 x.value=emoteCfg.x;y.value=emoteCfg.y;sz.value=emoteCfg.size;sp.value=emoteCfg.spacing;
 $('emoteXValue').textContent=emoteCfg.x+'%';$('emoteYValue').textContent=emoteCfg.y+'%';
 $('emoteSizeValue').textContent=emoteCfg.size+' dp';$('emoteSpacingValue').textContent=emoteCfg.spacing+'%';
 const t=$('emoteTarget');t.style.left=emoteCfg.x+'%';t.style.top=emoteCfg.y+'%';
 const visual=Math.max(34,Math.min(86,emoteCfg.size));t.style.width=visual+'px';t.style.height=visual+'px';
 t.style.borderRadius='16px';const safe=document.querySelector('.emote-safe');if(safe)safe.style.inset=(6+emoteCfg.spacing*.06)+'% '+(5+emoteCfg.spacing*.05)+'%';
}
['emoteX','emoteY','emoteSize','emoteSpacing'].forEach(id=>$(id)?.addEventListener('input',()=>{
 emoteCfg={x:+$('emoteX').value,y:+$('emoteY').value,size:+$('emoteSize').value,spacing:+$('emoteSpacing').value};paintEmote();
}));
$('emoteReset')?.addEventListener('click',()=>{emoteCfg={...emoteDefaults};paintEmote();toast('Default position restored')});
$('emoteSave')?.addEventListener('click',()=>{localStorage.setItem('aloo_emote_position',JSON.stringify(emoteCfg));toast('Emote position saved on this device')});
paintEmote();

// Wallet and game launch bridge. Balance is stored locally for this test build; it is NOT a secure cloud wallet.
function walletBalance(){try{return window.AlooNative?AlooNative.getCredits():Number(localStorage.getItem('aloo_demo_credits')||0)}catch(e){return 0}}
function drawWallet(msg){const c=walletBalance();['creditCount','walletBalance'].forEach(id=>{const el=$(id);if(el)el.textContent=c});if(msg&&$('walletMessage'))$('walletMessage').textContent=msg}
let pendingLaunch=null;window.alooRewardResult=function(earned){if(earned){drawWallet('Reward credited: +5 credits. Device-only test wallet.');if(pendingLaunch){const k=pendingLaunch;pendingLaunch=null;launchSelected(k)}}else{pendingLaunch=null;drawWallet('Ad could not load or was not completed. No credits were added.')}};
$('watchAdBtn')?.addEventListener('click',()=>{if(window.AlooNative&&AlooNative.showRewardedAd){drawWallet('Loading Google test rewarded ad…');AlooNative.showRewardedAd()}else drawWallet('Rewarded ads are available in the Android app build.')});
function showBalanceModal(required,kind){$('modalCurrent').textContent=walletBalance();$('modalRequired').textContent=required;pendingLaunch=kind;$('balanceModal').hidden=false}
$('modalCancel')?.addEventListener('click',()=>{$('balanceModal').hidden=true;pendingLaunch=null});
$('modalWatchAd')?.addEventListener('click',()=>{$('balanceModal').hidden=true;if(window.AlooNative&&AlooNative.showRewardedAd){drawWallet('Loading rewarded ad…');AlooNative.showRewardedAd()}else drawWallet('Rewarded ads require the Android app.')});
$('historyToggle')?.addEventListener('click',()=>{const host=$('creditHistory');host.hidden=!host.hidden;if(host.hidden)return;try{const rows=JSON.parse(window.AlooNative?AlooNative.getCreditHistory():'[]');host.innerHTML=rows.length?rows.slice().reverse().map(r=>`<div class="tip">${r.delta>0?'+':''}${r.delta} credits · ${String(r.reason||'Transaction').replace(/[<>]/g,'')} · balance ${r.balance}</div>`).join(''):'No transactions recorded yet.'}catch(e){host.textContent='History is unavailable in this preview.'}});
function launchSelected(kind){if(!window.AlooNative){drawWallet('Game launch works in the installed Android app.');return}const r=AlooNative.launchGame(kind);if(r==='ok')drawWallet('Game launched. 5 credits used.');else if(r==='no_credits')showBalanceModal(5,kind);else if(r==='not_installed')drawWallet('Selected game is not installed on this phone. No credits were used.');else drawWallet('Could not launch the game. No credits were charged.')}
$('launchFF')?.addEventListener('click',()=>launchSelected('ff'));$('launchFFMax')?.addEventListener('click',()=>launchSelected('max'));$('walletTop')?.addEventListener('click',()=>$('walletCard')?.scrollIntoView({behavior:'smooth',block:'center'}));
drawWallet();
apply();
})();
