
window.onload= function() {

  var ctx;
  var canvaswidth=900;
  var canvasheight=430;
  var blockSize=30;
  var delay=100;
  var snakee;
  var applee;
  var widthInBlocks=canvaswidth / blockSize;
  var heightInBlocks=canvasheight / blockSize;
  var score;

  init();
  function init(){
    var canvas=document.createElement('canvas');
    canvas.width=canvaswidth;
    canvas.height=canvasheight;
    canvas.style.border="30px solid gray";
    canvas.style.margin="30px auto 0px";
    canvas.style.display="block";
    canvas.style.backgroundColor="#ddd";
    document.body.appendChild(canvas);
    ctx=canvas.getContext('2d');
    snakee =new snake([[6,4],[5,4],[4,4]],"right");
    applee=new Apple([10,10]);
    score=0;
    refreshCanvas();

  }

  function refreshCanvas() {
    snakee.advance();
    if (snakee.checkCollision()){
      gameOver();
    }
    else {
      if (snakee.isEatingApple(applee)) {
        score++;
        snakee.ateApple=true;
        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(snakee));

      }
    ctx.clearRect(0,0,canvaswidth,canvasheight);
    drawScore();
    snakee.draw();
    applee.draw();
    setTimeout(refreshCanvas, delay);
    }
  }
  function gameOver() {
    ctx.save();
    ctx.font="bold 50px sans-serif";
    ctx.fillStyle="#696969";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    var centreX=canvaswidth/2;
    var centreY=canvasheight/2;
    ctx.fillText("Game Over!",centreX,centreY-130);

    ctx.fillText("Appuyer sur Espace pour rejouer",centreX,centreY+120);
    ctx.restore();
  }
  function restart() {
    snakee =new snake([[6,4],[5,4],[4,4]],"right");
    applee=new Apple([10,10]);
    score=0;
    refreshCanvas();
  }
  function drawScore() {
    ctx.save();
    ctx.font="bold 200px sans-serif";
    ctx.fillStyle="#C0C0C0";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    var centreX=canvaswidth/2;
    var centreY=canvasheight/2;
    ctx.fillText(score.toString(),centreX,centreY);
    ctx.restore();
  }
  function drawBlock(ctx,position){
    var x= position[0]*blockSize;
    var y= position[1]*blockSize;
    ctx.fillRect(x,y,blockSize,blockSize);
  }

  function snake(body,direction) {
    this.body=body;
    this.direction=direction;
    this.ateApple=false;
    this.draw=function() {
      ctx.save();
      ctx.fillStyle="#ff0000";
      for (var i = 0; i < this.body.length; i++) {
        drawBlock(ctx,this.body[i]);
      }
      ctx.restore();
    };

    this.advance=function() {
      var nextPosition=this.body[0].slice();
      switch (this.direction) {
        case "left":
          nextPosition[0]-=1;
        break;
        case "right":
          nextPosition[0]+=1;
        break;
        case "down":
          nextPosition[1]+=1;
        break;
        case "up":
          nextPosition[1]-=1;
        break;
        default:

      }
    this.body.unshift(nextPosition);
    if (!this.ateApple) {
      this.body.pop();
    }
    else {
      this.ateApple=false;
    }
    };
    this.setDirection=function(newDirection){
      var allowedDirections;
      switch (this.direction) {
        case "left":
        case "right":
          allowedDirections=["up","down"];
        break;
        case "down":
        case "up":
          allowedDirections=["right","left"];
        break;
        default:
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        this.direction=newDirection;
      }
    };
    this.checkCollision=function() {
      var wallCollision=false;
      var snakeCollision=false;
      var head=this.body[0];
      var rest=this.body.slice(1);
      var snakeX=head[0];
      var snakeY=head[1];
      var minX=0;
      var maxX=widthInBlocks-1;
      var minY=0;
      var maxY=heightInBlocks-1;
      var isNotBetweenHorizontalWalls = snakeX<minX || maxX<snakeX;
      var isNotBetweenVerticalWalls = snakeY<minY || maxY<snakeY;
      if (isNotBetweenVerticalWalls || isNotBetweenHorizontalWalls) {
        wallCollision=true;
      }
      for (var i = 0; i < rest.length; i++) {
        if (snakeX===rest[i][0] && snakeY===rest[i][1]) {
          snakeCollision=true;
        }
      }
      return wallCollision || snakeCollision;
    };
    this.isEatingApple=function(appleToEat){
      var head=this.body[0];
      if (head[0]===appleToEat.position[0] && head[1]===appleToEat.position[1]) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  function Apple(position) {
    this.position=position;
    this.draw=function() {
      ctx.save();
      ctx.fillStyle="#33cc33";
      ctx.beginPath();
      var radius=blockSize/2;
      var x=this.position[0]*blockSize + radius;
      var y=this.position[1]*blockSize + radius;
      ctx.arc(x,y,radius,0,Math.PI*2,true);
      ctx.fill();
      ctx.restore();
    };
    this.setNewPosition=function(){
      var newX=Math.floor(Math.random()*(widthInBlocks - 1));
      var newY=Math.floor(Math.random()*(heightInBlocks - 1));
      this.position=[newX,newY];
    };
    this.isOnSnake=function(snakeToCheck) {
      var isOnSnake=false;
      for (var i = 0; i < snakeToCheck.length; i++) {
        if(this.position[0]===snakeToCheck.body[i][0] && this.position[1]===snakeToCheck.body[i][1]){
            isOnSnake=true;
        }
      }
      return isOnSnake;
    }
  }

  document.onkeydown=function handleKeyDown(e) {
    var key = e.keyCode;
    var newDirection;
    switch (key) {
      case 37:
        newDirection="left";
      break;
      case 38:
        newDirection="up";
      break;
      case 39:
        newDirection="right";
      break;
      case 40:
        newDirection="down";
      break;
      case 32:
        restart();
        return;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  }
}
