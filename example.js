let painting = false;
let startPoint = { x: undefined, y: undefined };
let strokeColor = 'black';
let currentTool = 'draw-free';
let circleStart = { x: undefined, y: undefined };
let lineStart = { x: undefined, y: undefined }; // 画直线的起点
let isLineStartRecorded = false; // 标记是否已记录直线起点

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

document.getElementById('color-red').onclick = () => {
    strokeColor = 'red';
};
document.getElementById('color-blue').onclick = () => {
    strokeColor = 'blue';
};
document.getElementById('color-black').onclick = () => {
    strokeColor = 'black';
};

document.getElementById('draw-free').onclick = () => {
    currentTool = 'draw-free';
    document.getElementById('draw-free').classList.add('active');
    document.getElementById('draw-circle').classList.remove('active');
    document.getElementById('draw-line').classList.remove('active'); // 新增：移除画直线的激活样式
    isLineStartRecorded = false;
};
document.getElementById('draw-circle').onclick = () => {
    currentTool = 'draw-circle';
    document.getElementById('draw-circle').classList.add('active');
    document.getElementById('draw-free').classList.remove('active');
    document.getElementById('draw-line').classList.remove('active'); // 新增：移除画直线的激活样式
    isLineStartRecorded = false;
};
document.getElementById('draw-line').onclick = () => {
    currentTool = 'draw-line';
    document.getElementById('draw-line').classList.add('active');
    document.getElementById('draw-free').classList.remove('active');
    document.getElementById('draw-circle').classList.remove('active');
    isLineStartRecorded = false;
};

canvas.onmousedown = (e) => {
    let x = e.offsetX;
    let y = e.offsetY;
    if (currentTool === 'draw-free') {
        startPoint = { x, y };
        painting = true;
    } else if (currentTool === 'draw-circle') {
        circleStart = { x, y };
    } else if (currentTool === 'draw-line') { // 画直线逻辑
        if (!isLineStartRecorded) {
            lineStart = { x, y };
            isLineStartRecorded = true;
        } else {
            drawLine(lineStart.x, lineStart.y, x, y);
            isLineStartRecorded = false;
        }
    }
};

canvas.onmousemove = (e) => {
    let x = e.offsetX;
    let y = e.offsetY;
    let newPoint = { x: x, y: y };
    if (painting && currentTool === 'draw-free') {
        drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y);
        startPoint = newPoint;
    }
};

canvas.onmouseout = () => {
    painting = false;
};

canvas.onmouseup = (e) => {
    painting = false;
    if (currentTool === 'draw-circle' && circleStart.x !== undefined) {
        const radius = Math.sqrt(
            Math.pow(e.offsetX - circleStart.x, 2) + 
            Math.pow(e.offsetY - circleStart.y, 2)
        );
        drawCircle(circleStart.x, circleStart.y, radius);
    }
};

function drawLine(xStart, yStart, xEnd, yEnd) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor;
    ctx.moveTo(xStart, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.stroke();
    ctx.closePath();
}

function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
}

document.getElementById('clear').onclick = () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

document.getElementById('save').onclick = () => {
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "画板作品";
    a.click();
};