export function drawH(ctx, config) {
  var size = config.size || 400;
  var x = config.x || 0;
  var y = config.y || 0;
  var w = config.w || 5;
  var h = config.h || 10;
  var length = size / w;
  // 画之前清空画布
  ctx.clearRect(0, 0, config.width, config.height);
  // 设置画笔属性
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, config.width, config.height);
  ctx.fillStyle = "#333";
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.font = 12;
  for (var i = 0; i < length; i++) {
    var deltaX = i * w;
    ctx.beginPath();
    ctx.moveTo(x + deltaX, y);
    // 每十个刻度需要绘制文字
    if (i != 0 && i % 10 == 0) {
      // 满10刻度时的刻度线要较长
      let srtLength = ctx.measureText(String(deltaX)).width;
      ctx.fillText(deltaX, x + deltaX - srtLength / 2, y - h * 2.5);
      ctx.lineTo(x + deltaX, y - h * 2);
    } else {
      // 满5刻度时的刻度线略长于1刻度的
      ctx.lineTo(x + deltaX, y - (i % 5 === 0 ? 1.5 : 1) * h);
    }
    ctx.moveTo(0, config.height);
    ctx.lineTo(config.size, config.height);
    // 画出路径
    ctx.stroke();
  }
}

export function drawV(ctx, config) {
  var size = config.size || 400;
  var x = config.x || 0;
  var y = config.y || 0;
  var w = config.w || 5;
  var h = config.h || 10;
  var length = size / h;
  // 画之前清空画布
  ctx.clearRect(0, 0, config.width, config.height);
  // 设置画笔属性
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, config.width, config.height);
  ctx.fillStyle = "#333";
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.font = 12;
  for (var i = 0; i < length; i++) {
    var deltaY = i * h;
    ctx.beginPath();
    ctx.moveTo(x, y + deltaY);
    // 每十个刻度需要绘制文字
    if (i % 10 == 0) {
      // 满10刻度时的刻度线要较长
      ctx.fillText(deltaY, 0, y + deltaY - 2);
      ctx.lineTo(x - w * 2, y + deltaY);
    } else {
      // 满5刻度时的刻度线略长于1刻度的
      ctx.lineTo(x - (i % 5 === 0 ? 1.5 : 1) * w, y + deltaY);
    }
    ctx.moveTo(config.width, 0);
    ctx.lineTo(config.width, config.size);
    // 画出路径
    ctx.stroke();
  }
}
