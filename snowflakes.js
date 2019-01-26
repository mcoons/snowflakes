
var canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.zIndex = "-50";
document.body.insertBefore(canvas, document.body.firstChild);
var ctx = canvas.getContext('2d');

const MAX_WIND_STRENGTH = 5;  // +/- x
const DELTA_X_CHANGE = .005;  // how quickly the snowflakes adjust to the wind
const DELTA_WIND_CHANGE = .01;  // how quickly the wind adjusts to its new direction
const WIND_CHANGE_INTERVAL = 10000;  // milliseconds
const INTENSITY_CHANGE_INTERVAL = 20000;  // milliseconds

var snowflakes = [];
var newWindDirection = 0;
var windDirection = 0;
var maxFlakes = canvas.width / 10;

window.addEventListener('resize', resizeCanvasEvent, false);
resizeCanvasEvent();  // initialize canvas size
setInterval(loop, 20);
setInterval(windChange, WIND_CHANGE_INTERVAL);
setInterval(intensityChange, INTENSITY_CHANGE_INTERVAL);

let lerp = (start, end, amt) => (1 - amt) * start + amt * end;

function windChange() {
    newWindDirection = Math.round(Math.random() * 2 * MAX_WIND_STRENGTH - MAX_WIND_STRENGTH)
};

function intensityChange () {
    maxFlakes = Math.round(canvas.width / (1 + Math.random() * 15))
}

function resizeCanvasEvent(e) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function loop() {
    if (snowflakes.length < maxFlakes && !(Date.now() % 5)) {
        createSnowflake(snowflakes);
    }
    frameUpdate(ctx, snowflakes);
}

function createSnowflake (snowflakes) {
    snowflakes.push(initializeSnowflake({}))
}

function initializeSnowflake(flake) {
    let size = Math.floor(10 + Math.random() * 20);
    flake.x = Math.floor(Math.random() * canvas.width);
    flake.y = -100;
    flake.rotation = 0;
    flake.rotationSpeed = (Math.round(Math.random() * 10) - 5) / 300;
    flake.size = size;
    flake.speedY = 2 + Math.floor((1 + Math.random() * size / 2)) / 10;
    flake.speedX = windDirection / 2;
    flake.img = new Image();
    flake.img.src = "./snowflakes/snowflake-" + (Math.floor(Math.random() * 20)).toString() + ".png";
    return flake;
}

function frameUpdate(ctx, snowflakes) {
    let removeList = [];
    windDirection = lerp(windDirection, newWindDirection, DELTA_WIND_CHANGE);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes.forEach( (flake, index) => {
        flake.y += flake.speedY;
        flake.speedX = lerp(flake.speedX, windDirection, DELTA_X_CHANGE);
        flake.x += flake.speedX;
        flake.x = (flake.x > canvas.width + 21) ? -20 : flake.x;
        flake.x = (flake.x < -21) ? canvas.width + 20 : flake.x;
        flake.rotation += flake.rotationSpeed;
        flake.rotation = (Math.abs(flake.rotation) > 2 * Math.PI) ? 0 : flake.rotation;

        if (flake.y > canvas.height) {
            initializeSnowflake(flake);
            if (snowflakes.length > maxFlakes && !(Date.now() % 3)) {
                removeList.push(index);
            }
        }
        drawSnowflake(ctx, flake);
    });

    removeList.reverse().forEach(index => {
        snowflakes.splice(index, 1)
    });
}

function drawSnowflake(ctx, flake) {
    ctx.save();
    ctx.translate(flake.x, flake.y);
    ctx.rotate(flake.rotation);
    ctx.drawImage(flake.img, -flake.size / 2, -flake.size / 2, flake.size, flake.size);
    ctx.translate(0, 0);
    ctx.restore();
}
