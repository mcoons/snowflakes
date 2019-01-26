
class SnowflakeOverlay {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "snowflakecanvas";
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = "5"; // adjust for desired effect
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.canvas.style.pointerEvents = "none";
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvasEvent(); // manually init canvas

        this.MAX_WIND_STRENGTH = 5; // +/- x
        this.DELTA_X_CHANGE = .005; // how quickly the snowflakes adjust to the wind
        this.DELTA_WIND_CHANGE = .01; // how quickly the wind adjusts to its new direction
        this.WIND_CHANGE_INTERVAL = 10000; // milliseconds
        this.INTENSITY_CHANGE_INTERVAL = 20000; // milliseconds

        this.snowflakes = [];
        this.newWindDirection = 0;
        this.windDirection = 0;
        this.maxFlakes = this.canvas.width / 10;

        window.addEventListener('resize', e => (this.resizeCanvasEvent)(), false);

        setInterval(w => (this.windChange)(), this.WIND_CHANGE_INTERVAL);
        setInterval(i => (this.intensityChange)(), this.INTENSITY_CHANGE_INTERVAL);
        setInterval(l => (this.loop)(), 20);
    }

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    loop() { // main animation loop
        if (this.snowflakes.length < this.maxFlakes && !(Date.now() % 5)) {
            this.createSnowflake(this.snowflakes);
        }
        this.frameUpdate(this.ctx, this.snowflakes);
    }

    createSnowflake(snowflakes) {
        snowflakes.push(this.initializeSnowflake({}))
    }

    initializeSnowflake(flake) {
        let size = Math.floor(10 + Math.random() * 20);
        flake.x = Math.floor(Math.random() * this.canvas.width);
        flake.y = -30;
        flake.rotation = 0;
        flake.rotationSpeed = (Math.round(Math.random() * 10) - 5) / 300;
        flake.size = size;
        flake.speedY = 2 + Math.floor((1 + Math.random() * size / 2)) / 10;
        flake.speedX = this.windDirection ;
        flake.img = new Image();
        flake.img.src = "snowflakes/snowflake-" + (Math.floor(Math.random() * 20)).toString() + ".png";
        return flake;
    }

    drawSnowflake(ctx, flake) {
        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.rotation);
        ctx.drawImage(flake.img, -flake.size / 2, -flake.size / 2, flake.size, flake.size);
        ctx.translate(0, 0);
        ctx.restore();
    }

    frameUpdate(ctx, snowflakes) {
        let removeList = []; // used when maxFlakes decreases
        this.windDirection = this.lerp(this.windDirection, this.newWindDirection, this.DELTA_WIND_CHANGE);

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        snowflakes.forEach((flake, index) => {
            flake.y += flake.speedY;
            flake.speedX = this.lerp(flake.speedX, this.windDirection, this.DELTA_X_CHANGE);
            flake.x += flake.speedX;
            flake.x = (flake.x > this.canvas.width + 21) ? -20 : flake.x;
            flake.x = (flake.x < -21) ? this.canvas.width + 20 : flake.x;
            flake.rotation += flake.rotationSpeed;
            flake.rotation = (Math.abs(flake.rotation) > 2 * Math.PI) ? 0 : flake.rotation;

            if (flake.y > this.canvas.height) {
                this.initializeSnowflake(flake);
                if (snowflakes.length > this.maxFlakes && !(Date.now() % 3)) {
                    removeList.push(index);
                }
            }
            this.drawSnowflake(ctx, flake);
        });

        removeList.reverse().forEach(index => {
            snowflakes.splice(index, 1)
        });
    }

    resizeCanvasEvent(e) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    windChange() {
        this.newWindDirection = Math.round(Math.random() * 2 * this.MAX_WIND_STRENGTH - this.MAX_WIND_STRENGTH)
    }

    intensityChange() {
        this.maxFlakes = Math.round(this.canvas.width / (1 + Math.random() * 15))
    }
}

(() => {new SnowflakeOverlay()})();
