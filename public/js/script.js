const socket = io.connect('http://callisto.cse.lehigh.edu:3000');
const myUuid = uuidv4();

$('button').click(function (e) {
    let btnName = $(e.target).html();
    if (btnName == "Login") {
        socket.emit('login', { username: $('#username').val() });
    }
    //$('#mess').val('');
    if (btnName == "Send") {
        socket.emit('chatsend', { id: myUuid, message: $('#chat').val() });
    }
});

socket.on('loginresponse', function(login){
    let id = login.id;
    let filteredusername = login.username;

  });

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
        const startCellX = Math.floor(startX / imageSize);
        const startCellY = Math.floor(startY / imageSize);
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

            socket.emit('imageswap', { id: myUuid, image1Col: startCellX, image1Row: startCellY, image2Col: cellX, image2Row: cellY });
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



/*https://www.geeksforgeeks.org/how-to-create-a-guid-uuid-in-javascript/*/
// Generate a random UUID
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

