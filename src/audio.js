export class Audio{
 constructor(){this.ctx=null;this.master=null;this.volume=.35;this.enabled=true;this.ambient=null;this.last=0}
 init(){if(this.ctx)return;try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=this.enabled?this.volume:0;this.master.connect(this.ctx.destination)}catch{}}
 resume(){this.init();if(this.ctx?.state==='suspended')this.ctx.resume().catch(()=>{})}
 set(volume,enabled){this.volume=volume;this.enabled=enabled;if(this.master)this.master.gain.setTargetAtTime(enabled?volume:0,this.ctx.currentTime,.1)}
 play(kind='click'){
  if(!this.enabled||!this.ctx)return;const now=this.ctx.currentTime;if(kind==='attack'&&now-this.last<.12)return;if(kind==='attack')this.last=now;
  const tones={click:[330,.05,'sine'],explore:[220,.3,'triangle'],build:[440,.22,'triangle'],attack:[100,.07,'sawtooth'],ranged:[620,.1,'sine'],victory:[523,.6,'triangle'],danger:[82,.6,'triangle'],save:[660,.15,'sine']};const[f,d,type]=tones[kind]||tones.click;
  const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,now);o.frequency.exponentialRampToValueAtTime(kind==='victory'?f*1.5:f*.6,now+d);g.gain.setValueAtTime(.08,now);g.gain.exponentialRampToValueAtTime(.001,now+d);o.connect(g);g.connect(this.master);o.start(now);o.stop(now+d+.02);
 }
}
