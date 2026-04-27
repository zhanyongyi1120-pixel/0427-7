let video;
let handPose;
let hands = [];

function preload() {
  // 初始化模型
  handPose = ml5.handPose({ flipped: true }, () => {
    console.log("模型載入成功！");
  });
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 設定影片解析度
  video = createCapture(VIDEO, { flipped: true });
  video.size(640, 480);
  video.hide();

  // 確保偵測有啟動
  handPose.detectStart(video, gotHands);
}

function draw() {
  background('#e7c6ff');

  // 計算 50% 畫面大小
  let displayW = windowWidth * 0.5;
  let displayH = (displayW / video.width) * video.height; 
  let xOffset = (windowWidth - displayW) / 2;
  let yOffset = (windowHeight - displayH) / 2;

  image(video, xOffset, yOffset, displayW, displayH);

  // 檢查是否有偵測到資料
  if (hands && hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        for (let keypoint of hand.keypoints) {
          
          // 判斷左右手顏色
          if (hand.handedness === "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }
          
          noStroke();
          
          // 座標映射
          let drawX = map(keypoint.x, 0, video.width, xOffset, xOffset + displayW);
          let drawY = map(keypoint.y, 0, video.height, yOffset, yOffset + displayH);
          
          circle(drawX, drawY, 12);
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}