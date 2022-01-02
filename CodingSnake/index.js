const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d')

class SnakePart{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

let speed = 7;

let tileCount = 20;//canvas長或寬分成幾份
let tileSize = canvas.width / tileCount-2;//好像只要小於一塊方格，應該是顯示蛇的間係用??
let headX =10;//起始點在正中，整個區塊分成0~19(共20份)
let headY =10;

let appleX =5;
let appleY =5;

const snakeParts = [];
let tailLength = 2;

let xVelocity = 0;//velocity速度，這裡是走的方向
let yVelocity=0;

let score = 0;

const gulpSound = new Audio("gulp.mp3");//音檔

//應該還要能重啟遊戲
function drawGame(){
    changeSnakePosition();
    let result = isGameOver();
    if(result){return;}

    clearScreen();
    

    checkAppleCollision()
    drawApple();
    drawSnake();

    drawScore();

    if(score > 1){//提升難度
        speed = 11;
    }
    if(score > 2){
        speed = 15;
    }

    setTimeout(drawGame,1000/speed);//一秒更新幾次
}

function isGameOver(){
    // console.log('A');
    let gameOver = false;

    if(yVelocity === 0 && xVelocity ===0){//遊戲未開，就不會gameover，ex:原點不會頭碰身體而輸掉
        return false;
    }

    if(headX<0){//==-1，因為是0~19的部分才在畫布上
        gameOver =true;
    }
    else if(headX==tileCount){//==20
        gameOver =true;
    }
    else if(headY<0){
        gameOver =true;
    }
    else if(headY==tileCount){
        gameOver =true;
    }

    for(let i = 0;i<snakeParts.length;i++){
        let part = snakeParts[i];
        // console.log(part);
        if(part.x === headX && part.y === headY){//身體碰頭就輸
            gameOver = true;
            break;
        }
    }

    if(gameOver){
        ctx.fillStyle = 'white';
        ctx.font = '50px Verdana';

        //很像csslineargradint
        var gradiant = ctx.createLinearGradient(0,0,canvas.width,0);//第三個應該是寬度
        gradiant.addColorStop('0','magenta');//畫到幾%之類的
        gradiant.addColorStop('0.5','blue');
        gradiant.addColorStop('1.0','red');

        ctx.fillStyle = gradiant;
        ctx.fillText('Game Over!',canvas.width/6.5,canvas.height/2);//應該是(文字,寬度,高度)
    }

    return gameOver;
}

function drawScore(){
    ctx.fillStyle = 'white';
    ctx.font = '10p Verdana';
    ctx.fillText('Score ' + score,canvas.width-50,10);
}

function clearScreen(){
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawSnake(){
    

    //身體用過去的head位置組成
    ctx.fillStyle = 'green';
    for(let i =0;i<snakeParts.length;i++){//一開始snakeParts是空的所以沒東西
        let part = snakeParts[i];
        ctx.fillRect(part.x*tileCount,part.y*tileCount,tileSize,tileSize)
    }

    //長度足夠時就去掉最舊記錄，補上這次的記錄
    snakeParts.push(new SnakePart(headX,headY));
    if(snakeParts.length > tailLength){
        snakeParts.shift();//移除第一個元素(最舊的)
    }

    //頭單獨畫(最後畫一開始才會是橘色點點，其他好像影響不大)
    ctx.fillStyle = 'orange';
    ctx.fillRect(headX*tileCount,headY*tileCount,tileSize,tileSize);//18*18方格?
}

function changeSnakePosition(){
    headX += xVelocity;//會*20所以一次移20
    headY += yVelocity;
}

function checkAppleCollision(){
    if(appleX == headX && appleY == headY){
        appleX = Math.floor(Math.random()*tileCount);
        appleY = Math.floor(Math.random()*tileCount);
        tailLength++;
        score++;
        gulpSound.play();//Audio.play
    }
}

function drawApple(){
    ctx.fillStyle ='red';
    ctx.fillRect(appleX*tileCount,appleY*tileCount,tileSize,tileSize);
}



document.body.addEventListener('keydown',keyDown);

function keyDown(event){
    //up
    if(event.keyCode == 38){
        if(yVelocity == 1) return //貪吃蛇不能直接回頭(可以轉彎再轉彎達成回頭)
        yVelocity = -1;
        xVelocity = 0 ;
    }

    //down
    if(event.keyCode == 40){
        if(yVelocity == -1) return
        yVelocity = 1;
        xVelocity = 0 ;
    }

    //left
    if(event.keyCode == 37){
        if(xVelocity == 1) return
        yVelocity = 0;
        xVelocity = -1 ;
    }

    //right
    if(event.keyCode == 39){
        if(xVelocity == -1) return
        yVelocity = 0;
        xVelocity = 1 ;
    }
}

drawGame();//要先點火