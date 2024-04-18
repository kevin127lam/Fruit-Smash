//put urls in an array
const imgs = [
    '../images/background.png',
    '../images/appleGreen.png',
    '../images/appleRed.png',
    '../images/cherry.png',
    '../images/grape.png',
    '../images/orange.png',
    '../images/strawberry.png',
    '../images/watermelon.png',
];

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
    });
}

const imagePromises = [];
//put each promis in a second array
imgs.forEach((file) => {
    const promise = preloadImage(file);
    imagePromises.push(promise);
});

const globalImages = [];
// Wait for all promises to resolve using Promise.all
Promise.all(imagePromises)
    .then((imageObjects) => {
        //put each promis in a second array
        for (let i = 0; i < 8; i++) {
            globalImages.push(imageObjects[i]);
        }
        console.log("Images loaded:", globalImages);
        displayGrid(hardcodedGrid);
    })
    .catch((error) => {
        console.error("Error loading images:", error);
    });

// Hardcoded array of integers representing the fruit grid
const hardcodedGrid = [
    [1, 2, 3, 4, 5, 6, 7, 1, 2, 3],
    [4, 5, 6, 7, 1, 2, 3, 4, 5, 6],
    [7, 1, 2, 3, 4, 5, 6, 7, 1, 2],
    [3, 4, 5, 6, 7, 1, 2, 3, 4, 5],
    [6, 7, 1, 2, 3, 4, 5, 6, 7, 1],
    [2, 3, 4, 5, 6, 7, 1, 2, 3, 4],
    [5, 6, 7, 1, 2, 3, 4, 5, 6, 7],
    [1, 2, 3, 4, 5, 6, 7, 1, 2, 3]
];
const canvas = $("#myCanvas")[0];
const ctx = canvas.getContext("2d");
// Function to display fruit grid on canvas
function displayGrid(grid) {
    const imageSize = 50; // Size of each image

    //iterate through rows
    for (let r = 0; r < grid.length; r++) {
        //iterate through columns
        for (let c = 0; c < grid[r].length; c++) {
            //let each index indicate a cell
            const fruitIndex = grid[r][c];
            const imageSrc = imgs[fruitIndex];
            const img = new Image();
            img.onload = function () {
                ctx.drawImage(img, c * imageSize, r * imageSize, imageSize, imageSize);
            };
            img.src = imageSrc // Assuming images are in 'images' directory
        }
    }
}



/**
 * socket.send(ln)
 * .on("receiveloginname", (qq) => {
 * })
 * 
 * 
 in idk.js
in a for loop:
function loadScript(src) {
return new Promise(function(resolve, reject) {
let script = document.createElement('script');//for image
script.src = src; // let src be image src (array val)
script.onload = () => resolve(script); // resolve(image element)
script.onerror = () => reject(new Error(`Script load
error for ${src}`));

want img to align w value in directions (null for 0?)

Promise.all([
new Promise(resolve => setTimeout(() => resolve(1), 3000)),
// 1
new Promise(resolve => setTimeout(() => resolve(2), 2000)),
// 2
new Promise(resolve => setTimeout(() => resolve(3), 1000))
// 3
]).then(pass function (namely array of image function (funct that copies images)));
// 1,2,3 when promises are ready: each promise contributes
an array member

document.head.append(script);

});
}
 */