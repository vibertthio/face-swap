let video;
let poseNet;
let poses = [];
let playing = false;
let playBtn = document.getElementById("play-btn");

let eyeIndex = 0
let noseIndex = 0
let mouthIndex = 0
let earIndex = 0
let images = {
  eyes: [],
  noses: [],
  mouths: [],
  ears: [],
};

playBtn.addEventListener("click", () => {
  if (ready) {
    playBtn.style.display = "none";
    playing = true;
  }
});
eyeButton.addEventListener('click', () => {
  eyeIndex = (eyeIndex + 1) % 4
})
mouthButton.addEventListener('click', () => {
  mouthIndex = (mouthIndex + 1) % 4
})
noseButton.addEventListener('click', () => {
  noseIndex = (noseIndex + 1) % 4
})
function preload() {
  for (let i = 0; i < 4; i++) {
    images.eyes[i] = loadImage(`./assets/eye-${i}.png`);
    images.mouths[i] = loadImage(`./assets/mouth-${i}.png`);
    images.ears[i] = loadImage(`./assets/ear-${i}.png`);
    images.noses[i] = loadImage(`./assets/nose-${i}.png`);
  }
}

function setup() {
  const canvas = createCanvas(640, 480);
  canvas.parent("p5-canvas");

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  imageMode(CENTER);

  poseNet = ml5.poseNet(video, () => {
    modelReady = true;
    playBtn.innerHTML = "play";
    ready = true;
  });
  poseNet.on("pose", results => {
    poses = results;
  });
}

function draw() {
  translate(width, 0);
  scale(-1, 1);
  // image(video, width * 0.5, height * 0.5, width, height);
  // filter(INVERT);

  background(255)

  if (playing) {
    drawKeypoints()
  } else {
    fill(250, 250, 250);
    rect(-1, -1, width + 2, height + 2);
  }
}

function drawKeypoints()  {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;

    const eyeX = (pose.leftEye.x + pose.rightEye.x) * 0.5
    const eyeY = (pose.leftEye.y + pose.rightEye.y) * 0.5
    const eyeW = sqrt(pow(pose.rightEye.y - pose.leftEye.y, 2) + pow(pose.rightEye.x - pose.leftEye.x, 2)) * 1.8
    const eyeH = eyeW * images.eyes[eyeIndex].height / images.eyes[eyeIndex].width
    const eyeAngle = atan2(pose.rightEye.y - pose.leftEye.y, pose.rightEye.x - pose.leftEye.x) + PI

    const noseW = eyeW * 0.4
    const noseH = noseW * images.noses[noseIndex].height / images.noses[noseIndex].width

    const mouthW = noseW * 1.4
    const mouthH = mouthW * images.mouths[mouthIndex].height / images.mouths[mouthIndex].width
    
    push()
    translate(eyeX, eyeY)
    rotate(eyeAngle)
    image(images.eyes[eyeIndex], 0, 0, eyeW, eyeH)
    pop()
    
    push()
    translate(pose.nose.x, pose.nose.y)
    rotate(eyeAngle)
    image(images.noses[noseIndex], 0, 0, noseW, noseH)
    image(images.mouths[mouthIndex], 0, noseH * 1.1, mouthW, mouthH)
    pop()
    
  }
}
