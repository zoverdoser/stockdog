var THREE = require("../libs/three.min.js");
var Loading = require("../components/loading.js");
var MsgBox = require("../components/msgbox.js");
var Weixin = require("../libs/Weixin.js");
import APP from "../module/app.js";
import res from '../fla/rescc';

var player, shareObj;

shareObj = {
    title: '活动还能玩的这么"转", 浦发星球一探到底',
    desc: '7大活动汇聚星球，一定要Hold住！',
    link: window.location.href,
    imgUrl: window.location.origin + "/html/images/share.jpg",
};

Weixin.init().done(function() {
    Weixin.share(shareObj, shareObj);
});

var flashObj = {
    bottomLayer: {name: "empty"},
    topLayer: {name: "empty"},
    middleLayer: {
        ball: {name: "ball"},
        bank01: {name: "bank01"},
        bank02: {name: "bank02"},
        center: {name: "center"},
        coin: {name: "coin"},
        money: {name: "money"},
        movie: {name: "movie"}
    },
    firstPage: '',
    firstload: [],
    preload: ['movie', 'money', 'coin', 'center', 'bank02', 'bank01', 'ball'],
    preloadNum: 1
};

init()
bindEvents();
initAnimation();

function init() {
    var loader = new THREE.FileLoader(),
        proccessDOM = $("#loading .star .bottom"),
        proccessValue = $("#loading .value");

    loader.load('app.json', function(text) {
        player = new APP.Player();
        document.querySelector("#scene").appendChild(player.dom);
        player.load(JSON.parse(text));
        player.setSize(window.innerWidth, window.innerHeight);
        $("#loading").hide().siblings("#scene").show();
        player.play();
        window.addEventListener('resize', function() {
            player.setSize(window.innerWidth, window.innerHeight);
        });
    }, function(xhr) {
        let proccess = ~~(xhr.loaded / xhr.total * 100);
        proccessDOM.css('width', proccess + '%');
        proccessValue.text(proccess);
    });
}

function bindEvents() {
    $(".pop .close, .pop .closeBtn").on("click", function() {
        $(this).parent().parent().fadeOut();
    });

    $("#scene .rightsBtn").on("click", function() {
        $(".pop.rights").fadeIn();
    });

    $(document).on("CLOSE_INSIDEPOP", function() {
        $(".pop.inside").fadeOut();
        player.cameraGoBack();
        res.stopHandleTick();
    });
}

function initAnimation() {
    res.loadInit(flashObj).done(() => {});
}


function query(name) {
    return location.search.match(new RegExp('(?:\\?|&)' + name + '=(.*?)(?:$|&)', 'i')) ? decodeURIComponent(RegExp.$1) : '';
}