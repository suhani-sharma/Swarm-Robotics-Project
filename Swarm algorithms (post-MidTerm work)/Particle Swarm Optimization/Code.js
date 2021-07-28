let numrows=100,numcols=100;
let canvasSize=600;
let width=canvasSize/numrows;
let grid=[];
let numbots=10;
let Victim=[];
let Bots=[];
let personalBest=[];
let globalBest=10000000000;
let personalBestPos=[];
let globalBestPos=[];
let velocity=[];
// function square(x){
//   return x*x;
// }
function fitness(a,b,c,d){
  return (a-c)*(a-c)+(b-d)*(b-d);
}
function setup() {
  Victim=[];
  createCanvas(canvasSize,canvasSize);
  for(let i=0;i<numrows;i++){
    grid[i]=[];
    for(let j=0;j<numcols;j++){
      grid[i][j]=0;
      rect(width*i,width*j,width,width);
    }
  }
  let x=(random(0,1)*canvasSize);
  let y=(random(0,1)*canvasSize);
  Victim[0]=x;
  Victim[1]=y;
 
  fill(0,255,0);
  rect(width*int(x/width),width*int(y/width),width,width);
  for(let i=0;i<numbots;i++){
    Bots[i]=[];
    personalBestPos[i]=[];
    velocity[i]=[];
    let x=(random(0,canvasSize/4));
    let y=(random(0,canvasSize));
    let p=int(x/width);
    let q=int(y/width);
    Bots[i][0]=x;
    Bots[i][1]=y;
    grid[p][q]=1;
    x=(random(-width,width));
    y=(random(-width,width));
    velocity[i][0]=x;
    velocity[i][1]=y;
     // console.log(Victim[0]);
     // console.log(Victim[1]);
     // console.log(Bots[i][0]);
     // console.log(Bots[i][1]);
    personalBest[i]=fitness(Victim[0],Victim[1],Bots[i][0],Bots[i][1]);
    personalBestPos[i][0]=Bots[i][0];
    personalBestPos[i][1]=Bots[i][1];
    if(personalBest[i]<globalBest){
      globalBest=personalBest[i];
      globalBestPos[0]=personalBestPos[i][0];
      globalBestPos[1]=personalBestPos[i][1];
    }
    
    fill(255,0,0);
    rect(width*p,width*q,width,width);
  }
  
}

function draw() {
  // background(220);
  let w=0.6,c1=2,c2=2;
  let r1=random(0,1),r2=random(0,1);
  for(let i=0;i<numbots;i++){
    fill(255,255,0);
  rect(width*int(Bots[i][0]/width),width*int(Bots[i][1]/width),width,width);
    for(let j=0;j<2;j++){
        velocity[i][j]=w*velocity[i][j]+r1*c1*(personalBestPos[i][j]-Bots[i][j])+r2*c2*(globalBestPos[j]-Bots[i][j]);
        
        
      }
    let threshold=velocity[i][0]/(velocity[i][0]+velocity[i][1]);
    let decider=random(0,1);
    let k=(decider<threshold);
    for(let j=0;j<2;j++)
    {
      velocity[i][j]=min(velocity[i][j],width);
        velocity[i][j]=max(velocity[i][j],-width);
        if(j==k)
        Bots[i][j]=Bots[i][j]+velocity[i][j];
        Bots[i][j]=max(Bots[i][j],0);
        Bots[i][j]=min(Bots[i][j],canvasSize);
    }
    let count=0;
        for(let k=0;k<numbots;k++){
          if(int(Bots[k][0]/width)==int((Bots[i][0])/width)&&int(Bots[k][1]/width)==int((Bots[i][1])/width)) count++;
        }
        if(count!=1){
            if(k==0)
            Bots[i][0]-=velocity[i][0];
            else Bots[i][1]-=velocity[i][1];
            // continue;
        }
    let f=fitness(Victim[0],Victim[1],Bots[i][0],Bots[i][1]);
    if(f<personalBest[i]){
      personalBest[i]=f;
      personalBestPos[i][0]=Bots[i][0];
      personalBestPos[i][1]=Bots[i][1];
      if(f<globalBest){
        globalBest=f;
        globalBestPos[0]=Bots[i][0];
        globalBestPos[1]=Bots[i][1];
      }  
    }
    if(int(Bots[i][0]/width)==int(Victim[0]/width)&&int(Victim[1]/width)==int(Bots[i][1]/width)){
      fill(0,0,255);
  rect(width*int(Bots[i][0]/width),width*int(Bots[i][1]/width),width,width);
      print("SEARCHED SUCCESSFULLY");
      noLoop();
    }
   else{ fill(255,0,0);
  rect(width*int(Bots[i][0]/width),width*int(Bots[i][1]/width),width,width);
  }
  }
  print(Victim[0],Victim[1]);
  print(globalBest);
  frameRate(30);
}
