var canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
canvas.style.zIndex = "-50";

document.body.insertBefore(canvas, document.body.firstChild);
var ctx = canvas.getContext('2d');
var canvasRect = canvas.getBoundingClientRect();

window.addEventListener('resize', resizeCanvas, false);
window.setInterval(loop, 30);
window.setInterval(windChange, 10000);
window.setInterval(accumulationChange, 20000);

var snowflakes = [];
var windDirection = 0;
var deltaXChange = .001;
var maxFlakes = canvas.width/10;

function loop() {
    if (snowflakes.length < maxFlakes && !(Date().now % 3))
        createSnowflake();
    updateSnowflakes();
}

function createSnowflake() {
    snowflakes.push(initializeSnowflake({}));
}

function initializeSnowflake(flake) {
    let size = Math.floor(5 + Math.random() * 25);
    // flake.x = Math.floor(Math.random() * canvas.width * 3 - canvas.width);
    flake.x = Math.floor(Math.random() * canvas.width);
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

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
}

function updateSnowflakes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snowflakes.forEach(flake => {
        flake.speedX = lerp(flake.speedX, windDirection, deltaXChange);
        flake.y += flake.speedY;
        flake.x += flake.speedX;
        flake.rotation += flake.rotationSpeed;

        flake.rotation = (Math.abs(flake.rotation) > 2 * Math.PI) ? 0 : flake.rotation;
        // if (Math.abs(flake.rotation) > 2 * Math.PI)
        //     flake.rotation = 0;

        // if (flake.y > canvas.height || flake.x > canvas.width * 2 || flake.x < -canvas.width)
        //     initializeSnowflake(flake);

        if (flake.y > canvas.height)
            initializeSnowflake(flake);

        // if (flake.y > canvas.height)
        //     flake.y = -100;

        flake.x = (flake.x > canvas.width + 51) ? -50 : flake.x;
        // if (flake.x > canvas.width + 51)
        //     flake.x = -50;

        flake.x = (flake.x < -51) ? canvas.width + 50 : flake.x;
        // if (flake.x < -51)
        //     flake.x = canvas.width + 50;


        if (flake.x > 0 && flake.x < canvas.width)
            drawSnowflake(flake);
    });
    // console.log(snowflakes);
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

function windChange() {
    windDirection = Math.round(Math.random() * 20 - 10);
    // console.log("wind Change", windDirection);
}

function accumulationChange() {

}