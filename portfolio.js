//IMAGE SLIDER
let imgs = ["CAPM.jpg.jpeg", "Leadership.jpg.jpeg", "Intro to HTML.jpg.jpeg", "Intro to CSS.jpg.jpeg", "Intro to JavaScript.jpeg"];
let imgIndex = 0;
let img = document.getElementById("cert-slide");

function nextImg() {
    ++imgIndex;
    if (imgIndex >= imgs.length) {
        imgIndex = 0;
    }
    console.log(imgIndex);
    img.src = imgs[imgIndex];
}

function prevImg() {
    --imgIndex;
    if (imgIndex < 0) {
        imgIndex = imgs.length - 1;
    }
    console.log(imgIndex);
    img.src = imgs[imgIndex];
}

setInterval(nextImg, 2000);