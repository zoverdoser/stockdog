var ballAbsoluteSpeed = 20,
    downstreamSpeed = 0.1,
    oneRoundTime = 45 * 1000,
    downstreamInterval = 2*oneRoundTime,
    bottomLineHeight = 560,
    ballRadius = 30,
    ballFillRate = 0.92,
    initShownBallRowAmount = 1,
    APIURL = "http://150212fg0081.umaman.com/ppl/index/";

var initBallRowAmount = Math.ceil(oneRoundTime / 1000 * 60 * downstreamSpeed / Math.sqrt(3) / ballRadius + oneRoundTime / downstreamInterval) + initShownBallRowAmount + 2,
    loadingComplete = false,
    introClick = false,
    submitLock = false,
    playerScore = 0,
    firstPlay = true,
    stage;

var Utils = {
    start: function (){
        $('.start-page').fadeIn('fast', function(){
            $('.start-page').addClass('animate-1');
            $('.start-page').on('webkitAnimationEnd animationend', function(){
                $('.start-page').removeClass('animate-1').addClass('animate-2');
            });
        });
    },
    showFailPop: function(score){
        $(".pop-fail .fail-score").text(score);
        this._show('.pop-fail');
    },
    showTopList: function(){
        this._show('.pop-topList');
    },
    showIntroPop: function(){
        this._show('.pop-shuoming');
    },
    showSuccessPop: function(score){
        $(".pop-success .success-text").text(score);
        this._show('.pop-success');
    },
    _show: function(selector){
        $(selector).fadeIn('fast', function(){
            $(this).addClass('animate');
        });
    }
};

var preloadImgs = [], imgSrc = ["tutorial.png", "bg.png"], loadedNum = 0;

adjustFontSize();
initGame();
bindEventHandlers();
for(var imgIndex in imgSrc) {
    preloadImgs[imgIndex] = new Image();
    preloadImgs[imgIndex].onload = function() {
        loadedNum++;
        if(loadedNum == 2) {
            Utils.start();
        }
    };
    preloadImgs[imgIndex].src = "images/" + imgSrc[imgIndex];
}

function adjustFontSize() {
    var fontSize = $(window).width() / 10;
    $("html")[0].style.fontSize = fontSize + "px";
}

function initGame() {
    var canvas = document.getElementById("gameCanvas"),
        stage = new createjs.Stage(canvas, false, false),
        infoPaneContainer = new createjs.Container(),
        UIContainer = new createjs.Container(),
        gameHeight = $(window).height(),
        gameWidth = $("#game").width(),
        canvasHeight = ~~(gameHeight / gameWidth * 640),
        canvasWidth = 640,
        screenWidth = $("body").width(),
        loader,
        gameNumberData,
        timeNumber = [],
        scoreNumber = [],
        ballExplodeData = [],
        flyingBall,
        explodeBalls = [],
        fallDownBalls = [],
        newBalls = [],
        addScoreElement,
        isReady = false,
        isStarted = false,
        isPaused = false,
        isAlive = true,
        updateTimeStamp,
        leftTime = oneRoundTime,
        initOffsetY = (initShownBallRowAmount - initBallRowAmount) * Math.sqrt(3) * ballRadius + 124;
    var initPos = [
        {
            x: 225,
            y: 617
        }, {
            x: 250,
            y: 735
        }, {
            x: 330,
            y: 758
        }, {
            x: 420,
            y: 758
        }
    ];

    createjs.Touch.enable(stage);
    canvas.setAttribute("height", canvasHeight);
    loadSource();

    var Ball = function(fix, pos) {
        var types = [
            ["0", "1", "2", "3"], ["0", "1", "2", "3"], ["0", "1", "2"], ["0", "1", "2", "3"]
        ];
        this.type = ~~(Math.random()*4);
        this.body = new createjs.Bitmap(loader.getResult("ball" + this.type + types[this.type][~~(Math.random()*types[this.type].length)]));
        this.isFixed = fix;
        this.vx = 0;
        this.vy = 0;
        if(fix) {
            this.pos = pos;
            var location = this.getLocation();
            this.body.x = location.x;
            this.body.y = location.y;
        } else {
            this.body.x = pos.x;
            this.body.y = pos.y;
        }
        Grid.container.addChild(this.body);
    };

    Ball.prototype = {
        radius: ballRadius,
        launch: function(deg) {
            this.vx = ballAbsoluteSpeed * Math.cos(deg);
            this.vy = ballAbsoluteSpeed * Math.sin(deg);
        },
        getLocation: function() {
            return {
                x: (this.pos.y % 2 + this.pos.x * 2) * this.radius,
                y: (Math.sqrt(3) * this.pos.y) * this.radius
            };
        },
        checkExplode: function() {
            var myType = this.type;
            var checkBalls = this.getNearBalls();
            for(var index in checkBalls) {
                if(checkBalls[index].type == myType && explodeBalls.indexOf(checkBalls[index]) == -1) {
                    explodeBalls.push(checkBalls[index]);
                    checkBalls[index].checkExplode();
                }
            }
        },
        checkSolid: function() {
            var nearBalls = this.getNearBalls();
            for(var index in nearBalls) {
                if(nearBalls[index].isFixed && fallDownBalls.indexOf(nearBalls[index]) != -1) {
                    var removeIndex = fallDownBalls.indexOf(nearBalls[index]);
                    if(removeIndex != -1) {
                        fallDownBalls.splice(removeIndex, 1);
                    }
                    nearBalls[index].checkSolid();
                }
            }
        },
        getNearBalls: function() {
            var nearBalls = [];
            if(this.pos.y > 0 && Grid.loadBalls[this.pos.y-1] && Grid.loadBalls[this.pos.y-1][this.pos.x] instanceof Ball) {
                nearBalls.push(Grid.loadBalls[this.pos.y-1][this.pos.x]);
            }
            if(!!Grid.loadBalls[this.pos.y+1] && Grid.loadBalls[this.pos.y+1][this.pos.x] instanceof Ball) {
                nearBalls.push(Grid.loadBalls[this.pos.y+1][this.pos.x]);
            }
            var rowIndex = this.pos.x - Math.pow(-1, this.pos.y%2);
            if(rowIndex >=0 && rowIndex < Grid.gridWidth) {
                if(this.pos.y > 0 && !!Grid.loadBalls[this.pos.y-1] && Grid.loadBalls[this.pos.y-1][rowIndex] instanceof Ball) {
                    nearBalls.push(Grid.loadBalls[this.pos.y-1][rowIndex]);
                }
                if(!!Grid.loadBalls[this.pos.y+1] && Grid.loadBalls[this.pos.y+1][rowIndex] instanceof Ball) {
                    nearBalls.push(Grid.loadBalls[this.pos.y+1][rowIndex]);
                }
            }
            if(this.pos.x != 0 && Grid.loadBalls[this.pos.y] && Grid.loadBalls[this.pos.y][this.pos.x-1] && Grid.loadBalls[this.pos.y][this.pos.x-1] instanceof Ball) {
                nearBalls.push(Grid.loadBalls[this.pos.y][this.pos.x-1]);
            }
            if(this.pos.x != Grid.gridWidth-1 && Grid.loadBalls[this.pos.y] && Grid.loadBalls[this.pos.y][this.pos.x+1] && Grid.loadBalls[this.pos.y][this.pos.x+1] instanceof Ball) {
                nearBalls.push(Grid.loadBalls[this.pos.y][this.pos.x+1]);
            }
            return nearBalls;
        },
        explode: function() {
            this.isFixed = false;
            Grid.container.removeChild(this.body);
            this.explodeBody = new createjs.Sprite(ballExplodeData[this.type], "explode");
            this.explodeBody.x = this.body.x + Ball.prototype.radius;
            this.explodeBody.y = this.body.y + Ball.prototype.radius;
            Grid.container.addChild(this.explodeBody);
            this.explodeBody.play();
            if(Grid.loadBalls[this.pos.y] && Grid.loadBalls[this.pos.y][this.pos.x]) {
                Grid.loadBalls[this.pos.y][this.pos.x] = null;
            }
        },
        fallDown: function() {
            this.isFixed = false;
            createjs.Tween.get(this.body).to({y: this.body.y+50, alpha: 0}, 500);
        },
        getGridPos: function() {
            var GridY = Math.round(this.body.y / Math.sqrt(3) / Ball.prototype.radius - 0.2);
            var GridX = Math.round((this.body.x - (GridY%2) * Ball.prototype.radius) / 2 / Ball.prototype.radius);
            if(GridX >= Grid.gridWidth) {
                GridX = Grid.gridWidth-1;
            }
            if(GridX < 0) {
                GridX = 0;
            }
            return {
                x: GridX,
                y: GridY
            };
        },
        tweenInGrid: function(targetPos) {
            flyingBall = null;
            this.vx = 0;
            this.vy = 0;
            var gridPos = this.getGridPos();
            this.pos = {};
            this.pos.x = gridPos.x;
            this.pos.y = gridPos.y;
            this.isFixed = true;
            initNewBall(3);

            var ballLocation = this.getLocation();
            if(!!targetPos) {
                var basis = 2 * ballRadius / (Math.sqrt(Math.pow(this.body.x - targetPos.x, 2) + Math.pow(this.body.y - targetPos.y, 2)));
                var hitX = basis * (this.body.x - targetPos.x) + targetPos.x;
                var hitY = basis * (this.body.y - targetPos.y) + targetPos.y;
                createjs.Tween.get(this.body).to({x: hitX, y: hitY}, 5).to({x: ballLocation.x, y: ballLocation.y}, 50);
            } else {
                createjs.Tween.get(this.body).to({x: ballLocation.x, y: ballLocation.y}, 50);
            }
            explodeBalls = [this];
            this.checkExplode();
            if(explodeBalls.length > 2) {
                for(var index in explodeBalls) {
                    explodeBalls[index].explode();
                }
                addScore(this.type, explodeBalls.length, this.getLocation());
                Grid.checkFallDown();
            } else {
                if(!Grid.loadBalls[gridPos.y]) {
                    Grid.loadBalls[gridPos.y] = [];
                }
                Grid.loadBalls[gridPos.y][gridPos.x] = this;
            }
        },
        getCurrentPos: function() {
            return {
                x: this.body.x,
                y: this.body.y
            };
        }
    };

    var Grid = {
        gridWidth: 8,
        loadBalls: [],
        container: new createjs.Container(),
        mask: new createjs.Shape(),

        init: function() {
            Grid.mask.graphics.f("#0000FF").s().p("EgqYg5fIAJAAII6pEMAhagCCIABgKMAhlABaIIIJsMAAmB9fMhTkAA6g")
            Grid.mask.x = 320;
            Grid.mask.y = 490;
            Grid.container.mask = Grid.mask;
            Grid.container.x = (640 - (2*Grid.gridWidth+1)*Ball.prototype.radius)/2;
            Grid.container.y = initOffsetY;
            UIContainer.addChild(Grid.container);
        },
        fillInitBalls: function(rowNum) {
            for(var i=0; i<rowNum; i++) {
                for(var j=0; j<Grid.gridWidth; j++) {
                    if(i > 0) {
                        if(canFillBall(j, i) && Math.random() > (1 - ballFillRate) ) {
                            fillNewBall(j, i);
                        }
                    } else {
                        fillNewBall(j, i);
                    }
                }
            }
            stage.update();
            isReady = true;

            function canFillBall(posX, posY) {
                var rowIndex = posX - Math.pow(-1, posY%2);
                if(!Grid.loadBalls[posY-1]) {
                    Grid.loadBalls[posY-1] = [];
                }
                if(Grid.loadBalls[posY-1][posX] instanceof Ball) {
                    return true;
                } else if(rowIndex >=0 && rowIndex < Grid.gridWidth && Grid.loadBalls[posY-1][rowIndex] instanceof Ball) {
                    return true;
                } else {
                    return false;
                }
            }

            function fillNewBall(posX, posY) {
                if(!Grid.loadBalls[posY]) {
                    Grid.loadBalls[posY] = [];
                }
                Grid.loadBalls[posY][posX] = new Ball(true, {x: posX, y: posY});
            }
        },
        checkFallDown: function() {
            var firstSolidBall;
            fallDownBalls = [];
            for(var lineIndex in this.loadBalls) {
                if(lineIndex!=0) {
                    for(var rowIndex in this.loadBalls[lineIndex]) {
                        if(this.loadBalls[lineIndex][rowIndex] instanceof Ball && this.loadBalls[lineIndex][rowIndex].isFixed) {
                            fallDownBalls.push(this.loadBalls[lineIndex][rowIndex]);
                        }
                    }
                }
            }
            for(var index in this.loadBalls[0]) {
                if(this.loadBalls[0][index] instanceof Ball && this.loadBalls[0][index].isFixed) {
                    firstSolidBall = this.loadBalls[0][index];
                    firstSolidBall.checkSolid();
                }
            }
            for(var index in fallDownBalls) {
                Grid.loadBalls[fallDownBalls[index].pos.y][fallDownBalls[index].pos.x].fallDown();
                Grid.loadBalls[fallDownBalls[index].pos.y][fallDownBalls[index].pos.x] = null;
            }
        }
    };

    function addScore(type, score, pos) {
        playerScore += score*10;
        updateScore();
        switch(type) {
            case 0 :
                addScoreElement = new lib.xh();
                break;
            case 1 :
                addScoreElement = new lib.lb();
                break;
            case 2 :
                addScoreElement = new lib.qj();
                break;
            case 3 :
                addScoreElement = new lib.kq();
                break;
        }
        addScoreElement.conMC.num.gotoAndStop(3);
        addScoreElement.regX = 90;
        addScoreElement.regY = 60;
        addScoreElement.x = pos.x;
        addScoreElement.y = pos.y;
        if(pos.x > 420) {
            addScoreElement.x = 420;
        }
        if(pos.x < 50) {
            addScoreElement.x = 50;
        }
        score = (score>9)? 9 : score;
        addScoreElement.conMC.num.gotoAndStop(score);
        Grid.container.addChild(addScoreElement);
    }

    function initNewBall(index) {
        if(index) {
            if(newBalls.length >= 4) return;
            newBalls.forEach(function(ball, i) {
                createjs.Tween.get(ball.body).to({x: initPos[i].x, y: initPos[i].y - Grid.container.y}, 500).call(function() {
                    if(i == 2) {
                        var newBall = new Ball(false, {x: initPos[index].x, y: initPos[index].y - Grid.container.y});
                        newBalls.push(newBall);
                    }
                });
            });
        } else {
            newBalls = [];
            for(var i=0; i<4; i++) {
                var newBall = new Ball(false, {x: initPos[i].x, y: initPos[i].y - Grid.container.y});
                newBalls.push(newBall);
            }
        }
    }

    function checkBottomLine() {
        var detected = false;
        for(var lineIndex in Grid.loadBalls) {
            for(var rowIndex in Grid.loadBalls[lineIndex]) {
                if(Grid.loadBalls[lineIndex][rowIndex] instanceof Ball) {
                    var targetY = Grid.loadBalls[lineIndex][rowIndex].getLocation().y;
                    if(targetY + Grid.container.y > bottomLineHeight) {
                        isAlive = false;
                        detected = true;
                        break;
                    }
                }
            }
            if(detected) {
                console.log("bottom")
                break;
            }
        }
    }

    function checkHit() {
        if(flyingBall instanceof Ball) {
            var detected = false;
            var location = flyingBall.getCurrentPos();
            for(var lineIndex in Grid.loadBalls) {
                for(var rowIndex in Grid.loadBalls[lineIndex]) {
                    if(Grid.loadBalls[lineIndex][rowIndex] instanceof Ball) {
                        var targetLocation = Grid.loadBalls[lineIndex][rowIndex].getLocation();
                        var distanceSQR = Math.pow((location.x + flyingBall.vx/2 - targetLocation.x), 2) + Math.pow((location.y - flyingBall.vy/2 - targetLocation.y), 2) + 4;
                        if(distanceSQR < 4 * Math.pow(Ball.prototype.radius, 2)) {
                            flyingBall.tweenInGrid(targetLocation);
                            detected = true;
                            break;
                        }
                    }
                }
                if(detected) {
                    break;
                }
            }
            if(detected) {
                return true;
            } else if(!detected && flyingBall.body.y <= 0) {
                flyingBall.tweenInGrid();
                return true;
            } else {
                flyingBall.body.y -= (downstreamSpeed + flyingBall.vy)/2;
                flyingBall.body.x += flyingBall.vx/2;
                return false;
            }
        } else {
            return false;
        }
    }

    function loadSource() {
        var manifest = [
            {id: "top", src: "images/top.png"},
            {id: "pane", src: "images/pane.png"},
            {id: "u", src: "images/u.png"},
            {src: "images/go.png"},
            {id: "ball00", src: "images/b00.png"},
            {id: "ball01", src: "images/b01.png"},
            {id: "ball02", src: "images/b02.png"},
            {id: "ball03", src: "images/b03.png"},
            {id: "ball10", src: "images/b10.png"},
            {id: "ball11", src: "images/b11.png"},
            {id: "ball12", src: "images/b12.png"},
            {id: "ball13", src: "images/b13.png"},
            {id: "ball20", src: "images/b20.png"},
            {id: "ball21", src: "images/b21.png"},
            {id: "ball22", src: "images/b22.png"},
            {id: "ball30", src: "images/b30.png"},
            {id: "ball31", src: "images/b31.png"},
            {id: "ball32", src: "images/b32.png"},
            {id: "ball33", src: "images/b33.png"},
            {id: "ball0e", src: "images/b0e.png"},
            {id: "ball1e", src: "images/b1e.png"},
            {id: "ball2e", src: "images/b2e.png"},
            {id: "ball3e", src: "images/b3e.png"},
            {id: "timePane", src: "images/timePane.png"},
            {id: "scorePane", src: "images/scorePane.png"},
            {id: "gameNumber", src: "images/gameNumber.png"},
            {src: "images/pop-shuoming-bg.png"},
            {src: "images/pop-bg-common.png"},
            //{src: "images/pop-fail-bg.png"},
            {src: "images/pop-success-bg.png"},
            {src: "images/pop-topList-bg.png"},
            {src: "images/stars.png"}
        ];

        //var progressBar = $("#progress .loadingBox .progressPane .progressBar")[0];
        loader = new createjs.LoadQueue(false);
        loader.addEventListener("progress", function(event) {
            var percentage = ~~(event.loaded*100);
            //progressBar.style.width = percentage + "%";
        });
        loader.addEventListener("complete", doneLoading);
        loader.loadManifest(manifest);
    }

    function doneLoading() {
        setGameUI();
        createjs.Ticker.addEventListener("tick", tick);
        createjs.Ticker.setFPS(60);
        if(introClick) {
            loadingComplete = true;
            $("#loading").hide();
            if(firstPlay) {
                Utils.showIntroPop();
            } else {
                firstPlay = false;
                startCountDown();
            }
            
        } else {
            loadingComplete = true;
            $("#loading").hide();
        }
    }

    function setGameUI() {
        for(var i=0; i<4; i++) {
            ballExplodeData[i] = new createjs.SpriteSheet({
                images: [loader.getResult("ball" + i + "e")],
                frames: [[0,0,64,63,0,33.6,30.5],[0,63,97,89,0,48.6,46.5],[0,152,105,87,0,53.6,41.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5],[105,152,0,0,0,344.6,498.5]],
                animations: {
                    explode: [0, 24, false]
                }
            });
        }
        stage.addChild(UIContainer);
        stage.addChild(infoPaneContainer);
        var timePane = new createjs.Bitmap(loader.getResult("timePane"));
        var scorePane = new createjs.Bitmap(loader.getResult("scorePane"));
        gameNumberData = new createjs.SpriteSheet({
           "images": [loader.getResult("gameNumber")],
           frames: { width: 20, height: 28, count:10, regX: 10, regY: 14}
        });
        timeNumber = [new createjs.Sprite(gameNumberData), new createjs.Sprite(gameNumberData)];
        scoreNumber = [new createjs.Sprite(gameNumberData)];
        timeNumber[0].gotoAndStop(5);
        timeNumber[1].gotoAndStop(4);
        timeNumber[0].x = 200;
        timeNumber[0].y = 32;
        timeNumber[1].x = 180;
        timeNumber[1].y = 32;
        scoreNumber[0].gotoAndStop(0);
        scoreNumber[0].x = 540;
        scoreNumber[0].y = 32;
        timePane.x = 51;
        scorePane.x = 384;
        infoPaneContainer.y = 6 + 46 * (canvasHeight - 834) / 206;
        infoPaneContainer.addChild(timePane);
        infoPaneContainer.addChild(scorePane);
        infoPaneContainer.addChild(timeNumber[0]);
        infoPaneContainer.addChild(timeNumber[1]);
        infoPaneContainer.addChild(scoreNumber[0]);
        var offsetY = (canvasHeight - 834)/2,
            offsetX = 23.5,
            pane = new createjs.Bitmap(loader.getResult("pane")),
            u = new createjs.Bitmap(loader.getResult("u")),
            top = new createjs.Bitmap(loader.getResult("top"));
        pane.x = offsetX;
        u.x = 270.5;
        u.y = 630;
        UIContainer.y = offsetY;
        UIContainer.addChild(pane);
        UIContainer.addChild(u);
        Grid.init();
        top.x = 23.5;
        UIContainer.addChild(top);
        initNewBall();
        stage.update();
        bindGameEvents();
        Grid.fillInitBalls(initBallRowAmount);
    }

    function setGamePlay() {
        playerScore = 0;
        isAlive = true;
        isPaused = false;
        isStarted = true;
        leftTime = oneRoundTime;
        updateTimeStamp = +new Date();
    }

    function bindGameEvents() {
        stage.addEventListener("pressup", function(e) {
            if(!isReady) return;
            if(newBalls.length > 4) {
                newBalls.length = 4;
            }
            if(!isPaused && newBalls.length == 4) {
                var clickX = e.rawX - 320, clickY = (canvasHeight - 834)/2 + 595 - e.rawY;
                if(clickY > 0) {
                    clickY += 60;
                    var launchAngle = Math.atan(clickY/clickX);
                    if(launchAngle < 0) {
                        launchAngle += Math.PI;
                    }
                    flyingBall = newBalls.shift();
                    flyingBall.launch(launchAngle);
                }
            }
        });

        $(".pop-shuoming .shuoming-btn-fhyx").on("click", function() {
            if(isPaused) {
                $(".pop-shuoming").fadeOut().removeClass("animate");
                isPaused = false;
            } else {
                $(".pop-shuoming").fadeOut("normal", startCountDown).removeClass("animate");
            }
        });

        $("#game .pauseBtn").on("click", function() {
            if(isStarted) {
                isPaused = true;
                Utils.showIntroPop();
            }
        });

        $("#game .countDown").on("animationend webkitAnimationEnd", function() {
            $(this).removeClass("countGo");
            setGamePlay();
        });

        $(".pop-fail .fail-btn-zsyc, .pop-success .success-btn-fhzy, .pop-topList .topList-btn-zsyc").on("click", function() {
            resetGame();
            $(".pop-fail, .pop-success, .pop-topList").hide().removeClass("animate");
            startCountDown();
        });

        $(".pop-fail .fail-btn-fhzy, .pop-topList .topList-btn-fhzy").on("click", function() {
            if(!submitLock) {
                resetGame();
                $(".pop-fail, .pop-topList").hide().removeClass("animate");
                $(".start-page").removeClass("animate-2").show().addClass("animate-1");
            }
        });
    }

    function updatePos() {
        //var downStreamDistance = (oneRoundTime - leftTime) * downstreamSpeed + Math.floor((oneRoundTime - leftTime) / downstreamInterval) * 4 / 3 * Math.sqrt(3) * ballRadius;
        //Grid.container.y = initOffsetY + downStreamDistance;
        Grid.container.y += downstreamSpeed;
        
        for (var index in newBalls) {
            newBalls[index].body.y -= downstreamSpeed;
        }
        
        if(flyingBall && flyingBall instanceof Ball) {
            if(flyingBall.body.x <= 0) {
                flyingBall.vx *= -1;
                flyingBall.body.x = 0;
            } else if(flyingBall.body.x > Ball.prototype.radius * (2 * Grid.gridWidth - 1)) {
                flyingBall.vx *= -1;
                flyingBall.body.x = Ball.prototype.radius * (2 * Grid.gridWidth - 1);
            }
            if(flyingBall.body.y <= 0) {
                flyingBall.body.y = 0;
                flyingBall.vy = 0;
                flyingBall.vx = 0;
            }
            if(!checkHit()) {
                checkHit();
            }
        }
        checkBottomLine();
    }

    function updateLeftTime() {
        var nowTime = +new Date();
        if(!isPaused) {
            var lastShownLeftTime = ~~(leftTime/1000);
            leftTime -= nowTime - updateTimeStamp;
            if(lastShownLeftTime != ~~(leftTime/1000)) {
                showTime(~~(leftTime/1000));
            }
        }
        updateTimeStamp = nowTime;

        function showTime(number) {
            if(number < 0) return;
            var showNumber = (""+number).split("").reverse();
            timeNumber[0].gotoAndStop(Number(showNumber[0]));
            if(!!Number(showNumber[1])) {
                timeNumber[1].alpha = 1;
                timeNumber[1].gotoAndStop(Number(showNumber[1]));
            } else {
                timeNumber[1].alpha = 0;
            }
        }
    }

    function updateScore() {
        var showScoreNumber = (""+playerScore).split("");
        for(var i = showScoreNumber.length; i>0; i--) {
            if(!scoreNumber[showScoreNumber.length - i]) {
                scoreNumber[showScoreNumber.length - i] = new createjs.Sprite(gameNumberData);
                scoreNumber[showScoreNumber.length - i].y = 32;
                infoPaneContainer.addChild(scoreNumber[showScoreNumber.length - i]);
            }
            scoreNumber[showScoreNumber.length - i].x = 560 - 20*i;
            if(i != showScoreNumber.length || showScoreNumber[showScoreNumber.length - i] != "0" ) {
                scoreNumber[showScoreNumber.length - i].alpha = 1;
                scoreNumber[showScoreNumber.length - i].gotoAndStop(Number(showScoreNumber[showScoreNumber.length - i]));
            } else {
                scoreNumber[showScoreNumber.length - i].alpha = 0;
            }
        }
    }

    function diedHandler() {
        setGameOver();
        Utils.showSuccessPop(playerScore);
    }

    function timeoutHandler() {
        setGameOver();
        Utils.showSuccessPop(playerScore);
    }

    function setGameOver() {
        isStarted = false;
        isAlive = false;
        isPaused = false;
        isReady = false;
        updateTimeStamp = false;
        flyingBall = null;
        console.log("restart");
    }

    function resetGame() {
        playerScore = 0;
        leftTime = oneRoundTime;
        isAlive = true;
        isPaused = false;
        isStarted = false;
        Grid.container.removeAllChildren();
        Grid.container.y = initOffsetY;
        Grid.loadBalls = [];
        initNewBall();
        timeNumber[1].alpha = 1;
        timeNumber[0].gotoAndStop(5);
        timeNumber[1].gotoAndStop(4);
        for(var i in scoreNumber) {
            if(i == 0) {
                scoreNumber[i].gotoAndStop(0);
                scoreNumber[i].x = 540;
            } else {
                infoPaneContainer.removeChild(scoreNumber[i]);
                scoreNumber[i] = null;
            }
        }
        Grid.fillInitBalls(initBallRowAmount);
    }

    function tick() {
        if(isStarted && isAlive) {
            if(!isPaused) {
                if(leftTime > 0) {
                    updatePos();
                    if(!isAlive) {
                        diedHandler();
                    }
                } else {
                    timeoutHandler();
                }
            }
            updateLeftTime();
        }
        stage.update();
    }
}

function bindEventHandlers() {
    $("#mobile").on("input", function() {
        var $inputDisplay = $("#inputDisplay");
        var val = this.value.replace(/\D+/g, '');
        $(this).val(val);
        var html = "";
        for(var i=0; i<val.length; i++) {
            html += "<span>" + val[i] + "</span>";
        }
        $inputDisplay.html(html);
    });

    $(".start-page .btn-start").on("click", function() {
        $("#loading .loadingBall").addClass("animate");
        $(".start-page").fadeOut("normal", function() {
            introClick = true;
            if(loadingComplete) {
                if(firstPlay) {
                    Utils.showIntroPop();
                } else {
                    firstPlay = false;
                    startCountDown();
                }
            }
        });
    });

    $(".pop-success .success-btn-zsyc").on("click", function() {
        if(!submitLock) {
            var mobile = $("#mobile").val();
            if(/^(13|14|15|17|18)\d{9}$/.test(mobile)) {
                submitInfo(mobile);
            } else {
                diyAlert("手机号码格式错误");
                submitLock = false;
            }
        }
    });
}

function submitInfo(mobile) {
    submitLock = true;
    var sendData = {
        mobile: mobile,
        point: playerScore
    };
    Loading.show();
    $.getJSON(APIURL + "record?jsonpcallback=?", sendData, function(data) {
        if(data.success) {
            $.getJSON(APIURL + "get-rank?jsonpcallback=?", { mobile: mobile, page: 1, pagesize: 5 }, function(data) {
                if(data.success) {
                    loadRank(data.result);
                    $(".pop-success").hide().removeClass("animate");
                    Utils.showTopList();
                    Loading.hide();
                }
            });            
        } else {
            console.log("submit failed");
        }
        submitLock = false;
    });
}

function loadRank(result) {
    var rankData = [ {
        rank: result.myRank.rank,
        mobile: result.myRank.mobile,
        score: result.myRank.max_point
    } ];
    for(var i in result.rankList.datas) {
        rankData.push({
            rank: Number(i) + 1,
            mobile: result.rankList.datas[i].mobile.substr(0,3) + "****" + result.rankList.datas[i].mobile.substr(-4),
            score: result.rankList.datas[i].max_point
        });
    }
    var $list = $(".pop-topList .top-list span");
    for(var i in rankData) {
        $list.eq(i*3).text(rankData[i].rank);
        $list.eq(i*3 + 1).text(rankData[i].mobile);
        $list.eq(i*3 + 2).text(rankData[i].score + "分");
    }
}

function startCountDown() {
    $("#game .countDown").removeClass("countGo").addClass("countGo");
}

function diyAlert(_html) {
    $("body").append('<div class="diyAlertBg absolute" style=height:'+$(document).height()+'px></div><div class="diyAlaertText absolute" style=top:'+($(window).height()/2-35)+'px><div class="htmlAlert">'+_html+'</div><a href="javascript:;" class="block diyAlertClose">好</a></div>');
    diyAlertClose();
}    
function diyAlertClose() {
    $(".diyAlertClose").on("click",function() {
        $(".diyAlertBg, .diyAlaertText").remove();
    });
}