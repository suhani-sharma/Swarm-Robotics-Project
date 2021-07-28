let canvas_size=500;
let numrows=50;
let numcol=50;
let width=canvas_size/numrows;
let Bot=[];
let numBots=10;
let Goal=[];
let numgoals;
let vel=[];//velocity of bots 
let pot=[]; //potential of each cell
let numVisited=numBots;//stores number of visited cells
let flag=0;    //flag
let numObs;
let Obs=[];


function velCalc(a,b){
  let updatedVel=[1000000000,10000000000];
  let VEL2=[];//vector storing velocity towards possible cells with minimum distance
  for(let i=0;i<numrows;i++){
    for(let j=0;j<numcol;j++){
        if(pot[i][j]==-1&&abs(updatedVel[0])+abs(updatedVel[1])>abs(i-int(a/width))+abs(j-int(b/width))){
          VEL2=[]; 
          updatedVel[0]=i-int(a/width);
           updatedVel[1]=j-int(b/width);
           VEL2[0]=[];
           VEL2[0][0]=updatedVel[0];
           VEL2[0][1]=updatedVel[1];
        }
      else if(pot[i][j]==-1&&abs(updatedVel[0])+abs(updatedVel[1])==abs(i-int(a/width))+abs(j-int(b/width))){
        VEL2.push([updatedVel[0],updatedVel[1]]);
      }
    }
  } 
  if(VEL2.length==0) return [0,0];
  let x=int(random(0,VEL2.length));
  
  return [VEL2[x][0]*width,VEL2[x][1]*width];
}
function setup() {
  createCanvas(canvas_size,canvas_size);
  
  
  // i stands for Rows , j stands for column
  for(let i=0;i<numrows;i++){
    pot[i]=[];
    for(let j=0;j<numcol;j++){
      pot[i][j]=-1; //initially every cell has potential -1
      rect(width*i,width*j,width,width);
    }
  
  }
  numObs=int(random(7,13));
  for(let i=0;i<numObs;i++){
    //Any Random position of each Obstacle in grid
    x=int(random(2,5));
    y=int(random(2,5));
    Obs[i]=[];
    Obs[i][0]=int(random(30,canvas_size-60));
    Obs[i][1]=int(random(30,canvas_size-60));
    pot[int(Obs[i][0]/width)][int(Obs[i][1]/width)]=10000;
    fill(0,0,0);
    //random size of obstacle
    rect(width*int(Obs[i][0]/width),width*int(Obs[i][1]/width),width*x,width*y);
    for(let j=0;j<x;j++){
      for(let k=0;k<y;k++){
        pot[int((Obs[i][0]/width)+j)][int((Obs[i][1]/width)+k)]=10000;
      }
    }
  }
  numgoals=int(random(3,7));
  let i=0;
  while(i<numgoals){
    //Any Random position of each Goal in grid
    x=int(random(0,canvas_size));
    y=int(random(0,canvas_size));
    //for Goal colored with Blue
    if(pot[(int)(x/width)][(int)(y/width)]==10000){
      continue;
    }
    else {
    Goal[i]=[];
    Goal[i][0]=x;
    Goal[i][1]=y;
    Goal[i][2]=0; //kind of flag
      i++;
    fill(0,0,255);
    rect(width*int(x/width),width*int(y/width),width,width);
    }
  }
  

  /* For Bots, Bot[i][0]->Indicate x-coordinate of ith Bot
Bot[i][1]->Indicate y-coordinate of jth Bot*/
  i=0;
  while(i<numBots){
  //Assigning Random Position to Bots , colored with Green/
    x=int(random(0,canvas_size));
    y=int(random(0,canvas_size));
    if(pot[(int)(x/width)][(int)(y/width)]==10000){
      continue;
    }
    else{
    Bot[i]=[];
    vel[i]=[];
    vel[i][0]=0;//taking initial velocity as zero
    vel[i][1]=0;// taking initial velocity as zero
    Bot[i][0]=x;
    Bot[i][1]=y;
    pot[int(Bot[i][0]/width)][int(Bot[i][1]/width)]=0;
    fill(0,255,0);
rect(width*int(Bot[i][0]/width),width*int(Bot[i][1]/width),width,width);
      i++;
    }
  }
  
}
function mouseDragged() {
  pot[int(mouseX/width)][int(mouseY/width)] = 10000;
  // set high potential on obstacles
  
  fill(0,0,0);    //fill black color in obstacle cell
  rect(width*int(mouseX/width),width*int(mouseY/width), width, width);
  // prevent default
  return false;
}

function draw(){
  if(keyIsPressed==true){
    flag=1;
  }
  if(flag){
  for(let i=0;i<numBots;i++){
    fill(150,150,150);
    rect(width*int(Bot[i][0]/width),width*int(Bot[i][1]/width),width,width);
    newVel=velCalc(Bot[i][0],Bot[i][1]);//calculating the new velocity
    
     if(abs(newVel[0])>abs(newVel[1])){
       velx=min(width,newVel[0]);
      velx=max(-width,velx);
      let f=0;
      for(let k=0;k<numBots;k++){
        if(i!=k&&int((Bot[i][0]+velx)/width)==int(Bot[k][0]/width)&&int(Bot[i][1]/width)==int(Bot[k][1]/width)){
             f=1;
             break;
           }
      }
     //check if there is an obstacle ahead
      if(f==0&&pot[int((Bot[i][0]+velx)/width)][int((Bot[i][1])/width)]==10000){
        if(pot[int(Bot[i][0]/width)+1][int(Bot[i][1]/width)]!=10000) Bot[i][0]=Bot[i][0]+width;
        else if(pot[int(Bot[i][0]/width)-1][int(Bot[i][1]/width)]!=10000) Bot[i][0]=Bot[i][0]-width;
        else if(pot[int(Bot[i][0]/width)][int(Bot[i][1]/width)+1]!=10000) Bot[i][1]=Bot[i][1]+width;
        else Bot[i][1]=Bot[i][1]-width;
      }
    
      else if(f==0){
        Bot[i][0]=Bot[i][0]+velx;}
    }
    else{
      vely=min(width,newVel[1]);
      vely=max(-width,vely);
      
      let f=0;
      for(let k=0;k<numBots;k++){
        if(i!=k&&int((Bot[i][1]+vely)/width)==int(Bot[k][1]/width)&&int(Bot[i][0]/width)==int(Bot[k][0]/width)){
             f=1;
             break;
           }
      }
      //check if there is an obstacle ahead
      if(f==0&&pot[int((Bot[i][0])/width)][int((Bot[i][1]+vely)/width)]==10000){
        if(pot[int(Bot[i][0]/width)][int(Bot[i][1]/width)-1]!=10000) Bot[i][1]=Bot[i][1]-width;
        else if(pot[int(Bot[i][0]/width)][int(Bot[i][1]/width)+1]!=10000) Bot[i][1]=Bot[i][1]+width;
        else if(pot[int(Bot[i][0]/width)+1][int(Bot[i][1]/width)]!=10000) Bot[i][0]=Bot[i][1]+width;
        else Bot[i][0]=Bot[i][0]-width;
      }
      
      else if(f==0){
        Bot[i][1]=Bot[i][1]+vely;}
    }
    
    fill(0,255,0);
    pot[int(Bot[i][0]/width)][int(Bot[i][1]/width)]=0;
    numVisited+=1;
    rect(width*int(Bot[i][0]/width),width*int(Bot[i][1]/width),width,width);
    
    //for printing the coordinates of each goal
    for(var p=0;p<numgoals;p++){
      if(int(Bot[i][0]/width)==int(Goal[p][0]/width)&&int(Bot[i][1]/width)==int(Goal[p][1]/width)){
      if(Goal[p][2]==0) console.log('Goal found at: '+int(Bot[i][0]/width)+', '+int(Bot[i][1]/width));
        
      Goal[p][2]=-1; 
      }
    }
    
  }
  frameRate(20);}
}
