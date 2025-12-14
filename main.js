const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Which slice of the sheet to play:
let currentStart = 0;      // first frame index in the range
let currentLength = 4;     // how many frames in the range
let currentFps = 8;        // speed

let sheetData = null;
let image = new Image();

let frameIndex = 0;
let lastTime = 0;

fetch("sprites/knight_sheet.json")
  .then(r => r.json())
  .then(json => {
    sheetData = json;
    image.src = "sprites/" + sheetData.image;
    image.onload = () => {
      requestAnimationFrame(loop);
    };
  });

function loop(timestamp) {
  if (!sheetData) {
    requestAnimationFrame(loop);
    return;
  }

  const frameDuration = 1000 / currentFps;
  if (timestamp - lastTime > frameDuration) {
    frameIndex = (frameIndex + 1) % currentLength;
    lastTime = timestamp;
  }

  const absoluteFrame = currentStart + frameIndex;
  const col = absoluteFrame % sheetData.columns;
  const row = Math.floor(absoluteFrame / sheetData.columns);

  const sx = col * sheetData.frameWidth;
  const sy = row * sheetData.frameHeight;
  const sw = sheetData.frameWidth;
  const sh = sheetData.frameHeight;

  const dw = sw;
  const dh = sh;
  const dx = (canvas.width - dw) / 2;
  const dy = (canvas.height - dh) / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

  requestAnimationFrame(loop);
}

// Debug controls: change ranges with keys
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "1":
      // Example: first 4 frames (0,1,2,3)
      currentStart = 0;
      currentLength = 4;
      currentFps = 8;
      frameIndex = 0;
      break;
    case "2":
      // Example: frames 10–13
      currentStart = 10;
      currentLength = 4;
      currentFps = 10;
      frameIndex = 0;
      break;
    case "3":
      // Example: frames 20–23
      currentStart = 20;
      currentLength = 4;
      currentFps = 8;
      frameIndex = 0;
      break;
    case "4":
      // Example: frames 30–33
      currentStart = 30;
      currentLength = 4;
      currentFps = 12;
      frameIndex = 0;
      break;
    // you can add more keys later
  }
});
