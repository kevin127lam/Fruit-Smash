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
const imageSize = 50; // Size of each image
// Function to display fruit grid on canvas
function displayGrid(grid) {
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
            // console.log(grid[r][c]); check to see if indices are changed
        }
    }
}

// Keep track of the currently dragged fruit image
let draggedImage = null;

// Keep track of the starting position of the dragged image
let startX = 0;
let startY = 0;

// mouse down handler
canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // find corresponding grid cell
    const cellX = Math.floor(mouseX / imageSize);
    const cellY = Math.floor(mouseY / imageSize);

    // get index of clicked cell
    const fruitIndex = hardcodedGrid[cellY][cellX];

    // If there's a fruit in the clicked cell, start dragging it
    if (fruitIndex !== 0) {
        draggedImage = {
            index: fruitIndex,
            cellX: cellX,
            cellY: cellY
        };
        // Store the starting position of the dragged image
        startX = mouseX;
        startY = mouseY;
    }
});

/**STILL BUGGY BUT IDRC ANYMORE */
// Event handler for mouse move event on the canvas
canvas.addEventListener('mousemove', (event) => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    // If there is a dragged image, draw it at the current mouse position
    if (draggedImage !== null) {
        redrawCanvas();
        // Draw the dragged fruit at the current mouse position
        ctx.drawImage(globalImages[draggedImage.index], mouseX - imageSize / 2, mouseY - imageSize / 2, imageSize, imageSize);
    }
});

function redrawCanvas() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw the entire grid with all fruits
    displayGrid(hardcodedGrid);
}


// Event handler for mouse up event on the canvas
canvas.addEventListener('mouseup', (event) => {
    if (draggedImage !== null) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        // Find the grid cell corresponding to the mouse position
        const cellX = Math.floor(mouseX / imageSize);
        const cellY = Math.floor(mouseY / imageSize);

        // check if release occurs at a proper/adjacent cell
        if (Math.abs(cellX - draggedImage.cellX) + Math.abs(cellY - draggedImage.cellY) === 1) {
            // swap fruit indices
            const temp = hardcodedGrid[cellY][cellX];
            hardcodedGrid[cellY][cellX] = draggedImage.index;
            hardcodedGrid[draggedImage.cellY][draggedImage.cellX] = temp;

            // redraw grid
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //this line is what is causing the fruit to show underneath
            displayGrid(hardcodedGrid);
        }
        else {
            // If not released over an adjacent cell, redraw the original grid
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            displayGrid(hardcodedGrid);
        }
        // Reset draggedImage to null
        draggedImage = null;
    }
});

function displayPlayerList(plist) {
    // get ref to table
    const tableBody = document.querySelector('.table-container table tbody');

    // iterate over player info
    plist.forEach(player => {
        // create table row
        const tableRow = document.createElement('tr');

        // create table data cells
        const playerName = document.createElement('td');
        playerName.textContent = player.name;
        const playerScore = document.createElement('td');
        playerScore.textContent = player.score;

        // append data cells
        tableRow.appendChild(playerName);
        tableRow.appendChild(playerScore);

        // appedn data rows
        tableBody.appendChild(tableRow);
    });
}

// Testing data
const players = [
    { name: 'Player 1', score: 100 },
    { name: 'Player 2', score: 150 },
    { name: 'Player 3', score: 75 }
];

// Display the player list in the table
displayPlayerList(players);



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