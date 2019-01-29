let MAX_IMAGE_NUMBER = 10;
let imageNumber = 10;
let backgroundToggle = false;
var img = [];

preloader();
setInterval(backgroundChange, 20000);

function backgroundChange(){
    let backCanvas = document.querySelector("#bgback");
    let frontCanvas = document.querySelector("#bgfront");

    if (backgroundToggle){
        frontCanvas.style.opacity = "0.0";
        backCanvas.style.opacity = "1.0";
    } else {
        frontCanvas.style.opacity = "1.0";
        backCanvas.style.opacity = "0.0";        
    }

    setTimeout( () => {
        if (!backgroundToggle) {
            frontCanvas.style.backgroundImage = `url('${img[imageNumber].src}')`;
        } else {
            backCanvas.style.backgroundImage = `url('${img[imageNumber].src}')`;
        }
    }, 5000);

    backgroundToggle = !backgroundToggle;

    imageNumber++;
    if (imageNumber > MAX_IMAGE_NUMBER) imageNumber = 0;
}

function preloader() {
    for (let index = 0; index <= MAX_IMAGE_NUMBER; index++) {
        img[index] = new Image();
        img[index].src = `backgrounds/bgimage-${index}.jpg`  
    }
}
