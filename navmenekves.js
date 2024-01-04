const enemySpeed = 2;

function createSquare(top, left) {
    const square = document.createElement("div");
    square.className = "square";
    square.style.top = top + "px";
    square.style.left = left + "px";
    document.body.appendChild(square);
    return square;
}

function move(square, targetX, targetY, speed) {
    const squareRect = square.getBoundingClientRect();
    const deltaX = targetX - squareRect.left;
    const deltaY = targetY - squareRect.top;

    const distance = Math.hypot(deltaX, deltaY);

    if (distance > 1) {
        const ratio = speed / distance;
        const newX = squareRect.left + deltaX * ratio;
        const newY = squareRect.top + deltaY * ratio;

        square.style.left = newX + "px";
        square.style.top = newY + "px";
    }
}

const square1 = createSquare(0, 0);
const square2 = createSquare(0, window.innerWidth - 50);
const square3 = createSquare(window.innerHeight - 50, 0);
const square4 = createSquare(window.innerHeight - 50, window.innerWidth - 50);

const player = createSquare(window.innerHeight / 2, window.innerWidth / 2);


function moveSquares() {
    move(square1, player.offsetLeft, player.offsetTop, enemySpeed);
    move(square2, player.offsetLeft, player.offsetTop, enemySpeed);
    move(square3, player.offsetLeft, player.offsetTop, enemySpeed);
    move(square4, player.offsetLeft, player.offsetTop, enemySpeed);

    requestAnimationFrame(moveSquares);
}

moveSquares();

document.addEventListener("keydown", function (event) {
    const step = 10; 
    switch (event.key) {
        case "ArrowUp":
            player.style.top = Math.max(0, player.offsetTop - step) + "px";
            break;
        case "ArrowDown":
            player.style.top = Math.min(window.innerHeight - player.offsetHeight, player.offsetTop + step) + "px";
            break;
        case "ArrowLeft":
            player.style.left = Math.max(0, player.offsetLeft - step) + "px";
            break;
        case "ArrowRight":
            player.style.left = Math.min(window.innerWidth - player.offsetWidth, player.offsetLeft + step) + "px";
            break;
    }
});
