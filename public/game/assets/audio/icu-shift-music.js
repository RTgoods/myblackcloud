/* ICU Shift Music — upbeat groove + code blue + black cloud events. Pure Web Audio, no files.
   const music = ICUShiftMusic({ ctx: audioCtx, destination: masterGain, voice: true });
   music.start();  music.stop();
   music.blackCloud();  // corrupted overhead chime, tape-stop, thunder, then the black cloud loop (runs until cleared)
   music.clearCloud();  // reverse swell, clean chime back up, groove returns
   music.codeBlue();    // works from the groove or mid black cloud (returns to whichever it came from)
   music.rosc();
   music.fail();        // level lost: music tape-stops, flatline, sad trombone (call start() to play again)
   music.setRandom(true); music.setRandomClouds(true);
   music.onChange = (mode) => {};  // 'groove' | 'page' | 'code' | 'storm' | 'cloud' | 'failed'
*/
function ICUShiftMusic(opts = {}) {
  const ctx = opts.ctx || new (window.AudioContext || window.webkitAudioContext)();
  const BPM = 120;                    // also the top of the guideline compression rate
  const STEP = 60 / BPM / 4;
  const CODE_BARS = 16;

  // ---------- routing ----------
  const out = ctx.createGain(); out.gain.value = opts.volume ?? 0.8;
  out.connect(opts.destination || ctx.destination);
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.ratio.value = 4; comp.attack.value = 0.004; comp.release.value = 0.15;
  comp.connect(out);
  const muffle = ctx.createBiquadFilter(); muffle.type = 'lowpass'; muffle.frequency.value = 20000; muffle.Q.value = 0.7;
  muffle.connect(comp);
  const bus = ctx.createGain(); bus.connect(muffle);   // music
  const fx = ctx.createGain(); fx.connect(comp);       // overhead page, defib, never muffled
  const pump = ctx.createGain(); pump.connect(bus);
  // seasick pitch warble for the black cloud: everything melodic drifts and sags together
  const warpBus = ctx.createGain();
  const warpLfo = ctx.createOscillator(); warpLfo.frequency.value = 0.33; warpLfo.start();
  const warpAmt = ctx.createGain(); warpAmt.gain.value = 0; warpLfo.connect(warpAmt).connect(warpBus);
  const sag = ctx.createConstantSource(); sag.offset.value = 0; sag.start(); sag.connect(warpBus);
  const warp = o => { warpBus.connect(o.detune); return o; };
  function setWarp(t, cents) { if (!cents) warpLfo.frequency.setValueAtTime(0.33, t); warpAmt.gain.cancelScheduledValues(t); warpAmt.gain.setValueAtTime(warpAmt.gain.value, t); warpAmt.gain.linearRampToValueAtTime(cents, t + 1.2); }
  const verb = ctx.createConvolver(); verb.buffer = impulse(1.8);
  const verbOut = ctx.createGain(); verbOut.gain.value = 0.22; verb.connect(verbOut); verbOut.connect(comp);
  const hall = ctx.createConvolver(); hall.buffer = impulse(3.5);   // PA system reverb
  const hallOut = ctx.createGain(); hallOut.gain.value = 0.5; hall.connect(hallOut); hallOut.connect(fx);

  const noiseBuf = (() => {
    const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  })();
  const crunch = curve(25), fuzz = curve(45);

  function impulse(sec) {
    const n = ctx.sampleRate * sec, b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.4); }
    return b;
  }
  function curve(k) {
    const n = 2048, c = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = i * 2 / n - 1; c[i] = (1 + k) * x / (1 + k * Math.abs(x)); }
    return c;
  }
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  function env(g, t, peak, a, d) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
  function noise(t, dur) { const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(t, Math.random() * 0.5); s.stop(t + dur); return s; }
  function osc(type, f, t, dur) { const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.start(t); o.stop(t + dur + 0.05); return o; }

  // ---------- instruments ----------
  function kick(t, hard = false) {
    const o = osc('sine', hard ? 170 : 140, t, 0.4), g = ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(hard ? 42 : 50, t + 0.11);
    env(g, t, hard ? 1.1 : 0.9, 0.002, hard ? 0.32 : 0.26);
    if (hard) { const s = ctx.createWaveShaper(); s.curve = crunch; o.connect(s).connect(g); } else o.connect(g);
    g.connect(bus);
    pump.gain.cancelScheduledValues(t);
    pump.gain.setValueAtTime(0.4, t); pump.gain.linearRampToValueAtTime(1, t + STEP * 2.5);
  }
  function clap(t, v = 0.5) {
    [0, 0.011, 0.022].forEach((dt, i) => {
      const n = noise(t + dt, 0.25), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 1.2;
      env(g, t + dt, v * (i === 2 ? 1 : 0.6), 0.001, i === 2 ? 0.18 : 0.02);
      n.connect(f).connect(g); g.connect(bus); g.connect(verb);
    });
  }
  function hat(t, v = 0.12, open = false) {
    const n = noise(t, 0.4), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'highpass'; f.frequency.value = open ? 6500 : 8500;
    env(g, t, v, 0.001, open ? 0.18 : 0.03);
    n.connect(f).connect(g).connect(bus);
  }
  function shaker(t, v) {
    const n = noise(t, 0.1), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'bandpass'; f.frequency.value = 5500; f.Q.value = 0.8;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    n.connect(f).connect(g).connect(bus);
  }
  function bass(t, m, dur, dirty = false) {
    const o = osc(dirty ? 'sawtooth' : 'square', hz(m), t, dur), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'lowpass'; f.Q.value = dirty ? 7 : 9;
    f.frequency.setValueAtTime(dirty ? 2200 : 1800, t); f.frequency.exponentialRampToValueAtTime(dirty ? 240 : 320, t + dur);
    env(g, t, dirty ? 0.3 : 0.32, 0.003, dur);
    if (dirty) { const s = ctx.createWaveShaper(); s.curve = fuzz; o.connect(s).connect(f); } else o.connect(f);
    f.connect(g).connect(pump);
  }
  function chord(t, notes, dur, v = 0.035) {   // short bright stab, offbeat organ-house style
    notes.forEach(m => [-6, 6].forEach(det => {
      const o = osc('sawtooth', hz(m), t, dur), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.detune.value = det; f.type = 'lowpass';
      f.frequency.setValueAtTime(3500, t); f.frequency.exponentialRampToValueAtTime(900, t + dur);
      env(g, t, v, 0.004, dur);
      o.connect(f).connect(g); g.connect(pump); g.connect(verb);
    }));
  }
  function lead(t, m, dur) {   // chiptune lead with a little vibrato
    const o = osc('square', hz(m), t, dur), o2 = osc('square', hz(m + 12), t, dur);
    const vib = osc('sine', 6, t, dur), vg = ctx.createGain(), g = ctx.createGain(), g2 = ctx.createGain(), f = ctx.createBiquadFilter();
    vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(8, t + dur); vib.connect(vg); vg.connect(o.detune); vg.connect(o2.detune);
    f.type = 'lowpass'; f.frequency.value = 4200; g2.gain.value = 0.25;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.075, t + 0.008);
    g.gain.setValueAtTime(0.075, t + dur * 0.7); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(f); o2.connect(g2).connect(f); f.connect(g); g.connect(bus); g.connect(verb);
  }
  function beep(t, f = 960, v = 0.06, dur = 0.07) {
    const o = osc('sine', f, t, dur), g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.004);
    g.gain.setValueAtTime(v, t + dur - 0.01); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus);
  }
  function chimeNote(t, m, v, bend = 0) {
    [1, 2, 3.01].forEach((h, i) => {
      const o = osc('sine', hz(m) * h, t, 1.8), g = ctx.createGain();
      if (bend) { o.detune.setValueAtTime(0, t + 0.05); o.detune.linearRampToValueAtTime(bend, t + 1.5); }
      env(g, t, v * [1, 0.3, 0.15][i], 0.005, 1.6);
      if (bend) { const s = ctx.createWaveShaper(); s.curve = crunch; o.connect(s).connect(g); } else o.connect(g);
      g.connect(fx); g.connect(hall);
    });
  }
  function chime(t, up = false) {   // overhead PA "bing-bong-bong" (up = all clear)
    (up ? [72, 79, 84] : [84, 79, 72]).forEach((m, i) => chimeNote(t + i * 0.42, m, 0.14));
  }
  function warpChime(t) {           // the same chime, corrupted: stuck first note, then it melts
    for (let i = 0; i < 4; i++) chimeNote(t + i * STEP * 0.5, 84, 0.09);
    chimeNote(t + STEP * 2.5, 79, 0.14, -500);
    chimeNote(t + STEP * 4, 72, 0.15, -1200);
  }
  function vfAlarm(t) {        // fast red-alarm triplets
    for (let i = 0; i < 6; i++) {
      const tt = t + i * STEP, o = osc('square', hz(i % 2 ? 81 : 84), tt, STEP * 0.8), g = ctx.createGain(), f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.value = 2800;
      g.gain.setValueAtTime(0.0001, tt); g.gain.linearRampToValueAtTime(0.06, tt + 0.01);
      g.gain.setValueAtTime(0.06, tt + STEP * 0.6); g.gain.linearRampToValueAtTime(0.0001, tt + STEP * 0.8);
      o.connect(f).connect(g); g.connect(fx);
    }
  }
  function breath(t) {         // bag-valve squeeze
    const n = noise(t, 0.8), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'bandpass'; f.Q.value = 1.5;
    f.frequency.setValueAtTime(500, t); f.frequency.linearRampToValueAtTime(1300, t + 0.35); f.frequency.linearRampToValueAtTime(600, t + 0.7);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.35, t + 0.3); g.gain.linearRampToValueAtTime(0.0001, t + 0.7);
    n.connect(f).connect(g); g.connect(fx); g.connect(verb);
  }
  function charge(t, dur) {    // defib charging whine
    const o = osc('sine', 380, t, dur), o2 = osc('triangle', 380, t, dur), g = ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(2600, t + dur); o2.frequency.exponentialRampToValueAtTime(2620, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.06, t + dur * 0.8); g.gain.setValueAtTime(0.06, t + dur);
    g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.02);
    o.connect(g); o2.connect(g); g.connect(fx);
    // "charged" ready tone pulses
    for (let i = 0; i < 3; i++) beepFx(t + dur + 0.02 + i * STEP * 2, 2093, 0.05);
  }
  function beepFx(t, f, v) { const o = osc('square', f, t, 0.12), g = ctx.createGain(); env(g, t, v, 0.003, 0.1); o.connect(g).connect(fx); }
  function shock(t) {          // THWACK
    const n = noise(t, 0.4), f = ctx.createBiquadFilter(), g = ctx.createGain(), s = ctx.createWaveShaper();
    f.type = 'lowpass'; f.frequency.setValueAtTime(9000, t); f.frequency.exponentialRampToValueAtTime(200, t + 0.3);
    s.curve = crunch; env(g, t, 0.9, 0.001, 0.32);
    n.connect(s).connect(f).connect(g); g.connect(fx); g.connect(verb);
    const o = osc('sine', 120, t, 0.6), og = ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(30, t + 0.5); env(og, t, 1, 0.002, 0.55); o.connect(og).connect(fx);
  }
  function crash(t, v = 0.25) {
    const n = noise(t, 2), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'highpass'; f.frequency.value = 4500;
    env(g, t, v, 0.002, 1.6); n.connect(f).connect(g); g.connect(fx); g.connect(verb);
  }
  function rosc(t) {           // big major lift back to life
    [62, 66, 69, 74, 78].forEach(m => [-9, 9].forEach(det => {
      const o = osc('sawtooth', hz(m), t, 2), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.detune.value = det; f.type = 'lowpass';
      f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(5000, t + 0.4);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.03, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
      o.connect(f).connect(g); g.connect(fx); g.connect(verb);
    }));
    crash(t, 0.3);
  }
  function say(text, t) {
    if (!opts.voice || !('speechSynthesis' in window)) return;
    const ms = Math.max(0, (t - ctx.currentTime) * 1000);
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95; u.pitch = 0.9; u.volume = Math.min(1, out.gain.value + 0.1);
      speechSynthesis.speak(u);
    }, ms);
  }

  function tapeStop(t, dur) {
    muffle.frequency.setValueAtTime(20000, t); muffle.frequency.exponentialRampToValueAtTime(180, t + dur);
    bus.gain.setValueAtTime(1, t); bus.gain.linearRampToValueAtTime(0.0001, t + dur);
    const o = osc('sawtooth', 220, t, dur), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(25, t + dur); f.type = 'lowpass'; f.frequency.value = 900;
    g.gain.setValueAtTime(0.12, t); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(fx);
  }
  function thunder(t, v = 0.5) {
    const n = noise(t, 4), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(120, t + 3.5);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.04);
    g.gain.exponentialRampToValueAtTime(v * 0.4, t + 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
    n.connect(f).connect(g); g.connect(fx); g.connect(verb);
    for (let i = 0; i < 4; i++) {   // crackle
      const tt = t + Math.random() * 0.5, c = noise(tt, 0.08), cf = ctx.createBiquadFilter(), cg = ctx.createGain();
      cf.type = 'highpass'; cf.frequency.value = 2500; env(cg, tt, v * 0.5, 0.001, 0.06); c.connect(cf).connect(cg).connect(fx);
    }
  }
  function revSwell(t, dur, v = 0.25) {
    const n = noise(t, dur), f = ctx.createBiquadFilter(), g = ctx.createGain();
    f.type = 'highpass'; f.frequency.setValueAtTime(5000, t); f.frequency.exponentialRampToValueAtTime(1500, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + dur - 0.01); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    n.connect(f).connect(g); g.connect(fx); g.connect(verb);
  }
  function cloudHit(t) {
    [38, 44, 50, 56, 62].forEach(m => [-15, 15].forEach(det => {
      const o = osc('sawtooth', hz(m), t, 2.2), f = ctx.createBiquadFilter(), g = ctx.createGain(), s = ctx.createWaveShaper();
      o.detune.value = det; s.curve = fuzz; f.type = 'lowpass';
      f.frequency.setValueAtTime(200, t); f.frequency.exponentialRampToValueAtTime(3000, t + 0.05); f.frequency.exponentialRampToValueAtTime(220, t + 2);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.045, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.1);
      o.connect(s).connect(f).connect(g); g.connect(fx); g.connect(verb);
    }));
    const sub = osc('sine', 80, t, 1.2), sg = ctx.createGain();
    sub.frequency.exponentialRampToValueAtTime(30, t + 1); env(sg, t, 0.9, 0.003, 1.1); sub.connect(sg).connect(fx);
    thunder(t, 0.45);
  }
  function drone(t, dur) {          // two D's a quarter-tone-ish apart, slowly beating
    [[38, 0], [38, 28], [45, -10]].forEach(([m, det]) => {
      const o = warp(osc('sawtooth', hz(m), t, dur)), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.detune.value = det; f.type = 'lowpass'; f.frequency.value = 420;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.026, t + 0.1);
      g.gain.setValueAtTime(0.026, t + dur - 0.1); g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(f).connect(g).connect(pump);
    });
  }
  function heart(t, v = 1) {       // lub-dub kick, deep and soft
    const o = osc('sine', 75, t, 0.35), f = ctx.createBiquadFilter(), g = ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(38, t + 0.2); f.type = 'lowpass'; f.frequency.value = 180;
    env(g, t, 1.1 * v, 0.006, 0.3); o.connect(f).connect(g).connect(bus);
    pump.gain.cancelScheduledValues(t); pump.gain.setValueAtTime(0.55, t); pump.gain.linearRampToValueAtTime(1, t + STEP * 3);
  }
  function taiko(t, v = 0.8) {      // big distant drum hit
    const o = osc('sine', 110, t, 1), g = ctx.createGain(), n = noise(t, 0.3), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
    o.frequency.exponentialRampToValueAtTime(45, t + 0.3); env(g, t, v, 0.004, 0.9);
    nf.type = 'lowpass'; nf.frequency.value = 900; env(ng, t, v * 0.4, 0.002, 0.2);
    o.connect(g); n.connect(nf).connect(ng); [g, ng].forEach(x => { x.connect(bus); x.connect(verb); x.connect(hall); });
  }
  function braam(t, dur) {          // low brass swell, D with a tritone underneath
    [[26, 0.05], [38, 0.04], [32, 0.03], [44, 0.02]].forEach(([m, v]) => [-10, 10].forEach(det => {
      const o = warp(osc('sawtooth', hz(m), t, dur)), f = ctx.createBiquadFilter(), g = ctx.createGain(), sh = ctx.createWaveShaper();
      o.detune.value = det; sh.curve = crunch; f.type = 'lowpass'; f.Q.value = 3;
      f.frequency.setValueAtTime(120, t); f.frequency.exponentialRampToValueAtTime(1100, t + dur * 0.35); f.frequency.exponentialRampToValueAtTime(150, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + dur * 0.3); g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(sh).connect(f).connect(g); g.connect(pump); g.connect(verb);
    }));
  }
  function strings(t, dur) {        // high tremolo cluster that never resolves
    const trem = osc('sine', 11, t, dur), tg = ctx.createGain(); tg.gain.value = 0.5;
    const sum = ctx.createGain(); sum.gain.setValueAtTime(0.0001, t);
    sum.gain.linearRampToValueAtTime(1, t + dur * 0.5); sum.gain.linearRampToValueAtTime(0.0001, t + dur);
    const am = ctx.createGain(); am.gain.value = 0.5; trem.connect(tg).connect(am.gain);
    [86, 87, 93].forEach(m => [-8, 8].forEach(det => {
      const o = warp(osc('sawtooth', hz(m), t, dur)), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.detune.value = det; f.type = 'bandpass'; f.frequency.value = hz(m) * 1.5; f.Q.value = 1;
      g.gain.value = 0.012; o.connect(f).connect(g).connect(am);
    }));
    am.connect(sum); sum.connect(bus); sum.connect(verb);
  }
  function bell(t, m, v = 0.12) {   // distant toll, inharmonic partials
    [[1, 1, 4], [2.0, 0.5, 2.5], [2.76, 0.35, 2], [5.4, 0.2, 1.2], [0.5, 0.4, 5]].forEach(([r, a, d]) => {
      const o = warp(osc('sine', hz(m) * r, t, d)), g = ctx.createGain();
      env(g, t, v * a, 0.004, d); o.connect(g); g.connect(hall); g.connect(verb);
    });
  }
  function choir(t, notes, dur) {   // dark "ooh" pad
    notes.forEach(m => [-9, 0, 9].forEach(det => {
      const o = warp(osc('sawtooth', hz(m), t, dur)), f1 = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter(), g = ctx.createGain();
      o.detune.value = det; f1.type = 'bandpass'; f1.frequency.value = 400; f1.Q.value = 5;
      f2.type = 'bandpass'; f2.frequency.value = 800; f2.Q.value = 6;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.03, t + dur * 0.4); g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(f1).connect(g); o.connect(f2).connect(g); g.connect(pump); g.connect(verb);
    }));
  }
  function sub(t, dur) {
    const o = warp(osc('sine', hz(26), t, dur)), g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.35, t + dur * 0.4); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(pump);
  }
  function musicBox(t, m) {         // a child's music box in the wrong room
    [[1, 0.07], [3.98, 0.012]].forEach(([r, v]) => {
      const o = warp(osc('sine', hz(m) * r, t, 1.6)), g = ctx.createGain();
      o.detune.value = Math.random() * 14 - 7; env(g, t, v, 0.002, 1.5);
      o.connect(g); g.connect(bus); g.connect(hall);
    });
  }

  function pumpBeep(t) { for (let i = 0; i < 3; i++) beep(t + i * 0.09, 1500, 0.035, 0.05); }

  function failSting(t) {           // flatline, then the flatline gives up into a sad trombone
    bus.gain.cancelScheduledValues(t); muffle.frequency.cancelScheduledValues(t);
    tapeStop(t, 0.6);
    // flatline at the monitor's own pitch
    const fl = osc('sine', 960, t + 0.35, 2.2), fg = ctx.createGain();
    fl.frequency.setValueAtTime(960, t + 1.9); fl.frequency.exponentialRampToValueAtTime(700, t + 2.5);
    fg.gain.setValueAtTime(0.0001, t + 0.35); fg.gain.linearRampToValueAtTime(0.07, t + 0.37);
    fg.gain.setValueAtTime(0.07, t + 1.9); fg.gain.linearRampToValueAtTime(0.0001, t + 2.5);
    fl.connect(fg); fg.connect(fx); fg.connect(verb);
    // wah wah wah waaaah
    const notes = [[2.6, 57, 0.5], [3.15, 56, 0.5], [3.7, 55, 0.55], [4.3, 54, 2.0]];
    notes.forEach(([dt, m, dur], i) => {
      const tt = t + dt, lastNote = i === 3;
      const o = osc('sawtooth', hz(m), tt, dur), o2 = osc('sawtooth', hz(m), tt, dur);
      o2.detune.value = 8; o.frequency.setValueAtTime(hz(m) * 0.97, tt); o.frequency.linearRampToValueAtTime(hz(m), tt + 0.06);
      const f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'lowpass'; f.Q.value = 6;
      f.frequency.setValueAtTime(350, tt); f.frequency.exponentialRampToValueAtTime(1600, tt + 0.12);
      f.frequency.exponentialRampToValueAtTime(lastNote ? 500 : 700, tt + dur);
      if (lastNote) {             // the wobble
        const lfo = osc('sine', 5.5, tt + 0.25, dur), lg = ctx.createGain(), lf = ctx.createGain();
        lg.gain.setValueAtTime(0, tt + 0.25); lg.gain.linearRampToValueAtTime(45, tt + dur);
        lf.gain.setValueAtTime(0, tt + 0.25); lf.gain.linearRampToValueAtTime(500, tt + 0.6);
        lfo.connect(lg); lg.connect(o.detune); lg.connect(o2.detune); lfo.connect(lf).connect(f.frequency);
        o.frequency.setValueAtTime(hz(m), tt + dur * 0.7); o.frequency.exponentialRampToValueAtTime(hz(m - 2), tt + dur);
      }
      g.gain.setValueAtTime(0.0001, tt); g.gain.linearRampToValueAtTime(0.11, tt + 0.04);
      g.gain.setValueAtTime(0.11, tt + dur * 0.8); g.gain.linearRampToValueAtTime(0.0001, tt + dur);
      o.connect(f); o2.connect(f); f.connect(g); g.connect(fx); g.connect(verb);
    });
    // one last tired chime
    chimeNote(t + 6.6, 60, 0.07, -100);
  }

  // ---------- song: D major, I-V-vi-IV ----------
  const PROG = [{ r: 50, c: [0, 4, 7] }, { r: 45, c: [0, 4, 7] }, { r: 47, c: [0, 3, 7] }, { r: 43, c: [0, 4, 7] }];
  const MEL = [   // [step, midi, length in steps]
    [[0, 74, 2], [3, 78, 2], [6, 81, 2], [8, 78, 2], [10, 81, 2], [12, 83, 4]],
    [[0, 81, 3], [4, 78, 2], [6, 76, 2], [8, 73, 4], [12, 76, 4]],
    [[0, 78, 2], [3, 83, 2], [6, 81, 2], [8, 78, 2], [10, 76, 2], [12, 74, 4]],
    [[0, 74, 6], [8, 71, 2], [10, 74, 2], [12, 76, 4]],
    [[0, 74, 2], [3, 78, 2], [6, 81, 2], [8, 78, 2], [10, 81, 2], [12, 83, 4]],
    [[0, 81, 3], [4, 78, 2], [6, 76, 2], [8, 73, 4], [12, 76, 4]],
    [[0, 78, 2], [3, 83, 2], [6, 81, 2], [8, 78, 2], [10, 76, 2], [12, 74, 4]],
    [[0, 86, 2], [3, 83, 2], [6, 81, 2], [8, 78, 2], [10, 81, 2], [12, 86, 4]],
  ];
  const swing = s => (s % 2 ? STEP * 0.14 : 0);

  function groove(s, b, t) {
    const c = PROG[b % 4], ph = b % 16, fill = ph % 8 === 7;
    if (s === 0 || s === 7 || s === 10 || (fill && s === 14)) kick(t);
    if (s === 4 || s === 12) clap(t);
    if (fill && s === 15) clap(t + swing(s), 0.3);
    if (s % 4 === 2) hat(t, 0.13, true);
    shaker(t + swing(s), s % 2 ? 0.05 : 0.09);
    if (s % 2 === 0) bass(t, c.r - 12 + (s % 4 === 2 ? 12 : 0), STEP * 1.5);
    if (s === 2 || s === 6 || s === 10 || s === 14 || (ph >= 4 && s === 11)) chord(t, c.c.map(i => c.r + 12 + i), STEP * 1.2);
    if (ph >= 8) MEL[ph - 8].forEach(([st, m, len]) => { if (st === s) lead(t, m, STEP * len); });
    if (s === 0 || s === 8) beep(t);
  }

  function page(s, t) {           // one bar, groove muffled under the overhead
    if (s === 0) {
      muffle.frequency.setValueAtTime(20000, t); muffle.frequency.exponentialRampToValueAtTime(500, t + 0.25);
      chime(t); say('Code blue. I C U. Code blue.', t + 1.4);
    }
    const c = PROG[0];
    if (s % 4 === 0) kick(t);
    if (s % 2 === 0) bass(t, c.r - 12, STEP * 1.5);
    if (s === 12) vfAlarm(t);
  }

  const CROOTS = [38, 38, 34, 33];     // Dm, Dm, Bb, A
  function code(s, b, t) {
    const r = CROOTS[b % 4], beat = s % 4 === 0;
    const breaths = b % 8 === 7 && s >= 8;               // 30 compressions : 2 breaths
    const cleared = b === CODE_BARS - 1 && s >= 8;       // stand clear
    if (b === 0 && s === 0) { muffle.frequency.setValueAtTime(500, t); muffle.frequency.exponentialRampToValueAtTime(20000, t + 0.08); crash(t); }
    if (cleared) {
      if (s === 8) shock(t);
      return;
    }
    if (breaths) { if (s === 8 || s === 12) breath(t); hat(t, 0.06); return; }
    if (beat) kick(t, true);                              // compressions, 120/min
    if (s === 4 || s === 12) clap(t, 0.35);
    hat(t, s % 2 ? 0.06 : 0.12);
    if (s % 2 === 0) bass(t, r + (s === 6 ? 1 : 0) + (s === 14 ? 3 : 0), STEP * 1.4, true);
    if (s === 0 && b % 4 === 0) vfAlarm(t);
    if (s === 0 && b % 2 === 0) chord(t, [r + 24, r + 27, r + 31], STEP * 6, 0.03);
    if (b === CODE_BARS - 2 && s === 0) charge(t, STEP * 24);  // charge while compressing
  }

  // ---------- black cloud: heartbeat, low brass, tolling bell, a music box that's out of tune ----------
  function storm(s, t) {            // one-bar transition in
    if (s === 0) { warpChime(t); setWarp(t, 35); warpLfo.frequency.setValueAtTime(0.16, t); }
    if (s < 4) { kick(t); clap(t, 0.25 + s * 0.08); }
    if (s === 4) { tapeStop(t, STEP * 6); thunder(t, 0.35); }
    if (s === 8) revSwell(t, STEP * 8, 0.3);
  }
  const CHOIR = [[50, 53, 57], [50, 53, 58], [46, 50, 53], [49, 52, 56]];   // Dm, Dm(b6), Bb, A(dim)
  const BOX = [   // [step, midi] per bar, slow and wrong
    [[0, 86], [4, 89], [8, 88], [12, 92]],
    [[0, 91], [6, 89], [12, 85]],
    [[0, 86], [4, 89], [8, 88], [12, 94]],
    [[0, 93], [4, 92], [8, 89], [12, 86]],
  ];
  function cloud(s, b, t, last) {
    const ph = b % 16, gs = 16 * b + s;
    if (b === 0 && s === 0) {
      bus.gain.cancelScheduledValues(t); bus.gain.setValueAtTime(1, t);
      muffle.frequency.cancelScheduledValues(t); muffle.frequency.setValueAtTime(20000, t);
      cloudHit(t);
    }
    // the unit is still busy, just further away
    if (gs % 8 === 0) beep(t, 960, 0.035);
    if (gs % 6 === 3) beep(t, 880, 0.025);
    if (gs % 5 === 1) beep(t, 1040, 0.016);
    if (b % 4 === 3 && s === 10) pumpBeep(t);
    if (s % 2 === 0) hat(t, s % 4 === 0 ? 0.07 : 0.035);        // the clock
    if (s === 0) choir(t, CHOIR[b % 4], STEP * 16);
    if (s === 0 && b % 4 === 0) braam(t, STEP * 28);
    if (s === 0 && b % 8 === 2) strings(t, STEP * 64);
    if (s === 0 && b % 2 === 0) bell(t, 50);
    if (last && s >= 8) { if (s === 8) revSwell(t, STEP * 8, 0.3); if (s % 2 === 0) heart(t, 0.5 + (s - 8) * 0.06); return; }
    // heartbeat, getting faster in the second half of each 8 bars
    const fast = ph % 8 >= 4;
    if (s === 0 || s === 8 || (fast && (s === 4 || s === 12))) heart(t);
    if (s === 2 || s === 10 || (fast && (s === 6 || s === 14))) heart(t, 0.55);
    if (s === 8 && b % 2 === 1) taiko(t);
    if (s === 0 && b % 4 === 0) sub(t, STEP * 16);                 // sub floor
    if (ph >= 4 && ph < 8 || ph >= 12) BOX[ph % 4].forEach(([st, m]) => { if (st === s) musicBox(t, m); });
    if (b % 8 === 7 && s === 8) {     // the whole room sags, then snaps back
      sag.offset.cancelScheduledValues(t); sag.offset.setValueAtTime(0, t);
      sag.offset.linearRampToValueAtTime(-160, t + STEP * 8); sag.offset.setValueAtTime(0, t + STEP * 8);
      revSwell(t, STEP * 8, 0.14);
    }
    if (ph === 8 && s === 0) thunder(t, 0.3);
  }

  // ---------- scheduler ----------
  let mode = 'groove', s = 0, b = 0, next = 0, timer = null, running = false;
  let wantCode = false, wantRosc = false, roscNext = false, randomOn = false, barsSince = 0;
  let wantCloud = false, wantClear = false, clearNext = false, cloudsOn = false, lastBar = -1, returnTo = 'groove';
  const api = { ctx, onChange: null, onStep: null };
  const setMode = m => { mode = m; api.onChange && api.onChange(m); };

  function tick() {
    while (next < ctx.currentTime + 0.12) {
      if (s === 0) {
        if (mode === 'groove' && barsSince >= 4) {
          if (cloudsOn && Math.random() < 1 / 10) wantCloud = true;
          else if (randomOn && Math.random() < 1 / 10) wantCode = true;
        }
        if (mode === 'cloud' && randomOn && b >= 2 && lastBar < 0 && Math.random() < 1 / 16) wantCode = true;
        if (mode === 'cloud' && cloudsOn && b >= 12 && lastBar < 0) wantClear = true;
        if (wantCode && (mode === 'groove' || mode === 'cloud')) {
          wantCode = false; wantCloud = false; returnTo = mode; lastBar = -1; b = 0; setMode('page');
        } else if (wantCloud && mode === 'groove') {
          wantCloud = false; b = 0; lastBar = -1; setMode('storm');
        }
        if (wantClear && mode === 'cloud') { wantClear = false; lastBar = b; }
        if (wantRosc && mode === 'code') { wantRosc = false; if (b < CODE_BARS - 2) b = CODE_BARS - 2; }
        if (roscNext) { roscNext = false; rosc(next); if (mode === 'groove') setWarp(next, 0); }
        if (clearNext) { clearNext = false; chime(next, true); crash(next, 0.2); setWarp(next, 0); }
      }

      if (mode === 'groove') groove(s, b, next);
      else if (mode === 'page') page(s, next);
      else if (mode === 'code') code(s, b, next);
      else if (mode === 'storm') storm(s, next);
      else cloud(s, b, next, b === lastBar);
      api.onStep && api.onStep(mode, s, b, next);

      s++;
      if (s >= 16) {
        s = 0; b++;
        if (mode === 'groove') barsSince++;
        else if (mode === 'page') { b = 0; setMode('code'); }
        else if (mode === 'storm') { b = 0; setMode('cloud'); }
        else if (mode === 'cloud' && lastBar >= 0 && b > lastBar) { b = 0; lastBar = -1; barsSince = 0; clearNext = true; setMode('groove'); }
        else if (mode === 'code' && b >= CODE_BARS) { b = 0; barsSince = 0; roscNext = true; setMode(returnTo); }
      }
      next += STEP;
    }
  }

  api.start = () => {
    if (running) return; running = true;
    ctx.resume(); next = ctx.currentTime + 0.06; s = 0; b = 0; barsSince = 0; lastBar = -1;
    bus.gain.cancelScheduledValues(ctx.currentTime); bus.gain.setValueAtTime(1, ctx.currentTime);
    muffle.frequency.cancelScheduledValues(ctx.currentTime); muffle.frequency.setValueAtTime(20000, ctx.currentTime);
    setWarp(ctx.currentTime, 0); setMode('groove'); timer = setInterval(tick, 25);
  };
  api.stop = () => { running = false; clearInterval(timer); wantCode = wantCloud = wantClear = false; bus.gain.cancelScheduledValues(ctx.currentTime); bus.gain.setValueAtTime(0, ctx.currentTime + 0.05); };
  api.fail = () => {
    clearInterval(timer); const wasRunning = running; running = false;
    wantCode = wantCloud = wantClear = wantRosc = roscNext = clearNext = false; lastBar = -1;
    ctx.resume(); setWarp(ctx.currentTime, 0); failSting(ctx.currentTime + 0.02); setMode('failed');
    return wasRunning;
  };
  api.codeBlue = () => { if (running) wantCode = true; };
  api.rosc = () => { if (running) wantRosc = true; };
  api.blackCloud = () => { if (running && mode === 'groove') wantCloud = true; };
  api.clearCloud = () => {
    if (!running) return;
    if (mode === 'cloud') wantClear = true;
    else if (mode === 'page' || mode === 'code') returnTo = 'groove';   // cloud cleared mid-code: come back to the groove
  };
  api.setRandom = on => { randomOn = !!on; };
  api.setRandomClouds = on => { cloudsOn = !!on; };
  api.setVoice = on => { opts.voice = !!on; };
  api.setVolume = v => out.gain.setTargetAtTime(v, ctx.currentTime, 0.05);
  api.mode = () => mode;
  return api;
}
if (typeof module !== 'undefined') module.exports = ICUShiftMusic;
