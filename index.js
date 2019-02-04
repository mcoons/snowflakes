let MAX_IMAGE_NUMBER = 10;
let imageNumber = 10;
let backgroundToggle = false;
var img = [];

preloader();
setInterval(backgroundChange, 20000);

function backgroundChange(){
    let backDiv = document.querySelector("#bgback");
    let frontDiv = document.querySelector("#bgfront");

    if (backgroundToggle){
        frontDiv.style.opacity = "0.0";
        backDiv.style.opacity = "1.0";
    } else {
        frontDiv.style.opacity = "1.0";
        backDiv.style.opacity = "0.0";        
    }

    setTimeout( () => {
        if (!backgroundToggle) {
            frontDiv.style.backgroundImage = `url('${img[imageNumber].src}')`;
        } else {
            backDiv.style.backgroundImage = `url('${img[imageNumber].src}')`;
        }
    }, 5000);

    backgroundToggle = !backgroundToggle;

    imageNumber = imageNumber === MAX_IMAGE_NUMBER ? 0 : imageNumber+1;
}

function preloader() {
    for (let index = 0; index <= MAX_IMAGE_NUMBER; index++) {
        img[index] = new Image();
        img[index].src = `backgrounds/bgimage-${index}.jpg`  
    }
}
