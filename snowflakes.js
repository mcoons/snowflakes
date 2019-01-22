var canvas = document.getElementById('snowflakecanvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
canvas.style.zIndex = "-5";

window.addEventListener('resize', resizeCanvas, false);
window.setInterval(loop, 17);

var snowflakes = [];

function loop() {
    if (snowflakes.length < 150) createSnowflake();
    updateSnowflakes();
}

function createSnowflake() {
    let flake = {};
    initializeSnowflake(flake);
    snowflakes.push(flake);
}

function initializeSnowflake(flake) {
    let size = Math.floor(5 + Math.random() * 25);
    flake.x = Math.floor( Math.random() * canvas.width - 30);
    flake.y = -50;
    flake.rotation = 0;
    flake.rotationSpeed = (Math.round(Math.random()*10)-5)/300;
    flake.size = size;
    flake.speedY = Math.floor(1 + Math.random() * size / 10);
    flake.speedX = 0;
    flake.img = new Image();
    flake.img.src = "./snowflakes/snowflake-" + (Math.floor(Math.random() * 20)).toString() + ".png";
}

function updateSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes.forEach(flake => {
        flake.y += flake.speedY;
        flake.x += flake.speedX;
        flake.rotation+=flake.rotationSpeed;
        if (flake.rotation>2*Math.PI) flake.rotation = 0;
        if (flake.rotation<-2*Math.PI) flake.rotation = 0;
        
        if (flake.y > canvas.height || flake.x > canvas.width || flake.x < 0) {
            initializeSnowflake(flake);
        }

        ctx.save();
        ctx.translate(flake.x, flake.y); 
        ctx.rotate(flake.rotation);
        ctx.drawImage(flake.img, -flake.size/2, -flake.size/2, flake.size, flake.size);
        ctx.translate(0,0);
        ctx.restore();
    });
    // console.log(snowflakes);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}