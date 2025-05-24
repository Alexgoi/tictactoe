document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const winningLine = document.getElementById('winningLine'); // Get the winning line element
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];

    const winningConditions = [
        [0, 1, 2], // Horizontal top
        [3, 4, 5], // Horizontal middle
        [6, 7, 8], // Horizontal bottom
        [0, 3, 6], // Vertical left
        [1, 4, 7], // Vertical middle
        [2, 5, 8], // Vertical right
        [0, 4, 8], // Diagonal top-left to bottom-right
        [2, 4, 6]  // Diagonal top-right to bottom-left
    ];

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        // Create a span element for the animation
        const playerSpan = document.createElement('span');
        playerSpan.innerText = currentPlayer;
        clickedCell.appendChild(playerSpan);

        // Add a class to trigger the animation
        requestAnimationFrame(() => {
            clickedCell.classList.add('played');
        });
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerHTML = `É a vez do jogador ${currentPlayer}`;
    }

    function drawWinningLine(winCondition) {
        // Clear any existing lines
        while (winningLine.firstChild) {
            winningLine.removeChild(winningLine.firstChild);
        }

        const firstCell = cells[winCondition[0]];
        const lastCell = cells[winCondition[2]];
        const boardRect = gameBoard.getBoundingClientRect();

        const firstCellRect = firstCell.getBoundingClientRect();
        const lastCellRect = lastCell.getBoundingClientRect();

        // Calculate center points of the first and last cells relative to the gameBoard
        const x1 = firstCellRect.left - boardRect.left + firstCellRect.width / 2;
        const y1 = firstCellRect.top - boardRect.top + firstCellRect.height / 2;
        const x2 = lastCellRect.left - boardRect.left + lastCellRect.width / 2;
        const y2 = lastCellRect.top - boardRect.top + lastCellRect.height / 2;

        // Create the SVG line element
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);

        // Append the line to the SVG
        winningLine.appendChild(line);

        // Calculate the length of the line for the animation
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

        // Set initial state for the animation
        line.style.strokeDasharray = length;
        line.style.strokeDashoffset = length;

        // Animate the stroke-dashoffset to 0 after a short delay
        requestAnimationFrame(() => {
             requestAnimationFrame(() => {
                 line.style.strokeDashoffset = 0;
             });
        });

        winningLine.style.display = 'block'; // Ensure the SVG is visible
    }

    function handleResultValidation() {
        let roundWon = false;
        let winningCondition = null;
        for (let i = 0; i < winningConditions.length; i++) {
            const condition = winningConditions[i];
            let a = gameState[condition[0]];
            let b = gameState[condition[1]];
            let c = gameState[condition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winningCondition = condition;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = `Jogador ${currentPlayer} venceu!`;
            gameActive = false;
            drawWinningLine(winningCondition); // Draw the line
            return;
        }

        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.innerHTML = 'Empate!';
            gameActive = false;
            return;
        }

        handlePlayerChange();
    }

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        // If the game is not active, restart the game on any cell click
        if (!gameActive) {
            handleRestartGame();
            return;
        }

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleRestartGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.innerHTML = `É a vez do jogador ${currentPlayer}`;
        cells.forEach(cell => {
            cell.innerHTML = ''; // Clear the cell content
            cell.classList.remove('played'); // Remove the played class
        });
        // Clear the winning line SVG content on restart
        while (winningLine.firstChild) {
            winningLine.removeChild(winningLine.firstChild);
        }
        winningLine.style.display = 'none'; // Hide the SVG container
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    statusDisplay.innerHTML = `É a vez do jogador ${currentPlayer}`;
    winningLine.style.display = 'none'; // Initially hide the line
});
