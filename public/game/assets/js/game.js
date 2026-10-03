(function(){
"use strict";

/* ================= TOOLS ================= */
const TOOLS={
  SUCT:{n:"Suction cath",s:1},   YANK:{n:"Yankauer",s:1},
  INLINE:{n:"Inline suction",s:1},ABG:{n:"ABG syringe",s:1},
  VENTK:{n:"Venturi kit",s:1},   NC:{n:"Nasal cannula",s:1},
  NRB:{n:"Non-rebreather",s:1},  FLOW:{n:"Flowmeter",s:2},
  XTREE:{n:"Christmas tree",s:1},MDI:{n:"MDI + spacer",s:1},
  NEB:{n:"Neb kit",s:1},         BVM:{n:"BVM",s:2},
  PEEP:{n:"PEEP valve",s:1},     ETCO2:{n:"ETCO2 det.",s:1},
  TLUNG:{n:"Test lung",s:1},     MANO:{n:"Cuff mano.",s:1}
};
const ABBR={SUCT:"SC",YANK:"YK",INLINE:"IS",ABG:"AB",VENTK:"VK",NC:"NC",NRB:"NR",FLOW:"FL",
  XTREE:"XT",MDI:"MD",NEB:"NB",BVM:"BV",PEEP:"PP",ETCO2:"CO",TLUNG:"TL",MANO:"MN"};
const SHORT={SUCT:"Suction",YANK:"Yankauer",INLINE:"Inline",ABG:"ABG",VENTK:"Venturi",
  NC:"Cannula",NRB:"NRB",FLOW:"Flow",XTREE:"X-Tree",MDI:"MDI",NEB:"Neb",BVM:"BVM",
  PEEP:"PEEP",ETCO2:"ETCO2",TLUNG:"Test Lung",MANO:"Cuff Mano"};
/* ---- the nurse works from a different bag entirely ---- */
const RN_TOOLS={
  IVK:{n:"IV start kit",s:1},   ABX:{n:"Antibiotic",s:1},
  FLUID:{n:"Fluid bag",s:2},    PRESS:{n:"Pressor",s:1},
  FOLEY:{n:"Foley kit",s:2},    NGT:{n:"NG tube",s:1},
  BCULT:{n:"Blood cultures",s:1},GLUC:{n:"Glucometer",s:1},
  INSUL:{n:"Insulin",s:1},      LEADS:{n:"ECG leads",s:1},
  DRESS:{n:"Dressing kit",s:1}, PAIN:{n:"Analgesia",s:1},
  TURN:{n:"Slide sheet",s:2},   CHART:{n:"Chart",s:1},
  BLOOD:{n:"Blood unit",s:1},   SUPP:{n:"Suppository",s:1}
};
const RN_ABBR={IVK:"IV",ABX:"AX",FLUID:"FL",PRESS:"PR",FOLEY:"FO",NGT:"NG",BCULT:"BC",
  GLUC:"GL",INSUL:"IN",LEADS:"LD",DRESS:"DR",PAIN:"PN",TURN:"TN",CHART:"CH",BLOOD:"BL",SUPP:"SP"};
const RN_SHORT={IVK:"IV Kit",ABX:"Abx",FLUID:"Fluids",PRESS:"Pressor",FOLEY:"Foley",
  NGT:"NG Tube",BCULT:"Cultures",GLUC:"Glucose",INSUL:"Insulin",LEADS:"ECG",
  DRESS:"Dressing",PAIN:"Pain",TURN:"Slide Sh.",CHART:"Chart",BLOOD:"Blood",SUPP:"Supp"};
Object.keys(RN_TOOLS).forEach(function(k){
  TOOLS[k]=RN_TOOLS[k]; ABBR[k]=RN_ABBR[k]; SHORT[k]=RN_SHORT[k];
});
const NAMES=["I. P. Freely","Seymour Butts","Amanda Huggenkiss","Jacques Strap",
  "Hugh Jass","Bea O\u2019Problem","Al Coholic","Oliver Klozoff","Mike Rotch",
  "Ivana Tinkle","Anita Bath","Maya Buttreeks","Eura Snotball","Ollie Tabooger",
  "Heywood U. Cuddleme","I. M. A. Wiener","Drew P. Wiener","Yuri Nator",
  "Lee Keybum","Tess T. Culls"];
let namePool=[];
function nextName(){
  if(!namePool.length) namePool=NAMES.slice().sort(function(){return Math.random()-0.5;});
  return namePool.pop();
}
let role="RT";                      // set on the start screen, or from the account's saved character
let playerGender="male";            // from the account's saved character — cosmetic only, no mechanics depend on it
const RT_KEYS=["SUCT","YANK","INLINE","ABG","VENTK","NC","NRB","FLOW",
               "XTREE","MDI","NEB","BVM","PEEP","ETCO2","TLUNG","MANO"];
const RN_KEYS=Object.keys(RN_TOOLS);

function roleKeys(){ return role==="RN"? RN_KEYS : RT_KEYS; }
const CANS=[
  {k:"CAN25", pct:25,  rush:8,  c:"#4A9CE0", n:"Blue Can"},
  {k:"CAN50", pct:50,  rush:11, c:"#8FE04A", n:"Green Can"},
  {k:"CAN75", pct:75,  rush:15, c:"#F2A03D", n:"Amber Can"},
  {k:"CAN100",pct:100, rush:20, c:"#C96BD8", n:"Violet Can"}
];
const TOOL_IMAGE_PATHS={
  SUCT:"suction-cath",YANK:"yankauer",INLINE:"inline-suction",ABG:"abg-syringe",
  VENTK:"venturi-kit",NC:"nasal-cannula",NRB:"non-rebreather",FLOW:"flowmeter",
  XTREE:"christmas-tree",MDI:"mdi-spacer",NEB:"neb-kit",BVM:"bvm",PEEP:"peep-valve",
  ETCO2:"etco2-detector",TLUNG:"test-lung",MANO:"cuff-manometer",
  IVK:"iv-start-kit",ABX:"antibiotic",FLUID:"fluid-bag",PRESS:"pressor",
  FOLEY:"foley-kit",NGT:"ng-tube",BCULT:"blood-cultures",GLUC:"glucometer",
  INSUL:"insulin",LEADS:"ecg-leads",DRESS:"dressing-kit",PAIN:"analgesia",
  TURN:"slide-sheet",CHART:"chart",BLOOD:"blood-unit",SUPP:"suppository",
  CAN25:"blue-can",CAN50:"green-can",CAN75:"amber-can",CAN100:"violet-can"
};
const TOOL_ART=Object.create(null);
function toolArt(key){
  const file=TOOL_IMAGE_PATHS[key];
  if(!file) return null;
  if(!TOOL_ART[key]){
    const image=new Image();
    image.onload=function(){if(typeof draw==="function") draw();};
    const folder=key.indexOf("CAN")===0?"Shared-Power-Ups/":RN_TOOLS[key]?"RN-Pack/":"RT-Pack/";
    image.src="/images/My-Black-Cloud-Tool-Icons/"+folder+file+".webp";
    TOOL_ART[key]=image;
  }
  return TOOL_ART[key];
}
// Trying a real top-down photo for bed 1's whole overhead bed+patient —
// same lazy-load-then-redraw pattern as toolArt().
const BED1_IMAGE=new Image();
let bed1ImageReady=false;
BED1_IMAGE.onload=function(){bed1ImageReady=true; if(typeof draw==="function") draw();};
BED1_IMAGE.src="/images/patient-bed1.webp";
const CAN_KEYS=CANS.map(function(c){return c.k;});
const CAN_BY={}; CANS.forEach(function(c){ CAN_BY[c.k]=c; });
CANS.forEach(function(c){ TOOLS[c.k]={n:c.n,s:1}; SHORT[c.k]=c.n.split(" ")[0]; });
/* early levels mostly cheap cans, later mostly strong ones —
   but the violet can is always on the table */
function pickCan(lv){
  const t=Math.min(1,(lv-1)/7);
  const w=[ 60-t*50, 25+t*5, 10+t*25, 5+t*20 ];
  let sum=0; for(let i=0;i<w.length;i++) sum+=w[i];
  let r=Math.random()*sum;
  for(let i=0;i<w.length;i++){ r-=w[i]; if(r<=0) return CANS[i].k; }
  return CANS[0].k;
}

/* ================= PATIENTS ================= */
const DECK=[
 {dx:"COPD exacerbation",t:150,plan:[
   {n:"Controlled O2",need:["VENTK","FLOW"],note:"Retainer. Venturi at a fixed FiO2 — not a non-rebreather."},
   {n:"Blood gas",need:["ABG","XTREE"],note:"Check the CO2 before you touch the oxygen again."},
   {n:"Bronchodilator",need:["NEB","MDI"],note:"Duoneb, then reassess. He's still tight."}]},
 {dx:"Status asthmaticus",t:135,plan:[
   {n:"Back-to-back nebs",need:["NEB","FLOW"],note:"Stack them. The quiet chest is the bad sign."},
   {n:"Blood gas",need:["ABG","NRB"],note:"A normal CO2 in a severe asthmatic means he's tiring."},
   {n:"Prep to intubate",need:["BVM","ETCO2"],note:"If he stops fighting you, get the tube ready."}]},
 {dx:"Trach, thick secretions",t:135,plan:[
   {n:"Clear the airway",need:["SUCT","YANK"],note:"Suction on the way out, not on the way in."},
   {n:"Closed system",need:["INLINE","MANO"],note:"In-line keeps PEEP. Check the cuff while you're there."},
   {n:"Humidify",need:["NEB","FLOW"],note:"Dry gas is why they got thick in the first place."}]},
 {dx:"Post-op cardiac wean",t:155,plan:[
   {n:"Spontaneous trial",need:["TLUNG","FLOW"],note:"Pressure support trial. Watch the rate, not the clock."},
   {n:"Cuff and gas",need:["MANO","ABG"],note:"20-30 cmH2O before anyone pulls that tube."},
   {n:"Extubate to O2",need:["NC","XTREE"],note:"Cannula ready before the tube comes out, not after."}]},
 {dx:"Pneumonia, hypoxic",t:160,plan:[
   {n:"Ladder up O2",need:["NRB","FLOW"],note:"Shunt won't fix with a cannula."},
   {n:"Blood gas",need:["ABG","XTREE"],note:"See how much of that oxygen is actually landing."},
   {n:"Recruit",need:["PEEP","INLINE"],note:"Open the lung with PEEP, not with volume."}]},
 {dx:"ARDS, proned",t:150,plan:[
   {n:"Low tidal volume",need:["PEEP","TLUNG"],note:"6 mL/kg ideal body weight. Not actual weight."},
   {n:"Gas and suction",need:["ABG","INLINE"],note:"Permissive hypercapnia is fine. Hypoxia isn't."},
   {n:"Hold the airway",need:["SUCT","MANO"],note:"A tube that migrates while proned is a very bad day."}]},
 {dx:"Overdose, apneic",t:110,plan:[
   {n:"Bag him",need:["BVM","ETCO2"],note:"No drive. Bag first, ask questions after."},
   {n:"Secure the airway",need:["MANO","INLINE"],note:"Confirm, secure, then relax."},
   {n:"Wean support",need:["NC","FLOW"],note:"He'll wake up angry. That's the good outcome."}]},
 {dx:"Sudden pneumothorax",t:110,plan:[
   {n:"Support ventilation",need:["BVM","ETCO2"],note:"High peak pressure, one side silent. Move."},
   {n:"Reassess pressures",need:["TLUNG","FLOW"],note:"Compliance should improve the second it's decompressed."},
   {n:"Post-decompression",need:["ABG","NRB"],note:"Confirm it worked. Don't take anyone's word for it."}]},
 {dx:"Fresh tube from ER",t:125,plan:[
   {n:"Confirm placement",need:["ETCO2","MANO"],note:"Colour change every time. No exceptions."},
   {n:"Secure and suction",need:["INLINE","SUCT"],note:"Note the depth at the teeth before you walk away."},
   {n:"Set support",need:["TLUNG","PEEP"],note:"Full support now, wean tomorrow."}]},
 {dx:"Stepdown, mild hypoxia",t:175,plan:[
   {n:"Cannula",need:["NC","XTREE"],note:"Start low. You can always go up."},
   {n:"Titrate down",need:["FLOW","ABG"],note:"Don't leave him on 6L forever because nobody looked."},
   {n:"Teach the inhaler",need:["MDI","NEB"],note:"Half of readmissions are bad inhaler technique."}]},
 {dx:"Neuromuscular decline",t:140,plan:[
   {n:"Check the CO2",need:["ABG","XTREE"],note:"Watch the CO2, not the sat. He tires before he desats."},
   {n:"Support breaths",need:["BVM","MANO"],note:"Falling vital capacity is the whole story here."},
   {n:"Airway clearance",need:["SUCT","YANK"],note:"He can't cough. That's the part that kills him."}]},
 {dx:"Post-extubation stridor",t:130,plan:[
   {n:"Racemic epi",need:["NEB","FLOW"],note:"Buys you time. Only time."},
   {n:"High-flow O2",need:["NRB","XTREE"],note:"Keep him calm — agitation makes the stridor worse."},
   {n:"Ready to re-tube",need:["BVM","ETCO2"],note:"Have it at the bedside before you need it."}]}
];
const FLAVOR=["Resident wants everyone on 100%. Ignore him.","Family in the hallway did some research.",
 "Someone silenced an alarm without telling you.","The coffee's been on the burner since 03:00.",
 "Day shift charted \"tolerating well.\" He is not.","Your trauma shears are gone. Again.",
 "\"He was fine a minute ago.\"","Housekeeping is mopping the only hallway.",
 "Someone is standing in the doorway. Of course they are.",
 "Housekeeping is mopping around the vent again.",
 "\"I can't clean round that thing,\" says housekeeping. Fair.",
 "Wet floor. Nobody put a sign out."];

/* ================= MAP ================= */
const TILE=32, MW=15, MH=47;
const OR ={x0:6,x1:13,y0:1,y1:5};   // operating room, right of the top block
const RECOV={x0:1,x1:4,y0:1,y1:5};  // recovery bay, left of it
const OR_TABLE={x:10,y:3};          // the case that is always running
const OR_PICK ={x:3,y:2};           // collect the post-op patient from recovery
const REC_SPOT={x:3,y:2};
const PPE_ZONES=[{x:6,y:7},{x:8,y:7}];
const ISO_BEDS=[2,5];                 // these two are on isolation
const STERILE_TOP=5;                // rows 1..5 need PPE
const map=[];
for(let y=0;y<MH;y++){const r=[];for(let x=0;x<MW;x++)r.push(0);map.push(r);}
for(let x=0;x<MW;x++){map[0][x]=1;map[MH-1][x]=1;}
for(let y=0;y<MH;y++){map[y][0]=1;map[y][MW-1]=1;}
for(let y=7;y<=41;y++){map[y][5]=1;map[y][9]=1;}
// wall between the top block and the unit, with one doorway into the corridor
for(let x=1;x<=13;x++) map[6][x]=1;
map[6][7]=0;
// divider between recovery and the OR, open along the bottom row
for(let y=1;y<=4;y++) map[y][5]=1;
map[5][5]=0;   // passage along the bottom of the top block
[11,16,21,26].forEach(r=>{for(let x=1;x<=4;x++)map[r][x]=1;for(let x=10;x<=13;x++)map[r][x]=1;});
const YS=[7,12,17,22];
YS.forEach(y0=>{map[y0+2][5]=0;map[y0+2][9]=0;});
map[28][5]=0; map[32][5]=0;        // supply, and the morgue below it
map[28][9]=0; map[32][9]=0;        // dirty utility, and the pharmacy below it

const SUPPLY={x0:1,x1:4,y0:27,y1:29};               // top half
const MORGUE={x0:1,x1:4,y0:31,y1:33};               // bottom half
const MORGUE_BAY={x:2,y:32};                        // the spare trolley
const MORGUE_BAY2={x:4,y:32};                       // and the occupied one
for(let x=1;x<=4;x++) map[30][x]=1;                 // wall between them
const DIRTY ={x0:10,x1:13,y0:27,y1:29};             // top half
const PHARM ={x0:10,x1:13,y0:31,y1:33};             // bottom half
for(let x=10;x<=13;x++) map[30][x]=1;               // wall between them
const DIRTY_SPOT={x:12,y:28};                       // pack dump
const EQ_SPOTS=[{x:10,y:29},{x:11,y:29},{x:12,y:29},{x:13,y:29}];
const ELEC={x:13,y:27};                             // the breaker panel
const EQ_TYPES=[
  {k:"VENT", n:"Dirty vent",     c:"#4E6E8E"},
  {k:"BIPAP",n:"Dirty BiPAP",    c:"#7A5A8E"},
  {k:"HFNC", n:"Dirty HFNC pole",c:"#4E8C7A"},
  {k:"MONI", n:"Dirty monitor",  c:"#8E6B4E"}
];
// wall under the waiting/lunch block; the bottom block is split in two
for(let x=1;x<=13;x++) map[42][x]=1;
map[42][2]=0;                      // washroom, straight down from the waiting room
map[42][8]=0;                      // NICU, off the corridor
const WASH={x0:1,x1:3,y0:43,y1:45};   // small, and sealed off from the NICU
const NICU={x0:5,x1:8,y0:43,y1:45};    // cots on the left
const DELIV={x0:10,x1:13,y0:43,y1:45}; // delivery room on the right
for(let y=43;y<=45;y++) map[y][9]=1;   // wall between them
map[45][9]=0;                          // with a way through at the back
for(let y=43;y<=45;y++) map[y][4]=1;  // solid divider — no way through
const WASH_SPOT={x:2,y:44};
const WASH_STALLS=[{x:1,y:43},{x:3,y:43}];
const WAIT ={x0:1,x1:4,y0:35,y1:41};
const LUNCH={x0:10,x1:13,y0:35,y1:41};
const EXIT_DOOR={x:0,y:38};      // doors in the west wall of the waiting room
const DISCHARGE={x:1,y:38};      // stand here, in front of the doors
const COFFEE={x:12,y:38};        // in front of the lunch room sink counter
const PARTY ={x:11,y:36};
const VEND  ={x:11,y:40};        // stand here to use the machine        // the cake always ends up on this table
const CHAIR_BAY=[{x:6,y:36},{x:8,y:36},{x:6,y:40}];
// wall between the utility rooms and the waiting / lunch rooms
for(let x=1;x<=4;x++)  map[34][x]=1;
for(let x=10;x<=13;x++) map[34][x]=1;
map[38][5]=0; map[38][9]=0;
/* charge desk sits against the west corridor wall, clear of every doorway */
const CHARGE={x:6,y0:16,y1:18};
for(let y=CHARGE.y0;y<=CHARGE.y1;y++) map[y][CHARGE.x]=1;

const ROOMS=[];
YS.forEach((y0,i)=>{
  ROOMS.push({id:i*2+1,x0:1,x1:4,y0:y0,y1:y0+3,bx:2,by:y0+1,dx:3,dy:y0+1,side:"L"});
  ROOMS.push({id:i*2+2,x0:10,x1:13,y0:y0,y1:y0+3,bx:12,by:y0+1,dx:11,dy:y0+1,side:"R"});
});
ROOMS.sort((a,b)=>a.id-b.id);
ROOMS.forEach(function(r){
  if(ISO_BEDS.indexOf(r.id)<0) return;
  r.iso=true;
  r.ppe={x: r.side==="L"? 6 : 8, y: r.y0+2};   // corridor side of their door
});
ROOMS.forEach(r=>{map[r.by][r.bx]=2;map[r.by+1][r.bx]=2;});

const inBox=(b,x,y)=>x>=b.x0&&x<=b.x1&&y>=b.y0&&y<=b.y1;
function roomAt(x,y){for(let i=0;i<ROOMS.length;i++) if(inBox(ROOMS[i],x,y)) return ROOMS[i]; return null;}
function walkable(x,y){ return x>=0&&y>=0&&x<MW&&y<MH&&map[y][x]===0; }
function sterile(x,y){ return y<=STERILE_TOP; }
/* the OR block, plus any isolation room with someone in it */
function isoRoomAt(x,y){
  const r=roomAt(x,y);
  if(!r||!r.iso) return null;
  const b=beds[r.id-1];
  if(!b) return null;
  return (b.state==="active"||b.state==="code"||b.state==="ready") ? r : null;
}
function restricted(x,y){ return sterile(x,y) || !!isoRoomAt(x,y); }
// staff, housekeeping and visitors are never gowned, so the block is closed to them
function npcWalkable(x,y){ return walkable(x,y) && !restricted(x,y); }

function path(sx,sy,tx,ty){
  if(!npcWalkable(sx,sy)||!npcWalkable(tx,ty)) return null;
  const K=(x,y)=>y*MW+x, prev=new Map(), q=[[sx,sy]];
  prev.set(K(sx,sy),null);
  let head=0, found=false;
  while(head<q.length){
    const cur=q[head++], x=cur[0], y=cur[1];
    if(x===tx&&y===ty){found=true;break;}
    const N=[[1,0],[-1,0],[0,1],[0,-1]];
    for(let i=0;i<4;i++){
      const nx=x+N[i][0], ny=y+N[i][1];
      if(!npcWalkable(nx,ny)) continue;
      const k=K(nx,ny); if(prev.has(k)) continue;
      prev.set(k,[x,y]); q.push([nx,ny]);
    }
  }
  if(!found) return null;
  const out=[]; let cur=[tx,ty];
  while(cur){ out.push(cur); cur=prev.get(K(cur[0],cur[1])); }
  return out.reverse();
}

/* ================= STATE ================= */
let SLOTS=6, EMAX=100, packUp=false, tankUp=false;
const DROP_T=1.4, DIRTY_T=1.0, CART_T=1.8, CODE_T=32, CHAIR_T=1.5, COFFEE_T=1.2, EQUIP_T=1.3, PRIZE_RUSH=30, READY_T=75, PARTY_T=26, PARTY_HOLD=1.4, HEY_T=20, CLEAN_T=85, OD_T=55, OD_HOLD=1.8, ORTX_T=80, PPE_T=1.6, ORLOAD_T=1.8, REC_T=1.8, HIGH_T=70, SPARK_T=2.6, ZOMB_T=60, FIRE_T=55, SHOT_CD=0.34, ZOMB_AGGRO=132, ZOMB_WALK=34, BUG_T=50, JUMP_T=0.52, STOMP_R=19, VEND_T=1.0, POW_MAX=6, FIGHT_T=45, FIGHT_HOLD=2.4, RANT_T=70, RANT_HOLD=15, NIV_T=60, NIV_HOLD=2.0;
let level=1, savedCount=0, beds=[], pack=[], loose=[], staff=[], fx=[];
let player, keys={}, act=false, actHeld=false, running=false, sel=0, selLock=0;
let t=0, flavorT=8, dropP=0, dirtyP=0, cart=null, carts=[], codeBed=null, moving=false;
let carry="", carryBed=null, chairs=[], boost=0, discharged=0, totalDischarged=0, quota=1, concurrent=1;
let fullHouse=false;
let admitted=0, stages=2, coffeeP=0, refillT=0, energy=100, warnedE=0, gearFlash=0;
let rush=0, trail=[], trailCol="#8FE04A", confetti=0;
let eqLoose=[], eqParked=[], eqCarry=null, eqP=0, prizeGiven=0, prizeRush=false;
let seated=[], reception=null, cleaners=[], pacers=[], gazers=[], birth=null, desked=[];
let chat=null, chatT=5, chatSaid=[];
let blackout=0, blackoutFrom=0, preFlick=0, postFlick=0, eventName="", eventT=0;
let events=[], evRoll=0, coins=0, partyP=0, dance=0, streamers=[], banner="", bannerT=0, bannerKind="";
let levelCoinsEarned=0, levelToolUses={}, levelCodesSurvived=0, levelHadCode=false, levelHadRelapse=false;
function awardCoins(amount){coins+=amount;levelCoinsEarned+=amount;}
let cloudUsed=false, swarm=0, shouts=[];
let powers=[], pwSig=null, friend=null, packSig=null, detailSig=null, od=null, odP=0;
let ppe=false, ppeP=0, orPt=null, orP=0, recP=0, ppeWarn=0, ppeUsed=false;
let high=0, narcan=null, holdBlip=0, wheelT=0;
let spark=null, sparkP=0;
let mcarts=[], mcartFull=false;
let zomb=false, darts=[], shotCD=0, corpses=[];
let fires=[], fireRoom=null, smoker=null, ext=null, spray=0;
let bugs=[], bugRoom=null, splats=[], jump=0, jumped=false;
let vendP=0, shopOpen=false, wcDoor=0;
let fight=null, fightP=0, bleed=0, drips=[];
let rant=null, rantP=0, rantLine=0;
let niv=null, nivP=0, baby=null;
let surgeons=[], orOpen=true;
const POWERS={
  SPRINT:{n:"Second Wind", c:"#8FE04A", d:"20s of full sprint"},
  TANK:  {n:"Full Tank",   c:"#38D6E0", d:"energy back to 100"},
  CALM:  {n:"Charge Nurse",c:"#F2C94D", d:"clears the floor and buys 25s"},
  KIT:   {n:"Loaded Kit",  c:"#C9A227", d:"fills your pack for the bed you're at"},
  FRIEND:{n:"A Friend",    c:"#7FD4E0", d:"another RT comes and covers a bed"},
  NARCAN:{n:"Narcan Kit",  c:"#E8E4DA", d:"clears a contact high"},
  DEATH: {n:"Second Chance",c:"#D8D2C8", d:"carry on after you lose one"},
  PACK:  {n:"Bigger Pack",  c:"#C9A227", d:"two more slots — 8 in the pack"},
  TANKUP:{n:"Deep Reserves",c:"#38D6E0", d:"half again as much energy"},
  CAN25: {n:"Blue Can",   c:"#4A9CE0", d:"8s rush, +25 energy"},
  CAN50: {n:"Green Can",  c:"#8FE04A", d:"11s rush, +50 energy"},
  CAN75: {n:"Amber Can",  c:"#F2A03D", d:"15s rush, +75 energy"},
  CAN100:{n:"Violet Can", c:"#C96BD8", d:"20s rush, full tank"}
};
const POWER_IMAGE_PATHS={
  SPRINT:"second-wind",TANK:"full-tank",CALM:"charge-nurse",KIT:"loaded-kit",
  FRIEND:"a-friend",NARCAN:"narcan-kit",DEATH:"second-chance",PACK:"bigger-pack",
  TANKUP:"deep-reserves",CAN25:"blue-can",CAN50:"green-can",CAN75:"amber-can",CAN100:"violet-can"
};
const SHOP=[
  {k:"CAN25", cost:8},
  {k:"CAN50", cost:16},
  {k:"CAN75", cost:26},
  {k:"CAN100",cost:40},
  {k:"TANK",  cost:18},
  {k:"SPRINT",cost:22},
  {k:"KIT",   cost:24},
  {k:"CALM",  cost:34},
  {k:"FRIEND",cost:50},
  {k:"DEATH", cost:120},
  {k:"PACK",  cost:70,  perm:true},
  {k:"TANKUP",cost:90,  perm:true}
];
const POWER_KEYS=Object.keys(POWERS).filter(function(k){
  return ["FRIEND","NARCAN","DEATH","PACK","TANKUP"].indexOf(k)<0 && CAN_KEYS.indexOf(k)<0;});

/* ================= LEVEL ================= */
function startLevel(n){
  level=n; syncLevelMenu(n); t=0; flavorT=8; dropP=0; dirtyP=0; cart=null; carts=[]; codeBed=null;
  levelCoinsEarned=0; levelToolUses={}; levelCodesSurvived=0; levelHadCode=false; levelHadRelapse=false;
  SLOTS=packUp?8:6; EMAX=tankUp?150:100;
  carry=""; carryBed=null; boost=0; discharged=0; energy=EMAX; warnedE=0; gearFlash=0;
  rush=0; trail=[]; trailCol="#8FE04A"; confetti=0;
  eqLoose=[]; eqParked=[]; eqCarry=null; eqP=0; prizeGiven=0; prizeRush=false;
  quota = fullHouse ? 8 : n;
  concurrent = fullHouse ? 8 : Math.min(n,5);
  chairs=CHAIR_BAY.map(function(c){return {tx:c.x,ty:c.y};});
  seated=seedWaiting();
  pacers=[];
  for(let i=0;i<3;i++){
    const f={x:WAIT.x0+Math.floor(Math.random()*4), y:WAIT.y0+2+Math.floor(Math.random()*5)};
    if(!walkable(f.x,f.y)) continue;
    pacers.push({x:(f.x+.5)*TILE, y:(f.y+.5)*TILE, face:0, phase:0, moving:false,
      sp:26+Math.random()*16, wt:Math.random()*3, path:null, pi:1,
      hair:HAIR[Math.floor(Math.random()*HAIR.length)],
      skin:SKIN[Math.floor(Math.random()*SKIN.length)],
      col:["#8E5B4A","#5A6E8E","#6E5A8E","#4E7A6B"][i%4]});
  }
  // a delivery in progress, permanently
  birth={
    cx:(DELIV.x0+1.6)*TILE, cy:(DELIV.y0+1.7)*TILE,
    hair:HAIR[Math.floor(Math.random()*HAIR.length)],
    skin:SKIN[Math.floor(Math.random()*SKIN.length)],
    team:[
      {ox:-2, oy: 30, ph:0.0, col:"#2E6E62", kind:"Aide"},   // at the foot
      {ox:-26,oy: 10, ph:2.1, col:"#3E7A6E", kind:"Aide"},   // beside her
      {ox: 26,oy: 12, ph:4.0, col:"#3B87DE", kind:"RN"},     // the midwife
      {ox: 24,oy:-22, ph:5.2, col:"#5A7A94", kind:"RN"}      // at the warmer
    ]
  };

  // and two parents at the NICU window
  gazers=[
    {x:(NICU.x0+1.05)*TILE, y:(NICU.y0-2)*TILE+21, ph:0,
     hair:HAIR[Math.floor(Math.random()*HAIR.length)],
     skin:SKIN[Math.floor(Math.random()*SKIN.length)], col:"#7A5A8E"},
    {x:(NICU.x0+2.25)*TILE, y:(NICU.y0-2)*TILE+21, ph:2.2,
     hair:HAIR[Math.floor(Math.random()*HAIR.length)],
     skin:SKIN[Math.floor(Math.random()*SKIN.length)], col:"#4E6E8E"}
  ];
  blackout=0; blackoutFrom=0; preFlick=0; postFlick=0; eventName=""; eventT=0;
  namePool=[];
  events=[]; evRoll=6+Math.random()*6; partyP=0; dance=0; streamers=[];
  cloudUsed=false; musicCloudActive=false; swarm=0; shouts=[]; powers=[]; friend=null; od=null; odP=0;
  ppe=false; ppeP=0; orPt=null; orP=0; recP=0; ppeWarn=0; ppeUsed=false;
  high=0; narcan=null; spark=null; sparkP=0;
  mcartFull=false;
  mcarts=[{tx:MORGUE_BAY.x, ty:MORGUE_BAY.y, full:false},
          {tx:MORGUE_BAY2.x, ty:MORGUE_BAY2.y, full:true}];
  zomb=false; darts=[]; shotCD=0; corpses=[];
  fires=[]; fireRoom=null; smoker=null; ext=null; spray=0;
  bugs=[]; bugRoom=null; splats=[]; jump=0; jumped=false;
  vendP=0; shopOpen=false; wcDoor=0; closeShop();
  fight=null; fightP=0; bleed=0; drips=[];
  rant=null; rantP=0; rantLine=0;
  niv=null; nivP=0; baby=null;
  orOpen=true;
  surgeons=[
    {ox:-30,oy:-12,ph:0.0,col:"#2E6E62"},
    {ox: 30,oy:-8, ph:2.1,col:"#2E6E62"},
    {ox:-28,oy: 20,ph:4.0,col:"#3E7A6E"},
    {ox: 31,oy: 22,ph:5.2,col:"#4E6E8E"}
  ];
  banner=""; bannerT=0; bannerKind="";
  // whoever is charting at the desk this shift
  chat=null; chatT=4+Math.random()*4; chatSaid=[];
  desked=[];
  for(let i=0;i<3;i++){
    if(Math.random()<0.22) continue;          // a seat or two left empty
    desked.push({
      x:(CHARGE.x+1)*TILE+18, y:(CHARGE.y0+i)*TILE+TILE/2,
      ph:Math.random()*6.28,
      hair:HAIR[Math.floor(Math.random()*HAIR.length)],
      skin:SKIN[Math.floor(Math.random()*SKIN.length)],
      kind:["RN","RN","Aide"][i],
      col:["#3B87DE","#5A7A94","#77864F"][i]
    });
  }
  cleaners=[];
  for(let i=0;i<2;i++){
    const f=freeTile();
    cleaners.push({x:(f.x+.5)*TILE, y:(f.y+.5)*TILE, face:0,
      sp:40+Math.random()*14, path:null, pi:1, room:null, mop:0,
      hair:HAIR[Math.floor(Math.random()*HAIR.length)],
      skin:SKIN[Math.floor(Math.random()*SKIN.length)],
      wet:[], idle:0});
  }
  reception={ x:(WAIT.x0+2)*TILE, y:WAIT.y0*TILE+19,
              face:Math.PI/2,
              hair:HAIR[Math.floor(Math.random()*HAIR.length)],
              skin:SKIN[Math.floor(Math.random()*SKIN.length)],
              ph:Math.random()*6.28 };
  pack=[]; loose=[]; staff=[]; fx=[]; sel=0; selLock=0;
  player={x:7*TILE+TILE/2, y:30*TILE+TILE/2, r:9, face:-Math.PI/2, phase:0};

  beds=ROOMS.map(function(r,i){
    return {room:r, active:i<concurrent, state:i<concurrent?"active":"off", p:null,
            t:0, max:1, got:[], plan:null, stage:0, careMax:1, arrive:0};
  });
  admitted=0;
  stages = n<=2 ? 2 : 3;
  beds.forEach(function(b){ if(b.active) admit(b); });

  for(let i=0;i<5+n;i++){ const kk=roleKeys();
    placeTool(kk[Math.floor(Math.random()*kk.length)]); }
  for(let i=0;i<(n<3?1:2);i++) placeTool(pickCan(n));

  // night shift left four rooms filthy — clear them for the prize
  (function(){
    const spare=beds.filter(function(b){return !b.active;});
    let placed=0;
    for(let i=0;i<spare.length && placed<4;i++){
      const b=spare[i], ty=EQ_TYPES[placed%EQ_TYPES.length];
      b.state="dirty"; b.mess=seedMess(b.room); b.arrive=0;
      eqLoose.push({tx: b.room.side==="L"?b.room.x0:b.room.x1,
                    ty: b.room.y0+1, t:ty, room:b.room.id});
      placed++;
    }
    // if the unit is too full for four dirty rooms, park the rest in the hall
    while(placed<4){
      const ty=EQ_TYPES[placed%EQ_TYPES.length];
      let spot=null;
      for(let k=0;k<80&&!spot;k++){
        const cx=6+Math.floor(Math.random()*3), cy=8+Math.floor(Math.random()*(MH-13));
        if(walkable(cx,cy) && !eqLoose.some(function(e){return e.tx===cx&&e.ty===cy;})) spot={x:cx,y:cy};
      }
      if(!spot) break;
      eqLoose.push({tx:spot.x,ty:spot.y,t:ty,room:-1});
      placed++;
    }
  })();

  spawnStaff(5+n*2,false);
  buildStrip();
  log("Level "+n+" - discharge "+quota+". Four rooms are soiled: rack the equipment for a reward.");
  buildStrip();
}

function ISO_ACTIVE(b){
  return b && b.room.iso &&
    (b.state==="active"||b.state==="code"||b.state==="ready");
}
function seedWaiting(){
  // families camped in the waiting room chairs
  const SEATS=[[WAIT.x0,WAIT.y0+2],[WAIT.x0,WAIT.y0+5],
               [WAIT.x1,WAIT.y0+1],[WAIT.x1,WAIT.y0+3],[WAIT.x1,WAIT.y0+5]];
  const out=[];
  SEATS.forEach(function(sp,i){
    if(Math.random()<0.28) return;                 // a couple of empty chairs
    out.push({x:(sp[0]+0.5)*TILE, y:(sp[1]+0.5)*TILE,
      face: sp[0]===WAIT.x0 ? 0 : Math.PI,          // turned toward the room
      hair:HAIR[Math.floor(Math.random()*HAIR.length)],
      skin:SKIN[Math.floor(Math.random()*SKIN.length)],
      col:["#A9694E","#6E5A8E","#4E7A6B","#8E5B4A","#5A6E8E"][i%5],
      ph:Math.random()*6.28, fidget:0.6+Math.random()*1.4});
  });
  return out;
}
function seedMess(r){
  function rr(i,j){const v=Math.sin(i*91.7+j*47.3+r.id*13.1)*43758.5453;return v-Math.floor(v);}
  const m={blood:[],trash:[],linen:[],prints:[]};
  for(let i=0;i<7;i++){
    m.blood.push({x:(r.bx+0.5)*TILE+(rr(i,1)-0.5)*46,
                  y:(r.by+1)*TILE+(rr(i,2)-0.5)*70,
                  r:2.6+rr(i,3)*5.5, a:0.30+rr(i,4)*0.32,
                  sx:0.7+rr(i,7)*0.9});
  }
  for(let i=0;i<9;i++){
    m.trash.push({x:r.x0*TILE+rr(i,5)*4*TILE, y:r.y0*TILE+rr(i,6)*4*TILE,
                  w:2.5+rr(i,8)*5, h:2+rr(i,9)*3.5, rot:rr(i,10)*3.14,
                  c:["#C9CFD4","#9BB7C4","#D8CBA8","#8FA3B4"][Math.floor(rr(i,11)*4)]});
  }
  for(let i=0;i<3;i++){
    m.linen.push({x:r.x0*TILE+6+rr(i,12)*(3.4*TILE), y:r.y0*TILE+8+rr(i,13)*(3.2*TILE),
                  w:12+rr(i,14)*12, h:8+rr(i,15)*8, rot:rr(i,16)*3.14});
  }
  for(let i=0;i<6;i++){
    m.prints.push({x:(r.bx+0.5)*TILE+(rr(i,17)-0.5)*40,
                   y:(r.by+2)*TILE+i*9+rr(i,18)*4,
                   a:0.16-i*0.02});
  }
  return m;
}
function admit(b){
  const dk=(role==="RN")?DECK_RN:DECK;
  const d=dk[Math.floor(Math.random()*dk.length)];
  b.plan=d.plan.slice(0,stages);
  b.stage=0; b.careMax=b.plan.length; b.got=[];
  b.p={dx:d.dx, need:b.plan[0].need.slice(), note:b.plan[0].note, sn:b.plan[0].n};
  b.name=nextName();
  b.skin=SKIN[Math.floor(Math.random()*SKIN.length)];
  b.hair=HAIR[Math.floor(Math.random()*HAIR.length)];
  b.look={ wrap:Math.random()<0.34, seep:Math.random()<0.45,
           patch:Math.random()<0.30, nc:Math.random()<0.40 };
  b.max=Math.round(d.t*(1-Math.min(.24,(level-1)*0.04)));
  b.t=b.max; b.state="active"; b.active=true;
  admitted++;
  b.p.need.forEach(function(k){ placeTool(k); });
  log("Bed "+b.room.id+": "+d.dx+" up from ER.");
}
function freeTile(){
  for(let i=0;i<250;i++){
    let x,y; const r=Math.random();
    if(r<0.42){ x=SUPPLY.x0+Math.floor(Math.random()*4); y=SUPPLY.y0+Math.floor(Math.random()*7); }
    else if(r<0.78){ x=6+Math.floor(Math.random()*3); y=7+Math.floor(Math.random()*(MH-9)); }
    else { const rm=ROOMS[Math.floor(Math.random()*8)];
           x=rm.x0+Math.floor(Math.random()*4); y=rm.y0+Math.floor(Math.random()*4); }
    if(!walkable(x,y)||sterile(x,y)||inFireRoom(x,y)) continue;
    if(loose.some(function(l){return l.tx===x&&l.ty===y;})) continue;
    if(x===DIRTY_SPOT.x&&y===DIRTY_SPOT.y) continue;
    if(ROOMS.some(function(rm){return rm.dx===x&&rm.dy===y;})) continue;
    return {x:x,y:y};
  }
  return {x:7,y:14};
}
function inFireRoom(x,y){
  return !!(fireRoom && x>=fireRoom.x0&&x<=fireRoom.x1&&y>=fireRoom.y0&&y<=fireRoom.y1);
}
function placeTool(key){
  // roughly one in eight ends up in the OR block, behind the PPE door
  if(Math.random()<0.13){
    for(let i=0;i<40;i++){
      const rx=OR.x0+Math.floor(Math.random()*(OR.x1-OR.x0+1));
      const ry=OR.y0+Math.floor(Math.random()*(OR.y1-OR.y0+1));
      if(walkable(rx,ry) && !inFireRoom(rx,ry)
         && !loose.some(function(l){return l.tx===rx&&l.ty===ry;})){
        loose.push({tx:rx,ty:ry,key:key}); return;
      }
    }
  }
  const s=freeTile(); loose.push({tx:s.x,ty:s.y,key:key});
}

function ensureNeeds(){
  beds.forEach(function(b){
    if(!b.p||b.state==="done"||b.state==="off") return;
    b.p.need.forEach(function(k){
      if(b.got.indexOf(k)>=0) return;
      if(pack.indexOf(k)>=0) return;
      if(loose.some(function(l){return l.key===k;})) return;
      placeTool(k);
    });
  });
}

/* ================= STAFF ================= */
const ROLES=[{n:"RN",c:"#5A7A94"},{n:"MD",c:"#E4D9C4"},{n:"Aide",c:"#77864F"},{n:"Family",c:"#A9694E"}];
function spawnStaff(n,rush){
  for(let i=0;i<n;i++){
    const s=freeTile(), rl=Math.random();
    const role=ROLES[Math.floor(Math.random()*ROLES.length)];
    staff.push({x:(s.x+.5)*TILE, y:(s.y+.5)*TILE,
      role:role, kind:role.n,
      hair:HAIR[Math.floor(Math.random()*HAIR.length)],
      skin:SKIN[Math.floor(Math.random()*SKIN.length)],
      seed:1+Math.floor(Math.random()*900),
      sp:46+Math.random()*28, path:null, pi:1, idle:0, face:0,
      mode: rush?"rush" : (rl<0.34?"door" : rl<0.66?"spot":"wander")});
  }
}
function staffTarget(s){
  if(s.mode==="rush"&&codeBed){
    const r=codeBed.room;
    return Math.random()<0.5?{x:r.side==="L"?5:9,y:r.y0+2}:{x:7+Math.floor(Math.random()*2),y:r.y0+1+Math.floor(Math.random()*3)};
  }
  if(s.mode==="door"){ const y0=YS[Math.floor(Math.random()*4)];
    return Math.random()<0.5?{x:5,y:y0+2}:{x:9,y:y0+2}; }
  if(s.mode==="spot"){ const r=ROOMS[Math.floor(Math.random()*ROOMS.length)];
    return {x:r.dx,y:r.dy}; }
  const f=freeTile(); return {x:f.x,y:f.y};
}
/* housekeeping: heads for soiled rooms and mops, but can't finish
   until the dirty equipment is out of the way */
function meCol(){ return role==="RN" ? "#E8ECEF" : "#3E6B6E"; }
const FLIP_ME=false;                    // draw the RT facing the other way
function meFace(){ return (player.face||0) + (FLIP_ME?Math.PI:0); }
function s2sp(z){ return 96+ (z.sp||46)*0.42; }
function updateCleaner(c,dt){
  c.moving=false;
  // keep or claim a soiled room
  const stillDirty = c.room && beds.some(function(b){
    return b.room.id===c.room.id && b.state==="dirty"; });
  if(!stillDirty){
    c.room=null; c.wet=[]; c.spot=null; c.path=null;
    const dirty=beds.filter(function(b){
      return b.state==="dirty" &&
             !cleaners.some(function(o){return o!==c && o.room && o.room.id===b.room.id;});
    });
    if(dirty.length) c.room=dirty[Math.floor(Math.random()*dirty.length)].room;
  }

  const inRoom = c.room && (function(){
    const tx=Math.floor(c.x/TILE), ty=Math.floor(c.y/TILE);
    return tx>=c.room.x0&&tx<=c.room.x1&&ty>=c.room.y0&&ty<=c.room.y1;
  })();

  // pick the next patch of floor to work on
  if(!c.spot || c.reached){
    c.reached=false;
    if(c.room){
      if(inRoom){
        // wander inside the room only
        // open floor only: skip the headwall row and the bed's own column
        for(let k=0;k<30;k++){
          const rx=c.room.x0+Math.floor(Math.random()*4),
                ry=c.room.y0+1+Math.floor(Math.random()*3);
          if(rx===c.room.bx) continue;
          if(rx===c.room.dx&&ry===c.room.dy) continue;   // leave the drop pad clear
          if(npcWalkable(rx,ry)){ c.spot={x:rx,y:ry}; break; }
        }
      } else {
        c.spot={x: c.room.side==="L"? c.room.x1 : c.room.x0, y: c.room.y0+2};
      }
    } else {
      c.spot={x:DIRTY.x0+1+Math.floor(Math.random()*3), y:DIRTY.y0+2+Math.floor(Math.random()*4)};
    }
    c.path=null;
  }

  const gx=(c.spot.x+.5)*TILE, gy=(c.spot.y+.5)*TILE;
  const d=Math.hypot(gx-c.x, gy-c.y);

  if(d<3){
    // standing on the patch: mop it, then move to another patch in the same room
    c.dwell=(c.dwell||0)+dt;
    c.face+=dt*1.4;
    if(c.room && inRoom){
      c.mop+=dt;
      if(c.mop>0.5){
        c.mop=0;
        c.wet.push({x:c.x+(Math.random()-0.5)*22, y:c.y+(Math.random()-0.5)*22,
                    r:8+Math.random()*6, a:0.5});
        if(c.wet.length>8) c.wet.shift();
      }
    }
    if(c.dwell>2.2+Math.random()*2){ c.dwell=0; c.reached=true; }
  } else {
    if(!c.path||c.pi>=c.path.length){
      c.path=path(Math.floor(c.x/TILE),Math.floor(c.y/TILE),c.spot.x,c.spot.y);
      c.pi=1;
      if(!c.path||c.path.length<2){ c.path=null; c.reached=true; return; }
    }
    const wp=c.path[c.pi], wx=(wp[0]+.5)*TILE, wy=(wp[1]+.5)*TILE;
    const dx=wx-c.x, dy=wy-c.y, dd=Math.hypot(dx,dy);
    if(dd<2.5){ c.pi++; }
    else {
      c.face=Math.atan2(dy,dx);
      c.x+=dx/dd*c.sp*dt; c.y+=dy/dd*c.sp*dt;
      c.moving=true; c.phase=(c.phase||0)+dt*(c.sp*0.155);
    }
  }
  for(let i=0;i<c.wet.length;i++) c.wet[i].a-=dt*0.07;
  c.wet=c.wet.filter(function(w){return w.a>0;});
}
function updateStaff(s,dt){
  s.moving=false;
  if(s.idle>0){ s.idle-=dt; return; }
  if(!s.path||s.pi>=s.path.length){
    const tg=staffTarget(s);
    s.path=path(Math.floor(s.x/TILE),Math.floor(s.y/TILE),tg.x,tg.y);
    s.pi=1;
    if(!s.path||s.path.length<2){ s.path=null; s.idle=0.5+Math.random(); }
    return;
  }
  const wp=s.path[s.pi];
  const gx=(wp[0]+.5)*TILE, gy=(wp[1]+.5)*TILE;
  const dx=gx-s.x, dy=gy-s.y, d=Math.hypot(dx,dy);
  if(d<2.5){
    s.pi++;
    if(s.pi>=s.path.length){
      s.path=null;
      s.idle = s.mode==="door"? 2.5+Math.random()*3.5
             : s.mode==="spot"? 1.5+Math.random()*1.8
             : s.mode==="rush"? 3+Math.random()*6
             : 0.3+Math.random();
    }
    return;
  }
  s.face=Math.atan2(dy,dx);
  s.x+=dx/d*s.sp*dt; s.y+=dy/d*s.sp*dt;
  s.moving=true; s.phase=(s.phase||0)+dt*(s.sp*0.155);
}

/* ================= LOG ================= */
const logEl=document.getElementById("log");
function log(m,hot){ logEl.innerHTML = hot? "<b>"+m+"</b>" : m; }

/* ================= INPUT ================= */
const stickZone=document.getElementById("stickZone"),
      stickEl=document.getElementById("stick"), knobEl=document.getElementById("knob");
const RADIUS=54, DEAD=0.14;
let stickId=null, origin={x:0,y:0}, mv={x:0,y:0,m:0};
function moveStick(cx,cy){
  let dx=cx-origin.x, dy=cy-origin.y; const d=Math.hypot(dx,dy);
  if(d>RADIUS){dx=dx/d*RADIUS;dy=dy/d*RADIUS;}
  knobEl.style.transform="translate(calc(-50% + "+dx+"px), calc(-50% + "+dy+"px))";
  const m=Math.min(1,d/RADIUS);
  if(m<DEAD){mv={x:0,y:0,m:0};return;}
  const a=Math.atan2(dy,dx);
  mv={x:Math.cos(a),y:Math.sin(a),m:(m-DEAD)/(1-DEAD)};
}
function dropStick(){stickId=null;mv={x:0,y:0,m:0};stickEl.classList.remove("on");
  knobEl.style.transform="translate(-50%,-50%)";}
document.getElementById("stage").addEventListener("pointerdown",function(){ SFX.start(); unlockMusic(); });
stickZone.addEventListener("pointerdown",function(e){
  if(stickId!==null)return; e.preventDefault(); stickId=e.pointerId;
  stickZone.setPointerCapture(e.pointerId);
  const r=stickEl.getBoundingClientRect(); origin={x:r.left+r.width/2,y:r.top+r.height/2};
  stickEl.classList.add("on"); moveStick(e.clientX,e.clientY);
});
stickZone.addEventListener("pointermove",function(e){
  if(e.pointerId!==stickId)return; e.preventDefault(); moveStick(e.clientX,e.clientY);});
["pointerup","pointercancel"].forEach(function(v){stickZone.addEventListener(v,function(e){
  if(e.pointerId===stickId){e.preventDefault();dropStick();}});});
const actBtn=document.getElementById("actBtn");
actBtn.addEventListener("pointerdown",function(e){
  e.preventDefault();act=true;actHeld=true;actBtn.classList.add("on");});
["pointerup","pointerleave","pointercancel"].forEach(function(v){
  actBtn.addEventListener(v,function(e){
    e.preventDefault();act=false;actHeld=false;actBtn.classList.remove("on");});});
addEventListener("keydown",function(e){const k=e.key.toLowerCase();
  if(e.target.closest && e.target.closest("button,input,select,textarea")) return;
  if(["arrowup","arrowdown","arrowleft","arrowright"," "].indexOf(k)>=0)e.preventDefault();
  if(k===" "&&!keys[" "]) act=true;
  keys[k]=true; if(k===" ") actHeld=true;});
addEventListener("keyup",function(e){const k=e.key.toLowerCase();
  keys[k]=false; if(k===" "){act=false;actHeld=false;}});
document.addEventListener("touchmove",function(e){
  // the intro and the vending menu are real scrollable lists — leave them alone
  if(e.target.closest("#ov")||e.target.closest("#shop")||e.target.closest("#desktopMenu")) return;
  // #hud only scrolls internally when it actually overflows (cramped short screens) —
  // otherwise a drag starting near the top bar must not fall through to the page,
  // or iOS rubber-bands the document and flips Safari's toolbar open/closed.
  const hudEl=e.target.closest("#hud");
  if(hudEl && hudEl.scrollHeight>hudEl.clientHeight) return;
  e.preventDefault();},{passive:false});

/* ================= MOVEMENT ================= */
function blocked(nx,ny){
  const r=9;
  const pts=[[nx-r,ny-r],[nx+r,ny-r],[nx-r,ny+r],[nx+r,ny+r]];
  for(let i=0;i<4;i++) if(!walkable(Math.floor(pts[i][0]/TILE),Math.floor(pts[i][1]/TILE))) return true;
  // no gown, no entry — the OR block or an isolation room
  if(!ppe && restricted(Math.floor(nx/TILE), Math.floor((ny+r)/TILE))){
    if(ppeWarn<=0){ ppeWarn=2.4;
      log("Not without PPE. Gown up at the box outside the door.",true); }
    return true;
  }
  return false;
}
/* people don't stop you — you just have to squeeze past them */
function crowdFactor(){
  let drag=0;
  for(let i=0;i<staff.length;i++){
    const d=Math.hypot(player.x-staff[i].x, player.y-staff[i].y);
    if(d<30) drag += (1 - d/30);
  }
  const floor = swarm>0 ? 0.18 : 0.3;
  return Math.max(floor, 1 - drag*(swarm>0?0.52:0.42));
}
function slide(dx,dy){ if(!blocked(player.x+dx,player.y+dy)){player.x+=dx;player.y+=dy;} }
/* full speed while rested, dragging down to a trudge on empty */
/* four gears: you drop one every quarter of the bar */
const GEARS=[1.00, 0.86, 0.72, 0.58];
function energyTier(){ const p=energy/EMAX*100;
  return p>75?0 : p>50?1 : p>25?2 : 3; }
function staminaFactor(){ return GEARS[energyTier()]; }
function move(dt){
  let dx=0,dy=0,mag=0;
  if(mv.m>0){dx=mv.x;dy=mv.y;mag=mv.m;}
  else{
    if(keys.arrowup||keys.w)dy-=1; if(keys.arrowdown||keys.s)dy+=1;
    if(keys.arrowleft||keys.a)dx-=1; if(keys.arrowright||keys.d)dx+=1;
    if(dx||dy){const m=Math.hypot(dx,dy);dx/=m;dy/=m;mag=1;}
  }
  if(high>0){ dx=-dx; dy=-dy; }        // everything is backwards
  moving = mag>0;
  if(moving){
    const cf=crowdFactor();
    const load = carry==="cart"||carry==="patient" ? 0.70
               : carry==="niv" ? 0.72
               : carry==="mcart" ? (mcartFull?0.60:0.66)
               : carry==="orpatient" ? 0.62
               : carry==="equip" ? 0.66 : carry==="chair" ? 0.86 : 1;
    const sp=142*load*(rush>0?1.75:staminaFactor()*(boost>0?1.18:1))*mag*cf*dt;
    const oldX=player.x, oldY=player.y;
    slide(dx*sp,0); slide(0,dy*sp);
    player.face=Math.atan2(dy,dx);
    const travelled=Math.hypot(player.x-oldX,player.y-oldY);
    moving=travelled>0.01;
    player.phase=(player.phase||0)+travelled*0.155;
    if(carry){ wheelT-=dt; if(wheelT<=0){ wheelT=0.22; SFX.wheels(); } }
  }
}

/* ================= PACK ================= */
function used(){ let a=0; for(let i=0;i<pack.length;i++) a+=TOOLS[pack[i]].s; return a; }
function tileUnder(){ return {x:Math.floor(player.x/TILE), y:Math.floor(player.y/TILE)}; }
function pickUp(){
  if(carry){ log("Your hands are full."); return true; }
  const u=tileUnder();
  if(narcan && narcan.tx===u.x && narcan.ty===u.y){
    if(powers.length>=POW_MAX){ log("No room. Spend a power first."); return true; }
    narcan=null; grantPower("NARCAN");
    log("Got the kit. Now use it.",true);
    return true;
  }
  let i=-1;
  for(let j=0;j<loose.length;j++) if(loose[j].tx===u.x&&loose[j].ty===u.y){i=j;break;}
  if(i<0) return false;
  const k=loose[i].key;
  if(CAN_KEYS.indexOf(k)>=0){
    if(powers.length>=POW_MAX){ log("No room for another power. Spend one first."); return true; }
    loose.splice(i,1); grantPower(k); SFX.can(); return true;
  }
  if(used()+TOOLS[k].s>SLOTS){ log("Pack's full. Dirty utility is bottom right."); return true; }
  pack.push(k); loose.splice(i,1); SFX.pickup(); return true;
}

/* ================= DROP ZONE ================= */
function onDrop(b){ const u=tileUnder(); return b.room.dx===u.x && b.room.dy===u.y; }
function deliver(b){
  const give=[];
  for(let i=pack.length-1;i>=0;i--){
    const k=pack[i];
    if(b.p.need.indexOf(k)>=0 && b.got.indexOf(k)<0 && give.indexOf(k)<0){
      give.push(k); pack.splice(i,1);
    }
  }
  if(!give.length){ SFX.deny(); log("Bed "+b.room.id+" doesn't need anything you're carrying."); return; }
  const bx=(b.room.bx+.5)*TILE, by=(b.room.by+1)*TILE;
  give.forEach(function(k,i){
    b.got.push(k);
    levelToolUses[k]=(levelToolUses[k]||0)+1;
    fx.push({k:k, x0:player.x, y0:player.y, x1:bx+(i-give.length/2)*7, y1:by, t:0, d:0.45});
  });
  const left=b.p.need.filter(function(k){return b.got.indexOf(k)<0;});
  if(left.length){
    log("Bed "+b.room.id+": "+give.length+" delivered. Still needs "+
      left.map(function(k){return TOOLS[k].n.toLowerCase();}).join(", ")+".");
    return;
  }

  // ---- stage complete: care needs drop ----
  deliverFinish(b);
}

/* advance a bed one care step — used by the player and by a covering RT */
function deliverFinish(b){
  SFX.stageDone();
  b.stage++;
  if(b.stage >= b.plan.length){
    b.state="ready"; savedCount++;
    b.max=READY_T; b.t=READY_T; b.warned=false; buildStrip();
    log("Bed "+b.room.id+" is stable. Grab a wheelchair — he's going home.",true);
    return;
  }
  const st=b.plan[b.stage];
  b.got=[];
  b.p.need=st.need.slice(); b.p.note=st.note; b.p.sn=st.n;
  b.t += Math.round(b.max*0.45);   // he settles — the clock buys back
  b.p.need.forEach(function(k){ placeTool(k); });
  sel=beds.indexOf(b); selLock=6;
  log("Bed "+b.room.id+" settling — "+(b.careMax-b.stage)+" care need"+
      (b.careMax-b.stage>1?"s":"")+" left. Next: "+st.n.toLowerCase()+".");
}

/* ================= CODE ================= */
const EVENT_KINDS=["power","party","heyrt","clean","od","ortx","high","zomb","fire","bugs","fight","rant","niv"];
function startEvent(){
  const live=events.map(function(e){return e.kind;});
  const open=EVENT_KINDS.filter(function(k){ return live.indexOf(k)<0; });
  if(!open.length) return;
  const kind=open[Math.floor(Math.random()*open.length)];
  if(kind==="power") powerCut();
  else if(kind==="party") partyCall();
  else if(kind==="clean") cleanCall();
  else if(kind==="od") odCall();
  else if(kind==="ortx") orCall();
  else if(kind==="high") highCall();
  else if(kind==="zomb") zombCall();
  else if(kind==="fire") fireCall();
  else if(kind==="bugs") bugCall();
  else if(kind==="fight") fightCall();
  else if(kind==="rant") rantCall();
  else if(kind==="niv") nivCall();
  else heyRT();
}
function showBanner(txt,kind,secs){
  banner=txt; bannerKind=kind||""; bannerT=secs||3.2;
  eventName=txt; eventT=secs||3.2;
}
function powerCut(){
  if(blackout>0||preFlick>0) return;
  events.push({kind:"power",t:999});
  preFlick=2.4;
  // somebody has to actually go and fix it
  const f=freeTile();
  spark={x:(f.x+.5)*TILE, y:(f.y+.5)*TILE, face:0, phase:0, moving:false,
         found:false, done:false, path:null, pi:1, rep:0,
         hair:HAIR[Math.floor(Math.random()*HAIR.length)],
         skin:SKIN[Math.floor(Math.random()*SKIN.length)]};
  SFX.powerBump();
  showBanner("POWER BUMP","bump",2.4);
  log("Power bump. Find the electrician and walk him to the panel in dirty utility.",true);
}
function partyCall(){
  events.push({kind:"party",t:PARTY_T,max:PARTY_T});
  SFX.party();
  showBanner("ANOTHER BIRTHDAY PARTY","party",3.4);
  log("Another birthday party in the lunch room. Attendance is apparently mandatory.",true);
}
const HEY_LINES=["Hey RT!","Hey RT — quick question.","RT! Got a sec?",
  "Is he on the vent?","Can you look at bed 3?","RT, while you're here...",
  "Sorry — RT? RT!","Did anyone page you?","Just one thing, quick.",
  "You're the RT, right?","Hey! Respiratory!","My machine's beeping.",
  "Not urgent. Well. Sort of.","Can you turn that alarm off?"];
function heyRT(){
  events.push({kind:"heyrt",t:HEY_T,max:HEY_T});
  swarm=HEY_T; shouts=[];
  SFX.heyRT();
  showBanner("HEY RT","hey",3.2);
  log("Everyone on the unit needs you. All at once. As usual.",true);
}
const PRIZE_EVENTS=["party"];   // "clean" hands out A Friend specifically        // these hand out a power; the rest you just survive
function grantPower(key){
  SFX.power();
  if(powers.length>=POW_MAX){ log("No room for another power. Use one first."); return; }
  powers.push(key);
  showBanner("POWER: "+POWERS[key].n.toUpperCase(),"ok",2.8);
  log("Picked up "+POWERS[key].n+" — "+POWERS[key].d+".",true);
}
/* the corridor between the ward and the utility rooms — never a room,
   never the NICU, never the sterile block */
function hallSpot(){
  let best=null,bd=-1;
  for(let i=0;i<200;i++){
    const cx=6+Math.floor(Math.random()*3), cy=8+Math.floor(Math.random()*26);
    if(!walkable(cx,cy)) continue;
    if(cy>=NICU.y0) continue;
    if(carts.some(function(c){return c.tx===cx&&c.ty===cy;})) continue;
    const d=Math.hypot((cx+.5)*TILE-player.x,(cy+.5)*TILE-player.y);
    if(d>bd){bd=d;best={x:cx,y:cy};}
  }
  return best||{x:7,y:14};
}
function tidyCarts(){
  // no code running, no reason for a cart to be sitting in the corridor
  if(beds.some(function(b){return b.state==="code";})) return;
  if(events.some(function(e){return e.kind==="od";})) return;
  if(carts.length){ carts=[]; log("Cart's been taken back."); }
}
function spawnCart(){
  const sp=hallSpot();
  carts.push({tx:sp.x,ty:sp.y});
  return carts[carts.length-1];
}
function zombCall(){
  zomb=true; darts=[]; corpses=[];
  // everyone else has already got out — only the turned are left on the unit
  const pool=staff.slice().sort(function(){return Math.random()-0.5;}).slice(0,8);
  staff=pool;
  pool.forEach(function(s2){
    s2.z=true; s2.hp=1; s2.gr=Math.random()*6.28; s2.mode="wander";
    s2.zp=null; s2.zi=1; s2.rep=0; s2.wt=0;
    // none of them start on top of you — put them out across the unit
    for(let k=0;k<120;k++){
      const f=freeTile();
      if(Math.hypot((f.x+.5)*TILE-player.x,(f.y+.5)*TILE-player.y) > TILE*9){
        s2.x=(f.x+.5)*TILE; s2.y=(f.y+.5)*TILE; break;
      }
    }
  });
  events.push({kind:"zomb",t:ZOMB_T,max:ZOMB_T});
  SFX.fail();
  showBanner("IT'S GOING AROUND","zomb",3.6);
  log("Whatever that was, everyone has it now. Tranq gun is in your hands. Go.",true);
}
function endZomb(win2){
  zomb=false; darts=[];
  staff.forEach(function(s2){ s2.z=false; s2.hunt=false; s2.zp=null; s2.path=null; s2.idle=0.4; });
  // everyone who cleared out comes back on shift
  const want=5+level*2;
  if(staff.length<want) spawnStaff(want-staff.length,false);
  for(let i=events.length-1;i>=0;i--) if(events[i].kind==="zomb") events.splice(i,1);
  if(win2){
    SFX.win();
    showBanner("UNIT CLEAR","ok",2.6);
    awardCoins(45);
    log("All down. They'll wake up embarrassed.   +45 coins",true);
    grantPower(POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)]);
  } else {
    showBanner("THEY WORE OFF","fail",2.2);
    log("It passed on its own. Nobody is talking about it.");
  }
}
const RANT_LINES=[
  "I have been sat here FOUR HOURS.",
  "Do you even know who I am?",
  "Nobody has told me anything!",
  "I'll be making a complaint about this.",
  "My cousin is a doctor, you know.",
  "This is a disgrace. An absolute disgrace.",
  "I could have died out here!",
  "Is anyone actually working today?",
  "I've been more use than you lot.",
  "I want your name. Write it down.",
  "I pay your wages, remember that.",
  "You lot don't care. Not one of you."
];
function nivCall(){
  // the machine is somewhere on the unit; the baby is already here
  const f=freeTile();
  niv={tx:f.x, ty:f.y, held:false};
  baby={x:(DELIV.x1)*TILE+TILE/2, y:(DELIV.y0+0.6)*TILE+6,
        on:false, fade:0, ph:Math.random()*6.28};
  events.push({kind:"niv",t:NIV_T,max:NIV_T});
  showBanner("BABY NEEDS NIV","niv",3.6);
  log("Newborn in delivery is working too hard. Find the NIV and get it to the warmer.",true);
}
function endNiv(win2){
  for(let i=events.length-1;i>=0;i--) if(events[i].kind==="niv") events.splice(i,1);
  niv=null; nivP=0;
  if(carry==="niv") carry="";
  if(win2){
    showBanner("SETTLED","ok",2.8);
    awardCoins(35);
    log("Chest settles, sats come up. Somebody exhales.   +35 coins",true);
    grantPower(POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)]);
  } else {
    showBanner("PAEDS TOOK OVER","fail",2.2);
    log("The paediatric team arrived with their own. You will hear about it.");
    if(baby) baby=null;
  }
}
function rantCall(){
  function mk(sx,sy,col){
    return {x:(sx+0.5)*TILE, y:(sy+0.5)*TILE, spot:{x:sx,y:sy},
      face:0, phase:0, moving:false, close:false, path:null, pi:1, rep:Math.random()*0.4,
      hair:HAIR[Math.floor(Math.random()*HAIR.length)],
      skin:SKIN[Math.floor(Math.random()*SKIN.length)], col:col};
  }
  rant={ t:0, said:[], next:0, bubble:null,
    who:[ mk(WAIT.x1, WAIT.y0+4, "#9E4A3A"),
          mk(WAIT.x0, WAIT.y0+2, "#8E5A2E") ] };
  events.push({kind:"rant",t:RANT_T,max:RANT_T});
  showBanner("A WORD, PLEASE","rant",3.6);
  log("Two of them in the waiting room would like to share their thoughts. Stand there and take it.",true);
}
function endRant(win2){
  rant=null; rantP=0;
  for(let i=events.length-1;i>=0;i--) if(events[i].kind==="rant") events.splice(i,1);
  if(win2){
    showBanner("THEY RAN OUT OF STEAM","ok",2.8);
    awardCoins(35); energy=Math.max(4,energy-18);
    log("They said their piece. You said nothing. Correctly.   +35 coins",true);
    grantPower(POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)]);
  } else {
    showBanner("WALKED OFF","fail",2.2);
    log("You left. They've asked for the manager and your name.");
  }
}
function fightCall(){
  const cx=(WAIT.x0+2)*TILE, cy=(WAIT.y0+3)*TILE;
  fight={x:cx,y:cy,t:0,
    a:{x:cx-13,y:cy-4,ph:0,  hair:HAIR[Math.floor(Math.random()*HAIR.length)],
       skin:SKIN[Math.floor(Math.random()*SKIN.length)], col:"#8E4A3A"},
    b:{x:cx+13,y:cy+4,ph:3.1,hair:HAIR[Math.floor(Math.random()*HAIR.length)],
       skin:SKIN[Math.floor(Math.random()*SKIN.length)], col:"#3E5A8E"},
    spot:{x:WAIT.x0+2,y:WAIT.y0+3}};
  events.push({kind:"fight",t:FIGHT_T,max:FIGHT_T});
  showBanner("IT'S KICKED OFF","fight",3.6);
  log("Two visitors going at it in the waiting room. Security is 'on their way'.",true);
}
function endFight(win2){
  const wasAt=fight?{x:fight.x,y:fight.y}:null;
  fight=null; fightP=0;
  for(let i=events.length-1;i>=0;i--) if(events[i].kind==="fight") events.splice(i,1);
  if(win2){
    // you got between them, and you did not come out of it clean
    bleed=9;
    showBanner("BROKEN UP","ok",2.6);
    awardCoins(30);
    log("Split them up. Your lip is bleeding but nobody asks.   +30 coins",true);
    grantPower(POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)]);
  } else {
    showBanner("SECURITY GOT IT","fail",2.2);
    log("Security turned up eventually. You are still doing the paperwork.");
  }
}
function bugCall(){
  const occ=beds.filter(function(b){
    return b.state==="active"||b.state==="code"||b.state==="ready"; });
  const b=occ.length? occ[Math.floor(Math.random()*occ.length)]
                    : beds[Math.floor(Math.random()*beds.length)];
  bugRoom=b.room; bugs=[]; splats=[];
  for(let i=0;i<7;i++){
    for(let k=0;k<40;k++){
      const rx=bugRoom.x0+Math.floor(Math.random()*4);
      const ry=bugRoom.y0+Math.floor(Math.random()*4);
      if(!walkable(rx,ry)) continue;
      bugs.push({x:(rx+0.5)*TILE+(Math.random()-0.5)*16,
                 y:(ry+0.5)*TILE+(Math.random()-0.5)*16,
                 a:Math.random()*6.28, sp:16+Math.random()*20,
                 wig:Math.random()*6.28, turn:0, dead:0});
      break;
    }
  }
  events.push({kind:"bugs",t:BUG_T,max:BUG_T});
  showBanner("BED BUG STOMP","bugs",3.6);
  log("Housekeeping found them in Bed "+bugRoom.id+". Big ones. Stomp the lot.",true);
}
function fireCall(){
  // an empty room, a patient who shouldn't have, and an oxygen line
  const spare=beds.filter(function(b){return b.state==="off"||b.state==="dirty";});
  const b=spare.length? spare[Math.floor(Math.random()*spare.length)]
                      : beds[Math.floor(Math.random()*beds.length)];
  fireRoom=b.room;
  // he is out of bed and on his feet — beside it, not on it
  let sx0=(b.room.bx+0.5)*TILE, sy0=(b.room.by+1.6)*TILE;
  for(let k=0;k<30;k++){
    const rx=b.room.x0+Math.floor(Math.random()*4), ry=b.room.y0+1+Math.floor(Math.random()*3);
    if(walkable(rx,ry)){ sx0=(rx+.5)*TILE; sy0=(ry+.5)*TILE; break; }
  }
  smoker={x:sx0, y:sy0, hp:4, out:false, fade:0,
    face:Math.PI/2, ph:Math.random()*6.28,
    hair:HAIR[Math.floor(Math.random()*HAIR.length)],
    skin:SKIN[Math.floor(Math.random()*SKIN.length)]};
  fires=[{x:smoker.x, y:smoker.y, hp:4, r:15, sm:true}];
  for(let i=0;i<3;i++){
    for(let k=0;k<30;k++){
      const rx=b.room.x0+Math.floor(Math.random()*4), ry=b.room.y0+1+Math.floor(Math.random()*3);
      if(!walkable(rx,ry)) continue;
      if(fires.some(function(f){return Math.abs(f.x-(rx+0.5)*TILE)<20&&Math.abs(f.y-(ry+0.5)*TILE)<20;})) continue;
      fires.push({x:(rx+0.5)*TILE, y:(ry+0.5)*TILE, hp:3, r:12, sm:false});
      break;
    }
  }
  // the extinguisher, on the wall just outside the door
  ext={tx: b.room.side==="L"? 6 : 8, ty: b.room.y0+2};
  // clear any tools out of the room — you shouldn't be reaching into a fire
  for(let i=loose.length-1;i>=0;i--){
    const l=loose[i];
    if(l.tx>=b.room.x0&&l.tx<=b.room.x1&&l.ty>=b.room.y0&&l.ty<=b.room.y1){
      const k=l.key; loose.splice(i,1); placeTool(k);
    }
  }
  events.push({kind:"fire",t:FIRE_T,max:FIRE_T});
  SFX.fail();
  showBanner("SMOKING CESSATION","fire",3.6);
  log("Bed "+b.room.id+" lit one up next to the oxygen. Grab the extinguisher outside.",true);
}
function endBugs(win2){
  bugs=[]; bugRoom=null;
  for(let i=events.length-1;i>=0;i--) if(events[i].kind==="bugs") events.splice(i,1);
  if(win2){
    showBanner("ALL SQUISHED","ok",2.6);
    awardCoins(25);
    log("Every one of them. Somebody get a mop.   +25 coins",true);
    grantPower(POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)]);
  } else {
    showBanner("THEY GOT AWAY","fail",2.2);
    log("They went under the skirting. That's a problem for nights.");
  }
}
function endFire(win2){
  fires=[]; fireRoom=null; ext=null; spray=0;
  if(smoker && !smoker.out){ smoker.out=true; smoker.fade=0; }
  bugs=[]; bugRoom=null; splats=[]; jump=0; jumped=false;
  vendP=0; shopOpen=false; wcDoor=0; closeShop();
  fight=null; fightP=0; bleed=0; drips=[];
  rant=null; rantP=0; rantLine=0;
  niv=null; nivP=0; baby=null;
  if(carry==="ext") carry="";
  for(let i=events.length-1;i>=0;i--) if(events[i].kind==="fire") events.splice(i,1);
  if(win2){
    SFX.win();
    showBanner("ALL OUT","ok",2.6);
    awardCoins(40);
    log("Out. He says he wasn't smoking.   +40 coins",true);
    grantPower(POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)]);
  } else {
    showBanner("THEY GOT IT","fail",2.2);
    log("Somebody else got there first. You'll hear about it.");
  }
}
function highCall(){
  const f=freeTile();
  narcan={tx:f.x,ty:f.y};
  high=1;
  events.push({kind:"high",t:HIGH_T,max:HIGH_T});
  SFX.highOn();
  showBanner("CONTACT HIGH","high",3.6);
  log("You touched something you shouldn't have. Find the narcan kit.",true);
}
function orCall(){
  // recovery is done with them — they're coming to the ward
  const opts=[beds[6],beds[7]].filter(function(b){return b;});
  const dest=opts[Math.floor(Math.random()*opts.length)] || beds[6];
  orPt={stage:"recovery", dest:dest};
  events.push({kind:"ortx",t:ORTX_T,max:ORTX_T});
  showBanner("OR TRANSPORT","ortx",3.6);
  log("Recovery's finished with the post-op. Gown up, collect them and take them to Bed "+
      dest.room.id+".",true);
}
function odCall(){
  spawnCart();
  od={x:(WASH_SPOT.x+1.9)*TILE, y:(WASH.y1+0.5)*TILE, out:0, nurses:[], gone:false};
  events.push({kind:"od",t:OD_T,max:OD_T});
  showBanner("OD IN THE BATHROOM","od",3.6);
  log("Someone's down in the washroom. Grab the crash cart and get down there.",true);
}
function cleanCall(){
  events.push({kind:"clean",t:CLEAN_T,max:CLEAN_T});
  showBanner("NOT MY MESS","clean",3.4);
  log("Nobody knows whose vent that is. Rack all four bays before someone asks again.",true);
}
function completeEvent(kind,pts,msg){
  for(let i=events.length-1;i>=0;i--) if(events[i].kind===kind) events.splice(i,1);
  awardCoins(pts);
  if(PRIZE_EVENTS.indexOf(kind)>=0){
    grantPower(POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)]);
    log(msg+"   +"+pts+" coins",true);
  } else {
    log(msg+"   +"+pts+" coins (survived)",true);
  }
}
function openShop(){
  shopOpen=true;
  const box=document.getElementById("shopBox");
  let carrying='';
  for(let i=0;i<POW_MAX;i++){
    const k=powers[i];
    carrying += k
        ? '<span class="slot" style="border-color:'+POWERS[k].c+'"><img loading="lazy" decoding="async" src="'+powerIcon(k)+'" alt=""></span>'
      : '<span class="slot"></span>';
  }
  let h='<div id="shopHead"><span class="bal">'+coins+' \u25c9</span>'+
        '<h3>VENDING</h3>'+
        '<div class="sub">CARRYING '+powers.length+' / '+POW_MAX+'</div>'+
        '<div id="carry">'+carrying+'</div>'+
        '<div class="sub" style="margin:8px 0 6px">'+SHOP.length+
        ' ITEMS \u00b7 SCROLL FOR MORE</div></div>'+
        '<div id="shopWrap"><div id="shopList">';
  SHOP.forEach(function(it,i){
    const d=POWERS[it.k];
    const have=owned(it.k);
    const afford = !have && coins>=it.cost && (it.perm || powers.length<POW_MAX);
    h+='<div class="item" style="border-color:'+(afford?d.c+"55":"#1B2E36")+'">'+
        '<img loading="lazy" decoding="async" src="'+powerIcon(it.k)+'" alt="">'+
       '<div class="nm"><b style="color:'+d.c+'">'+d.n+'</b><span>'+d.d+'</span></div>'+
       '<button data-buy="'+i+'"'+(afford?"":" disabled")+'>'+
       (have? "OWNED" : it.cost+' \u25c9')+'</button></div>';
  });
  h+='</div></div><div id="shopFoot">';
  if(powers.length>=POW_MAX) h+='<div class="sub" style="color:#C87A6E;margin:6px 0 0">'+
    'RAIL FULL \u00b7 SPEND ONE FIRST</div>';
  h+='<button id="shopClose">BACK TO THE FLOOR</button></div>';
  box.innerHTML=h;
  document.getElementById("shop").className="on";
  Array.prototype.forEach.call(box.querySelectorAll("[data-buy]"),function(bt){
    bt.onclick=function(e){ e.stopPropagation(); buy(parseInt(bt.getAttribute("data-buy"),10)); };
  });
  document.getElementById("shopClose").onclick=function(e){ e.stopPropagation(); closeShop(); };
  SFX.pickup();
}
function closeShop(){
  shopOpen=false;
  const el2=document.getElementById("shop");
  if(el2) el2.className="";
}
function owned(k){ return (k==="PACK"&&packUp)||(k==="TANKUP"&&tankUp); }
function buy(i){
  const it=SHOP[i]; if(!it) return;
  const sl=document.getElementById("shopList");
  const keep=sl?sl.scrollTop:0;
  if(coins<it.cost){ SFX.deny(); return; }
  if(it.perm){
    if(owned(it.k)){ SFX.deny(); return; }
    coins-=it.cost;
    if(it.k==="PACK"){ packUp=true; SLOTS=8; log("Bigger pack. Eight slots now."); }
    else { tankUp=true; EMAX=150; energy=EMAX; warnedE=energyTier();
           log("Deep reserves. You last a lot longer."); }
    packSig=null; SFX.power();
    openShop();
    const sl3=document.getElementById("shopList");
    if(sl3) sl3.scrollTop=keep;
    return;
  }
  if(powers.length>=POW_MAX){ SFX.deny(); log("No room on the rail."); return; }
  coins-=it.cost;
  powers.push(it.k); pwSig=null;
  SFX.can();
  log("Bought "+POWERS[it.k].n+" for "+it.cost+" coins.");
  openShop();                       // refresh the prices and balance
  const sl2=document.getElementById("shopList");
  if(sl2) sl2.scrollTop=keep;
}
function usePower(i){
  const key=powers[i]; if(!key) return;
  powers.splice(i,1);
  if(key==="SPRINT"){ rush=20; prizeRush=true; trail=[];
    showBanner("SECOND WIND","ok",2.2); log("Second wind. Go."); }
  else if(key==="TANK"){ energy=EMAX; warnedE=energyTier(); gearFlash=0.9;
    showBanner("FULL TANK","ok",2.2); log("Full tank."); }
  else if(key==="CALM"){
    swarm=0; shouts=[];
    for(let j=events.length-1;j>=0;j--) if(events[j].kind==="heyrt") events.splice(j,1);
    beds.forEach(function(b){
      if(b.state==="active") b.t=Math.min(b.max,b.t+25);
      else if(b.state==="ready") b.t=Math.min(READY_T,b.t+25);
    });
    showBanner("CHARGE NURSE","ok",2.4); log("Charge nurse cleared the floor. 25 seconds back on every bed.");
  }
  else if(key==="FRIEND"){
    // pick whoever is worst off: a code first, then the tightest clock
    let target=null,worst=1e9;
    beds.forEach(function(b){
      if(b.state==="code"){ if(worst>-1){ target=b; worst=-1; } }
      else if(b.state==="active" && worst>=0){
        const f=b.t/b.max; if(f<worst){ worst=f; target=b; }
      }
    });
    if(!target){ log("Nobody needs covering right now. He'll wait."); powers.push("FRIEND"); return; }
    const from=CHAIR_BAY[0];
    friend={x:(from.x+.5)*TILE, y:(from.y+.5)*TILE, bed:target, path:null, pi:1,
            face:0, phase:0, moving:false, work:0, done:false,
            hair:HAIR[Math.floor(Math.random()*HAIR.length)],
            skin:SKIN[Math.floor(Math.random()*SKIN.length)]};
    showBanner("A FRIEND IS COMING","friend",2.6);
    log("Another RT is on their way to Bed "+target.room.id+". Somebody actually answered.",true);
  }
  else if(key==="DEATH"){
    log("Keep that one. It only helps when it has to.");
    powers.push("DEATH");
    return;
  }
  else if(key==="NARCAN"){
    if(high<=0){ log("Nothing to reverse. Keep it."); powers.push("NARCAN"); return; }
    const ev=events.find(function(e){return e.kind==="high";});
    high=0;
    if(ev){
      const bonus=Math.max(0,Math.round(ev.t*6));
      for(let j=events.length-1;j>=0;j--) if(events[j].kind==="high") events.splice(j,1);
      awardCoins(30+Math.round(bonus/40));
      log("Room stops moving. Nobody needs to know.   +"+(30+Math.round(bonus/40))+" coins",true);
      grantPower(POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)]);
    }
    SFX.highOff();
    showBanner("BACK IN THE ROOM","ok",2.4);
  }
  else if(CAN_BY[key]){
    const cn=CAN_BY[key];
    SFX.rush();
    rush=cn.rush; prizeRush=false; trail=[]; trailCol=cn.c;
    energy=Math.min(EMAX,energy+cn.pct*(EMAX/100)); warnedE=energyTier();
    showBanner(cn.n.toUpperCase(),"ok",2.2);
    log(cn.n+". "+(cn.pct>=100?"Right to the top.":"That'll do for now."),true);
  }
  else if(key==="KIT"){
    const u=tileUnder();
    let target=null;
    beds.forEach(function(b){
      if((b.state==="active")&&Math.hypot(player.x-(b.room.bx+.5)*TILE,
          player.y-(b.room.by+1)*TILE)<TILE*4.5) target=b;
    });
    if(!target) target=beds.find(function(b){return b.state==="active";});
    if(target){
      target.p.need.forEach(function(k){
        if(target.got.indexOf(k)<0 && pack.indexOf(k)<0 && used()+TOOLS[k].s<=SLOTS) pack.push(k);
      });
      showBanner("LOADED KIT","ok",2.2);
      log("Somebody already pulled the kit for Bed "+target.room.id+".");
    }
  }
}
function failEvent(e,msg){
  SFX.fail();
  log(msg);
  showBanner("MISSED IT","fail",2.2);
}
function relapse(b){
  // back into care, one step behind, and it no longer counts as a save
  levelHadRelapse=true;
  savedCount=Math.max(0,savedCount-1);
  b.stage=Math.max(0,b.stage-1);
  const st=b.plan[b.stage];
  b.got=[]; b.state="active"; b.warned=false;
  b.p.need=st.need.slice(); b.p.note=st.note; b.p.sn=st.n;
  b.max=Math.round(110*(1-Math.min(.24,(level-1)*0.04)));
  b.t=b.max;
  b.p.need.forEach(function(k){ placeTool(k); });
  sel=beds.indexOf(b); selLock=5; buildStrip();
  log("BED "+b.room.id+" RELAPSED. Nobody moved him and he went off again.",true);
}
function startCode(b){
  levelHadCode=true;
  if(music) music.codeBlue();
  b.state="code"; b.t=CODE_T; b.max=CODE_T; codeBed=b;
  sel=beds.indexOf(b); selLock=5;
  spawnCart();                       // one cart per code, always in the hallway
  spawnStaff(9,true);
  SFX.code();
  log("CODE BLUE, BED "+b.room.id+". Find the crash cart.",true);
}
function tryMorgue(){
  if(carry) return false;
  const u=tileUnder();
  for(let i=0;i<mcarts.length;i++){
    if(mcarts[i].tx===u.x&&mcarts[i].ty===u.y){
      mcartFull=!!mcarts[i].full;
      mcarts.splice(i,1); carry="mcart";
      log(mcartFull ? "Somebody is on this one. Mind how you go."
                    : "Morgue trolley. Heavier than it looks.");
      return true;
    }
  }
  return false;
}
function dropMorgue(){
  if(carry!=="mcart") return false;
  const u=tileUnder();
  if(!walkable(u.x,u.y)) return false;
  if(mcarts.some(function(c){return c.tx===u.x&&c.ty===u.y;})) return false;
  mcarts.push({tx:u.x,ty:u.y,full:mcartFull}); carry="";
  log(mcartFull ? "Parked. Somebody will come for them." : "Trolley parked.");
  mcartFull=false;
  return true;
}
function tryCart(){
  if(carry||!carts.length) return false;
  const u=tileUnder();
  for(let i=0;i<carts.length;i++){
    if(carts[i].tx===u.x&&carts[i].ty===u.y){
      carts.splice(i,1); carry="cart";
      log("Got the cart. Now get through this crowd.");
      return true;
    }
  }
  return false;
}
function tryChair(){
  if(carry) return false;
  const u=tileUnder();
  for(let i=0;i<chairs.length;i++){
    if(chairs[i].tx===u.x&&chairs[i].ty===u.y){
      chairs.splice(i,1); carry="chair";
      log("Wheelchair. Now go collect him.");
      return true;
    }
  }
  return false;
}
function tryEquip(){
  if(carry) return false;
  const u=tileUnder();
  for(let i=0;i<eqLoose.length;i++){
    if(eqLoose[i].tx===u.x&&eqLoose[i].ty===u.y){
      eqCarry=eqLoose.splice(i,1)[0].t; carry="equip";
      log("Hauling the "+eqCarry.n.toLowerCase()+". Heavy.");
      return true;
    }
  }
  // also lift one back off a parked spot
  for(let i=0;i<eqParked.length;i++){
    if(eqParked[i].tx===u.x&&eqParked[i].ty===u.y){
      eqCarry=eqParked.splice(i,1)[0].t; carry="equip";
      return true;
    }
  }
  return false;
}
function dropEquip(){
  if(carry!=="equip") return false;
  const u=tileUnder();
  if(!walkable(u.x,u.y)) return false;
  if(eqParked.some(function(e){return e.tx===u.x&&e.ty===u.y;})) return false;
  // standing on a free bay? that's a rack, not a drop
  for(let i=0;i<EQ_SPOTS.length;i++){
    if(EQ_SPOTS[i].x===u.x&&EQ_SPOTS[i].y===u.y){ parkEquip(EQ_SPOTS[i]); return true; }
  }
  if(eqLoose.some(function(e){return e.tx===u.x&&e.ty===u.y;})) return false;
  eqLoose.push({tx:u.x,ty:u.y,t:eqCarry}); eqCarry=null; carry="";
  return true;
}
function parkEquip(spot){
  eqParked.push({tx:spot.x,ty:spot.y,t:eqCarry});
  eqCarry=null; carry=""; SFX.rack();
  const n=eqParked.length;
  if(n>=EQ_SPOTS.length){
    awardPrize();
  } else {
    log("Racked. "+n+" of "+EQ_SPOTS.length+" bays filled.");
  }
}
function awardPrize(){
  eqParked=[]; prizeGiven++;
  energy=EMAX; warnedE=energyTier();
  rush=PRIZE_RUSH; prizeRush=true; trail=[]; trailCol="#8FE04A";
  const ev=events.find(function(e){return e.kind==="clean";});
  if(ev){
    const bonus=Math.max(0,Math.round(ev.t*6));
    for(let i=events.length-1;i>=0;i--) if(events[i].kind==="clean") events.splice(i,1);
    awardCoins(30+Math.round(bonus/40));
    log("ALL FOUR BAYS CLEAN. Nobody asks again.   +"+(30+Math.round(bonus/40))+" coins",true);
  } else {
    awardCoins(20);
    log("ALL FOUR BAYS CLEAN. Full tank and a clear unit — go.   +20 coins",true);
  }
  grantPower("FRIEND");
}
function dropChair(){
  if(carry!=="chair") return false;
  const u=tileUnder();
  if(!walkable(u.x,u.y)) return false;
  if(chairs.some(function(c){return c.tx===u.x&&c.ty===u.y;})) return false;
  chairs.push({tx:u.x,ty:u.y}); carry="";
  log("Chair parked.");
  return true;
}
function chairOn(x,y){
  for(let i=0;i<chairs.length;i++) if(chairs[i].tx===x&&chairs[i].ty===y) return i;
  return -1;
}
function loadPatient(b){
  if(carry!=="chair"){                     // loading from a chair parked on the zone
    const i=chairOn(b.room.dx,b.room.dy);
    if(i<0) return;
    chairs.splice(i,1);
  }
  carry="patient"; carryBed=b;
  b.state="off"; b.active=false; b.p=null; b.got=[]; b.plan=null;
  b.arrive = (admitted<quota) ? 3.5+Math.random()*3 : -1;
  log("Bed "+b.room.id+" in the chair. Waiting room is bottom left.");
  buildStrip();
}
function dischargePatient(){
  SFX.discharge();
  // the room they left is now a dirty room, with their equipment still in it
  const rb=carryBed;
  if(rb){
    const ty=EQ_TYPES[Math.floor(Math.random()*EQ_TYPES.length)];
    const L=rb.room.side==="L";
    eqLoose.push({tx: L?rb.room.x0:rb.room.x1, ty: rb.room.y0+1, t:ty, room:rb.room.id});
    rb.state="dirty"; rb.arrive=0; rb.mess=seedMess(rb.room);
    log("Bed "+rb.room.id+" is empty and filthy. Pull the "+ty.n.toLowerCase()+" out.");
  }
  carry=""; carryBed=null; discharged++; totalDischarged++;
  chairs.push({tx:CHAIR_BAY[Math.floor(Math.random()*CHAIR_BAY.length)].x,
               ty:CHAIR_BAY[Math.floor(Math.random()*CHAIR_BAY.length)].y});
  log("Discharged. "+discharged+" of "+quota+" out the door.");
  if(discharged>=quota) win();
}
function codeResolved(b){
  levelCodesSurvived++;
  if(music) music.rosc();
  b.state="active"; b.t=b.max; carry="";
  codeBed=beds.find(function(x){return x.state==="code";})||null;
  chairs.push({tx:CHAIR_BAY[0].x,ty:CHAIR_BAY[0].y});
  tidyCarts();
  staff=staff.filter(function(s){return s.mode!=="rush";});
  const st=b.plan[b.stage];
  b.got=[]; b.p.need=st.need.slice(); b.p.note=st.note; b.p.sn=st.n;
  SFX.win();
  log("ROSC in Bed "+b.room.id+". Back from the brink — care resumes.",true);
}

/* ================= UPDATE ================= */
function update(dt){
  if(shopOpen) return;
  t+=dt; move(dt);
  for(let i=0;i<staff.length;i++) updateStaff(staff[i],dt);
  if(!zomb) for(let i=0;i<cleaners.length;i++) updateCleaner(cleaners[i],dt);
  // families pacing the waiting room
  if(!zomb) for(let i=0;i<pacers.length;i++){
    const q=pacers[i];
    q.wt-=dt;
    if(q.wt<=0 || !q.path || q.pi>=q.path.length){
      q.wt=2.5+Math.random()*4;
      for(let k=0;k<20;k++){
        const rx=WAIT.x0+Math.floor(Math.random()*4);
        const ry=WAIT.y0+1+Math.floor(Math.random()*6);
        if(!walkable(rx,ry)) continue;
        if(rx===DISCHARGE.x&&ry===DISCHARGE.y) continue;
        q.path=path(Math.floor(q.x/TILE),Math.floor(q.y/TILE),rx,ry); q.pi=1; break;
      }
      q.moving=false;
      continue;
    }
    const wp=q.path[q.pi], wx=(wp[0]+.5)*TILE, wy=(wp[1]+.5)*TILE;
    const dx2=wx-q.x, dy2=wy-q.y, d2=Math.hypot(dx2,dy2);
    if(d2<3){ q.pi++; q.moving=false; }
    else{
      q.face=Math.atan2(dy2,dx2);
      q.x+=dx2/d2*q.sp*dt; q.y+=dy2/d2*q.sp*dt;
      q.moving=true; q.phase+=dt*(q.sp*0.17);
    }
  }
  // and the parents shift their weight at the glass

  ensureNeeds();

  flavorT-=dt;
  if(flavorT<=0){ log(FLAVOR[Math.floor(Math.random()*FLAVOR.length)]); flavorT=20+Math.random()*14; }

  for(let i=0;i<fx.length;i++) fx[i].t+=dt;
  fx=fx.filter(function(f){return f.t<f.d;});

  // a patient waiting too long for their ride slides backwards
  for(let i=0;i<beds.length;i++){
    const b=beds[i];
    if(b.state!=="ready") continue;
    b.t-=dt;
    if(!b.warned && b.t<=READY_T*0.34){
      b.warned=true;
      log("Bed "+b.room.id+" has been sitting too long. He's slipping.",true);
    }
    if(b.t<=0) relapse(b);
  }

  for(let i=0;i<beds.length;i++){
    const b=beds[i];
    if(b.state!=="active"&&b.state!=="code") continue;
    b.t-=dt;
    if(b.state==="active"&&b.t<=0){ startCode(b); }
    else if(b.state==="code"&&b.t<=0){ lose(b); return; }
  }

  // bed refills once a room empties and the quota still has patients
  for(let i=0;i<beds.length;i++){
    const b=beds[i];
    if(b.state==="dirty"){
      const stillThere=eqLoose.some(function(e){return e.room===b.room.id;});
      if(!stillThere){
        b.state="off"; b.mess=null;
        b.arrive=(admitted<quota)? 3+Math.random()*2.5 : -1;
        log("Bed "+b.room.id+" — equipment out, housekeeping can finally finish.");
        buildStrip();
      }
    } else if(b.state==="off" && b.arrive>0){
      b.arrive-=dt;
      if(b.arrive<=0 && admitted<quota){ admit(b); buildStrip(); }
    }
  }

  boost=Math.max(0,boost-dt);
  gearFlash=Math.max(0,gearFlash-dt);

  // ---- the unit's own noise ----
  // each occupied bed beeps at its own rate; the worse they are, the faster
  let worst=1;
  for(let i=0;i<beds.length;i++){
    const b=beds[i];
    if(b.state!=="active"&&b.state!=="code") continue;
    const f=Math.max(0,Math.min(1,b.t/b.max));
    worst=Math.min(worst,f);
    b.bt=(b.bt||Math.random())-dt;
    if(b.bt<=0){
      b.bt = b.state==="code" ? 0.42 : 1.05-(1-f)*0.55;
      // only beds near enough to hear
      if(Math.hypot((b.room.bx+.5)*TILE-player.x,(b.room.by+1)*TILE-player.y) < TILE*9)
        SFX.monitorBeep(f);
    }
    // and the vent complains when they slip
    b.at=(b.at||2+Math.random()*3)-dt;
    if(b.at<=0){
      b.at=3.2+Math.random()*2.4;
      if(f<0.24 && b.state==="active"){
        const which=(b.room.id+Math.floor(t/7))%3;
        if(which===0) SFX.alarmHigh(); else if(which===1) SFX.alarmLow(); else SFX.alarmApnea();
      }
    }
  }
  SFX.tension(1-worst);
  eventT=Math.max(0,eventT-dt);

  // ---- black cloud events ----
  // a patient counts as "in the zone" once their first care step lands,
  // right up until they're wheeled off the unit
  const inZone=beds.filter(function(b){
    return (b.state==="active"||b.state==="ready") && b.stage>0;
  }).length;

  evRoll-=dt;
  if(evRoll<=0 && inZone>0 && !cloudUsed){
    evRoll=5+Math.random()*7;
    if(Math.random()<0.55){ cloudUsed=true; musicCloudActive=true; if(music) music.blackCloud(); startEvent(); }
  }
  if(inZone===0 && events.length){
    events.forEach(function(e){ if(e.kind==="party") failEvent(e,"The cake went uneaten."); });
    events=events.filter(function(e){ return e.kind!=="party"; });
  }

  // tick the live events
  for(let i=events.length-1;i>=0;i--){
    const e=events[i];
    e.t-=dt;
    if(e.kind==="party"){
      if(e.t<=0){ failEvent(e,"You missed the whole thing. Again."); events.splice(i,1); }
    } else if(e.kind==="zomb"){
      if(e.t<=0) endZomb(false);
    } else if(e.kind==="niv"){
      if(e.t<=0) endNiv(false);
    } else if(e.kind==="rant"){
      if(e.t<=0) endRant(false);
    } else if(e.kind==="fight"){
      if(e.t<=0) endFight(false);
    } else if(e.kind==="bugs"){
      if(e.t<=0) endBugs(false);
    } else if(e.kind==="fire"){
      if(e.t<=0) endFire(false);
    } else if(e.kind==="high"){
      if(e.t<=0){
        events.splice(i,1); high=0; narcan=null;
        for(let j=powers.length-1;j>=0;j--) if(powers[j]==="NARCAN") powers.splice(j,1);
        failEvent(e,"It wore off eventually. You are not going to mention this.");
      }
    } else if(e.kind==="ortx"){
      if(e.t<=0){
        events.splice(i,1); orPt=null;
        if(carry==="orpatient") carry="";
        failEvent(e,"Somebody else walked them down. You'll hear about it.");
      }
    } else if(e.kind==="od"){
      if(e.t<=0){
        events.splice(i,1); od=null;
        failEvent(e,"They found him before you did. Nobody says anything about it.");
      }
    } else if(e.kind==="clean"){
      if(e.t<=0){
        events.splice(i,1);
        failEvent(e,"Someone asked again. The vent is still there.");
      }
    } else if(e.kind==="heyrt"){
      if(e.t<=0){
        swarm=0; shouts=[];
        showBanner("THEY'VE GONE","ok",2.2);
        completeEvent("heyrt",12,"They all wandered off. Nothing was resolved.");
      }
    }
  }
  if(musicCloudActive && events.length===0){ musicCloudActive=false; if(music) music.clearCloud(); }

  // the OD being carried off the unit
  if(od && od.out>0){
    od.out+=dt;
    od.nurses.forEach(function(n){
      const tx2=od.x+(n.ph?18:-18), ty2=od.y;
      const dx2=tx2-n.x, dy2=ty2-n.y, d2=Math.hypot(dx2,dy2);
      if(od.out<2.2){ if(d2>2){ n.x+=dx2/d2*70*dt; n.y+=dy2/d2*70*dt; } }
      else { n.y-=52*dt; n.x+=(7.5*TILE-n.x)*dt*1.4; }
    });
    if(od.out>2.2){ od.y-=52*dt; od.x+=(7.5*TILE-od.x)*dt*1.4; }
    if(od.out>8){ od=null; }
  }

  // a colleague crossing the unit to cover a bed
  if(friend){
    const fb=friend.bed;
    if(!fb || (fb.state!=="active"&&fb.state!=="code")){
      friend=null;
    } else {
      const gx=(fb.room.dx+.5)*TILE, gy=(fb.room.dy+.5)*TILE;
      const d=Math.hypot(gx-friend.x, gy-friend.y);
      if(d<4){
        friend.moving=false;
        friend.work+=dt;
        if(friend.work>=1.6 && !friend.done){
          friend.done=true;
          if(fb.state==="code"){
            codeResolved(fb);
            log("He bagged Bed "+fb.room.id+" while you were elsewhere. You owe him.",true);
          } else {
            fb.p.need.forEach(function(k){ if(fb.got.indexOf(k)<0) fb.got.push(k); });
            deliverFinish(fb);
            log("He covered the step on Bed "+fb.room.id+". You owe him.",true);
          }
        }
        if(friend.work>2.6) friend=null;
      } else {
        if(!friend.path||friend.pi>=friend.path.length){
          friend.path=path(Math.floor(friend.x/TILE),Math.floor(friend.y/TILE),fb.room.dx,fb.room.dy);
          friend.pi=1;
          if(!friend.path||friend.path.length<2){ friend.x=gx; friend.y=gy; friend.path=null; }
        } else {
          const wp=friend.path[friend.pi], wx=(wp[0]+.5)*TILE, wy=(wp[1]+.5)*TILE;
          const dx2=wx-friend.x, dy2=wy-friend.y, dd=Math.hypot(dx2,dy2);
          if(dd<2.5) friend.pi++;
          else{ friend.face=Math.atan2(dy2,dx2);
                friend.x+=dx2/dd*168*dt; friend.y+=dy2/dd*168*dt;
                friend.moving=true; friend.phase+=dt*26; }
        }
      }
    }
  }

  // ---- the infected shamble toward you ----
  if(zomb){
    for(let i=0;i<staff.length;i++){
      const z=staff[i]; if(!z.z) continue;
      const dx2=player.x-z.x, dy2=player.y-z.y, d2=Math.hypot(dx2,dy2);
      z.gr+=dt*2.2;
      // they don't notice you until you're close — then they don't stop
      if(d2<ZOMB_AGGRO) z.hunt=true;
      else if(d2>ZOMB_AGGRO*2.1) z.hunt=false;

      if(!z.hunt){
        // aimless shuffling round the unit
        z.wt-=dt;
        if(z.wt<=0 || !z.zp || z.zi>=z.zp.length){
          z.wt=3+Math.random()*4;
          const f=freeTile();
          z.zp=path(Math.floor(z.x/TILE),Math.floor(z.y/TILE),f.x,f.y);
          z.zi=1;
        }
        if(z.zp && z.zi<z.zp.length){
          const wp=z.zp[z.zi], wx=(wp[0]+.5)*TILE, wy=(wp[1]+.5)*TILE;
          const ax3=wx-z.x, ay3=wy-z.y, ad3=Math.hypot(ax3,ay3)||1;
          if(ad3<3) z.zi++;
          else{
            const st3=ZOMB_WALK*dt;
            if(npcWalkable(Math.floor((z.x+ax3/ad3*st3)/TILE),Math.floor(z.y/TILE))) z.x+=ax3/ad3*st3;
            if(npcWalkable(Math.floor(z.x/TILE),Math.floor((z.y+ay3/ad3*st3)/TILE))) z.y+=ay3/ad3*st3;
            z.face=Math.atan2(ay3,ax3);
            z.moving=true; z.phase=(z.phase||0)+dt*4;
          }
        }
        continue;
      }

      if(d2>20){
        const step=s2sp(z)*dt;
        let tx2=player.x, ty2=player.y;
        if(d2>TILE*1.6){
          // they can smell you through walls — proper pathing round the unit
          z.rep=(z.rep||0)-dt;
          if(z.rep<=0 || !z.zp || z.zi>=z.zp.length){
            z.rep=0.45+Math.random()*0.3;
            z.zp=path(Math.floor(z.x/TILE),Math.floor(z.y/TILE),
                      Math.floor(player.x/TILE),Math.floor(player.y/TILE));
            z.zi=1;
          }
          if(z.zp && z.zi<z.zp.length){
            const wp=z.zp[z.zi];
            tx2=(wp[0]+.5)*TILE; ty2=(wp[1]+.5)*TILE;
            if(Math.hypot(tx2-z.x,ty2-z.y)<3) z.zi++;
          }
        }
        const ax2=tx2-z.x, ay2=ty2-z.y, ad=Math.hypot(ax2,ay2)||1;
        const vx=ax2/ad*step+Math.cos(z.gr)*0.4;
        const vy=ay2/ad*step+Math.sin(z.gr)*0.4;
        if(npcWalkable(Math.floor((z.x+vx)/TILE),Math.floor(z.y/TILE))) z.x+=vx;
        if(npcWalkable(Math.floor(z.x/TILE),Math.floor((z.y+vy)/TILE))) z.y+=vy;
        z.moving=true; z.phase=(z.phase||0)+dt*11;
      } else { z.moving=false; energy=Math.max(0,energy-dt*7); }
      z.face=Math.atan2(dy2,dx2); z.path=null; z.idle=0;
    }
    // darts in flight
    shotCD=Math.max(0,shotCD-dt);
    for(let i=darts.length-1;i>=0;i--){
      const d=darts[i];
      d.x+=Math.cos(d.a)*520*dt; d.y+=Math.sin(d.a)*520*dt; d.life-=dt;
      let hit=false;
      for(let j=0;j<staff.length;j++){
        const z=staff[j]; if(!z.z) continue;
        if(Math.hypot(d.x-z.x,d.y-z.y)<15){
          z.hp-=1; hit=true;
          SFX.zombHit();
          if(z.hp<=0){
            corpses.push({x:z.x,y:z.y,a:z.face,t:0});
            staff.splice(j,1);
          }
          break;
        }
      }
      if(hit||d.life<=0||!walkable(Math.floor(d.x/TILE),Math.floor(d.y/TILE))) darts.splice(i,1);
    }
    for(let i=0;i<corpses.length;i++) corpses[i].t+=dt;
    if(!staff.some(function(z){return z.z;})) endZomb(true);
  }

  // ---- bed bugs ----
  if(jump>0){
    jump-=dt;
    if(jump<=0 && !jumped){
      jumped=true;
      let got=0;
      for(let i=bugs.length-1;i>=0;i--){
        const bg=bugs[i];
        if(bg.dead) continue;
        if(Math.hypot(bg.x-player.x,bg.y-player.y)<STOMP_R){
          bg.dead=0.01; got++;
          // it goes everywhere
          const bits=[];
          for(let k=0;k<16;k++){
            const a2=Math.random()*6.283, d2=2+Math.random()*15;
            bits.push({x:bg.x+Math.cos(a2)*d2, y:bg.y+Math.sin(a2)*d2,
                       r:1+Math.random()*3.4, rot:Math.random()*3.14,
                       sx:0.6+Math.random()*1.1});
          }
          splats.push({x:bg.x,y:bg.y,a:bg.a,t:0,bits:bits,
                       r:7+Math.random()*4});
        }
      }
      if(got){
        SFX.zombHit(); SFX.rack();
        const left=bugs.filter(function(q){return !q.dead;}).length;
        if(!left) endBugs(true);
        else log(got>1? got+" at once. Nice.":"Got one. "+left+" to go.");
      } else { SFX.deny(); }
    }
  }
  for(let i=bugs.length-1;i>=0;i--){
    const bg=bugs[i];
    if(bg.dead){ bg.dead+=dt; if(bg.dead>0.5) bugs.splice(i,1); continue; }
    // scuttle, pause, change their mind
    bg.wig+=dt*14;
    bg.turn-=dt;
    if(bg.turn<=0){ bg.turn=0.4+Math.random()*1.1; bg.a+=(Math.random()-0.5)*2.4; }
    // and they scatter when you land near them
    const pd=Math.hypot(bg.x-player.x,bg.y-player.y);
    let sp=bg.sp;
    if(pd<52){ bg.a=Math.atan2(bg.y-player.y,bg.x-player.x); sp=bg.sp*2.4; }
    const nx=bg.x+Math.cos(bg.a)*sp*dt, ny=bg.y+Math.sin(bg.a)*sp*dt;
    const inRoom = bugRoom && nx>bugRoom.x0*TILE+4 && nx<(bugRoom.x1+1)*TILE-4
                           && ny>bugRoom.y0*TILE+4 && ny<(bugRoom.y1+1)*TILE-4;
    if(inRoom && walkable(Math.floor(nx/TILE),Math.floor(ny/TILE))){ bg.x=nx; bg.y=ny; }
    else bg.a+=2.2;
  }
  for(let i=0;i<splats.length;i++) splats[i].t+=dt;
  splats=splats.filter(function(sp2){ return sp2.t<14; });

  // ---- the fire ----
  fires.forEach(function(f){ f.fl=(f.fl||0)+dt; });
  if(smoker){
    if(!smoker.out){
      // running about while alight, which never helps
      smoker.wt=(smoker.wt||0)-dt;
      if(!smoker.tgt || smoker.wt<=0){
        smoker.wt=0.7+Math.random()*0.8;
        for(let k=0;k<24;k++){
          const rx=fireRoom.x0+Math.floor(Math.random()*4);
          const ry=fireRoom.y0+1+Math.floor(Math.random()*3);
          if(!walkable(rx,ry)) continue;
          smoker.tgt={x:(rx+.5)*TILE, y:(ry+.5)*TILE}; break;
        }
      }
      if(smoker.tgt){
        const ax=smoker.tgt.x-smoker.x, ay=smoker.tgt.y-smoker.y;
        const ad=Math.hypot(ax,ay)||1;
        if(ad<5) smoker.tgt=null;
        else{
          const st=58*dt;
          smoker.face=Math.atan2(ay,ax);
          const nx=smoker.x+ax/ad*st, ny=smoker.y+ay/ad*st;
          if(walkable(Math.floor(nx/TILE),Math.floor(smoker.y/TILE))) smoker.x=nx;
          if(walkable(Math.floor(smoker.x/TILE),Math.floor(ny/TILE))) smoker.y=ny;
        }
      }
      // the fire on him follows him round the room
      const own=fires.find(function(f){return f.sm;});
      if(own){ own.x=smoker.x; own.y=smoker.y; }
    } else {
      smoker.fade+=dt;
      smoker.y-=14*dt;                 // he sees himself out
      if(smoker.fade>3.5) smoker=null;
    }
  }
  if(spray>0) spray=Math.max(0,spray-dt);   // always winds down, fires or not

  // everybody converges on the RT while it lasts
  if(swarm>0){
    swarm-=dt;
    for(let i=0;i<staff.length;i++){
      const s2=staff[i];
      const dx2=player.x-s2.x, dy2=player.y-s2.y, d2=Math.hypot(dx2,dy2);
      if(d2>26){
        s2.face=Math.atan2(dy2,dx2);
        const step=s2.sp*1.25*dt;
        const nx=s2.x+dx2/d2*step, ny=s2.y+dy2/d2*step;
        if(npcWalkable(Math.floor(nx/TILE),Math.floor(ny/TILE))){ s2.x=nx; s2.y=ny; }
        s2.moving=true; s2.phase=(s2.phase||0)+dt*(s2.sp*0.2);
        s2.path=null; s2.idle=0;
      } else { s2.moving=false; s2.face=Math.atan2(dy2,dx2); }
    }
    // speech bubbles popping up around you
    if(Math.random()<dt*2.6 && shouts.length<5){
      const src=staff[Math.floor(Math.random()*staff.length)];
      if(src){
        const lanes=[-70,-38,-6,26,58,90];
        const used2=shouts.map(function(q){return q.lane;});
        const open2=lanes.filter(function(l){return used2.indexOf(l)<0;});
        if(open2.length){
          shouts.push({x:src.x, y:src.y-24, lane:open2[Math.floor(Math.random()*open2.length)],
                       txt:(function(){
                         const live=shouts.map(function(q){return q.txt;});
                         const free=HEY_LINES.filter(function(l){return live.indexOf(l)<0;});
                         const pool=free.length?free:HEY_LINES;
                         return pool[Math.floor(Math.random()*pool.length)];
                       })(),
                       life:1.9, rise:0});
        }
      }
    }
  }
  for(let i=shouts.length-1;i>=0;i--){
    shouts[i].life-=dt; shouts[i].rise+=dt*9;
    if(shouts[i].life<=0) shouts.splice(i,1);
  }
  bannerT=Math.max(0,bannerT-dt);
  dance=Math.max(0,dance-dt);
  // confetti keeps shaking loose as you walk it back to the unit
  if(confetti>0){
    confetti-=dt;
    if(moving && Math.random()<dt*26 && streamers.length<70){
      streamers.push({x:player.x+(Math.random()-0.5)*20,
                      y:player.y+(Math.random()-0.5)*16,
                      vy:26+Math.random()*40, ph:Math.random()*6.28,
                      rot:Math.random()*6.28, spin:(Math.random()-0.5)*8,
                      w:2.2+Math.random()*2.8, h:5+Math.random()*7,
                      c:["#F2C94D","#E0544A","#4A9CE0","#8FE04A","#B57FD1","#F28FB4"][
                          Math.floor(Math.random()*6)],
                      life:1.1+Math.random()*1.1});
    }
  }
  for(let i=streamers.length-1;i>=0;i--){
    const st=streamers[i];
    st.y+=st.vy*dt; st.x+=Math.sin(t*3+st.ph)*22*dt; st.rot+=st.spin*dt; st.life-=dt;
    if(st.life<=0) streamers.splice(i,1);
  }

  // ---- somebody nearby says something ----
  if(!zomb){
    chatT-=dt;
    if(chat){ chat.life-=dt; if(chat.life<=0) chat=null; }
    if(chatT<=0 && !chat && !rant){
      chatT=5+Math.random()*7;
      // everyone who could plausibly be overheard
      const pool=[];
      staff.forEach(function(o){ if(!o.z) pool.push(o); });
      cleaners.forEach(function(o){ pool.push(o); });
      desked.forEach(function(o){ pool.push(o); });
      pacers.forEach(function(o){ pool.push(o); });
      if(reception) pool.push(reception);
      const near=pool.filter(function(o){
        return Math.hypot(o.x-player.x,o.y-player.y) < TILE*7; });
      if(near.length){
        const who2=near[Math.floor(Math.random()*near.length)];
        const free=CHATTER.filter(function(l){return chatSaid.indexOf(l)<0;});
        const list=free.length?free:(chatSaid=[],CHATTER);
        const line=list[Math.floor(Math.random()*list.length)];
        chatSaid.push(line);
        chat={on:who2, txt:line, life:3.2};
      }
    }
  } else { chat=null; }

  // the electrician: find him, then lead him to the box
  if(spark && !spark.done){
    const d3=Math.hypot(player.x-spark.x, player.y-spark.y);
    if(!spark.found && d3<30){
      spark.found=true;
      showBanner("FOUND HIM","ok",2.0);
      log("\u201cRight. Where\u2019s the panel then?\u201d Lead the way.",true);
    }
    if(spark.found){
      // once you are at the panel he goes to it rather than to you
      const boxX=(ELEC.x+.5)*TILE, boxY=(ELEC.y+1.2)*TILE;
      const youAtBox=Math.hypot(player.x-boxX,player.y-boxY)<TILE*2;
      const goX = youAtBox? boxX : player.x;
      const goY = youAtBox? boxY : player.y;
      const stop = youAtBox? 8 : 34;
      const dgo=Math.hypot(goX-spark.x, goY-spark.y);
      if(dgo>stop){
        spark.rep-=dt;
        if(spark.rep<=0 || !spark.path || spark.pi>=spark.path.length){
          spark.rep=0.5;
          spark.path=path(Math.floor(spark.x/TILE),Math.floor(spark.y/TILE),
                          Math.floor(goX/TILE),Math.floor(goY/TILE));
          spark.pi=1;
        }
        let tx3=goX, ty3=goY;
        if(spark.path && spark.pi<spark.path.length){
          const wp=spark.path[spark.pi];
          tx3=(wp[0]+.5)*TILE; ty3=(wp[1]+.5)*TILE;
          if(Math.hypot(tx3-spark.x,ty3-spark.y)<3) spark.pi++;
        }
        const ax=tx3-spark.x, ay=ty3-spark.y, ad=Math.hypot(ax,ay)||1;
        const st=Math.min(96,52+dgo*0.5)*dt;
        if(walkable(Math.floor((spark.x+ax/ad*st)/TILE),Math.floor(spark.y/TILE))) spark.x+=ax/ad*st;
        if(walkable(Math.floor(spark.x/TILE),Math.floor((spark.y+ay/ad*st)/TILE))) spark.y+=ay/ad*st;
        spark.face=Math.atan2(ay,ax); spark.moving=true; spark.phase+=dt*9;
      } else spark.moving=false;
      // at the panel with you, he gets on with it
      const atBox = youAtBox && Math.hypot(spark.x-boxX, spark.y-boxY)<TILE*1.4;
      if(atBox){
        sparkP+=dt;
        if(sparkP>=SPARK_T){
          sparkP=0; spark.done=true; spark.doneT=0;
          blackout=0; preFlick=0; postFlick=1.6;
          showBanner("POWER RESTORED","ok",2.5);
          SFX.powerBack(); SFX.blackout(false);
          completeEvent("power",15,"Breaker reset. He mutters something about the wiring.");
        }
      } else sparkP=Math.max(0,sparkP-dt);
    }
  }
  if(spark && spark.done){ spark.doneT+=dt; if(spark.doneT>6) spark=null; }

  // power struggling before it drops
  if(preFlick>0){
    preFlick-=dt;
    if(preFlick<=0){
      blackout=1; blackoutFrom=energy;
      eventName="POWER LOSS"; eventT=3.5; SFX.blackout(true);
      log("And there it goes. Emergency lighting only.",true);
    }
  }
  if(postFlick>0) postFlick-=dt;

  // power cut runs until a quarter of the tank has burned off

  if(rush>0){
    rush-=dt;
    trail.push({x:player.x,y:player.y,a:1});
    if(trail.length>26) trail.shift();
    if(rush<=0){
      if(prizeRush){ prizeRush=false; log("Back to walking pace."); }
      else { log("Crash. That was the caffeine leaving."); energy=Math.max(6,energy-14); }
    }
  } else if(trail.length) trail.shift();
  for(let i=0;i<trail.length;i++) trail[i].a-=dt*1.5;
  trail=trail.filter(function(q){return q.a>0;});
  // energy: a shift wears you down, and hauling wears you down faster
  var drain = moving ? 0.50 : 0.17;
  if(carry==="patient"||carry==="cart") drain*=1.5;
  else if(carry==="chair") drain*=1.2;
  energy=Math.max(0,energy-drain*dt);
  const tier=energyTier();
  if(tier!==warnedE){
    if(tier>warnedE){
      log(["","Three quarters left. Starting to feel it.",
             "Half a tank. You're noticeably slower.",
             "Quarter left. You're trudging — go find the coffee."][tier], tier>=2);
      gearFlash=0.9;
    }
    warnedE=tier;
  }

  let bed=null, readyBed=null;
  for(let i=0;i<beds.length;i++){
    const b=beds[i];
    if(!onDrop(b)) continue;
    if(b.state==="active"||b.state==="code") bed=b;
    else if(b.state==="ready") readyBed=b;
  }
  const u=tileUnder();
  const onDisch = (u.x===DISCHARGE.x&&u.y===DISCHARGE.y);
  const onCoffee= (u.x===COFFEE.x&&u.y===COFFEE.y);

  // ---- holds ----
  if(actHeld && bed){
    if(bed.state==="code"){
      if(carry==="cart"){ dropP+=dt; if(dropP>=CART_T){ dropP=0; codeResolved(bed); } }
      else dropP=0;
    } else { dropP+=dt; if(dropP>=DROP_T){ dropP=0; deliver(bed); } }
  } else if(actHeld && readyBed && (carry==="chair" || (carry==="" && chairOn(readyBed.room.dx,readyBed.room.dy)>=0))){
    dropP+=dt; if(dropP>=CHAIR_T){ dropP=0; loadPatient(readyBed); }
  } else if(actHeld && onDisch && carry==="patient"){
    dropP+=dt; if(dropP>=CHAIR_T){ dropP=0; dischargePatient(); }
  } else dropP=0;

  // racking dirty equipment on a free bay
  let bay=null;
  for(let i=0;i<EQ_SPOTS.length;i++){
    if(EQ_SPOTS[i].x===u.x&&EQ_SPOTS[i].y===u.y){
      if(!eqParked.some(function(e){return e.tx===u.x&&e.ty===u.y;})) bay=EQ_SPOTS[i];
      break;
    }
  }
  if(bay && carry==="equip" && actHeld){
    eqP+=dt; if(eqP>=EQUIP_T){ eqP=0; parkEquip(bay); }
  } else eqP=0;

  // belt and braces: any equipment sitting loose on a bay counts as racked
  for(let i=0;i<EQ_SPOTS.length;i++){
    const sp=EQ_SPOTS[i];
    for(let j=eqLoose.length-1;j>=0;j--){
      if(eqLoose[j].tx===sp.x&&eqLoose[j].ty===sp.y &&
         !eqParked.some(function(e){return e.tx===sp.x&&e.ty===sp.y;})){
        eqParked.push({tx:sp.x,ty:sp.y,t:eqLoose[j].t});
        eqLoose.splice(j,1);
        if(eqParked.length>=EQ_SPOTS.length) awardPrize();
        else log("Racked. "+eqParked.length+" of "+EQ_SPOTS.length+" bays filled.");
      }
    }
  }

  if(u.x===DIRTY_SPOT.x&&u.y===DIRTY_SPOT.y&&actHeld&&pack.length){
    dirtyP+=dt;
    if(dirtyP>=DIRTY_T){ const n=pack.length; pack=[]; dirtyP=0;
      log("Dumped "+n+" item"+(n>1?"s":"")+". Stock will reorder. Probably."); }
  } else dirtyP=0;

  // ---- OR transport: gown up, collect, wheel to recovery ----
  ppeWarn=Math.max(0,ppeWarn-dt);
  const orEv=events.find(function(e){return e.kind==="ortx";});
  let onPPE=PPE_ZONES.some(function(z){return z.x===u.x&&z.y===u.y;});
  if(!onPPE) onPPE=ROOMS.some(function(r){
    return r.ppe && r.ppe.x===u.x && r.ppe.y===u.y &&
           beds[r.id-1] && ISO_ACTIVE(beds[r.id-1]);
  });

  // the gown is single-use — step out of the block and it goes in the bin
  if(ppe){
    if(restricted(u.x,u.y)) ppeUsed=true;
    else if(ppeUsed){
      ppe=false; ppeUsed=false;
      showBanner("GOWN OFF","fail",1.8);
      log("Gown in the bin on the way out. You'll need a fresh one to go back in.",true);
    }
  }
  if(onPPE && actHeld && !ppe){
    ppeP+=dt;
    if(ppeP>=PPE_T){ ppeP=0; ppe=true; ppeUsed=false;
      showBanner("GOWNED UP","ok",1.8);
      log("Gown, mask, gloves. You may now enter."); }
  } else ppeP=0;

  const onOrLoad=(u.x===OR_PICK.x&&u.y===OR_PICK.y);
  if(orEv && orPt && orPt.stage==="recovery" && onOrLoad && actHeld && ppe && !carry){
    orP+=dt;
    if(orP>=ORLOAD_T){ orP=0; orPt.stage="carried"; carry="orpatient";
      showBanner("ON THE STRETCHER","ok",2);
      log("Across onto the stretcher. Bed "+orPt.dest.room.id+", and mind the lines."); }
  } else orP=0;

  const dz=orPt&&orPt.dest?orPt.dest.room:null;
  const onRec=!!(dz && u.x===dz.dx && u.y===dz.dy);
  if(orEv && carry==="orpatient" && onRec && actHeld){
    recP+=dt;
    if(recP>=REC_T){
      recP=0; carry="";
      const bonus=Math.max(0,Math.round(orEv.t*6));
      for(let i=events.length-1;i>=0;i--) if(events[i].kind==="ortx") events.splice(i,1);
      awardCoins(30+Math.round(bonus/40));
      const id=orPt.dest.room.id;
      orPt=null;                        // settled in, and off your list
      SFX.win();
      showBanner("SETTLED IN","ok",2.6);
      log("Bed "+id+" has them. Somebody else's problem now.   +"+(35+Math.round(bonus/40))+" coins",true);
      grantPower(POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)]);
    }
  } else recP=0;

  // washroom OD: bring the crash cart down and hold ACT
  const odEv=events.find(function(e){return e.kind==="od";});
  const onWash=(u.x===WASH_SPOT.x&&u.y===WASH_SPOT.y);
  if(odEv && onWash && carry==="cart"){
    if(actHeld){
      odP+=dt;
      if(odP>=OD_HOLD){
        odP=0; carry="";
        const bonus=Math.max(0,Math.round(odEv.t*7));
        for(let i=events.length-1;i>=0;i--) if(events[i].kind==="od") events.splice(i,1);
        awardCoins(35+Math.round(bonus/40));
        if(od){
          od.out=1;
          od.nurses=[{x:(WASH.x0+0.5)*TILE,y:(WASH.y0+0.5)*TILE,ph:0},
                     {x:(WASH.x1+0.5)*TILE,y:(WASH.y0+0.5)*TILE,ph:2}];
        }
        SFX.win();
      showBanner("HE'S BREATHING","ok",2.8);
        log("Narcan and a bag. The nurses are taking him from here.   +"+(35+Math.round(bonus/40))+" coins",true);
        grantPower(POWER_KEYS[Math.floor(Math.random()*POWER_KEYS.length)]);
      }
    } else odP=0;
  } else odP=0;


  // standing there while they have their say
  if(rant){
    rant.t+=dt;
    const inWait = inBox(WAIT,u.x,u.y);
    let anyClose=false;

    rant.who.forEach(function(r3,ri){
      const d3=Math.hypot(player.x-r3.x, player.y-r3.y);
      if(inWait){
        // they have spotted you and they are both coming over
        if(d3>26+ri*10){
          r3.rep-=dt;
          if(r3.rep<=0 || !r3.path || r3.pi>=r3.path.length){
            r3.rep=0.5+Math.random()*0.3;
            r3.path=path(Math.floor(r3.x/TILE),Math.floor(r3.y/TILE),u.x,u.y);
            r3.pi=1;
          }
          let tx3=player.x, ty3=player.y;
          if(r3.path && r3.pi<r3.path.length){
            const wp=r3.path[r3.pi];
            tx3=(wp[0]+.5)*TILE; ty3=(wp[1]+.5)*TILE;
            if(Math.hypot(tx3-r3.x,ty3-r3.y)<3) r3.pi++;
          }
          const ax=tx3-r3.x, ay=ty3-r3.y, ad=Math.hypot(ax,ay)||1;
          const st=78*dt;
          if(walkable(Math.floor((r3.x+ax/ad*st)/TILE),Math.floor(r3.y/TILE))) r3.x+=ax/ad*st;
          if(walkable(Math.floor(r3.x/TILE),Math.floor((r3.y+ay/ad*st)/TILE))) r3.y+=ay/ad*st;
          r3.moving=true; r3.phase+=dt*9;
        } else r3.moving=false;
        r3.face=Math.atan2(player.y-r3.y, player.x-r3.x);
      } else {
        // you left, so they go back to their chair and stew
        const hx=(r3.spot.x+.5)*TILE, hy=(r3.spot.y+.5)*TILE;
        const bx=hx-r3.x, by=hy-r3.y, bd=Math.hypot(bx,by);
        if(bd>3){ r3.x+=bx/bd*46*dt; r3.y+=by/bd*46*dt;
                  r3.moving=true; r3.phase+=dt*6; r3.face=Math.atan2(by,bx); }
        else r3.moving=false;
        r3.path=null;
      }
      r3.close = inWait && d3<34;
      if(r3.close) anyClose=true;
    });

    if(anyClose){
      rantP+=dt;
      rant.next-=dt;
      if(rant.next<=0){
        rant.next=1.2+Math.random()*0.8;
        const free=RANT_LINES.filter(function(l){return rant.said.indexOf(l)<0;});
        const pool=free.length?free:RANT_LINES;
        const line=pool[Math.floor(Math.random()*pool.length)];
        rant.said.push(line);
        // whichever of them is nearest gets the line
        const near=rant.who.filter(function(q){return q.close;});
        const spk=near[Math.floor(Math.random()*near.length)]||rant.who[0];
        rant.bubble={txt:line, life:1.8, on:spk};
        SFX.heyRT();
      }
      if(rantP>=RANT_HOLD) endRant(true);
    } else {
      // back off and they lose their thread
      rantP=Math.max(0,rantP-dt*1.6);
    }
    if(rant && rant.bubble){
      rant.bubble.life-=dt;
      if(rant.bubble.life<=0) rant.bubble=null;
    }
  } else rantP=0;

  // breaking up the fight
  if(fight){
    fight.t+=dt;
    const onIt=(u.x===fight.spot.x&&u.y===fight.spot.y);
    if(onIt && actHeld){
      fightP+=dt;
      if(fightP>=FIGHT_HOLD){ fightP=0; endFight(true); }
    } else fightP=0;
  } else fightP=0;
  // and you drip for a while afterwards
  if(bleed>0){
    bleed-=dt;
    if(moving && Math.random()<dt*20 && drips.length<40){
      drips.push({x:player.x+(Math.random()-0.5)*14, y:player.y+(Math.random()-0.5)*12,
                  vy:18+Math.random()*30, r:1.2+Math.random()*2.2,
                  life:1.4+Math.random()*1.4});
    }
  }
  for(let i=drips.length-1;i>=0;i--){
    const d=drips[i]; d.y+=d.vy*dt; d.life-=dt;
    if(d.life<=0) drips.splice(i,1);
  }
  // the washroom doors open as you approach
  (function(){
    const dx2=(2+0.5)*TILE-player.x, dy2=(42+0.5)*TILE-player.y;
    const near=Math.hypot(dx2,dy2)<TILE*2.2;
    wcDoor += (near? 1:-1)*dt*3.6;
    wcDoor=Math.max(0,Math.min(1,wcDoor));
  })();

  // the newborn needing support
  if(niv && !niv.held && carry==="" && niv.tx===u.x && niv.ty===u.y && act){
    act=false; niv.held=true; carry="niv";
    log("Got it. Delivery room, on the warmer.");
  }
  if(niv && carry==="niv"){
    const nearWarm = baby &&
      Math.hypot(player.x-baby.x, player.y-baby.y) < TILE*1.5;
    if(nearWarm && actHeld){
      nivP+=dt;
      if(nivP>=NIV_HOLD){
        nivP=0; carry="";
        baby.on=true; baby.fade=0;
        endNiv(true);
      }
    } else nivP=0;
  } else nivP=0;
  // once supported, they settle and go up to the unit
  if(baby && baby.on){
    baby.fade+=dt;
    if(baby.fade>2.4) baby.y-=10*dt;
    if(baby.fade>6) baby=null;
  }

  // the vending machine
  const onVend=(u.x===VEND.x&&u.y===VEND.y);
  if(onVend && actHeld && !shopOpen){
    vendP+=dt;
    if(vendP>=VEND_T){ vendP=0; openShop(); }
  } else vendP=0;

  // birthday party: get there and hold ACT
  const partyEv=events.find(function(e){return e.kind==="party";});
  const onParty=(u.x===PARTY.x&&u.y===PARTY.y);
  if(partyEv && onParty && actHeld){
    partyP+=dt;
    if(partyP>=PARTY_HOLD){
      partyP=0; dance=3.2;
      for(let i=0;i<46;i++){
        streamers.push({x:player.x+(Math.random()-0.5)*96,
                        y:player.y-44-Math.random()*72,
                        vy:52+Math.random()*70, ph:Math.random()*6.28,
                        rot:Math.random()*6.28, spin:(Math.random()-0.5)*7,
                        w:2.6+Math.random()*3.4, h:6+Math.random()*9,
                        c:["#F2C94D","#E0544A","#4A9CE0","#8FE04A","#B57FD1","#F28FB4"][i%6],
                        life:1.6+Math.random()*1.3});
      }
      confetti=7;
      const bonus=Math.max(0,Math.round(partyEv.t*8));
      completeEvent("party",20+Math.round(bonus/40),"You ate the cake. Morale is technically improved.");
      SFX.win();
      showBanner("PARTY ATTENDED","ok",2.6);
    }
  } else partyP=0;

  if(onCoffee && actHeld && energy<98){
    coffeeP+=dt;
    if(coffeeP>=COFFEE_T){ coffeeP=0; energy=EMAX; boost=6; warnedE=0;
      log("Burnt, bitter, four hours old. Works every time."); }
  } else coffeeP=0;

  // ---- taps ----
  if(act && bugs.length && jump<=0){
    act=false;
    jump=JUMP_T; jumped=false;
    SFX.hold(0.2);
    return;
  }
  if(act && zomb){
    act=false;
    if(shotCD<=0){
      let best=null,bd=1e9;
      staff.forEach(function(z){ if(!z.z) return;
        const d=Math.hypot(z.x-player.x,z.y-player.y);
        if(d<bd){bd=d;best=z;} });
      if(best){
        shotCD=SHOT_CD;
        const a=Math.atan2(best.y-player.y,best.x-player.x);
        player.face=a;
        darts.push({x:player.x+Math.cos(a)*14, y:player.y+Math.sin(a)*14, a:a, life:1.1});
        SFX.shot();
      }
    }
    return;
  }
  if(act && carry==="ext" && fires.length){
    act=false;
    let best=null,bd=1e9;
    fires.forEach(function(f){
      const d=Math.hypot(f.x-player.x,f.y-player.y);
      if(d<bd){bd=d;best=f;} });
    if(best && bd<70){
      spray=0.35; SFX.spray(); player.face=Math.atan2(best.y-player.y,best.x-player.x);
      best.hp-=1;
      if(best.sm && smoker) smoker.hp=best.hp;
      if(best.hp<=0){
        fires.splice(fires.indexOf(best),1);
        if(best.sm && smoker){ smoker.out=true; smoker.fade=0;
          log("He's out. Singed, furious, and still denying it."); }
        SFX.fireOut();
        if(!fires.length) endFire(true);
        else log((fires.length)+" still going.");
      }
    } else log("Get closer.");
    return;
  }
  if(act){
    act=false;
    if(carry==="chair"){ dropChair(); }
    else if(carry==="niv"){
      drawNIV(player.x+Math.cos(a)*18, player.y+Math.sin(a)*18, a);
    }
    else if(carry==="mcart"){ dropMorgue(); }
    else if(carry==="equip"){ dropEquip(); }
    else if(carry==="cart"||carry==="patient"||carry==="orpatient"){ /* hands full */ }
    else if(ext && ext.tx===u.x && ext.ty===u.y && !carry){ carry="ext"; ext=null;
      log("Extinguisher. Pull the pin and get in there."); }
    else if(carry==="ext"){ /* keep hold of it */ }
    else if(!tryCart() && !tryChair() && !tryMorgue() && !tryEquip()) pickUp();
  }

  selLock=Math.max(0,selLock-dt);
  if(selLock<=0){ const r=roomAt(u.x,u.y); if(r&&hasPatient(beds[r.id-1])) sel=r.id-1; }
  if(!hasPatient(beds[sel])){
    const first=beds.findIndex(hasPatient);
    if(first>=0) sel=first;
  }

  const onExt = !!(ext && ext.tx===u.x && ext.ty===u.y);
  const onTool = loose.some(function(l){return l.tx===u.x&&l.ty===u.y;});
  const onCart = carts.some(function(c){return c.tx===u.x&&c.ty===u.y;});
  const onMCart = mcarts.some(function(c){return c.tx===u.x&&c.ty===u.y;});
  const onChair= chairs.some(function(c){return c.tx===u.x&&c.ty===u.y;});
  let label="ACT", live=false;
  if(niv && !niv.held && niv.tx===u.x && niv.ty===u.y){ label="TAKE\nNIV"; live=true; }
  else if(carry==="niv" && baby && Math.hypot(player.x-baby.x,player.y-baby.y)<TILE*1.5){
    label="HOLD TO\nFIT MASK"; live=true; }
  else if(rant && rant.who.some(function(q){return q.close;})){ label="JUST\nSTAND THERE"; live=true; }
  else if(fight && u.x===fight.spot.x && u.y===fight.spot.y){ label="HOLD TO\nSPLIT THEM"; live=true; }
  else if(u.x===VEND.x&&u.y===VEND.y&&!bugs.length&&!zomb){ label="HOLD TO\nSHOP"; live=true; }
  else if(bugs.length){ label="JUMP"; live=jump<=0; }
  else if(zomb){ label="FIRE"; live=shotCD<=0; }
  else if(carry==="ext"){ label="SPRAY"; live=fires.length>0; }
  else if(onExt){ label="TAKE\nEXT"; live=true; }
  else if(bed && bed.state==="code"){ label = carry==="cart"?"HOLD\nTO SET":"NEED\nCART"; live=carry==="cart"; }
  else if(bed){ label="HOLD\nTO DROP"; live=pack.length>0; }
  else if(readyBed){
    const chairHere = carry==="chair" || chairOn(readyBed.room.dx,readyBed.room.dy)>=0;
    label = chairHere?"HOLD\nTO LOAD":"NEED\nCHAIR"; live=chairHere; }
  else if(onDisch){ label="HOLD TO\nDISCHARGE"; live=carry==="patient"; }
  else if(narcan && narcan.tx===u.x && narcan.ty===u.y){ label="TAKE\nKIT"; live=true; }
  else if(onPPE && !ppe){ label="HOLD FOR\nPPE"; live=true; }
  else if(orEv && orPt && orPt.stage==="recovery" && onOrLoad){
    label = ppe?"HOLD TO\nMOVE THEM":"NEED\nPPE"; live=ppe&&!carry; }
  else if(orEv && carry==="orpatient" && onRec){ label="HOLD TO\nSETTLE IN"; live=true; }
  else if(odEv && onWash){ label = carry==="cart"?"HOLD TO\nWORK HIM":"NEED\nCART"; live=carry==="cart"; }
  else if(partyEv && onParty){ label="HOLD TO\nCELEBRATE"; live=true; }
  else if(onCoffee){ label="HOLD\nFOR COFFEE"; live=energy<98; }
  else if(onCart){ label="TAKE\nCART"; live=true; }
  else if(onChair){ label="TAKE\nCHAIR"; live=true; }
  else if(onTool){ label="PICK\nUP"; live=true; }
  else if(u.x===DIRTY_SPOT.x&&u.y===DIRTY_SPOT.y){ label="HOLD\nTO DUMP"; live=pack.length>0; }
  else if(bay && carry==="equip"){ label="HOLD TO\nRACK"; live=true; }
  else if(carry==="equip"){ label="TAP TO\nSET DOWN"; live=true; }
  else if(eqLoose.some(function(e){return e.tx===u.x&&e.ty===u.y;})){ label="HAUL\nIT"; live=true; }
  else if(carry==="mcart"){ label="TAP TO\nPARK"; live=true; }
  else if(onMCart){
    const mc=mcarts.find(function(c){return c.tx===u.x&&c.ty===u.y;});
    label = mc&&mc.full ? "TAKE\nTHEM" : "TAKE\nTROLLEY"; live=true; }
  else if(carry==="chair"){ label="TAP TO\nPARK"; live=true; }
  else if(carry==="patient"){ label="TO\nWAITING"; }
  else if(carry){ label=carry.toUpperCase(); }
  actBtn.classList.toggle("live",live);
  if(actBtn.textContent!==label) actBtn.textContent=label;
}

/* the nurse's caseload — same rhythm, different work */
const DECK_RN=[
 {dx:"Septic shock",t:150,plan:[
   {n:"Cultures first",need:["BCULT","IVK"],note:"Cultures before antibiotics. Always that order."},
   {n:"Antibiotics",need:["ABX","FLUID"],note:"Broad spectrum inside the hour. Run the fluids wide."},
   {n:"Pressors up",need:["PRESS","LEADS"],note:"MAP still under 65. Titrate and watch the rhythm."}]},
 {dx:"DKA",t:145,plan:[
   {n:"Sugar and gas",need:["GLUC","BCULT"],note:"Hourly glucose from here. Check the ketones too."},
   {n:"Insulin infusion",need:["INSUL","FLUID"],note:"Fixed rate, and don't drop it faster than the protocol."},
   {n:"Watch the potassium",need:["LEADS","CHART"],note:"It will fall as the insulin works. Watch the T waves."}]},
 {dx:"GI bleed",t:135,plan:[
   {n:"Access, two large",need:["IVK","BCULT"],note:"Two wide-bore. Group and save is already sent."},
   {n:"Transfuse",need:["BLOOD","FLUID"],note:"Check it with a second nurse. Every time."},
   {n:"NG and output",need:["NGT","CHART"],note:"Coffee grounds. Chart what comes out."}]},
 {dx:"Post-op day one",t:140,plan:[
   {n:"Pain first",need:["PAIN","CHART"],note:"He can't cough while it hurts. Score it before and after."},
   {n:"Wound check",need:["DRESS","GLUC"],note:"Ooze on the dressing. Have a proper look."},
   {n:"Up and moving",need:["TURN","FOLEY"],note:"Out of bed today. Foley comes out if it can."}]},
 {dx:"Acute kidney injury",t:150,plan:[
   {n:"Strict input/output",need:["FOLEY","CHART"],note:"Hourly urine. Tell someone if it stops."},
   {n:"Bloods",need:["BCULT","IVK"],note:"Urea, creatinine, potassium. Chase them."},
   {n:"Hold the nephrotoxins",need:["ABX","CHART"],note:"Dose adjust. Half of what he's on needs changing."}]},
 {dx:"New AF with RVR",t:130,plan:[
   {n:"Twelve lead",need:["LEADS","CHART"],note:"Rate 160. Get the trace before you do anything."},
   {n:"Rate control",need:["PRESS","IVK"],note:"Access first. Then load him."},
   {n:"Electrolytes",need:["BCULT","FLUID"],note:"Magnesium and potassium. It's usually one of them."}]},
 {dx:"Pressure injury risk",t:155,plan:[
   {n:"Turn and inspect",need:["TURN","DRESS"],note:"Sacrum is already dusky. Two-hourly from now."},
   {n:"Offload",need:["TURN","CHART"],note:"Heels off the bed. Document the position."},
   {n:"Nutrition and skin",need:["NGT","DRESS"],note:"Feeds running, barrier cream on."}]},
 {dx:"Alcohol withdrawal",t:135,plan:[
   {n:"Score him",need:["CHART","GLUC"],note:"CIWA every hour. And check the sugar, they're always low."},
   {n:"Benzos",need:["PAIN","IVK"],note:"Symptom triggered. Don't wait for the fit."},
   {n:"Thiamine and fluids",need:["FLUID","ABX"],note:"Pabrinex before any glucose load."}]},
 {dx:"Aspiration pneumonia",t:140,plan:[
   {n:"Sit them up",need:["TURN","LEADS"],note:"Thirty degrees minimum. It's the cheapest thing you'll do today."},
   {n:"Antibiotics",need:["ABX","BCULT"],note:"Cultures, then cover. Sputum too if you can get it."},
   {n:"Nil by mouth",need:["NGT","CHART"],note:"Speech and language will see them. Nothing orally until then."}]},
 {dx:"Delirium, high risk",t:145,plan:[
   {n:"Find the cause",need:["GLUC","BCULT"],note:"Sugar, infection, pain, constipation. In that order."},
   {n:"Treat the obvious",need:["PAIN","SUPP"],note:"He hasn't opened his bowels in five days. Start there."},
   {n:"Reorient",need:["CHART","LEADS"],note:"Glasses on, curtains open, tell him where he is."}]},
 {dx:"Fluid overload",t:140,plan:[
   {n:"Weigh and assess",need:["CHART","LEADS"],note:"Three kilos up since yesterday. Crackles to the mid-zones."},
   {n:"Diurese",need:["PRESS","FOLEY"],note:"Catheter in first or you'll be changing sheets all night."},
   {n:"Balance",need:["FLUID","CHART"],note:"Restrict it. Chart every millilitre that goes in."}]},
 {dx:"Central line, day three",t:150,plan:[
   {n:"Line check",need:["DRESS","BCULT"],note:"Site is red. Cultures from the line and peripherally."},
   {n:"Redress",need:["DRESS","IVK"],note:"Full aseptic. New dressing, date it."},
   {n:"Antibiotics",need:["ABX","FLUID"],note:"Cover for line sepsis until the cultures come back."}]}
];

/* ================= SOUND ================= */
/* Everything is synthesised — no files, no download, and it reacts to game state. */
const SFX=(function(){
  let ac=null, master=null, muted=false, ready=false;
  let bedBus=null, alarmBus=null, uiBus=null, ambBus=null;

  function init(){
    if(ready) return true;
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC) return false;
    ac=new AC();
    master=ac.createGain(); master.gain.value=1.0; master.connect(ac.destination);
    // a touch of room on everything
    const conv=ac.createConvolver();
    const len=ac.sampleRate*0.9, buf=ac.createBuffer(2,len,ac.sampleRate);
    for(let ch=0;ch<2;ch++){
      const d=buf.getChannelData(ch);
      for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)*0.5;
    }
    conv.buffer=buf;
    const wet=ac.createGain(); wet.gain.value=0.20;
    conv.connect(wet); wet.connect(master);

    function bus(v){ const g=ac.createGain(); g.gain.value=v;
      g.connect(master); g.connect(conv); return g; }
    bedBus=bus(0.85); alarmBus=bus(1.0); uiBus=bus(0.95); ambBus=bus(0.45);


    ready=true;
    // browsers hand back a suspended context until a gesture unlocks it
    try{ ac.resume(); }catch(e){}
    return true;
  }
  function on(){ if(!ready) return false; if(ac.state!=="running"){ try{ac.resume();}catch(e){} }
    return !muted && ac.state==="running"; }

  /* ---- building blocks ---- */
  function beep(f,dur,vol,type,bus,slide){
    if(!on()) return;
    const o=ac.createOscillator(), g=ac.createGain();
    o.type=type||"sine"; o.frequency.setValueAtTime(f,ac.currentTime);
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(30,slide),ac.currentTime+dur);
    g.gain.setValueAtTime(0.0001,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(vol,ac.currentTime+0.008);
    g.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+dur);
    o.connect(g); g.connect(bus||uiBus); o.start(); o.stop(ac.currentTime+dur+0.02);
  }
  function noise(dur,vol,f,q,bus){
    if(!on()) return;
    const n=ac.createBuffer(1,Math.ceil(ac.sampleRate*dur),ac.sampleRate);
    const d=n.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,1.6);
    const s=ac.createBufferSource(); s.buffer=n;
    const bp=ac.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=f||900; bp.Q.value=q||1;
    const g=ac.createGain(); g.gain.value=vol;
    s.connect(bp); bp.connect(g); g.connect(bus||uiBus); s.start();
  }

  /* ---- the unit ---- */
  const api={
    start(){
      const first=!ready;
      const okc=init();
      if(!okc) return false;
      try{ ac.resume(); }catch(e){}
      if(first){
        // a short two-note chime so you know it woke up
        setTimeout(function(){ beep(660,0.10,0.5,"triangle"); },60);
        setTimeout(function(){ beep(990,0.14,0.5,"triangle"); },180);
      }
      return true;
    },
    state(){ return ready? ac.state : "none"; },
    toggle(){ muted=!muted; if(master) master.gain.value=muted?0:1.0; return !muted; },
    isMuted(){ return muted; },
    isReady(){ return ready; },

    // one blip per heartbeat; pitch falls as the patient does
    monitorBeep(frac){
      const f=560+Math.max(0,Math.min(1,frac))*260;
      beep(f,0.07,0.34,"sine",bedBus);
    },
    // the three vent alarms, each its own pattern
    alarmHigh(){ beep(1180,0.10,0.442,"square",alarmBus);
      setTimeout(function(){beep(1180,0.10,0.442,"square",alarmBus);},130);
      setTimeout(function(){beep(1180,0.10,0.442,"square",alarmBus);},260); },
    alarmLow(){ beep(430,0.24,0.408,"square",alarmBus);
      setTimeout(function(){beep(360,0.30,0.408,"square",alarmBus);},280); },
    alarmApnea(){ beep(880,0.5,0.442,"sawtooth",alarmBus,620); },
    code(){ if(!on()) return;
      beep(920,0.28,0.578,"square",alarmBus);
      setTimeout(function(){beep(700,0.28,0.578,"square",alarmBus);},300);
      setTimeout(function(){beep(920,0.28,0.578,"square",alarmBus);},600); },
    flatline(){ if(!on()) return;
      const o=ac.createOscillator(), g=ac.createGain();
      o.type="sine"; o.frequency.value=840;
      g.gain.setValueAtTime(0.0001,ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12,ac.currentTime+0.02);
      g.gain.setValueAtTime(0.12,ac.currentTime+1.5);
      g.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+2.0);
      o.connect(g); g.connect(alarmBus); o.start(); o.stop(ac.currentTime+2.1); },

    // handling things
    pickup(){ beep(760,0.06,0.34,"triangle"); },
    deny(){ beep(200,0.13,0.34,"square",null,150); },
    deliver(){ beep(620,0.07,0.34,"triangle");
      setTimeout(function(){beep(930,0.10,0.34,"triangle");},70); },
    stageDone(){ [660,830,990].forEach(function(f,i){
      setTimeout(function(){beep(f,0.12,0.34,"triangle");},i*90); }); },
    discharge(){ [520,660,780,1040].forEach(function(f,i){
      setTimeout(function(){beep(f,0.14,0.34,"sine");},i*100); }); },
    hold(p){ beep(300+p*420,0.04,0.612,"sine"); },
    rack(){ noise(0.16,0.476,260,1.4); beep(150,0.10,0.85,"square"); },
    wheels(){ noise(0.07,0.17,1500,2.4); },
    dump(){ noise(0.3,0.442,340,0.8); },

    // powers and cans
    power(){ [520,700,880,1180].forEach(function(f,i){
      setTimeout(function(){beep(f,0.13,0.34,"square");},i*55); }); },
    can(){ noise(0.09,0.51,2600,3); beep(1200,0.05,0.85,"sine");
      setTimeout(function(){noise(0.35,0.238,3800,1.2);},60); },
    rush(){ beep(300,0.5,0.34,"sawtooth",null,1300); },
    coffee(){ noise(0.5,0.272,700,0.7); },

    // events
    powerBump(){ beep(120,0.7,0.442,"sawtooth",alarmBus,60); noise(0.3,0.306,300,0.7); },
    powerBack(){ beep(90,0.6,0.34,"sawtooth",null,420); },
    party(){ [660,660,740,660,880,830].forEach(function(f,i){
      setTimeout(function(){beep(f,0.16,0.34,"square");},i*150); }); },
    heyRT(){ beep(500,0.10,0.85,"square");
      setTimeout(function(){beep(640,0.14,0.85,"square");},110); },
    shot(){ noise(0.05,0.544,2200,2.6); beep(1500,0.05,0.85,"square",null,700); },
    zombHit(){ noise(0.14,0.476,180,0.9); beep(90,0.16,0.85,"sawtooth",null,50); },
    spray(){ noise(0.18,0.408,4200,0.8); },
    fireOut(){ noise(0.4,0.442,900,0.6); beep(260,0.3,0.85,"sine",null,120); },
    highOn(){ beep(400,1.2,0.34,"sine",null,190); },
    highOff(){ beep(190,0.9,0.34,"sine",null,620); },
    win(){ [520,660,780,1040,1310].forEach(function(f,i){
      setTimeout(function(){beep(f,0.18,0.374,"triangle");},i*110); }); },
    fail(){ [420,330,250].forEach(function(f,i){
      setTimeout(function(){beep(f,0.26,0.374,"sawtooth");},i*150); }); },

    // the background hum/air-handling ambience was removed — tension() is now a no-op
    // kept so existing call sites don't need to change.
    tension(){},
    blackout(on2){ if(!ready) return;
      ambBus.gain.value= on2?0.12:0.45;
      bedBus.gain.value= on2?0.45:0.85; }
  };
  return api;
})();

// Background score — a separate Web Audio engine (assets/audio/icu-shift-music.js),
// driven by real bed state (codeBlue/rosc on an actual code, fail on a loss) rather
// than its own randomizer; random cloud-mode drift stays on so it can't get stuck
// in "storm" if the per-level black-cloud event's own end path is never hit.
const music=(typeof ICUShiftMusic==="function")?ICUShiftMusic({volume:0.55}):null;
if(music){ music.setRandom(false); music.setRandomClouds(false); }
// Every entry ever pushed into events[] comes from the single per-level
// black-cloud trigger (startEvent(), called only from cloudUsed=true below) —
// nothing else uses that array — so events.length dropping back to 0 is a
// precise, universal "the black-cloud event just resolved" signal, covering
// all ~12 event flavors without hooking each one's own end function.
let musicCloudActive=false;
// music.start() only resumes its AudioContext once (it no-ops if already
// "running"), and that first call often happens from begin() on auto-launch
// (/play?level=N), which fires from a promise callback with no user gesture —
// iOS Safari refuses to unlock an AudioContext there, and nothing ever retries.
// Force a resume on every real gameplay tap so it recovers the same way SFX does.
function unlockMusic(){ if(music&&music.ctx&&music.ctx.state!=="running"){ try{ music.ctx.resume(); }catch(e){} } }

/* ================= RENDER — TOP-DOWN ================= */
const cv=document.getElementById("cv"),g=cv.getContext("2d");
if(!g.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
  this.beginPath();this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);
  this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();return this;};}
let VW=360,VH=520,SC=1.5;
const vigC=document.createElement("canvas"), vigX=vigC.getContext("2d");
const fatC=document.createElement("canvas"), fatX=fatC.getContext("2d");
const darkC=document.createElement("canvas"), darkX=darkC.getContext("2d");
function resize(){
  const st=document.getElementById("stage");
  const w=st.clientWidth,h=st.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=w*dpr;cv.height=h*dpr;g.setTransform(dpr,0,0,dpr,0,0);
  VW=w;VH=h;
  SC=desktopLayout.matches ? w/(MW*TILE)
    : Math.max(1.05,Math.min(2.0,w/(MW*TILE)*1.5));
  // vignette + fatigue overlays are baked once per resize, then blitted
  vigC.width=Math.max(1,VW); vigC.height=Math.max(1,VH);
  const vg=vigX.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*0.30,
                                     VW/2,VH/2,Math.max(VW,VH)*0.78);
  vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.58)");
  vigX.clearRect(0,0,VW,VH);vigX.fillStyle=vg;vigX.fillRect(0,0,VW,VH);
  fatC.width=Math.max(1,VW); fatC.height=Math.max(1,VH);
  const fg=fatX.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*0.20,
                                     VW/2,VH/2,Math.max(VW,VH)*0.66);
  fg.addColorStop(0,"rgba(0,0,0,0)");fg.addColorStop(1,"rgba(10,4,5,1)");
  fatX.clearRect(0,0,VW,VH);fatX.fillStyle=fg;fatX.fillRect(0,0,VW,VH);
  darkC.width=Math.max(1,VW); darkC.height=Math.max(1,VH);
}
let viewportFitFrame=0;
function fitVisibleViewport(){
  if(viewportFitFrame) return;
  viewportFitFrame=requestAnimationFrame(function(){
    viewportFitFrame=0;
    const app=document.getElementById("app"),viewport=window.visualViewport;
    if(viewport&&matchMedia("(max-width:767px)").matches){
      const height=Math.round(viewport.height)+"px";
      document.documentElement.style.height=height;
      document.body.style.height=height;
      app.style.height=height;
    }else{
      document.documentElement.style.height="";
      document.body.style.height="";
      app.style.height="";
    }
    resize();
  });
}
addEventListener("resize",fitVisibleViewport);
if(window.visualViewport) window.visualViewport.addEventListener("resize",fitVisibleViewport);
// HUD content and desktop layout changes can resize the stage without a window event.
new ResizeObserver(function(){resize();if(!running && player) draw();})
  .observe(document.getElementById("stage"));

const INK="#19222A";
function rnd(x,y,s){const v=Math.sin(x*127.1+y*311.7+(s||0)*74.7)*43758.5453;return v-Math.floor(v);}
function rgba(hex,a){
  const n=parseInt(hex.slice(1),16);
  return "rgba("+((n>>16)&255)+","+((n>>8)&255)+","+(n&255)+","+a+")";
}
function shade(hex,a){const n=parseInt(hex.slice(1),16);
  const f=v=>Math.max(0,Math.min(255,Math.round(v*(1+a))));
  return "#"+((1<<24)+(f((n>>16)&255)<<16)+(f((n>>8)&255)<<8)+f(n&255)).toString(16).slice(1);}

/* ---- one baked environment layer, supersampled 2x so it stays crisp ---- */
const SS=2;
const bg=document.createElement("canvas");
bg.width=MW*TILE*SS; bg.height=MH*TILE*SS;
const bc=bg.getContext("2d");
bc.setTransform(SS,0,0,SS,0,0);

function bakeMap(){
  // floors — sheet vinyl with welded seams
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
    if(map[y][x]===1) continue;
    const px=x*TILE,py=y*TILE;
    const dirty=inBox(DIRTY,x,y), sup=inBox(SUPPLY,x,y), rm=roomAt(x,y);
    bc.fillStyle = dirty?"#2C2217" : sup?"#222C35" : rm?"#28343F" : "#1E2831";
    bc.fillRect(px,py,TILE,TILE);
    // fine speckle
    for(let i=0;i<18;i++){
      bc.fillStyle="rgba(255,248,232,"+(0.010+rnd(i,x+y,3)*0.030)+")";
      bc.fillRect(px+rnd(x*31+i,y*17,1)*TILE, py+rnd(x*13,y*29+i,2)*TILE,0.9,0.9);
    }
    for(let i=0;i<6;i++){
      bc.fillStyle="rgba(0,0,0,"+(0.03+rnd(i,x*7+y,9)*0.05)+")";
      bc.fillRect(px+rnd(i*5,x,11)*TILE, py+rnd(i*3,y,12)*TILE,1.4,0.7);
    }
    // half-tile seams, then the main seam over them
    bc.strokeStyle="rgba(0,0,0,.13)";bc.lineWidth=0.5;
    bc.beginPath();
    bc.moveTo(px+TILE/2,py);bc.lineTo(px+TILE/2,py+TILE);
    bc.moveTo(px,py+TILE/2);bc.lineTo(px+TILE,py+TILE/2);
    bc.stroke();
    bc.strokeStyle="rgba(0,0,0,.34)";bc.lineWidth=0.75;
    bc.strokeRect(px+.375,py+.375,TILE-.75,TILE-.75);
    // polished sheen along the top-left of each tile
    bc.strokeStyle="rgba(255,255,255,.055)";bc.lineWidth=0.75;
    bc.beginPath();bc.moveTo(px+1,py+1.2);bc.lineTo(px+TILE-1,py+1.2);
    bc.moveTo(px+1.2,py+1);bc.lineTo(px+1.2,py+TILE-1);bc.stroke();
  }
  // corridor wayfinding stripe + ceiling fixtures
  bc.fillStyle="rgba(56,214,224,.09)";bc.fillRect(7*TILE+10,TILE,12,(MH-2)*TILE);
  bc.fillStyle="rgba(56,214,224,.34)";bc.fillRect(7*TILE+10,TILE,1.6,(MH-2)*TILE);
  bc.fillStyle="rgba(56,214,224,.34)";bc.fillRect(7*TILE+20.4,TILE,1.6,(MH-2)*TILE);
  for(let y=2;y<MH-1;y+=4){
    const gr=bc.createRadialGradient(7.5*TILE,y*TILE,4,7.5*TILE,y*TILE,TILE*2.4);
    gr.addColorStop(0,"rgba(228,242,250,.13)");gr.addColorStop(1,"rgba(228,242,250,0)");
    bc.fillStyle=gr;bc.fillRect(5*TILE,(y-3)*TILE,5*TILE,6*TILE);
    bc.fillStyle="rgba(30,38,46,.9)";bc.fillRect(7*TILE+7,y*TILE+11,18,7);
    bc.fillStyle="rgba(238,248,252,.72)";bc.fillRect(7*TILE+8.5,y*TILE+12.5,15,4);
    bc.fillStyle="rgba(255,255,255,.95)";bc.fillRect(7*TILE+8.5,y*TILE+12.5,15,1.2);
  }
  // threshold strips in every doorway
  YS.forEach(function(y0){
    [[5,y0+2],[9,y0+2]].forEach(function(d){
      const px=d[0]*TILE,py=d[1]*TILE;
      bc.fillStyle="#5C6E7A";bc.fillRect(px,py+2,TILE,2);
      bc.fillRect(px,py+TILE-4,TILE,2);
      bc.fillStyle="rgba(255,255,255,.18)";bc.fillRect(px,py+2,TILE,0.7);
      bc.fillRect(px,py+TILE-4,TILE,0.7);
    });
  });
  for(let y=23;y<27;y++){
    const px=7*TILE+16, py=y*TILE+16;
    bc.fillStyle="rgba(56,214,224,.15)";
    bc.beginPath();bc.moveTo(px,py+6);bc.lineTo(px-5,py-2);bc.lineTo(px+5,py-2);bc.closePath();bc.fill();
  }
  for(let i=0;i<5;i++){
    bc.fillStyle="rgba(200,140,60,.09)";
    bc.fillRect(DIRTY.x0*TILE+i*26, DIRTY_SPOT.y*TILE-TILE,13,TILE*3);
  }

  // walls, seen from directly above — panelled with bumper guards at floor level
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
    if(map[y][x]!==1) continue;
    const px=x*TILE,py=y*TILE;
    const openD = y+1<MH&&map[y+1][x]!==1, openU = y-1>=0&&map[y-1][x]!==1;
    const openR = x+1<MW&&map[y][x+1]!==1, openL = x-1>=0&&map[y][x-1]!==1;
    bc.fillStyle="#404E5B";bc.fillRect(px,py,TILE,TILE);
    // fine wall texture
    for(let i=0;i<10;i++){
      bc.fillStyle="rgba(0,0,0,"+(rnd(x+i,y,4)*0.05)+")";
      bc.fillRect(px+rnd(i,x,5)*TILE,py+rnd(i,y,6)*TILE,2,1);
    }
    // panel joint down the middle of the run
    bc.strokeStyle="rgba(0,0,0,.20)";bc.lineWidth=0.6;
    bc.beginPath();
    if(openU||openD){bc.moveTo(px+TILE/2,py);bc.lineTo(px+TILE/2,py+TILE);}
    if(openL||openR){bc.moveTo(px,py+TILE/2);bc.lineTo(px+TILE,py+TILE/2);}
    bc.stroke();
    // bumper guard + shadow on every edge that meets floor
    function guard(gx,gy,gw,gh,lit){
      bc.fillStyle="#4E6B72";bc.fillRect(gx,gy,gw,gh);
      bc.fillStyle= lit? "rgba(255,255,255,.20)":"rgba(255,255,255,.10)";
      bc.fillRect(gx,gy,gw,gh*0.34);
      bc.fillStyle="rgba(0,0,0,.30)";
      bc.fillRect(gx,gy+gh-gh*0.28,gw,gh*0.28);
    }
    if(openD){ guard(px,py+TILE-4.5,TILE,4.5,false);
      bc.fillStyle="rgba(0,0,0,.32)";bc.fillRect(px,py+TILE,TILE,3); }
    if(openU){ guard(px,py,TILE,4.5,true);
      bc.fillStyle="rgba(0,0,0,.16)";bc.fillRect(px,py-2,TILE,2); }
    if(openR){ bc.fillStyle="#46606B";bc.fillRect(px+TILE-4,py,4,TILE);
      bc.fillStyle="rgba(0,0,0,.26)";bc.fillRect(px+TILE,py,2.5,TILE); }
    if(openL){ bc.fillStyle="#4E6B72";bc.fillRect(px,py,4,TILE);
      bc.fillStyle="rgba(255,255,255,.10)";bc.fillRect(px,py,1.2,TILE); }
  }
  // handrails running the corridor
  [5,9].forEach(function(cx){
    for(let y=1;y<MH-1;y++){
      if(map[y][cx]!==1) continue;
      const px=cx*TILE+(cx===5?TILE-7:4);
      bc.fillStyle="#6B7D8C";bc.fillRect(px,y*TILE,3,TILE);
      bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(px+3,y*TILE,1.5,TILE);
    }
  });
  // glass sliders
  YS.forEach(function(y0){
    [[5,y0+2],[9,y0+2]].forEach(function(d){
      const px=d[0]*TILE,py=d[1]*TILE;
      bc.fillStyle="rgba(150,200,215,.14)";bc.fillRect(px,py,TILE,TILE);
      bc.fillStyle="rgba(185,222,236,.30)";
      bc.fillRect(px,py+2,TILE,5);bc.fillRect(px,py+TILE-7,TILE,5);
      bc.strokeStyle="rgba(190,225,240,.34)";bc.lineWidth=1;
      bc.strokeRect(px+.5,py+.5,TILE-1,TILE-1);
    });
  });

  // room fittings, overhead
  ROOMS.forEach(function(r){
    const L=r.side==="L";
    // headwall behind the bed
    const hx=r.bx*TILE, hy=r.y0*TILE;
    bc.fillStyle="#2A3742";bc.fillRect(hx-4,hy+2,TILE+8,10);
    bc.fillStyle="rgba(255,255,255,.07)";bc.fillRect(hx-4,hy+2,TILE+8,2);
    [["#4FBF6A",0],["#D8C24A",1],["#D8DEE4",2]].forEach(function(o,i){
      const ox=hx+5+i*9, oy=hy+7;
      bc.fillStyle="#0E151B";bc.beginPath();bc.arc(ox,oy,3.2,0,7);bc.fill();
      bc.fillStyle=o[0];bc.beginPath();bc.arc(ox,oy,2,0,7);bc.fill();
    });
    bc.fillStyle="#5C6D7A";
    for(let i=0;i<4;i++) bc.fillRect(hx+2+i*7,hy+13,3,2.5);
    // curtain track
    bc.strokeStyle="rgba(140,160,175,.3)";bc.lineWidth=1.4;bc.setLineDash([3,3]);
    bc.beginPath();bc.moveTo(r.x0*TILE+2,(r.y0+1)*TILE-3);
    bc.lineTo((r.x1+1)*TILE-2,(r.y0+1)*TILE-3);bc.stroke();bc.setLineDash([]);
    // IV pole from above: base ring + bags
    const ivx=(L?r.x0:r.x1)*TILE+TILE/2, ivy=(r.y0+1)*TILE+TILE/2;
    bc.fillStyle="rgba(0,0,0,.32)";bc.beginPath();bc.arc(ivx,ivy+1,9,0,7);bc.fill();
    bc.strokeStyle="#7E8E9B";bc.lineWidth=2;
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2;
      bc.beginPath();bc.moveTo(ivx,ivy);bc.lineTo(ivx+Math.cos(a)*8,ivy+Math.sin(a)*8);bc.stroke();}
    bc.fillStyle="#9FB2C0";bc.beginPath();bc.arc(ivx,ivy,3.4,0,7);bc.fill();
    bc.fillStyle="rgba(196,228,242,.8)";bc.beginPath();bc.roundRect(ivx+3,ivy-6,5,7,1.5);bc.fill();
    bc.fillStyle="rgba(120,200,160,.7)";bc.beginPath();bc.roundRect(ivx-8,ivy-5,5,6,1.5);bc.fill();
    // chair, overhead
    const cxp=(L?r.x0:r.x1)*TILE+TILE/2, cyp=(r.y0+3)*TILE+TILE/2;
    bc.fillStyle="rgba(0,0,0,.28)";bc.beginPath();bc.roundRect(cxp-9,cyp-8,18,17,4);bc.fill();
    bc.fillStyle="#4A5A52";bc.beginPath();bc.roundRect(cxp-8,cyp-8,16,15,3);bc.fill();
    bc.fillStyle="#5D7065";bc.beginPath();bc.roundRect(cxp-6,cyp-5,12,10,2);bc.fill();
    // sink, overhead
    const sx=(L?r.x1:r.x0)*TILE+TILE/2, sy=(r.y0+3)*TILE+TILE/2;
    bc.fillStyle="#2D3944";bc.beginPath();bc.roundRect(sx-10,sy-7,20,14,2);bc.fill();
    bc.fillStyle="#C3CED6";bc.beginPath();bc.roundRect(sx-7,sy-5,14,10,3);bc.fill();
    bc.fillStyle="#8697A4";bc.fillRect(sx-1.2,sy-8,2.4,4);
    bc.fillStyle="#6E7F8C";bc.beginPath();bc.arc(sx,sy+1,2.2,0,7);bc.fill();
    // placard + gel + gloves on the corridor wall
    const wx=(L?5:9)*TILE;
    bc.fillStyle="#101821";bc.beginPath();bc.roundRect(wx+7,(r.y0+1)*TILE+9,18,14,2);bc.fill();
    bc.strokeStyle="#4E6472";bc.lineWidth=1;bc.strokeRect(wx+7.5,(r.y0+1)*TILE+9.5,17,13);
    bc.fillStyle="#8FD8E0";bc.font="700 12px 'Barlow Condensed',sans-serif";
    bc.textAlign="center";bc.fillText(String(r.id),wx+16,(r.y0+1)*TILE+20);
    bc.fillStyle="#C9D3DA";bc.beginPath();bc.roundRect(wx+11,(r.y0+3)*TILE+9,10,13,2);bc.fill();
    bc.fillStyle="#5FA8C4";bc.fillRect(wx+12.5,(r.y0+3)*TILE+11,7,6);
    ["#4E7FA8","#7A8E4E","#A85E4E"].forEach(function(col,i){
      bc.fillStyle=col;bc.fillRect(wx+5+i*8,r.y0*TILE+10,7,10);
      bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(wx+6.5+i*8,r.y0*TILE+12,4,2.5);
    });
  });

  // charge desk, overhead
  (function(){
    const px=CHARGE.x*TILE, py=CHARGE.y0*TILE, h=(CHARGE.y1-CHARGE.y0+1)*TILE;
    bc.fillStyle="rgba(0,0,0,.34)";bc.fillRect(px,py,TILE+8,h);
    bc.fillStyle="#6E573B";bc.fillRect(px,py,TILE+6,h);
    bc.fillStyle="#856A48";bc.fillRect(px,py,TILE+6,4);
    bc.fillStyle="#5A462F";bc.fillRect(px+TILE+2,py,4,h);
    bc.fillStyle="rgba(0,0,0,.2)";
    for(let i=1;i<3;i++) bc.fillRect(px,py+i*TILE-1,TILE+6,2);
    // three monitors, turned to face whoever is sitting on the corridor side
    for(let i=0;i<3;i++){
      const my=py+i*TILE+TILE/2;
      bc.save();
      bc.translate(px+TILE-6,my);
      bc.rotate(-Math.PI/2);                 // screens look east, at the chairs
      bc.fillStyle="rgba(0,0,0,.35)";bc.fillRect(-13,-6,26,15);
      bc.fillStyle="#39434D";bc.fillRect(-14,-8,28,17);
      bc.fillStyle="#080D11";bc.fillRect(-12,-6,24,13);
      bc.strokeStyle="#3E5462";bc.lineWidth=1;bc.strokeRect(-11.5,-5.5,23,12);
      const col=["#35E07F","#38D6E0","#F2B33D"][i];
      bc.strokeStyle=col;bc.lineWidth=1;bc.beginPath();
      for(let k=0;k<20;k++){
        const yy=0-((k===9)?5:(k===10)?-2:0);
        if(k) bc.lineTo(-10+k,yy); else bc.moveTo(-10+k,yy);
      }
      bc.stroke();
      // stand and a hint of the back of the screen
      bc.fillStyle="#4A5560";bc.fillRect(-4,9,8,3);
      bc.strokeStyle=INK;bc.lineWidth=1.1;bc.strokeRect(-14,-8,28,17);
      bc.restore();
    }
    // keyboards in front of each screen, on the desk
    for(let i=0;i<3;i++){
      const ky=py+i*TILE+TILE/2;
      bc.save();bc.translate(px+13,ky);bc.rotate(-Math.PI/2);
      bc.fillStyle="#20282F";bc.fillRect(-11,-4,22,8);
      bc.fillStyle="#4A5A66";
      for(let r2=0;r2<2;r2++)for(let c2=0;c2<6;c2++) bc.fillRect(-9+c2*3.2,-3+r2*3,2.2,1.8);
      bc.restore();
    }
    // phone and a cold coffee
    bc.fillStyle="#171E24";bc.beginPath();bc.roundRect(px+3,py+4,9,8,2);bc.fill();
    bc.fillStyle="#D8CFC0";bc.beginPath();bc.arc(px+8,py+3*TILE-8,4.2,0,7);bc.fill();
    bc.fillStyle="#5A3A22";bc.beginPath();bc.arc(px+8,py+3*TILE-8,2.8,0,7);bc.fill();
    // three chairs on the corridor side
    for(let i=0;i<3;i++){
      const cx2=px+TILE+18, cy2=py+i*TILE+TILE/2;
      bc.fillStyle="rgba(0,0,0,.3)";bc.beginPath();bc.arc(cx2,cy2+1,9,0,7);bc.fill();
      bc.fillStyle="#2E3A44";bc.beginPath();bc.arc(cx2,cy2,8,0,7);bc.fill();
      bc.fillStyle="#3E4E5A";bc.beginPath();bc.arc(cx2,cy2,5,0,7);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1;bc.beginPath();bc.arc(cx2,cy2,8,0,7);bc.stroke();
    }
    bc.fillStyle="#38D6E0";bc.font="700 9px 'Barlow Condensed',sans-serif";
    bc.textAlign="center";bc.fillText("CHARGE",px+TILE/2+2,py-4);
  })();

  // ---- clean supply (top half) ----
  (function(){
    const S=SUPPLY;
    for(let y=S.y0;y<=S.y1;y++){
      [S.x0,S.x1].forEach(function(x){
        const px=x*TILE+2, py=y*TILE+6;
        bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(px+1,py+1,TILE-4,21);
        bc.fillStyle="#2E3B45";bc.fillRect(px,py,TILE-4,20);
        bc.fillStyle="#3E4E5A";bc.fillRect(px,py,TILE-4,3);
        for(let i=0;i<3;i++){
          bc.fillStyle=["#4A6E7A","#6E6A4A","#4A5A6E","#5E6E4A"][(y+i)%4];
          bc.fillRect(px+2+i*8,py+5,6,12);
        }
        bc.strokeStyle=INK;bc.lineWidth=1;bc.strokeRect(px+.5,py+.5,TILE-5,20);
      });
    }
    // a trolley of stock nobody has put away
    const tx=(S.x0+2)*TILE-6, ty=(S.y1)*TILE+8;
    bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(tx-11,ty+2,26,17);
    bc.fillStyle="#C7D2DA";bc.beginPath();bc.roundRect(tx-12,ty,26,17,2);bc.fill();
    bc.fillStyle="#9FB2C0";
    for(let i=0;i<4;i++) bc.fillRect(tx-9+i*6,ty+3,4,11);
    bc.strokeStyle=INK;bc.lineWidth=1.2;bc.beginPath();bc.roundRect(tx-12,ty,26,17,2);bc.stroke();
    bc.textAlign="left";bc.font="600 8px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(120,150,168,.8)";
    bc.fillText("CLEAN SUPPLY",S.x0*TILE+3,S.y0*TILE+11);
  })();

  // ---- morgue (bottom half) ----
  (function(){
    const M=MORGUE;
    // colder and darker than anywhere else
    for(let y=M.y0;y<=M.y1;y++)for(let x=M.x0;x<=M.x1;x++){
      bc.fillStyle="rgba(90,120,150,.06)";bc.fillRect(x*TILE,y*TILE,TILE,TILE);
      bc.fillStyle="rgba(0,0,0,.16)";bc.fillRect(x*TILE,y*TILE,TILE,TILE);
    }
    bc.textAlign="left";bc.font="600 8px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(150,175,195,.7)";
    bc.fillText("MORGUE",M.x0*TILE+3,M.y0*TILE+11);

    // two trolleys, side by side
    [].forEach(function(o){
      const px=o[0]*TILE, py=(M.y0+1)*TILE-6;
      bc.fillStyle="rgba(0,0,0,.34)";bc.fillRect(px-11,py+2,25,46);
      bc.fillStyle="#59687A";bc.beginPath();bc.roundRect(px-12,py,25,46,3);bc.fill();
      bc.fillStyle="#28323C";bc.beginPath();bc.roundRect(px-9,py+3,19,40,2);bc.fill();
      // castors
      bc.fillStyle="#141C22";
      [[-9,4],[9,4],[-9,42],[9,42]].forEach(function(w){
        bc.beginPath();bc.arc(px+w[0],py+w[1],2,0,7);bc.fill(); });
      if(o[1]){
        // occupied — a white bag, zipped, with a toe tag
        bc.fillStyle="#E4E2DA";
        bc.beginPath();bc.roundRect(px-8,py+5,17,36,7);bc.fill();
        // the shape of someone under it
        bc.fillStyle="rgba(0,0,0,.10)";
        bc.beginPath();bc.ellipse(px,py+13,6,7,0,0,7);bc.fill();
        bc.beginPath();bc.ellipse(px,py+30,5.4,9,0,0,7);bc.fill();
        // the zip
        bc.strokeStyle="rgba(120,124,120,.75)";bc.lineWidth=1.2;
        bc.beginPath();bc.moveTo(px,py+6);bc.lineTo(px,py+40);bc.stroke();
        for(let k=0;k<11;k++){
          bc.fillStyle="rgba(150,154,150,.6)";
          bc.fillRect(px-1.4,py+8+k*3,2.8,1.2);
        }
        bc.fillStyle="#9AA0A2";bc.fillRect(px-2,py+7,4,4);
        bc.strokeStyle="rgba(140,140,132,.8)";bc.lineWidth=1;
        bc.beginPath();bc.roundRect(px-8,py+5,17,36,7);bc.stroke();
        // toe tag on a string
        bc.strokeStyle="rgba(180,178,168,.7)";bc.lineWidth=0.9;
        bc.beginPath();bc.moveTo(px+7,py+38);bc.lineTo(px+12,py+42);bc.stroke();
        bc.fillStyle="#D8D2C0";
        bc.save();bc.translate(px+14,py+44);bc.rotate(0.4);
        bc.fillRect(-4,-3,8,6);
        bc.strokeStyle="rgba(120,118,108,.7)";bc.lineWidth=0.7;bc.strokeRect(-4,-3,8,6);
        bc.fillStyle="rgba(90,88,82,.6)";
        bc.fillRect(-2.6,-1.4,5.2,0.8);bc.fillRect(-2.6,0.4,4,0.8);
        bc.restore();
      }
      bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.roundRect(px-12,py,25,46,3);bc.stroke();
    });

    // cold store doors on the far wall
    for(let i=0;i<3;i++){
      const dx0=M.x0*TILE+3, dy0=(M.y0+i)*TILE+7;
      bc.fillStyle="#4A5866";bc.fillRect(dx0,dy0,13,18);
      bc.fillStyle="#5E6E7C";bc.fillRect(dx0+1,dy0+1,11,16);
      bc.fillStyle="#8E9BA4";bc.fillRect(dx0+9,dy0+7,2.6,5);
      bc.strokeStyle=INK;bc.lineWidth=1.1;bc.strokeRect(dx0+.5,dy0+.5,12,17);
    }
    // a small desk with the book nobody wants to sign
    const bx=(M.x1)*TILE+8, by=(M.y1)*TILE+TILE-14;
    bc.fillStyle="#5E5044";bc.fillRect(bx-10,by-6,20,13);
    bc.fillStyle="#E8E2D4";bc.fillRect(bx-6,by-3,12,8);
    bc.strokeStyle="rgba(150,146,136,.7)";bc.lineWidth=0.8;
    bc.beginPath();bc.moveTo(bx,by-3);bc.lineTo(bx,by+5);bc.stroke();
    bc.strokeStyle=INK;bc.lineWidth=1.1;bc.strokeRect(bx-10,by-6,20,13);
  })();

  // ---- dirty utility (top half) ----
  (function(){
    const D=DIRTY;
    // hampers of soiled linen, overflowing
    [[10,28,"#8E4A3A"],[11,28,"#5E6B75"],[13,28,"#C8B23A"]].forEach(function(h,i){
      const px=h[0]*TILE+TILE/2, py=h[1]*TILE+TILE/2;
      bc.fillStyle="rgba(0,0,0,.34)";bc.beginPath();bc.arc(px+1,py+1,10,0,7);bc.fill();
      bc.fillStyle=h[2];bc.beginPath();bc.arc(px,py,9.5,0,7);bc.fill();
      bc.fillStyle="rgba(0,0,0,.28)";bc.beginPath();bc.arc(px,py,6.4,0,7);bc.fill();
      // scrubs stuffed in and spilling over the rim
      bc.fillStyle="#4E6E7A";
      bc.beginPath();bc.ellipse(px-2,py-2,5,3.6,0.4,0,7);bc.fill();
      bc.fillStyle="#3E5A66";
      bc.beginPath();bc.ellipse(px+3,py+1,4,3,-0.3,0,7);bc.fill();
      // a sleeve hanging out
      bc.save();bc.translate(px,py);bc.rotate(i*2.1);
      bc.fillStyle=["#4E6E7A","#6E5A8E","#5E7A5A"][i%3];
      bc.beginPath();
      bc.moveTo(6,0);bc.quadraticCurveTo(14,3,17,11);
      bc.lineTo(12,13);bc.quadraticCurveTo(10,5,4,4);
      bc.closePath();bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1;bc.stroke();
      bc.restore();
      bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.arc(px,py,9.5,0,7);bc.stroke();
    });
    // a couple of uniforms simply dropped on the floor
    [[12.5,27.5,0.7,"#4E6E7A"],[10.6,27.6,-0.5,"#6E5A8E"]].forEach(function(u){
      bc.save();bc.translate(u[0]*TILE,u[1]*TILE);bc.rotate(u[2]);
      bc.fillStyle="rgba(0,0,0,.26)";
      bc.beginPath();bc.roundRect(-9,-5,19,11,4);bc.fill();
      bc.fillStyle=u[3];
      bc.beginPath();bc.roundRect(-10,-6,19,11,4);bc.fill();
      bc.fillStyle="rgba(0,0,0,.16)";bc.fillRect(-8,-1,15,1.6);
      bc.fillStyle=u[3];
      bc.beginPath();bc.ellipse(-11,1,4,2.6,0.5,0,7);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1;
      bc.beginPath();bc.roundRect(-10,-6,19,11,4);bc.stroke();
      bc.restore();
    });
    bc.textAlign="left";bc.font="600 8px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(170,110,65,.8)";
    bc.fillText("DIRTY UTILITY",D.x0*TILE+3,D.y1*TILE+TILE-4);
    // sluice sinks along the top wall
    for(let i=0;i<2;i++){
      const sx=(D.x0+i)*TILE+TILE/2, sy=D.y0*TILE+15;
      bc.fillStyle="#2D3944";bc.beginPath();bc.roundRect(sx-11,sy-9,22,17,2);bc.fill();
      bc.fillStyle="#AEB8BF";bc.beginPath();bc.roundRect(sx-8,sy-7,16,13,2);bc.fill();
      bc.fillStyle="#7E8C96";bc.beginPath();bc.ellipse(sx,sy+1,4,3,0,0,7);bc.fill();
      bc.fillStyle="#5F6D77";bc.beginPath();bc.arc(sx,sy+1,1.5,0,7);bc.fill();
      bc.fillStyle="#8E9BA4";bc.fillRect(sx-1.4,sy-13,2.8,5);bc.fillRect(sx-5,sy-13,10,2.4);
      bc.strokeStyle=INK;bc.lineWidth=1;bc.strokeRect(sx-8,sy-7,16,13);
    }
    // the breaker panel on the east wall
    (function(){
      const ex=ELEC.x*TILE+TILE/2, ey=ELEC.y*TILE+9;
      bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(ex-11,ey-7,23,20);
      bc.fillStyle="#5E6B75";bc.beginPath();bc.roundRect(ex-12,ey-9,23,20,2);bc.fill();
      bc.fillStyle="#3A4854";bc.fillRect(ex-9,ey-6,17,14);
      bc.fillStyle="#8E9BA4";
      for(let r2=0;r2<3;r2++)for(let c2=0;c2<3;c2++)
        bc.fillRect(ex-7.5+c2*5.5,ey-4+r2*4.4,3.6,2.6);
      bc.fillStyle="#F2C94D";bc.fillRect(ex-9,ey-9,17,2.4);
      bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.roundRect(ex-12,ey-9,23,20,2);bc.stroke();
      // hazard flash
      bc.fillStyle="#F2C94D";
      bc.beginPath();bc.moveTo(ex+1,ey+13);bc.lineTo(ex-3,ey+18);bc.lineTo(ex,ey+18);
      bc.lineTo(ex-2,ey+23);bc.lineTo(ex+4,ey+17);bc.lineTo(ex+1,ey+17);bc.closePath();bc.fill();
    })();
  })();

  // ---- pharmacy (bottom half) ----
  (function(){
    const P=PHARM;
    for(let y=P.y0;y<=P.y1;y++)for(let x=P.x0;x<=P.x1;x++){
      bc.fillStyle="rgba(150,205,190,.05)";bc.fillRect(x*TILE,y*TILE,TILE,TILE);
    }
    bc.textAlign="left";bc.font="600 8.5px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(150,215,195,.8)";
    bc.fillText("PHARMACY",(P.x0+1)*TILE+4,P.y0*TILE+11);
    // shelving down both side walls, stacked with boxes
    [P.x0,P.x1].forEach(function(sx,si){
      for(let r2=0;r2<3;r2++){
        const px=sx*TILE+(si?6:2), py=(P.y0+r2)*TILE+8;
        bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(px+1,py+1,24,17);
        bc.fillStyle="#5E5044";bc.fillRect(px,py,24,17);
        bc.fillStyle="#75665A";bc.fillRect(px,py,24,3);
        for(let k=0;k<4;k++){
          bc.fillStyle=["#C9CFD4","#8FB4C4","#D8CBA8","#B57FD1","#8FE0C0"][(r2*4+k)%5];
          bc.fillRect(px+2+k*5.4,py+5,4.2,9);
        }
        bc.strokeStyle=INK;bc.lineWidth=1.1;bc.strokeRect(px,py,24,17);
      }
    });
    // dispensing counter across the middle
    const cy=(P.y0+1)*TILE+TILE/2;
    bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect((P.x0+1)*TILE+3,cy-8,TILE*2-4,18);
    bc.fillStyle="#6E573F";bc.fillRect((P.x0+1)*TILE+2,cy-10,TILE*2-4,18);
    bc.fillStyle="#856A48";bc.fillRect((P.x0+1)*TILE+2,cy-10,TILE*2-4,3.5);
    bc.strokeStyle=INK;bc.lineWidth=1.2;bc.strokeRect((P.x0+1)*TILE+2,cy-10,TILE*2-4,18);
    // a terminal and a basket of made-up bags
    bc.fillStyle="#0A1015";bc.fillRect((P.x0+1)*TILE+6,cy-7,16,9);
    bc.strokeStyle="#4FE08A";bc.lineWidth=1;bc.strokeRect((P.x0+1)*TILE+6.5,cy-6.5,15,8);
    bc.fillStyle="#8E9AA4";bc.beginPath();
    bc.roundRect((P.x0+2)*TILE+2,cy-6,16,12,2);bc.fill();
    for(let k=0;k<3;k++){
      bc.fillStyle="#E8E2D4";
      bc.fillRect((P.x0+2)*TILE+4+k*4.6,cy-4,3.4,8);
    }
    // a fridge for the cold stuff
    const fx=(P.x0+2)*TILE, fy=(P.y1)*TILE+6;
    bc.fillStyle="#C4CCD2";bc.beginPath();bc.roundRect(fx-11,fy,24,20,3);bc.fill();
    bc.fillStyle="#A9C4D2";bc.fillRect(fx-9,fy+2,20,9);
    bc.fillStyle="#8E99A2";bc.fillRect(fx+6,fy+13,3,5);
    bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.roundRect(fx-11,fy,24,20,3);bc.stroke();
    bc.fillStyle="rgba(150,215,195,.5)";bc.font="600 5px 'IBM Plex Mono',monospace";
    bc.textAlign="center";bc.fillText("2-8\u00b0C",fx+1,fy+27);
  })();

  // parked carts along the east wall
  [{y:13,c:"#4E6E8E",l:"LIN"},
   {y:21,c:"#7A5A8E",l:"IV"},{y:25,c:"#8E5B3A",l:"WST"}].forEach(function(p){
    const px=8*TILE+8, py=p.y*TILE+5;
    bc.fillStyle="rgba(0,0,0,.32)";bc.fillRect(px+1,py+1,22,23);
    bc.fillStyle=p.c;bc.beginPath();bc.roundRect(px,py,22,22,3);bc.fill();
    bc.fillStyle="rgba(255,255,255,.15)";bc.fillRect(px+3,py+4,16,4);
    bc.fillRect(px+3,py+12,16,4);
    bc.strokeStyle=INK;bc.lineWidth=1.2;bc.beginPath();bc.roundRect(px,py,22,22,3);bc.stroke();
    bc.fillStyle="rgba(255,255,255,.6)";bc.font="700 6px 'IBM Plex Mono',monospace";
    bc.textAlign="center";bc.fillText(p.l,px+11,py+21);
  });

  // ---- waiting room ----
  (function(){
    const W=WAIT;
    bc.textAlign="left";bc.font="600 8.5px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(150,190,205,.75)";
    bc.fillText("WAITING",W.x0*TILE+4,W.y0*TILE+11);
    bc.textAlign="center";

    // exit doors set into the west wall, with a lit threshold
    const dx=EXIT_DOOR.x*TILE, dy=EXIT_DOOR.y*TILE;
    bc.fillStyle="#141C22";bc.fillRect(dx,dy-TILE/2,TILE,TILE*2);
    bc.fillStyle="rgba(150,205,215,.20)";bc.fillRect(dx+2,dy-TILE/2+3,TILE-4,TILE*2-6);
    bc.fillStyle="rgba(190,230,240,.42)";
    bc.fillRect(dx+3,dy-TILE/2+4,TILE-6,TILE-6);
    bc.fillRect(dx+3,dy+TILE/2+2,TILE-6,TILE-6);
    bc.fillStyle="rgba(215,240,248,.75)";
    bc.fillRect(dx+2,dy+TILE/2-2.5,TILE-4,2.5);          // centre seam
    bc.fillStyle="#5C6E7A";bc.fillRect(dx,dy-TILE/2,3.5,TILE*2);   // track
    bc.fillStyle="rgba(255,255,255,.20)";bc.fillRect(dx,dy-TILE/2,1.2,TILE*2);
    // EXIT sign on the wall beside the doors
    bc.fillStyle="#0E1519";bc.beginPath();bc.roundRect(dx+TILE+2,dy-TILE/2-2,24,11,2);bc.fill();
    bc.strokeStyle="#3E5A50";bc.lineWidth=1;bc.strokeRect(dx+TILE+2.5,dy-TILE/2-1.5,23,10);
    bc.fillStyle="#4FE08A";bc.font="700 8px 'Barlow Condensed',sans-serif";
    bc.textAlign="center";bc.fillText("EXIT",dx+TILE+14,dy-TILE/2+6);
    // light spilling in from outside
    const gr=bc.createRadialGradient(dx,dy+TILE/2,4,dx,dy+TILE/2,TILE*2.4);
    gr.addColorStop(0,"rgba(180,230,240,.16)");gr.addColorStop(1,"rgba(180,230,240,0)");
    bc.fillStyle=gr;bc.fillRect(dx,dy-TILE*2,TILE*3,TILE*4);

    // seating around the edges, clear of the door approach
    [[W.x0,W.y0+2],[W.x0,W.y0+5],[W.x1,W.y0+1],[W.x1,W.y0+3],[W.x1,W.y0+5]]
      .forEach(function(seat){
        const cx=seat[0]*TILE+TILE/2, cy=seat[1]*TILE+TILE/2;
        bc.fillStyle="rgba(0,0,0,.28)";bc.beginPath();bc.roundRect(cx-9,cy-8,18,17,4);bc.fill();
        bc.fillStyle="#3E5A66";bc.beginPath();bc.roundRect(cx-9,cy-9,18,16,4);bc.fill();
        bc.fillStyle="#527A88";bc.beginPath();bc.roundRect(cx-6.5,cy-6.5,13,10,3);bc.fill();
        bc.fillStyle="rgba(255,255,255,.10)";bc.fillRect(cx-6.5,cy-6.5,13,2.2);
        bc.strokeStyle=INK;bc.lineWidth=1.1;
        bc.beginPath();bc.roundRect(cx-9,cy-9,18,16,4);bc.stroke();
      });

    // --- reception desk, top of the room ---
    (function(){
      const dx0=(W.x0+1)*TILE+2, dy0=W.y0*TILE+30, dw=TILE*2-4, dh=21;
      bc.fillStyle="rgba(0,0,0,.34)";bc.fillRect(dx0+3,dy0+3,dw,dh);
      bc.fillStyle="#6E573B";bc.fillRect(dx0,dy0,dw,dh);            // counter
      bc.fillStyle="#856A48";bc.fillRect(dx0,dy0,dw,4);
      bc.fillStyle="#5A462F";bc.fillRect(dx0,dy0+dh-5,dw,5);        // public-side lip
      bc.strokeStyle=INK;bc.lineWidth=1.3;bc.strokeRect(dx0,dy0,dw,dh);
      // monitor, keyboard, phone, sign-in clipboard
      bc.fillStyle="#0A1015";bc.fillRect(dx0+5,dy0+4,17,10);
      bc.fillStyle="#2E5E6E";bc.fillRect(dx0+6.5,dy0+5.5,14,7);
      bc.fillStyle="#20282F";bc.fillRect(dx0+26,dy0+6,16,7);
      bc.fillStyle="#4A5A66";
      for(let r2=0;r2<2;r2++)for(let c2=0;c2<5;c2++) bc.fillRect(dx0+27+c2*3,dy0+7+r2*3,2.2,1.8);
      bc.fillStyle="#171E24";bc.beginPath();bc.roundRect(dx0+46,dy0+5,9,9,2);bc.fill();
      bc.fillStyle="#E8E2D4";bc.fillRect(dx0+dw-16,dy0+4,12,9);
      bc.strokeStyle="#B9AF9C";bc.lineWidth=1;bc.strokeRect(dx0+dw-15.5,dy0+4.5,11,8);
      // bell
      bc.fillStyle="#C9A227";bc.beginPath();bc.arc(dx0+dw-24,dy0+dh-8,3,0,7);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1;bc.beginPath();bc.arc(dx0+dw-24,dy0+dh-8,3,0,7);bc.stroke();
      // desk chair behind it
      const chx=dx0+dw/2, chy=dy0-11;
      bc.fillStyle="rgba(0,0,0,.28)";bc.beginPath();bc.arc(chx,chy+1,8,0,7);bc.fill();
      bc.fillStyle="#2E3A44";bc.beginPath();bc.arc(chx,chy,7.5,0,7);bc.fill();
      bc.fillStyle="#3E4E5A";bc.beginPath();bc.arc(chx,chy,4.8,0,7);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1;bc.beginPath();bc.arc(chx,chy,7.5,0,7);bc.stroke();
      // RECEPTION plate on the counter face
      bc.fillStyle="rgba(230,220,200,.55)";bc.font="600 6px 'IBM Plex Mono',monospace";
      bc.textAlign="center";bc.fillText("RECEPTION",dx0+dw/2,dy0+dh-1.5);
    })();

    // potted plant in the corner
    const px=(W.x1)*TILE+16, py=(W.y1-1)*TILE+16;
    bc.fillStyle="rgba(0,0,0,.3)";bc.beginPath();bc.arc(px,py+1,9,0,7);bc.fill();
    bc.fillStyle="#7A5A3E";bc.beginPath();bc.arc(px,py,8,0,7);bc.fill();
    bc.fillStyle="#3E7A4E";
    for(let i=0;i<7;i++){const a=i/7*6.28;
      bc.beginPath();bc.ellipse(px+Math.cos(a)*4.5,py+Math.sin(a)*4.5,4,2.6,a,0,7);bc.fill();}
    bc.fillStyle="#2E6B44";bc.beginPath();bc.arc(px,py,3.4,0,7);bc.fill();
    // water cooler by the entrance
    const wx=(W.x0)*TILE+15, wy=(W.y1-1)*TILE+20;
    bc.fillStyle="#C9D3DA";bc.beginPath();bc.roundRect(wx-7,wy-10,14,20,3);bc.fill();
    bc.fillStyle="#6FC0DC";bc.beginPath();bc.roundRect(wx-5,wy-8,10,9,2);bc.fill();
    bc.strokeStyle=INK;bc.lineWidth=1;bc.strokeRect(wx-6.5,wy-9.5,13,19);
  })();

  // ---- lunch room ----
  //  x 10..13, y 29..35.  Door is on the west wall at y=32, so the
  //  band y=31..33 nearest x=10 is kept completely clear.
  (function(){
    const L=LUNCH;
    bc.textAlign="left";bc.font="600 8.5px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(200,160,110,.8)";
    bc.fillText("LUNCH ROOM",L.x0*TILE+4,L.y0*TILE+11);
    bc.textAlign="center";

    // scuffed walk-through lane from the door to the counter
    bc.fillStyle="rgba(255,246,230,.03)";
    bc.fillRect(L.x0*TILE, 38*TILE+6, TILE*3, TILE-12);

    function table(cx,cy){
      // chairs first so the top overlaps them
      [[-24,0],[24,0],[0,-22],[0,22]].forEach(function(o){
        const chx=cx+o[0], chy=cy+o[1];
        bc.fillStyle="rgba(0,0,0,.26)";bc.beginPath();bc.arc(chx,chy+1.5,7.6,0,7);bc.fill();
        bc.fillStyle="#3E4E44";bc.beginPath();bc.arc(chx,chy,7,0,7);bc.fill();
        bc.fillStyle="#55705E";bc.beginPath();bc.arc(chx,chy,4.6,0,7);bc.fill();
        bc.strokeStyle=INK;bc.lineWidth=1.1;bc.beginPath();bc.arc(chx,chy,7,0,7);bc.stroke();
      });
      bc.fillStyle="rgba(0,0,0,.34)";bc.beginPath();bc.ellipse(cx+2,cy+3,17,16,0,0,7);bc.fill();
      bc.fillStyle="#4A3B2A";bc.beginPath();bc.arc(cx,cy+4,6,0,7);bc.fill();     // floor base
      bc.fillStyle="#5E4A34";bc.fillRect(cx-2.6,cy-2,5.2,7);                      // pedestal
      bc.fillStyle="#6E573F";bc.beginPath();bc.arc(cx,cy-1,16.5,0,7);bc.fill();   // apron
      bc.fillStyle="#96784F";bc.beginPath();bc.arc(cx,cy-2.5,15.5,0,7);bc.fill(); // top
      const wg=bc.createLinearGradient(cx-16,cy-18,cx+16,cy+13);
      wg.addColorStop(0,"rgba(255,255,255,.11)");wg.addColorStop(1,"rgba(0,0,0,.15)");
      bc.fillStyle=wg;bc.beginPath();bc.arc(cx,cy-2.5,15.5,0,7);bc.fill();
      bc.save();bc.beginPath();bc.arc(cx,cy-2.5,15.5,0,7);bc.clip();
      bc.strokeStyle="rgba(70,52,34,.45)";bc.lineWidth=0.8;
      for(let i=-3;i<=3;i++){bc.beginPath();
        bc.moveTo(cx-16,cy-2.5+i*4.6);bc.lineTo(cx+16,cy-2.5+i*4.6);bc.stroke();}
      bc.restore();
      bc.strokeStyle=INK;bc.lineWidth=1.3;
      bc.beginPath();bc.arc(cx,cy-2.5,15.5,0,7);bc.stroke();
      return {cx:cx,cy:cy};
    }
    // one table high, one low — both clear of the y=32 door lane
    const t1=table(12.0*TILE, (L.y0+1.3)*TILE);
    // a mug on one, a tray on the other
    bc.fillStyle="#D8CFC0";bc.beginPath();bc.arc(t1.cx+6,t1.cy-7,3.8,0,7);bc.fill();
    bc.fillStyle="#5A3A22";bc.beginPath();bc.arc(t1.cx+6,t1.cy-7,2.4,0,7);bc.fill();
    bc.strokeStyle=INK;bc.lineWidth=1;bc.beginPath();bc.arc(t1.cx+6,t1.cy-7,3.8,0,7);bc.stroke();


    // --- counter + sink down the EAST wall, away from the door ---
    const cw=13, cx0=(L.x1+1)*TILE-cw-1, cy0=(L.y0+2)*TILE, ch=TILE*3.4;
    bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(cx0-2,cy0+2,cw+2,ch);
    bc.fillStyle="#5E5044";bc.fillRect(cx0,cy0,cw,ch);
    bc.fillStyle="#75665A";bc.fillRect(cx0,cy0,4,ch);                 // lit room-side lip
    bc.strokeStyle=INK;bc.lineWidth=1.2;bc.strokeRect(cx0,cy0,cw,ch);
    // sink basin recessed into the counter
    const sy=cy0+TILE*1.6;
    bc.fillStyle="#2A343C";bc.beginPath();bc.roundRect(cx0+2,sy,cw-4,26,2.5);bc.fill();
    bc.fillStyle="#B6C2CA";bc.beginPath();bc.roundRect(cx0+3,sy+1.5,cw-6,23,2);bc.fill();
    bc.fillStyle="#93A2AC";bc.beginPath();bc.ellipse(cx0+cw/2,sy+13,3.6,5,0,0,7);bc.fill();
    bc.fillStyle="#5F6D77";bc.beginPath();bc.arc(cx0+cw/2,sy+13,1.5,0,7);bc.fill();
    bc.fillStyle="#8E9BA4";bc.fillRect(cx0+cw-5,sy+9,5,2.6);           // tap over the basin
    bc.fillRect(cx0+cw-3,sy+4,2.4,8);
    bc.strokeStyle=INK;bc.lineWidth=1;bc.strokeRect(cx0+3,sy+1.5,cw-6,23);
    // coffee maker at the top of the counter
    bc.fillStyle="#22282E";bc.beginPath();bc.roundRect(cx0+2,cy0+5,cw-4,16,2);bc.fill();
    bc.fillStyle="#C2803E";bc.fillRect(cx0+3.5,cy0+12,cw-7,6);
    bc.fillStyle="#E8B87A";bc.fillRect(cx0+3.5,cy0+15,cw-7,3);
    bc.strokeStyle=INK;bc.lineWidth=1;bc.strokeRect(cx0+2,cy0+5,cw-4,16);

    // --- fridge: top-left corner, north of the door lane ---
    (function(){
      const x0=L.x0*TILE+2, y0=L.y0*TILE+16, w=17, h=TILE*1.3;
      bc.fillStyle="rgba(0,0,0,.34)";bc.fillRect(x0+3,y0+3,w,h);
      bc.fillStyle="#AEB7BE";bc.fillRect(x0,y0,w,h);
      const lg=bc.createLinearGradient(x0,0,x0+w,0);
      lg.addColorStop(0,"rgba(255,255,255,.16)");lg.addColorStop(1,"rgba(0,0,0,.16)");
      bc.fillStyle=lg;bc.fillRect(x0,y0,w,h);
      bc.fillStyle="#D3DAE0";bc.fillRect(x0+w-4.5,y0,4.5,h);
      bc.fillStyle="#8C959D";bc.fillRect(x0+w-4.5,y0+h*0.44,4.5,2);
      bc.fillStyle="#6E777F";bc.fillRect(x0+w-3,y0+h*0.16,2.2,8);
      bc.fillRect(x0+w-3,y0+h*0.60,2.2,9);
      bc.fillStyle="#8A6E4A";bc.fillRect(x0+3,y0+6,8,5);
      bc.strokeStyle=INK;bc.lineWidth=1.3;bc.strokeRect(x0,y0,w,h);
    })();

    // --- vending machine: bottom-left, south of the door lane ---
    (function(){
      const x0=L.x0*TILE+2, y0=(L.y1-1)*TILE-6, w=17, h=TILE*1.15;
      bc.fillStyle="rgba(0,0,0,.34)";bc.fillRect(x0+3,y0+3,w,h);
      bc.fillStyle="#333E4A";bc.fillRect(x0,y0,w,h);
      const vg2=bc.createLinearGradient(x0,0,x0+w,0);
      vg2.addColorStop(0,"rgba(255,255,255,.12)");vg2.addColorStop(1,"rgba(0,0,0,.20)");
      bc.fillStyle=vg2;bc.fillRect(x0,y0,w,h);
      bc.fillStyle="#0E1620";bc.fillRect(x0+w-6,y0+2,6,h-4);
      ["#8FE04A","#E0544A","#4A9CE0","#E0B44A","#B57FD1"].forEach(function(c,i){
        bc.fillStyle=c;bc.fillRect(x0+w-5,y0+4+i*6.2,4,4.2);
      });
      bc.fillStyle="rgba(170,220,245,.18)";bc.fillRect(x0+w-6,y0+2,2.4,h-4);
      bc.fillStyle="#4A5866";bc.fillRect(x0+2,y0+2,w-9,8);
      bc.fillStyle="#8FE04A";bc.fillRect(x0+3,y0+3.2,w-11,2.6);
      bc.strokeStyle=INK;bc.lineWidth=1.3;bc.strokeRect(x0,y0,w,h);
    })();
  })();

  // ---- operating room ----
  (function(){
    const O=OR;
    // sterile floor, cooler and cleaner than the ward
    for(let y=O.y0;y<=O.y1;y++)for(let x=O.x0;x<=O.x1;x++){
      bc.fillStyle="rgba(150,200,215,.07)";bc.fillRect(x*TILE,y*TILE,TILE,TILE);
      bc.strokeStyle="rgba(190,225,240,.06)";bc.lineWidth=0.6;
      bc.beginPath();bc.moveTo(x*TILE+TILE/2,y*TILE);bc.lineTo(x*TILE+TILE/2,y*TILE+TILE);
      bc.moveTo(x*TILE,y*TILE+TILE/2);bc.lineTo(x*TILE+TILE,y*TILE+TILE/2);bc.stroke();
    }
    bc.textAlign="left";bc.font="600 8.5px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(160,205,220,.75)";
    bc.fillText("OPERATING ROOM",O.x0*TILE+4,O.y0*TILE+11);

    const cx=(OR_TABLE.x+0.5)*TILE, cy=(OR_TABLE.y+0.5)*TILE;
    // surgical light rig overhead
    const lg=bc.createRadialGradient(cx,cy,10,cx,cy,TILE*2.6);
    lg.addColorStop(0,"rgba(235,248,255,.20)");lg.addColorStop(1,"rgba(235,248,255,0)");
    bc.fillStyle=lg;bc.fillRect(cx-TILE*3,cy-TILE*3,TILE*6,TILE*6);
    // operating table
    bc.fillStyle="rgba(0,0,0,.34)";bc.beginPath();bc.roundRect(cx-13,cy-30,28,62,5);bc.fill();
    bc.fillStyle="#5A6874";bc.beginPath();bc.roundRect(cx-14,cy-32,28,62,5);bc.fill();
    bc.fillStyle="#28323C";bc.beginPath();bc.roundRect(cx-11,cy-29,22,56,4);bc.fill();
    bc.fillStyle="#3E7A8E";bc.beginPath();bc.roundRect(cx-10,cy-28,20,54,4);bc.fill();
    bc.fillStyle="rgba(255,255,255,.10)";bc.fillRect(cx-10,cy-28,20,4);
    bc.strokeStyle=INK;bc.lineWidth=1.4;bc.beginPath();bc.roundRect(cx-14,cy-32,28,62,5);bc.stroke();
    bc.fillStyle="#8FA3B4";bc.fillRect(cx-4,cy+30,8,6);

    // anaesthesia machine at the head
    bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(cx-14,cy-74,28,26);
    bc.fillStyle="#3A4854";bc.beginPath();bc.roundRect(cx-16,cy-76,28,26,3);bc.fill();
    bc.fillStyle="#0C1218";bc.fillRect(cx-13,cy-73,22,11);
    bc.strokeStyle="#4FE08A";bc.lineWidth=1.2;
    bc.beginPath();
    for(let i=0;i<18;i++){const yy=cy-25-((i===8)?5:(i===9)?-2:0);
      if(i)bc.lineTo(cx-12+i,yy);else bc.moveTo(cx-12+i,yy);}
    bc.stroke();
    [["#4FBF6A",0],["#D8C24A",1],["#C3CED6",2]].forEach(function(o,i){
      bc.fillStyle=o[0];bc.beginPath();bc.arc(cx-9+i*8,cy-56,3.2,0,7);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1;bc.stroke();
    });
    bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.roundRect(cx-16,cy-76,28,26,3);bc.stroke();

    // instrument trolleys, draped
    [[cx+34,cy-18],[cx+34,cy+14]].forEach(function(o){
      bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(o[0]-14,o[1]-9,28,20);
      bc.fillStyle="#C7D2DA";bc.beginPath();bc.roundRect(o[0]-15,o[1]-11,28,20,2);bc.fill();
      bc.fillStyle="#9FB2C0";
      for(let i=0;i<4;i++) bc.fillRect(o[0]-11+i*6,o[1]-7,3,12);
      bc.strokeStyle=INK;bc.lineWidth=1.2;bc.beginPath();bc.roundRect(o[0]-15,o[1]-11,28,20,2);bc.stroke();
    });
    // surgical lamp heads, hanging over the table
    [[-32,-20],[32,-20],[0,26]].forEach(function(o){
      bc.fillStyle="rgba(0,0,0,.28)";
      bc.beginPath();bc.arc(cx+o[0]+2,cy+o[1]+2,13,0,7);bc.fill();
      bc.fillStyle="#8FA3B4";bc.beginPath();bc.arc(cx+o[0],cy+o[1],13,0,7);bc.fill();
      bc.fillStyle="#E8F4FA";bc.beginPath();bc.arc(cx+o[0],cy+o[1],10,0,7);bc.fill();
      bc.fillStyle="rgba(255,255,255,.9)";bc.beginPath();bc.arc(cx+o[0],cy+o[1],5.5,0,7);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.arc(cx+o[0],cy+o[1],13,0,7);bc.stroke();
      // arm back to the ceiling mount
      bc.strokeStyle="rgba(143,163,180,.8)";bc.lineWidth=3;
      bc.beginPath();bc.moveTo(cx+o[0],cy+o[1]);bc.lineTo(cx,cy);bc.stroke();
    });
    bc.fillStyle="#6E7F8C";bc.beginPath();bc.arc(cx,cy,6,0,7);bc.fill();
    bc.strokeStyle=INK;bc.lineWidth=1.2;bc.stroke();

    // the floor has taken a beating
    (function(){
      function rr(i,j){const v=Math.sin(i*57.3+j*91.7)*43758.5453;return v-Math.floor(v);}
      // pooled under the table
      for(let i=0;i<11;i++){
        const a=rr(i,1)*6.283, d=10+rr(i,2)*40;
        const bx=cx+Math.cos(a)*d*0.8, by=cy+Math.sin(a)*d;
        const r=4+rr(i,3)*9;
        bc.fillStyle="rgba(88,10,14,"+(0.34+rr(i,4)*0.30)+")";
        bc.save();bc.translate(bx,by);bc.scale(1+rr(i,9)*0.5,1);
        bc.beginPath();bc.arc(0,0,r,0,7);bc.fill();bc.restore();
        bc.fillStyle="rgba(140,22,26,"+(0.20+rr(i,5)*0.22)+")";
        bc.beginPath();bc.arc(bx-r*0.25,by-r*0.25,r*0.45,0,7);bc.fill();
        for(let k=0;k<3;k++){
          const a2=rr(i*3+k,6)*6.283, d2=r+3+rr(k,7)*9;
          bc.fillStyle="rgba(110,16,20,"+(0.28*rr(k,8))+")";
          bc.beginPath();bc.arc(bx+Math.cos(a2)*d2,by+Math.sin(a2)*d2,1+rr(k,10)*2,0,7);bc.fill();
        }
      }
      // trodden through and walked out toward the door
      for(let i=0;i<9;i++){
        bc.fillStyle="rgba(96,14,18,"+(0.20-i*0.018)+")";
        bc.beginPath();
        bc.ellipse(cx-18-i*4+rr(i,11)*7, cy+34+i*7, 3.6,5.4, 0.2,0,7);bc.fill();
      }
      // soaked sponges and a swab count that nobody is winning
      for(let i=0;i<6;i++){
        const bx=cx+(rr(i,12)-0.5)*90, by=cy+(rr(i,13)-0.5)*80;
        bc.save();bc.translate(bx,by);bc.rotate(rr(i,14)*3.14);
        bc.fillStyle="rgba(0,0,0,.25)";bc.fillRect(-4,-3,9,7);
        bc.fillStyle= i%3? "#8E2A2E":"#C9CFD4";
        bc.fillRect(-5,-4,9,7);
        bc.fillStyle="rgba(120,18,22,.55)";bc.fillRect(-5,-4,9,3);
        bc.restore();
      }
      // kick bucket, well used
      const kx=cx+38, ky=cy+34;
      bc.fillStyle="rgba(0,0,0,.3)";bc.beginPath();bc.arc(kx+1,ky+1,11,0,7);bc.fill();
      bc.fillStyle="#59687A";bc.beginPath();bc.arc(kx,ky,10,0,7);bc.fill();
      bc.fillStyle="#7A1418";bc.beginPath();bc.arc(kx,ky,6.5,0,7);bc.fill();
      bc.fillStyle="rgba(150,26,30,.6)";bc.beginPath();bc.arc(kx-2,ky-2,3,0,7);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1.2;bc.beginPath();bc.arc(kx,ky,10,0,7);bc.stroke();
    })();

    // ---- more of the room ----
    // electrosurgical unit stacked on a cart, with its pedal on the floor
    (function(){
      const ex=O.x0*TILE+18, ey=(O.y0+1)*TILE+6;
      bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(ex-11,ey+2,24,34);
      bc.fillStyle="#4A5560";bc.beginPath();bc.roundRect(ex-13,ey,24,34,3);bc.fill();
      bc.fillStyle="#D8B23A";bc.fillRect(ex-10,ey+3,18,10);      // diathermy face
      bc.fillStyle="#1A222A";bc.fillRect(ex-8,ey+5,7,6);
      bc.fillStyle="#8FE04A";bc.fillRect(ex+1,ey+6,5,2);
      bc.fillStyle="#2E3A44";bc.fillRect(ex-10,ey+16,18,14);      // suction canister below
      bc.fillStyle="#7A1418";bc.fillRect(ex-8,ey+22,14,7);
      bc.fillStyle="rgba(160,30,34,.6)";bc.fillRect(ex-8,ey+22,14,2.4);
      bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.roundRect(ex-13,ey,24,34,3);bc.stroke();
      bc.fillStyle="#3A4854";bc.beginPath();bc.roundRect(ex-9,ey+38,17,9,2);bc.fill();  // foot pedal
      bc.fillStyle="#C8B23A";bc.fillRect(ex-6,ey+40,11,2.4);
      bc.strokeStyle=INK;bc.lineWidth=1;bc.strokeRect(ex-9,ey+38,17,9);
      bc.strokeStyle="rgba(200,178,58,.5)";bc.lineWidth=1.6;
      bc.beginPath();bc.moveTo(ex+2,ey+42);bc.quadraticCurveTo(ex+22,ey+46,ex+34,ey+30);bc.stroke();
    })();

    // C-arm imaging, parked out of the way
    (function(){
      const ax=O.x1*TILE+2, ay=(O.y0+3)*TILE+10;
      bc.fillStyle="rgba(0,0,0,.3)";bc.beginPath();bc.arc(ax+1,ay+1,17,0,7);bc.fill();
      bc.strokeStyle="#7E8C98";bc.lineWidth=6;
      bc.beginPath();bc.arc(ax,ay,15,Math.PI*0.35,Math.PI*1.65);bc.stroke();
      bc.strokeStyle=INK;bc.lineWidth=1.2;
      bc.beginPath();bc.arc(ax,ay,15,Math.PI*0.35,Math.PI*1.65);bc.stroke();
      bc.fillStyle="#5A6774";bc.beginPath();bc.arc(ax,ay-15,6,0,7);bc.fill();
      bc.fillStyle="#3E4A56";bc.beginPath();bc.arc(ax,ay+15,7,0,7);bc.fill();
      bc.fillStyle="#8FA3B4";bc.fillRect(ax-4,ay-4,8,8);
      bc.strokeStyle=INK;bc.lineWidth=1.1;bc.strokeRect(ax-4,ay-4,8,8);
    })();

    // back table of instruments, laid out and half used
    (function(){
      const bx=cx-76, by=(O.y0)*TILE+22;
      bc.fillStyle="rgba(0,0,0,.28)";bc.fillRect(bx-21,by+2,44,20);
      bc.fillStyle="#7E8C98";bc.beginPath();bc.roundRect(bx-22,by,44,20,2);bc.fill();
      bc.fillStyle="#C7D2DA";bc.beginPath();bc.roundRect(bx-20,by+2,40,16,2);bc.fill();
      // clamps, scissors, a scalpel — some already bloodied
      for(let i=0;i<9;i++){
        const ix=bx-17+i*4.2;
        bc.strokeStyle= i<5? "rgba(122,20,24,.9)" : "#8E9BA4";
        bc.lineWidth=1.6;bc.lineCap="round";
        bc.beginPath();bc.moveTo(ix,by+5);bc.lineTo(ix+1.6,by+15);bc.stroke();
      }
      bc.fillStyle="#8E2A2E";bc.fillRect(bx+8,by+5,9,4);
      bc.fillStyle="#C9CFD4";bc.fillRect(bx+8,by+11,9,4);
      bc.strokeStyle=INK;bc.lineWidth=1.2;bc.beginPath();bc.roundRect(bx-22,by,44,20,2);bc.stroke();
    })();

    // IV poles with pressure bags, running fast
    [[cx-44,cy+16],[cx-44,cy+44]].forEach(function(o,i){
      const ix=o[0], iy=o[1];
      bc.fillStyle="rgba(0,0,0,.3)";bc.beginPath();bc.arc(ix,iy+1,8,0,7);bc.fill();
      bc.strokeStyle="#93A5B2";bc.lineWidth=2;
      for(let k=0;k<5;k++){const a2=k/5*6.283;
        bc.beginPath();bc.moveTo(ix,iy);bc.lineTo(ix+Math.cos(a2)*7,iy+Math.sin(a2)*7);bc.stroke();}
      bc.fillStyle="#9FB2C0";bc.beginPath();bc.arc(ix,iy,3,0,7);bc.fill();
      bc.fillStyle= i? "rgba(196,228,242,.85)":"rgba(150,24,28,.85)";   // saline and blood
      bc.beginPath();bc.roundRect(ix+3,iy-8,6,10,2);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1;bc.stroke();
      bc.fillStyle="#3A4854";bc.fillRect(ix-9,iy-6,6,8);              // pump
      bc.fillStyle="#5FD08C";bc.fillRect(ix-8,iy-4,4,2);
    })

    // sharps bin and a specimen trolley by the wall
    ;(function(){
      const sx2=O.x1*TILE+8, sy2=(O.y0)*TILE+14;
      bc.fillStyle="#C8B23A";bc.beginPath();bc.roundRect(sx2-8,sy2,16,18,2);bc.fill();
      bc.fillStyle="#8E7E1E";bc.fillRect(sx2-8,sy2,16,5);
      bc.fillStyle="#1A222A";bc.fillRect(sx2-5,sy2+1.5,10,2.4);
      bc.strokeStyle=INK;bc.lineWidth=1.2;bc.beginPath();bc.roundRect(sx2-8,sy2,16,18,2);bc.stroke();
      bc.fillStyle="rgba(255,255,255,.5)";bc.font="700 5px 'IBM Plex Mono',monospace";
      bc.textAlign="center";bc.fillText("SHARPS",sx2,sy2+13);
    })();

    // scrub sink by the door
    const sx=(O.x0+1)*TILE-4, sy=(O.y1)*TILE+TILE-12;
    bc.fillStyle="#2D3944";bc.beginPath();bc.roundRect(sx-12,sy-10,26,16,2);bc.fill();
    bc.fillStyle="#C3CED6";bc.beginPath();bc.roundRect(sx-9,sy-8,20,11,3);bc.fill();
    bc.fillStyle="#8E9BA4";bc.fillRect(sx-1.4,sy-14,2.8,5);
    bc.strokeStyle=INK;bc.lineWidth=1;bc.strokeRect(sx-9,sy-8,20,11);
    // red line and sign over the corridor door
    bc.fillStyle="rgba(255,80,90,.18)";bc.fillRect(6*TILE,(O.y1+1)*TILE-5,3*TILE,4);
    bc.fillStyle="#0E1519";bc.beginPath();bc.roundRect(6*TILE+4,(O.y1)*TILE+8,3*TILE-8,12,2);bc.fill();
    bc.strokeStyle="#3E5462";bc.lineWidth=1;bc.strokeRect(6*TILE+4.5,(O.y1)*TILE+8.5,3*TILE-9,11);
    bc.fillStyle="#9FD6E0";bc.font="700 9px 'Barlow Condensed',sans-serif";bc.textAlign="center";
    bc.fillText("OR · STERILE",7.5*TILE,(O.y1)*TILE+17);
  })();

  // ---- recovery bay ----
  (function(){
    const R2=RECOV;
    for(let y=R2.y0;y<=R2.y1;y++)for(let x=R2.x0;x<=R2.x1;x++){
      bc.fillStyle="rgba(150,205,190,.06)";bc.fillRect(x*TILE,y*TILE,TILE,TILE);
      bc.strokeStyle="rgba(190,235,220,.05)";bc.lineWidth=0.6;
      bc.beginPath();bc.moveTo(x*TILE+TILE/2,y*TILE);bc.lineTo(x*TILE+TILE/2,y*TILE+TILE);
      bc.moveTo(x*TILE,y*TILE+TILE/2);bc.lineTo(x*TILE+TILE,y*TILE+TILE/2);bc.stroke();
    }
    bc.textAlign="left";bc.font="600 8.5px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(150,215,195,.75)";
    bc.fillText("RECOVERY",R2.x0*TILE+4,R2.y0*TILE+11);
    // two recovery beds — the near one already has someone coming round
    [[R2.x0+1,R2.y0+1],[R2.x1,R2.y0+1]].forEach(function(b2,i){
      const px=b2[0]*TILE, py=b2[1]*TILE;
      const occupied=true;
      bc.fillStyle="rgba(0,0,0,.32)";bc.fillRect(px-9,py+2,26,52);
      bc.fillStyle="#59687A";bc.beginPath();bc.roundRect(px-11,py,26,52,4);bc.fill();
      bc.fillStyle="#28323C";bc.beginPath();bc.roundRect(px-8,py+3,20,46,3);bc.fill();
      bc.fillStyle="#B9C6D0";bc.beginPath();bc.roundRect(px-7,py+4,18,44,3);bc.fill();
      bc.fillStyle="#D7E1E8";bc.beginPath();bc.roundRect(px-6,py+5,16,9,3);bc.fill();
      // side rails up, as they should be post-op
      bc.fillStyle="#7A8C9C";
      bc.beginPath();bc.roundRect(px-11,py+12,4,28,2);bc.fill();
      bc.beginPath();bc.roundRect(px+11,py+12,4,28,2);bc.fill();

      if(occupied){
        // patient, out cold under a warmed blanket
        bc.fillStyle="#9FC4D6";bc.beginPath();bc.roundRect(px-6,py+16,16,7,2);bc.fill();
        bc.fillStyle="#6E8798";bc.beginPath();bc.roundRect(px-7,py+21,18,26,3);bc.fill();
        bc.fillStyle="#7F98A9";bc.fillRect(px-7,py+21,18,3);
        bc.fillStyle="rgba(0,0,0,.14)";
        for(let k=1;k<3;k++) bc.fillRect(px-6,py+25+k*7,16,1.4);
        bc.fillStyle="#D6A87E";
        bc.beginPath();bc.roundRect(px-8,py+24,4,9,2);bc.fill();
        bc.beginPath();bc.roundRect(px+8,py+24,4,9,2);bc.fill();
        // oxygen mask and a drip running in
        bc.strokeStyle="#9FB2C0";bc.lineWidth=1.6;
        bc.beginPath();bc.moveTo(px+2,py+11);bc.lineTo(px+12,py+4);bc.stroke();
        bc.fillStyle="rgba(190,225,240,.6)";
        bc.beginPath();bc.ellipse(px+2,py+11,4.4,3.4,0,0,7);bc.fill();
        bc.strokeStyle="rgba(196,228,242,.75)";bc.lineWidth=1.3;
        bc.beginPath();bc.moveTo(px-9,py+26);bc.quadraticCurveTo(px-16,py+18,px-15,py+8);bc.stroke();
        // pulse ox on a finger
        bc.fillStyle="#E05A5A";bc.fillRect(px+9,py+30,3.4,3);
      }
      bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.roundRect(px-11,py,26,52,4);bc.stroke();

      // monitor on the wall, live for the occupied bed
      bc.fillStyle="#0A1015";bc.fillRect(px-10,py-16,24,14);
      bc.strokeStyle= occupied? "#4FE08A":"#3E5462";bc.lineWidth=1;
      bc.strokeRect(px-9.5,py-15.5,23,13);
      if(occupied){
        bc.strokeStyle="#4FE08A";bc.lineWidth=1.1;bc.beginPath();
        for(let k=0;k<20;k++){
          let yy=py-10;
          if(k===9) yy-=4.5; else if(k===10) yy+=2;
          if(k)bc.lineTo(px-8+k,yy);else bc.moveTo(px-8+k,yy);
        }
        bc.stroke();
        bc.strokeStyle="#38D6E0";bc.lineWidth=1;bc.beginPath();
        for(let k=0;k<20;k++){
          const yy=py-4.5-Math.sin(k*0.55)*1.8;
          if(k)bc.lineTo(px-8+k,yy);else bc.moveTo(px-8+k,yy);
        }
        bc.stroke();
        bc.fillStyle="#4FE08A";bc.font="700 6px 'IBM Plex Mono',monospace";
        bc.textAlign="right";bc.fillText("72",px+12,py-9);
        bc.fillStyle="#38D6E0";bc.fillText("96",px+12,py-3.5);
        bc.textAlign="left";
      } else {
        bc.fillStyle="rgba(90,110,125,.6)";bc.fillRect(px-8,py-9,20,1.2);
      }
      // a nurse keeping an eye on the occupied one
      if(occupied){
        const nx=px+22, ny=py+22;
        bc.fillStyle="rgba(0,0,0,.28)";bc.beginPath();bc.ellipse(nx,ny+9,9,4,0,0,7);bc.fill();
      }
    });
 // a workstation in the corner
    (function(){
      const dx0=(R2.x1)*TILE-6, dy0=(R2.y1)*TILE+2, dw=26, dh=20;
      bc.fillStyle="rgba(0,0,0,.34)";bc.fillRect(dx0+2,dy0+2,dw,dh);
      bc.fillStyle="#6E573B";bc.fillRect(dx0,dy0,dw,dh);
      bc.fillStyle="#856A48";bc.fillRect(dx0,dy0,dw,3.5);
      bc.strokeStyle=INK;bc.lineWidth=1.2;bc.strokeRect(dx0,dy0,dw,dh);
      // keyboard on the desk
      bc.fillStyle="#20282F";bc.fillRect(dx0+4,dy0+13,18,5);
      bc.fillStyle="#4A5A66";
      for(let c2=0;c2<6;c2++) bc.fillRect(dx0+5+c2*3,dy0+14.5,2,2);
      // chair behind it
      bc.fillStyle="rgba(0,0,0,.28)";bc.beginPath();bc.arc(dx0+dw/2,dy0-11,8,0,7);bc.fill();
      bc.fillStyle="#2E3A44";bc.beginPath();bc.arc(dx0+dw/2,dy0-12,7.4,0,7);bc.fill();
      bc.fillStyle="#3E4E5A";bc.beginPath();bc.arc(dx0+dw/2,dy0-12,4.6,0,7);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1;bc.beginPath();bc.arc(dx0+dw/2,dy0-12,7.4,0,7);bc.stroke();
    })();

    // handover pad marking
    bc.fillStyle="rgba(120,215,190,.08)";
    bc.fillRect(REC_SPOT.x*TILE+3,REC_SPOT.y*TILE+3,TILE-6,TILE-6);
  })();

  // ---- PPE zones beside the OR door ----
  PPE_ZONES.forEach(function(z){
    const px=z.x*TILE, py=z.y*TILE;
    bc.fillStyle="rgba(150,205,225,.07)";bc.fillRect(px+2,py+2,TILE-4,TILE-4);
    bc.strokeStyle="rgba(159,214,224,.35)";bc.lineWidth=1.4;
    bc.setLineDash([4,3]);bc.strokeRect(px+3,py+3,TILE-6,TILE-6);bc.setLineDash([]);
    // gown hooks and a glove box on the wall above
    bc.fillStyle="#C6D2DA";
    for(let i=0;i<2;i++) bc.fillRect(px+8+i*10,py+5,7,10);
    bc.fillStyle="#5FA8C4";bc.fillRect(px+8,py+16,17,5);
    bc.fillStyle="rgba(159,214,224,.7)";bc.font="700 6px 'IBM Plex Mono',monospace";
    bc.textAlign="center";bc.fillText("PPE",px+TILE/2,py+TILE-5);
  });

  // ---- washroom: small, one door, off the waiting room ----
  (function(){
    const W2=WASH;
    for(let y=W2.y0;y<=W2.y1;y++)for(let x=W2.x0;x<=W2.x1;x++){
      bc.fillStyle="rgba(120,160,180,.055)";bc.fillRect(x*TILE,y*TILE,TILE,TILE);
      bc.strokeStyle="rgba(180,215,230,.07)";bc.lineWidth=0.6;
      bc.beginPath();bc.moveTo(x*TILE+TILE/2,y*TILE);bc.lineTo(x*TILE+TILE/2,y*TILE+TILE);
      bc.moveTo(x*TILE,y*TILE+TILE/2);bc.lineTo(x*TILE+TILE,y*TILE+TILE/2);bc.stroke();
    }
    bc.textAlign="center";bc.font="600 7px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(150,180,200,.7)";
    bc.fillText("WC",(W2.x0+W2.x1+1)/2*TILE,W2.y1*TILE+TILE-5);
    // two cubicles across the back
    WASH_STALLS.forEach(function(st,i){
      const px=st.x*TILE, py=st.y*TILE;
      bc.fillStyle="#2E3B45";bc.fillRect(px+1,py+2,TILE-2,TILE*1.25);
      bc.fillStyle="#394854";bc.fillRect(px+3,py+4,TILE-6,TILE*1.05);
      bc.strokeStyle=INK;bc.lineWidth=1.2;bc.strokeRect(px+1,py+2,TILE-2,TILE*1.25);
      bc.fillStyle="#D7DEE3";bc.beginPath();bc.ellipse(px+TILE/2,py+18,6,7.5,0,0,7);bc.fill();
      bc.fillStyle="#AEB8BF";bc.beginPath();bc.ellipse(px+TILE/2,py+18,3.4,4.6,0,0,7);bc.fill();
      bc.fillStyle="#C6CFD5";bc.fillRect(px+TILE/2-6,py+6,12,6);
      bc.strokeStyle=INK;bc.lineWidth=1;bc.beginPath();bc.ellipse(px+TILE/2,py+18,6,7.5,0,0,7);bc.stroke();
      bc.fillStyle="rgba(190,215,228,.6)";bc.font="700 7px 'Barlow Condensed',sans-serif";
      bc.fillText(i?"W":"M",px+TILE/2,py+1);
    });
    // one sink and a mirror on the near wall
    const sx=(W2.x0+1)*TILE+TILE/2, sy=(W2.y1)*TILE+TILE-10;
    bc.fillStyle="#2D3944";bc.beginPath();bc.roundRect(sx-11,sy-9,22,14,2);bc.fill();
    bc.fillStyle="#C3CED6";bc.beginPath();bc.roundRect(sx-8,sy-7,16,10,3);bc.fill();
    bc.fillStyle="#93A2AC";bc.beginPath();bc.ellipse(sx,sy-2,3.4,2.4,0,0,7);bc.fill();
    bc.fillStyle="#8E9BA4";bc.fillRect(sx-1.4,sy-12,2.8,4);
    bc.strokeStyle=INK;bc.lineWidth=1;bc.strokeRect(sx-8,sy-7,16,10);
    bc.fillStyle="rgba(180,215,232,.16)";bc.fillRect(sx-9,sy-19,18,6);
    bc.strokeStyle="rgba(190,225,240,.3)";bc.lineWidth=1;bc.strokeRect(sx-9,sy-19,18,6);
    // one of them has not been flushed
    (function(){
      const st=WASH_STALLS[0];
      const px=st.x*TILE+TILE/2, py=st.y*TILE+18;
      bc.fillStyle="#6E4A2A";
      bc.beginPath();bc.ellipse(px,py+1,3.6,2.6,0.3,0,7);bc.fill();
      bc.fillStyle="#5A3A1E";
      bc.beginPath();bc.ellipse(px-1.4,py-0.6,2.2,1.6,0.2,0,7);bc.fill();
      bc.beginPath();bc.ellipse(px+1.6,py+1.4,1.8,1.3,-0.3,0,7);bc.fill();
      bc.fillStyle="rgba(120,150,90,.20)";
      bc.beginPath();bc.ellipse(px,py,5.4,4,0,0,7);bc.fill();
    })();
    // paper, unravelled and trodden about
    (function(){
      function rr(i,j){const v=Math.sin(i*61.7+j*37.3)*43758.5453;return v-Math.floor(v);}
      // the roll on the wall, half hanging
      const hx=(W2.x0+2)*TILE+8, hy=(W2.y0+1)*TILE+6;
      bc.fillStyle="#8E9AA4";bc.fillRect(hx-1.5,hy-2,3,10);
      bc.fillStyle="#EDEAE2";bc.beginPath();bc.arc(hx+5,hy+4,5.4,0,7);bc.fill();
      bc.fillStyle="#C9C4B8";bc.beginPath();bc.arc(hx+5,hy+4,1.8,0,7);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1;bc.beginPath();bc.arc(hx+5,hy+4,5.4,0,7);bc.stroke();
      bc.fillStyle="#F2F0E8";
      bc.beginPath();
      bc.moveTo(hx+2,hy+8);
      bc.quadraticCurveTo(hx+10,hy+18,hx+4,hy+30);
      bc.lineTo(hx+10,hy+31);
      bc.quadraticCurveTo(hx+16,hy+17,hx+8,hy+8);
      bc.closePath();bc.fill();
      bc.strokeStyle="rgba(150,150,140,.4)";bc.lineWidth=0.7;bc.stroke();
      // sheets on the floor
      for(let i=0;i<7;i++){
        const fx=(W2.x0+rr(i,1)*3)*TILE+8, fy=(W2.y0+rr(i,2)*3)*TILE+10;
        bc.save();bc.translate(fx,fy);bc.rotate(rr(i,3)*3.14);
        bc.fillStyle="rgba(0,0,0,.20)";
        bc.beginPath();bc.roundRect(-5,-3.5,11,7,2);bc.fill();
        bc.fillStyle= i%4? "#EDEAE2":"#DCD8CE";
        bc.beginPath();bc.roundRect(-6,-4,11,7,2);bc.fill();
        bc.strokeStyle="rgba(140,140,130,.35)";bc.lineWidth=0.6;
        bc.beginPath();bc.moveTo(-3,-4);bc.lineTo(-3,3);bc.stroke();
        bc.beginPath();bc.moveTo(1,-4);bc.lineTo(1,3);bc.stroke();
        bc.restore();
      }
      // a long streamer somebody trailed out
      bc.strokeStyle="rgba(237,234,226,.75)";bc.lineWidth=5;bc.lineCap="round";
      bc.beginPath();
      bc.moveTo((W2.x0)*TILE+14,(W2.y1)*TILE+22);
      bc.quadraticCurveTo((W2.x0+1.4)*TILE,(W2.y1)*TILE+6,
                          (W2.x0+2.2)*TILE,(W2.y1)*TILE+24);
      bc.stroke();
      bc.strokeStyle="rgba(160,158,150,.35)";bc.lineWidth=1;
      bc.beginPath();
      bc.moveTo((W2.x0)*TILE+14,(W2.y1)*TILE+22);
      bc.quadraticCurveTo((W2.x0+1.4)*TILE,(W2.y1)*TILE+6,
                          (W2.x0+2.2)*TILE,(W2.y1)*TILE+24);
      bc.stroke();
    })();
    // bin in the corner
    bc.fillStyle="#3E4A54";bc.beginPath();bc.arc(W2.x1*TILE+18,(W2.y1)*TILE+20,7,0,7);bc.fill();
    bc.fillStyle="rgba(0,0,0,.3)";bc.beginPath();bc.arc(W2.x1*TILE+18,(W2.y1)*TILE+20,4.4,0,7);bc.fill();
    // WC plate on the waiting-room side of the door
    bc.fillStyle="#0E1519";bc.beginPath();bc.roundRect(1*TILE+10,41*TILE+9,26,11,2);bc.fill();
    bc.strokeStyle="#43596A";bc.lineWidth=1;bc.strokeRect(1*TILE+10.5,41*TILE+9.5,25,10);
    bc.fillStyle="#9FC4D6";bc.font="700 8px 'Barlow Condensed',sans-serif";
    bc.fillText("WC",1*TILE+23,41*TILE+18);
  })();

  // ---- NICU cots (left of the bottom-right block) ----
  (function(){
    const N=NICU;
    for(let y=N.y0;y<=N.y1;y++)for(let x=N.x0;x<=N.x1;x++){
      bc.fillStyle="rgba(210,170,190,.05)";bc.fillRect(x*TILE,y*TILE,TILE,TILE);
      bc.strokeStyle="rgba(235,205,220,.05)";bc.lineWidth=0.6;
      bc.beginPath();bc.moveTo(x*TILE+TILE/2,y*TILE);bc.lineTo(x*TILE+TILE/2,y*TILE+TILE);
      bc.moveTo(x*TILE,y*TILE+TILE/2);bc.lineTo(x*TILE+TILE,y*TILE+TILE/2);bc.stroke();
    }
    const gr=bc.createRadialGradient((N.x0+2)*TILE,(N.y0+1.5)*TILE,10,
                                     (N.x0+2)*TILE,(N.y0+1.5)*TILE,TILE*4);
    gr.addColorStop(0,"rgba(255,215,190,.10)");gr.addColorStop(1,"rgba(255,215,190,0)");
    bc.fillStyle=gr;bc.fillRect(N.x0*TILE,N.y0*TILE,5*TILE,4*TILE);
    bc.textAlign="left";bc.font="600 8.5px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(235,180,200,.8)";
    bc.fillText("NICU",N.x0*TILE+3,N.y0*TILE+11);
    bc.font="600 6px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(235,180,200,.5)";
    bc.fillText("QUIET PLEASE",N.x0*TILE+3,N.y1*TILE+TILE-5);
    // four isolettes
    [[N.x0+1,N.y0+1],[N.x0+3,N.y0+1],[N.x0+1,N.y1],[N.x0+3,N.y1]].forEach(function(o,i){
      const px=o[0]*TILE, py=o[1]*TILE-4;
      bc.fillStyle="rgba(0,0,0,.32)";bc.fillRect(px-13,py-8,30,26);
      bc.fillStyle="#4A5866";bc.beginPath();bc.roundRect(px-15,py-10,30,26,4);bc.fill();
      bc.fillStyle="rgba(198,230,240,.30)";bc.beginPath();bc.roundRect(px-12,py-7,24,20,4);bc.fill();
      bc.strokeStyle="rgba(215,240,248,.55)";bc.lineWidth=1.2;
      bc.beginPath();bc.roundRect(px-12,py-7,24,20,4);bc.stroke();
      bc.fillStyle="#E8C7A8";bc.beginPath();bc.ellipse(px,py+1,5,6.5,0,0,7);bc.fill();
      bc.fillStyle= i%2? "#E4A8C0":"#A8C4E4";
      bc.beginPath();bc.roundRect(px-4.5,py+2,9,9,3);bc.fill();
      bc.fillStyle="#D9B08E";bc.beginPath();bc.arc(px,py-2,3.4,0,7);bc.fill();
      bc.fillStyle="#3A2A20";bc.beginPath();bc.arc(px,py-2.8,3,Math.PI,0);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1;bc.beginPath();bc.arc(px,py-2,3.4,0,7);bc.stroke();
      bc.fillStyle="#2E3A44";
      bc.beginPath();bc.arc(px-13,py+4,3,0,7);bc.fill();
      bc.beginPath();bc.arc(px+13,py+4,3,0,7);bc.fill();
      bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.roundRect(px-15,py-10,30,26,4);bc.stroke();
      bc.fillStyle="#0A1015";bc.fillRect(px-9,py-19,19,9);
      bc.strokeStyle="#8FE0C0";bc.lineWidth=1;
      bc.beginPath();
      for(let k=0;k<15;k++){const yy=py-14-((k===7)?3:0);
        if(k)bc.lineTo(px-7+k,yy);else bc.moveTo(px-7+k,yy);}
      bc.stroke();
    });
  })();

  // ---- delivery room ----
  (function(){
    const D=DELIV;
    for(let y=D.y0;y<=D.y1;y++)for(let x=D.x0;x<=D.x1;x++){
      bc.fillStyle="rgba(150,200,215,.06)";bc.fillRect(x*TILE,y*TILE,TILE,TILE);
      bc.strokeStyle="rgba(190,225,240,.05)";bc.lineWidth=0.6;
      bc.beginPath();bc.moveTo(x*TILE+TILE/2,y*TILE);bc.lineTo(x*TILE+TILE/2,y*TILE+TILE);
      bc.moveTo(x*TILE,y*TILE+TILE/2);bc.lineTo(x*TILE+TILE,y*TILE+TILE/2);bc.stroke();
    }
    bc.textAlign="left";bc.font="600 8.5px 'IBM Plex Mono',monospace";
    bc.fillStyle="rgba(170,215,230,.8)";
    bc.fillText("DELIVERY",D.x0*TILE+3,D.y0*TILE+11);

    const cx=(D.x0+1.6)*TILE, cy=(D.y0+1.7)*TILE;
    // overhead light, same rig as the OR but a single head
    const lg=bc.createRadialGradient(cx,cy,10,cx,cy,TILE*2.4);
    lg.addColorStop(0,"rgba(235,248,255,.16)");lg.addColorStop(1,"rgba(235,248,255,0)");
    bc.fillStyle=lg;bc.fillRect(D.x0*TILE,D.y0*TILE,5*TILE,4*TILE);

    // the bed — back raised, legs in stirrups
    bc.fillStyle="rgba(0,0,0,.34)";bc.fillRect(cx-13,cy-24,28,52);
    bc.fillStyle="#59687A";bc.beginPath();bc.roundRect(cx-14,cy-26,28,52,4);bc.fill();
    bc.fillStyle="#28323C";bc.beginPath();bc.roundRect(cx-11,cy-23,22,46,3);bc.fill();
    bc.fillStyle="#5E8896";bc.beginPath();bc.roundRect(cx-10,cy-22,20,26,3);bc.fill();
    bc.fillStyle="#B9C6D0";bc.beginPath();bc.roundRect(cx-9,cy-21,18,10,3);bc.fill();
    // stirrups off the foot
    bc.strokeStyle="#8FA3B4";bc.lineWidth=2.6;bc.lineCap="round";
    bc.beginPath();bc.moveTo(cx-9,cy+16);bc.lineTo(cx-19,cy+25);bc.stroke();
    bc.beginPath();bc.moveTo(cx+9,cy+16);bc.lineTo(cx+19,cy+25);bc.stroke();
    bc.fillStyle="#6E7F8C";
    bc.beginPath();bc.arc(cx-19,cy+25,4,0,7);bc.fill();
    bc.beginPath();bc.arc(cx+19,cy+25,4,0,7);bc.fill();
    bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.roundRect(cx-14,cy-26,28,52,4);bc.stroke();

    // the lamp head over the foot of the bed
    // on an arm, swung in from the side rather than sat on the bed
    const lx=cx-26, ly=cy+20;
    bc.strokeStyle="rgba(143,163,180,.8)";bc.lineWidth=3;
    bc.beginPath();bc.moveTo(lx,ly);bc.lineTo(cx-4,cy+8);bc.stroke();
    bc.fillStyle="rgba(0,0,0,.28)";bc.beginPath();bc.arc(lx+2,ly+2,11,0,7);bc.fill();
    bc.fillStyle="#8FA3B4";bc.beginPath();bc.arc(lx,ly,10,0,7);bc.fill();
    bc.fillStyle="#E8F4FA";bc.beginPath();bc.arc(lx,ly,7.5,0,7);bc.fill();
    bc.fillStyle="rgba(255,255,255,.9)";bc.beginPath();bc.arc(lx,ly,4,0,7);bc.fill();
    bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.arc(lx,ly,10,0,7);bc.stroke();

    // the warmer — where the baby goes the second it arrives
    const wx=(D.x1)*TILE+TILE/2, wy=(D.y0+0.6)*TILE;
    bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(wx-13,wy-8,27,30);
    bc.fillStyle="#4A5866";bc.beginPath();bc.roundRect(wx-14,wy-10,27,30,3);bc.fill();
    bc.fillStyle="#D8C7A8";bc.beginPath();bc.roundRect(wx-11,wy-7,21,24,2);bc.fill();
    // heat lamp glow above it
    const hg=bc.createRadialGradient(wx,wy+5,3,wx,wy+5,26);
    hg.addColorStop(0,"rgba(255,170,90,.30)");hg.addColorStop(1,"rgba(255,170,90,0)");
    bc.fillStyle=hg;bc.fillRect(wx-28,wy-22,56,56);
    bc.fillStyle="#C24A2E";bc.fillRect(wx-9,wy-13,18,4);
    bc.strokeStyle=INK;bc.lineWidth=1.3;bc.beginPath();bc.roundRect(wx-14,wy-10,27,30,3);bc.stroke();
    bc.fillStyle="rgba(255,220,180,.55)";bc.font="600 5.5px 'IBM Plex Mono',monospace";
    bc.textAlign="center";bc.fillText("WARMER",wx,wy+26);

    // instrument trolley, draped
    const tx=(D.x1)*TILE+TILE/2, ty=(D.y1)*TILE+TILE-14;
    bc.fillStyle="rgba(0,0,0,.3)";bc.fillRect(tx-13,ty-8,26,18);
    bc.fillStyle="#C7D2DA";bc.beginPath();bc.roundRect(tx-14,ty-10,26,18,2);bc.fill();
    bc.fillStyle="#9FB2C0";
    for(let i=0;i<4;i++) bc.fillRect(tx-10+i*6,ty-7,3,12);
    bc.strokeStyle=INK;bc.lineWidth=1.2;bc.beginPath();bc.roundRect(tx-14,ty-10,26,18,2);bc.stroke();

    // resus trolley for the baby
    const rx=D.x0*TILE+16, ry=(D.y1)*TILE+TILE-16;
    bc.fillStyle="#3A4854";bc.beginPath();bc.roundRect(rx-9,ry-11,18,22,3);bc.fill();
    bc.fillStyle="#8FE0C0";bc.fillRect(rx-6,ry-8,12,5);
    bc.fillStyle="#C6D2DA";bc.fillRect(rx-6,ry-1,12,3);
    bc.strokeStyle=INK;bc.lineWidth=1.2;bc.beginPath();bc.roundRect(rx-9,ry-11,18,22,3);bc.stroke();

    // sign over the corridor door
    bc.fillStyle="#0E1519";bc.beginPath();bc.roundRect(D.x0*TILE+8,(D.y0-1)*TILE+10,42,11,2);bc.fill();
    bc.strokeStyle="#3E5462";bc.lineWidth=1;bc.strokeRect(D.x0*TILE+8.5,(D.y0-1)*TILE+10.5,41,10);
    bc.fillStyle="#9FD6E0";bc.font="700 8px 'Barlow Condensed',sans-serif";bc.textAlign="center";
    bc.fillText("DELIVERY",D.x0*TILE+29,(D.y0-1)*TILE+19);
  })();

  // viewing window into the NICU, off the corridor
  (function(){
    const y=42*TILE;
    for(let i=0;i<2;i++){
      const x=(NICU.x0+0.9+i*1.2)*TILE;
      const w=TILE*1.0;
      bc.fillStyle="#141C22";bc.fillRect(x-2,y+1,w+4,TILE-2);
      // glass, warm light from the nursery side
      const gl=bc.createLinearGradient(0,y,0,y+TILE);
      gl.addColorStop(0,"rgba(180,220,235,.10)");
      gl.addColorStop(1,"rgba(255,215,190,.20)");
      bc.fillStyle=gl;bc.fillRect(x,y+3,w,TILE-6);
      bc.fillStyle="rgba(235,245,250,.18)";bc.fillRect(x+2,y+4,w*0.34,TILE-8);
      bc.strokeStyle="#5C6E7A";bc.lineWidth=1.4;bc.strokeRect(x,y+3,w,TILE-6);
      bc.fillStyle="#4A5866";bc.fillRect(x+w/2-1,y+3,2,TILE-6);
      // light spilling out into the corridor
      const sp=bc.createLinearGradient(0,y,0,y-TILE*1.4);
      sp.addColorStop(0,"rgba(255,215,190,.13)");
      sp.addColorStop(1,"rgba(255,215,190,0)");
      bc.fillStyle=sp;bc.fillRect(x-6,y-TILE*1.4,w+12,TILE*1.4);
    }
    bc.fillStyle="rgba(232,180,200,.5)";bc.font="600 6px 'IBM Plex Mono',monospace";
    bc.textAlign="center";
    bc.fillText("NURSERY",(NICU.x0+1.6)*TILE,y-4);
  })();

  // NICU plate, mounted on the wall beside its doorway
  (function(){
    const px=6*TILE+2, py=42*TILE+9;
    bc.fillStyle="#0E1519";bc.beginPath();bc.roundRect(px,py,30,12,2);bc.fill();
    bc.strokeStyle="#5E4452";bc.lineWidth=1;bc.strokeRect(px+.5,py+.5,29,11);
    bc.fillStyle="#E8B4C8";bc.font="700 9px 'Barlow Condensed',sans-serif";bc.textAlign="center";
    bc.fillText("NICU",px+15,py+9);
    // an arrow on the corridor floor pointing at the door
    bc.fillStyle="rgba(232,180,200,.20)";
    bc.beginPath();bc.moveTo(8*TILE+16,41*TILE+24);
    bc.lineTo(8*TILE+10,41*TILE+14);bc.lineTo(8*TILE+22,41*TILE+14);bc.closePath();bc.fill();
  })();

  // wall-mounted gear + unit sign
  [[9,11,"#B32130","AED"],[9,23,"#B32130","EXT"],[5,27,"#C8B23A","SHRP"]].forEach(function(w){
    const px=w[0]*TILE+8, py=w[1]*TILE+9;
    bc.fillStyle="#0E151B";bc.fillRect(px-2,py-2,20,17);
    bc.fillStyle=w[2];bc.beginPath();bc.roundRect(px,py,16,13,2);bc.fill();
    bc.fillStyle="rgba(255,255,255,.8)";bc.font="700 6px 'IBM Plex Mono',monospace";
    bc.textAlign="center";bc.fillText(w[3],px+8,py+9);
  });
  (function(){
    const px=6*TILE, py=7*TILE+3;
    bc.fillStyle="#0E1519";bc.beginPath();bc.roundRect(px,py,3*TILE,15,2);bc.fill();
    bc.strokeStyle="#4A5C68";bc.lineWidth=1;bc.strokeRect(px+.5,py+.5,3*TILE-1,14);
    bc.fillStyle="#D7E3EC";bc.font="700 11px 'Barlow Condensed',sans-serif";
    bc.textAlign="center";bc.fillText("INTENSIVE CARE · 8 BEDS",px+1.5*TILE,py+11);
  })();
}
bakeMap();

/* ---- tool icons ---- */
// Small material ramps keep procedural equipment readable at game scale.
function objectMaterial(ctx,color,x,y,w,h){
  const ramp=ctx.createLinearGradient(x,y,x+w,y+h);
  ramp.addColorStop(0,shade(color,.28));
  ramp.addColorStop(.35,color);
  ramp.addColorStop(1,shade(color,-.27));
  return ramp;
}
function objectShadow(x,y,rx,ry){
  g.save();g.translate(x,y);g.scale(rx,ry);
  const ramp=g.createRadialGradient(0,0,.15,0,0,1);
  ramp.addColorStop(0,"rgba(8,17,24,.34)");
  ramp.addColorStop(.55,"rgba(8,17,24,.20)");
  ramp.addColorStop(1,"rgba(8,17,24,0)");
  g.fillStyle=ramp;g.beginPath();g.arc(0,0,1,0,Math.PI*2);g.fill();g.restore();
}
function nursingIcon(c,k){
  c.save();c.strokeStyle="#354C5B";c.lineWidth=.85;
  const color={ABX:"#85C7A1",PRESS:"#B29CE0",INSUL:"#E0AA69",PAIN:"#7EB6DD",BLOOD:"#BB5160"}[k]||"#8DBDCC";
  c.fillStyle=objectMaterial(c,"#D1E0E5",-8,-10,16,20);
  if(["ABX","PRESS","INSUL","PAIN","BCULT"].includes(k)){
    const vial=function(x,col){
      c.fillStyle=objectMaterial(c,"#C5D8DF",x-4,-8,8,17);
      c.beginPath();c.roundRect(x-4,-6,8,15,2);c.fill();c.stroke();
      c.fillStyle=col;c.fillRect(x-4,-9,8,4);c.fillRect(x-3,1,6,4);
      c.fillStyle="#F2F4E9";c.fillRect(x-2,-3,4,3);
      c.fillStyle="rgba(255,255,255,.6)";c.fillRect(x-2.6,-5,.8,12);
    };
    if(k==="BCULT"){vial(-4,"#85C7A1");vial(4,"#D5AA74");}else vial(0,color);
  }else if(["FLUID","BLOOD","FOLEY"].includes(k)){
    c.beginPath();c.roundRect(-7,-9,14,16,3);c.fill();c.stroke();
    c.fillStyle=k==="BLOOD"?"#BB5160":k==="FOLEY"?"#CBB16F":"#81BFCF";
    c.fillRect(-5,-1,10,6);c.fillStyle="#F0F3E9";c.fillRect(-4,-6,8,4);
    c.beginPath();c.arc(0,-8,1,0,7);c.stroke();
    c.beginPath();c.moveTo(0,7);c.lineTo(0,11);c.lineTo(6,11);c.stroke();
  }else if(k==="GLUC"){
    c.beginPath();c.roundRect(-7,-10,14,18,3);c.fill();c.stroke();
    c.fillStyle="#203E48";c.fillRect(-5,-7,10,7);
    c.fillStyle="#9BE4B3";c.font="600 5px monospace";c.textAlign="center";c.fillText("5.4",0,-2);
    c.fillStyle="#467F96";c.beginPath();c.arc(0,4,2,0,7);c.fill();c.fillStyle="#F2E6BB";c.fillRect(-1,8,2,4);
  }else if(k==="NGT"||k==="LEADS"){
    c.strokeStyle="#9AD0D7";c.lineWidth=1.7;
    c.beginPath();c.moveTo(-7,9);c.bezierCurveTo(11,9,-10,-8,5,-8);c.stroke();
    for(let i=0;i<(k==="LEADS"?3:1);i++){
      c.fillStyle=["#DCA46E","#8BD1A5","#E18B8B"][i];
      c.beginPath();c.arc(5-i*5,-8+i*4,2.2,0,7);c.fill();
    }
  }else if(k==="SUPP"){
    c.beginPath();c.moveTo(-3,8);c.lineTo(-3,-4);c.quadraticCurveTo(0,-14,3,-4);c.lineTo(3,8);c.closePath();c.fill();c.stroke();
    c.fillStyle="#86BABD";c.fillRect(-3,5,6,3);
  }else{
    c.beginPath();c.roundRect(-9,-9,18,18,2);c.fill();c.stroke();
    c.fillStyle=k==="TURN"?"#759FBF":"#FAF4E6";c.fillRect(-7,-6,14,12);
    if(k==="IVK"){c.strokeStyle="#48768A";c.lineWidth=2;c.beginPath();c.moveTo(-4,4);c.lineTo(4,-4);c.stroke();c.fillStyle="#6FA9C0";c.fillRect(2,-6,4,3);}
    else if(k==="DRESS"){c.strokeStyle="#B8C7C8";c.lineWidth=.5;for(let i=-5;i<=5;i+=2){c.beginPath();c.moveTo(i,-5);c.lineTo(i,5);c.moveTo(-5,i);c.lineTo(5,i);c.stroke();}}
    else {c.fillStyle="#5D8698";for(let i=0;i<3;i++)c.fillRect(-5,-3+i*3,10-i*2,.8);}
    if(k==="CHART"){c.fillStyle="#596E78";c.fillRect(-4,-10,8,4);}
  }
  c.restore();
}
function toolIcon(c,k){
  const image=toolArt(k);
  if(image&&image.complete&&image.naturalWidth){c.drawImage(image,-10,-10,20,20);return;}
  if(RN_TOOLS[k]){nursingIcon(c,k);return;}
  c.lineWidth=1.7; c.lineCap="round"; c.lineJoin="round";
  switch(k){
    case "SUCT":
      c.strokeStyle="#7FD4E0";
      c.beginPath();c.moveTo(-8,8);c.bezierCurveTo(-1,7,-9,1,-2,-1);
      c.bezierCurveTo(5,-3,0,-8,8,-8);c.stroke();
      c.fillStyle=objectMaterial(c,"#7FD4E0",-9,-10,18,20);c.beginPath();c.arc(8,-8,2.2,0,7);c.fill();break;
    case "YANK":
      c.strokeStyle="#CBD8E0";c.lineWidth=2.8;
      c.beginPath();c.moveTo(-8,8);c.lineTo(-1,0);c.lineTo(5,-5);c.stroke();
      c.fillStyle=objectMaterial(c,"#CBD8E0",-9,-10,18,20);c.beginPath();c.arc(7,-7,3.2,0,7);c.fill();break;
    case "INLINE":
      c.strokeStyle="#7FD4E0";c.lineWidth=2.2;
      c.beginPath();c.moveTo(-9,0);c.lineTo(9,0);c.stroke();
      c.fillStyle="rgba(190,225,235,.5)";c.fillRect(-6,-5,12,10);
      c.strokeStyle="#BEE1EB";c.lineWidth=1;c.strokeRect(-6,-5,12,10);break;
    case "ABG":
      c.fillStyle=objectMaterial(c,"#DCE6EC",-9,-10,18,20);c.fillRect(-7,-3.5,11,7);
      c.strokeStyle="#8A98A4";c.lineWidth=1;c.strokeRect(-7,-3.5,11,7);
      c.fillStyle=objectMaterial(c,"#E05A5A",-9,-10,18,20);c.fillRect(-7,-3.5,4,7);
      c.strokeStyle="#8A98A4";c.lineWidth=1.6;
      c.beginPath();c.moveTo(4,0);c.lineTo(10,0);c.stroke();
      c.beginPath();c.moveTo(-9,-5);c.lineTo(-9,5);c.stroke();break;
    case "VENTK":
      c.fillStyle=objectMaterial(c,"#6FD08C",-9,-10,18,20);c.beginPath();
      c.moveTo(-8,-6);c.lineTo(3,-3);c.lineTo(3,3);c.lineTo(-8,6);c.closePath();c.fill();
      c.fillStyle=objectMaterial(c,"#F2B33D",-9,-10,18,20);c.fillRect(3,-3.5,4,7);
      c.strokeStyle="#2F6E45";c.lineWidth=1;c.strokeRect(3,-3.5,4,7);break;
    case "NC":
      c.strokeStyle="#9BE3B0";c.lineWidth=2;
      c.beginPath();c.arc(0,3,7,Math.PI,0);c.stroke();
      c.beginPath();c.moveTo(-2.5,-4);c.lineTo(-2.5,-8);c.stroke();
      c.beginPath();c.moveTo(2.5,-4);c.lineTo(2.5,-8);c.stroke();break;
    case "NRB":
      c.fillStyle=objectMaterial(c,"#9BE3B0",-9,-10,18,20);c.beginPath();
      c.moveTo(0,-9);c.lineTo(7,-1);c.lineTo(0,4);c.lineTo(-7,-1);c.closePath();c.fill();
      c.fillStyle=objectMaterial(c,"#6FD08C",-9,-10,18,20);c.beginPath();c.ellipse(0,8,5,4,0,0,7);c.fill();break;
    case "FLOW":
      c.fillStyle=objectMaterial(c,"#3C4A56",-9,-10,18,20);c.fillRect(-4,-10,8,15);
      c.strokeStyle="#9FB2C0";c.lineWidth=1;c.strokeRect(-4,-10,8,15);
      c.fillStyle=objectMaterial(c,"#6FD08C",-9,-10,18,20);c.beginPath();c.arc(0,-2,2.6,0,7);c.fill();
      c.fillStyle=objectMaterial(c,"#9FB2C0",-9,-10,18,20);c.fillRect(-6,5,12,4);
      c.beginPath();c.arc(0,10,2.6,0,7);c.fill();break;
    case "XTREE":
      c.fillStyle=objectMaterial(c,"#6FD08C",-9,-10,18,20);c.beginPath();c.moveTo(-9,0);
      c.lineTo(-3,-5);c.lineTo(-3,-2.5);c.lineTo(2,-6);c.lineTo(2,-3);
      c.lineTo(7,-6.5);c.lineTo(7,6.5);c.lineTo(2,3);c.lineTo(2,6);
      c.lineTo(-3,2.5);c.lineTo(-3,5);c.closePath();c.fill();break;
    case "MDI":
      c.fillStyle=objectMaterial(c,"#B57FD1",-9,-10,18,20);c.fillRect(-2,-9,6,9);
      c.fillStyle=objectMaterial(c,"#8E5CA8",-9,-10,18,20);c.beginPath();
      c.moveTo(-3,0);c.lineTo(5,0);c.lineTo(5,6);c.lineTo(-3,6);c.closePath();c.fill();
      c.fillStyle="rgba(210,185,230,.55)";c.fillRect(-9,1,7,5);
      c.strokeStyle="#B57FD1";c.lineWidth=1;c.strokeRect(-9,1,7,5);break;
    case "NEB":
      c.fillStyle=objectMaterial(c,"#A7D8E8",-9,-10,18,20);c.beginPath();
      c.moveTo(-5,0);c.lineTo(5,0);c.lineTo(3,8);c.lineTo(-3,8);c.closePath();c.fill();
      c.strokeStyle="#7FB4C8";c.lineWidth=1.6;
      c.beginPath();c.moveTo(0,0);c.lineTo(0,-4);c.stroke();
      c.fillStyle="rgba(190,225,240,.75)";
      [[-4,-7,1.6],[0,-9,2],[4,-6.5,1.5]].forEach(function(d){
        c.beginPath();c.arc(d[0],d[1],d[2],0,7);c.fill();});break;
    case "BVM":
      c.fillStyle=objectMaterial(c,"#4A5C6B",-9,-10,18,20);c.beginPath();c.ellipse(2,0,7,6,0,0,7);c.fill();
      c.strokeStyle="#8FA3B4";c.lineWidth=1;c.stroke();
      c.fillStyle=objectMaterial(c,"#C9D8E2",-9,-10,18,20);c.beginPath();
      c.moveTo(-5,-5);c.lineTo(-10,0);c.lineTo(-5,5);c.closePath();c.fill();break;
    case "PEEP":
      c.fillStyle=objectMaterial(c,"#8FA3B4",-9,-10,18,20);c.beginPath();c.arc(0,2,6,0,7);c.fill();
      c.strokeStyle="#DCE6EC";c.lineWidth=1.6;
      c.beginPath();c.moveTo(-5,-3);c.lineTo(5,-5);c.stroke();
      c.beginPath();c.moveTo(-5,-6);c.lineTo(5,-8);c.stroke();break;
    case "ETCO2":
      c.fillStyle=objectMaterial(c,"#9B6BC9",-9,-10,18,20);c.beginPath();c.roundRect(-8,-8,16,16,4);c.fill();
      c.fillStyle=objectMaterial(c,"#F2E04D",-9,-10,18,20);c.beginPath();c.arc(0,0,4.5,0,7);c.fill();
      c.strokeStyle="#5E3B80";c.lineWidth=1;c.beginPath();c.arc(0,0,4.5,0,7);c.stroke();break;
    case "TLUNG":
      c.fillStyle=objectMaterial(c,"#7FA8C4",-9,-10,18,20);c.beginPath();c.ellipse(1,1,7,7.5,0,0,7);c.fill();
      c.strokeStyle="#B8D4E4";c.lineWidth=1;c.stroke();
      c.fillStyle=objectMaterial(c,"#DCE6EC",-9,-10,18,20);c.fillRect(-3,-10,6,4);break;
    case "MANO":
      c.fillStyle=objectMaterial(c,"#20303C",-9,-10,18,20);c.beginPath();c.arc(0,0,8,0,7);c.fill();
      c.strokeStyle="#DCE6EC";c.lineWidth=1.4;c.beginPath();c.arc(0,0,8,0,7);c.stroke();
      c.strokeStyle="#E05A5A";c.lineWidth=1.8;
      c.beginPath();c.moveTo(0,0);c.lineTo(4.5,-5);c.stroke();
      c.fillStyle=objectMaterial(c,"#DCE6EC",-9,-10,18,20);c.beginPath();c.arc(0,0,1.6,0,7);c.fill();break;
    case "CAN25": case "CAN50": case "CAN75": case "CAN100":
      (function(){
        const cn=CAN_BY[k], col=cn.c;
        c.fillStyle=objectMaterial(c,"#2E3A44",-9,-10,18,20);c.beginPath();c.roundRect(-5,-9,10,18,2.5);c.fill();
        c.fillStyle=col;c.fillRect(-5,-3.5,10,7);
        c.fillStyle="rgba(0,0,0,.28)";c.fillRect(-5,-3.5,10,1.6);
        c.strokeStyle="rgba(255,255,255,.85)";c.lineWidth=1.4;
        c.beginPath();c.moveTo(-1.6,-1.4);c.lineTo(1.2,-1.4);c.lineTo(-0.6,1.2);
        c.lineTo(1.8,1.2);c.stroke();
        // fill bars showing how much is in it
        c.fillStyle=col;
        const bars=cn.pct/25;
        for(let b=0;b<bars;b++) c.fillRect(-4,5.6-b*2.2,8,1.4);
        c.fillStyle=objectMaterial(c,"#C6D2DA",-9,-10,18,20);c.beginPath();c.roundRect(-5,-9,10,3,1.5);c.fill();
        c.strokeStyle="#1A232A";c.lineWidth=1;
        c.beginPath();c.roundRect(-5,-9,10,18,2.5);c.stroke();
      })();
      break;
    default:
      c.fillStyle=objectMaterial(c,"#C9A227",-9,-10,18,20);c.beginPath();c.arc(0,0,7,0,7);c.fill();
  }
  c.save();c.lineWidth=.7;c.strokeStyle="rgba(240,250,255,.65)";
  if(k==="ABG" || k==="FLOW"){
    for(let i=0;i<4;i++){
      c.beginPath();
      if(k==="ABG"){c.moveTo(-1+i*1.3,-3);c.lineTo(-1+i*1.3,-1);}
      else {c.moveTo(1,-8+i*3);c.lineTo(3,-8+i*3);}
      c.stroke();
    }
  } else if(k==="BVM" || k==="TLUNG"){
    for(let i=-3;i<=5;i+=2){c.beginPath();c.ellipse(i,1,1.2,4,0,-1.1,1.1);c.stroke();}
  } else if(k==="MANO"){
    for(let i=0;i<7;i++){
      const a=Math.PI*.75+i*Math.PI/4;
      c.beginPath();c.moveTo(Math.cos(a)*5.5,Math.sin(a)*5.5);
      c.lineTo(Math.cos(a)*6.6,Math.sin(a)*6.6);c.stroke();
    }
  } else if(k==="NRB" || k==="NEB" || k==="MDI" || k==="ETCO2"){
    c.beginPath();c.moveTo(-2,-5);c.lineTo(-2,1);c.stroke();
  } else if(k==="INLINE"){
    c.beginPath();c.moveTo(-5,-3);c.lineTo(5,-3);c.stroke();
    c.fillStyle="#D7EEF3";c.fillRect(-8,-2,2,4);c.fillRect(6,-2,2,4);
  }
  c.restore();

}
function icon(k,x,y,size){
  g.save();g.translate(x,y);g.scale(size/22,size/22);toolIcon(g,k);g.restore();
}
function canIcon(c,key){
  const cn=CAN_BY[key], col=cn.c;
  c.fillStyle=objectMaterial(c,"#2E3A44",-10,-12,20,24);c.beginPath();c.roundRect(-5.5,-10,11,20,2.5);c.fill();
  c.fillStyle=col;c.fillRect(-5.5,-4,11,8);
  c.fillStyle="rgba(0,0,0,.28)";c.fillRect(-5.5,-4,11,1.8);
  c.strokeStyle="rgba(255,255,255,.9)";c.lineWidth=1.5;
  c.beginPath();c.moveTo(-1.8,-1.8);c.lineTo(1.4,-1.8);c.lineTo(-0.8,1.4);
  c.lineTo(2,1.4);c.stroke();
  c.fillStyle=col;
  for(let b=0;b<cn.pct/25;b++) c.fillRect(-4.2,6.4-b*2.4,8.4,1.5);
  c.fillStyle=objectMaterial(c,"#C6D2DA",-10,-12,20,24);c.beginPath();c.roundRect(-5.5,-10,11,3.4,1.6);c.fill();
  c.fillStyle=objectMaterial(c,"#8E9AA4",-10,-12,20,24);c.beginPath();c.ellipse(0,-8.4,2.6,1.2,0,0,7);c.fill();
  c.strokeStyle="#1A232A";c.lineWidth=1.1;
  c.beginPath();c.roundRect(-5.5,-10,11,20,2.5);c.stroke();
}
const PW_ICONS={};
function powerIcon(k){
  const file=POWER_IMAGE_PATHS[k];
  return file?"/images/My-Black-Cloud-Tool-Icons/Shared-Power-Ups/"+file+".webp":PW_ICONS[k];
}
(function(){
  const draw={
    SPRINT:function(c){                       // lightning bolt over a boot
      c.fillStyle=objectMaterial(c,"#8FE04A",-10,-12,20,24);c.beginPath();
      c.moveTo(1,-10);c.lineTo(-6,1);c.lineTo(-1,1);c.lineTo(-2,10);
      c.lineTo(6,-2);c.lineTo(1,-2);c.closePath();c.fill();
      c.strokeStyle="#2E5E1E";c.lineWidth=1;c.stroke();
    },
    TANK:function(c){                          // battery, full
      c.fillStyle=objectMaterial(c,"#1A2830",-10,-12,20,24);c.beginPath();c.roundRect(-7,-9,14,18,2.5);c.fill();
      c.fillStyle=objectMaterial(c,"#38D6E0",-10,-12,20,24);c.fillRect(-5,-7,10,14);
      c.fillStyle=objectMaterial(c,"#1A2830",-10,-12,20,24);c.fillRect(-3,-11,6,2.5);
      c.strokeStyle="#7FE6EE";c.lineWidth=1.2;
      c.beginPath();c.roundRect(-7,-9,14,18,2.5);c.stroke();
      c.fillStyle=objectMaterial(c,"#0E1C22",-10,-12,20,24);
      c.beginPath();c.moveTo(1,-5);c.lineTo(-3,1);c.lineTo(0,1);c.lineTo(-1,6);
      c.lineTo(3,0);c.lineTo(0,0);c.closePath();c.fill();
    },
    CALM:function(c){                          // raised hand / stop
      c.fillStyle=objectMaterial(c,"#F2C94D",-10,-12,20,24);c.beginPath();c.roundRect(-6,-4,12,11,3);c.fill();
      for(let i=0;i<4;i++) c.fillRect(-5.5+i*3.2,-10,2.4,7);
      c.fillStyle=objectMaterial(c,"#8A6E14",-10,-12,20,24);c.fillRect(-6,2,12,1.4);
      c.strokeStyle="#7A5F10";c.lineWidth=1;
      c.beginPath();c.roundRect(-6,-4,12,11,3);c.stroke();
    },
    CAN25:function(c){canIcon(c,"CAN25");},
    CAN50:function(c){canIcon(c,"CAN50");},
    CAN75:function(c){canIcon(c,"CAN75");},
    CAN100:function(c){canIcon(c,"CAN100");},
    PACK:function(c){                          // a fatter fanny pack
      c.fillStyle=objectMaterial(c,"#7A6114",-10,-12,20,24);c.beginPath();c.roundRect(-10,-6,20,12,3);c.fill();
      c.fillStyle=objectMaterial(c,"#D9B44A",-10,-12,20,24);c.fillRect(-9,-5,18,10);
      c.fillStyle="rgba(0,0,0,.35)";c.fillRect(-1,-6,2,12);
      c.strokeStyle="#F0D67A";c.lineWidth=1.2;
      c.beginPath();c.roundRect(-10,-6,20,12,3);c.stroke();
      c.fillStyle=objectMaterial(c,"#F0D67A",-10,-12,20,24);
      c.beginPath();c.moveTo(-10,-6);c.lineTo(-13,-10);c.lineTo(-11,-11);c.lineTo(-8,-7);c.closePath();c.fill();
      c.beginPath();c.moveTo(10,-6);c.lineTo(13,-10);c.lineTo(11,-11);c.lineTo(8,-7);c.closePath();c.fill();
      c.fillStyle=objectMaterial(c,"#8FE04A",-10,-12,20,24);c.font="700 8px sans-serif";c.textAlign="center";
      c.fillText("+2",0,10);
    },
    TANKUP:function(c){                        // a taller battery
      c.fillStyle=objectMaterial(c,"#1A2830",-10,-12,20,24);c.beginPath();c.roundRect(-6,-10,12,20,2.5);c.fill();
      c.fillStyle=objectMaterial(c,"#38D6E0",-10,-12,20,24);c.fillRect(-4,-8,8,16);
      c.fillStyle=objectMaterial(c,"#1A2830",-10,-12,20,24);c.fillRect(-2.6,-12,5.2,2.4);
      c.strokeStyle="#7FE6EE";c.lineWidth=1.2;
      c.beginPath();c.roundRect(-6,-10,12,20,2.5);c.stroke();
      c.fillStyle=objectMaterial(c,"#0E1C22",-10,-12,20,24);
      c.beginPath();c.moveTo(1,-6);c.lineTo(-3,0);c.lineTo(0,0);c.lineTo(-1,6);
      c.lineTo(3,0);c.lineTo(0,0);c.closePath();c.fill();
      c.fillStyle=objectMaterial(c,"#8FE04A",-10,-12,20,24);c.font="700 7px sans-serif";c.textAlign="center";
      c.fillText("+50",0,-13);
    },
    DEATH:function(c){                         // skull and crossbones
      c.strokeStyle="#C9C2B4";c.lineWidth=3.2;c.lineCap="round";
      c.beginPath();c.moveTo(-9,5);c.lineTo(9,11);c.stroke();
      c.beginPath();c.moveTo(9,5);c.lineTo(-9,11);c.stroke();
      c.fillStyle=objectMaterial(c,"#C9C2B4",-10,-12,20,24);
      [[-9,5],[9,5],[-9,11],[9,11]].forEach(function(o){
        c.beginPath();c.arc(o[0],o[1],2.1,0,7);c.fill(); });
      c.fillStyle=objectMaterial(c,"#E8E2D4",-10,-12,20,24);
      c.beginPath();c.ellipse(0,-3,8,7.4,0,0,7);c.fill();
      c.fillRect(-4.6,2,9.2,4.4);
      c.fillStyle=objectMaterial(c,"#1A1814",-10,-12,20,24);
      c.beginPath();c.ellipse(-3.2,-3.4,2.5,3,0,0,7);c.fill();
      c.beginPath();c.ellipse( 3.2,-3.4,2.5,3,0,0,7);c.fill();
      c.beginPath();c.moveTo(0,0.4);c.lineTo(-1.6,3);c.lineTo(1.6,3);c.closePath();c.fill();
      c.strokeStyle="#8E877A";c.lineWidth=0.9;
      for(let i=0;i<3;i++) c.strokeRect(-4.6+i*3.1,2,0.9,4.4);
      c.strokeStyle="#1A1814";c.lineWidth=1.1;
      c.beginPath();c.ellipse(0,-3,8,7.4,0,0,7);c.stroke();
    },
    NARCAN:function(c){                        // naloxone kit
      c.fillStyle=objectMaterial(c,"#E8E4DA",-10,-12,20,24);c.beginPath();c.roundRect(-9,-7,18,14,3);c.fill();
      c.fillStyle=objectMaterial(c,"#C43A44",-10,-12,20,24);c.fillRect(-2.4,-5,4.8,10);c.fillRect(-6.5,-1.4,13,2.8);
      c.fillStyle=objectMaterial(c,"#B8B2A4",-10,-12,20,24);c.fillRect(-3.4,-9.4,6.8,2.6);
      c.strokeStyle="#1A232A";c.lineWidth=1.2;
      c.beginPath();c.roundRect(-9,-7,18,14,3);c.stroke();
    },
    FRIEND:function(c){                        // two figures, one arriving
      c.fillStyle=objectMaterial(c,"#2E7E86",-10,-12,20,24);
      c.beginPath();c.roundRect(-9,-1,7,10,3);c.fill();
      c.fillStyle=objectMaterial(c,"#7FD4E0",-10,-12,20,24);c.beginPath();c.arc(-5.5,-5,3.6,0,7);c.fill();
      c.fillStyle=objectMaterial(c,"#4E9EA8",-10,-12,20,24);
      c.beginPath();c.roundRect(2,-1,7,10,3);c.fill();
      c.fillStyle=objectMaterial(c,"#B8ECF2",-10,-12,20,24);c.beginPath();c.arc(5.5,-5,3.6,0,7);c.fill();
      c.strokeStyle="#0E1C22";c.lineWidth=1;
      c.beginPath();c.arc(-5.5,-5,3.6,0,7);c.stroke();
      c.beginPath();c.arc(5.5,-5,3.6,0,7);c.stroke();
      c.strokeStyle="#7FD4E0";c.lineWidth=1.4;c.setLineDash([2,2]);
      c.beginPath();c.moveTo(-1.5,4);c.lineTo(1.5,4);c.stroke();c.setLineDash([]);
    },
    KIT:function(c){                           // full fanny pack
      c.fillStyle=objectMaterial(c,"#7A6114",-10,-12,20,24);c.beginPath();c.roundRect(-9,-5,18,10,3);c.fill();
      c.fillStyle=objectMaterial(c,"#D9B44A",-10,-12,20,24);c.fillRect(-8,-4,16,8);
      c.fillStyle="rgba(0,0,0,.35)";c.fillRect(-1,-5,2,10);
      c.strokeStyle="#F0D67A";c.lineWidth=1.2;
      c.beginPath();c.roundRect(-9,-5,18,10,3);c.stroke();
      c.fillStyle=objectMaterial(c,"#F0D67A",-10,-12,20,24);
      c.beginPath();c.moveTo(-9,-5);c.lineTo(-12,-9);c.lineTo(-10,-10);c.lineTo(-7,-6);c.closePath();c.fill();
      c.beginPath();c.moveTo(9,-5);c.lineTo(12,-9);c.lineTo(10,-10);c.lineTo(7,-6);c.closePath();c.fill();
    }
  };
  Object.keys(draw).forEach(function(k){
    const c=document.createElement("canvas");c.width=c.height=112;
    const cc=c.getContext("2d");cc.translate(56,60);cc.scale(3.5,3.5);
    if(!cc.roundRect){cc.roundRect=function(x,y,w,h,r){
      this.beginPath();this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);
      this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);
      this.closePath();return this;};}
    draw[k](cc); PW_ICONS[k]=c.toDataURL();
  });
})();

const ICONS={};
(function(){
  Object.keys(TOOLS).forEach(function(k){
    const c=document.createElement("canvas");c.width=c.height=96;
    const cc=c.getContext("2d");cc.translate(48,48);cc.scale(3.7,3.7);
    if(TOOL_IMAGE_PATHS[k]){
      ICONS[k]="/images/My-Black-Cloud-Tool-Icons/"+
        (k.indexOf("CAN")===0?"Shared-Power-Ups/":RN_TOOLS[k]?"RN-Pack/":"RT-Pack/")+TOOL_IMAGE_PATHS[k]+".webp";
    }else{
      toolIcon(cc,k); ICONS[k]=c.toDataURL();
    }
  });
})();

/* ============ CHARACTERS — top-down vector ============
   Front is +y. Heads turn 180 degrees on the shoulders; body orientation
   and stride match this front so faces still lead in the travel direction. */
const HAIR=["#2B2018","#4E3520","#141010","#8A7048","#7E7B76","#4A2A22"];
const SKIN=["#E3C2A0","#CBA57F","#A87D56","#83583A","#5F402A"];
const HEADY=-1.2, HEADR=4.2; // Shift heads 2 pixels toward the local +y front.

function drawPerson(x,y,face,col,isRT,ent){
  const hair=(ent&&ent.hair)||HAIR[0], skin=(ent&&ent.skin)||"#CBA57F";
  const kind=(ent&&ent.kind)||(isRT?"RT":"RN");
  const cap = kind==="RT" ? "#5FA3A8" : kind==="RN" ? "#C9D6DC" : kind==="Aide" ? "#7CA482" : kind==="Clean" ? "#3A4650" : null;
  const ph=(ent&&ent.phase)||0, walking=!!(ent&&ent.moving);
  const sw = walking? -Math.sin(ph) : 0;
  const ink=function(w){g.strokeStyle=INK;g.lineWidth=w||1.1;g.lineJoin="round";g.stroke();};

  g.save(); g.translate(x,y);
  // Floor lighting stays fixed as the person turns.
  const shadow=g.createRadialGradient(2,5,2,2,5,15);
  shadow.addColorStop(0,"rgba(15,23,31,.30)");
  shadow.addColorStop(.55,"rgba(15,23,31,.15)");
  shadow.addColorStop(1,"rgba(15,23,31,0)");
  g.save();g.scale(1,.72);g.fillStyle=shadow;
  g.beginPath();g.ellipse(2,5,15,15,0,0,Math.PI*2);g.fill();g.restore();
  g.rotate((face===undefined?Math.PI/2:face)-Math.PI/2);
  g.lineCap="round";
  // Trouser legs articulate beneath the hem, opposite the arm swing.
  for(let side=-1;side<=1;side+=2){
    const step=sw*side, footY=9.5+step*4;
    g.strokeStyle=shade(col,-.32);g.lineWidth=4.5;
    g.beginPath();g.moveTo(side*3.5,5);g.lineTo(side*4,footY);g.stroke();
    g.strokeStyle="rgba(255,255,255,.14)";g.lineWidth=.7;
    g.beginPath();g.moveTo(side*3.5-1,5);g.lineTo(side*4-1,footY);g.stroke();
  }

  // shoes fore and aft
  g.fillStyle= kind==="Family" ? "#6B4A32" : kind==="Clean" ? "#2A3038" : "#E4E0D6";
  g.beginPath();g.ellipse(-3.8,9.5-sw*4,2.3,3.3,0,0,7);g.fill();ink(1);
  g.beginPath();g.ellipse( 3.8,9.5+sw*4,2.3,3.3,0,0,7);g.fill();ink(1);
  // Shoe toe caps and soles make the alternating footfalls readable.
  for(let side=-1;side<=1;side+=2){
    const fy=9.5+sw*side*4;
    g.strokeStyle="rgba(255,255,255,.65)";g.lineWidth=.8;
    g.beginPath();g.moveTo(side*3.8-1.2,fy+1.5);g.lineTo(side*3.8+1.2,fy+1.5);g.stroke();
  }
  // A subtle shoulder rock and twice-per-stride rise follow the feet.
  g.translate(sw*.45,walking?Math.abs(Math.cos(ph))*.65:0);
  g.rotate(sw*.035);
  // Narrow the chest and bring sleeves and uniform details in with it.
  g.save();g.scale(.82,1);
  // arms — hidden while both hands are on a cart or chair
  if(!(ent&&ent.hideArms)){
    g.fillStyle=shade(col,-0.16);
    g.beginPath();g.ellipse(-9.6,2.6+sw*2.6,2.6,4.6,-.2,0,7);g.fill();ink(1);
    g.beginPath();g.ellipse( 9.6,2.6-sw*2.6,2.6,4.6,.2,0,7);g.fill();ink(1);
    g.fillStyle=skin;
    g.beginPath();g.arc(-9.9,7+sw*2.6,2.0,0,7);g.fill();ink(1);
    g.beginPath();g.arc( 9.9,7-sw*2.6,2.0,0,7);g.fill();ink(1);
  }
  // shoulders — wider at the back, tapering forward
  g.beginPath();
  g.moveTo(-6.0,-3.4);
  g.quadraticCurveTo(-10.2,-1.0,-9.4,4.6);
  g.quadraticCurveTo(-5,9.4,0,9.4);
  g.quadraticCurveTo(5,9.4,9.4,4.6);
  g.quadraticCurveTo(10.2,-1.0,6.0,-3.4);
  g.quadraticCurveTo(0,-5.4,-6.0,-3.4);
  g.closePath();
  const fabric=g.createLinearGradient(-10,-5,10,10);
  fabric.addColorStop(0,shade(col,.24));
  fabric.addColorStop(.42,col);
  fabric.addColorStop(1,shade(col,-.28));
  g.fillStyle=fabric;g.fill();ink(1.2);
  // Hem, collar and a stitched chest pocket.
  g.strokeStyle="rgba(12,25,34,.30)";g.lineWidth=.8;
  g.beginPath();g.moveTo(-6.5,6.1);g.quadraticCurveTo(0,9,6.5,6.1);g.stroke();
  g.beginPath();g.moveTo(-3,-2);g.lineTo(0,.6);g.lineTo(3,-2);g.stroke();
  g.fillStyle="rgba(255,255,255,.12)";g.fillRect(3,1.7,3.6,3.2);
  g.beginPath();g.moveTo(3,1.7);g.lineTo(3,4.9);g.lineTo(6.6,4.9);g.stroke();
  if(kind!=="Family" && kind!=="Clean"){
    g.fillStyle="#F1F0DF";g.beginPath();g.roundRect(-6,2.4,2.6,3.5,.5);g.fill();
    g.fillStyle="#458EA0";g.fillRect(-5.6,2.8,1.8,.7);
  }
  // gear
  if(kind==="Clean"){
    // hi-vis vest over the coverall, with reflective bands
    g.fillStyle="#D8E24A";
    g.beginPath();
    g.moveTo(-6.4,-3.0);g.quadraticCurveTo(-9.6,-0.8,-9.0,4.4);
    g.quadraticCurveTo(-4.6,8.6,0,8.6);
    g.quadraticCurveTo(4.6,8.6,9.0,4.4);
    g.quadraticCurveTo(9.6,-0.8,6.4,-3.0);
    g.quadraticCurveTo(0,-4.8,-6.4,-3.0);
    g.closePath();g.fill();ink(1.2);
    g.fillStyle="rgba(240,248,250,.85)";       // reflective stripes
    g.fillRect(-8.6,0.4,17.2,1.8);
    g.fillRect(-8.2,4.0,16.4,1.6);
    g.fillStyle="rgba(0,0,0,.16)";g.fillRect(-0.7,-3.6,1.4,12);
  } else if(isRT){
    const fill=used()/SLOTS;
    g.fillStyle="#7A6114";g.beginPath();g.roundRect(-6.6,-3.8,13.2,4,1.5);g.fill();
    g.save();g.beginPath();g.roundRect(-6.6,-3.8,13.2,4,1.5);g.clip();
    g.fillStyle="#D9B44A";g.fillRect(-6.6,-3.8,13.2*Math.max(.13,fill),4.4);g.restore();
    g.beginPath();g.roundRect(-6.6,-3.8,13.2,4,1.5);ink(1);
  } else if(kind==="RN"){
    g.strokeStyle="#20262C";g.lineWidth=1.4;
    g.beginPath();g.arc(0,0.6,4.4,Math.PI*1.15,Math.PI*1.85);g.stroke();
    g.fillStyle="#9AA3AA";g.beginPath();g.arc(-3.8,1.6,1.5,0,7);g.fill();
  } else if(kind==="Family"){
    g.fillStyle="#9C7A55";g.beginPath();g.roundRect(-11.5,2,5,7,1.6);g.fill();ink(1);
  } else {
    g.fillStyle="#EDE4D2";g.beginPath();g.roundRect(3.4,1.4,4,5,1.2);g.fill();ink(1);
  }
  g.restore(); // chest proportions; keep the head at its original size
  // Contact shadow under the head and small ears give the face depth.
  g.fillStyle="rgba(13,23,31,.24)";
  g.beginPath();g.ellipse(.7,HEADY+2,5,4,0,0,7);g.fill();
  // Turn the entire head around its center, leaving its shoulder placement fixed.
  g.save();g.translate(0,HEADY);g.rotate(Math.PI);g.translate(0,-HEADY);
  g.fillStyle=shade(skin,-.12);
  for(let side=-1;side<=1;side+=2){
    g.beginPath();g.ellipse(side*4.1,HEADY+.2,1.1,1.5,0,0,7);g.fill();
  }
  // head
  g.fillStyle=skin;g.beginPath();g.arc(0,HEADY,HEADR+.2,0,7);g.fill();ink(1.3);
  if(kind==="Clean"){
    g.fillStyle="#5A6672";                      // brim out front
    g.beginPath();g.ellipse(0,HEADY-2.6,4.4,2.6,0,0,7);g.fill();ink(1);
    g.fillStyle=cap;g.beginPath();g.arc(0,HEADY+1.0,HEADR,0,7);g.fill();ink(1);
    g.fillStyle="#D8E24A";g.beginPath();g.arc(0,HEADY+1.0,1.5,0,7);g.fill();   // button
  } else {
    g.fillStyle=cap||hair;g.beginPath();g.arc(0,HEADY+1.0,HEADR,0,7);g.fill();ink(1);
    if(cap){ g.fillStyle="rgba(255,255,255,.16)";
      g.beginPath();g.ellipse(-1.4,HEADY+.2,1.9,1.1,-.5,0,7);g.fill(); }
  }
  g.strokeStyle="rgba(255,255,255,.23)";g.lineWidth=.9;
  g.beginPath();g.arc(-.3,HEADY+.7,3.1,Math.PI,Math.PI*1.65);g.stroke();
  // A skin-toned nose marks the facing direction.
  g.fillStyle=shade(skin,-.12);
  g.beginPath();g.moveTo(-1.6,HEADY-3.4);g.lineTo(1.6,HEADY-3.4);g.lineTo(0,HEADY-5.4);
  g.closePath();g.fill();
  g.restore(); // head rotation
  g.restore();
}

function drawChair(x,y,a,occupied){
  g.save();g.translate(x,y);g.rotate((a===undefined?Math.PI/2:a)+Math.PI/2);
  objectShadow(2,4,16,13);
  // big rear wheels
  [-10,10].forEach(function(wx){
    g.fillStyle=objectMaterial(g,"#20282F",-12,-15,24,30);g.beginPath();g.ellipse(wx,2,3,8,0,0,7);g.fill();
    g.strokeStyle="#8FA3B4";g.lineWidth=1;g.beginPath();g.ellipse(wx,2,1.6,6,0,0,7);g.stroke();
  });
  // castors
  g.fillStyle=objectMaterial(g,"#20282F",-12,-15,24,30);
  g.beginPath();g.arc(-5,-11.5,2.2,0,7);g.fill();
  g.beginPath();g.arc(5,-11.5,2.2,0,7);g.fill();
  // footplates out front
  g.fillStyle=objectMaterial(g,"#33505C",-12,-15,24,30);
  g.beginPath();g.roundRect(-5.6,-16.5,4.6,5,1.4);g.fill();
  g.beginPath();g.roundRect( 1.0,-16.5,4.6,5,1.4);g.fill();
  g.strokeStyle=INK;g.lineWidth=1;
  g.beginPath();g.roundRect(-5.6,-16.5,4.6,5,1.4);g.stroke();
  g.beginPath();g.roundRect( 1.0,-16.5,4.6,5,1.4);g.stroke();
  // frame + seat
  g.fillStyle=objectMaterial(g,"#3E5A66",-12,-15,24,30);g.beginPath();g.roundRect(-8,-8,16,17,3);g.fill();
  g.fillStyle=objectMaterial(g,"#4E7382",-12,-15,24,30);g.beginPath();g.roundRect(-6.5,-6.5,13,10,2.5);g.fill();
  g.fillStyle=objectMaterial(g,"#2E4550",-12,-15,24,30);g.beginPath();g.roundRect(-7.5,4,15,5,2);g.fill();   // backrest
  g.strokeStyle=INK;g.lineWidth=1.4;g.beginPath();g.roundRect(-8,-8,16,17,3);g.stroke();
  // push handles at the back
  g.fillStyle=objectMaterial(g,"#20303A",-12,-15,24,30);
  g.beginPath();g.roundRect(-8.5,9,4,5,1.6);g.fill();
  g.beginPath();g.roundRect(4.5,9,4,5,1.6);g.fill();
  g.strokeStyle=INK;g.lineWidth=1;
  g.beginPath();g.roundRect(-8.5,9,4,5,1.6);g.stroke();
  g.beginPath();g.roundRect(4.5,9,4,5,1.6);g.stroke();
  if(occupied){
    // legs run forward off the seat onto the footplates
    g.fillStyle=objectMaterial(g,"#8C9AA6",-12,-15,24,30);                       // gown trousers
    g.beginPath();g.roundRect(-4.6,-13,4,11,2);g.fill();
    g.beginPath();g.roundRect( 0.6,-13,4,11,2);g.fill();
    g.strokeStyle=INK;g.lineWidth=1;
    g.beginPath();g.roundRect(-4.6,-13,4,11,2);g.stroke();
    g.beginPath();g.roundRect( 0.6,-13,4,11,2);g.stroke();
    g.fillStyle="rgba(0,0,0,.13)";                // knee shading
    g.fillRect(-4.6,-8.5,4,2);g.fillRect(0.6,-8.5,4,2);
    // slippered feet resting on the plates
    g.fillStyle=objectMaterial(g,"#D8DCE0",-12,-15,24,30);
    g.beginPath();g.ellipse(-2.6,-14.6,2.5,3,0,0,7);g.fill();
    g.beginPath();g.ellipse( 2.6,-14.6,2.5,3,0,0,7);g.fill();
    g.strokeStyle=INK;g.lineWidth=1;
    g.beginPath();g.ellipse(-2.6,-14.6,2.5,3,0,0,7);g.stroke();
    g.beginPath();g.ellipse( 2.6,-14.6,2.5,3,0,0,7);g.stroke();

    g.fillStyle=objectMaterial(g,"#8FA3B4",-12,-15,24,30);g.beginPath();g.roundRect(-6.5,-3,13,10,3);g.fill();  // lap blanket
    g.strokeStyle=INK;g.lineWidth=1;g.stroke();
    g.fillStyle="rgba(255,255,255,.10)";g.fillRect(-6.5,-3,13,2.4);
    g.fillStyle=objectMaterial(g,"#D6A87E",-12,-15,24,30);                                                      // hands on the rests
    g.beginPath();g.arc(-6.6,0,2,0,7);g.fill();g.beginPath();g.arc(6.6,0,2,0,7);g.fill();
    // seen from behind: crown and shoulders only
    (function(){
      const hy=-3.4, r=5.6;
      g.fillStyle=objectMaterial(g,"#D6A87E",-12,-15,24,30);g.beginPath();g.ellipse(0,hy,r*0.88,r,0,0,7);g.fill();
      g.fillStyle=objectMaterial(g,"#3A2A20",-12,-15,24,30);
      g.beginPath();g.ellipse(0,hy+r*0.10,r*0.92,r*0.96,0,0,7);g.fill();
      g.beginPath();g.ellipse(0,hy+r*0.62,r*0.44,r*0.34,0,0,7);g.fill();   // nape
      g.fillStyle="rgba(255,250,235,.10)";
      g.beginPath();g.ellipse(-1.5,hy-1.4,2,1.2,-0.5,0,7);g.fill();
      g.strokeStyle=INK;g.lineWidth=1.1;
      g.beginPath();g.ellipse(0,hy,r*0.88,r,0,0,7);g.stroke();
    })();
  }
  g.restore();
}
/* dirty equipment, top-down: a wheeled base with a stack on top */
function drawBucket(x,y,a){
  // top-down mop bucket: yellow tub, grey wringer clamped on the side, castors
  g.save();g.translate(x,y);g.rotate((a===undefined?0:a)+Math.PI/2);
  objectShadow(2,4,16,13);
  // castors peeking out at the corners
  g.fillStyle=objectMaterial(g,"#1C242B",-12,-15,24,30);
  [[-6.5,-6.5],[6.5,-6.5],[-6.5,6.5],[6.5,6.5]].forEach(function(w){
    g.beginPath();g.arc(w[0],w[1],2.1,0,7);g.fill();
  });
  // tub
  g.fillStyle=objectMaterial(g,"#C9A62C",-12,-15,24,30);g.beginPath();g.roundRect(-8.5,-8,17,16,3);g.fill();
  g.fillStyle=objectMaterial(g,"#E2BE3C",-12,-15,24,30);g.beginPath();g.roundRect(-8.5,-8,17,4.5,3);g.fill();  // lit rim
  g.strokeStyle=INK;g.lineWidth=1.4;g.beginPath();g.roundRect(-8.5,-8,17,16,3);g.stroke();
  // water inside, seen from above
  g.fillStyle=objectMaterial(g,"#3A5560",-12,-15,24,30);g.beginPath();g.roundRect(-6,-5.5,12,11,2);g.fill();
  g.fillStyle="rgba(160,205,220,.28)";
  g.beginPath();g.ellipse(-1.6,-1.5,3.6,2.4,0.4,0,7);g.fill();
  g.fillStyle="rgba(230,240,245,.18)";
  g.beginPath();g.ellipse(2.4,2.6,2,1.3,0.2,0,7);g.fill();
  // wringer press on the far side
  g.fillStyle=objectMaterial(g,"#8C949B",-12,-15,24,30);g.beginPath();g.roundRect(-7.5,-11.5,15,5,1.8);g.fill();
  g.fillStyle=objectMaterial(g,"#AAB2B8",-12,-15,24,30);g.fillRect(-6.5,-10.8,13,1.6);
  g.strokeStyle=INK;g.lineWidth=1.1;g.beginPath();g.roundRect(-7.5,-11.5,15,5,1.8);g.stroke();
  // mop head resting in the wringer
  g.fillStyle=objectMaterial(g,"#CFC9B8",-12,-15,24,30);g.beginPath();g.ellipse(0,-8.5,4.4,2.8,0,0,7);g.fill();
  g.strokeStyle="rgba(90,80,64,.5)";g.lineWidth=0.8;
  for(let i=-3;i<=3;i++){
    g.beginPath();g.moveTo(i*1.2,-10.4);g.lineTo(i*1.5,-6.8);g.stroke();
  }
  g.restore();
}
function drawEquip(x,y,type,a){
  g.save();g.translate(x,y);g.rotate((a===undefined?-Math.PI/2:a)+Math.PI/2);
  objectShadow(2,4,16,13);
  // five-spoke rolling base
  g.strokeStyle="#5A6774";g.lineWidth=2.2;
  for(let i=0;i<5;i++){const ang=i/5*6.283;
    g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(ang)*10,Math.sin(ang)*10);g.stroke();
    g.fillStyle=objectMaterial(g,"#20282F",-12,-15,24,30);g.beginPath();g.arc(Math.cos(ang)*10,Math.sin(ang)*10,2,0,7);g.fill();}
  const c=type.c;
  if(type.k==="HFNC"){                       // tall pole, humidifier, coiled tubing
    g.fillStyle=objectMaterial(g,"#8FA3B4",-12,-15,24,30);g.beginPath();g.arc(0,0,3.4,0,7);g.fill();
    g.fillStyle=objectMaterial(g,c,-9,-11,18,20);g.beginPath();g.roundRect(-6,-9,12,13,2.5);g.fill();
    g.fillStyle=objectMaterial(g,"#BEE1EB",-12,-15,24,30);g.fillRect(-4,-6.5,8,5);
    g.strokeStyle="#7FD4E0";g.lineWidth=1.8;
    g.beginPath();g.arc(0,7,5,0,Math.PI*1.6);g.stroke();
  } else if(type.k==="BIPAP"){               // small box + mask hanging off it
    g.fillStyle=objectMaterial(g,c,-9,-11,18,20);g.beginPath();g.roundRect(-8,-8,16,14,3);g.fill();
    g.fillStyle=objectMaterial(g,"#1A222A",-12,-15,24,30);g.fillRect(-5,-5.5,10,5);
    g.fillStyle=objectMaterial(g,"#9BE3B0",-12,-15,24,30);g.beginPath();
    g.moveTo(0,7);g.lineTo(5,11);g.lineTo(0,14);g.lineTo(-5,11);g.closePath();g.fill();
  } else if(type.k==="MONI"){                // screen with a dead trace
    g.fillStyle=objectMaterial(g,c,-9,-11,18,20);g.beginPath();g.roundRect(-8,-9,16,15,2.5);g.fill();
    g.fillStyle=objectMaterial(g,"#0C1218",-12,-15,24,30);g.fillRect(-6,-7,12,10);
    g.strokeStyle="#4E6472";g.lineWidth=1.2;
    g.beginPath();g.moveTo(-5,-2);g.lineTo(5,-2);g.stroke();
  } else {                                   // ventilator: body, screen, circuit
    g.fillStyle=objectMaterial(g,c,-9,-11,18,20);g.beginPath();g.roundRect(-9,-11,18,19,3);g.fill();
    g.fillStyle=objectMaterial(g,"#0C1218",-12,-15,24,30);g.fillRect(-6.5,-9,13,8);
    g.strokeStyle="#4E6472";g.lineWidth=1.2;
    g.beginPath();g.moveTo(-5,-5);g.lineTo(-1,-5);g.lineTo(0,-7.5);
    g.lineTo(1.5,-3);g.lineTo(5,-5);g.stroke();
    g.fillStyle=objectMaterial(g,"#8FA3B4",-12,-15,24,30);g.fillRect(-6,1,12,4);
    g.strokeStyle="#C6D2DA";g.lineWidth=2;
    g.beginPath();g.arc(0,10,5,Math.PI*0.15,Math.PI*0.85);g.stroke();
  }
  g.strokeStyle=INK;g.lineWidth=1.3;
  g.beginPath();g.roundRect(-9,-11,18,20,3);g.stroke();
  // grime marks so it reads as dirty
  g.fillStyle="rgba(120,150,70,.32)";
  g.beginPath();g.arc(-5.5,4,2.2,0,7);g.fill();
  g.beginPath();g.arc(4.5,-7,1.6,0,7);g.fill();
  // Housing seams, vent slots and a satin bezel highlight.
  g.strokeStyle="rgba(228,245,255,.55)";g.lineWidth=.65;
  g.beginPath();g.moveTo(-6,-9);g.lineTo(5,-9);g.stroke();
  g.strokeStyle="#263C4A";
  for(let i=0;i<3;i++){g.beginPath();g.moveTo(3+i*1.4,2);g.lineTo(3+i*1.4,4);g.stroke();}
  g.restore();
}
/* drawn last, so nobody can walk over the words */
/* a thumbnail of the patient for the card, drawn once and cached */
function faceThumb(b){
  if(b.room.id===1) return "/images/patient-bed1-face.webp";  // trying a real portrait for bed 1
  const key=(b.name||"")+"|"+b.skin+"|"+b.hair+"|"+(b.look?JSON.stringify(b.look):"")+"|"+
            (b.state==="code"?"out":b.state==="ready"?"ready":(b.t/b.max)<0.24?"out":"worn");
  if(b._thumbKey===key) return b._thumb;
  const c=document.createElement("canvas"); c.width=c.height=64;
  const cc=c.getContext("2d");
  // draw the face straight onto the thumbnail, then put g back as it was
  const keep=g.getTransform? g.getTransform() : null;
  cc.translate(32,34); cc.scale(2.4,2.4);
  drawFaceOn(cc,0,0,6.4,b.skin||"#D6A87E",b.hair||"#3A2A20",
    b.state==="code"?"out":b.state==="ready"?"ready":(b.t/b.max)<0.24?"out":"worn", b.look);
  b._thumbKey=key; b._thumb=c.toDataURL();
  return b._thumb;
}
function bubble(x,y,txt,alpha,col){
  g.font="600 9.5px 'IBM Plex Mono',monospace";
  const words=txt.split(" ");
  const rows=[]; let cur="";
  words.forEach(function(w2){
    const test=cur?cur+" "+w2:w2;
    if(g.measureText(test).width>124 && cur){ rows.push(cur); cur=w2; }
    else cur=test;
  });
  if(cur) rows.push(cur);
  let w=0; rows.forEach(function(r){ w=Math.max(w,g.measureText(r).width); });
  w+=14;
  const lh=12, h=rows.length*lh+7, top=y-h;
  g.globalAlpha=alpha;
  g.fillStyle="rgba(10,14,19,.95)";
  g.beginPath();g.roundRect(x-w/2,top,w,h,4);g.fill();
  g.strokeStyle=col;g.lineWidth=1.1;
  g.beginPath();g.roundRect(x-w/2,top,w,h,4);g.stroke();
  g.fillStyle="rgba(10,14,19,.95)";
  g.beginPath();g.moveTo(x-3.5,top+h-1);g.lineTo(x+3.5,top+h-1);
  g.lineTo(x,top+h+7);g.closePath();g.fill();
  g.strokeStyle=col;
  g.beginPath();g.moveTo(x-3.5,top+h);g.lineTo(x,top+h+7);g.lineTo(x+3.5,top+h);g.stroke();
  g.fillStyle=col;g.textAlign="center";
  rows.forEach(function(r,ri){ g.fillText(r,x,top+12+ri*lh); });
  g.globalAlpha=1;
}
function drawChatBubble(){
  if(!chat||!chat.on) return;
  bubble(chat.on.x, chat.on.y-26, chat.txt,
         Math.min(1,chat.life/0.6), "rgba(160,196,214,.9)");
}
function drawRantBubble(){
  if(!rant||!rant.bubble||!rant.bubble.on) return;
  const sp2=rant.bubble.on;
  const a=Math.min(1,rant.bubble.life/0.5);
  const bx=sp2.x, by=sp2.y-34;
  g.font="700 12px 'IBM Plex Mono',monospace";
  const words=rant.bubble.txt.split(" ");
  const rows=[]; let cur="";
  words.forEach(function(wd){
    const test=cur?cur+" "+wd:wd;
    if(g.measureText(test).width>150 && cur){ rows.push(cur); cur=wd; }
    else cur=test;
  });
  if(cur) rows.push(cur);
  let w=0; rows.forEach(function(r4){ w=Math.max(w,g.measureText(r4).width); });
  w+=16;
  const lh=15, h=rows.length*lh+8, top=by-h;
  g.globalAlpha=a;
  g.fillStyle="rgba(10,14,19,.97)";
  g.beginPath();g.roundRect(bx-w/2,top,w,h,5);g.fill();
  g.strokeStyle="rgba(240,138,128,.9)";g.lineWidth=1.3;
  g.beginPath();g.roundRect(bx-w/2,top,w,h,5);g.stroke();
  g.fillStyle="rgba(10,14,19,.97)";
  g.beginPath();g.moveTo(bx-4,top+h-1);g.lineTo(bx+4,top+h-1);
  g.lineTo(bx,top+h+8);g.closePath();g.fill();
  g.strokeStyle="rgba(240,138,128,.9)";g.lineWidth=1.3;
  g.beginPath();g.moveTo(bx-4,top+h);g.lineTo(bx,top+h+8);g.lineTo(bx+4,top+h);g.stroke();
  g.fillStyle="#FF9E92";g.textAlign="center";
  rows.forEach(function(r4,ri){ g.fillText(r4,bx,top+15+ri*lh); });
  g.globalAlpha=1;
}

function drawNIV(x,y,a){
  g.save();g.translate(x,y);g.rotate((a===undefined?-Math.PI/2:a)+Math.PI/2);
  objectShadow(2,4,16,13);
  // five-spoke base
  g.strokeStyle="#5A6774";g.lineWidth=2;
  for(let i=0;i<5;i++){const ang=i/5*6.283;
    g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(ang)*9,Math.sin(ang)*9);g.stroke();
    g.fillStyle=objectMaterial(g,"#20282F",-12,-15,24,30);g.beginPath();g.arc(Math.cos(ang)*9,Math.sin(ang)*9,1.8,0,7);g.fill();}
  // the unit
  g.fillStyle=objectMaterial(g,"#3E5A72",-12,-15,24,30);g.beginPath();g.roundRect(-8,-11,16,17,3);g.fill();
  g.fillStyle=objectMaterial(g,"#0C1218",-12,-15,24,30);g.fillRect(-6,-9,12,7);
  g.strokeStyle="#7FD4E0";g.lineWidth=1;
  g.beginPath();
  for(let k=0;k<10;k++){const yy=-5.5-((k===4)?2.5:0);
    if(k)g.lineTo(-5+k,yy);else g.moveTo(-5+k,yy);}
  g.stroke();
  g.fillStyle=objectMaterial(g,"#8FE04A",-12,-15,24,30);g.beginPath();g.arc(-4,0,1.4,0,7);g.fill();
  g.fillStyle=objectMaterial(g,"#F2C94D",-12,-15,24,30);g.beginPath();g.arc(0,0,1.4,0,7);g.fill();
  // humidifier and a coil of tubing
  g.fillStyle=objectMaterial(g,"#BEE1EB",-12,-15,24,30);g.beginPath();g.roundRect(-5,1,10,4,1.5);g.fill();
  g.strokeStyle="#9FB2C0";g.lineWidth=2;
  g.beginPath();g.arc(0,9,5,0,Math.PI*1.5);g.stroke();
  g.strokeStyle=INK;g.lineWidth=1.2;
  g.beginPath();g.roundRect(-8,-11,16,17,3);g.stroke();
  // Housing seams, vent slots and a satin bezel highlight.
  g.strokeStyle="rgba(228,245,255,.55)";g.lineWidth=.65;
  g.beginPath();g.moveTo(-6,-9);g.lineTo(5,-9);g.stroke();
  g.strokeStyle="#263C4A";
  for(let i=0;i<3;i++){g.beginPath();g.moveTo(3+i*1.4,2);g.lineTo(3+i*1.4,4);g.stroke();}
  g.restore();
}
function drawMorgueCart(x,y,a,full){
  g.save();g.translate(x,y);g.rotate((a===undefined?-Math.PI/2:a)+Math.PI/2);
  g.fillStyle="rgba(0,0,0,.34)";g.beginPath();g.roundRect(-11,-21,25,46,3);g.fill();
  g.fillStyle=objectMaterial(g,"#59687A",-12,-15,24,30);g.beginPath();g.roundRect(-12,-23,25,46,3);g.fill();
  g.fillStyle=objectMaterial(g,"#28323C",-12,-15,24,30);g.beginPath();g.roundRect(-9,-20,19,40,2);g.fill();
  if(full){
    // a white bag, zipped, with a toe tag hanging off the end
    g.fillStyle=objectMaterial(g,"#E4E2DA",-12,-15,24,30);
    g.beginPath();g.roundRect(-8,-18,17,36,7);g.fill();
    g.fillStyle="rgba(0,0,0,.10)";
    g.beginPath();g.ellipse(0,-10,6,7,0,0,7);g.fill();
    g.beginPath();g.ellipse(0,7,5.4,9,0,0,7);g.fill();
    g.strokeStyle="rgba(120,124,120,.75)";g.lineWidth=1.2;
    g.beginPath();g.moveTo(0,-17);g.lineTo(0,17);g.stroke();
    for(let k=0;k<11;k++){
      g.fillStyle="rgba(150,154,150,.6)";
      g.fillRect(-1.4,-15+k*3,2.8,1.2);
    }
    g.fillStyle=objectMaterial(g,"#9AA0A2",-12,-15,24,30);g.fillRect(-2,-16,4,4);
    g.strokeStyle="rgba(140,140,132,.8)";g.lineWidth=1;
    g.beginPath();g.roundRect(-8,-18,17,36,7);g.stroke();
    g.strokeStyle="rgba(180,178,168,.7)";g.lineWidth=0.9;
    g.beginPath();g.moveTo(7,15);g.lineTo(12,19);g.stroke();
    g.save();g.translate(14,21);g.rotate(0.4);
    g.fillStyle=objectMaterial(g,"#D8D2C0",-12,-15,24,30);g.fillRect(-4,-3,8,6);
    g.strokeStyle="rgba(120,118,108,.7)";g.lineWidth=0.7;g.strokeRect(-4,-3,8,6);
    g.fillStyle="rgba(90,88,82,.6)";
    g.fillRect(-2.6,-1.4,5.2,0.8);g.fillRect(-2.6,0.4,4,0.8);
    g.restore();
  } else {
    g.fillStyle=objectMaterial(g,"#3E4A56",-12,-15,24,30);g.beginPath();g.roundRect(-8,-18,17,36,4);g.fill();
    g.fillStyle="rgba(255,255,255,.05)";g.fillRect(-8,-18,17,4);
    g.strokeStyle="rgba(90,104,116,.7)";g.lineWidth=1;
    g.beginPath();g.roundRect(-8,-18,17,36,4);g.stroke();
  }
  g.fillStyle=objectMaterial(g,"#141C22",-12,-15,24,30);
  [[-9,-19],[9,-19],[-9,19],[9,19]].forEach(function(w){
    g.beginPath();g.arc(w[0],w[1],2,0,7);g.fill(); });
  g.strokeStyle=INK;g.lineWidth=1.3;g.beginPath();g.roundRect(-12,-23,25,46,3);g.stroke();
  g.restore();
}
function drawCart(x,y,glow){
  g.save();g.translate(x,y);
  if(glow){g.fillStyle="rgba(255,59,78,"+(0.16+Math.sin(t*5)*0.12)+")";
    g.beginPath();g.arc(0,0,21,0,7);g.fill();}
  g.fillStyle="rgba(0,0,0,.36)";g.beginPath();g.roundRect(-11,-12,24,26,3);g.fill();
  g.fillStyle=objectMaterial(g,"#B32130",-12,-15,24,30);g.beginPath();g.roundRect(-12,-13,24,26,3);g.fill();
  g.fillStyle=objectMaterial(g,"#8E1A26",-12,-15,24,30);g.fillRect(-12,-13,24,5);
  for(let i=0;i<3;i++){
    g.fillStyle=objectMaterial(g,"#E4E9ED",-12,-15,24,30);g.fillRect(-9,-6+i*6,18,4);
    g.fillStyle="rgba(0,0,0,.2)";g.fillRect(-9,-2.6+i*6,18,1.2);
  }
  g.strokeStyle=INK;g.lineWidth=1.6;g.beginPath();g.roundRect(-12,-13,24,26,3);g.stroke();
  g.fillStyle="#FFF";g.font="700 8px 'Barlow Condensed',sans-serif";g.textAlign="center";
  g.fillText("+",0,-8);
  // Recessed drawer pulls, bumper corners and castor hubs.
  g.strokeStyle="#566876";g.lineWidth=1.1;
  for(let i=0;i<3;i++){g.beginPath();g.moveTo(-3,-4+i*6);g.lineTo(3,-4+i*6);g.stroke();}
  for(const side of [-1,1]){
    g.fillStyle="#23303B";g.beginPath();g.roundRect(side*11-2,10,4,6,1.2);g.fill();
    g.fillStyle="#AFC2CD";g.fillRect(side*11-1,12,2,1);
  }
  g.strokeStyle="#D6E4EB";g.lineWidth=1.4;
  g.beginPath();g.moveTo(-10,-11);g.lineTo(-10,-16);g.lineTo(10,-16);g.lineTo(10,-11);g.stroke();
  g.restore();
}

/* a supine face seen from directly above; "up" on screen is the crown */
function drawFace(x,y,r,skin,hair,mood,opt){ drawFaceOn(g,x,y,r,skin,hair,mood,opt); }
function drawFaceOn(g,x,y,r,skin,hair,mood,opt){
  // a longer, gaunter head than the staff — these people have been here a while
  const H=r*1.1, W=r*0.84;
  const seed=(x*0.37+y*0.11);
  function jt(i){ const v=Math.sin(seed*13.1+i*57.7)*43758.5453; return (v-Math.floor(v))-0.5; }

  g.fillStyle=skin;
  g.beginPath();
  g.moveTo(x, y-H);
  g.bezierCurveTo(x+W*1.05, y-H*0.78, x+W*1.0,  y+H*0.30, x+W*0.52, y+H*0.80);
  g.bezierCurveTo(x+W*0.24, y+H*1.02, x-W*0.24, y+H*1.02, x-W*0.52, y+H*0.80);
  g.bezierCurveTo(x-W*1.0,  y+H*0.30, x-W*1.05, y-H*0.78, x, y-H);
  g.closePath();g.fill();
  // gaunt hollow under the cheekbone — a cool shadow, not a blush
  g.fillStyle="rgba(40,30,32,.16)";
  g.beginPath();g.ellipse(x-W*0.58,y+H*0.34,W*0.18,H*0.22,0.35,0,7);g.fill();
  g.beginPath();g.ellipse(x+W*0.58,y+H*0.34,W*0.18,H*0.22,-0.35,0,7);g.fill();
  g.strokeStyle=INK;g.lineWidth=1.1;
  g.beginPath();
  g.moveTo(x,y-H);
  g.bezierCurveTo(x+W*1.05, y-H*0.78, x+W*1.0,  y+H*0.30, x+W*0.52, y+H*0.80);
  g.bezierCurveTo(x+W*0.24, y+H*1.02, x-W*0.24, y+H*1.02, x-W*0.52, y+H*0.80);
  g.bezierCurveTo(x-W*1.0,  y+H*0.30, x-W*1.05, y-H*0.78, x, y-H);
  g.closePath();g.stroke();

  // hair: a flat, greasy cap with a few soft strands past the jaw — skipped
  // entirely under a head wrap, which should fully cover it
  const hd=shade(hair,-0.30);
  const wrapped=!!(opt&&opt.wrap);
  if(!wrapped){
    g.fillStyle=hair;
    g.beginPath();
    g.moveTo(x-W*1.00, y-H*0.02);
    g.bezierCurveTo(x-W*1.08, y-H*1.00, x+W*1.08, y-H*1.00, x+W*1.00, y-H*0.02);
    g.bezierCurveTo(x+W*0.62, y-H*0.34, x+W*0.20, y-H*0.20,  x-W*0.10, y-H*0.38);
    g.bezierCurveTo(x-W*0.44, y-H*0.24, x-W*0.72, y-H*0.32, x-W*1.00, y-H*0.02);
    g.closePath();g.fill();
    // clumped into a few soft partings
    g.strokeStyle="rgba(0,0,0,.28)";g.lineWidth=0.9;
    for(let i=0;i<4;i++){
      g.beginPath();
      g.moveTo(x-W*0.62+i*W*0.42, y-H*0.94);
      g.quadraticCurveTo(x-W*0.50+i*W*0.44+jt(i+90)*4, y-H*0.54, x-W*0.66+i*W*0.46, y-H*0.22);
      g.stroke();
    }
    g.fillStyle="rgba(255,250,240,.10)";
    g.beginPath();g.ellipse(x-W*0.36,y-H*0.70,W*0.40,H*0.14,-0.35,0,7);g.fill();
    // a handful of short strands hanging past the jaw — not a radiating crown
    for(let i=0;i<6;i++){
      const side=i<3?-1:1;
      const t2=(i%3)/2;
      const bx=x+side*W*(0.72+t2*0.22), by=y+H*(0.30+t2*0.42);
      const len=H*(0.14+Math.abs(jt(i+20))*0.12);
      const lean=side*(0.18+jt(i+40)*0.1);
      g.save();g.translate(bx,by);g.rotate(lean);
      g.fillStyle= i%2? hair : hd;
      g.beginPath();
      g.moveTo(-1.6,0);
      g.quadraticCurveTo(jt(i+60)*1.6, len*0.6, jt(i+70)*1.2, len);
      g.quadraticCurveTo(1.4, len*0.55, 1.6, 0);
      g.closePath();g.fill();
      g.restore();
    }
  }

  // eyes, sunk in but with a tiny highlight so they read as alive
  const ey=y-H*0.06, ex=W*0.38;
  g.fillStyle="rgba(70,48,42,.14)";
  g.beginPath();g.ellipse(x-ex,ey+1.6,2.6,2.1,0,0,7);g.fill();
  g.beginPath();g.ellipse(x+ex,ey+1.6,2.6,2.1,0,0,7);g.fill();
  g.lineCap="round";
  if(mood==="out"){
    g.strokeStyle="rgba(40,30,24,.75)";g.lineWidth=1;
    g.beginPath();g.moveTo(x-ex-1.3,ey);g.lineTo(x-ex+1.3,ey);g.stroke();
    g.beginPath();g.moveTo(x+ex-1.3,ey);g.lineTo(x+ex+1.3,ey);g.stroke();
  } else {
    g.fillStyle="rgba(34,26,20,.88)";
    g.beginPath();g.arc(x-ex,ey,1.05,0,7);g.fill();
    g.beginPath();g.arc(x+ex,ey,1.05,0,7);g.fill();
    g.fillStyle="rgba(255,255,255,.55)";
    g.beginPath();g.arc(x-ex+0.35,ey-0.35,0.3,0,7);g.fill();
    g.beginPath();g.arc(x+ex+0.35,ey-0.35,0.3,0,7);g.fill();
  }
  // mouth
  g.strokeStyle="rgba(110,66,58,.6)";g.lineWidth=0.9;
  g.beginPath();
  if(mood==="ready") g.arc(x,y+H*0.34,W*0.28,0.22*Math.PI,0.78*Math.PI);
  else { g.moveTo(x-W*0.20,y+H*0.54); g.lineTo(x+W*0.20,y+H*0.54); }
  g.stroke();

  if(!opt) return;
  // head wrapped, with the knot off to one side
  if(opt.wrap){
    g.fillStyle="#E4E0D4";
    g.beginPath();
    g.moveTo(x-W*1.06, y-H*0.10);
    g.bezierCurveTo(x-W*1.10, y-H*1.02, x+W*1.10, y-H*1.02, x+W*1.06, y-H*0.10);
    g.lineTo(x+W*1.02, y-H*0.34);
    g.bezierCurveTo(x+W*0.5, y-H*0.52, x-W*0.5, y-H*0.52, x-W*1.02, y-H*0.34);
    g.closePath();g.fill();
    g.strokeStyle="rgba(0,0,0,.16)";g.lineWidth=0.8;
    for(let i=0;i<3;i++){
      g.beginPath();
      g.moveTo(x-W*1.05, y-H*(0.26+i*0.20));
      g.quadraticCurveTo(x, y-H*(0.42+i*0.20), x+W*1.05, y-H*(0.26+i*0.20));
      g.stroke();
    }
    g.strokeStyle="rgba(0,0,0,.28)";g.lineWidth=0.9;
    g.beginPath();g.ellipse(x,y-H*0.62,W*1.03,H*0.40,0,0,7);g.stroke();
    if(opt.seep){
      g.fillStyle="rgba(150,26,30,.5)";
      g.beginPath();g.ellipse(x+W*0.42,y-H*0.62,W*0.26,H*0.16,0.3,0,7);g.fill();
    }
  }
  // a plaster on the cheek
  if(opt.patch){
    g.save();g.translate(x-W*0.52,y+H*0.24);g.rotate(0.5);
    g.fillStyle="#E8DCC4";g.fillRect(-W*0.30,-H*0.075,W*0.60,H*0.15);
    g.fillStyle="rgba(0,0,0,.12)";g.fillRect(-W*0.09,-H*0.075,W*0.18,H*0.15);
    g.restore();
  }
  // nasal cannula, sitting under the nose
  if(opt.nc){
    g.strokeStyle="rgba(200,232,244,.8)";g.lineWidth=Math.max(0.7,r*0.11);
    g.beginPath();g.moveTo(x-W*0.86,y+H*0.30);
    g.quadraticCurveTo(x,y+H*0.10,x+W*0.86,y+H*0.30);g.stroke();
    g.strokeStyle="rgba(220,242,250,.9)";g.lineWidth=Math.max(0.5,r*0.07);
    g.beginPath();g.moveTo(x-W*0.16,y+H*0.15);g.lineTo(x-W*0.16,y+H*0.05);
    g.moveTo(x+W*0.16,y+H*0.15);g.lineTo(x+W*0.16,y+H*0.05);g.stroke();
  }
}

/* ---- bed, overhead ---- */
function drawBed(b){
  const px=b.room.bx*TILE, py=b.room.by*TILE, W=TILE, H=TILE*2;
  let c="#4A5866", occ=false;
  if(b.state==="active"){const f=Math.min(1,b.t/b.max);c=f>.5?"#35E07F":f>.24?"#F2B33D":"#FF3B4E";occ=true;}
  if(b.state==="code"){c=(Math.floor(t*4)%2)?"#FF3B4E":"#6A1824";occ=true;}
  if(b.state==="ready"){c="#38D6E0";occ=true;}
  if(b.state==="dirty")c="#B4794C";
  if(b.state==="off")c="#33404C";

  // monitor above the headboard
  const mw=W+6, mx=px-3, my=py-19;
  g.fillStyle="#0A1015";g.beginPath();g.roundRect(mx,my,mw,16,2);g.fill();
  g.strokeStyle=c;g.lineWidth=.65;g.beginPath();g.roundRect(mx+.5,my+.5,mw-1,15,2);g.stroke();
  if(occ){
    g.save();g.beginPath();g.rect(mx+11,my+2,mw-16,12);g.clip();
    g.strokeStyle=c;g.lineWidth=1.2;g.beginPath();
    for(let i=0;i<mw-16;i++){
      const p2=((i/(mw-16))+t*2.2+b.room.id)%1;
      let yy=my+8.5;
      if(p2>.40&&p2<.50) yy-=Math.sin((p2-.40)*31.4)*5;
      else if(p2>.50&&p2<.56) yy+=Math.sin((p2-.50)*52.3)*2;
      if(i) g.lineTo(mx+11+i,yy); else g.moveTo(mx+11+i,yy);
    }
    g.stroke();g.restore();
    g.fillStyle=c;g.font="700 7px 'IBM Plex Mono',monospace";g.textAlign="right";
    g.fillText(String(90+Math.floor(Math.sin(t*1.7+b.room.id)*4)),mx+mw-3,my+13);
  }
  g.fillStyle=c;g.font="700 12px 'Barlow Condensed',sans-serif";g.textAlign="left";
  g.fillText(String(b.room.id),mx+3,my+12);g.textAlign="center";
  if(occ&&b.plan){                       // care-needs pips under the bed number
    const remain=b.careMax-b.stage;
    for(let i=0;i<b.careMax;i++){
      g.fillStyle= i<remain ? (remain===1?"#35E07F":remain===2?"#F2B33D":"#FF3B4E")
                            : "rgba(90,110,125,.5)";
      g.fillRect(mx+3+i*5, my+14, 3.6, 2);
    }
  }

  objectShadow(px+W/2+2,py+H/2+4,W*.8,H*.64);

  if(b.room.id===1 && occ && bed1ImageReady){
    // Trying a real top-down photo for the whole bed instead of the
    // procedurally drawn frame/mattress/face — the status-color outline
    // (green/yellow/red/teal, same as every other bed) still draws on top
    // so the at-a-glance vitals read stays intact.
    g.save();
    g.beginPath();g.roundRect(px,py,W,H-2,4);g.clip();
    g.drawImage(BED1_IMAGE,px,py,W,H-2);
    g.restore();
    g.strokeStyle=c;g.lineWidth=.65;g.beginPath();g.roundRect(px,py,W,H-2,4);g.stroke();
  } else {
  // frame
  g.fillStyle="rgba(0,0,0,.34)";g.beginPath();g.roundRect(px+1,py+2,W,H-2,4);g.fill();
  g.fillStyle=objectMaterial(g,"#59687A",px,py,W,H);g.beginPath();g.roundRect(px,py,W,H-2,4);g.fill();
  g.fillStyle=objectMaterial(g,"#3E4A56",px,py,W,H);g.beginPath();g.roundRect(px+1,py+1,W-2,9,3);g.fill();   // headboard
  g.fillStyle=objectMaterial(g,"#3E4A56",px,py,W,H);g.beginPath();g.roundRect(px+1,py+H-12,W-2,9,3);g.fill();// footboard
  g.fillStyle="#28323C";g.beginPath();g.roundRect(px+4,py+10,W-8,H-24,3);g.fill();
  g.fillStyle=objectMaterial(g,"#B9C6D0",px,py,W,H);g.beginPath();g.roundRect(px+5,py+11,W-10,H-26,3);g.fill();
  g.fillStyle=objectMaterial(g,"#D7E1E8",px,py,W,H);g.beginPath();g.roundRect(px+6,py+12,W-12,9,3);g.fill();

  if(occ){
    drawFace(px+W/2, py+18, 6.4, b.skin||"#D6A87E", b.hair||"#3A2A20",
             b.state==="code" ? "out" : b.state==="ready" ? "ready" :
             (b.t/b.max)<0.24 ? "out" : "worn", b.look);
    g.fillStyle="#9FC4D6";g.beginPath();g.roundRect(px+7,py+24,W-14,6,2);g.fill();
    g.fillStyle=objectMaterial(g,"#6E8798",px,py,W,H);g.beginPath();g.roundRect(px+5,py+29,W-10,H-46,3);g.fill();
    g.fillStyle="#7F98A9";g.fillRect(px+5,py+29,W-10,2.5);
    g.fillStyle="rgba(0,0,0,.14)";
    for(let i=1;i<3;i++) g.fillRect(px+6,py+33+i*7,W-12,1.4);
    g.fillStyle="#D6A87E";
    g.beginPath();g.roundRect(px+4,py+26,4,9,2);g.fill();
    g.beginPath();g.roundRect(px+W-8,py+26,4,9,2);g.fill();

  } else {
    g.fillStyle="#3A4550";g.beginPath();g.roundRect(px+5,py+24,W-10,H-40,3);g.fill();
  }
  // Pillow seam and footboard inset add depth without covering status outlines.
  g.strokeStyle="rgba(238,247,250,.45)";g.lineWidth=.7;
  g.beginPath();g.moveTo(px+9,py+14);g.lineTo(px+W-9,py+14);g.stroke();
  g.fillStyle="#263641";g.beginPath();g.roundRect(px+W/2-5,py+H-9,10,2,1);g.fill();
  // Rail hinges, frame fasteners and footboard controls.
  for(const side of [3,W-3]){
    g.fillStyle="#26343F";
    for(const yy of [15,H-19]){g.beginPath();g.arc(px+side,py+yy,.85,0,Math.PI*2);g.fill();}
  }
  g.fillStyle="#152731";g.beginPath();g.roundRect(px+W-12,py+H-8,7,3,1);g.fill();
  g.fillStyle="#8CBABF";g.fillRect(px+W-11,py+H-7.3,2,.7);
  g.fillStyle="#8BC6A3";g.fillRect(px+W-7.5,py+H-7.3,1,.7);
  g.strokeStyle="rgba(220,237,242,.20)";g.lineWidth=.5;
  g.beginPath();g.moveTo(px+8,py+32);g.quadraticCurveTo(px+W/2,py+35,px+W-8,py+33);g.stroke();
  // side rails
  [px+1,px+W-5].forEach(function(rx){
    g.fillStyle=objectMaterial(g,"#7A8C9C",px,py,W,H);g.beginPath();g.roundRect(rx,py+13,4,H-30,2);g.fill();
    g.strokeStyle="#425462";g.lineWidth=.5;g.stroke();
    g.strokeStyle="#CEE0E9";g.lineWidth=.8;
    g.beginPath();g.moveTo(rx+1,py+16);g.lineTo(rx+1,py+H-20);g.stroke();
  });
  g.strokeStyle=c;g.lineWidth=.65;g.beginPath();g.roundRect(px,py,W,H-2,4);g.stroke();
  }

  // the current step laid out at the foot of the bed, greyed until delivered
  if(b.p&&b.p.need&&b.state!=="ready"){
    const n=b.p.need.length, step=13, startX=px+W/2-(n-1)*step/2;
    for(let i=0;i<n;i++){
      const k=b.p.need[i], have=b.got.indexOf(k)>=0;
      const gx=startX+i*step, gy=py+H+6;
      g.fillStyle= have? "rgba(53,224,127,.28)" : "rgba(20,28,34,.85)";
      g.beginPath();g.arc(gx,gy,6.6,0,7);g.fill();
      g.strokeStyle= have? "rgba(53,224,127,.95)" : "rgba(110,130,145,.55)";
      g.lineWidth=1.2;g.beginPath();g.arc(gx,gy,6.6,0,7);g.stroke();
      g.globalAlpha= have? 1 : 0.32;
      icon(k,gx,gy,11);
      g.globalAlpha=1;
      if(have){ g.strokeStyle="rgba(53,224,127,.95)";g.lineWidth=1.4;
        g.beginPath();g.moveTo(gx-2.6,gy+4.4);g.lineTo(gx-0.6,gy+6.2);
        g.lineTo(gx+3.2,gy+1.6);g.stroke(); }
    }
  } else if(b.state==="ready"){
    g.fillStyle="rgba(53,224,127,.9)";g.font="700 8px 'IBM Plex Mono',monospace";
    g.textAlign="center";g.fillText("READY",px+W/2,py+H+9);
  }
}

/* ================= FRAME ================= */
// Live charting displays drawn over the cached workstation furniture.
function drawWorkScreen(x,y,w,h,angle,seed){
  g.save();g.translate(x,y);g.rotate(angle||0);
  g.fillStyle="#091B26";g.fillRect(0,0,w,h);
  g.fillStyle="#24536A";g.fillRect(0,0,w,2);
  g.fillStyle="#A0D6DF";g.fillRect(1,.6,w*.36,.6);
  g.fillStyle="#163744";g.fillRect(1,3,w*.24,h-4);
  for(let row=0;row<3;row++){
    const yy=3.5+row*(h-4)/3;
    g.fillStyle=row===Math.floor(t*.6+seed)%3?"#77BEA2":"#40697B";
    g.fillRect(2,yy,w*.12,.7);
    g.fillStyle="#477C90";g.fillRect(w*.32,yy,w*.47,.55);
    g.fillStyle="#2D5366";g.fillRect(w*.32,yy+1.3,w*.33,.5);
  }
  g.fillStyle="#95DFC2";g.fillRect(w-2,1,1,.7);
  if(Math.floor(t*2+seed)%2===0){g.fillStyle="#C1E6E8";g.fillRect(w*.7,h-2,.6,1);}
  g.fillStyle="rgba(159,219,239,.07)";g.beginPath();g.moveTo(0,0);g.lineTo(w*.6,0);g.lineTo(w*.2,h);g.lineTo(0,h);g.fill();
  g.restore();
}
function draw(){
  g.fillStyle="#04070A";g.fillRect(0,0,VW,VH);
  g.save();
  // Desktop shows the full hospital width; vertical tracking stays with the player.
  const oX=desktopLayout.matches ? 0 : VW/2-player.x*SC;
  const oY=desktopLayout.matches
    ? Math.min(0,Math.max(VH-MH*TILE*SC,VH/2-player.y*SC))
    : VH/2-player.y*SC;
  if(high>0){
    // the room will not hold still
    const w0=Math.min(1,high);
    g.translate(VW/2,VH/2);
    g.rotate(Math.sin(t*0.9)*0.055*w0);
    const bs=1+Math.sin(t*1.6)*0.045*w0;
    g.scale(bs,1/bs);
    g.translate(-VW/2,-VH/2);
    g.translate(Math.sin(t*2.3)*7*w0, Math.cos(t*1.7)*6*w0);
  }
  g.translate(oX,oY);g.scale(SC,SC);

  // world-space rect currently on screen
  const vx0=Math.max(0,-oX/SC), vy0=Math.max(0,-oY/SC);
  const vx1=Math.min(MW*TILE,(-oX+VW)/SC), vy1=Math.min(MH*TILE,(-oY+VH)/SC);
  const vw=vx1-vx0, vh=vy1-vy0;
  if(vw>0&&vh>0) g.drawImage(bg, vx0*SS, vy0*SS, vw*SS, vh*SS, vx0, vy0, vw, vh);
  const pad=TILE*2;
  const inView=function(x,y){ return x>vx0-pad&&x<vx1+pad&&y>vy0-pad&&y<vy1+pad; };

  for(let i=0;i<3;i++){
    const sx=CHARGE.x*TILE+TILE-6, sy=CHARGE.y0*TILE+i*TILE+TILE/2;
    if(inView(sx,sy)){
      g.save();g.translate(sx,sy);g.rotate(-Math.PI/2);
      drawWorkScreen(-12,-6,24,13,0,i);g.restore();
    }
  }
  const receptionX=(WAIT.x0+1)*TILE+8.5, receptionY=WAIT.y0*TILE+35.5;
  if(inView(receptionX,receptionY)) drawWorkScreen(receptionX,receptionY,14,7,0,3);

  beds.forEach(function(b){
    if(!inView((b.room.x0+2)*TILE,(b.room.y0+2)*TILE)) return;
    if(b.state==="active"){
      const f=b.t/b.max; if(f>=.24) return;
      g.fillStyle="rgba(255,59,78,"+(0.05+Math.sin(t*5)*0.04)+")";
      g.fillRect(b.room.x0*TILE,b.room.y0*TILE,4*TILE,4*TILE);
    } else if(b.state==="code"){
      g.fillStyle="rgba(255,59,78,"+(0.10+Math.sin(t*8)*0.07)+")";
      g.fillRect(b.room.x0*TILE,b.room.y0*TILE,4*TILE,4*TILE);
    }
  });
  (function(){
    const px=DIRTY_SPOT.x*TILE,py=DIRTY_SPOT.y*TILE;
    g.fillStyle="rgba(190,120,70,"+(0.14+Math.sin(t*2.5)*0.05)+")";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle="#B4794C";g.lineWidth=1.5;g.setLineDash([4,3]);
    g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    g.textAlign="center";g.fillStyle="#D09763";g.font="700 8px 'IBM Plex Mono',monospace";
    g.fillText("DUMP",px+TILE/2,py+TILE/2+3);
    if(dirtyP>0){g.fillStyle="#E0A870";g.fillRect(px+4,py+TILE-8,(TILE-8)*(dirtyP/DIRTY_T),3);}
  })();
  // ---- empty rooms sit dark: lights off, door closed ----
  beds.forEach(function(b){
    if(b.state!=="off") return;
    const r=b.room;
    if(!inView((r.x0+2)*TILE,(r.y0+2)*TILE)) return;
    g.fillStyle="rgba(4,7,11,.72)";
    g.fillRect(r.x0*TILE,r.y0*TILE,4*TILE,4*TILE);
    // a little spill from the corridor through the doorway
    const dgx=(r.side==="L"? r.x1+1 : r.x0)*TILE;
    const gr=g.createLinearGradient(dgx,0,dgx+(r.side==="L"?-TILE*2:TILE*2),0);
    gr.addColorStop(0,"rgba(150,190,210,.10)");gr.addColorStop(1,"rgba(150,190,210,0)");
    g.fillStyle=gr;
    g.fillRect(r.x0*TILE,(r.y0+1)*TILE,4*TILE,2*TILE);
    g.fillStyle="rgba(120,150,170,.32)";
    g.font="700 7px 'IBM Plex Mono',monospace";g.textAlign="center";
    g.fillText("EMPTY",(r.x0+2)*TILE,(r.y0+2)*TILE+3);
  });

  // ---- dirty rooms: blood, dropped supplies, tangled linen ----
  beds.forEach(function(b){
    if(b.state!=="dirty"||!b.mess) return;
    const r=b.room;
    if(!inView((r.x0+2)*TILE,(r.y0+2)*TILE)) return;
    const m=b.mess;
    // grubby wash over the whole room
    g.fillStyle="rgba(74,52,34,.16)";
    g.fillRect(r.x0*TILE,r.y0*TILE,4*TILE,4*TILE);

    // dragged footprints leading away from the bed
    m.prints.forEach(function(p2){
      g.fillStyle="rgba(96,24,26,"+Math.max(0,p2.a)+")";
      g.beginPath();g.ellipse(p2.x,p2.y,3.4,5,0,0,7);g.fill();
    });
    // blood pooled around the bed
    m.blood.forEach(function(p2){
      g.save();g.translate(p2.x,p2.y);g.scale(p2.sx,1);
      g.fillStyle="rgba(104,16,20,"+p2.a+")";
      g.beginPath();g.arc(0,0,p2.r,0,7);g.fill();
      g.fillStyle="rgba(150,28,30,"+(p2.a*0.55)+")";
      g.beginPath();g.arc(-p2.r*0.25,-p2.r*0.25,p2.r*0.45,0,7);g.fill();
      // spatter
      for(let k=0;k<3;k++){
        const a2=k*2.1+p2.r, d=p2.r+2+k*2.4;
        g.fillStyle="rgba(120,20,24,"+(p2.a*0.5)+")";
        g.beginPath();g.arc(Math.cos(a2)*d,Math.sin(a2)*d,0.9+k*0.25,0,7);g.fill();
      }
      g.restore();
    });
    // crumpled linen on the floor
    m.linen.forEach(function(l){
      g.save();g.translate(l.x,l.y);g.rotate(l.rot);
      g.fillStyle="rgba(0,0,0,.22)";
      g.beginPath();g.roundRect(-l.w/2+1.5,-l.h/2+1.5,l.w,l.h,4);g.fill();
      g.fillStyle="#B3BFC7";
      g.beginPath();g.roundRect(-l.w/2,-l.h/2,l.w,l.h,4);g.fill();
      g.fillStyle="rgba(0,0,0,.14)";
      g.fillRect(-l.w/2+2,-1,l.w-4,1.6);
      g.fillStyle="rgba(120,30,32,.30)";
      g.beginPath();g.arc(l.w*0.16,-l.h*0.1,l.h*0.3,0,7);g.fill();
      g.restore();
    });
    // dropped wrappers, caps, a stray syringe
    m.trash.forEach(function(q){
      g.save();g.translate(q.x,q.y);g.rotate(q.rot);
      g.fillStyle="rgba(0,0,0,.25)";g.fillRect(-q.w/2+1,-q.h/2+1,q.w,q.h);
      g.fillStyle=q.c;g.fillRect(-q.w/2,-q.h/2,q.w,q.h);
      g.restore();
    });
    // biohazard flag at the door so you can spot it from the corridor
    (function(){
      const dx2=r.dx*TILE+TILE/2, dy2=r.dy*TILE+TILE/2;
      const pulse=0.45+Math.sin(t*2.6+r.id)*0.18;
      g.strokeStyle="rgba(200,140,60,"+pulse+")";g.lineWidth=2;
      g.setLineDash([4,4]);
      g.strokeRect(r.x0*TILE+3,r.y0*TILE+3,4*TILE-6,4*TILE-6);
      g.setLineDash([]);
      g.fillStyle="rgba(214,150,66,"+pulse+")";
      g.font="700 8px 'IBM Plex Mono',monospace";g.textAlign="left";
      g.fillText("SOILED",r.x0*TILE+7,(r.y1+1)*TILE-8);
      g.textAlign="center";
    })();
  });

  // dirty utility equipment bays — only marked out during the event
  const bayLive = events.some(function(e){return e.kind==="clean";}) || eqParked.length>0;
  if(bayLive) EQ_SPOTS.forEach(function(sp,i){
    const px=sp.x*TILE, py=sp.y*TILE;
    const filled=eqParked.some(function(e){return e.tx===sp.x&&e.ty===sp.y;});
    const live = carry==="equip" && !filled;
    g.fillStyle= filled? "rgba(200,178,58,.16)"
               : live? "rgba(200,178,58,"+(0.16+Math.sin(t*3.4)*0.07)+")"
               : "rgba(200,178,58,.07)";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle= filled?"rgba(200,178,58,.75)":"rgba(200,178,58,"+(live?.85:.35)+")";
    g.lineWidth=1.5;g.setLineDash(filled?[]:[5,3]);
    g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    if(!filled){
      g.textAlign="center";g.fillStyle="rgba(216,196,90,"+(live?.95:.5)+")";
      g.font="700 7px 'IBM Plex Mono',monospace";
      g.fillText("BAY "+(i+1),px+TILE/2,py+TILE/2+2.5);
    }
  });
  // bay counter on the floor of the utility room
  if(bayLive) (function(){
    const cx=(DIRTY.x0+DIRTY.x1+1)/2*TILE, cy=DIRTY_SPOT.y*TILE-TILE*0.4;
    g.textAlign="center";
    g.fillStyle= eqParked.length>=EQ_SPOTS.length? "rgba(143,224,74,.9)":"rgba(200,178,58,.55)";
    g.font="700 8px 'IBM Plex Mono',monospace";
    g.fillText(eqParked.length+" / "+EQ_SPOTS.length+" RACKED",cx,cy);
  })();

  // discharge spot
  (function(){
    const px=DISCHARGE.x*TILE, py=DISCHARGE.y*TILE;
    const live=(carry==="patient"), pulse=.28+Math.sin(t*3.2)*.16;
    g.fillStyle= live? "rgba(53,224,127,"+(pulse*0.75)+")" : "rgba(53,224,127,.10)";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle= live?"rgba(53,224,127,.95)":"rgba(53,224,127,.45)";
    g.lineWidth=1.5;g.setLineDash([5,3]);g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    g.textAlign="center";g.font="700 7px 'IBM Plex Mono',monospace";
    g.fillStyle= live?"rgba(140,255,190,.95)":"rgba(53,224,127,.62)";
    g.font="700 6px 'IBM Plex Mono',monospace";
    g.fillText("SEND",px+TILE/2,py+TILE/2-1);
    g.fillText("HOME",px+TILE/2,py+TILE/2+6.5);
  })();
  // ---- the two patients already in recovery ----
  (function(){
    const px=(RECOV.x1)*TILE, py=(RECOV.y0+1)*TILE;
    if(inView(px,py)){
      drawFace(px+1.5, py+11, 5.8, "#C89A6E", "#2B2018", "out");
      g.fillStyle="rgba(200,232,244,.45)";
      g.beginPath();g.ellipse(px+1.5,py+13,5,3.8,0,0,7);g.fill();
      g.strokeStyle="rgba(150,190,205,.7)";g.lineWidth=1;g.stroke();
      // a nurse at this one too, checking the pump
      const nx=px-20, ny=py+26;
      drawPerson(nx,ny,0,"#5A7A94",false,
        {kind:"RN",hair:"#4E3520",skin:"#A87D56",phase:t*1.3,moving:Math.sin(t*1.6)>0.4});
    }
  })();
  (function(){
    const px=(RECOV.x0+1)*TILE, py=(RECOV.y0+1)*TILE;
    if(!inView(px,py)) return;
    drawFace(px+1.5, py+11, 5.8, "#D6A87E", "#4E3520", "out");
    // mask over the face
    g.fillStyle="rgba(200,232,244,.45)";
    g.beginPath();g.ellipse(px+1.5,py+13,5,3.8,0,0,7);g.fill();
    g.strokeStyle="rgba(150,190,205,.7)";g.lineWidth=1;g.stroke();
    // a nurse standing over them, writing it down
    const nx=px+22, ny=py+22;
    drawPerson(nx,ny,Math.PI,"#3B87DE",false,
      {kind:"RN",hair:"#2B2018",skin:"#CBA57F",phase:t*1.4,moving:false});
    g.fillStyle="#E8E2D4";
    g.save();g.translate(nx-7,ny+2);g.rotate(-0.3);
    g.fillRect(-4,-5,8,10);
    g.strokeStyle=INK;g.lineWidth=1;g.strokeRect(-4,-5,8,10);
    g.fillStyle="#9AA6AE";
    for(let i=0;i<3;i++) g.fillRect(-2.6,-3+i*2.6,5.2,0.9);
    g.restore();
  })();

  // ---- the case in the OR ----
  (function(){
    const cx=(OR_TABLE.x+0.5)*TILE, cy=(OR_TABLE.y+0.5)*TILE;
    if(!inView(cx,cy)) return;

    // patient on the table
    g.fillStyle="#9FC4D6";g.beginPath();g.roundRect(cx-9,cy-22,18,40,4);g.fill();
    g.strokeStyle=INK;g.lineWidth=1.2;g.stroke();
    drawFace(cx,cy-14,6,"#D6A87E","#3A2A20","out");

    // ---- ETT, taped, running back to the ventilator ----
    (function(){
      const mx=cx, my=cy-11;                       // corner of the mouth
      // corrugated circuit looping off to the machine at the head
      const ax=cx-2, ay=cy-48;
      g.lineCap="round";
      g.strokeStyle="#2A3742";g.lineWidth=5.4;
      g.beginPath();g.moveTo(mx-2,my);
      g.bezierCurveTo(cx-14,cy-20, cx-12,cy-36, ax,ay);g.stroke();
      g.strokeStyle="#8FA3B4";g.lineWidth=4.2;
      g.beginPath();g.moveTo(mx-2,my);
      g.bezierCurveTo(cx-14,cy-20, cx-12,cy-36, ax,ay);g.stroke();
      // ribbing along the tubing
      g.strokeStyle="rgba(30,40,48,.5)";g.lineWidth=1;
      for(let i=1;i<11;i++){
        const u2=i/11, iu=1-u2;
        const bx2=iu*iu*iu*(mx-2)+3*iu*iu*u2*(cx-14)+3*iu*u2*u2*(cx-12)+u2*u2*u2*ax;
        const by2=iu*iu*iu*my+3*iu*iu*u2*(cy-20)+3*iu*u2*u2*(cy-36)+u2*u2*u2*ay;
        g.beginPath();g.arc(bx2,by2,2.1,0,7);g.stroke();
      }
      // the tube itself at the lip, and the tape holding it
      g.strokeStyle="#DCE6EC";g.lineWidth=2.6;
      g.beginPath();g.moveTo(mx,my+2.5);g.lineTo(mx-3,my-1.5);g.stroke();
      g.fillStyle="#E8DCC4";
      g.save();g.translate(mx-1,my+1);g.rotate(-0.5);
      g.fillRect(-5.5,-2,11,4);
      g.fillStyle="rgba(0,0,0,.14)";g.fillRect(-5.5,-2,11,1);
      g.restore();
      // pilot balloon
      g.fillStyle="#C6D2DA";g.beginPath();g.arc(mx-7,my+5,2,0,7);g.fill();
      g.strokeStyle="#8E9BA4";g.lineWidth=0.9;g.stroke();
      // ETCO2 trace on the machine, breathing in time
      const sw2=Math.sin(t*1.9);
      // capnography on the machine face
      const gx2=cx-13, gy2=cy-62;
      g.fillStyle="#0C1218";g.fillRect(gx2,gy2,13,10);
      g.strokeStyle="#F2C94D";g.lineWidth=1.1;g.beginPath();
      for(let k=0;k<11;k++){
        const ph=((k/11)+t*0.30)%1;
        let yy=gy2+8;
        if(ph>0.10&&ph<0.62) yy-=5.6;
        else if(ph>=0.62&&ph<0.72) yy-=5.6*(1-(ph-0.62)/0.10);
        if(k) g.lineTo(gx2+1+k,yy); else g.moveTo(gx2+1+k,yy);
      }
      g.stroke();
      g.strokeStyle="rgba(62,84,98,.9)";g.lineWidth=1;g.strokeRect(gx2+.5,gy2+.5,12,9);
      // bellows rising and falling beside it
      const bh=4+Math.max(0,sw2)*5;
      const bx3=cx+2, by3=cy-62;
      g.fillStyle="#2A3742";g.fillRect(bx3,by3,10,11);
      g.fillStyle="rgba(190,225,240,.6)";g.fillRect(bx3+1,by3+10-bh,8,bh);
      g.strokeStyle="rgba(150,190,205,.75)";g.lineWidth=0.8;
      for(let i=0;i<3;i++){ g.beginPath();
        g.moveTo(bx3+1,by3+10-bh+i*(bh/3));g.lineTo(bx3+9,by3+10-bh+i*(bh/3));g.stroke(); }
      g.strokeStyle=INK;g.lineWidth=1;g.strokeRect(bx3,by3,10,11);
    })();

    if(orOpen){
      // open surgical field — drapes back, and it is not going well
      g.fillStyle="#7FA8B8";g.fillRect(cx-10,cy-6,20,22);
      g.fillStyle="rgba(120,20,24,.35)";g.fillRect(cx-10,cy-6,20,22);
      g.fillStyle="#5E0E12";
      g.beginPath();g.ellipse(cx,cy+4,7.5,9,0,0,7);g.fill();
      g.fillStyle="#8E1418";
      g.beginPath();g.ellipse(cx-1.5,cy+2.5,5,6.5,0.3,0,7);g.fill();
      // retractors holding it open
      g.strokeStyle="#C6D2DA";g.lineWidth=1.8;g.lineCap="round";
      g.beginPath();g.moveTo(cx-9,cy+1);g.lineTo(cx-4,cy+4);g.stroke();
      g.beginPath();g.moveTo(cx+9,cy+1);g.lineTo(cx+4,cy+4);g.stroke();
      g.beginPath();g.moveTo(cx,cy+13);g.lineTo(cx,cy+7);g.stroke();
      // wet highlight, and it keeps welling up
      g.fillStyle="rgba(200,60,60,"+(0.22+Math.sin(t*2.6)*0.10)+")";
      g.beginPath();g.ellipse(cx+1.5,cy+3,3,3.6,0.2,0,7);g.fill();
      // suction line running off the field
      g.strokeStyle="#7A1418";g.lineWidth=2.2;
      g.beginPath();g.moveTo(cx+5,cy+9);
      g.quadraticCurveTo(cx+22,cy+16,cx+30,cy+30);g.stroke();
      // a bloodied clamp or two on the drape
      g.strokeStyle="#9FB2C0";g.lineWidth=1.4;
      g.beginPath();g.moveTo(cx-7,cy+16);g.lineTo(cx-2,cy+18);g.stroke();
      g.beginPath();g.moveTo(cx+6,cy+14);g.lineTo(cx+2,cy+17);g.stroke();
    } else {
      // closed and covered, ready to move
      g.fillStyle="#8FA3B4";g.beginPath();g.roundRect(cx-9,cy-6,18,22,3);g.fill();
      g.fillStyle="rgba(120,20,24,.22)";g.fillRect(cx-9,cy+2,18,5);
      g.strokeStyle=INK;g.lineWidth=1;g.stroke();
    }

    // the team, still at it
    surgeons.forEach(function(sg){
      const lean = orOpen ? Math.sin(t*1.9+sg.ph)*2.2 : 0;
      const back = orOpen ? 0 : 9;
      const sx=cx+sg.ox+(sg.ox>0?back:-back), sy=cy+sg.oy+lean*0.4;
      const face=Math.atan2(cy-sy, cx-sx);
      drawPerson(sx,sy,face,sg.col,false,
        {kind:"Aide",hair:"#2B2018",skin:"#CBA57F",phase:t*2+sg.ph,
         moving:orOpen&&Math.sin(t*1.9+sg.ph)>0});
      // gloved hands working over the field
      if(orOpen){
        const hx=sx+Math.cos(face)*14, hy=sy+Math.sin(face)*14;
        g.fillStyle="#7A1418";
        g.beginPath();g.arc(hx+Math.sin(t*3+sg.ph)*1.6, hy+Math.cos(t*3+sg.ph)*1.6, 2.6,0,7);g.fill();
        g.strokeStyle="rgba(14,20,26,.5)";g.lineWidth=1;g.stroke();
      }
    });
  })();

  // ---- bed bugs ----
  if(bugRoom){
    const r=bugRoom;
    g.strokeStyle="rgba(190,120,60,"+(0.30+Math.sin(t*3)*0.12)+")";
    g.lineWidth=2;g.setLineDash([6,5]);
    g.strokeRect(r.x0*TILE+3,r.y0*TILE+3,4*TILE-6,4*TILE-6);
    g.setLineDash([]);
  }
  // what is left of the ones you got
  splats.forEach(function(sp2){
    const a=Math.max(0,1-sp2.t/14);
    g.globalAlpha=a;
    g.fillStyle="rgba(92,34,18,.62)";
    sp2.bits.forEach(function(b2){
      g.save();g.translate(b2.x,b2.y);g.rotate(b2.rot);g.scale(b2.sx,1);
      g.beginPath();g.arc(0,0,b2.r,0,7);g.fill();g.restore();
    });
    g.fillStyle="rgba(64,22,12,.75)";
    g.save();g.translate(sp2.x,sp2.y);g.rotate(sp2.a);
    g.beginPath();g.ellipse(0,0,sp2.r*1.5,sp2.r*0.9,0,0,7);g.fill();
    // the flattened remains
    g.fillStyle="rgba(40,16,10,.8)";
    g.beginPath();g.ellipse(0,0,sp2.r*0.7,sp2.r*0.42,0,0,7);g.fill();
    for(let k=0;k<6;k++){
      const a2=k*1.05;
      g.strokeStyle="rgba(40,16,10,.7)";g.lineWidth=1.1;
      g.beginPath();g.moveTo(Math.cos(a2)*sp2.r*0.5,Math.sin(a2)*sp2.r*0.35);
      g.lineTo(Math.cos(a2)*sp2.r*1.35,Math.sin(a2)*sp2.r*0.9);g.stroke();
    }
    g.restore();
    g.globalAlpha=1;
  });
  // the live ones
  bugs.forEach(function(bg){
    if(!inView(bg.x,bg.y)) return;
    const dying=bg.dead>0;
    const sc=dying? Math.max(0,1-bg.dead/0.5) : 1;
    g.save();g.translate(bg.x,bg.y);g.rotate(bg.a);g.scale(sc,sc);
    g.fillStyle="rgba(0,0,0,.34)";
    g.beginPath();g.ellipse(1,1.5,9,6.5,0,0,7);g.fill();
    // legs, scurrying
    g.strokeStyle="#4A2416";g.lineWidth=1.5;g.lineCap="round";
    for(let i=0;i<3;i++){
      const off=(i-1)*4.6, kick=Math.sin(bg.wig+i*2.1)*3.2;
      g.beginPath();g.moveTo(off,-4);g.lineTo(off-1+kick,-9.5);g.stroke();
      g.beginPath();g.moveTo(off, 4);g.lineTo(off-1-kick, 9.5);g.stroke();
    }
    // antennae
    g.lineWidth=1.2;
    g.beginPath();g.moveTo(7,-2.5);g.lineTo(13,-5+Math.sin(bg.wig*0.6)*1.6);g.stroke();
    g.beginPath();g.moveTo(7, 2.5);g.lineTo(13, 5+Math.cos(bg.wig*0.6)*1.6);g.stroke();
    // body — flat, banded, unpleasant
    g.fillStyle="#7A3A1E";
    g.beginPath();g.ellipse(0,0,9,6.5,0,0,7);g.fill();
    g.fillStyle="#5E2A14";
    for(let i=0;i<4;i++){
      g.beginPath();g.ellipse(-4.5+i*3,0,1.1,5.6-i*0.5,0,0,7);g.fill();
    }
    g.fillStyle="#8E4826";
    g.beginPath();g.ellipse(5.5,0,4,4.6,0,0,7);g.fill();
    g.fillStyle="#2A1008";
    g.beginPath();g.arc(7.6,-2,1.1,0,7);g.fill();
    g.beginPath();g.arc(7.6, 2,1.1,0,7);g.fill();
    g.strokeStyle=INK;g.lineWidth=1.2;
    g.beginPath();g.ellipse(0,0,9,6.5,0,0,7);g.stroke();
    g.restore();
  });

  // ---- fire ----
  if(fireRoom){
    g.fillStyle="rgba(255,120,40,"+(0.06+Math.sin(t*7)*0.03)+")";
    g.fillRect(fireRoom.x0*TILE,fireRoom.y0*TILE,4*TILE,4*TILE);
  }
  fires.forEach(function(f){
    if(!inView(f.x,f.y)) return;
    const fl=f.fl||0, wob=1+Math.sin(fl*9+f.x)*0.12;
    const R=f.r*wob*(0.6+f.hp*0.12);
    const gr=g.createRadialGradient(f.x,f.y,2,f.x,f.y,R*1.8);
    gr.addColorStop(0,"rgba(255,240,180,.9)");
    gr.addColorStop(0.35,"rgba(255,150,40,.75)");
    gr.addColorStop(1,"rgba(200,60,10,0)");
    g.fillStyle=gr;g.beginPath();g.arc(f.x,f.y,R*1.8,0,7);g.fill();
    for(let i=0;i<4;i++){
      const a2=fl*3+i*1.57, h=R*(0.9+Math.sin(fl*11+i)*0.3);
      g.fillStyle= i%2? "rgba(255,196,60,.85)":"rgba(255,120,30,.8)";
      g.beginPath();
      g.moveTo(f.x-R*0.4,f.y+R*0.4);
      g.quadraticCurveTo(f.x+Math.sin(a2)*R*0.4, f.y-h*0.6, f.x, f.y-h);
      g.quadraticCurveTo(f.x+Math.cos(a2)*R*0.4, f.y-h*0.5, f.x+R*0.4, f.y+R*0.4);
      g.closePath();g.fill();
    }
    // smoke
    for(let i=0;i<3;i++){
      const p2=((fl*0.5+i*0.33)%1);
      g.fillStyle="rgba(60,55,55,"+(0.22*(1-p2))+")";
      g.beginPath();g.arc(f.x+Math.sin(fl*2+i)*7, f.y-R-p2*30, 4+p2*9,0,7);g.fill();
    }
  });
  if(smoker && inView(smoker.x,smoker.y)){
    const sm=smoker;
    const a=sm.out? Math.max(0,1-sm.fade/3.5) : 1;
    g.globalAlpha=a;
    // he is on his feet, patting at himself
    const panic=sm.out?0:Math.sin(t*11+sm.ph);
    g.save();g.translate(sm.x,sm.y);g.rotate(panic*0.16);g.translate(-sm.x,-sm.y);
    drawPerson(sm.x, sm.y, sm.face, sm.out?"#6E7A84":"#8E5A3A", false,
      {kind:"Family",hair:sm.hair,skin:sm.skin,
       phase:t*(sm.out?0:16)+sm.ph, moving:!sm.out});
    g.restore();
    if(!sm.out){
      // alight — flames climbing off his shoulders
      for(let i=0;i<5;i++){
        const fl=t*6+i*1.26, hgt=13+Math.sin(t*13+i)*6;
        const ox=Math.cos(i*1.26)*7, oy=Math.sin(i*1.26)*5;
        const gr=g.createRadialGradient(sm.x+ox,sm.y+oy,1,sm.x+ox,sm.y+oy,hgt);
        gr.addColorStop(0,"rgba(255,240,180,.85)");
        gr.addColorStop(.4,"rgba(255,150,40,.7)");
        gr.addColorStop(1,"rgba(200,60,10,0)");
        g.fillStyle=gr;
        g.beginPath();
        g.moveTo(sm.x+ox-4,sm.y+oy+4);
        g.quadraticCurveTo(sm.x+ox+Math.sin(fl)*4, sm.y+oy-hgt*0.6,
                           sm.x+ox, sm.y+oy-hgt);
        g.quadraticCurveTo(sm.x+ox+4, sm.y+oy-hgt*0.4, sm.x+ox+4, sm.y+oy+4);
        g.closePath();g.fill();
      }
      // and smoke off the top of him
      for(let i=0;i<4;i++){
        const p3=((t*0.55+i*0.25)%1);
        g.fillStyle="rgba(60,55,55,"+(0.26*(1-p3))+")";
        g.beginPath();g.arc(sm.x+Math.sin(t*2+i)*8, sm.y-16-p3*34, 4+p3*11,0,7);g.fill();
      }
      // the cigarette, still going
      const cx2=sm.x+Math.cos(sm.face)*9, cy2=sm.y+Math.sin(sm.face)*9;
      g.strokeStyle="#E8E2D4";g.lineWidth=1.6;g.lineCap="round";
      g.beginPath();g.moveTo(cx2,cy2);g.lineTo(cx2+3,cy2+3);g.stroke();
      g.fillStyle="#FF7A30";g.beginPath();g.arc(cx2+3.6,cy2+3.6,1.4,0,7);g.fill();
      g.fillStyle="rgba(255,200,120,.45)";
      g.beginPath();g.arc(sm.x,sm.y,22,0,7);g.fill();
    } else {
      // out, singed, and quietly leaving
      g.fillStyle="rgba(40,36,34,.35)";
      g.beginPath();g.arc(sm.x,sm.y,11,0,7);g.fill();
      for(let i=0;i<3;i++){
        const p3=((t*0.4+i*0.33)%1);
        g.fillStyle="rgba(90,85,85,"+(0.18*(1-p3)*a)+")";
        g.beginPath();g.arc(sm.x+Math.sin(t+i)*5, sm.y-14-p3*20, 3+p3*7,0,7);g.fill();
      }
    }
    g.globalAlpha=1;
  }
  if(ext && inView(ext.tx*TILE,ext.ty*TILE)){
    const px=ext.tx*TILE+TILE/2, py=ext.ty*TILE+TILE/2;
    const pulse=.3+Math.sin(t*4)*.2;
    g.fillStyle="rgba(255,80,60,"+(pulse*0.45)+")";g.beginPath();g.arc(px,py,17,0,7);g.fill();
    g.fillStyle="#B32130";g.beginPath();g.roundRect(px-6,py-11,12,21,3);g.fill();
    g.fillStyle="#2E3A44";g.fillRect(px-4,py-14,8,4);
    g.fillStyle="#E8EDF1";g.fillRect(px-4.5,py-3,9,4);
    g.strokeStyle=INK;g.lineWidth=1.3;g.beginPath();g.roundRect(px-6,py-11,12,21,3);g.stroke();
  }
  // the spray
  if(spray>0){
    const a=player.face===undefined?Math.PI/2:player.face;
    g.save();g.translate(player.x,player.y);g.rotate(a);
    for(let i=0;i<14;i++){
      const d=16+Math.random()*54;
      const off=(Math.random()-0.5)*d*0.42;
      g.fillStyle="rgba(226,240,246,"+(0.28*Math.random())+")";
      g.beginPath();g.arc(d,off,2+Math.random()*4,0,7);g.fill();
    }
    g.restore();
  }

  // ---- the infected ----
  corpses.forEach(function(c){
    const a=Math.max(0,1-c.t/9);
    g.globalAlpha=a;
    g.fillStyle="rgba(30,45,35,.55)";
    g.beginPath();g.ellipse(c.x,c.y,13,9,c.a,0,7);g.fill();
    g.globalAlpha=1;
  });
  darts.forEach(function(d){
    g.save();g.translate(d.x,d.y);g.rotate(d.a);
    g.fillStyle="#DCE6EC";g.fillRect(-5,-1.1,10,2.2);
    g.fillStyle="#E05A5A";g.fillRect(2,-1.6,4,3.2);
    g.restore();
  });

  // the narcan kit, somewhere on the unit
  if(narcan){
    const px=narcan.tx*TILE+TILE/2, py=narcan.ty*TILE+TILE/2+Math.sin(t*2.4)*1.6;
    if(inView(px,py)){
      const pulse=0.3+Math.sin(t*3.4)*0.18;
      g.fillStyle="rgba(232,228,218,"+(pulse*0.5)+")";
      g.beginPath();g.arc(px,py,17,0,7);g.fill();
      g.fillStyle="rgba(0,0,0,.35)";g.beginPath();g.ellipse(px,py+10,10,4,0,0,7);g.fill();
      g.fillStyle="#E8E4DA";g.beginPath();g.roundRect(px-11,py-8,22,16,3);g.fill();
      g.fillStyle="#C43A44";g.fillRect(px-3,py-6,6,12);g.fillRect(px-8,py-1.5,16,3);
      g.fillStyle="#B8B2A4";g.fillRect(px-4,py-11,8,3);
      g.strokeStyle=INK;g.lineWidth=1.3;g.beginPath();g.roundRect(px-11,py-8,22,16,3);g.stroke();
    }
  }

  // ---- isolation rooms: PPE box outside, warning on the door ----
  beds.forEach(function(b){
    const r=b.room;
    if(!r.iso || !ISO_ACTIVE(b)) return;
    if(!inView((r.x0+2)*TILE,(r.y0+2)*TILE)) return;
    // amber border on the room while they're in there
    g.strokeStyle="rgba(242,201,77,"+(0.28+Math.sin(t*2.4)*0.10)+")";
    g.lineWidth=2;g.setLineDash([6,5]);
    g.strokeRect(r.x0*TILE+3,r.y0*TILE+3,4*TILE-6,4*TILE-6);
    g.setLineDash([]);
    g.fillStyle="rgba(242,201,77,.55)";g.font="700 7px 'IBM Plex Mono',monospace";
    g.textAlign="center";
    g.fillText("ISOLATION",(r.x0+2)*TILE,(r.y1+1)*TILE-6);
    // the box you gown from
    const px=r.ppe.x*TILE, py=r.ppe.y*TILE;
    const live=!ppe, pulse=.3+Math.sin(t*3.6)*.16;
    g.fillStyle= live? "rgba(159,214,224,"+(pulse*0.45)+")" : "rgba(159,214,224,.10)";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle="rgba(159,214,224,"+(live?.9:.4)+")";g.lineWidth=1.5;
    g.setLineDash([5,3]);g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    // a stack of gowns and a glove box on the wall
    g.fillStyle="#C6D2DA";
    g.fillRect(px+7,py+6,8,9);g.fillRect(px+17,py+6,8,9);
    g.fillStyle="#5FA8C4";g.fillRect(px+7,py+17,18,5);
    g.strokeStyle=INK;g.lineWidth=1;
    g.strokeRect(px+7,py+6,8,9);g.strokeRect(px+17,py+6,8,9);
    g.fillStyle= live?"rgba(200,240,250,.95)":"rgba(159,214,224,.6)";
    g.font="700 6px 'IBM Plex Mono',monospace";
    g.fillText("PPE",px+TILE/2,py+TILE-4);
  });

  // ---- OR transport markers ----
  (function(){
    const ev=events.find(function(e){return e.kind==="ortx";});
    if(!ev) return;
    // PPE zones light up until you're gowned
    if(!ppe) PPE_ZONES.forEach(function(z){
      const px=z.x*TILE, py=z.y*TILE, pulse=.3+Math.sin(t*4)*.18;
      g.fillStyle="rgba(159,214,224,"+(pulse*0.5)+")";g.fillRect(px+3,py+3,TILE-6,TILE-6);
      g.strokeStyle="rgba(159,214,224,.9)";g.lineWidth=1.6;g.setLineDash([5,3]);
      g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
      g.textAlign="center";g.fillStyle="rgba(200,240,250,.95)";
      g.font="700 6.5px 'IBM Plex Mono',monospace";
      g.fillText("PPE",px+TILE/2,py+TILE/2+2.5);
    });
    // collect / handover pads
    const pad=function(sp,txt,on){
      const px=sp.x*TILE, py=sp.y*TILE, pulse=.3+Math.sin(t*4.2)*.18;
      g.fillStyle= on? "rgba(120,215,190,"+(pulse*0.55)+")" : "rgba(120,215,190,.12)";
      g.fillRect(px+3,py+3,TILE-6,TILE-6);
      g.strokeStyle="rgba(120,215,190,"+(on?.95:.45)+")";g.lineWidth=1.6;
      g.setLineDash([5,3]);g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
      g.textAlign="center";g.fillStyle= on?"rgba(190,255,230,.98)":"rgba(140,220,200,.7)";
      g.font="700 6.5px 'IBM Plex Mono',monospace";
      g.fillText(txt[0],px+TILE/2,py+TILE/2-1);
      g.fillText(txt[1],px+TILE/2,py+TILE/2+6);
    };
    if(orPt&&orPt.stage==="recovery") pad(OR_PICK,["COLLECT","THEM"],ppe&&!carry);
    if(carry==="orpatient"&&orPt&&orPt.dest) pad({x:orPt.dest.room.dx,y:orPt.dest.room.dy},
      ["BED "+orPt.dest.room.id,"SETTLE"],true);
  })();

  // washroom OD
  if(od){
    const alpha = od.out>5 ? Math.max(0,1-(od.out-5)/3) : 1;
    g.globalAlpha=alpha;
    if(inView(od.x,od.y)){
      // slumped on the floor, face down
      g.fillStyle="rgba(0,0,0,.34)";
      g.beginPath();g.ellipse(od.x,od.y+3,16,10,0.3,0,7);g.fill();
      g.fillStyle="#4E5A66";
      g.beginPath();g.ellipse(od.x,od.y,13,9,0.3,0,7);g.fill();
      g.strokeStyle=INK;g.lineWidth=1.2;g.stroke();
      g.fillStyle="#8A94A0";
      g.beginPath();g.roundRect(od.x-14,od.y+2,10,5,2);g.fill();
      g.beginPath();g.roundRect(od.x+5,od.y-7,10,5,2);g.fill();
      g.fillStyle="#C89A6E";
      g.beginPath();g.arc(od.x-11,od.y-6,5.4,0,7);g.fill();
      g.fillStyle="#3A2A20";g.beginPath();g.arc(od.x-11,od.y-5.4,4.9,0,7);g.fill();
      g.strokeStyle=INK;g.lineWidth=1.1;g.beginPath();g.arc(od.x-11,od.y-6,5.4,0,7);g.stroke();
      if(od.out<=0){
        g.strokeStyle="rgba(255,59,78,"+(0.4+Math.sin(t*5)*0.2)+")";g.lineWidth=2;
        g.setLineDash([4,4]);g.beginPath();g.arc(od.x,od.y,24,0,7);g.stroke();g.setLineDash([]);
      }
    }
    od.nurses.forEach(function(n){
      if(inView(n.x,n.y)) drawPerson(n.x,n.y,od.out>2.2?-Math.PI/2:0,"#3B87DE",false,
        {kind:"RN",hair:"#2B2018",skin:"#CBA57F",phase:t*8,moving:true});
    });
    g.globalAlpha=1;
  }
  // the delivery pad in the washroom
  (function(){
    const ev=events.find(function(e){return e.kind==="od";});
    if(!ev) return;
    const px=WASH_SPOT.x*TILE, py=WASH_SPOT.y*TILE;
    const live=(carry==="cart");
    const pulse=.3+Math.sin(t*4.2)*.2;
    g.fillStyle= live? "rgba(255,59,78,"+(pulse*0.55)+")" : "rgba(255,59,78,.14)";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle="rgba(255,59,78,"+(live?.95:.5)+")";g.lineWidth=1.6;
    g.setLineDash([5,3]);g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    g.textAlign="center";g.fillStyle= live?"rgba(255,160,168,.98)":"rgba(255,120,130,.7)";
    g.font="700 6.5px 'IBM Plex Mono',monospace";
    g.fillText("CART",px+TILE/2,py+TILE/2-2);
    g.fillText("HERE",px+TILE/2,py+TILE/2+5);
  })();


  // the recovery workstation screen — somebody is playing something
  (function(){
    const sx=(RECOV.x1)*TILE+2, sy=(RECOV.y1)*TILE+4;
    if(!inView(sx,sy)) return;
    const w=22, h=15;
    g.fillStyle="#141C22";g.fillRect(sx-2,sy-2,w+4,h+4);
    g.fillStyle="#08131A";g.fillRect(sx,sy,w,h);
    // a tiny ward on the screen: corridor, rooms, a moving dot
    g.fillStyle="#16303A";g.fillRect(sx+w/2-2,sy+1,4,h-2);
    for(let r2=0;r2<3;r2++){
      g.fillStyle="#12262E";
      g.fillRect(sx+2,sy+2+r2*4.4,6,3.4);
      g.fillRect(sx+w-8,sy+2+r2*4.4,6,3.4);
      g.fillStyle= (Math.floor(t*1.2)%3===r2) ? "#35E07F":"#1E4A44";
      g.fillRect(sx+3,sy+3+r2*4.4,1.6,1.6);
      g.fillRect(sx+w-7,sy+3+r2*4.4,1.6,1.6);
    }
    // the little player, doing laps
    const px2=sx+w/2+Math.sin(t*1.6)*1.4;
    const py2=sy+2+((t*7)%(h-4));
    g.fillStyle="#38D6E0";g.beginPath();g.arc(px2,py2,1.5,0,7);g.fill();
    // scanline shimmer and the glow it throws
    g.fillStyle="rgba(120,220,220,"+(0.05+Math.sin(t*9)*0.03)+")";
    g.fillRect(sx,sy+((t*22)%h),w,1.4);
    g.strokeStyle="rgba(90,200,210,.5)";g.lineWidth=1;g.strokeRect(sx+.5,sy+.5,w-1,h-1);
    const gl=g.createRadialGradient(sx+w/2,sy+h/2,2,sx+w/2,sy+h/2,30);
    gl.addColorStop(0,"rgba(80,200,220,.16)");gl.addColorStop(1,"rgba(80,200,220,0)");
    g.fillStyle=gl;g.fillRect(sx-20,sy-20,w+40,h+40);
  })();

  // ---- the electrician ----
  if(spark){
    if(!spark.found){
      // a beacon so you can find him in the dark
      const pulse=0.35+Math.sin(t*4)*0.2;
      g.fillStyle="rgba(242,201,77,"+(pulse*0.5)+")";
      g.beginPath();g.arc(spark.x,spark.y,20,0,7);g.fill();
      g.strokeStyle="rgba(242,201,77,"+pulse+")";g.lineWidth=2;g.setLineDash([5,5]);
      g.beginPath();g.arc(spark.x,spark.y,26,0,7);g.stroke();g.setLineDash([]);
    }
    if(inView(spark.x,spark.y)){
      drawPerson(spark.x,spark.y,spark.face,"#8E6A2E",false,
        {kind:"Aide",hair:spark.hair,skin:spark.skin,
         phase:spark.phase,moving:spark.moving,hideArms:true});
      // hard hat and a toolbox
      g.fillStyle="#F2C94D";g.beginPath();g.arc(spark.x,spark.y-1,7.4,0,7);g.fill();
      g.fillStyle="#D8A82E";g.beginPath();g.arc(spark.x,spark.y-1,4.6,0,7);g.fill();
      g.strokeStyle=INK;g.lineWidth=1.1;g.beginPath();g.arc(spark.x,spark.y-1,7.4,0,7);g.stroke();
      const bx=spark.x+Math.cos(spark.face+Math.PI/2)*11;
      const by=spark.y+Math.sin(spark.face+Math.PI/2)*11;
      g.fillStyle="#B33A2E";g.beginPath();g.roundRect(bx-6,by-4,12,9,2);g.fill();
      g.fillStyle="#8E9BA4";g.fillRect(bx-3,by-6,6,2);
      g.strokeStyle=INK;g.lineWidth=1;g.beginPath();g.roundRect(bx-6,by-4,12,9,2);g.stroke();
      if(spark.done){
        g.fillStyle="rgba(53,224,127,.5)";
        g.beginPath();g.arc(spark.x,spark.y,17,0,7);g.fill();
      }
    }
    // the panel he is heading for
    if(spark.found && !spark.done){
      const px=ELEC.x*TILE, py=ELEC.y*TILE;
      const pulse=.3+Math.sin(t*4.2)*.18;
      g.fillStyle="rgba(242,201,77,"+(pulse*0.45)+")";
      g.fillRect(px+3,py+3,TILE-6,TILE-6);
      g.strokeStyle="rgba(242,201,77,.85)";g.lineWidth=1.6;
      g.setLineDash([5,3]);g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
      g.textAlign="center";g.fillStyle="rgba(255,232,160,.95)";
      g.font="700 6.5px 'IBM Plex Mono',monospace";
      g.fillText("PANEL",px+TILE/2,py+TILE/2+2);

      // and a line from him to it
      g.strokeStyle="rgba(242,201,77,.25)";g.lineWidth=1.4;g.setLineDash([6,6]);
      g.beginPath();g.moveTo(spark.x,spark.y);g.lineTo(px+TILE/2,py+TILE/2);g.stroke();
      g.setLineDash([]);
    }
  }

  // ---- the newborn, and the machine it needs ----
  if(baby){
    const a=baby.fade>3 ? Math.max(0,1-(baby.fade-3)/3) : 1;
    g.globalAlpha=a;
    // on the warmer, swaddled
    g.fillStyle="rgba(0,0,0,.28)";
    g.beginPath();g.ellipse(baby.x,baby.y+7,11,6,0,0,7);g.fill();
    g.fillStyle="#E8C7A8";g.beginPath();g.ellipse(baby.x,baby.y+1,6,7.5,0,0,7);g.fill();
    g.fillStyle="#E4A8C0";g.beginPath();g.roundRect(baby.x-5,baby.y+2,10,10,3);g.fill();
    g.fillStyle="#D9B08E";g.beginPath();g.arc(baby.x,baby.y-3,4,0,7);g.fill();
    g.fillStyle="#3A2A20";g.beginPath();g.arc(baby.x,baby.y-4,3.5,Math.PI,0);g.fill();
    g.strokeStyle=INK;g.lineWidth=1;g.beginPath();g.arc(baby.x,baby.y-3,4,0,7);g.stroke();
    if(!baby.on){
      // working hard — quick shallow breathing and a red flag
      const puff=0.5+Math.sin(t*7+baby.ph)*0.5;
      g.strokeStyle="rgba(255,90,80,"+(0.35+puff*0.35)+")";
      g.lineWidth=2;g.setLineDash([4,4]);
      g.beginPath();g.arc(baby.x,baby.y,19+puff*3,0,7);g.stroke();g.setLineDash([]);
      g.fillStyle="rgba(255,120,110,"+(0.5+puff*0.4)+")";
      g.font="700 6.5px 'IBM Plex Mono',monospace";g.textAlign="center";
      g.fillText("NIV",baby.x,baby.y-13);
    } else {
      // the mask and tubing, sized for somebody very small
      g.strokeStyle="#9FB2C0";g.lineWidth=2.2;g.lineCap="round";
      g.beginPath();g.moveTo(baby.x+3,baby.y-4);
      g.quadraticCurveTo(baby.x+14,baby.y-8,baby.x+18,baby.y+2);g.stroke();
      g.strokeStyle="#C6D2DA";g.lineWidth=1.2;
      g.beginPath();g.moveTo(baby.x+3,baby.y-4);
      g.quadraticCurveTo(baby.x+14,baby.y-8,baby.x+18,baby.y+2);g.stroke();
      g.fillStyle="rgba(200,232,244,.75)";
      g.beginPath();g.ellipse(baby.x,baby.y-2.5,4.2,3.2,0,0,7);g.fill();
      g.strokeStyle="rgba(150,190,205,.9)";g.lineWidth=1;g.stroke();
      // the strap over the head
      g.strokeStyle="rgba(220,230,236,.8)";g.lineWidth=1.4;
      g.beginPath();g.moveTo(baby.x-4.5,baby.y-4);g.lineTo(baby.x+4.5,baby.y-4);g.stroke();
      // settled, breathing evenly
      const br=0.5+Math.sin(t*2.2)*0.5;
      g.strokeStyle="rgba(80,220,140,"+(0.25+br*0.25)+")";
      g.lineWidth=2;g.beginPath();g.arc(baby.x,baby.y,17,0,7);g.stroke();
    }
    g.globalAlpha=1;
  }
  // the machine, wherever it has got to
  if(niv && !niv.held){
    const px=niv.tx*TILE+TILE/2, py=niv.ty*TILE+TILE/2;
    if(inView(px,py)){
      const pulse=.3+Math.sin(t*3.4)*.18;
      g.fillStyle="rgba(159,214,224,"+(pulse*0.5)+")";
      g.beginPath();g.arc(px,py,18,0,7);g.fill();
      drawNIV(px,py,-Math.PI/2);
    }
  }

  // ---- washroom sliding doors ----
  (function(){
    const px=2*TILE, py=42*TILE;
    if(!inView(px,py)) return;
    const open=wcDoor, half=TILE/2;
    g.fillStyle="#141C22";g.fillRect(px-2,py+1,TILE+4,TILE-2);
    g.fillStyle="#5C6E7A";g.fillRect(px-2,py+1,TILE+4,2.6);
    g.fillStyle="rgba(255,255,255,.16)";g.fillRect(px-2,py+1,TILE+4,1);
    [-1,1].forEach(function(sd){
      const slide=open*(half-2);
      const x0=sd<0 ? px+slide : px+half-slide;
      const w=half-slide;
      if(w<=0.5) return;
      g.fillStyle="#3E4E5A";g.fillRect(x0,py+4,w,TILE-7);
      g.fillStyle="rgba(170,205,220,.22)";g.fillRect(x0+1,py+6,Math.max(0,w-2),TILE-11);
      g.fillStyle="rgba(230,245,250,.16)";
      g.fillRect(x0+1,py+6,Math.max(0,Math.min(w-2,4)),TILE-11);
      g.strokeStyle="rgba(20,28,34,.9)";g.lineWidth=1.1;
      g.strokeRect(x0+.5,py+4.5,Math.max(0,w-1),TILE-8);
      g.fillStyle="#8E9BA4";
      if(sd<0) g.fillRect(x0+w-3.5,py+TILE/2-4,2,8);
      else     g.fillRect(x0+1.5,py+TILE/2-4,2,8);
    });
    if(open>0.05){
      const gr=g.createLinearGradient(0,py,0,py-TILE);
      gr.addColorStop(0,"rgba(180,215,230,"+(0.14*open)+")");
      gr.addColorStop(1,"rgba(180,215,230,0)");
      g.fillStyle=gr;g.fillRect(px-4,py-TILE,TILE+8,TILE);
    }
    g.fillStyle="rgba(159,196,214,"+(0.5+open*0.4)+")";
    g.font="700 6px 'IBM Plex Mono',monospace";g.textAlign="center";
    g.fillText("WC",px+TILE/2,py-3);
  })();

  // ---- two people having their say ----
  if(rant){
    const R=rant;
    let anyClose=false;
    R.who.forEach(function(r2){
      if(r2.close) anyClose=true;
      if(!inView(r2.x,r2.y)) return;
      g.save();g.translate(r2.x,r2.y);
      g.rotate(r2.close? Math.sin(R.t*3.5+r2.spot.y)*0.10 : 0);
      g.translate(-r2.x,-r2.y);
      drawPerson(r2.x,r2.y,r2.face||0,r2.col,false,
        {kind:"Family",hair:r2.hair,skin:r2.skin,phase:r2.phase||0,moving:r2.moving});
      g.restore();
      // steam, worse the closer they get
      const heat=r2.close?1:0.45;
      for(let i=0;i<3;i++){
        const ph=((R.t*0.7+i*0.33+r2.spot.y)%1);
        g.fillStyle="rgba(220,120,100,"+(0.22*heat*(1-ph))+")";
        g.beginPath();g.arc(r2.x+(i-1)*7, r2.y-16-ph*18, 3+ph*6,0,7);g.fill();
      }
    });
    // hemmed in
    if(anyClose){
      g.strokeStyle="rgba(240,138,128,"+(0.30+Math.sin(t*6)*0.16)+")";
      g.lineWidth=2;g.setLineDash([5,5]);
      g.beginPath();g.arc(player.x,player.y,26,0,7);g.stroke();
      g.setLineDash([]);
    }
    // the waiting room is where you need to be
    if(!anyClose){
      const pulse=.24+Math.sin(t*3)*.12;
      g.strokeStyle="rgba(240,138,128,"+pulse+")";g.lineWidth=2;
      g.setLineDash([6,5]);
      g.strokeRect(WAIT.x0*TILE+3,WAIT.y0*TILE+3,4*TILE-6,7*TILE-6);
      g.setLineDash([]);
    }
    // how much you have taken so far
    if(rantP>0 && anyClose){
      const fr=Math.min(1,rantP/RANT_HOLD);
      g.strokeStyle="rgba(240,138,128,.9)";g.lineWidth=3;g.lineCap="round";
      g.beginPath();
      g.arc(player.x,player.y,30,-Math.PI/2,-Math.PI/2+fr*Math.PI*2);
      g.stroke();g.lineCap="butt";
    }
  }

  // ---- the fight ----
  if(fight){
    const f=fight;
    if(inView(f.x,f.y)){
      // dust and swinging
      for(let i=0;i<5;i++){
        const a2=f.t*4+i*1.25, d=16+Math.sin(f.t*7+i)*6;
        g.fillStyle="rgba(200,190,170,"+(0.06+Math.sin(f.t*9+i)*0.04)+")";
        g.beginPath();g.arc(f.x+Math.cos(a2)*d,f.y+Math.sin(a2)*d*0.7,5+Math.sin(f.t*6+i)*2,0,7);g.fill();
      }
      [f.a,f.b].forEach(function(m,i){
        const sw=Math.sin(f.t*9+m.ph);
        const lean=sw*0.26;
        const mx=m.x+sw*(i?-3:3), my=m.y+Math.cos(f.t*8+m.ph)*2;
        g.save();g.translate(mx,my);g.rotate(lean);g.translate(-mx,-my);
        drawPerson(mx,my, i? Math.PI:0, m.col,false,
          {kind:"Family",hair:m.hair,skin:m.skin,phase:f.t*9,moving:true,hideArms:true});
        g.restore();
        // arms flailing at each other
        const ang=(i?Math.PI:0)+sw*0.5;
        const hx=mx+Math.cos(ang)*15, hy=my+Math.sin(ang)*15;
        g.strokeStyle="rgba(14,20,26,.5)";g.lineWidth=5.4;g.lineCap="round";
        g.beginPath();g.moveTo(mx,my);g.lineTo(hx,hy);g.stroke();
        g.strokeStyle=m.col;g.lineWidth=4;
        g.beginPath();g.moveTo(mx,my);g.lineTo(hx,hy);g.stroke();
        g.fillStyle=m.skin;g.beginPath();g.arc(hx,hy,3,0,7);g.fill();
      });
      // impact stars
      if(Math.sin(f.t*9)>0.86){
        g.strokeStyle="rgba(255,220,140,.8)";g.lineWidth=2;
        for(let k=0;k<5;k++){
          const a3=k*1.25+f.t;
          g.beginPath();
          g.moveTo(f.x+Math.cos(a3)*5,f.y+Math.sin(a3)*5);
          g.lineTo(f.x+Math.cos(a3)*13,f.y+Math.sin(a3)*13);g.stroke();
        }
      }
    }
    // where to stand
    const px=f.spot.x*TILE, py=f.spot.y*TILE;
    const pulse=.3+Math.sin(t*4.4)*.18;
    g.fillStyle="rgba(230,90,80,"+(pulse*0.5)+")";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle="rgba(230,90,80,.9)";g.lineWidth=1.6;
    g.setLineDash([5,3]);g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    g.textAlign="center";g.fillStyle="rgba(255,180,170,.95)";
    g.font="700 6.5px 'IBM Plex Mono',monospace";
    g.fillText("GET IN",px+TILE/2,py+TILE/2-1);
    g.fillText("THERE",px+TILE/2,py+TILE/2+6);

  }
  // what it cost you
  drips.forEach(function(d){
    g.fillStyle="rgba(150,22,26,"+Math.min(0.75,d.life*0.55)+")";
    g.beginPath();g.ellipse(d.x,d.y,d.r,d.r*1.5,0,0,7);g.fill();
  });

  // the vending machine pad
  (function(){
    const px=VEND.x*TILE, py=VEND.y*TILE;
    if(!inView(px,py)) return;
    const pulse=.24+Math.sin(t*2.6)*.10;
    g.fillStyle="rgba(242,201,77,"+(pulse*0.5)+")";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle="rgba(242,201,77,.65)";g.lineWidth=1.5;
    g.setLineDash([5,3]);g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    g.textAlign="center";g.fillStyle="rgba(248,224,150,.92)";
    g.font="700 6.5px 'IBM Plex Mono',monospace";
    g.fillText("SPEND",px+TILE/2,py+TILE/2-1);
    g.fillText("COINS",px+TILE/2,py+TILE/2+6);

  })();

  // birthday party spot
  (function(){
    const ev=events.find(function(e){return e.kind==="party";});
    if(!ev && dance<=0) return;
    const px=PARTY.x*TILE, py=PARTY.y*TILE;
    const pulse=.3+Math.sin(t*4.6)*.2;
    g.fillStyle="rgba(247,168,200,"+(pulse*0.5)+")";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle="rgba(247,168,200,.9)";g.lineWidth=1.6;g.setLineDash([5,3]);
    g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    g.textAlign="center";g.fillStyle="rgba(255,205,225,.95)";
    g.font="700 6.5px 'IBM Plex Mono',monospace";
    g.fillText("CAKE",px+TILE/2,py+TILE/2-1);
    g.fillText("HERE",px+TILE/2,py+TILE/2+6);
    // a little cake on the table beside it
    const cx=px+TILE/2, cy=py-6;
    g.fillStyle="#E8D7C0";g.beginPath();g.arc(cx,cy,6,0,7);g.fill();
    g.fillStyle="#F28FB4";g.beginPath();g.arc(cx,cy,4,0,7);g.fill();
    g.strokeStyle=INK;g.lineWidth=1;g.beginPath();g.arc(cx,cy,6,0,7);g.stroke();
    for(let i=0;i<4;i++){
      const a2=i*1.571+t*0.5;
      g.fillStyle="#F2E04D";
      g.beginPath();g.arc(cx+Math.cos(a2)*2.6,cy+Math.sin(a2)*2.6,1,0,7);g.fill();
    }
  })();

  // food & drink spot
  (function(){
    const px=COFFEE.x*TILE, py=COFFEE.y*TILE;
    const live = energy<98;
    g.fillStyle="rgba(185,138,78,"+(0.12+Math.sin(t*2.2)*0.05)+")";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle="rgba(185,138,78,"+(live?.7:.35)+")";
    g.lineWidth=1.5;g.setLineDash([4,3]);
    g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    g.textAlign="center";g.fillStyle="rgba(216,178,120,.9)";
    g.font="700 6.5px 'IBM Plex Mono',monospace";
    g.fillText("COFFEE",px+TILE/2,py+TILE/2+2.5);
  })();
  beds.forEach(function(b){
    if(!b.active||b.state==="ready"||b.state==="off"||b.state==="dirty") return;
    const px=b.room.dx*TILE, py=b.room.dy*TILE, isCode=b.state==="code";
    const pulse=.3+Math.sin(t*3.4)*.18;
    g.fillStyle= isCode? "rgba(255,59,78,"+(pulse*0.5)+")" : "rgba(56,214,224,"+(pulse*0.4)+")";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle= isCode?"rgba(255,59,78,.85)":"rgba(56,214,224,.75)";
    g.lineWidth=1.5;g.setLineDash([5,3]);g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    g.fillStyle= isCode?"rgba(255,140,150,.95)":"rgba(56,214,224,.9)";
    g.font="700 8px 'IBM Plex Mono',monospace";g.textAlign="center";
    g.fillText(isCode?"CART":"DROP",px+TILE/2,py+TILE/2+3);
  });

  // a bed that's ready flags its drop zone for the wheelchair
  beds.forEach(function(b){
    if(b.state!=="ready") return;
    const px=b.room.dx*TILE, py=b.room.dy*TILE;
    const urgent=b.t<READY_T*0.34;
    const pulse=.3+Math.sin(t*(urgent?6:3.4))*.2;
    g.fillStyle= urgent? "rgba(255,59,78,"+(pulse*0.5)+")" : "rgba(53,224,127,"+(pulse*0.45)+")";
    g.fillRect(px+3,py+3,TILE-6,TILE-6);
    g.strokeStyle= urgent?"rgba(255,59,78,.9)":"rgba(53,224,127,.85)";
    g.lineWidth=1.5;g.setLineDash([5,3]);
    g.strokeRect(px+3,py+3,TILE-6,TILE-6);g.setLineDash([]);
    g.textAlign="center";g.fillStyle= urgent?"rgba(255,150,158,.95)":"rgba(140,255,190,.95)";
    g.font="700 7px 'IBM Plex Mono',monospace";
    g.fillText("CHAIR",px+TILE/2,py+TILE/2+2.5);
  });

  // beds sit under everything that moves
  beds.forEach(function(b){ if(inView((b.room.bx+.5)*TILE,(b.room.by+1)*TILE)) drawBed(b); });

  // dirty equipment, loose and racked
  eqParked.forEach(function(e){
    drawEquip(e.tx*TILE+TILE/2, e.ty*TILE+TILE/2, e.t, -Math.PI/2);
  });
  eqLoose.forEach(function(e){
    const ex=e.tx*TILE+TILE/2, ey=e.ty*TILE+TILE/2;
    if(!inView(ex,ey)) return;
    g.fillStyle="rgba(200,178,58,"+(0.10+Math.sin(t*2.6+e.tx)*0.05)+")";
    g.beginPath();g.arc(ex,ey,16,0,7);g.fill();
    drawEquip(ex,ey,e.t,-Math.PI/2);
  });

  // parked wheelchairs
  chairs.forEach(function(c){
    const cx=c.tx*TILE+TILE/2, cy=c.ty*TILE+TILE/2;
    if(inView(cx,cy)) drawChair(cx,cy,-Math.PI/2,false);
  });

  // loose tools
  loose.forEach(function(l){
    const px=l.tx*TILE+TILE/2, py=l.ty*TILE+TILE/2+Math.sin(t*2.6+l.tx)*1.5;
    if(!inView(px,py)) return;
    g.fillStyle="rgba(0,0,0,.36)";g.beginPath();g.ellipse(px+1,py+2,12,11,0,0,7);g.fill();
    g.fillStyle="rgba(14,20,26,.92)";g.beginPath();g.arc(px,py,12,0,7);g.fill();
    g.strokeStyle="rgba(201,162,39,.9)";g.lineWidth=.65;
    g.beginPath();g.arc(px,py,12,0,7);g.stroke();
    icon(l.key,px,py,19);
  });
  carts.forEach(function(c){ drawCart(c.tx*TILE+TILE/2, c.ty*TILE+TILE/2, true); });
  mcarts.forEach(function(c){ drawMorgueCart(c.tx*TILE+TILE/2, c.ty*TILE+TILE/2, -Math.PI/2, c.full); });

  // wet floor left by housekeeping
  if(!zomb) cleaners.forEach(function(c){
    c.wet.forEach(function(w){
      if(!inView(w.x,w.y)) return;
      g.fillStyle="rgba(150,200,220,"+(w.a*0.22)+")";
      g.beginPath();g.ellipse(w.x,w.y,w.r,w.r*0.62,0.3,0,7);g.fill();
      g.strokeStyle="rgba(190,230,245,"+(w.a*0.28)+")";g.lineWidth=1.1;
      g.beginPath();g.ellipse(w.x,w.y,w.r*0.7,w.r*0.42,0.3,0,7);g.stroke();
    });
  });

  // housekeeping, with their buckets
  if(!zomb) cleaners.forEach(function(c){
    if(!inView(c.x,c.y)) return;
    // bucket parked off to one side
    const px2=Math.cos(c.face+Math.PI/2), py2=Math.sin(c.face+Math.PI/2);
    drawBucket(c.x+px2*17, c.y+py2*17, c.face);
    // mop being pushed out in front, sweeping as they work
    const sweep=Math.sin(t*2.4+c.x*0.05)*0.5;
    const ma=c.face+sweep;
    const hx=c.x+Math.cos(ma)*9,  hy=c.y+Math.sin(ma)*9;
    const mx=c.x+Math.cos(ma)*20, my=c.y+Math.sin(ma)*20;
    g.strokeStyle="#B08A4E";g.lineWidth=2.4;g.lineCap="round";
    g.beginPath();g.moveTo(hx,hy);g.lineTo(mx,my);g.stroke();
    g.save();g.translate(mx,my);g.rotate(ma+Math.PI/2);
    g.fillStyle="rgba(0,0,0,.25)";g.beginPath();g.ellipse(0,1.5,6,3.4,0,0,7);g.fill();
    g.fillStyle="#D8D2C0";g.beginPath();g.ellipse(0,0,5.6,3.2,0,0,7);g.fill();
    g.strokeStyle="rgba(90,80,64,.55)";g.lineWidth=0.8;
    for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(i*1.5,-2.6);g.lineTo(i*1.8,2.6);g.stroke();}
    g.strokeStyle=INK;g.lineWidth=1;g.beginPath();g.ellipse(0,0,5.6,3.2,0,0,7);g.stroke();
    g.restore();
    drawPerson(c.x,c.y,c.face,"#7A3E42",false,
      {kind:"Clean",hair:c.hair,skin:c.skin,phase:c.phase||0,moving:c.moving});
  });

  // a colleague coming to cover
  if(friend){
    const fb=friend.bed;
    if(fb){
      const gx=(fb.room.dx+.5)*TILE, gy=(fb.room.dy+.5)*TILE;
      g.strokeStyle="rgba(127,212,224,"+(0.30+Math.sin(t*4)*0.14)+")";
      g.lineWidth=1.6;g.setLineDash([5,5]);
      g.beginPath();g.moveTo(friend.x,friend.y);g.lineTo(gx,gy);g.stroke();
      g.setLineDash([]);
      g.beginPath();g.arc(gx,gy,13+Math.sin(t*4)*2,0,7);g.stroke();
    }
    if(inView(friend.x,friend.y)){
      const puff=0.34+Math.sin(t*7)*0.16;
      g.fillStyle="rgba(127,212,224,"+puff+")";
      g.beginPath();g.arc(friend.x,friend.y,17,0,7);g.fill();
      drawPerson(friend.x,friend.y,friend.face,"#2E7E86",true,
        {kind:"RT",hair:friend.hair,skin:friend.skin,phase:friend.phase,moving:friend.moving});
      if(friend.work>0){
        g.fillStyle="#06090C";g.fillRect(friend.x-16,friend.y-30,32,6);
        g.fillStyle="#7FD4E0";g.fillRect(friend.x-15,friend.y-29,30*Math.min(1,friend.work/1.6),4);
      }
    }
  }

  // receptionist behind the desk
  if(!zomb && reception && inView(reception.x,reception.y)){
    const r2=reception, sway=Math.sin(t*0.9+r2.ph)*0.10;
    drawPerson(r2.x, r2.y, r2.face+sway, "#5A7A94", false,
               {kind:"RN",hair:r2.hair,skin:r2.skin,phase:0,moving:false});
  }

  // charting at the desk, facing their screens
  if(!zomb) desked.forEach(function(d){
    if(!inView(d.x,d.y)) return;
    const sway=Math.sin(t*1.5+d.ph)*1.6;
    drawPerson(d.x, d.y+sway*0.3, Math.PI, d.col, false,
      {kind:d.kind,hair:d.hair,skin:d.skin,
       phase:t*1.6+d.ph, moving:Math.sin(t*1.5+d.ph)>0.5});
  });

  // families pacing the waiting room
  if(!zomb) pacers.forEach(function(q){
    if(!inView(q.x,q.y)) return;
    drawPerson(q.x,q.y,q.face,q.col,false,
      {kind:"Family",hair:q.hair,skin:q.skin,phase:q.phase,moving:q.moving});
  });

  // ---- the delivery ----
  if(birth && !zomb){
    const B=birth;
    if(inView(B.cx,B.cy)){
      // she's on the bed, propped up, working at it
      const push=Math.max(0,Math.sin(t*0.55));           // contractions come and go
      const bob=Math.sin(t*5.5)*push*1.6;
      g.fillStyle="#8FA3B4";
      g.beginPath();g.roundRect(B.cx-9,B.cy-4+bob,18,22,4);g.fill();
      g.fillStyle="rgba(120,180,200,.35)";g.fillRect(B.cx-8,B.cy+2+bob,16,14);
      g.strokeStyle=INK;g.lineWidth=1.1;
      g.beginPath();g.roundRect(B.cx-9,B.cy-4+bob,18,22,4);g.stroke();
      // knees up, feet in the stirrups
      g.strokeStyle="#8FA3B4";g.lineWidth=5.4;g.lineCap="round";
      g.beginPath();g.moveTo(B.cx-6,B.cy+16);g.lineTo(B.cx-17,B.cy+24);g.stroke();
      g.beginPath();g.moveTo(B.cx+6,B.cy+16);g.lineTo(B.cx+17,B.cy+24);g.stroke();
      drawFace(B.cx, B.cy-13+bob, 6.2, B.skin, B.hair, "out",
               {patch:false, nc:true});
      // a hand gripping the rail
      g.fillStyle=B.skin;
      g.beginPath();g.arc(B.cx-12,B.cy+2+bob,2.6,0,7);g.fill();
      g.beginPath();g.arc(B.cx+12,B.cy+2+bob,2.6,0,7);g.fill();
      // the team, working
      B.team.forEach(function(m){
        const lean=Math.sin(t*1.9+m.ph)*2.2;
        const sx=B.cx+m.ox+lean*0.4, sy=B.cy+m.oy;
        const face=Math.atan2(B.cy+10-sy, B.cx-sx);
        drawPerson(sx,sy,face,m.col,false,
          {kind:m.kind,hair:"#2B2018",skin:"#CBA57F",
           phase:t*2+m.ph, moving:Math.sin(t*1.9+m.ph)>0});
      });
    }
  }

  // two parents at the nursery window
  if(!zomb) gazers.forEach(function(v){
    if(!inView(v.x,v.y)) return;
    const sway=Math.sin(t*1.9+v.ph)*2.2;
    drawPerson(v.x+sway*0.4, v.y, Math.PI/2, v.col, false,
      {kind:"Family",hair:v.hair,skin:v.skin,
       phase:t*2+v.ph, moving:Math.sin(t*1.9+v.ph)>0});
  });

  // seated visitors — gone during an outbreak
  if(!zomb) seated.forEach(function(v){
    if(!inView(v.x,v.y)) return;
    const sway=Math.sin(t*v.fidget+v.ph)*0.06;
    drawPerson(v.x, v.y, v.face+sway, v.col, false,
               {kind:"Family",hair:v.hair,skin:v.skin,phase:0,moving:false});
  });

  // people
  staff.forEach(function(s){
    if(!inView(s.x,s.y)) return;
    if(s.z){
      const a=s.face===undefined?Math.PI/2:s.face;
      const lurch=Math.sin((s.phase||0))*0.13;
      g.save();g.translate(s.x,s.y);g.rotate(lurch);g.translate(-s.x,-s.y);
      drawPerson(s.x,s.y,s.face,"#4E6B3E",false,
        {kind:s.kind,hair:s.hair,skin:"#94A487",phase:s.phase||0,moving:s.moving,hideArms:true});
      // both arms straight out in front, reaching
      const nx2=Math.cos(a+Math.PI/2), ny2=Math.sin(a+Math.PI/2);
      [-5.5,5.5].forEach(function(o,i){
        const sway=Math.sin((s.phase||0)*0.5+i*1.6)*2.4;
        const x0=s.x+nx2*o, y0=s.y+ny2*o;
        const x1=x0+Math.cos(a)*20+nx2*sway, y1=y0+Math.sin(a)*20+ny2*sway;
        g.strokeStyle="rgba(14,20,26,.55)";g.lineWidth=5.6;g.lineCap="round";
        g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();
        g.strokeStyle="#4E6B3E";g.lineWidth=4.2;
        g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();
        g.fillStyle="#94A487";g.beginPath();g.arc(x1,y1,2.7,0,7);g.fill();
        g.strokeStyle="rgba(14,20,26,.5)";g.lineWidth=1;g.stroke();
      });
      g.restore();
      g.fillStyle="rgba(120,200,90,"+(0.16+Math.sin(t*4+s.gr)*0.07)+")";
      g.beginPath();g.arc(s.x,s.y-6,10,0,7);g.fill();
    } else drawPerson(s.x,s.y,s.face,s.role.c,false,s);
  });
  if(dance>0){
    g.save();
    g.translate(player.x,player.y);
    g.rotate(Math.sin(t*11)*0.30);
    g.translate(0,-Math.abs(Math.sin(t*9))*5);
    g.scale(1+Math.sin(t*9)*0.06, 1-Math.sin(t*9)*0.06);
    g.translate(-player.x,-player.y);
    drawPerson(player.x,player.y,meFace(),meCol(),true,
      {kind:role,hair:"#2B2018",skin:"#CBA57F",phase:t*9,moving:true});
    g.restore();
    // party hat
    g.save();g.translate(player.x,player.y-Math.abs(Math.sin(t*9))*5);
    g.rotate(Math.sin(t*11)*0.30);
    g.fillStyle="#F28FB4";g.beginPath();
    g.moveTo(-4.5,-8);g.lineTo(4.5,-8);g.lineTo(0,-19);g.closePath();g.fill();
    g.strokeStyle=INK;g.lineWidth=1;g.stroke();
    g.fillStyle="#F2E04D";g.beginPath();g.arc(0,-19.5,1.9,0,7);g.fill();
    g.restore();
  } else if(jump>0){
    const p2=1-(jump/JUMP_T), lift=Math.sin(p2*Math.PI);
    g.save();
    g.translate(player.x,player.y-lift*17);
    g.scale(1+lift*0.22,1+lift*0.22);
    g.translate(-player.x,-player.y);
    drawPerson(player.x,player.y,meFace(), ppe?"#BFE3EC":meCol(), true,
      {kind:role,hair:"#2B2018",skin:ppe?"#E4EEF2":"#CBA57F",
       phase:player.phase||0,moving:false,hideArms:!!carry});
    g.restore();
  } else if(bleed>0){
    drawPerson(player.x,player.y,meFace(), ppe?"#BFE3EC":meCol(), true,
      {kind:role,hair:"#2B2018",skin:ppe?"#E4EEF2":"#CBA57F",
       phase:player.phase||0,moving:moving,hideArms:!!carry});
    const a=player.face===undefined?Math.PI/2:player.face;
    g.fillStyle="rgba(150,22,26,.75)";
    g.beginPath();g.arc(player.x+Math.cos(a)*5,player.y+Math.sin(a)*5,1.8,0,7);g.fill();
  } else {
    drawPerson(player.x,player.y,meFace(), ppe?"#BFE3EC":meCol(), true,
      {kind:role,hair:"#2B2018",skin:ppe?"#E4EEF2":"#CBA57F",
       phase:player.phase||0,moving:moving,hideArms:!!carry});
    if(ppe){
      g.strokeStyle="rgba(200,235,245,.55)";g.lineWidth=1.4;
      g.beginPath();g.arc(player.x,player.y,15,0,7);g.stroke();
    }
  }
  if(jump>0){
    // shadow shrinks away beneath you
    const p2=1-(jump/JUMP_T), lift=Math.sin(p2*Math.PI);
    g.fillStyle="rgba(0,0,0,"+(0.34-lift*0.20)+")";
    g.beginPath();g.ellipse(player.x,player.y+4,11-lift*4,7-lift*3,0,0,7);g.fill();
    if(p2>0.86){
      const rr=(p2-0.86)/0.14;
      g.strokeStyle="rgba(230,220,200,"+(0.5*(1-rr))+")";g.lineWidth=2;
      g.beginPath();g.arc(player.x,player.y,STOMP_R*rr,0,7);g.stroke();
    }
  }
  if(zomb){
    const a=player.face===undefined?Math.PI/2:player.face;
    g.save();g.translate(player.x+Math.cos(a)*13,player.y+Math.sin(a)*13);g.rotate(a);
    g.fillStyle="#3A4854";g.beginPath();g.roundRect(-6,-3,14,6,2);g.fill();
    g.fillStyle="#8FA3B4";g.fillRect(6,-1.4,7,2.8);
    g.fillStyle="#C43A44";g.fillRect(-4,-2,4,4);
    g.strokeStyle=INK;g.lineWidth=1;g.beginPath();g.roundRect(-6,-3,14,6,2);g.stroke();
    g.restore();
    if(shotCD>SHOT_CD*0.7){
      g.fillStyle="rgba(255,230,150,.5)";
      g.beginPath();g.arc(player.x+Math.cos(a)*24,player.y+Math.sin(a)*24,5,0,7);g.fill();
    }
  }
  if(carry==="ext"){
    const a=player.face===undefined?Math.PI/2:player.face;
    g.save();g.translate(player.x+Math.cos(a)*14,player.y+Math.sin(a)*14);g.rotate(a+Math.PI/2);
    g.fillStyle="#B32130";g.beginPath();g.roundRect(-5,-9,10,18,3);g.fill();
    g.fillStyle="#2E3A44";g.fillRect(-3,-12,6,4);
    g.fillStyle="#E8EDF1";g.fillRect(-4,-2,8,3.4);
    g.strokeStyle=INK;g.lineWidth=1.2;g.beginPath();g.roundRect(-5,-9,10,18,3);g.stroke();
    g.restore();
  }
  if(carry && carry!=="ext"){
    const a=player.face===undefined?Math.PI/2:player.face;
    const isCart=carry==="cart";
    if(isCart) drawCart(player.x+Math.cos(a)*19, player.y+Math.sin(a)*19, false);
    else if(carry==="niv"){
      drawNIV(player.x+Math.cos(a)*18, player.y+Math.sin(a)*18, a);
    }
    else if(carry==="mcart"){
      drawMorgueCart(player.x+Math.cos(a)*24, player.y+Math.sin(a)*24, a, mcartFull);
    }
    else if(carry==="orpatient"){
      const sx2=player.x+Math.cos(a)*22, sy2=player.y+Math.sin(a)*22;
      g.save();g.translate(sx2,sy2);g.rotate(a+Math.PI/2);
      g.fillStyle="rgba(0,0,0,.34)";g.beginPath();g.roundRect(-11,-20,24,42,4);g.fill();
      g.fillStyle="#59687A";g.beginPath();g.roundRect(-12,-22,24,42,4);g.fill();
      g.fillStyle="#B9C6D0";g.beginPath();g.roundRect(-9,-19,18,36,3);g.fill();
      g.fillStyle="#9FC4D6";g.beginPath();g.roundRect(-8,-6,16,22,3);g.fill();
      g.strokeStyle=INK;g.lineWidth=1.3;g.beginPath();g.roundRect(-12,-22,24,42,4);g.stroke();
      g.fillStyle="#141C22";
      g.beginPath();g.arc(-9,18,2.4,0,7);g.fill();g.beginPath();g.arc(9,18,2.4,0,7);g.fill();
      g.restore();
      g.save();g.translate(sx2,sy2);g.rotate(a+Math.PI/2);g.rotate(Math.PI);
      drawFace(0,10,5.6,"#D6A87E","#3A2A20","out");
      g.restore();
    }
    else if(carry==="equip"&&eqCarry) drawEquip(player.x+Math.cos(a)*18, player.y+Math.sin(a)*18, eqCarry, a);
    else drawChair(player.x+Math.cos(a)*17, player.y+Math.sin(a)*17, a, carry==="patient");
    // both forearms out to the handles
    const px2=Math.cos(a+Math.PI/2), py2=Math.sin(a+Math.PI/2);
    const reach=isCart?12:11, spread=isCart?7:6.5;
    [-spread,spread].forEach(function(o){
      const x0=player.x+px2*o*0.85+Math.cos(a)*2, y0=player.y+py2*o*0.85+Math.sin(a)*2;
      const x1=player.x+px2*o+Math.cos(a)*reach,  y1=player.y+py2*o+Math.sin(a)*reach;
      g.lineCap="round";
      g.strokeStyle="rgba(14,20,26,.5)";g.lineWidth=4.4;
      g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();
      g.strokeStyle="#CBA57F";g.lineWidth=3.0;
      g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();
      g.fillStyle="#CBA57F";g.beginPath();g.arc(x1,y1,2.1,0,7);g.fill();
    });
  }

  // energy-drink trail — a ribbon of where you have just been
  if(trail.length>1){
    g.lineCap="round";g.lineJoin="round";
    for(let i=1;i<trail.length;i++){
      const a=trail[i-1], b2=trail[i], w=i/trail.length;   // 0 at the tail
      g.strokeStyle=rgba(trailCol,0.22*w*b2.a);
      g.lineWidth=1.5+8*w;
      g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b2.x,b2.y);g.stroke();
      g.strokeStyle=rgba(shade(trailCol,0.45),0.58*w*b2.a);
      g.lineWidth=0.6+2.8*w;
      g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b2.x,b2.y);g.stroke();
    }
    // sparks peeling off the tail
    for(let i=0;i<trail.length;i+=4){
      const q=trail[i], w=(1-i/trail.length);
      g.fillStyle=rgba(shade(trailCol,0.5),q.a*w*0.55);
      g.beginPath();
      g.arc(q.x+Math.sin(i*2.3+t*9)*4, q.y+Math.cos(i*1.7+t*9)*4, 1.4*w+0.5, 0, 7);
      g.fill();
    }
  }
  if(rush>0){
    // glow under the RT while it lasts
    const pulse=0.22+Math.sin(t*10)*0.07, fade=Math.min(1,rush/2);
    g.strokeStyle=rgba(trailCol,pulse*fade);g.lineWidth=2.4;
    g.beginPath();g.arc(player.x,player.y,16,0,7);g.stroke();
    g.fillStyle=rgba(trailCol,0.10*fade);
    g.beginPath();g.arc(player.x,player.y,20,0,7);g.fill();
  }

  if(swarm>0){
    const p2=0.35+Math.sin(t*5)*0.15;
    g.strokeStyle="rgba(242,201,77,"+p2+")";g.lineWidth=2;g.setLineDash([5,6]);
    g.beginPath();g.arc(player.x,player.y,30+Math.sin(t*3)*4,0,7);g.stroke();
    g.setLineDash([]);
  }

  // caffeine streaks
  if(boost>0){
    const a=player.face===undefined?Math.PI/2:player.face;
    const fade=Math.min(1,boost/2.2)*(moving?1:0.45);
    const bx=-Math.cos(a), by=-Math.sin(a), nx=-by, ny=bx;
    g.lineCap="round";
    for(let i=0;i<7;i++){
      const off=((i%2)?1:-1)*(5+ (i*3)%13);
      const seed=(t*44+i*17)%26;
      const len=9+((i*7)%11)+Math.sin(t*11+i)*3;
      const sx=player.x+nx*off+bx*(9+seed*0.8), sy=player.y+ny*off+by*(9+seed*0.8);
      g.strokeStyle="rgba(216,178,120,"+(fade*(0.42-i*0.045))+")";
      g.lineWidth=2.2-i*0.16;
      g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+bx*len,sy+by*len);g.stroke();
    }
  }

  // flying tools
  fx.forEach(function(f){
    const p=f.t/f.d, e=1-Math.pow(1-p,2);
    const x=f.x0+(f.x1-f.x0)*e, y=f.y0+(f.y1-f.y0)*e-Math.sin(p*Math.PI)*20;
    g.globalAlpha=1-p*0.15;
    g.fillStyle="rgba(14,20,26,.92)";g.beginPath();g.arc(x,y,11,0,7);g.fill();
    g.strokeStyle="rgba(201,162,39,.95)";g.lineWidth=1.4;
    g.beginPath();g.arc(x,y,11,0,7);g.stroke();
    g.save();g.translate(x,y);g.rotate(p*4.2);g.translate(-x,-y);icon(f.k,x,y,18);g.restore();
    g.globalAlpha=1;
  });

  // "Hey RT" shouts
  shouts.forEach(function(sh){
    const a=Math.min(1,sh.life/0.6);
    const bx=player.x+sh.lane*0.6, by=player.y+sh.lane*0.42-30-sh.rise;
    g.font="600 8px 'IBM Plex Mono',monospace";
    const w=g.measureText(sh.txt).width+11;
    g.globalAlpha=a;
    g.fillStyle="rgba(14,20,26,.92)";
    g.beginPath();g.roundRect(bx-w/2,by-9,w,14,4);g.fill();
    g.strokeStyle="rgba(242,201,77,.75)";g.lineWidth=1.1;
    g.beginPath();g.roundRect(bx-w/2,by-9,w,14,4);g.stroke();
    g.fillStyle="rgba(14,20,26,.92)";
    g.beginPath();g.moveTo(bx-3,by+4);g.lineTo(bx+3,by+4);g.lineTo(bx,by+9);g.closePath();g.fill();
    g.fillStyle="#F2C94D";g.textAlign="center";
    g.fillText(sh.txt,bx,by+1);
    g.globalAlpha=1;
  });

  drawChatBubble();
  drawRantBubble();

  // streamers
  streamers.forEach(function(st){
    g.save();g.translate(st.x,st.y);g.rotate(st.rot);
    g.globalAlpha=Math.min(1,st.life);
    g.fillStyle=st.c;g.fillRect(-st.w/2,-st.h/2,st.w,st.h);
    g.globalAlpha=1;g.restore();
  });

  // every hold in the game reports on one bar, above your head
  const isCart = codeBed && onDrop(codeBed) && carry==="cart";
  const HOLDS=[
    [dropP,  isCart?CART_T:(carry==="chair"||carry==="patient"?CHAIR_T:DROP_T),
             isCart?"#FF3B4E":"#38D6E0"],
    [dirtyP, DIRTY_T,     "#C08050"],
    [eqP,    EQUIP_T,     "#C8B23A"],
    [partyP, PARTY_HOLD,  "#F28FB4"],
    [odP,    OD_HOLD,     "#FF3B4E"],
    [ppeP,   PPE_T,       "#9FD6E0"],
    [orP,    ORLOAD_T,    "#9FD6E0"],
    [recP,   REC_T,       "#9FD6E0"],
    [coffeeP,COFFEE_T,    "#B98A4E"],
    [vendP,  VEND_T,      "#F2C94D"],
    [fightP, FIGHT_HOLD,  "#E65A50"],
    [rantP,  RANT_HOLD,   "#F08A80"],
    [nivP,   NIV_HOLD,    "#9FE0EC"],
    [sparkP, SPARK_T,     "#F2C94D"]
  ];
  const act2=HOLDS.find(function(h){ return h[0]>0; });
  if(act2){
    const p=act2[0]/act2[1];
    g.fillStyle="#06090C";g.fillRect(player.x-19,player.y-28,38,7);
    g.fillStyle=act2[2];
    g.fillRect(player.x-18,player.y-27,36*Math.min(1,p),5);
  }
  (function(){
    const cf=crowdFactor();
    if(cf<0.96){
      g.strokeStyle="rgba(242,179,61,"+((1-cf)*0.7)+")";
      g.lineWidth=2;g.setLineDash([3,4]);
      g.beginPath();g.arc(player.x,player.y,17+(1-cf)*5,0,7);g.stroke();
      g.setLineDash([]);
    }
  })();
  g.restore();

  // ---- the grid struggling, before and after ----
  if(preFlick>0||postFlick>0){
    const ph2=preFlick>0? 1-(preFlick/2.4) : (postFlick/1.6);
    // stutter pattern: mostly lit, with hard dropouts that get worse
    const beat=Math.sin(t*31)+Math.sin(t*17.3)*0.8+Math.sin(t*47)*0.5;
    const bias=preFlick>0? ph2 : ph2*0.7;
    const dark= beat < (-0.7+bias*1.9);
    if(dark){
      g.fillStyle="rgba(2,3,6,"+(0.62+bias*0.34)+")";
      g.fillRect(0,0,VW,VH);
    } else if(beat>1.6){
      g.fillStyle="rgba(255,246,214,.06)";g.fillRect(0,0,VW,VH);
    }
    // scan bar sweeping down as the ballast hunts
    const by2=((t*260)%(VH+120))-60;
    const sb=g.createLinearGradient(0,by2-40,0,by2+40);
    sb.addColorStop(0,"rgba(0,0,0,0)");
    sb.addColorStop(.5,"rgba(0,0,0,"+(0.18+bias*0.2)+")");
    sb.addColorStop(1,"rgba(0,0,0,0)");
    g.fillStyle=sb;g.fillRect(0,by2-40,VW,80);
  }

  // ---- outbreak: the unit goes to hell ----
  if(zomb){
    // emergency lighting only, sickly and green
    g.fillStyle="rgba(6,14,8,.46)";g.fillRect(0,0,VW,VH);
    g.fillStyle="rgba(60,150,60,.055)";g.fillRect(0,0,VW,VH);
    // strobing hazard light sweeping the ward
    const strobe=Math.sin(t*5.2);
    if(strobe>0.55){
      g.fillStyle="rgba(200,40,40,"+(0.10*(strobe-0.55)/0.45)+")";
      g.fillRect(0,0,VW,VH);
    }
    // a red band rolling down the screen like a rotating beacon
    const by4=((t*150)%(VH+200))-100;
    const bg4=g.createLinearGradient(0,by4-70,0,by4+70);
    bg4.addColorStop(0,"rgba(180,20,20,0)");
    bg4.addColorStop(.5,"rgba(180,20,20,.11)");
    bg4.addColorStop(1,"rgba(180,20,20,0)");
    g.fillStyle=bg4;g.fillRect(0,by4-70,VW,140);
    // grain and the odd dropout, like the cameras are failing
    for(let i=0;i<26;i++){
      g.fillStyle="rgba(140,190,140,"+(0.03+Math.random()*0.05)+")";
      g.fillRect(Math.random()*VW, Math.random()*VH, 1+Math.random()*40, 1);
    }
    if(Math.sin(t*11)>0.93){
      g.fillStyle="rgba(0,0,0,.30)";g.fillRect(0,0,VW,VH);
    }
    // pressing in at the edges
    const vg4=g.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*0.24,
                                     VW/2,VH/2,Math.max(VW,VH)*0.72);
    vg4.addColorStop(0,"rgba(0,0,0,0)");
    vg4.addColorStop(1,"rgba(4,16,6,.72)");
    g.fillStyle=vg4;g.fillRect(0,0,VW,VH);
    // your pulse, when one is right on top of you
    let nearest=1e9;
    staff.forEach(function(z){ if(z.z) nearest=Math.min(nearest,Math.hypot(z.x-player.x,z.y-player.y)); });
    if(nearest<90){
      const thump=Math.max(0,Math.sin(t*7))*(1-nearest/90);
      g.fillStyle="rgba(190,20,24,"+(0.20*thump)+")";
      g.fillRect(0,0,VW,VH);
    }
    // how many are left, right in the middle of the screen
    const left=staff.filter(function(z){return z.z;}).length;
    g.fillStyle="rgba(158,216,106,.9)";
    g.font="700 13px 'Barlow Condensed',sans-serif";g.textAlign="center";
    g.fillText(left+" STILL UP",VW/2,44);
  }

  // ---- contact high: the room will not hold still ----
  if(high>0){
    const w=Math.min(1,high);
    // colour wash rolling through
    const hue=(t*40)%360;
    g.fillStyle="hsla("+hue+",70%,50%,"+(0.10*w)+")";
    g.fillRect(0,0,VW,VH);
    // wobbling bands
    for(let i=0;i<7;i++){
      const yy=((t*70+i*90)%(VH+120))-60;
      g.fillStyle="hsla("+((hue+i*40)%360)+",80%,60%,"+(0.05*w)+")";
      g.fillRect(0,yy,VW,26+Math.sin(t*3+i)*10);
    }
    // vignette breathing in and out
    const sq=0.5+Math.sin(t*1.4)*0.16;
    const vg2=g.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*sq*0.4,
                                     VW/2,VH/2,Math.max(VW,VH)*0.75);
    vg2.addColorStop(0,"rgba(0,0,0,0)");
    vg2.addColorStop(1,"rgba(40,10,60,"+(0.5*w)+")");
    g.fillStyle=vg2;g.fillRect(0,0,VW,VH);
  }

  // ---- power cut: flashlight only ----
  if(blackout>0){
    const px=VW/2, py=VH/2;
    const fade=1;
    darkX.globalCompositeOperation="source-over";
    darkX.fillStyle="rgba(2,3,6,"+(0.955*fade)+")";
    darkX.fillRect(0,0,VW,VH);
    darkX.globalCompositeOperation="destination-out";
    // the beam, thrown in whatever direction the RT is facing
    const a=(player.face===undefined?Math.PI/2:player.face);
    const reach=Math.min(VW,VH)*0.60, spread=0.40;
    const bg2=darkX.createRadialGradient(px,py,10,px,py,reach);
    bg2.addColorStop(0,"rgba(0,0,0,1)");
    bg2.addColorStop(0.40,"rgba(0,0,0,.62)");
    bg2.addColorStop(1,"rgba(0,0,0,0)");
    darkX.fillStyle=bg2;
    darkX.beginPath();darkX.moveTo(px,py);
    darkX.arc(px,py,reach,a-spread,a+spread);
    darkX.closePath();darkX.fill();
    // small pool right around your feet
    const pool=darkX.createRadialGradient(px,py,2,px,py,62);
    pool.addColorStop(0,"rgba(0,0,0,.95)");
    pool.addColorStop(1,"rgba(0,0,0,0)");
    darkX.fillStyle=pool;darkX.beginPath();darkX.arc(px,py,62,0,7);darkX.fill();
    // monitors keep running on battery, so alarming beds still glow
    beds.forEach(function(b){
      if(b.state!=="code" && !(b.state==="active" && b.t/b.max<0.24)) return;
      const bx=(b.room.bx+0.5)*TILE*SC + (VW/2-player.x*SC);
      const by=(b.room.by+1)*TILE*SC + (VH/2-player.y*SC);
      if(bx<-80||bx>VW+80||by<-80||by>VH+80) return;
      const em=darkX.createRadialGradient(bx,by,4,bx,by,64);
      em.addColorStop(0,"rgba(0,0,0,.80)");
      em.addColorStop(1,"rgba(0,0,0,0)");
      darkX.fillStyle=em;darkX.beginPath();darkX.arc(bx,by,64,0,7);darkX.fill();
    });
    darkX.globalCompositeOperation="source-over";
    g.drawImage(darkC,0,0);
    // warm beam tint + battery flicker
    const flick=0.9+Math.sin(t*23)*0.06+Math.sin(t*7.3)*0.04;
    g.save();g.globalCompositeOperation="lighter";
    const wb=g.createRadialGradient(px,py,8,px,py,reach*0.75);
    wb.addColorStop(0,"rgba(255,238,190,"+(0.13*flick*fade)+")");
    wb.addColorStop(1,"rgba(255,238,190,0)");
    g.fillStyle=wb;
    g.beginPath();g.moveTo(px,py);g.arc(px,py,reach*0.75,a-spread,a+spread);
    g.closePath();g.fill();g.restore();
  }

  // fatigue closes the edges in
  if(energy<45){
    const f=(45-energy)/45;
    g.globalAlpha=Math.min(1,f*0.55);
    g.drawImage(fatC,0,0);
    g.globalAlpha=1;
    if(energy<20){
      g.fillStyle="rgba(60,20,24,"+((0.05+Math.sin(t*2.4)*0.035)*(1-energy/20))+")";
      g.fillRect(0,0,VW,VH);
    }
  }
  g.drawImage(vigC,0,0);
  if(codeBed){
    g.fillStyle="rgba(255,59,78,"+(0.05+Math.sin(t*7)*0.04)+")";
    g.fillRect(0,0,VW,VH);
  }
}

/* ================= HUD ================= */
const stripEl=document.getElementById("strip"),detEl=document.getElementById("detail");
let cells=[];
function hasPatient(b){
  return b.state==="active"||b.state==="code"||b.state==="ready";
}
function buildStrip(){
  const live=beds.filter(hasPatient);
  const n=Math.max(1,live.length);
  stripEl.style.gridTemplateColumns="repeat("+Math.min(8,n)+",1fr)";
  stripEl.innerHTML="";cells=[];
  beds.forEach(function(b,i){
    if(!hasPatient(b)){cells.push(null);return;}
    const c=document.createElement("div");c.className="cell";
    c.innerHTML='<div class="n">'+b.room.id+'</div><div class="tick"><i></i></div><div class="prog"></div>';
    c.onclick=function(){sel=i;selLock=10;hud();};
    stripEl.appendChild(c);cells.push(c);
  });
  document.getElementById("lvl").textContent=role+" \u00b7 LEVEL "+level;
}
function who(b){
  return '<div class="who"><img src="'+faceThumb(b)+'" alt="">'+
         '<span class="nm">'+(b.name||"Unknown")+'</span>'+
         '<span class="rm">BED '+b.room.id+'</span></div>';
}
function hud(){
  document.querySelector("#kSaved b").textContent=discharged+" / "+quota;
  const ev=document.getElementById("evt");
  if(bannerT>0){
    ev.innerHTML=banner+(bannerKind==="party"?"<small>LUNCH ROOM · GET THERE</small>":
      bannerKind==="hey"?"<small>EVERYONE NEEDS YOU · JUST KEEP MOVING</small>":
      bannerKind==="bump"?"<small>FIND THE ELECTRICIAN · LEAD HIM TO THE PANEL</small>":
      bannerKind==="clean"?"<small>RACK ALL FOUR BAYS · DIRTY UTILITY</small>":
      bannerKind==="friend"?"<small>HELP IS ON THE WAY</small>":
      bannerKind==="od"?"<small>CRASH CART · DOWNSTAIRS WASHROOM</small>":
      bannerKind==="ortx"?"<small>GOWN UP · COLLECT FROM RECOVERY</small>":
      bannerKind==="high"?"<small>CONTROLS REVERSED · FIND THE NARCAN KIT</small>":
      bannerKind==="zomb"?"<small>TRANQ GUN · ACT TO FIRE · CLEAR THEM ALL</small>":
      bannerKind==="fire"?"<small>EXTINGUISHER OUTSIDE THE DOOR · PUT THEM ALL OUT</small>":
      bannerKind==="bugs"?"<small>ACT TO JUMP · LAND ON THEM</small>":
      bannerKind==="fight"?"<small>WAITING ROOM · GET BETWEEN THEM</small>":
      bannerKind==="rant"?"<small>TWO OF THEM · GO TO THE WAITING ROOM</small>":
      bannerKind==="niv"?"<small>FIND THE NIV · DELIVERY ROOM WARMER</small>":"");
    ev.className="on "+bannerKind;
  } else ev.className="";
  document.querySelector("#kScore b").textContent=coins;
  const pw=document.getElementById("powers");
  const sig=powers.join(",");
  if(pwSig!==sig){
    pwSig=sig;
    pw.innerHTML='<span class="cap">POWERS</span>';
    for(let i=0;i<POW_MAX;i++){
      const k=powers[i];
      const el2=document.createElement("div");
      if(k){
        const d=POWERS[k];
        el2.className="pw full";
        el2.style.color=d.c; el2.style.borderColor=d.c;
        el2.innerHTML='<img loading="lazy" decoding="async" src="'+powerIcon(k)+'" alt="'+d.n+'"><b>'+d.n+'</b>';
        el2.title=d.n+" — "+d.d;
        // fire on touch-down so it works as a second finger while you're moving
        (function(idx){
          let used=false;
          el2.addEventListener("pointerdown",function(e){
            e.preventDefault(); e.stopPropagation();
            if(used) return; used=true;
            el2.classList.add("hit");
            usePower(idx);
          });
          el2.addEventListener("click",function(e){ e.preventDefault(); e.stopPropagation(); });
        })(i);
      } else {
        el2.className="pw";
      }
      pw.appendChild(el2);
    }
  }
  const tray=document.getElementById("evtray");
  tray.innerHTML=events.map(function(e){
    if(e.kind==="party"){
      const f=Math.max(0,e.t/e.max)*100;
      return '<span class="ev party"><b>BIRTHDAY PARTY</b>lunch room · '+Math.ceil(Math.max(0,e.t))+
             's<i style="width:'+f+'%"></i></span>';
    }
    if(e.kind==="zomb"){
      const f=Math.max(0,e.t/e.max)*100;
      const left=staff.filter(function(z){return z.z;}).length;
      return '<span class="ev zomb"><b>IT\'S GOING AROUND</b>'+left+' left · '+
             Math.ceil(Math.max(0,e.t))+'s<i style="width:'+f+'%"></i></span>';
    }
    if(e.kind==="niv"){
      const f2=Math.max(0,e.t/e.max)*100;
      const step = carry==="niv" ? "to the warmer" : "find the NIV";
      return '<span class="ev niv"><b>BABY NEEDS NIV</b>'+step+' \u00b7 '+
             Math.ceil(Math.max(0,e.t))+'s<i style="width:'+f2+'%"></i></span>';
    }
    if(e.kind==="rant"){
      const f2=Math.max(0,e.t/e.max)*100;
      const held=Math.min(100,Math.round(rantP/RANT_HOLD*100));
      return '<span class="ev rant"><b>A WORD, PLEASE</b>'+
             (rant&&rant.who.some(function(q){return q.close;})?"stand there":"waiting room")+
             ' \u00b7 heard '+held+
             '% \u00b7 '+Math.ceil(Math.max(0,e.t))+'s<i style="width:'+f2+'%"></i></span>';
    }
    if(e.kind==="fight"){
      const f2=Math.max(0,e.t/e.max)*100;
      return '<span class="ev fight"><b>IT\'S KICKED OFF</b>waiting room \u00b7 '+
             Math.ceil(Math.max(0,e.t))+'s<i style="width:'+f2+'%"></i></span>';
    }
    if(e.kind==="bugs"){
      const f=Math.max(0,e.t/e.max)*100;
      const left=bugs.filter(function(q){return !q.dead;}).length;
      return '<span class="ev bugs"><b>BED BUG STOMP</b>'+left+' left · bed '+
             (bugRoom?bugRoom.id:"?")+' · '+Math.ceil(Math.max(0,e.t))+
             's<i style="width:'+f+'%"></i></span>';
    }
    if(e.kind==="fire"){
      const f=Math.max(0,e.t/e.max)*100;
      return '<span class="ev fire"><b>SMOKING SECTION</b>'+fires.length+' burning · '+
             Math.ceil(Math.max(0,e.t))+'s<i style="width:'+f+'%"></i></span>';
    }
    if(e.kind==="high"){
      const f=Math.max(0,e.t/e.max)*100;
      return '<span class="ev high"><b>CONTACT HIGH</b>'+
             (narcan?"find the narcan kit":"use the kit")+' · controls reversed · '+
             Math.ceil(Math.max(0,e.t))+'s<i style="width:'+f+'%"></i></span>';
    }
    if(e.kind==="ortx"){
      const f=Math.max(0,e.t/e.max)*100;
      const step = (orPt&&orPt.stage==="recovery") ? (ppe?"collect them":"gown up")
                  : (orPt&&orPt.dest) ? ("to bed "+orPt.dest.room.id) : "on the move";
      return '<span class="ev ortx"><b>OR TRANSPORT</b>'+step+' · '+Math.ceil(Math.max(0,e.t))+
             's<i style="width:'+f+'%"></i></span>';
    }
    if(e.kind==="od"){
      const f=Math.max(0,e.t/e.max)*100;
      return '<span class="ev od"><b>OD · WASHROOM</b>crash cart · '+Math.ceil(Math.max(0,e.t))+
             's<i style="width:'+f+'%"></i></span>';
    }
    if(e.kind==="clean"){
      const f=Math.max(0,e.t/e.max)*100;
      return '<span class="ev clean"><b>NOT MY MESS</b>rack all 4 · '+eqParked.length+'/4 · '+
             Math.ceil(Math.max(0,e.t))+'s<i style="width:'+f+'%"></i></span>';
    }
    if(e.kind==="heyrt"){
      const f=Math.max(0,e.t/e.max)*100;
      return '<span class="ev hey"><b>HEY RT</b>everyone wants you · '+Math.ceil(Math.max(0,e.t))+
             's<i style="width:'+f+'%"></i></span>';
    }
    if(spark){
      const step = !spark.found ? "find the electrician"
                 : spark.done ? "sorted" : "walk him to the panel";
      return '<span class="ev"><b>POWER LOSS</b>'+step+'<i style="width:'+
             (spark.found?60:20)+'%"></i></span>';
    }
    return '<span class="ev"><b>POWER LOSS</b>work through it<i style="width:'+
           Math.max(0,Math.min(100,(1-(blackoutFrom-energy)/25)*100))+'%"></i></span>';
  }).join("");
  document.getElementById("stick").classList.toggle("hi",high>0);
  document.getElementById("hud").className =
    blackout>0 ? "dark" : (preFlick>0&&Math.sin(t*31)<-0.2) ? "dark" : "";
  const eb=document.getElementById("energy"), tier=energyTier();
  eb.querySelector("b").style.width=Math.max(0,energy)+"%";
  eb.className = "g"+tier + (gearFlash>0?" flash":"");
  document.getElementById("gear").textContent=
    rush>0 ? "RUSH "+Math.ceil(rush)+"s" : ["FULL","-14%","-28%","-42%"][tier];
  if(rush>0) eb.className="rush";
  beds.forEach(function(b,i){
    const c=cells[i]; if(!c) return;
    c.className="cell"+(i===sel?" sel":"");
    const bar=c.querySelector("i"), pr=c.querySelector(".prog");
    if(b.state==="ready"){
      const rf=Math.max(0,Math.min(1,b.t/READY_T));
      c.classList.add(rf<0.34?"crit":"done");
      bar.style.width=(rf*100)+"%";pr.style.width="100%";return;}
    const f=Math.max(0,Math.min(1,b.t/b.max));bar.style.width=(f*100)+"%";
    if(b.state==="code")c.classList.add("code");
    else if(f<.24)c.classList.add("crit");
    else if(f<.5)c.classList.add("warn");
    else c.classList.add("ok");
    pr.style.width = (b.careMax? (b.stage/b.careMax*100):0)+"%";
  });
  const b=beds[sel];
  if(!b||!b.p){ detailSig=null; detEl.innerHTML='<div class="empty">No patients on the board.</div>'; }
  else if(b.state==="ready"){
    detailSig=null;
    detEl.innerHTML=
    who(b)+
    '<div class="dx" style="color:'+(b.t<READY_T*0.34?'var(--crit)':'var(--hr)')+'">Bed '+b.room.id+
      ' · READY FOR DISCHARGE <span>· '+Math.ceil(Math.max(0,b.t))+'s</span></div>'+
    '<div class="note">'+(b.t<READY_T*0.34
      ? "He's been waiting too long and is starting to slip. Move him now or he relapses."
      : "Care is done. Fetch a wheelchair, load him at the bedside, then wheel him to the waiting room and stand on SEND HOME.")+'</div>';
  }
  else if(b.state==="code"){
    detailSig=null;
    detEl.innerHTML=
    who(b)+
    '<div class="dx">Bed '+b.room.id+' · CODE BLUE <span>· '+Math.ceil(b.t)+'s</span></div>'+
    '<div class="note">Find the crash cart, get it onto the drop zone. Everyone is in your way.</div>';
  }
  else {
    const remain=b.careMax-b.stage;
    let segs="";
    for(let i=0;i<b.careMax;i++){
      const on = i<remain;
      const tone = remain===1?" low" : remain===2?" mid" : "";
      segs += '<i class="'+(on?"on"+tone:"")+'"></i>';
    }
    // Needs badges carry real (network-loaded) icon images now, not instant data
    // URLs — rebuilding this innerHTML every frame (hud() runs in the game loop)
    // tore the <img> tags down before they could ever finish loading. Only
    // rebuild when something that actually changes the content changes; just
    // patch the live countdown text the rest of the time.
    const sig=sel+"|"+b.room.id+"|"+b.stage+"|"+b.got.join(",")+"|"+pack.join(",")+"|"+b.p.need.join(",");
    if(detailSig!==sig){
      detailSig=sig;
      detEl.innerHTML=
        who(b)+
        '<div class="dx">Bed '+b.room.id+' · '+b.p.dx+' <span class="dxTimer">· '+Math.ceil(b.t)+'s</span></div>'+
        '<div id="care"><span class="lbl">CARE NEEDS</span><span class="seg">'+segs+'</span></div>'+
        '<div class="stage">Step '+(b.stage+1)+' of '+b.careMax+' — '+b.p.sn+'</div>'+
        '<div class="needs">'+b.p.need.map(function(k){
          const s=b.got.indexOf(k)>=0?"done":pack.indexOf(k)>=0?"carry":"";
          return '<span class="need '+s+'"><img loading="lazy" decoding="async" src="'+ICONS[k]+'" alt="">'+TOOLS[k].n+'</span>';}).join("")+'</div>'+
        '<div class="note">'+b.p.note+'</div>';
    } else {
      const timerEl=detEl.querySelector(".dxTimer");
      if(timerEl) timerEl.textContent="· "+Math.ceil(b.t)+"s";
    }
  }
  const row=document.getElementById("packRow"),sl=document.getElementById("slots");
  const psig=pack.join(",");
  if(packSig!==psig){
    packSig=psig;
    const old=row.querySelectorAll(".chip"); for(let i=0;i<old.length;i++) old[i].remove();
    pack.forEach(function(k){
      const c=document.createElement("span");
      c.className="chip"+(TOOLS[k].s>1?" bulk":"");
      c.title=TOOLS[k].n;
      c.innerHTML='<img loading="lazy" decoding="async" src="'+ICONS[k]+'" alt="'+TOOLS[k].n+'"><b>'+SHORT[k]+'</b>';
      row.insertBefore(c,sl);});
    const free=SLOTS-used();
    for(let i=0;i<free;i++){
      const e=document.createElement("span");
      e.className="chip empty";
      row.insertBefore(e,sl);}
  }
  sl.textContent=used()+" / "+SLOTS;
}

/* ================= FLOW ================= */
const ov=document.getElementById("ov");
let last=0;
/* things the staff say to nobody in particular */
const CHATTER=[
  "I only came in to swap a shift.",
  "Has anyone seen the good stethoscope?",
  "That alarm has been going since Tuesday.",
  "I have not sat down since handover.",
  "Bed four\u2019s family are back.",
  "Whoever took the last blanket, I know.",
  "Two more hours. Two.",
  "The printer is out again.",
  "I said I would only stay till six.",
  "Somebody has moved the linen trolley.",
  "This coffee is from the night shift.",
  "My feet have filed a complaint.",
  "Nights were quieter than this.",
  "I dreamt about the call bell again.",
  "There is a biscuit in the fridge with my name on it.",
  "The pump is beeping at me personally.",
  "Who put a wet floor sign on the dry bit?",
  "I have been to the store cupboard four times.",
  "That was not on the handover sheet.",
  "Is it a full moon? It feels like a full moon.",
  "I am not answering that phone.",
  "Nobody knows where the keys are. Nobody.",
  "I love my job. I do. I do.",
  "Bay two smells like burnt toast.",
  "I asked for help twenty minutes ago.",
  "The lift is broken again, obviously.",
  "I have charted nothing since ten.",
  "Whose lunch is this? It is furry.",
  "Do not say the Q word.",
  "Someone said the Q word.",
  "The doctor said \u2018quickly\u2019 and left.",
  "My pen has walked off. Again.",
  "I will do it after this. Probably.",
  "That is a job for the day staff.",
  "I have stopped counting.",
  "One of the wheels on this thing is possessed."
];
const MOTTOS=[
  "You may not succeed, but at least you showed up.",
  "Believe in yourself. Everyone else is busy.",
  "Your best is probably acceptable.",
  "Keep going. You\u2019re already this far into it.",
  "Every mistake is a learning opportunity you probably didn\u2019t ask for.",
  "You can do anything you put your mind to. Results may vary.",
  "Don\u2019t give up. That sounds like paperwork.",
  "You\u2019re stronger than you look. Hopefully.",
  "Things could be worse. Give it time.",
  "Follow your dreams. They seem poorly supervised.",
  "Progress is progress, even when nobody can tell.",
  "You deserve happiness. Availability may vary.",
  "Tomorrow is a new day with mostly the same problems.",
  "Be yourself. Changing now would be complicated.",
  "You\u2019ve survived 100% of your awkward moments so far.",
  "Somewhere, someone is doing worse.",
  "Aim for the stars. The ceiling is also fine.",
  "You\u2019re not behind. There was never a plan.",
  "Trust the process. Nobody knows what it\u2019s doing either.",
  "You\u2019ve got this. Or something adjacent to this.",
  "Today\u2019s goal: remain generally operational.",
  "You are capable of moderately impressive things.",
  "Never stop improving. Unless it\u2019s Friday.",
  "Your potential remains largely unverified.",
  "Success is just failure that got lucky.",
  "You matter. Please continue holding.",
  "Good enough is still a grade."
];
let mottoPool=[];
function motto(){
  if(!mottoPool.length) mottoPool=MOTTOS.slice().sort(function(){return Math.random()-0.5;});
  return mottoPool.pop();
}
function pause(on){
  const b=document.body;
  if(!b||!b.classList) return;
  if(on) b.classList.add("paused"); else b.classList.remove("paused");
}
function screen(title,lines,btn,fn,alt){
  running=false;
  ov.innerHTML="<h1>"+title+"</h1>"+lines.map(function(l){
    return "<p"+(l.k?' class="k"':"")+">"+l.t+"</p>";}).join("")+
    '<p class="motto">'+motto()+'</p>'+
    (alt? '<button id="alt" class="rescue">'+alt.t+"</button>" : "")+
    '<button id="go">'+btn+"</button>";
  ov.classList.remove("hide");
  pause(true);
  document.getElementById("go").onclick=fn;
  if(alt) document.getElementById("alt").onclick=alt.fn;
}
let gameFrame=0;
const localTestMode=false;
let startRequest=0;
async function begin(n){
  const request=++startRequest;
  SFX.start();
  if(n>1 && !localTestMode){
    const allowed=await refreshAccess();
    if(request!==startRequest) return;
    if(!allowed){
      screen("UNLOCK YOUR SHIFT",[
        {t:"Level 1 is free. Unlock levels 2–8 to continue.",k:1},
        {t:accessUnavailable?"Account service unavailable. Try again shortly.":"Sign in with your account or unlock the full game."}],
        "PLAY FREE LEVEL",function(){begin(1);});
      setMenu(true);return;
    }
    if(!isLevelUnlocked(n)){
      screen("LEVEL LOCKED",[
        {t:"Clear Level "+(n-1)+" first to open Level "+n+".",k:1},
        {t:"Your purchase unlocks every level — but each one opens once the last is solved."}],
        "PLAY LEVEL "+(n-1),function(){begin(n-1);});
      setMenu(true);return;
    }
  }
  if(!desktopLayout.matches) setMenu(false);
  cancelAnimationFrame(gameFrame);
  if(document.activeElement instanceof HTMLElement) document.activeElement.blur();
  keys={};act=false;actHeld=false;dropStick();
  actBtn.classList.remove("on");
  SFX.start();
  if(music) music.start();
  if(n===1){ savedCount=0; totalDischarged=0; }
  startLevel(n);resize();ov.classList.add("hide");
  pause(false);
  running=true;last=performance.now();hud();gameFrame=requestAnimationFrame(loop);
}
function saveProgress(completedLevel,fullClear){
  const favoriteTools=Object.keys(levelToolUses).sort(function(a,b){
    return levelToolUses[b]-levelToolUses[a];
  }).slice(0,3).map(function(key){return {name:TOOLS[key].n,uses:levelToolUses[key]};});
  const cleanShift=!levelHadCode && !levelHadRelapse;
  fetch("/api/progress",{method:"POST",credentials:"same-origin",cache:"no-store",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({level:completedLevel,totalDischarged:totalDischarged,
      durationSeconds:Math.round(t),coinsEarned:levelCoinsEarned,favoriteTools:favoriteTools,
      codesSurvived:levelCodesSurvived,cleanShift:cleanShift})
  }).then(function(response){
    if(response.ok && window.parent!==window) window.parent.postMessage({type:"shift-progress-saved"},location.origin);
  }).catch(function(){});
  fetch("/api/leaderboard",{method:"POST",credentials:"same-origin",cache:"no-store",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({score:totalDischarged,levelReached:completedLevel,
      codesSurvived:levelCodesSurvived,cleanShift:cleanShift})}).catch(function(){});
}
function win(){
  const nx=level+1;
  if(completedLevels.indexOf(level)===-1){
    completedLevels=completedLevels.concat([level]).sort(function(a,b){return a-b;});
    syncLevelMenu(selectedLevel);
  }
  if(nx>8){
    saveProgress(level,true);
    screen("SHIFT COMPLETE",
    [{t:"All eight beds. You cleared the whole unit.",k:1},
     {t:"Charge nurse asked for you by name. Highest honour available."}],
    "RUN IT AGAIN",function(){begin(1);}); return; }
  SFX.win();
  saveProgress(level,false);
  screen("UNIT CLEAR",
    [{t:"Level "+level+" done - "+discharged+" patient"+(discharged>1?"s":"")+" wheeled out.",k:1},
     {t:"Level "+nx+": "+nx+" discharges, "+Math.min(nx,5)+" beds running at once. More staff in the halls."}],
    "NEXT LEVEL",function(){begin(nx);});
}
function lose(b){
  SFX.flatline();
  const i=powers.indexOf("DEATH");
  if(i<0 && music) music.fail();  // only a real fail if there's no Second Chance to revive with
  const alt = i>=0 ? {
    t:"\u2620 USE SECOND CHANCE",
    fn:function(){
      powers.splice(i,1); pwSig=null;
      // they come back, and the unit carries on
      b.state="active"; b.t=b.max; b.got=[];
      b.p.need.forEach(function(k){ placeTool(k); });
      codeBed=beds.find(function(x){return x.state==="code";})||null;
      if(carry==="cart") carry="";
      tidyCarts();
      ov.classList.add("hide");
      pause(false);
      running=true; last=performance.now(); hud();
      gameFrame=requestAnimationFrame(loop);
      SFX.win();
      log("You are not sure what just happened. Bed "+b.room.id+" is breathing.",true);
    }
  } : null;
  screen("CODE CALLED",
    [{t:"Bed "+b.room.id+" didn't make it.",k:1},
     {t:"The cart was somewhere. It's always somewhere."}],
    "RETRY LEVEL "+level,function(){begin(level);}, alt);
}
function loop(now){
  if(!running) return;
  const dt=Math.min(.05,(now-last)/1000);last=now;
  update(dt); if(!running) return;
  draw(); hud();
  gameFrame=requestAnimationFrame(loop);
}
(function(){
  const btns2=document.querySelectorAll("#roles .role");
  Array.prototype.forEach.call(btns2,function(b){
    b.onclick=function(e){
      e.stopPropagation();
      role=b.getAttribute("data-role");
      Array.prototype.forEach.call(btns2,function(o){
        o.className = (o===b)?"role sel":"role"; });
    };
  });
})();
let selectedLevel=1, hasFullAccess=false, accessUnavailable=false, isAdmin=false, isSignedIn=false, completedLevels=[];
function isLevelUnlocked(n){
  if(n<=1) return true;
  if(!isAdmin&&!hasFullAccess) return false;
  for(let previous=1;previous<n;previous++) if(completedLevels.indexOf(previous)===-1) return false;
  return true;
}
async function refreshProgress(signedIn){
  if(!signedIn){ completedLevels=[]; return; }
  try{
    const response=await fetch("/api/progress",{credentials:"same-origin",cache:"no-store",signal:AbortSignal.timeout(8000)});
    if(!response.ok) throw new Error("Progress unavailable");
    const data=await response.json();
    completedLevels=Array.isArray(data.completedLevels)?data.completedLevels:[];
  }catch(error){ completedLevels=[]; }
}
async function refreshAccess(){
  const status=document.getElementById("accountStatus");
  try{
    const response=await fetch("/api/access",{credentials:"same-origin",cache:"no-store",signal:AbortSignal.timeout(8000)});
    if(!response.ok) throw new Error("Access unavailable");
    const account=await response.json();
    hasFullAccess=account.allowed===true || account.isAdmin===true;
    isAdmin=account.isAdmin===true;
    isSignedIn=!!account.user;
    accessUnavailable=false;
    if(account.role==="RT"||account.role==="RN") role=account.role;
    if(account.gender==="male"||account.gender==="female") playerGender=account.gender;
    document.querySelectorAll("#roles .role").forEach(function(button){
      button.classList.toggle("sel",button.getAttribute("data-role")===role);
    });
    await refreshProgress(!!account.user);
    status.textContent=account.user
      ? account.user.email+" · "+(hasFullAccess?"All levels unlocked":"Level 1 free")
      : "Guest · Level 1 free";
    const signIn=document.getElementById("signInLink");
    signIn.textContent="YOUR ACCOUNT · SIGN IN / SIGN UP";
    signIn.hidden=!!account.user;
    signIn.href="/auth/login?redirect=%2Fgame";
    const logout=document.getElementById("logoutBtn");
    logout.hidden=!account.user;
    logout.disabled=!account.user;
  }catch(error){
    hasFullAccess=false;isAdmin=false;isSignedIn=false;completedLevels=[];accessUnavailable=true;
    document.getElementById("signInLink").hidden=false;
    document.getElementById("logoutBtn").hidden=true;
    document.getElementById("logoutBtn").disabled=true;
    status.textContent="Level 1 free · Account service unavailable";
  }
  document.getElementById("unlockLink").hidden=hasFullAccess;
  syncLevelMenu(selectedLevel);
  return hasFullAccess;
}
const desktopLayout=matchMedia("(min-width:1000px) and (hover:hover) and (pointer:fine)");
function setMenu(open){
  document.getElementById("app").classList.toggle("menuOpen",open);
  document.getElementById("menuToggle").setAttribute("aria-expanded",String(open));
  document.getElementById("menuToggle").setAttribute("aria-label",open?"Close shift menu":"Open shift menu");
  document.getElementById("desktopMenu").inert=!open;
  document.getElementById("menuBackdrop").hidden=!open || desktopLayout.matches;
  keys={};act=false;actHeld=false;dropStick();
  if(!open && document.getElementById("desktopMenu").contains(document.activeElement)) document.getElementById("menuToggle").focus();
}
document.getElementById("menuToggle").onclick=function(){setMenu(!document.getElementById("app").classList.contains("menuOpen"));};
document.getElementById("logoutBtn").onclick=async function(){
  const button=this;
  button.disabled=true;button.textContent="LOGGING OUT…";
  ++startRequest;
  try{
    const response=await fetch("/api/auth/logout",{method:"POST",credentials:"same-origin",signal:AbortSignal.timeout(8000)});
    if(!response.ok) throw new Error("Logout failed");
    hasFullAccess=false;syncLevelMenu(selectedLevel);
    running=false;cancelAnimationFrame(gameFrame);
    screen("SIGNED OUT",[{t:"Level 1 is free. Sign in again to access your unlocked levels.",k:1}],"PLAY FREE LEVEL",function(){begin(1);});
    await refreshAccess();
  }catch(error){
    document.getElementById("accountStatus").textContent="Could not log out. Please try again.";
    button.disabled=false;
  }finally{button.textContent="LOG OUT";}
};
document.getElementById("menuBackdrop").onclick=function(){setMenu(false);};
addEventListener("keydown",function(e){if(e.key==="Escape") setMenu(false);});
desktopLayout.addEventListener("change",function(){setMenu(embedded?false:desktopLayout.matches);});
addEventListener("focus",refreshAccess);

function syncLevelMenu(n){
  selectedLevel=n;
  document.querySelectorAll("#levelSelect button").forEach(function(button){
    const value=Number(button.dataset.level);
    const unlocked=isLevelUnlocked(value);
    button.setAttribute("aria-pressed",String(value===n));
    button.classList.toggle("current",value===level);
    button.classList.toggle("locked",!unlocked);
  });
}
for(let n=1;n<=8;n++){
  const button=document.createElement("button");
  button.type="button";button.dataset.level=n;
  button.innerHTML='<strong>'+String(n).padStart(2,"0")+'</strong>';
  button.setAttribute("aria-label","Launch level "+n);
  button.onclick=function(){fullHouse=false;begin(n);this.blur();};
  document.getElementById("levelSelect").appendChild(button);
}
document.getElementById("startBtn").onclick=function(){SFX.start();fullHouse=false;begin(1);};
(function(){
  const mb=document.getElementById("mute");
  mb.addEventListener("pointerdown",function(e){
    e.preventDefault(); e.stopPropagation();
    if(!SFX.isReady()) SFX.start();
    const onNow=SFX.toggle();
    if(music) music.setVolume(onNow?0.55:0);
    mb.textContent = onNow ? "\u266a" : "\u2715";
    mb.className = onNow ? "" : "off";
  });
})();
const embedded=new URLSearchParams(location.search).get("embed")==="1";
if(embedded){ document.body.classList.add("embedded"); }
setMenu(embedded?false:desktopLayout.matches);
startLevel(1);resize();hud();draw();
const requestedLevel=(function(){
  const n=Number(new URLSearchParams(location.search).get("level"));
  return n>=1&&n<=8?n:null;
})();
if(!requestedLevel){ ov.classList.remove("hide"); }
refreshAccess().then(function(){
  if(requestedLevel){ syncLevelMenu(requestedLevel); begin(requestedLevel); }
  else if(isSignedIn){ begin(1); }
});
})();
