const socket = io.connect('http://neptune.cse.lehigh.edu:3000');

$('button').click(function (e) {
    let btnName = $(e.target).html();
    // login event
    if (btnName == "Login") {
        const userInput = $('#username').val();
        if (userInput) {
            socket.emit('login', userInput);
            console.log('Login event:', { username: userInput });
        }
        $('#username').val('');
    }

    //chatsend event
    if (btnName == "Send") {
        const message = $('#chat').val();
        if (message) {
            socket.emit('chatsend', { id: playerId, message: message });
            console.log('Chatsend event:', { id: playerId, message });
        }
        $('#chat').val('')
    }
});

let playerId, playerUsername, playerMessage;
socket.on('loginresponse', (data) => {
    playerId = data.id;
    playerUsername = data.filteredusername;
    console.log('Login response:', { playerId, playerUsername });
});

socket.on('chatbroadcast', (data) => {
    //data contains the username and the message
    console.log('Chat broadcast: ', data);

    //adds a message to chat container
    $('.chat-container').append($('<div>').addClass('message').text(data));
});

let newGrid = [];
socket.on('gridupdate', (data) => {
    newGrid = data;
    displayGrid(data);
    //data contains the username and the message
    console.log('Grid updated: ', data);
});

socket.on('playerslistupdate', (data) => {
    console.log("Player list update: ", data);
    displayPlayerList(data);
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
        //console.log("Images loaded:", globalImages);
        displayGrid(newGrid);
    })
    .catch((error) => {
        console.error("Error loading images:", error);
    });

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

//generate fruit grid w random values
const fruitGrid = [];
for (let i = 0; i < 8; i++) {
    fruitGrid[i] = [];
    for (let j = 0; j < 10; j++) {
        fruitGrid[i][j] = getRandomInt(1, 8);
    }
}


const canvas = $("#myCanvas")[0];
const ctx = canvas.getContext("2d");
const imageSize = 50; // Size of each image
// Function to display fruit grid on canvas
function displayGrid(grid) {
    ctx.clearRect(0, 0, 500, 400);
    //iterate through rows
    for (let r = 0; r < grid.length; r++) {
        //iterate through columns
        for (let c = 0; c < grid[r].length; c++) {
            ctx.drawImage(globalImages[grid[r][c]], c * imageSize, r * imageSize, imageSize, imageSize);
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
    const fruitIndex = newGrid[cellY][cellX];

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
    ctx.clearRect(0, 0, 500, 400);
    // Redraw the entire grid with all fruits
    displayGrid(newGrid);
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
            const temp = newGrid[cellY][cellX];
            newGrid[cellY][cellX] = draggedImage.index;
            newGrid[draggedImage.cellY][draggedImage.cellX] = temp;

            // redraw grid
            ctx.clearRect(0, 0, 500, 400);
            //this line is what is causing the fruit to show underneath
            displayGrid(newGrid);
            socket.emit('imageswap', { id: playerId, image1Col: startCellX, image1Row: startCellY, image2Col: cellX, image2Row: cellY });
            console.log('Swap event:', { id: playerId, image1Col: startCellX, image1Row: startCellY, image2Col: cellX, image2Row: cellY });
            //console.log(newGrid);

        }
        else {
            // If not released over an adjacent cell, redraw the original grid
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            displayGrid(newGrid);
        }
        // Reset draggedImage to null
        draggedImage = null;
    }
});

function displayPlayerList(players) {
    // Get a reference to the table body
    const tableBody = $('.table-container table tbody');

    players.forEach((player) => {
        // check if existing
        let existingRow = tableBody.find(`tr[data-name="${player.name}"]`);

        if (existingRow.length > 0) {
            // if the row exists update
            existingRow.find('.player-score').text(player.score);
        } else { //otherwise create a new one
            const row = $('<tr>').attr('data-name', player.name); // Use a data attribute to identify the row

            const nameCell = $('<td>').text(player.name);
            const scoreCell = $('<td>').addClass('player-score').text(player.score);

            row.append(nameCell).append(scoreCell);
            tableBody.append(row);
        }
    });
}

