const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

var enemySpeed = 1;

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

function drawExplosions() 
{
    explosions.forEach(explosionCoord => 
    {
        explosion.left = explosionCoord.x;
        explosion.top = explosionCoord.y;
        explosion.draw();
    });
}

var points = 0
var playerAmmo = 0
var enemies = []
var obstacles = []
var movables = []
var ammos = []
var slowers = []
var explosions = []

const enemyBase = createObjectColor(ctx, "enemyBase", 50, 250, "red", 250, 0);
const moneyBase = createObjectColor(ctx, "moneyBase", 50, 250, "red", 250, canvas.width-50);

const player = createObjectColor(ctx, 'player', 50, 50, "black", canvas.height / 2, canvas.width / 2);

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

const ammo1 = createObjectImg(ctx, 'ammo1', 50, 50, "ammo.jpg", 425, 400);
const ammo2 = createObjectImg(ctx, 'ammo2', 50, 50, "ammo.jpg", 475, 400);

const slower1 = createObjectImg(ctx, 'slower1', 50, 50, "potion.jpg", 600, 400);

enemies.push(enemy1, enemy2, enemy3, enemy4);
ammos.push(ammo1, ammo2)
slowers.push(slower1)

function start() 
{
    end = false

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "black";
    ctx.font = "bold 18px Comic Sans MS"
    ctx.fillText(`Pontszám: ${points}`, 10, 20);
    ctx.fillText(`Lőszer: ${playerAmmo}`, canvas.width - 90, 20);
    ctx.fillText(`spd: ${enemySpeed}`, canvas.width - 300, 20);
    
    obstacles = [obstacle1, obstacle2, obstacle3]
    movables = [movable1, movable2, movable3, movable4, movable5]

    drawExplosions();
    
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
                //console.log('asd')
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
         for (let j = 0; j < obstacles.length; j++) 
         {
             if (checkCollision(obstacles[j], movables[i])) 
             {
                 handleCollision(movables[i], obstacles[j]);
             }
         }
     } //movable obstacle collision

     for (let i = 0; i < ammos.length; i++) 
     {
          if (checkCollision(ammos[i], player)) 
          {
            if (!ammos[i].collided) {
                playerAmmo += 1;
                ammos[i].collided = true; 
            }
            ammos.splice(i, 1);
            i -= 1;
          }
      } //ammo player collision

      for (let i = 0; i < slowers.length; i++) 
     {
          if (checkCollision(slowers[i], player)) 
          {
            if (!slowers[i].collided) {
                enemySpeed *= 0.5
                slowers[i].collided = true;
            }
            slowers.splice(i, 1);
            i -= 1;
          }
      }//slower player collision
      
     for (let i = 0; i < movables.length; i++) 
     {
          if (checkCollision(movables[i], moneyBase)) 
          {
            if (!movables[i].collided) {
                points += 1;
                movables[i].collided = true; 
            }
            movables.splice(i, 1);
            i -= 1;
          }
      } //movable moneyBase collision

      movables.forEach(movable => movable.collided = false);
      ammos.forEach(ammo => ammo.collided = false);
      slowers.forEach(slower => slower.collided = false);



    requestAnimationFrame(start);

    player.draw();
    enemyBase.draw();
    moneyBase.draw();
    enemies.forEach(enemy => enemy.draw());
    obstacles.forEach(obstacle => obstacle.draw());
    movables.forEach(movable => movable.draw());
    ammos.forEach(ammo => ammo.draw());
    slowers.forEach(slower => slower.draw());
    
    if(end)
    {
        //console.log('asd2')
    }
}

var killedEnemy;
const explosion = createObjectImg(ctx, 'explosion', 200, 200, "explosion.gif", 1000, 1000);

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
        case "p":
        case "P":
            if (playerAmmo > 0) 
            {
                if (enemies.length > 0) 
                {
                    points += 3;
                    const randomIndex = Math.floor(Math.random() * enemies.length);
                    killedEnemy = enemies[randomIndex];
                    explosions.push({ x: killedEnemy.left, y: killedEnemy.top });
                    enemies.splice(randomIndex, 1);
                    playerAmmo -= 1;
                    console.log('KILL')
                }
             }
               break;           
    }
}
);