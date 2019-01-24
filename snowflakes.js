var canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
canvas.style.zIndex = "-50";

document.body.insertBefore(canvas, document.body.firstChild);
var ctx = canvas.getContext('2d');
var canvasRect = canvas.getBoundingClientRect();

// window.addEventListener("mousemove", mouseMove);
window.addEventListener('resize', resizeCanvas, false);
window.setInterval(loop, 17);
window.setInterval(windChange, 10000);

var snowflakes = [];

var windDirection = 0;
var deltaXChange = .001;

// var mouse = {
//     lastX: null,
//     lastY: null,
//     lastTime: null,
//     currentX: null,
//     currentY: null,
//     currentTime: null
// };
// var mouseInfluence = 100;

var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100);
grd.addColorStop(0, "red");
grd.addColorStop(1, "white");

function loop() {
    if (snowflakes.length < canvas.width / 2 && !(Date().now % 3))
        createSnowflake();
    updateSnowflakes();
}

function createSnowflake() {
    snowflakes.push(initializeSnowflake({}));
}

function initializeSnowflake(flake) {
    let size = Math.floor(5 + Math.random() * 25);
    flake.x = Math.floor(Math.random() * canvas.width * 3 - canvas.width);
    flake.y = -100;
    flake.rotation = 0;
    flake.rotationSpeed = (Math.round(Math.random() * 10) - 5) / 300;
    flake.size = size;
    flake.speedY = 1 + Math.floor((1 + Math.random() * size)) / 10;
    flake.speedX = 0;
    flake.img = new Image();
    flake.img.src = "./snowflakes/snowflake-" + (Math.floor(Math.random() * 20)).toString() + ".png";
    // console.log(flake);
    return flake;
}

function updateSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakes.forEach(flake => {

        if (flake.speedX > windDirection) {
            flake.speedX += deltaXChange*windDirection;
        }

        if (flake.speedX < windDirection) {
            flake.speedX += deltaXChange*windDirection;
        }

        flake.y += flake.speedY;
        flake.x += flake.speedX;
        flake.rotation += flake.rotationSpeed;

        if (Math.abs(flake.rotation) > 2 * Math.PI)
            flake.rotation = 0;

        if (flake.y > canvas.height || flake.x > canvas.width*2 || flake.x < -canvas.width)
            initializeSnowflake(flake);

        if (flake.x > 0 && flake.x < canvas.width) 
        drawSnowflake(flake);
    });

    // grd = ctx.createRadialGradient(mouse.currentX, mouse.currentY, 10, mouse.currentX, mouse.currentY, mouseInfluence);
    // grd.addColorStop(0, "rgba(255,0,0,.9)");
    // grd.addColorStop(1, "rgba(255,0,0,.01)");

    // ctx.beginPath();
    // ctx.arc(mouse.currentX, mouse.currentY, mouseInfluence, 0, Math.PI*2, false);
    // ctx.fillStyle = grd;
    // ctx.fill();
  
}

function drawSnowflake(flake) {
    ctx.save();
    ctx.translate(flake.x, flake.y);
    ctx.rotate(flake.rotation);
    ctx.drawImage(flake.img, -flake.size / 2, -flake.size / 2, flake.size, flake.size);
    ctx.translate(0, 0);
    ctx.restore();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasRect = canvas.getBoundingClientRect();
}

// function mouseMove(event){

//     mouse.lastTime = mouse.currentTime;
//     mouse.lastX = mouse.currentX;
//     mouse.lastY = mouse.currentY;

//     mouse.currentX = event.clientX - canvasRect.left;
//     mouse.currentY = event.clientY - canvasRect.top;
//     mouse.currentTime = new Date().getTime();

//     // console.log(mouse);
// }

function windChange(){
    windDirection = Math.round(Math.random()*20 - 10);
    console.log("wind Change", windDirection);


    // let chance = Math.round(Math.random()*10 - 5);
    // if (chance < -2){
    //     console.log("left", chance)
    // } else
    // if (chance > 2){
    //     console.log("right", chance)
    // } else {
    //     console.log("none", chance)
    // }
}
