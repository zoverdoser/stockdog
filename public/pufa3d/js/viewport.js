window.onorientationchange = function() {
    (function(a) {
        function c() {
            var c, d;
            return b.uWidth = a.uWidth ? a.uWidth : 640, b.dWidth = a.dWidth ? a.dWidth : window.screen.width || window.screen.availWidth, b.ratio = window.devicePixelRatio ? window.devicePixelRatio : 1, b.userAgent = navigator.userAgent, b.bConsole = a.bConsole ? a.bConsole : !1, a.mode ? (b.mode = a.mode, void 0) : (c = b.userAgent.match(/Android/i), c && (b.mode = "android-2.2", d = b.userAgent.match(/Android\s(\d+.\d+)/i), d && (d = parseFloat(d[1])), 2.2 == d || 2.3 == d ? b.mode = "android-2.2" : 4.4 > d ? b.mode = "android-dpi" : d >= 4.4 && (b.mode = b.dWidth > b.uWidth ? "android-dpi" : "android-scale")), void 0)
        }

        function d() {
            var e, f, g, h, c = "",
                d = !1;
            switch (b.mode) {
                case "apple":
                    c = "width=" + b.uWidth + ", user-scalable=no";
                    break;
                case "android-2.2":
                    a.dWidth || (b.dWidth = 2 == b.ratio ? 720 : 1.5 == b.ratio ? 480 : 1 == b.ratio ? 320 : .75 == b.ratio ? 240 : 480), e = window.screen.width || window.screen.availWidth, 320 == e ? b.dWidth = b.ratio * e : 640 > e && (b.dWidth = e), b.mode = "android-dpi", d = !0;
                case "android-dpi":
                    f = 160 * b.uWidth / b.dWidth * b.ratio, c = "target-densitydpi=" + f + ", width=" + b.uWidth + ", user-scalable=no", d && (b.mode = "android-2.2");
                    break;
                case "android-scale":
                    c = "width=" + b.uWidth + ", user-scalable=no"
            }
            g = document.querySelector("meta[name='viewport']") || document.createElement("meta"), g.name = "viewport", g.content = c; 
            //setTimeout(function() {
                h = document.getElementsByTagName("head"), h.length > 0 && h[0].appendChild(g)
            //}, 100);
        }

        function e() {
            var a = "";
            for (key in b) a += key + ": " + b[key] + "; ";
            alert(a)
        }
        if (a) {
            var b = { uWidth: 0, dWidth: 0, ratio: 1, mode: "apple", userAgent: null, bConsole: !1 };
            c(), d(), b.bConsole && e()
        }
    })({ uWidth: window.orientation? screen.height : 640 });
};
window.onorientationchange();