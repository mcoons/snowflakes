bgindex = 0;
bgToggle = false;
setInterval(backgroundChange, 20000);
// backgroundChange();

function backgroundChange(){
    let filename = "url('backgrounds/bgimage-" + bgindex.toString() + ".jpg')";
    // console.log("in background change", filename);
    // document.body.style.backgroundImage = filename;

    let bgback = document.querySelector("#bgback");
    let bgfront = document.querySelector("#bgfront");

    if (bgToggle){
        bgfront.style.opacity = "0.0";
        bgback.style.opacity = "1.0";
    } else {
        bgfront.style.opacity = "1.0";
        bgback.style.opacity = "0.0";        
    }

    setTimeout( () => {
        if (!bgToggle) {
            bgfront.style.backgroundImage = filename;
        } else {
            bgback.style.backgroundImage = filename;
        }
    }, 5000);

    bgToggle = !bgToggle;

    bgindex++;
    if (bgindex === 11) bgindex = 0;
}

function preloader() {
	// if (document.images) {
		var img1 = new Image();
		var img2 = new Image();
		var img3 = new Image();
		var img4 = new Image();
		var img5 = new Image();
		var img6 = new Image();
		var img7 = new Image();
		var img8 = new Image();
		var img9 = new Image();
		var img10 = new Image();

		img1.src = "backgrounds/bgimage-1.jpg";
		img2.src = "backgrounds/bgimage-2.jpg";
		img3.src = "backgrounds/bgimage-3.jpg";
		img4.src = "backgrounds/bgimage-4.jpg";
		img5.src = "backgrounds/bgimage-5.jpg";
		img6.src = "backgrounds/bgimage-6.jpg";
		img7.src = "backgrounds/bgimage-7.jpg";
		img8.src = "backgrounds/bgimage-8.jpg";
		img9.src = "backgrounds/bgimage-9.jpg";
		img10.src = "backgrounds/bgimage-10.jpg";

	// }
}
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			if (oldonload) {
				oldonload();
			}
			func();
		}
	}
}
addLoadEvent(preloader);