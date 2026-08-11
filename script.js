/* ===================================================
   Shared behaviour: balloons + birthday tune synth
   =================================================== */

// ---------- Ambient floating balloons on every page ----------
(function spawnBalloons(){
  const layer = document.getElementById('balloon-layer');
  if(!layer) return;
  const colors = ['#ff8fab','#ffd166','#8ecae6','#b98ee8','#90e0ef','#ff6fa5'];
  const COUNT = window.innerWidth < 600 ? 8 : 14;

  for(let i=0;i<COUNT;i++){
    const b = document.createElement('div');
    b.className = 'balloon';
    const color = colors[Math.floor(Math.random()*colors.length)];
    b.style.background = `radial-gradient(circle at 30% 30%, ${color}, ${color}cc)`;
    b.style.color = color; // used by ::before border-top:inherit
    b.style.left = Math.random()*94 + '%';
    const duration = 14 + Math.random()*10;
    b.style.animationDuration = duration + 's';
    b.style.animationDelay = (-Math.random()*duration) + 's';
    const scale = 0.6 + Math.random()*0.7;
    b.style.transform = `scale(${scale})`;
    layer.appendChild(b);
  }
})();

// ---------- Confetti burst (small, reusable) ----------
function burstConfetti(target){
  const colors = ['#ff6fa5','#ffd166','#b98ee8','#8ecae6','#ffffff'];
  const parent = target || document.body;
  for(let i=0;i<40;i++){
    const c = document.createElement('div');
    c.style.position='fixed';
    c.style.left = '50%';
    c.style.top = '40%';
    c.style.width='8px';
    c.style.height='8px';
    c.style.borderRadius = Math.random()>0.5 ? '50%':'2px';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.zIndex = 50;
    c.style.pointerEvents='none';
    parent.appendChild(c);
    const angle = Math.random()*Math.PI*2;
    const dist = 120 + Math.random()*220;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist - 100;
    c.animate([
      {transform:'translate(0,0) rotate(0deg)', opacity:1},
      {transform:`translate(${dx}px, ${dy + 260}px) rotate(${Math.random()*720}deg)`, opacity:0}
    ], {duration: 1400 + Math.random()*600, easing:'cubic-bezier(.2,.8,.2,1)'});
    setTimeout(()=>c.remove(), 2200);
  }
}

// ---------- Happy Birthday tune, synthesized live (public-domain melody) ----------
let audioCtx;
function playBirthdayTune(onDone){
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const notes = [ // [note, beats]  simple public-domain "Happy Birthday" melody
    ['C4',0.75],['C4',0.25],['D4',1],['C4',1],['F4',1],['E4',2],
    ['C4',0.75],['C4',0.25],['D4',1],['C4',1],['G4',1],['F4',2],
    ['C4',0.75],['C4',0.25],['C5',1],['A4',1],['F4',1],['E4',1],['D4',2],
    ['A#4',0.75],['A#4',0.25],['A4',1],['F4',1],['G4',1],['F4',2],
  ];
  const freq = {C4:261.6,D4:293.7,E4:329.6,F4:349.2,G4:392.0,A4:440.0,A5:880,A#4:466.2,C5:523.3};
  let t = audioCtx.currentTime + 0.05;
  const beat = 0.34;
  notes.forEach(([n,b])=>{
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq[n];
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.22, t+0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + b*beat - 0.03);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + b*beat);
    t += b*beat;
  });
  if(onDone) setTimeout(onDone, (t - audioCtx.currentTime)*1000);
}
