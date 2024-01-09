
const enemySpeed = 2;

function createObjectImg(ctx, id, width, height, img, top, left) 
{
    const objectImg = 
    {
        id,
        top,
        left,
        width,
        height,
        image: new Image(),
        draw: function () 
        {
            this.image.src = img;
            ctx.drawImage(this.image, this.left, this.top, this.width, this.height);
        }
    };

    return objectImg;
}

function createObjectColor(ctx, id, width, height, color, top, left) 
{
    const objectColor = 
    {
        id,
        top,
        left,
        width,
        height,
        color,
        draw: function()
        {
            ctx.fillStyle = color; ctx.fillRect(this.left, this.top, this.width, this.height)
        }
    }

    return objectColor
}

function move(square, targetX, targetY, speed) 
{
    const deltaX = targetX - square.left;
    const deltaY = targetY - square.top;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > 1) 
    {
        const ratio = speed / distance;
        square.left += deltaX * ratio;
        square.top += deltaY * ratio;
    }
}

function checkCollision(square1, square2) 
{
    return (
        square1.left < square2.left + square2.width &&
        square1.left + square1.width > square2.left &&
        square1.top < square2.top + square2.height &&
        square1.top + square1.height > square2.top
    );
}

function handleCollision(square, otherSquare) 
{
    const overlapX = Math.max(0, Math.min(square.left + square.width, otherSquare.left + otherSquare.width) - Math.max(square.left, otherSquare.left));
    const overlapY = Math.max(0, Math.min(square.top + square.height, otherSquare.top + otherSquare.height) - Math.max(square.top, otherSquare.top));

    if (overlapX < overlapY) 
    {
        if (square.left < otherSquare.left) 
        {
            square.left += -overlapX;
        } 
        else 
        {
            square.left += overlapX;
        }
    }
    else 
    {
        if (square.top < otherSquare.top) 
        {
            square.top += -overlapY;
        } 
        else 
        {
            square.top += overlapY;
        }
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const enemyBase = createObjectColor(ctx, "enemyBase", 50, 250, "red", 250, 0);
const moneyBase = createObjectColor(ctx, "moneyBase", 50, 250, "red", 250, canvas.width-50);

const obstacle1 = createObjectColor(ctx, 'obstacle1', 150, 5, "red", 100, 100);
const obstacle2 = createObjectColor(ctx, 'obstacle2', 150, 5, "red", 200, 200);
const obstacle3 = createObjectColor(ctx, 'obstacle3', 150, 5, "red", 300, 300);

const square1 = createObjectImg(ctx, 'square1', 50, 50, "tek.jpg", 275, 0);
const square2 = createObjectImg(ctx, 'square2', 50, 50, "tek.jpg", 325, 0);
const square3 = createObjectImg(ctx, 'square3', 50, 50, "tek.jpg", 375, 0);
const square4 = createObjectImg(ctx, 'square4', 50, 50, "tek.jpg", 425, 0);
const player = createObjectColor(ctx, 'player', 50, 50, "black", canvas.height / 2, canvas.width / 2);

function start() 
{
    end = false

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const squares = [square1, square2, square3, square4];
    const obstacles = [obstacle1, obstacle2, obstacle3]

    squares.forEach(square => move(square, player.left, player.top, enemySpeed));

    for (let i = 0; i < squares.length - 1; i++) 
    {
        for (let j = i + 1; j < squares.length; j++) 
        {
            if (checkCollision(squares[i], squares[j])) 
            {
                handleCollision(squares[i], squares[j]);
            }
        }
    } //enemy collision egymasba

    for (let i = 0; i < squares.length - 1; i++) 
    {
            if (checkCollision(squares[i], player)) 
            {
                console.log('asd')
                end = true
            }
    } //enemy player collision

    for (let i = 0; i < obstacles.length; i++) 
    {
        if (checkCollision(player, obstacles[i])) 
        {
               handleCollision(player, obstacles[i]);
        }
    } //object player collision

    for (let i = 0; i < obstacles.length; i++) 
    {
        for (let j = 0; j < squares.length; j++) 
        {
            if (checkCollision(squares[j], obstacles[i])) 
            {
                handleCollision(squares[j], obstacles[i]);
            }
        }
    } //object enemy collision

    // for (let i = 0; i < moneys.length; i++) {
    //      if (checkCollision(moneys[i], player)) {
    //             handleCollision(moneys[i], player);
    //      }
    //  } //mozgatos collision



    requestAnimationFrame(start);

    enemyBase.draw();
    moneyBase.draw();
    squares.forEach(square => square.draw());
    obstacles.forEach(obstacle => obstacle.draw());
    player.draw();

    if(end)
    {
        console.log('asd2')
    }
}



document.addEventListener("keydown", function (event) 
{
    const step = 10;
    switch (event.key) 
    {
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
}
);