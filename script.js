
let size = 100;
let htmlElements;
let cells;
let EMPTY = 0;
let ALIVE = 1;

function createField() {
    htmlElements = [];
    cells = [];
    let table = document.getElementById('field');
    for (let y = 0; y < size; y++) {
        let tr = document.createElement('tr');
        let tdElements = [];
        cells.push(new Array(size).fill(EMPTY));
        htmlElements.push(tdElements);
        table.appendChild(tr);
        for (let x = 0; x < size; x++) {
            let td = document.createElement('td');
            tdElements.push(td);
            tr.appendChild(td);
        }
    }
}

function draw() {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            htmlElements[y][x].setAttribute('class', 'cell' + (cells[y][x] == 1 ? 'filled' : 'empty'));
        }
    }
}

function countNeighbors(x,y) {
    let count = 0;
    for (dy = -1; dy <= 1; dy++) {
        for (dx = -1; dx <= 1; dx++) {
            let nx = (x + dx + size) % size, ny = (y + dy + size) % size;
            count = count + cells[ny][nx];
        }
    }
    return count - cells[y][x];
}

function newGeneration() {
    let newCells = [];
    for (let i = 0; i < size; i++) {
        newCells.push(new Array(size).fill(EMPTY));
    }
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let neighbors = countNeighbors(x, y);
            if (cells[y][x] == EMPTY && neighbors == 3) {
                newCells[y][x] = ALIVE;
            }
            if (cells[y][x] == ALIVE && (neighbors == 2 || neighbors == 3)) {
                newCells[y][x] = ALIVE;
            }
        }
    }    
    cells = newCells;
    draw();
}

function init() {
    createField();
    for (let i = 0; i < Math.floor(size * size * 0.3); i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * size), y = Math.floor(Math.random() * size);
            if (cells[y][x] == EMPTY) {
                cells[y][x] = ALIVE;
                break;
            }
        } while (true);
    }
    draw();
    setInterval(newGeneration, 100);
}

init();

let cursorX = Math.floor(size / 2);
let cursorY = Math.floor(size / 2);
let cursorColor = 'blue';

document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            moveCursor(0, -1);
            break;
        case 'ArrowDown':
            moveCursor(0, 1);
            break;
        case 'ArrowLeft':
            moveCursor(-1, 0);
            break;
        case 'ArrowRight':
            moveCursor(1, 0);
            break;
    }
});

function moveCursor(dx, dy) {
    htmlElements[cursorY][cursorX].style.backgroundColor = '';
    let newX = cursorX + dx;
    let newY = cursorY + dy;

    // Check if the new position is within bounds
    if (newX >= 0 && newX < size && newY >= 0 && newY < size) {
        // Update the cursor position
        cursorX = newX;
        cursorY = newY;

        // Toggle the state of the cell at the cursor position
        cells[cursorY][cursorX] = (cells[cursorY][cursorX] === EMPTY) ? ALIVE : EMPTY;

        // Redraw the grid
        draw();
        // Draw the cursor
        htmlElements[cursorY][cursorX].style.backgroundColor = cursorColor;
    }
}
