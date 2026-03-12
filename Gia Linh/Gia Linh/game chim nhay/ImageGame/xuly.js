const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* ================= IMAGES ================= */
const birdFrames = [];
for (let i = 1; i <= 4; i++) {
  const img = new Image();
  img.src = "images/b" + i + ".png";
  birdFrames.push(img);
}

const bgImg = new Image();
bgImg.src = "images/background.png";

const pipeImg = new Image();
pipeImg.src = "images/pipes.png";

/* =============== WAIT LOAD =============== */
let loaded = 0;
function checkStart() {
  loaded++;
  if (loaded === 6) gameLoop();
}
birdFrames.forEach(img => img.onload = checkStart);
bgImg.onload = checkStart;
pipeImg.onload = checkStart;

/* ================= GAME ================= */
let bird = { x: 200, y: canvas.height / 2, w: 60, h: 45, vel: 0 };
let gravity = 0.5;
let lift = -10;

let pipes = [];
let gap = 220;
let pipeWidth = 90;

let frame = 0;
let score = 0;
let state = "start";

function spawnPipe() {
  let top = Math.random() * (canvas.height - gap - 200) + 50;
  pipes.push({ x: canvas.width, top, scored: false }); // FIX điểm
}

/* =============== CONTROL =============== */
function flap() {
  if (state === "start") state = "play";
  if (state === "play") bird.vel = lift;
}

window.addEventListener("keydown", e => {
  if (["Enter"," ","ArrowUp","w","W"].includes(e.key)) {
    if (state === "gameover") resetGame();
    else flap();
  }
});

window.addEventListener("mousedown", flap);

/* =============== COLLISION =============== */
function hit(b, p) {
  return (
    b.x + b.w > p.x &&
    b.x < p.x + pipeWidth &&
    (b.y < p.top || b.y + b.h > p.top + gap)
  );
}

/* =============== RESET =============== */
function resetGame() {
  bird.y = canvas.height / 2;
  bird.vel = 0;
  pipes = [];
  score = 0;
  frame = 0;
  state = "start";
}

/* =============== TEXT =============== */
function drawText(text, size, y) {
  ctx.fillStyle = "white";
  ctx.font = `bold ${size}px Segoe UI`;
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, y);
}

/* =============== LOOP =============== */
function gameLoop() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  frame++;
  if (state === "play") {
    bird.vel += gravity;
    bird.y += bird.vel;

    if (frame % 100 === 0) spawnPipe();

    pipes.forEach(p => {
      p.x -= 3;

      // PIPE TOP
      ctx.save();
      ctx.translate(p.x + pipeWidth / 2, p.top);
      ctx.scale(1, -1);
      ctx.drawImage(pipeImg, -pipeWidth / 2, 0, pipeWidth, canvas.height); // FIX lơ lửng
      ctx.restore();

      // PIPE BOTTOM
      ctx.drawImage(pipeImg, p.x, p.top + gap, pipeWidth, canvas.height);

      if (hit(bird, p)) state = "gameover";

      // ⭐ FIX TÍNH ĐIỂM
      if (!p.scored && p.x + pipeWidth < bird.x) {
        score++;
        p.scored = true;
      }
    });

    if (bird.y + bird.h > canvas.height || bird.y < 0)
      state = "gameover";
  }

  // BIRD
  let img = birdFrames[Math.floor(frame / 6) % 4];
  ctx.drawImage(img, bird.x, bird.y, bird.w, bird.h);

  // SCORE UI
  if (state === "play") {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(canvas.width/2 - 80, 20, 160, 70);
    drawText(score, 50, 70);
  }

  if (state === "start") drawText("Nhấn Enter hoặc Click để chơi", 40, canvas.height/2);

  if (state === "gameover") {
    drawText("Baby À ~ You're Loser in the Fighter", 60, canvas.height/2 - 40);
    drawText("Enter để chơi lại", 35, canvas.height/2 + 20);
  }

  requestAnimationFrame(gameLoop);
}
