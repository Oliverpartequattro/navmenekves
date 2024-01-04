
const enemySpeed = 2;

function createSquare(ctx, id, top, left) {
    return { id, top, left, width: 50, height: 50, draw: function () { ctx.fillStyle = 'red'; ctx.fillRect(this.left, this.top, this.width, this.height); } };
}

function move(square, targetX, targetY, speed) {
    const deltaX = targetX - square.left;
    const deltaY = targetY - square.top;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > 1) {
        const ratio = speed / distance;
        square.left += deltaX * ratio;
        square.top += deltaY * ratio;
    }
}

function checkCollision(square1, square2) {
    return (
        square1.left < square2.left + square2.width &&
        square1.left + square1.width > square2.left &&
        square1.top < square2.top + square2.height &&
        square1.top + square1.height > square2.top
    );
}

function handleCollision(square, otherSquare) {
    const overlapX = Math.max(0, Math.min(square.left + square.width, otherSquare.left + otherSquare.width) - Math.max(square.left, otherSquare.left));
    const overlapY = Math.max(0, Math.min(square.top + square.height, otherSquare.top + otherSquare.height) - Math.max(square.top, otherSquare.top));

    if (overlapX < overlapY) {
        square.left += square.left < otherSquare.left ? -overlapX : overlapX;
    } else {
        square.top += square.top < otherSquare.top ? -overlapY : overlapY;
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const square1 = createSquare(ctx, 'square1', 0, 0);
const square2 = createSquare(ctx, 'square2', 0, canvas.width - 50);
const square3 = createSquare(ctx, 'square3', canvas.height - 50, 0);
const square4 = createSquare(ctx, 'square4', canvas.height - 50, canvas.width - 50);
const player = createSquare(ctx, 'player', canvas.height / 2, canvas.width / 2);

function moveSquares() {
    const squares = [square1, square2, square3, square4];

    squares.forEach(square => move(square, player.left, player.top, enemySpeed));

    for (let i = 0; i < squares.length - 1; i++) {
        for (let j = i + 1; j < squares.length; j++) {
            if (checkCollision(squares[i], squares[j])) {
                handleCollision(squares[i], squares[j]);
            }
        }
    }

    requestAnimationFrame(moveSquares);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    squares.forEach(square => square.draw());
    player.draw();
}

moveSquares();

document.addEventListener("keydown", function (event) {
    const step = 10;
    switch (event.key) {
        case "ArrowUp":
            player.top = Math.max(0, player.top - step);
            break;
        case "ArrowDown":
            player.top = Math.min(canvas.height - player.height, player.top + step);
            break;
        case "ArrowLeft":
            player.left = Math.max(0, player.left - step);
            break;
        case "ArrowRight":
            player.left = Math.min(canvas.width - player.width, player.left + step);
            break;
    }
});