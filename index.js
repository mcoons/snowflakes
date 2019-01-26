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