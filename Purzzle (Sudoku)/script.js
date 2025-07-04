const gameContainer = document.getElementById("game");
const timerElement = document.getElementById("timer");
const size = 3;
let tiles = [];
let startTime = null;
let timerInterval = null;

function createTiles() {
    tiles = [...Array(size * size - 1).keys()].map(n => n + 1);
    tiles.push(null); // espaço vazio
}

function renderTiles() {
    gameContainer.innerHTML = "";
    tiles.forEach((tile, index) => {
        const div = document.createElement("div");
        div.classList.add("tile");
        if (tile === null) {
            div.classList.add("empty");
        } else {
            div.textContent = tile;
            div.addEventListener("click", () => moveTile(index));
        }
        gameContainer.appendChild(div);
    });
}

function moveTile(index) {
    const emptyIndex = tiles.indexOf(null);
    const isAdjacent =
        index === emptyIndex - 1 && emptyIndex % size !== 0 || // esquerda
        index === emptyIndex + 1 && index % size !== 0 || // direita
        index === emptyIndex - size || // cima
        index === emptyIndex + size;   // baixo

    if (isAdjacent) {
        [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
        renderTiles();
        
        // Espera 100ms antes de verificar se o jogador venceu
        setTimeout(checkWin, 100);
    }
}

function shuffleTiles() {
    createTiles();
    do {
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
    } while (isSolved());

    renderTiles();
    startTimer();
}

function isSolved() {
    return tiles.every((tile, index) => {
        if (index === tiles.length - 1) return tile === null;
        return tile === index + 1;
    });
}

function checkWin() {
    if (isSolved()) {
        stopTimer();
        alert(`Parabéns! Você resolveu o puzzle em ${formatTime(Date.now() - startTime)}!`);
    }
}

function startTimer() {
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        timerElement.textContent = "Tempo: " + formatTime(elapsed);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Inicia Automaticamente
createTiles();
renderTiles();
startTimer();
