// 宣告停止動畫圖片陣列
let stopImages = [];

// 宣告行走動畫圖片陣列
let walkImages = [];

// 宣告跳躍動畫圖片陣列
let jumpImages = [];

// 宣告魔法動畫圖片陣列
let magicImages = [];

// 宣告目前播放的動畫類型
let currentAction = "stop";

// 宣告目前播放的圖片索引
let currentFrame = 0;

// 宣告角色的水平座標
let characterX;

// 宣告角色的垂直座標
let characterY;

// 宣告角色站立時的地面座標
let groundY;

// 宣告角色面向的方向
let characterDirection = 1;

// 宣告角色的移動速度
let moveSpeed;

// 宣告角色顯示寬度
let characterWidth;

// 宣告角色顯示高度
let characterHeight;

// 宣告跳躍時的垂直速度
let jumpVelocity = 0;

// 宣告重力大小
let gravity;

// 宣告角色是否正在跳躍
let isJumping = false;

// 宣告一般動畫播放速度
let animationSpeed = 10;

// 宣告跳躍上升時的播放速度
let jumpUpSpeed = 8;

// 宣告跳躍下降時的播放速度
let jumpDownSpeed = 20;

// 宣告上一次切換圖片的時間
let lastAnimationTime = 0;

// 預先載入所有角色圖片
function preload() {
  // 載入停止動畫的六張圖片
  for (let i = 0; i < 6; i++) {
    stopImages[i] = loadImage(`1/stop/${i}.png`);
  }

  // 載入行走動畫的八張圖片
  for (let i = 0; i < 8; i++) {
    walkImages[i] = loadImage(`1/walk/${i}.png`);
  }

  // 載入跳躍動畫的十二張圖片
  for (let i = 0; i < 12; i++) {
    jumpImages[i] = loadImage(`1/jump/${i}.png`);
  }

  // 載入魔法動畫的十七張圖片
  for (let i = 0; i < 17; i++) {
    magicImages[i] = loadImage(`1/magic1/${i}.png`);
  }
}

// 建立全螢幕畫布並設定初始資料
function setup() {
  // 建立符合視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 設定圖片以中心點為繪製基準
  imageMode(CENTER);

  // 關閉圖片平滑處理以保留像素風格
  noSmooth();

  // 根據視窗大小調整角色尺寸
  updateCharacterSize();

  // 將地面設定在螢幕下方
  groundY = height - characterHeight / 2;

  // 將角色放在螢幕下方中央
  characterX = width / 2;
  characterY = groundY;

  // 設定動畫播放幀率
  frameRate(60);
}

// 每一幀執行一次繪圖
function draw() {
  // 使用指定背景顏色填滿畫布
  background("#3e5c76");

  // 更新動畫播放進度
  updateAnimation();

  // 更新角色位置
  updateCharacterPosition();

  // 取得目前要顯示的角色圖片
  const currentImage = getCurrentImage();

  // 確認圖片存在且已載入完成
  if (currentImage && currentImage.width > 0) {
    // 儲存目前繪圖狀態
    push();

    // 移動到角色所在位置
    translate(characterX, characterY);

    // 依照角色面向進行水平翻轉
    scale(characterDirection, 1);

    // 繪製角色圖片
    image(
      currentImage,
      0,
      0,
      characterWidth,
      characterHeight
    );

    // 還原繪圖狀態
    pop();
  }
}

// 取得目前動畫的圖片
function getCurrentImage() {
  // 判斷目前是否為停止動畫
  if (currentAction === "stop") {
    // 回傳停止動畫圖片
    return stopImages[currentFrame];
  }

  // 判斷目前是否為行走動畫
  if (currentAction === "walk") {
    // 回傳行走動畫圖片
    return walkImages[currentFrame];
  }

  // 判斷目前是否為跳躍動畫
  if (currentAction === "jump") {
    // 回傳跳躍動畫圖片
    return jumpImages[currentFrame];
  }

  // 判斷目前是否為魔法動畫
  if (currentAction === "magic") {
    // 回傳魔法動畫圖片
    return magicImages[currentFrame];
  }

  // 沒有符合動畫類型時回傳空值
  return null;
}

// 取得目前動畫的圖片總數
function getAnimationLength() {
  // 回傳停止動畫的圖片數量
  if (currentAction === "stop") {
    return stopImages.length;
  }

  // 回傳行走動畫的圖片數量
  if (currentAction === "walk") {
    return walkImages.length;
  }

  // 回傳跳躍動畫的圖片數量
  if (currentAction === "jump") {
    return jumpImages.length;
  }

  // 回傳魔法動畫的圖片數量
  if (currentAction === "magic") {
    return magicImages.length;
  }

  // 預設回傳一張圖片
  return 1;
}

// 更新動畫播放進度
function updateAnimation() {
  // 取得目前時間
  const currentTime = millis();

  // 計算距離上一次換圖經過的時間
  const elapsedTime = currentTime - lastAnimationTime;

  // 預設使用一般動畫播放速度
  let currentAnimationSpeed = animationSpeed;

  // 判斷目前是否為跳躍動畫
  if (currentAction === "jump") {
    // 角色往上移動時使用上升播放速度
    if (jumpVelocity < 0) {
      currentAnimationSpeed = jumpUpSpeed;
    }

    // 角色往下移動時使用下降播放速度
    if (jumpVelocity >= 0) {
      currentAnimationSpeed = jumpDownSpeed;
    }
  }

  // 計算每張圖片的播放時間
  const frameDuration = 1000 / currentAnimationSpeed;

  // 尚未達到換圖時間時不切換圖片
  if (elapsedTime < frameDuration) {
    return;
  }

  // 記錄本次換圖時間
  lastAnimationTime = currentTime;

  // 取得目前動畫的圖片總數
  const totalFrames = getAnimationLength();

  // 切換到下一張圖片
  currentFrame++;

  // 判斷跳躍動畫是否已經播放到最後一張
  if (currentAction === "jump" && currentFrame >= totalFrames) {
    // 將圖片固定在跳躍動畫最後一張
    currentFrame = totalFrames - 1;

    // 角色落地後切換回停止動畫
    if (!isJumping) {
      // 設定為停止動畫
      currentAction = "stop";

      // 從停止動畫第一張開始播放
      currentFrame = 0;
    }

    // 結束本次函式
    return;
  }

  // 判斷魔法動畫是否播放完畢
  if (currentAction === "magic" && currentFrame >= totalFrames) {
    // 切換回停止動畫
    currentAction = "stop";

    // 從停止動畫第一張開始播放
    currentFrame = 0;

    // 結束本次函式
    return;
  }

  // 讓停止動畫與行走動畫循環播放
  if (
    currentAction === "stop" ||
    currentAction === "walk"
  ) {
    // 播放到最後一張後回到第一張
    if (currentFrame >= totalFrames) {
      currentFrame = 0;
    }
  }
}

// 更新角色位置與跳躍物理效果
function updateCharacterPosition() {
  // 判斷角色是否正在跳躍
  if (isJumping) {
    // 根據垂直速度更新角色高度
    characterY += jumpVelocity;

    // 套用重力讓角色逐漸下降
    jumpVelocity += gravity;

    // 判斷角色是否回到地面
    if (characterY >= groundY) {
      // 將角色固定在螢幕下方
      characterY = groundY;

      // 結束跳躍狀態
      isJumping = false;

      // 重設跳躍速度
      jumpVelocity = 0;

      // 跳躍動畫播放完畢後回到停止動畫
      if (currentFrame >= jumpImages.length - 1) {
        // 切換回停止動畫
        currentAction = "stop";

        // 從停止動畫第一張開始播放
        currentFrame = 0;
      }
    }
  }

  // 判斷右方向鍵是否被按住
  if (keyIsDown(RIGHT_ARROW)) {
    // 角色向右移動
    characterX += moveSpeed;

    // 設定角色面向右方
    characterDirection = 1;

    // 沒有跳躍或魔法時播放行走動畫
    if (!isJumping && currentAction !== "magic") {
      // 設定為行走動畫
      currentAction = "walk";
    }
  }

  // 判斷左方向鍵是否被按住
  if (keyIsDown(LEFT_ARROW)) {
    // 角色向左移動
    characterX -= moveSpeed;

    // 設定角色面向左方
    characterDirection = -1;

    // 沒有跳躍或魔法時播放行走動畫
    if (!isJumping && currentAction !== "magic") {
      // 設定為行走動畫
      currentAction = "walk";
    }
  }

  // 限制角色不超出畫布左右邊界
  characterX = constrain(
    characterX,
    characterWidth / 2,
    width - characterWidth / 2
  );
}

// 開始跳躍動作
function startJump() {
  // 角色正在跳躍時不重複跳躍
  if (isJumping) {
    return;
  }

  // 設定角色進入跳躍狀態
  isJumping = true;

  // 設定跳躍初速度
  jumpVelocity = -height * 0.05;

  // 設定目前動畫為跳躍動畫
  currentAction = "jump";

  // 從跳躍動畫第一張開始播放
  currentFrame = 0;

  // 記錄動畫開始時間
  lastAnimationTime = millis();
}

// 監聽鍵盤按下事件
function keyPressed() {
  // 判斷是否按下右方向鍵
  if (keyCode === RIGHT_ARROW) {
    // 設定角色面向右方
    characterDirection = 1;

    // 沒有跳躍或魔法時播放行走動畫
    if (!isJumping && currentAction !== "magic") {
      // 設定目前動畫為行走
      currentAction = "walk";

      // 從行走動畫第一張開始播放
      currentFrame = 0;
    }

    // 阻止瀏覽器預設捲動行為
    return false;
  }

  // 判斷是否按下左方向鍵
  if (keyCode === LEFT_ARROW) {
    // 設定角色面向左方
    characterDirection = -1;

    // 沒有跳躍或魔法時播放行走動畫
    if (!isJumping && currentAction !== "magic") {
      // 設定目前動畫為行走
      currentAction = "walk";

      // 從行走動畫第一張開始播放
      currentFrame = 0;
    }

    // 阻止瀏覽器預設捲動行為
    return false;
  }

  // 判斷是否按下上方向鍵
  if (keyCode === UP_ARROW) {
    // 開始跳躍
    startJump();

    // 阻止瀏覽器預設捲動行為
    return false;
  }

  // 判斷是否按下空白鍵
  if (key === " ") {
    // 角色沒有跳躍時才播放魔法動畫
    if (!isJumping) {
      // 設定目前動畫為魔法
      currentAction = "magic";

      // 從魔法動畫第一張開始播放
      currentFrame = 0;

      // 記錄動畫開始時間
      lastAnimationTime = millis();
    }

    // 阻止瀏覽器預設捲動行為
    return false;
  }
}

// 監聽鍵盤放開事件
function keyReleased() {
  // 判斷是否放開左右方向鍵
  if (
    keyCode === LEFT_ARROW ||
    keyCode === RIGHT_ARROW
  ) {
    // 確認左右方向鍵都沒有被按住
    if (
      !keyIsDown(LEFT_ARROW) &&
      !keyIsDown(RIGHT_ARROW) &&
      !isJumping &&
      currentAction !== "magic"
    ) {
      // 切換回停止動畫
      currentAction = "stop";

      // 從停止動畫第一張開始播放
      currentFrame = 0;
    }
  }

  // 阻止瀏覽器預設行為
  return false;
}

// 當瀏覽器視窗大小改變時執行
function windowResized() {
  // 重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算角色尺寸
  updateCharacterSize();

  // 將地面設定在螢幕下方
  groundY = height - characterHeight / 2;

  // 角色沒有跳躍時固定在地面
  if (!isJumping) {
    characterY = groundY;
  }

  // 限制角色不超出畫布左右邊界
  characterX = constrain(
    characterX,
    characterWidth / 2,
    width - characterWidth / 2
  );
}

// 根據視窗大小調整角色尺寸與移動速度
function updateCharacterSize() {
  // 取得視窗較短的邊長
  const shortestSide = min(width, height);

  // 根據視窗大小設定角色寬度
  characterWidth = constrain(
    shortestSide * 0.28,
    100,
    360
  );

  // 確認停止動畫第一張圖片已經載入
  if (stopImages[0] && stopImages[0].width > 0) {
    // 按照圖片原始比例計算角色高度
    characterHeight =
      characterWidth *
      (stopImages[0].height / stopImages[0].width);
  } else {
    // 圖片尚未載入時使用正方形比例
    characterHeight = characterWidth;
  }

  // 根據視窗大小設定角色移動速度
  moveSpeed = max(2, shortestSide * 0.012);

  // 根據視窗大小設定重力大小
  gravity = max(0.4, shortestSide * 0.003);
}