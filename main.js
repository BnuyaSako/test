const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

console.log("Canvas:", canvas);
console.log("Context:", ctx);

// Load image from /sprites/
const image = new Image();
image.src = "sprites/knight_idle.png";
image.onload = () => {
  console.log("Image loaded:", image.width, image.height);
};
image.onerror = (e) => {
  console.error("Image failed to load", e);
};

let idleData = null;
let frame = 0;
let lastTime = 0;

// Load JSON from /sprites/
fetch("sprites/knight_idle.json")
  .then(res => {
    console.log("JSON response status:", res.status);
    if (!res.ok) throw new Error("Failed to load JSON");
    return res.json();
  })
  .then(json => {
    idleData = json;
    console.log("Idle JSON loaded:", idleData);
    console.log("Frames:", idleData.frames);
    if (image.complete) {
      console.log("Image already loaded, starting loop");
      requestAnimationFrame(loop);
    } else {
      console.log("Waiting for image to load before starting loop");
      image.onload = () => {
        console.log("Image loaded (from JSON then):", image.width, image.height);
        requestAnimationFrame(loop);
      };
    }
  })
  .catch(err => {
    console.error("Error loading JSON:", err);
  });

function loop(timestamp) {
  if (!idleData) {
    console.warn("loop called but idleData is null");
    requestAnimationFrame(loop);
    return;
  }

  const FRAME_SIZE = idleData.frameWidth;
  const FPS = idleData.fps;
  const frameDuration = 1000 / FPS;

  if (timestamp - lastTime > frameDuration) {
    frame = (frame + 1) % idleData.totalFrames;
    lastTime = timestamp;
    console.log("Frame:", frame);
  }

  const currentFrame = idleData.frames[frame];
  if (!currentFrame) {
    console.error("No frame data for index", frame);
    return;
  }

  const { x, y } = currentFrame;

  console.log("Drawing frame", frame, "from", x, y, "size", FRAME_SIZE);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dx = (canvas.width - FRAME_SIZE) / 2;
  const dy = (canvas.height - FRAME_SIZE) / 2;

  ctx.drawImage(
    image,
    x, y, FRAME_SIZE, FRAME_SIZE,
    dx, dy, FRAME_SIZE, FRAME_SIZE
  );

  requestAnimationFrame(loop);
}

