const DESIGN_H = 800;
const DESIGN_W = 600;

let branches = [];
let apples = [];
let gravity = 0.2;
let gravityDirection = 1;
let ground = 750;
let topY = 20;
let noisePoints = [];
let scaleFactor;
let t = 0;   

//Segment Class (Tree Branch).
class Segment{
  constructor(x,y,length,angle,level){
    this.x = x;
    this.y = y;
    this.length = length;
    this.angle = angle;
    this.level = level;

    //Different thickness for different branch level.
    if(this.level === 1){
      this.thickness = 15;
    } else if(this.level === 2){
      this.thickness = 10;
    } else if(this.level === 3){
      this.thickness = 7;
    } else{
      this.thickness = 4
    }

    // Small waving animation values.
    this.swayAmp = random(1,3);
    this.swaySpeed = random(0.2, 0.2);
    // Calculate the end point of the branch based on angle.
    this.x2 = this.x + cos(this.angle) * this.length;
    this.y2 = this.y - sin(this.angle) * this.length;
  }

  
  draw(){
    // Set branches' color.
    stroke(0);
    strokeWeight(this.thickness);
    // Small animation using sin() to simulate "wind".
    let sway = sin(frameCount* this.swaySpeed + this.y * 0.05)* this.swayAmp;

    let newX = this.x + cos(this.angle + radians(sway * 0.5)) * this.length;
    let newY = this.y - sin(this.angle + radians(sway * 0.5)) * this.length;

    line(this.x, this.y, newX, newY);
    //let branches silghtly wave.
  }
}
// Apple class(generate, sway, drop)
class Apple {
  constructor(x,y,color){
    this.stratX = x;
    this.stratY = y;
    this.x = x;
    this.y = y;
    this.dropSpeed = 0;
    this.color = color;
    this.state = "waiting";
    this.timer = 0; 
    // Slight left and right swing while apple are hanging.
    this.swayRate = random(1.0, 3.0);    
    this.swaySpeed = random(0.5, 0.3); 
    this.swayPhase = random(0, TWO_PI); 
  }     
  reset(){
    // Reset apple to initial position.
    this.x = this.stratX;
    this.y = this.stratY;
    this.dropSpeed = 0;
    this.state = "waiting";
    this.timer = 0;
    this.swayPhase = random(0, TWO_PI);
  }
  update(){
    if (this.state ==="waiting"){
      // Waiting for 2 seconds before falling.
      this.timer++;
      if(this.timer > 120){
        this.state = "falling";
        this.timer = 0;
      }
    } else if (this.state ==="falling"){
      // Apply gravity.
      this.dropSpeed += gravity * gravityDirection;
      this.y += this.dropSpeed;
    // Hit ground.
    if(gravityDirection === 1 && this.y >= ground){
      this.y = ground;
      this.state = "landed";
      this.dropSpeed = 0;
      this.timer = 0;
    // Hit top(when reversed gravity).
    } else if (gravityDirection === -1 && this.y <=topY){
      this.y = topY;
      this.state = "landed";
      this.dropSpeed = 0;
      this.timer = 0;
    }
  }
      else if (this.state === "landed"){
        // Rest for 2 seconds then return to tree.
        this.timer++;
        if(this.timer > 120){
          this.reset();
        }
      }
    }
  
  draw(){
    stroke(225,225,0);
    fill(this.color[0],this.color[1],this.color[2]);
    
    let drawX = this.x;
    let drawY = this.y;
    // Slight sway when hanging.
    if (this.state === "waiting") {
      const t = frameCount * this.swaySpeed + this.swayPhase;
      drawX += sin(t) * this.swayRate;}

    
      ellipse(drawX, drawY, 40, 40);
  }
}
//Recursive Tree Generator.
function generateTree(x, y, length, angle, level){
  if (length < 40) return;
  
  let branch = new Segment(x, y, length, angle, level);
  branches.push(branch);

  let angleOffset = random(radians(30),radians(90));

  let endX = branch.x2;
  let endY = branch.y2;

  //Random chance to grow an apple on highter level branch.
  if (level >= 3 && random()<0.2){
    let t = random(0.3,0.9);
    let appleX = lerp(branch.x, branch.x2, t);
    let appleY = lerp(branch.y, branch.y2, t);
    let colorChoice = [
      [240,70,70],
      [240,140,60],
      [220,120,120],
      [230,90,140],
      [250,120,90],
      [210,100,150]
    ];
    let c = random(colorChoice);
    apples.push(new Apple(appleX, appleY, c));
  }
   /*The transition from "if(level >= 3)" to "apples.push(new Apple(appleX, appleY, c));"
  is partly obtained by asking ChatGPT, The specific question-and-answer process will be placed in the appendix.*/

  generateTree(endX, endY, length* 0.75, angle + angleOffset, level + 1);
  generateTree(endX, endY, length* 0.75, angle - angleOffset, level + 1);
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  frameRate(60);  
  // Keep 600* 800 proportion across screens.  
  scaleFactor = min(windowWidth/ DESIGN_W, windowHeight/ DESIGN_H);
  // Generate background noise lines.
  for (let i = 0; i < 1000; i++){
    noisePoints.push({
      x: random(-width- 1000, width+ 1000),
      y: random(0, 650),
      c:[random(100,180), random(150,200), random(200,255), random(80,150)]
    });
  }
  // Generate a full recursive tree.
  generateTree(300, 650, 200, PI / 2, 1);
}

// Main draw loop
function draw(){
  //base background
  background(60,80,120);
  
  push();
  scale(scaleFactor);
  translate((width / scaleFactor - DESIGN_W)/ 2, (height/ scaleFactor - DESIGN_H)/2);

  //cloud
  push();
  noStroke();

  let cloudDensity = 1.4;
  let cloudAlpha = 130;
  let ns = 0.006;
  let step = 2;
  for (let y=0;y<DESIGN_H*0.6;y +=step){
    for (let x=0;x<DESIGN_W;x +=step){
      let n =noise(x*ns,y*ns,t*0.04);
      if (n>0.25){
        let fadeLeft = map(x,0,DESIGN_W*0.02,0,1,true);
        let fadeRight = map(x,DESIGN_W*0.98,DESIGN_W,1,0,true);
        let fadeTop = map(y,0,DESIGN_H*0.04,0,1,true);
        let fadeBottom = map(y,DESIGN_H*0.55,DESIGN_H*0.6,1,0,true);
        let fade = fadeLeft*fadeRight*fadeTop*fadeBottom;
        let alpha = cloudAlpha*pow((n-0.25),1.25)*cloudDensity*fade;
        fill(255,255,255,alpha);
        rect(x,y,step,step)

      }
    }
  }
  pop();

  //gold dust
  push();
  noStroke();

  for(let i=0;i<500;i++){
    let x = random(0,DESIGN_W);
    let y = random(0,DESIGN_H*0.5);
    let n = noise(x*0.01,y*0.01);
    if (n>0.55){
      fill(255,230,140,80);
      rect(x,y,2,2);
    }
  }
  pop();

  //wind
  push();
  noFill();
  strokeWeight(1);

  let groupCount = 5;
  let  layersPerGroup = 150;
  
  for (let g=0;g<groupCount;g++){
    let yCenter = map(g,0,groupCount-1,DESIGN_H*0.05,DESIGN_H*0.48);
    let baseShift = g*3000;

    for(let i=0;i<layersPerGroup;i++){
      let offset = i*0.004;
      stroke(255,4);
      function nx(seed){
        return lerp(-DESIGN_W*0.4,DESIGN_W*1.4,
          noise(t*0.6+seed+baseShift)*0.7+noise(t*0.03+seed*2+baseShift*0.5)*0.3);
      } 
      function ny(seed){
        return yCenter+140*(noise(t*0.4+seed)*0.6+noise(t*0.02+seed*1.7+1000)*0.4);
      }
      let x1 = nx(15+offset);
      let x2 = nx(25+offset);
      let x3 = nx(35+offset);
      let x4 = nx(45+offset);
      let y1 = nx(55+offset);
      let y2 = nx(65+offset);
      let y3 = nx(75+offset);
      let y4 = nx(85+offset);
      
      let twist = sin(i*0.06)*25;
      x2 +=twist;
      x3 -=twist;

      bezier(x1, y1, x2, y2, x3, y3, x4, y4);
     }
   }
  t += 0.005;
  pop();

  // Ground.
  fill(40,140,90);
  rect(0,650,600,100);
  stroke(0);
  strokeWeight(5);
  noFill();
  rect(0,650,600,100);
  noStroke();

  //yellow base
  fill(240,210,60);
  stroke(0);
  strokeWeight(10);
  rect(125,625,350,75);
  noStroke();

  //colorfull rects
  const colors = [
    color(240,210,60),
    color(240,70,70),
    color(40,160,100),
    color(240,210,60),
    color(40,160,100),
    color(240,210,60)
  ];
  const startX = 125;
  const startY = 625;
  const boxW = 350 / 6;
  const boxH = 75;

  for (let i = 0; i < 6; i++){
    fill(colors[i]);
    rect(startX + i * boxW, startY, boxW, boxH);
  }
  
  const bottomColors = [
    color(40,160,100),
    color(240,210,60),
    color(240,70,70),
    color(240,70,70),
    color(240,210,60),
    color(40,160,100)
  ];

  for (let i = 0; i < 6; i++){
    let cx = startX + i * boxW + boxW / 2;
    let cy = startY + boxH;
    let r = boxW * 0.9;
    fill(bottomColors[i]);
    arc(cx, cy, r, r, PI, 0);
  }

  const topColors = [
    color(40, 160, 100),
    color(240, 70, 70),
    color(40, 160, 100),
    color(240, 70, 70)
  ];
  const topCenters = [
    startX + boxW * 1.5,
    startX + boxW * 2.5,
    startX + boxW * 3.5,
    startX + boxW * 4.5
  ];
  for (let i = 0; i < 4; i++){
    let cx = topCenters[i];
    let cy = startY;
    let r = (i === 1 || i === 2) ? boxW * 0.7 : boxW * 0.9;
    fill(topColors[i]);
    arc(cx,cy,r,r,0,PI);
  }

  noStroke();
  for (let i = 0; i < 300; i++){
    fill(255,255,255,random(10,40));
    rect(random(125,475),random(625,700), 1, 1);
  }
  // Draw all branches.
  for (let branch of branches ){
    branch.draw(); 
  }
   // Draw and update all apples.
  for (let a of apples){
    a.update();
    a.draw();
  }
  // Display gravity control text.
  noStroke();
  fill(255);
  textSize(25);
  if(gravityDirection === 1){
    text("Press SPACE to change gravity (now ↓ ↓ ↓)",20,785);
  }else{
    text("Press SPACE to change gravity (now ↑ ↑ ↑)",20,785);
  }
    text("- Let Newton be confused ! ! ! -",240,30);
    pop();
}
// Make the canvas size match the screen size.
function fitWidow(){
  resizeCanvas(windowWidth,windowHeight);
  scaleFactor = min(windowWidth / DESIGN_W, windowHeight/ DESIGN_H);
}
// Add keypress to control the direction of gravity.
function keyPressed(){
  if (key === ' '){
    gravityDirection *= -1;
    for (let a of apples){
      a.reset();
    } 
  }
}