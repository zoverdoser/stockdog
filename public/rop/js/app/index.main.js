var canvas = document.getElementById("canvas"),
    stage = new createjs.Stage(canvas, false, false),
    gameHeight = $(window).height(),
    gameWidth = $(window).width(),
    canvasHeight = ~~(gameHeight / gameWidth * 640),
    canvasWidth = 640,
    Grid2Bottom = 10,
    littleGrid2Top = 10,
    UNITR = 58,
    LITTLEUNITR = 40,
    loader,
    isFloating = false,
    startLevel = Number(query("level")) ? Number(query("level")) : 0;


var gameSettings = [
    {
        target: [[0,2,1,2], [1,2,2,2], [2,2,3,2], [3,2,4,2]],
        points: [
            [0, 0, []],
            [4, 2, [0]]
        ]
    }, {
        target: [[2,0,2,1], [2,1,2,2], [2,2,1,3], [1,3,0,4]],
        points: [
            [1, 2, []],
            [3, 2, [0]]
        ]
    }, {
        target: [[0,0,1,4], [2,0,1,4]],
        points: [
            [0, 2, []],
            [4, 2, []],
            [2, 2, [0, 1]]
        ]
    }, {
        target: [[1,0,1,1], [1,1,1,2], [1,2,0,3], [0,3,1,3], [1,3,2,3], [2,3,3,3], [3,3,3,2], [3,2,2,1], [2,1,1,0]],
        points:[
            [2, 0 ,[]],
            [0, 4 ,[0]],
            [2, 2 ,[0, 1]]
        ]
    }, {
        target: [[0,1,0,3], [0,3,1,3], [1,3,2,3], [2,3,3,3], [3,3,3,1], [3,1,2,1], [2,1,1,1], [1,1,0,1]],
        points: [
            [0, 0, []],
            [2, 0, [0]],
            [0, 4, [1]],
            [2, 4, [0, 2]]
        ]
    }, {
        target: [[0,0,1,2], [1,2,0,4], [0,4,1,4], [1,4,2,4], [2,4,3,2], [3,2,2,0], [2,0,1,0], [1,0,0,0]],
        points: [
            [0, 2, []],
            [1, 2, [0]],
            [2, 2, [1]],
            [3, 2, [2]], 
            [4, 2, [0, 3]]
        ]
    }, {
        target: [[0,0,1,1], [1,1,2,2], [2,2,3,2], [3,2,4,2], [2,2,1,3], [1,3,0,4]],
        points: [
            [2, 0, []],
            [0, 0, [0]],
            [2, 2, [1]],
            [4, 2, [2]],
            [2, 4, [3]],
            [0, 4, [2]],
            [0, 2, [5]]
        ]
    }, {
        target: [[0,0,1,2], [1,2,0,4], [0,4,1,4], [1,4,2,4], [2,4,3,2], [3,2,2,0], [2,0,1,0], [1,0,0,0], [0,1,0,3], [0,3,1,3], [1,3,2,3], [2,3,3,3], [3,3,3,1], [3,1,2,1], [2,1,1,1], [1,1,0,1]],
        points: [
            [0, 1, []],
            [1, 1, [0]],
            [2, 1, [0]],
            [3, 1, [1,2]],
            [0, 3, []],
            [1, 3, [4]],
            [2, 3, [5]],
            [3, 3, [4,6]]
        ]
    }, {
        target: [[1,1,2,0], [1,1,0,2], [1,1,3,2], [1,1,1,3], [2,0,3,2], [3,2,1,3], [3,2,2,4], [0,2,1,3], [1,3,2,4]],
        points: [
            [0, 0, []],
            [1, 0, [0]],
            [2, 0, [0, 1]],
            [0, 4, []],
            [1, 4, [3]],
            [2, 4, [3, 4]]
        ]
    }, {
        target: [[0,0,1,0], [1,0,2,0], [2,0,1,1], [1,1,0,2], [0,2,1,3], [1,3,2,4], [2,4,1,4], [1,4,0,4], [0,4,2,3], [2,3,4,2], [4,2,2,1], [2,1,0,0]],
        points: [
            [1, 0, []],
            [0, 2, [0]],
            [1, 2, []],
            [2, 2, [2]],
            [3, 2, [1, 2]],
            [4, 2, [0, 3]]
        ]
    }, {
        target: [[0,2,0,3], [0,3,0,4], [0,4,1,4], [1,4,2,4], [2,4,3,3], [3,3,4,2], [4,2,3,2], [3,2,2,2], [2,2,1,2], [1,2,0,2]],
        points: [
            [0, 0, []],
            [0, 2, [0]],
            [2, 1, [1]],
            [1, 3, [0, 2]],
            [2, 4, [3]]
        ]
    }, {
        target: [[0,0,1,0], [1,0,2,0], [2,0,2,1], [2,1,2,2], [2,2,1,1], [1,1,0,0], [2,2,1,3], [1,3,0,4], [2,2,2,3], [2,3,2,4]],
        points: [
            [1, 0, []],
            [1, 2, [0]],
            [3, 2, [0, 1]],
            [0, 3, [0]],
            [3, 3, [0]]
        ]
    }, {
        target: [[1,0,0,2], [1,0,4,2], [1,0,2,2], [2,2,1,4], [0,2,1,2], [1,2,2,2], [2,2,3,2], [3,2,4,2]],
        points: [
            [0, 2, []],
            [1, 2, []],
            [2, 2, [1]],
            [3, 2, [0, 1, 2]],
            [4, 2, [0, 3]]
        ]
    }, {
        target: [[2,2,1,0], [2,2,1,4], [0,2,1,2], [1,2,2,2], [2,2,3,2], [3,2,4,2]],
        points: [
            [0, 2, []],
            [0, 0, [0]],
            [2, 0, [1]],
            [4, 2, [2]],
            [2, 4, [3]],
        ]
    }, {
        target: [[2,0,2,1], [2,1,2,2], [2,2,1,3], [1,3,0,4], [0,4,0,3], [0,3,0,2], [2,2,2,3], [2,3,2,4]],
        points: [
            [0, 2, []],
            [1, 2, []],
            [2, 2, [0]],
            [3, 2, [1]],
            [4, 2, [2]]
        ]
    }, {
        target: [[1,0,1,1], [1,1,1,2], [1,2,0,3], [0,3,1,3], [1,3,2,3], [2,3,3,3], [3,3,3,2], [3,2,2,1], [2,1,1,0], [2,1,2,2], [2,2,1,3]],
        points: [
            [0, 0, []],
            [1, 0, [0]],
            [2, 0, [0, 1]],
            [0, 4, []],
            [2, 4, [3]]
        ]
    }, {
        target: [[0,0,0,1], [0,1,0,2], [0,2,1,2], [1,2,2,2], [2,2,1,1], [1,1,0,0], [2,2,3,2], [3,2,4,2]],
        points: [
            [0, 0, []],
            [1, 0, [0]],
            [2, 0, [0, 1]],
            [0, 4, []],
            [2, 4, [3]]
        ]
    }, {
        target: [[0,2,1,2], [1,2,2,2], [2,2,3,2], [3,2,4,2], [1,2,1,3], [1,3,1,4], [1,4,2,3], [2,3,3,2]],
        points: [
            [0, 0, []],
            [1, 2, [0]],
            [0, 4, [0, 1]],
            [2, 0, []],
            [3, 2, [3]],
            [2, 4, [3, 4]]
        ]
    }, {
        target: [[0,2,1,2], [1,2,2,2], [2,2,3,2], [3,2,4,2], [1,0,1,1], [1,1,1,2], [1,2,1,3], [1,3,1,4], [1,4,2,3], [2,3,3,2], [3,2,2,1], [2,1,1,0]],
        points: [
            [0, 2, []],
            [1, 2, []],
            [3, 2, [0, 1]],
            [4, 2, [0, 1, 2]],
            [1, 0, []],
            [1, 4, [4]]
        ]
    }, {
        target: [[0,0,0,1], [0,1,0,2], [0,2,1,2], [1,2,2,2], [2,2,3,2], [3,2,4,2], [4,2,3,1], [3,1,2,0], [1,0,2,2], [2,2,1,4]],
        points: [
            [0, 2, []],
            [1, 2, []],
            [2, 2, [0]],
            [3, 2, []],
            [4, 2, [2]],
            [0, 4, [1]],
            [1, 4, [5]],
            [2, 4, [3, 5]],
        ]
    }, {
        target: [[0,0,1,0], [1,0,2,0], [2,0,3,1], [3,1,4,2], [4,2,2,1], [0,0,2,1], [2,1,2,2], [2,2,1,3], [1,3,0,2], [1,3,2,4], [0,2,0,3], [0,3,0,4], [0,4,1,4], [1,4,2,4]],
        points: [
            [0, 1, []],
            [1, 1, []],
            [2, 1, [0]],
            [3, 1, [0, 2]],
            [0, 3, []],
            [1, 3, [1]],
            [2, 3, [4, 5]],
            [3, 3, [4, 6]],
        ]
    }, {
        target: [[0,1,1,1], [1,1,2,1], [2,1,3,1], [1,1,1,3], [2,1,2,3], [0,3,1,3], [1,3,2,3], [2,3,3,3]],
        points: [
            [0, 0, []],
            [2, 0, [0]],
            [0, 4, [1]],
            [2, 4, [2]],
            [0, 3, []],
            [0, 1, [4]],
            [3, 3, [5]],
            [3, 1, [6]]
        ]
    }, {
        target: [[0,0,1,1], [1,1,2,2], [2,2,2,3], [2,3,2,4], [1,1,2,1], [2,1,3,1], [0,3,1,3], [1,3,2,3]],
        points: [
            [0, 0, []],
            [1, 0, [0]],
            [2, 0, [1]],
            [0, 4, []],
            [1, 4, [3]],
            [2, 4, [4]]
        ]
    }, {
        target: [[2,0,1,1], [1,1,0,2], [0,2,1,3], [1,3,2,4], [2,4,3,2], [3,2,2,0], [1,1,3,2]],
        points: [
            [0, 1, []],
            [2, 0, []],
            [2, 2, [0, 1]],
            [0, 4, [1, 2]],
            [3, 3, [0, 2]]
        ]
    }, {
        target: [[0,1,0,3], [0,3,1,4], [1,4,3,3], [1,4,2,2], [0,3,2,2], [3,3,2,2], [2,2,1,0], [3,3,3,1]],
        points: [
            [0, 0, []],
            [1, 0, [0]],
            [2, 0, [1]],
            [2, 2, [1]],
            [0, 4, [0]],
            [1, 4, [0, 2]],
            [2, 4, [2]]
        ]
    }, {
        target: [[0,1,1,2], [0,3,1,2], [1,2,1,1], [1,1,1,0], [1,2,1,3], [1,3,1,4], [1,0,2,1], [2,1,3,2], [1,4,2,3], [2,3,3,2], [3,2,3,1], [3,2,3,3]],
        points: [
            [0, 4, []],
            [1, 2, []],
            [0, 0, [0, 1]],
            [1, 0, [2]],
            [2, 0, [3]],
            [3, 2, [4]],
            [2, 4, [4]],
            [2, 2, [2, 4]]
        ]
    }, {
        target: [[0,0,1,0], [1,0,2,0], [0,2,1,2], [1,2,2,2], [2,2,3,2], [3,2,4,2], [1,0,2,2], [2,2,1,4], [0,4,1,4], [1,4,2,4]],
        points: [
            [0, 4, []],
            [1, 2, [0]],
            [0, 0, [1]],
            [1, 0, [2]],
            [2, 0, [3]],
            [2, 2, [3]],
            [1, 4, [3]],
            [2, 4, [6]],
            [3, 2, [7]]
        ]
    }, {
        target: [[0,0,0,1], [0,1,0,2], [0,2,0,3], [0,3,0,4], [0,2,1,2], [0,0,1,2], [1,2,0,4], [1,2,2,2], [2,2,3,2], [2,0,3,2], [3,2,2,4], [2,0,3,1], [3,1,4,2], [4,2,3,3], [3,3,2,4], [3,2,4,2]],
        points: [
            [0, 0, []],
            [1, 0, [0]],
            [2, 0, [0, 1]],
            [0, 2, []],
            [2, 2, [1, 3]],
            [4, 2, [3, 4]]
        ]
    }, {
        target: [[1,0,1,1], [1,1,1,2], [1,2,2,4], [1,0,2,1], [2,1,3,2], [3,2,0,4]],
        points: [
            [0, 4, []],
            [0, 0, [0]],
            [1, 0, [1]],
            [2, 0, [2]],
            [2, 2, [2]],
            [1, 4, [2]],
            [2, 4, [3]]
        ]
    }, {
        target: [[1,0,0,1], [0,1,2,2], [2,2,3,1], [3,1,1,0], [2,2,0,3], [0,3,1,4], [1,4,3,3], [3,3,2,2]],
        points: [
            [0, 2, []],
            [1, 2, []],
            [2, 2, [0, 1]],
            [3, 2, [1, 2]],
            [4, 2, [0, 2]],
            [0, 4, [0, 1]],
            [2, 4, [3, 4]]
        ]
    }, {
        target: [[0,0,1,0], [1,0,2,0], [0,0,0,1], [0,1,0,2], [0,0,1,1], [1,1,2,2], [2,2,2,1], [2,1,2,0], [2,0,3,1], [3,1,4,2], [0,2,0,3], [0,3,0,4], [0,4,1,3], [1,3,2,2], [2,2,2,3], [2,3,2,4], [2,4,3,3], [3,3,4,2]],
        points: [
            [0, 0, []],
            [2, 0, []],
            [0, 2, [0]],
            [2, 2, [0, 1]],
            [4, 2, [1]],
            [0, 4, [2, 3]],
            [2, 4, [4, 5]]
        ]
    }, {
        target: [[1,4,0,2], [1,4,0,0], [1,4,2,0], [1,4,4,2], [0,0,1,0], [1,0,2,0], [0,0,0,1], [0,1,0,2], [2,0,3,1], [3,1,4,2]],
        points: [
            [0, 0, []],
            [0, 2, [0]],
            [1, 2, []],
            [2, 2, [1]],
            [3, 2, [1, 2]],
            [4, 2, [1, 2, 3, 4]],
            [0, 4, [1]],
            [1, 4, [2]]
        ]
    }, {
        target: [[0,0,0,1], [0,1,0,2], [0,2,0,3], [0,3,0,4], [0,0,1,1], [1,1,2,2], [2,2,1,3], [1,3,0,4], [0,2,1,2], [1,2,2,2], [2,0,2,1], [2,1,2,2], [2,0,3,1], [3,1,4,2], [2,2,3,2], [3,2,4,2], [2,2,2,3], [2,3,2,4], [2,4,3,3], [3,3,4,2]],
        points: [
            [0, 1, []],
            [1, 1, []],
            [2, 1, []],
            [3, 1, [0, 1, 2]],
            [0, 4, [0]],
            [1, 4, [1, 2, 4]],
            [2, 4, [3, 4]]
        ]
    }, {
        target: [[0,0,1,1], [1,1,2,2], [1,0,2,2], [2,0,2,1], [2,1,2,2], [2,2,1,3], [1,3,0,4], [2,2,1,4], [2,2,2,3], [2,3,2,4]],
        points: [
            [0, 0, []],
            [1, 0, []],
            [2, 0, []],
            [2, 2, [1]],
            [0, 3, [0, 1]],
            [3, 3, [1, 2]],
            [1, 4, [3]]
        ]
    }, {
        target: [[0,3,0,1], [0,1,1,2], [1,2,1,3], [1,3,1,4], [1,4,2,2], [2,2,1,0], [1,0,2,1], [2,1,3,2], [3,2,3,3], [3,3,3,1]],
        points: [
            [0, 0, []],
            [1, 0, []],
            [2, 0, [0, 1]],
            [0, 2, []],
            [1, 2, [3]],
            [3, 2, []],
            [4, 2, [3, 5]],
            [0, 4, []],
            [1, 4, [7]],
            [2, 4, [7]]
        ]
    }, {
        target: [[0,0,0,1], [0,1,0,2], [0,2,0,3], [0,3,0,4], [0,0,1,1], [1,1,2,2], [2,2,1,3], [1,3,0,4], [2,0,2,1], [2,1,2,2], [2,2,2,3], [2,3,2,4], [2,0,3,1], [3,1,4,2], [4,2,3,3], [3,3,2,4]],
        points: [
            [0, 1, []],
            [1, 1, [0]],
            [2, 1, []],
            [3, 1, [1, 2]],
            [0, 3, []],
            [1, 3, [4]],
            [2, 3, [2]],
            [3, 3, [5, 6]]
        ]
    }
];

var Grid = {
    level: 0,
    offset: {
        x: 320 - 5 * UNITR,
        y: canvasHeight - Grid2Bottom - 4 * Math.sqrt(3) * UNITR * (1 + 1/3)
    },
    unitRadius: UNITR,
    points: [],
    gridContainer: new createjs.Container(),
    lineContainer: new createjs.Container(),
    pointContainer: new createjs.Container(),
    lines: [],
    blocks: [[],[],[],[],[]],

    clear: function() {
        this.points = [];
        this.lines = [];
        this.lineContainer.removeAllChildren();
        this.pointContainer.removeAllChildren();
        this.lineContainer.alpha = 0;
    },
    init: function() {
        for(var i = 0; i < 5; i++) {
            for(var j = 0; j < 5 - Math.abs(2-i); j++) {
                var blockPos = this.getPos(j, i);
                this.blocks[i][j] = new createjs.Bitmap(loader.getResult("grid"));
                this.blocks[i][j].regX = 52;
                this.blocks[i][j].regY = 60;
                this.blocks[i][j].x = blockPos[0];
                this.blocks[i][j].y = blockPos[1];
                this.gridContainer.addChild(this.blocks[i][j]);
            }
        }
        this.gridContainer.x = this.lineContainer.x = this.pointContainer.x = this.offset.x;
        this.gridContainer.y = this.lineContainer.y = this.pointContainer.y = this.offset.y;
        this.lineContainer.alpha = 0;
        stage.addChild(this.gridContainer);
        stage.addChild(this.lineContainer);
        stage.addChild(this.pointContainer);
    },
    getPos: function(x, y) {
        var posX, posY;
        posX = Math.abs(y - 2) * this.unitRadius + 2 * x * this.unitRadius + this.unitRadius;
        posY = 2 / Math.sqrt(3) * this.unitRadius * (1 + 1.5 * y);
        return [posX, posY];
    },
    addPoint: function(x, y, pointList) {
        var point = new Point(x, y, pointList);
        this.points.push(point);
        this.pointContainer.addChild(point.body);
        return point;
    },
    shine: function(x, y) {
        createjs.Tween.get(this.blocks[x][y]).to({scaleX: 1.2, scaleY: 1.2, alpha: 0}, 300).set({scaleX: 1, scaleY: 1, alpha: 1});
    },
    back2Origin: function(speed) {
        var that = this;
        for(var i = 0; i < that.points.length; i++) {
            that.points[i].x = gameSettings[that.level].points[i][0];
            that.points[i].y = gameSettings[that.level].points[i][1];
            that.points[i].float2pos(gameSettings[that.level].points[i][0], gameSettings[that.level].points[i][1], speed);
        }
    },
    reflash: function(speed, speed2) {
        isFloating = true;
        var that = this;
        for(var i = 0; i < that.points.length; i++) {
            that.points[i].float2pos(2, 2, speed);
        }
        createjs.Tween.get().wait(speed2).call(function() {
            that.back2Origin(speed2);
        });
        createjs.Tween.get().wait(2 * speed2).call(function() {
            isFloating = false;
        });
    }
};

var littleGrid = {
    offset: {
        x: 320 - 5 * LITTLEUNITR,
        y: littleGrid2Top
    },
    unitRadius: LITTLEUNITR,
    lineContainer: new createjs.Container(),
    borderContainer: new createjs.Container(),
    lines: [],

    clear: function() {
        this.lines = [];
        this.lineContainer.removeAllChildren();
    },
    init: function() {
        this.lineContainer.x = this.borderContainer.x = this.offset.x;
        this.lineContainer.y = this.borderContainer.y = this.offset.y;

        var border = new createjs.Bitmap(loader.getResult("grid"));
        border.regX = 52;
        border.regY = 60;
        border.x = 5 * LITTLEUNITR;
        border.y = 8 * LITTLEUNITR / Math.sqrt(3);
        border.scaleX = border.scaleY = 3.6;
        border.rotation = 30;
        this.borderContainer.addChild(border);
        stage.addChild(this.borderContainer);
        stage.addChild(this.lineContainer);
    },
    getPos: function(x, y) {
        var posX, posY;
        posX = Math.abs(y - 2) * this.unitRadius + 2 * x * this.unitRadius + this.unitRadius;
        posY = 2 / Math.sqrt(3) * this.unitRadius * (1 + 1.5 * y);
        return [posX, posY];
    },
    addLine: function(x1, y1, x2, y2) {
        var pos1 = this.getPos(x1, y1);
        var pos2 = this.getPos(x2, y2);
        var lineShape = new createjs.Shape();
        lineShape.graphics.setStrokeStyle(10, "round", "round").beginStroke("#595959").moveTo(pos1[0], pos1[1]).lineTo(pos2[0], pos2[1]);
        this.lineContainer.addChild(lineShape);
    }
};

var Point = function(x, y, pointList) {
    this.press = false;
    this.pos = Grid.getPos(x, y);
    this.x = x;
    this.y = y;
    this.pointList = pointList;
    this.body = new createjs.Bitmap(loader.getResult("point"));
    this.body.regX = 52;
    this.body.regY = 60;
    this.body.x = this.pos[0];
    this.body.y = this.pos[1];
    this.body.alpha = 0;
    this.init(pointList);
};

Point.prototype = {
    init: function(pointList) {
        var that = this;
        if(pointList && pointList.length) {
            for(var i = 0; i < pointList.length; i++) {
                this.addLine(pointList[i]);
            }
        }

        this.body.on("mousedown", function(e) {
            if(isFloating) return;
            that.press = true;
            that.body.x = e.stageX - Grid.offset.x;
            that.body.y = e.stageY - Grid.offset.y;
            flashLines();
        });

        this.body.on("pressmove", function(e) {
            if(that.press) {
                that.body.x = e.stageX - Grid.offset.x;
                that.body.y = e.stageY - Grid.offset.y;
                flashLines();
            }
        });

        this.body.on("pressup", function(e) {
            that.press = false;
            that.align();
        });
    },
    addLine: function(point) {
        var line = new Line(this, point);
        Grid.lines.push(line);
    },
    getGridPos: function() {
        var that = this, GridX, GridY;
        GridY = Math.round(that.body.y / Math.sqrt(3) / Grid.unitRadius - 1 / Math.sqrt(3));
        GridY = GridY > 4 ? 4 : GridY;
        GridY = GridY < 0 ? 0 : GridY;
        GridX = Math.round(that.body.x / 2 / Grid.unitRadius - Math.abs(GridY - 2) * 0.5 - 0.5);
        GridX = GridX < 0 ? 0 : GridX;
        GridX = (GridX > (4 - Math.abs(GridY - 2))) ?  (4 - Math.abs(GridY - 2)) : GridX;
        return [GridX, GridY];
    },
    align: function() {
        var gridPos = this.getGridPos();
        for(var i = 0; i < Grid.points.length; i++) {
            if(Grid.points[i].x == gridPos[0] && Grid.points[i].y == gridPos[1]) {
                if(this.x != gridPos[0] || this.y != gridPos[1]) {
                    shock();
                }
                gridPos = [this.x, this.y];
                break;
            }
        }
        var pos = Grid.getPos(gridPos[0], gridPos[1]);
        createjs.Tween.get(this.body).to({x: pos[0], y: pos[1]}, 300, createjs.Ease.cubicOut).call(function() {
            Grid.shine(gridPos[1], gridPos[0]);
            checkSides();
        }).on("change", flashLines);
        this.x = gridPos[0];
        this.y = gridPos[1];
    },
    float2pos: function(x, y, speed) {
        var pos = Grid.getPos(x, y);
        createjs.Tween.get(this.body).to({x: pos[0], y: pos[1]}, speed, createjs.Ease.cubicOut).call(function() {
            createjs.Tween.get(this).to({alpha: 1}, 500, createjs.Ease.cubicOut);
            createjs.Tween.get(Grid.lineContainer).to({alpha: 1}, 500, createjs.Ease.cubicOut);
        }).on("change", flashLines);
    }
};

var Line = function(point1, point2) {
    this.point1 = point1;
    this.point2 = point2;
    this.draw();
};

Line.prototype = {
    draw: function() {
        var lineShape = new createjs.Shape();
        lineShape.graphics.setStrokeStyle(26, "round", "round").beginStroke("#595959").moveTo(this.point1.body.x, this.point1.body.y).lineTo(this.point2.body.x, this.point2.body.y);
        Grid.lineContainer.addChild(lineShape);
    }
};

var Shake = {
        SHAKE_THRESHOLD: 3000,
        isYao: false,
        last_update: 0,
        x: 0,
        y: 0,
        z: 0,
        last_x: 0,
        last_y: 0,
        last_z: 0,
        callback: null,

        init: function(callback) {
            Shake.checkDev(callback);
            Shake.callback = callback;
            Shake.isYao = false;
            Shake.last_update = 0;
            Shake.x = Shake.y = Shake.z = Shake.last_x = Shake.last_y = Shake.last_z = 0;
        },

        checkDev: function(callback) {
            if(window.DeviceMotionEvent) {
                $(window).on("devicemotion", Shake.deviceMotionHandler);
            }
        },

        deviceMotionHandler: function(eventData) {
            var acceleration = eventData.originalEvent.accelerationIncludingGravity;
            var curTime = +new Date();
            if (curTime - Shake.last_update > 100 && !Shake.isYao) {
                var diffTime = curTime - Shake.last_update;
                Shake.last_update = curTime;
                Shake.x = acceleration.x;
                Shake.y = acceleration.y;
                Shake.z = acceleration.z;
                var speed = Math.abs(Shake.x + Shake.y + Shake.z - Shake.last_x - Shake.last_y - Shake.last_z) / diffTime * 10000;
                if (speed > Shake.SHAKE_THRESHOLD) {
                    if(typeof Shake.callback == "function") {
                        Shake.remove();
                        Shake.callback();
                        initShake();
                    }
                }
                Shake.last_x = Shake.x;
                Shake.last_y = Shake.y;
                Shake.last_z = Shake.z;
            }  
        },

        remove: function() {
            $(window).off("devicemotion");
        }
};

loadSource();

stage.hide = function() {
    return stage.alpha = 0;
};

stage.show = function() {
    return stage.alpha = 1;
};

stage.fadeIn = function() {
    return createjs.Tween.get(this).to({alpha : 1}, 500);
};

stage.fadeOut = function() {
    return createjs.Tween.get(this).to({alpha : 0}, 500);
};

function loadUI() {
    var reflashBtn = new createjs.Bitmap(loader.getResult("reflash"));
    reflashBtn.x = 10;
    reflashBtn.y = 10;
    reflashBtn.on("click", function() {
        Grid.reflash(700, 700);
    });
    stage.addChild(reflashBtn);
}

function initShake() {
    Shake.init(function() {
        jumpLevel();
    });
}

function jumpLevel() {
    var index = prompt("jump to level?");
    if(index != null) {
        loadLevel(index);
    }
}

function initGame() {
    createjs.Touch.enable(stage);
    canvas.setAttribute("height", canvasHeight);
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(60);

    loadUI();
    initShake();
    littleGrid.init();
    Grid.init();
    initSetting(startLevel);
}

function initSetting(index) {
    stage.hide();
    Grid.level = index;
    $(".level").text(index+1);
    for(var i = 0; i < gameSettings[index].target.length; i++) {
        var target = gameSettings[index].target[i];
        littleGrid.addLine(target[0], target[1], target[2], target[3]);
    }

    
    for(var i = 0; i < gameSettings[index].points.length; i++) {
        if(gameSettings[index].points[i][2] && gameSettings[index].points[i][2].length) {
            var pointList = [];
            for(var j = 0; j < gameSettings[index].points[i][2].length; j++) {
                pointList.push(Grid.points[gameSettings[index].points[i][2][j]]);
            }
            Grid.addPoint(gameSettings[index].points[i][0], gameSettings[index].points[i][1], pointList);
        } else {
            Grid.addPoint(gameSettings[index].points[i][0], gameSettings[index].points[i][1]);
        }
    }
    stage.fadeIn().call(function() {
        Grid.reflash(0, 800);
    });
}

function loadNextLevel() {
    if(Grid.level + 1 < gameSettings.length) {
        stage.fadeOut().call(function() {
            littleGrid.clear();
            Grid.clear();
            initSetting(++Grid.level);
        });
    } else {
        alert("Congrats! You've finished all the levels!");
    }
}

function loadLevel(index) {
    if(/^\d+$/.test(index) && index > 0 && index < gameSettings.length + 1) {
        index--;
        stage.fadeOut().call(function() {
            littleGrid.clear();
            Grid.clear();
            Grid.level = index;
            initSetting(index);
        });
    } else {
        alert("There's no Level " + index + " yet.");
    }
}

function loadSource() {
    var manifest = [
        {id: "grid", src: "images/grid.png"},
        {id: "point", src: "images/point.png"},
        {id: "reflash", src: "images/reflash.png"}
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("progress", function(event) {
        var percentage = ~~(event.loaded*100);
    });
    loader.addEventListener("complete", doneLoading);
    loader.loadManifest(manifest);
}

function shock() {
    var offset = 35;
    var offsetX1 = offset * Math.random();
    var offsetX2 = offset * Math.random();
    var offsetX2 = offset * Math.random();
    var offsetX3 = offset * Math.random();
    var offsetX4 = offset * Math.random();
    var offsetX5 = offset * Math.random();
    var offsetX6 = offset * Math.random();
    var offsetX7 = offset * Math.random();
    var offsetX8 = offset * Math.random();
    var offsetY1 = offset * Math.random();
    var offsetY2 = offset * Math.random();
    var offsetY3 = offset * Math.random();
    var offsetY4 = offset * Math.random();
    var offsetY5 = offset * Math.random();
    var offsetY6 = offset * Math.random();
    var offsetY7 = offset * Math.random();
    var offsetY8 = offset * Math.random();
    createjs.Tween.get(stage).to({x: offsetX1, y: offsetY1}, 50)
        .to({x: offsetX2, y: offsetY2}, 30)
        .to({x: offsetX3, y: offsetY3}, 30)
        .to({x: offsetX4, y: offsetY4}, 30)
        .to({x: offsetX5, y: offsetY5}, 30)
        .to({x: offsetX6, y: offsetY6}, 30)
        .to({x: offsetX7, y: offsetY7}, 30)
        .to({x: offsetX8, y: offsetY8}, 30)
        .to({x: 0, y: 0}, 10);
}

function checkSides() {
    var sides = [], tempSides = [];
    for(var i = 0; i < Grid.lines.length; i++) {
        tempSides = tempSides.concat(cutLine(Grid.lines[i]));
    }
    for(var i = 0; i < tempSides.length; i++) {
        var got = false;
        for(var j = 0; j < sides.length; j++) {
            if(sides[j][0] === tempSides[i][0] && sides[j][1] === tempSides[i][1] && sides[j][2] === tempSides[i][2] && sides[j][3] === tempSides[i][3]) {
                got = true;
                break;
            } else if(sides[j][0] === tempSides[i][2] && sides[j][1] === tempSides[i][3] && sides[j][2] === tempSides[i][0] && sides[j][3] === tempSides[i][1]) {
                got = true;
                break;
            }
        }
        if(!got) {
            sides.push(tempSides[i]);
        }
    }
    
    var target = gameSettings[Grid.level].target;
    if(sides.length == target.length) {
        var pass = 0;
        for(var i = 0; i < sides.length; i++) {
            for(var j = 0; j < sides.length; j++) {
                if(comparePiece(sides[i], target[j])) {
                    pass++;
                    break;
                }
            }
        }
        if(pass == target.length) {
            loadNextLevel();
        }
    }

    function comparePiece(side, target) {
        return (
            (side[0] === target[0] && side[1] === target[1] && side[2] === target[2] && side[3] === target[3]) 
                ||
            (side[0] === target[2] && side[1] === target[3] && side[2] === target[0] && side[3] === target[1])
        );
    }

    function cutLine(line) {
        var largeX, smallX, largeY, smallY;
        var smallLines = [];
        var linePoints = [];
        var orderedPoints = [];
        var startPoint, endPoint;
        var xRange = [];
        largeX = Math.max(line.point1.x, line.point2.x);
        smallX = Math.min(line.point1.x, line.point2.x);
        largeY = Math.max(line.point1.y, line.point2.y);
        smallY = Math.min(line.point1.y, line.point2.y);
        xRange[0] = Math.min((1 + Math.abs(line.point1.y - 2) + 2 * line.point1.x), (1 + Math.abs(line.point2.y - 2) + 2 * line.point2.x));
        xRange[1] = Math.max((1 + Math.abs(line.point1.y - 2) + 2 * line.point1.x), (1 + Math.abs(line.point2.y - 2) + 2 * line.point2.x));

        for(var x = 0; x <= 4; x++) {
            for(var y = smallY; y <= largeY; y++) {
                var absX = 1 + Math.abs(y - 2) + 2 * x;
                if(absX < xRange[0]) continue;
                if(absX > xRange[1]) continue;
                if(isPointOnLine(x, y, line)) {
                    linePoints.push([x, y]);
                }
            }
        }

        linePoints.push([line.point1.x, line.point1.y]);
        linePoints.push([line.point2.x, line.point2.y]);

        linePoints.sort(function(p1, p2) {
            var absPos1 = abstrctPos(p1[0], p1[1]);
            var absPos2 = abstrctPos(p2[0], p2[1]);
            return absPos1[1] / absPos1[0] - absPos2[1] / absPos2[0];
        });
        
        for(var i = 1; i < linePoints.length; i++) {
            smallLines.push([linePoints[i-1][0], linePoints[i-1][1], linePoints[i][0], linePoints[i][1]]);
        }

        if(!linePoints.length) smallLines = [[line.point1.x, line.point1.y, line.point2.x, line.point2.y]];
        return smallLines;
    }

    function abstrctPos(x, y) {
        var absX = 1 + Math.abs(y - 2) + 2 * x;
        var absY = 1 + 1.5 * y;
        return [absX, absY];
    }

    function isPointOnLine(x, y, line) {
        var pos = abstrctPos(x, y);
        var pos1 = abstrctPos(line.point1.x, line.point1.y);
        var pos2 = abstrctPos(line.point2.x, line.point2.y);
        return (
            (pos1[0] - pos[0]) / (pos1[1] - pos[1]) === (pos2[0] - pos[0]) / (pos2[1] - pos[1]) ||
            (pos1[1] - pos[1]) / (pos1[0] - pos[0]) === (pos2[1] - pos[1]) / (pos2[0] - pos[0])
        );
    }
}

function doneLoading() {
    initGame();
}

function flashLines() {
    if(Grid.lines.length) {
        Grid.lineContainer.removeAllChildren();
        for(var i = 0; i < Grid.lines.length; i++) {
            Grid.lines[i].draw();
        }
    }
}

function tick() {
    stage.update();
}

function query(name) {
    return location.search.match(new RegExp('(?:\\?|&)' + name + '=(.*?)(?:$|&)', 'i')) ? decodeURIComponent(RegExp.$1) : '';
}