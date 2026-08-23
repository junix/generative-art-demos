import p5 from 'p5';
import './style.css';

declare global { interface Window { __VIS_READY__?: boolean; __INTERACTION_COUNT__?: number } }
const scene = new URLSearchParams(location.search).get('scene') ?? 'flow-field';
const W=1400,H=900;
const palette=['#ff6f91','#ffd166','#54d6c6','#7b9cff','#ba8cff'];

new p5(p => {
  p.setup=()=>{
    const c=p.createCanvas(W,H); c.id('stage'); c.parent('app'); p.pixelDensity(1); p.randomSeed(42); p.noiseSeed(42); p.clear();
    if(scene==='reaction') reaction(p); else if(scene==='botanical') botanical(p); else flowField(p);
    p.noLoop();
    window.__VIS_READY__=true;
  };
  p.mouseMoved=()=>{window.__INTERACTION_COUNT__=(window.__INTERACTION_COUNT__??0)+1; return false};
  p.mousePressed=()=>{window.__INTERACTION_COUNT__=(window.__INTERACTION_COUNT__??0)+1; return false};
});

function heading(p:p5,title:string,kicker:string){
  p.push();p.noStroke();p.fill('#eff8ff');p.textFont('Avenir Next');p.textStyle(p.BOLD);p.textSize(31);p.text(title,72,78);p.fill('#89a6bb');p.textStyle(p.NORMAL);p.textSize(14);p.text(kicker,74,111);p.stroke('#4d7188');p.strokeWeight(1);p.line(74,136,370,136);p.pop();
}
function flowField(p:p5){
  heading(p,'FLOW FIELD NO. 42','SEEDED PARTICLE TRAJECTORIES');
  p.colorMode(p.HSB,360,100,100,100);p.noFill();
  for(let seed=0;seed<220;seed++){
    let x=110+(seed%22)*55+p.random(-16,16), y=205+Math.floor(seed/22)*58+p.random(-15,15);
    p.beginShape();
    const hue=(175+seed*2.7)%360;p.stroke(hue,62,96,44);p.strokeWeight(seed%7===0?2.4:1.05);
    for(let step=0;step<90;step++){
      const a=p.noise(x*.0024,y*.0024)*p.TWO_PI*3.5 + Math.sin(y*.008)*.7;
      x+=Math.cos(a)*5.2;y+=Math.sin(a)*5.2;p.vertex(x,y);
      if(x<60||x>1340||y<160||y>850) break;
    }
    p.endShape();
  }
  p.colorMode(p.RGB);p.noStroke();
  for(let i=0;i<45;i++){p.fill(palette[i%5]+'bb');p.circle(160+(i*173)%1120,190+(i*97)%610,4+(i%4)*2)}
}
function reaction(p:p5){
  heading(p,'REACTION GARDEN','AN ACTIVATOR / INHIBITOR TERRAIN');
  const cols=104,rows=58,cell=11;const ox=125,oy=185;
  let a=Array.from({length:rows},(_,y)=>Array.from({length:cols},(_,x)=>.5+.5*Math.sin(x*.22+Math.cos(y*.31)*2)+.27*Math.sin(Math.hypot(x-52,y-29)*.55)));
  for(let iter=0;iter<5;iter++) a=a.map((row,y)=>row.map((v,x)=>{let sum=0,n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const yy=(y+dy+rows)%rows,xx=(x+dx+cols)%cols;sum+=a[yy][xx];n++}return .66*v+.34*sum/n+.07*Math.sin(v*8+iter)}));
  p.noStroke();
  a.forEach((row,y)=>row.forEach((v,x)=>{const q=Math.max(0,Math.min(1,(v+.25)/1.65));const c=p.lerpColor(p.color('#192d52'),p.lerpColor(p.color('#52d6c7'),p.color('#ffcf66'),q),q);c.setAlpha(45+q*205);p.fill(c);const s=3+cell*q*.92;p.circle(ox+x*cell,oy+y*cell,s)}));
  p.noFill();p.stroke('#ff6f91aa');p.strokeWeight(2);for(let r=0;r<4;r++)p.ellipse(700,505,180+r*210,75+r*95);
}
function botanical(p:p5){
  heading(p,'BOTANICAL RECURSION','L-SYSTEM HERBARIUM / GENERATION 06');
  const origins=[[260,810,-82,105],[520,820,-94,120],[780,810,-87,132],[1040,820,-98,112],[1240,800,-89,94]];
  origins.forEach((o,index)=>branch(p,o[0],o[1],o[2],o[3],0,index));
  p.noStroke();for(let i=0;i<70;i++){const x=120+(i*167)%1180,y=180+(i*89)%520;p.fill(palette[(i+2)%5]+'88');p.circle(x,y,2+(i%3)*2)}
}
function branch(p:p5,x:number,y:number,angle:number,length:number,depth:number,seed:number){
  if(depth>6||length<7)return;const x2=x+Math.cos(angle*p.PI/180)*length,y2=y+Math.sin(angle*p.PI/180)*length;
  p.stroke(palette[(depth+seed+2)%5]+'b5');p.strokeWeight(Math.max(.8,5-depth*.65));p.line(x,y,x2,y2);
  if(depth>3){p.noStroke();p.fill(palette[(seed+depth)%5]+'99');p.ellipse(x2,y2,18-depth,8,angle);}
  const split=18+((seed*7+depth*3)%12);branch(p,x2,y2,angle-split,length*.72,depth+1,seed+1);branch(p,x2,y2,angle+split,length*.69,depth+1,seed+2);if(depth%2===0)branch(p,x2,y2,angle+3,length*.56,depth+1,seed+3);
}
window.__INTERACTION_COUNT__=0;
