bgindex = 0;
setInterval(backgroundChange, 20000);
backgroundChange();

function backgroundChange(){
    let filename = "url('backgrounds/bgimage-" + bgindex.toString() + ".jpg')";
    console.log("in background change", filename);
    document.body.style.backgroundImage = filename;
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

		img1.src = "url('backgrounds/bginame-1.jpg')";
		img2.src = "url('backgrounds/bginame-2.jpg')";
		img3.src = "url('backgrounds/bginame-3.jpg')";
		img4.src = "url('backgrounds/bginame-4.jpg')";
		img5.src = "url('backgrounds/bginame-5.jpg')";
		img6.src = "url('backgrounds/bginame-6.jpg')";
		img7.src = "url('backgrounds/bginame-7.jpg')";
		img8.src = "url('backgrounds/bginame-8.jpg')";
		img9.src = "url('backgrounds/bginame-9.jpg')";
		img10.src = "url('backgrounds/bginame-10.jpg')";

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