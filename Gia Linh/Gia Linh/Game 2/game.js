document.body.style.background = "black";
document.body.style.display = "flex";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.height = "100vh";
document.body.style.margin = "0";





const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let lives = 10;
let gameOver = false;

const playerImg = new Image();
playerImg.src = "images/maybayy.png";

const enemyImg = new Image();
enemyImg.src = "images/thienthacc.png";

const player = {
x: canvas.width/2 - 40,
y: canvas.height - 80,
width:80,
height:80,
speed:6
};

let bullets = [];
let enemies = [];
let explosions = [];
let stars = [];
let keys = {};

let restartBtn = {
x: canvas.width/2 - 80,
y: canvas.height/2 + 40,
width:160,
height:50
};

// tạo sao
for(let i=0;i<100;i++){
stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2
});
}

document.addEventListener("keydown",(e)=>{
keys[e.key] = true;

if(e.code === "Space" && !gameOver){
shoot();
}
});

document.addEventListener("keyup",(e)=>{
keys[e.key] = false;
});

canvas.addEventListener("click",function(e){

if(gameOver){

let rect = canvas.getBoundingClientRect();
let mouseX = e.clientX - rect.left;
let mouseY = e.clientY - rect.top;

if(
mouseX > restartBtn.x &&
mouseX < restartBtn.x + restartBtn.width &&
mouseY > restartBtn.y &&
mouseY < restartBtn.y + restartBtn.height
){
restartGame();
}

}

});

function restartGame(){

score = 0;
lives = 10;
gameOver = false;

bullets = [];
enemies = [];
explosions = [];

player.x = canvas.width/2 - 40;

document.getElementById("score").innerText="Điểm: 0";

}

function shoot(){

bullets.push({
x: player.x + player.width/2 -3,
y: player.y,
width:6,
height:15,
speed:8
});

}

function spawnEnemy(){

if(!gameOver){

enemies.push({
x: Math.random()*(canvas.width-60),
y: -60,
width:60,
height:60,
speed:2 + Math.random()*2,
angle:0
});

}

}

setInterval(spawnEnemy,1500);

function update(){

if(gameOver) return;

// WASD
if((keys["a"] || keys["A"]) && player.x > 0){
player.x -= player.speed;
}

if((keys["d"] || keys["D"]) && player.x + player.width < canvas.width){
player.x += player.speed;
}

if((keys["w"] || keys["W"]) && player.y > 0){
player.y -= player.speed;
}

if((keys["s"] || keys["S"]) && player.y + player.height < canvas.height){
player.y += player.speed;
}

// bullets
bullets.forEach((b,i)=>{
b.y -= b.speed;

if(b.y < 0){
bullets.splice(i,1);
}
});

// enemies
enemies.forEach((e,i)=>{

e.y += e.speed;
e.angle += 0.05;

if(e.y > canvas.height){
enemies.splice(i,1);
lives--;

if(lives <= 0){
gameOver = true;
}
}

});

checkCollision();

}

function checkCollision(){

enemies.forEach((e,ei)=>{

bullets.forEach((b,bi)=>{

if(
b.x < e.x + e.width &&
b.x + b.width > e.x &&
b.y < e.y + e.height &&
b.y + b.height > e.y
){

explosions.push({x:e.x+30,y:e.y+30,r:10});

enemies.splice(ei,1);
bullets.splice(bi,1);

score++;
document.getElementById("score").innerText="Điểm: "+score;

}

});

});

}

function drawStars(){

ctx.fillStyle="white";

stars.forEach(s=>{

ctx.fillRect(s.x,s.y,s.size,s.size);

s.y+=0.5;

if(s.y>canvas.height){
s.y=0;
s.x=Math.random()*canvas.width;
}

});

}

function draw(){

ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);

// viền neon phát sáng
let gradient = ctx.createLinearGradient(0,0,canvas.width,0);
gradient.addColorStop(0,"cyan");
gradient.addColorStop(0.5,"blue");
gradient.addColorStop(1,"purple");

ctx.lineWidth = 6;
ctx.strokeStyle = gradient;

ctx.shadowBlur = 25;
ctx.shadowColor = "cyan";

ctx.strokeRect(0,0,canvas.width,canvas.height);

ctx.shadowBlur = 0;

// enemies
enemies.forEach(e=>{

ctx.save();
ctx.translate(e.x+30,e.y+30);
ctx.rotate(e.angle);
ctx.drawImage(enemyImg,-30,-30,60,60);
ctx.restore();
drawStars();

});

// bullets
bullets.forEach(b=>{
ctx.shadowBlur=10;
ctx.shadowColor="yellow";
ctx.fillStyle="yellow";
ctx.fillRect(b.x,b.y,b.width,b.height);
ctx.shadowBlur=0;
});

// explosions
explosions.forEach((ex,i)=>{

ctx.fillStyle="orange";
ctx.beginPath();
ctx.arc(ex.x,ex.y,ex.r,0,Math.PI*2);
ctx.fill();

ex.r+=2;

if(ex.r>30){
explosions.splice(i,1);
}

});

// player
ctx.drawImage(playerImg,player.x,player.y,player.width,player.height);

// hearts
ctx.font = "25px Arial";
ctx.fillStyle = "red";

for(let i=0;i<lives;i++){
ctx.fillText("❤",10 + i*25,30);
}

// game over
if(gameOver){

ctx.fillStyle="red";
ctx.font="60px Arial";
ctx.textAlign="center";
ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2);

ctx.fillStyle="black";
ctx.fillRect(restartBtn.x,restartBtn.y,restartBtn.width,restartBtn.height);

ctx.fillStyle="white";
ctx.font="25px Arial";
ctx.fillText("CHƠI LẠI",canvas.width/2,restartBtn.y+32);

}

}

function gameLoop(){

update();
draw();

requestAnimationFrame(gameLoop);

}

gameLoop();