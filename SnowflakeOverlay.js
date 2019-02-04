class SnowflakeOverlay {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "snowflakecanvas";
        this.canvas.style.position = "absolute";
        this.canvas.style.zIndex = "-500"; // adjust for desired layer effect
        this.canvas.style.pointerEvents = "none";
        document.body.insertBefore(this.canvas, document.body.firstChild);
        this.context2D = this.canvas.getContext('2d');
        this.resizeCanvasEvent(); // init canvas

        this.MIN_FLAKE_SIZE = 10; // diameter px
        this.MAX_FLAKE_SIZE = 30; // diameter px
        this.MAX_WIND_STRENGTH = 4; // +/- x
        this.DELTA_X_CHANGE = .007; // how quickly the snowflakes adjust to the wind change
        this.DELTA_WIND_CHANGE = .01; // how quickly the wind adjusts to its new direction
        this.WIND_CHANGE_INTERVAL = 10000; // milliseconds
        this.INTENSITY_CHANGE_INTERVAL = 20000; // milliseconds

        this.snowflakes = [];
        this.snowflakeImgSources = [];
        this.windDirection = 0;
        this.newWindDirection = 0;
        this.maxFlakes = this.canvas.width / 10;
        // this.maxFlakes = 1000;
        this.lastFrameTime = Date.now();
        this.frameTimes = [];

        this.preloadSnowflakes(this.snowflakeImgSources);

        window.addEventListener('resize', () => (this.resizeCanvasEvent)(), false);
        this.windInterval = setInterval(() => (this.changeWind)(), this.WIND_CHANGE_INTERVAL);
        this.intensityInterval = setInterval(() => (this.changeIntensity)(), this.INTENSITY_CHANGE_INTERVAL);
        
        window.requestAnimationFrame(this.mainLoop.bind(this));
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    preloadSnowflakes(imgSources){
        for (let index = 0; index < 20; index++) {
            imgSources[index] = new Image();            
            imgSources[index].onload = function(){ this.imgError = 0 };
            imgSources[index].onerror = function(){ this.imgError = -1 };   
            imgSources[index].src = `snowflakes/snowflake-${index}.png`;
        }
    }

    initializeSnowflake(flake) {
        let size = Math.floor(this.MIN_FLAKE_SIZE + Math.random() * (this.MAX_FLAKE_SIZE-this.MIN_FLAKE_SIZE));
        flake.x = Math.floor(Math.random() * this.canvas.width);
        flake.y = -this.MAX_FLAKE_SIZE;
        flake.rotation = 0;
        flake.rotationSpeed = (Math.round(Math.random() * 10) - 5) / 300;
        flake.size = size;
        flake.speedY = 2 + Math.floor((1 + Math.random() * size / 2)) / 10;
        flake.speedX = this.windDirection;
        flake.img = this.snowflakeImgSources[Math.floor(Math.random() * 20)];
        return flake;
    }

    updateSnowflake(flake, flakeCount, removeList, index) {
        flake.y += flake.speedY;
        flake.speedX = this.lerp(flake.speedX, this.windDirection, this.DELTA_X_CHANGE);
        flake.x += flake.speedX;

        flake.x = (flake.x > this.canvas.width + flake.size/2 + 1) ? -flake.size/2 : flake.x;
        flake.x = (flake.x < -flake.size/2 -1) ? this.canvas.width + flake.size/2 : flake.x;
        
        flake.rotation += flake.rotationSpeed;
        flake.rotation = (Math.abs(flake.rotation) > 2 * Math.PI) ? 0 : flake.rotation;

        // reset snowflakes that fall off bottom of the canvas
        if (flake.y > this.canvas.height) {
            
            // periodically mark any extra snowflakes for removal
            if (flakeCount > this.maxFlakes && !(Date.now() % 3)) {
                removeList.push(index);
            } else {
                this.initializeSnowflake(flake);
            }
        }
    }

    drawSnowflake(context2D, flake) {
        context2D.save();
        if (flake.img.imgError === 0){
            context2D.translate(flake.x, flake.y);
            context2D.rotate(flake.rotation);
            context2D.drawImage(flake.img, -flake.size / 2, -flake.size / 2, flake.size, flake.size);
            context2D.translate(0, 0);
        } else { // fallback for missing img src files
            context2D.fillStyle = "white"; 
            context2D.beginPath(); 
            context2D.arc(flake.x, flake.y, flake.size/4, 0, Math.PI*2); 
            context2D.closePath(); 
            context2D.fill(); 
        }
        context2D.restore();
    }

    addSnowflake(snowflakes) {
        if (snowflakes.length < this.maxFlakes && !(Date.now() % 3)) {
            snowflakes.push(this.initializeSnowflake({}));
        }
    }

    removeSnowflakes(removeList, snowflakes) {
        removeList.reverse().forEach(index => {
            snowflakes.splice(index, 1);
        });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    mainLoop() { 
        this.updateFrame(this.context2D, this.snowflakes);

        // this.calculateFPS();

        window.requestAnimationFrame(this.mainLoop.bind(this));
    }

    updateFrame(context2D, snowflakes) {
        let removeList = []; // used when maxFlakes decreases
        this.windDirection = this.lerp(this.windDirection, this.newWindDirection, this.DELTA_WIND_CHANGE);

        this.addSnowflake(snowflakes);

        context2D.clearRect(0, 0, context2D.canvas.width, context2D.canvas.height);
        snowflakes.forEach((flake, index) => {
            this.updateSnowflake(flake, snowflakes.length, removeList, index);
            this.drawSnowflake(context2D, flake);
        });

        this.removeSnowflakes(removeList, snowflakes);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    resizeCanvasEvent() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    calculateFPS() {
        let now = Date.now();
        let difference = now - this.lastFrameTime;
        this.frameTimes.push(difference);
        if (this.frameTimes.length > 100) this.frameTimes.shift();
        let total = this.frameTimes.reduce( (a,e) => a+e, 0);
        console.log(`${this.snowflakes.length} snowflakes @ ${Math.round(this.frameTimes.length/total*1000)}FPS`);
        this.lastFrameTime = now;
    }

    changeWind() {
        this.newWindDirection = Math.round(Math.random() * 2 * this.MAX_WIND_STRENGTH - this.MAX_WIND_STRENGTH);
    }

    changeIntensity() {
        this.maxFlakes = Math.round(this.canvas.width / (1 + Math.random() * 15));
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

(() => new SnowflakeOverlay())();

// sfo = new SnowflakeOverlay();
// console.log(sfo)
