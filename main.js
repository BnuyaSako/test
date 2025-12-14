const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Load image from /sprites/
const image = new Image();
image.src = "sprites/knight_idle.png";

let idleData = null;
let frame = 0;
let lastTime = 0;

// Load JSON from /sprites/
fetch("sprites/knight_idle.json")
  .then(res => res.json())
  .then(json => {
    idleData = json;
    image.onload = () => requestAnimationFrame(loop);
  });

function loop(timestamp) {
  if (!idleData) return;

  const FRAME_SIZE = idleData.frameWidth;
  const FPS = idleData.fps;
  const frameDuration = 1000 / FPS;

  if (timestamp - lastTime > frameDuration) {
    frame = (frame + 1) % idleData.totalFrames;
    lastTime = timestamp;
  }

  const { x, y } = idleData.frames[frame];

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Center the frame
  const dx = (canvas.width - FRAME_SIZE) / 2;
  const dy = (canvas.height - FRAME_SIZE) / 2;

  ctx.drawImage(
    image,
    x, y, FRAME_SIZE, FRAME_SIZE,
    dx, dy, FRAME_SIZE, FRAME_SIZE
  );

  requestAnimationFrame(loop);
}

