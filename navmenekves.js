const enemySpeed = 2;

function createSquare(ctx, top, left) {
    const square = {
        top: top,
        left: left,
        width: 50,
        height: 50,
        draw: function () {
            ctx.fillRect(this.left, this.top, this.width, this.height);
        }
    };
    return square;
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

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const square1 = createSquare(ctx, 0, 0);
const square2 = createSquare(ctx, 0, canvas.width - 50);
const square3 = createSquare(ctx, canvas.height - 50, 0);
const square4 = createSquare(ctx, canvas.height - 50, canvas.width - 50);

const player = createSquare(ctx, canvas.height / 2, canvas.width / 2);

function moveSquares() {
    move(square1, player.left, player.top, enemySpeed);
    move(square2, player.left, player.top, enemySpeed);
    move(square3, player.left, player.top, enemySpeed);
    move(square4, player.left, player.top, enemySpeed);

    requestAnimationFrame(moveSquares);

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    square1.draw();
    square2.draw();
    square3.draw();
    square4.draw();
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