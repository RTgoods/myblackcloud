/**
 * Pulls the latest game from ../BlackCloud (the dev source of SHIFT) into
 * public/game/, then re-applies the standalone-site patches: strips the
 * dev-only devbar test harness, points the access-check / auth links at
 * this site's routes instead of the storefront's, and wires in the
 * progress-save + leaderboard-submit hooks this site needs that don't
 * exist in the dev copy.
 *
 * Run after every gameplay change in BlackCloud: `node scripts/sync-game.mjs`
 *
 * Each patch below matches on an exact, unique snippet from the dev source.
 * If BlackCloud's game.js changes shape enough that a snippet no longer
 * matches, this script throws instead of silently shipping unpatched code —
 * update the snippet here to match, then re-run.
 */
import { readFileSync, writeFileSync, cpSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sourceDir = join(root, '../BlackCloud');
const destDir = join(root, 'public/game');

console.log('📥 Copying game files from ../BlackCloud...');
mkdirSync(join(destDir, 'assets/css'), { recursive: true });
mkdirSync(join(destDir, 'assets/js'), { recursive: true });
cpSync(join(sourceDir, 'index.html'), join(destDir, 'index.html'));
cpSync(join(sourceDir, 'assets/css/game.css'), join(destDir, 'assets/css/game.css'));
cpSync(join(sourceDir, 'assets/js/game.js'), join(destDir, 'assets/js/game.js'));

function replaceOnce(source, label, find, replace) {
  const count = source.split(find).length - 1;
  if (count !== 1) {
    throw new Error(`sync-game: expected exactly 1 match for "${label}", found ${count}. BlackCloud's source has likely changed — update scripts/sync-game.mjs to match.`);
  }
  return source.replace(find, replace);
}

// ── index.html ──────────────────────────────────────────────────────────────
let html = readFileSync(join(destDir, 'index.html'), 'utf8');
html = replaceOnce(html, 'title', '<title>SHIFT — ICU</title>', '<title>SHIFT — MyBlackCloud</title>');
html = replaceOnce(html, 'signInLink',
  '<a id="signInLink" href="/auth/login?redirect=%2Ficu-shift" target="_top">YOUR ACCOUNT · SIGN IN / SIGN UP</a>',
  '<a id="signInLink" href="/auth/login?redirect=%2Fgame" target="_top">YOUR ACCOUNT · SIGN IN / SIGN UP</a>');
html = replaceOnce(html, 'unlockLink',
  '<a id="unlockLink" href="/games/icu-shift" target="_top">UNLOCK ALL LEVELS →</a>',
  '<a id="unlockLink" href="/" target="_top">UNLOCK ALL LEVELS →</a>');
writeFileSync(join(destDir, 'index.html'), html, 'utf8');

// ── game.js ──────────────────────────────────────────────────────────────────
let js = readFileSync(join(destDir, 'assets/js/game.js'), 'utf8');

js = replaceOnce(js, 'state declaration (add totalDischarged)',
  'let carry="", carryBed=null, chairs=[], boost=0, discharged=0, quota=1, concurrent=1;',
  'let carry="", carryBed=null, chairs=[], boost=0, discharged=0, totalDischarged=0, quota=1, concurrent=1;');

js = replaceOnce(js, 'discharge increment (add totalDischarged++)',
  'carry=""; carryBed=null; discharged++;',
  'carry=""; carryBed=null; discharged++; totalDischarged++;');

js = replaceOnce(js, 'begin() level-1 reset (add totalDischarged=0)',
  'if(n===1) savedCount=0;',
  'if(n===1){ savedCount=0; totalDischarged=0; }');

js = replaceOnce(js, 'access-unavailable message (drop "storefront" wording)',
  '{t:accessUnavailable?"Account service unavailable. Try again on the storefront.":"Sign in with your account or unlock the full game."}],',
  '{t:accessUnavailable?"Account service unavailable. Try again shortly.":"Sign in with your account or unlock the full game."}],');

js = replaceOnce(js, 'win() (add saveProgress hooks)',
  `function win(){
  const nx=level+1;
  if(nx>8){ screen("SHIFT COMPLETE",
    [{t:"All eight beds. You cleared the whole unit.",k:1},
     {t:"Charge nurse asked for you by name. Highest honour available."}],
    "RUN IT AGAIN",function(){begin(1);}); return; }
  SFX.win();
  screen("UNIT CLEAR",
    [{t:"Level "+level+" done - "+discharged+" patient"+(discharged>1?"s":"")+" wheeled out.",k:1},
     {t:"Level "+nx+": "+nx+" discharges, "+Math.min(nx,5)+" beds running at once. More staff in the halls."}],
    "NEXT LEVEL",function(){begin(nx);});
}`,
  `function saveProgress(completedLevel,fullClear){
  fetch("/api/progress",{method:"POST",credentials:"same-origin",cache:"no-store",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({level:completedLevel,totalDischarged:totalDischarged})}).catch(function(){});
  fetch("/api/leaderboard",{method:"POST",credentials:"same-origin",cache:"no-store",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({score:totalDischarged,levelReached:completedLevel})}).catch(function(){});
}
function win(){
  const nx=level+1;
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
}`);

js = replaceOnce(js, 'refreshAccess() fetch URL (drop slug)',
  'const response=await fetch("/api/access?slug=icu-shift",{credentials:"same-origin",cache:"no-store",signal:AbortSignal.timeout(8000)});',
  'const response=await fetch("/api/access",{credentials:"same-origin",cache:"no-store",signal:AbortSignal.timeout(8000)});');

js = replaceOnce(js, 'refreshAccess() sign-in redirect',
  'signIn.href="/auth/login?redirect=%2Ficu-shift";',
  'signIn.href="/auth/login?redirect=%2Fgame";');

js = replaceOnce(js, 'localTestMode/localPreview declarations',
  `let gameFrame=0;
let localTestMode=false;
const localPreview=["localhost","127.0.0.1","[::1]"].includes(location.hostname);
let startRequest=0;`,
  `let gameFrame=0;
const localTestMode=false;
let startRequest=0;`);

// Strip the entire dev-only devbar block: from `if(localPreview){` through
// its matching close, right before the final `setMenu(desktopLayout.matches && !embedded);`
// that starts the game. Matched structurally (not by exact body text) since
// the devbar's button list changes more often than the rest of this file.
const devbarStart = js.indexOf('if(localPreview){');
// There are two "setMenu(desktopLayout.matches && !embedded);" occurrences
// (one inside an earlier addEventListener callback); the one that ends the
// devbar block is the last one in the file, so search forward from devbarStart.
const devbarEnd = js.indexOf('setMenu(desktopLayout.matches && !embedded);', devbarStart);
if (devbarStart === -1 || devbarEnd === -1 || devbarEnd < devbarStart) {
  throw new Error('sync-game: could not locate the devbar block (if(localPreview){ ... setMenu(desktopLayout.matches && !embedded);) to strip. BlackCloud\'s source has likely changed — update scripts/sync-game.mjs.');
}
js = js.slice(0, devbarStart) + js.slice(devbarEnd);

writeFileSync(join(destDir, 'assets/js/game.js'), js, 'utf8');

console.log('✅ Synced and patched game.js + index.html into public/game/');
