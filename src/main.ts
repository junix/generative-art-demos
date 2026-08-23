import p5 from 'p5';
import './style.css';

declare global { interface Window { __VIS_READY__?: boolean; __INTERACTION_COUNT__?: number } }
const scene = new URLSearchParams(location.search).get('scene') ?? 'flow-field';
const W=1400,H=900;
const palette=['#ff6f91','#ffd166','#54d6c6','#7b9cff','#ba8cff'];

new p5(p => {
  p.setup=()=>{
    const c=p.createCanvas(W,H); c.id('stage'); c.parent('app'); p.pixelDensity(1); p.randomSeed(42); p.noiseSeed(42); p.clear();
    const renderers:Record<string,(sketch:p5)=>void>={'flow-field':flowField,reaction,botanical,attractor,'circle-packing':circlePacking,quadtree,topography,tapestry,swarm,interference,maze,tiling};
    (renderers[scene]??flowField)(p);
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

function attractor(p:p5){
  heading(p,'STRANGE ATTRACTOR','240,000 ITERATIONS / DETERMINISTIC CHAOS');p.noFill();let x=.1,y=.1;const a=1.4,b=-2.3,c=2.4,d=-2.1;
  for(let layer=0;layer<5;layer++){p.beginShape(p.POINTS);p.stroke(palette[layer]+'55');p.strokeWeight(1.1+layer*.15);x=.1+layer*.001;y=.1;for(let i=0;i<48000;i++){const nx=Math.sin(a*y)-Math.cos(b*x),ny=Math.sin(c*x)-Math.cos(d*y);x=nx;y=ny;if(i>30)p.vertex(700+x*230,500+y*190)}p.endShape()}
  p.noStroke();p.fill('#8ba6b9');p.textSize(13);p.text('CLIFFORD MAP  a=1.4  b=-2.3  c=2.4  d=-2.1',930,820);
}
function circlePacking(p:p5){
  heading(p,'WEIGHTED CIRCLE COMMONS','COLLISION-RESOLVED EDITORIAL PACKING');const circles:Array<{x:number,y:number,r:number,c:string}>=[];
  for(let i=0;i<150;i++){let r=8+(i%17)*2.2,x=150+(i*83)%1100,y=190+(i*137)%600;for(let k=0;k<55;k++){for(const q of circles){const dx=x-q.x,dy=y-q.y,dist=Math.hypot(dx,dy)||1,need=r+q.r+3;if(dist<need){x+=dx/dist*(need-dist)*.52;y+=dy/dist*(need-dist)*.52}}x+=(700-x)*.002;y+=(500-y)*.002}circles.push({x,y,r,c:palette[i%5]})}
  p.noStroke();circles.forEach((q,i)=>{p.fill(q.c+(i%3===0?'88':'55'));p.circle(q.x,q.y,q.r*2);p.fill('#eaf7ffcc');if(q.r>28){p.textAlign(p.CENTER,p.CENTER);p.textSize(10);p.text(String(i+1),q.x,q.y)}});
}
function quadtree(p:p5){
  heading(p,'ADAPTIVE QUADTREE','LOCAL COMPLEXITY DRIVES SUBDIVISION');p.noFill();
  function cell(x:number,y:number,s:number,d:number){const v=p.noise(x*.004,y*.004,d*.4);p.stroke(palette[(d+Math.floor(v*4))%5]+(d<4?'88':'55'));p.strokeWeight(Math.max(.6,3-d*.35));if(d<6&&v>.34){const h=s/2;cell(x,y,h,d+1);cell(x+h,y,h,d+1);cell(x,y+h,h,d+1);cell(x+h,y+h,h,d+1)}else{p.fill(palette[(d+2)%5]+'22');p.rect(x,y,s,s);p.noFill()}}
  cell(270,170,640,0);cell(920,170,320,0);cell(80,490,180,0);
}
function topography(p:p5){
  heading(p,'FICTIONAL TOPOGRAPHY','NOISE-DERIVED ISO-LINES / 42 LEVELS');p.noFill();
  for(let level=0;level<42;level++){p.stroke(palette[level%5]+(level%6===0?'aa':'55'));p.strokeWeight(level%6===0?2.2:.8);p.beginShape();for(let x=80;x<1330;x+=7){const y=490+Math.sin(x*.012+level*.29)*85+Math.sin(x*.037-level*.13)*28+(level-21)*11;p.vertex(x,y)}p.endShape()}
  p.stroke('#ffd166aa');p.strokeWeight(3);p.beginShape();for(let i=0;i<80;i++)p.vertex(120+i*15,720-180*Math.sin(i*.055)+25*Math.sin(i*.43));p.endShape();
}
function tapestry(p:p5){
  heading(p,'MODULAR TAPESTRY','A 24 × 12 TEXTILE GRAMMAR');const ox=92,oy=190,s=50;p.noFill();
  for(let y=0;y<12;y++)for(let x=0;x<24;x++){const k=(x*7+y*11)%5,c=palette[k];p.stroke(c+'88');p.strokeWeight(1.4);p.push();p.translate(ox+x*s,oy+y*s);if((x+y)%3===0){p.arc(0,0,s*.9,s*.9,0,p.PI);p.arc(s,s,s*.9,s*.9,p.PI,p.TWO_PI)}else if((x*y)%4===0){p.line(0,0,s,s);p.line(s,0,0,s);p.circle(s/2,s/2,s*.52)}else{p.bezier(0,s*.5,s*.3,-s*.2,s*.7,s*1.2,s,s*.5)}p.pop()}
}
function swarm(p:p5){
  heading(p,'SWARM CHOREOGRAPHY','LOCAL STEERING / GLOBAL FORM');p.noFill();
  for(let flock=0;flock<5;flock++){p.stroke(palette[flock]+'88');p.strokeWeight(1.8);for(let i=0;i<150;i++){const t=i/149*p.TWO_PI*2.2+flock,rad=80+flock*48+35*Math.sin(i*.23);const x=700+Math.cos(t)*rad*1.6,y=500+Math.sin(t)*rad*.75;p.push();p.translate(x,y);p.rotate(t+p.HALF_PI);p.line(-9,5,0,-9);p.line(0,-9,9,5);p.pop()}}
  p.stroke('#8da9ba55');for(let r=1;r<5;r++)p.ellipse(700,500,r*230,r*110);
}
function interference(p:p5){
  heading(p,'INTERFERENCE ATLAS','FIVE RADIAL SOURCES / PHASE COMPOSITION');const sources=[[300,330],[700,260],[1060,360],[480,690],[920,650]];p.noFill();
  sources.forEach((s,j)=>{for(let r=18;r<360;r+=18){p.stroke(palette[j] + (r%54===0?'88':'33'));p.strokeWeight(r%54===0?1.6:.7);p.circle(s[0],s[1],r*2)}p.noStroke();p.fill(palette[j]);p.circle(s[0],s[1],12);p.noFill()});
}
function maze(p:p5){
  heading(p,'LABYRINTH / DEPTH FIRST','ALGORITHM AS FINISHED WAYFINDING GRAPHIC');const cols=39,rows=21,s=29,ox=130,oy=195;const seen=Array.from({length:rows},()=>Array(cols).fill(false));const walls=Array.from({length:rows},()=>Array.from({length:cols},()=>[true,true,true,true]));const stack:[[number,number]]=[[0,0]];seen[0][0]=true;while(stack.length){const [x,y]=stack[stack.length-1],opts:[[number,number,number,number]]=[] as unknown as [[number,number,number,number]];[[1,0,1,3],[-1,0,3,1],[0,1,2,0],[0,-1,0,2]].forEach(([dx,dy,w,o])=>{const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<cols&&ny<rows&&!seen[ny][nx])opts.push([nx,ny,w,o])});if(!opts.length){stack.pop();continue}const q=opts[(x*17+y*31+stack.length*7)%opts.length];walls[y][x][q[2]]=false;walls[q[1]][q[0]][q[3]]=false;seen[q[1]][q[0]]=true;stack.push([q[0],q[1]])}
  p.strokeWeight(2);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){p.stroke(palette[(x+y)%5]+'99');const X=ox+x*s,Y=oy+y*s;if(walls[y][x][0])p.line(X,Y,X+s,Y);if(walls[y][x][1])p.line(X+s,Y,X+s,Y+s);if(walls[y][x][2])p.line(X,Y+s,X+s,Y+s);if(walls[y][x][3])p.line(X,Y,X,Y+s)}
}
function tiling(p:p5){
  heading(p,'QUASICRYSTAL TILING','ROTATED RHOMBI / FIVE-FOLD ORDER');p.noFill();const size=34;
  for(let ring=0;ring<11;ring++)for(let i=0;i<ring*10+1;i++){const a=i*p.TWO_PI/Math.max(1,ring*10)+ring*.17,r=ring*54,x=700+Math.cos(a)*r,y=510+Math.sin(a)*r;const c=palette[(ring+i)%5];p.push();p.translate(x,y);p.rotate(a+ring*p.PI/5);p.stroke(c+'99');p.strokeWeight(1.5);p.fill(c+'18');p.quad(-size,0,0,-size*.58,size,0,0,size*.58);p.pop()}
}
window.__INTERACTION_COUNT__=0;
