const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const enemySpeed = 1;

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
square
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

function handleCollision(square1, square2) 
{
    const overlapX = Math.max(0, Math.min(square1.left + square1.width, square2.left + square2.width) - Math.max(square1.left, square2.left));
    const overlapY = Math.max(0, Math.min(square1.top + square1.height, square2.top + square2.height) - Math.max(square1.top, square2.top));

    if (overlapX < overlapY) 
    {
        if (square1.left < square2.left) 
        {
            square1.left += -overlapX;
        } 
        else 
        {
            square1.left += overlapX;
        }
    }
    else 
    {
        if (square1.top < square2.top) 
        {
            square1.top += -overlapY;
        } 
        else 
        {
            square1.top += overlapY;
        }
    }
}

var points = 0
const enemyBase = createObjectColor(ctx, "enemyBase", 50, 250, "red", 250, 0);
const moneyBase = createObjectColor(ctx, "moneyBase", 50, 250, "red", 250, canvas.width-50);

const enemy1 = createObjectImg(ctx, 'enemy1', 50, 50, "tek.jpg", 275, 0);
const enemy2 = createObjectImg(ctx, 'enemy2', 50, 50, "tek.jpg", 325, 0);
const enemy3 = createObjectImg(ctx, 'enemy3', 50, 50, "tek.jpg", 375, 0);
const enemy4 = createObjectImg(ctx, 'enemy4', 50, 50, "tek.jpg", 425, 0);

const obstacle1 = createObjectColor(ctx, 'obstacle1', 150, 5, "red", 100, 100);
const obstacle2 = createObjectColor(ctx, 'obstacle2', 150, 5, "red", 200, 200);
const obstacle3 = createObjectColor(ctx, 'obstacle3', 150, 5, "red", 300, 300);

const movable1 = createObjectImg(ctx, 'movable1', 50, 50, "money.jpg", 275, 150);
const movable2 = createObjectImg(ctx, 'movable2', 50, 50, "money.jpg", 325, 150);
const movable3 = createObjectImg(ctx, 'movable3', 50, 50, "money.jpg", 375, 150);
const movable4 = createObjectImg(ctx, 'movable4', 50, 50, "money.jpg", 425, 150);
const movable5 = createObjectImg(ctx, 'movable5', 50, 50, "money.jpg", 475, 150);

const player = createObjectColor(ctx, 'player', 50, 50, "black", canvas.height / 2, canvas.width / 2);

function start() 
{
    end = false

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "black";
    ctx.font = "bold 18px Comic Sans MS"
    ctx.fillText(`Pontszám: ${points}`, 10, 30);

    const enemies = [enemy1, enemy2, enemy3, enemy4];
    const obstacles = [obstacle1, obstacle2, obstacle3]
    const movables = [movable1, movable2, movable3, movable4, movable5]

    enemies.forEach(enemy => move(enemy, player.left, player.top, enemySpeed));

    for (let i = 0; i < enemies.length - 1; i++) 
    {
        for (let j = i + 1; j < enemies.length; j++) 
        {
            if (checkCollision(enemies[i], enemies[j])) 
            {
                handleCollision(enemies[i], enemies[j]);
            }
        }
    } //enemy enemy collision 

    for (let i = 0; i < enemies.length - 1; i++) 
    {
            if (checkCollision(enemies[i], player)) 
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
    } //obstacle player collision

    for (let i = 0; i < obstacles.length; i++) 
    {
        for (let j = 0; j < enemies.length; j++) 
        {
            if (checkCollision(enemies[j], obstacles[i])) 
            {
                handleCollision(enemies[j], obstacles[i]);
            }
        }
    } //obstacle enemy collision 

    for (let i = 0; i < movables.length; i++) 
    {
         if (checkCollision(movables[i], player)) 
         {
                handleCollision(movables[i], player);
         }
     } //movable player collision

     for (let i = 0; i < movables.length; i++) 
     {
         for (let j = 0; j < enemies.length; j++) 
         {
             if (checkCollision(enemies[j], movables[i])) 
             {
                 handleCollision(movables[i], enemies[j]);
             }
         }
     } //movable enemy collision



     for (let i = 0; i < movables.length; i++) 
     {
          if (checkCollision(movables[i], moneyBase)) 
          {
            if (!movables[i].collided) {
                points += 1;
                movables[i].collided = true;  // Set a flag to indicate the collision
            }
            movables.splice(i, 1);
            i -= 1;
          }
      } //movable moneyBase collision

      movables.forEach(movable => movable.collided = false);


    requestAnimationFrame(start);

    enemyBase.draw();
    moneyBase.draw();
    enemies.forEach(enemy => enemy.draw());
    obstacles.forEach(obstacle => obstacle.draw());
    movables.forEach(movable => movable.draw());
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