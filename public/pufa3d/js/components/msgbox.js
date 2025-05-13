
    var $ = require('jquery');

    var css = {
        box: {
            'position': 'fixed',
            'left': 0,
            'top': 0,
            'width': '100%',
            'height': '100%',
            'z-index': 999999,
            'background': 'rgba(0,0,0,.8)'
        },
        table: {
            'border-spacing': 0,
            'border': 0,
            'width': '100%',
            'height': '100%'
        },

        content: {
            'position': 'relative',
            'margin': '0 auto',
            'max-width': '576px',
            'width': '70%',
            'background': '#fff',
            'border-radius': '5px',
            'overflow': 'hidden'
        },

        word: {
            'padding': '15px 10px',
            'font-size': '20px',
            'color': '#000',
            'text-align': 'center'
        },

        btns: {
            'border-top': '1px solid #ccc',
            'overflow': 'hidden',
            'color': '#333'
        },

        btn: {
            'font-size': '20px',
            'padding': '8px 0',
            'border': 0,
            'width': '50%',
            'background': 'none',
            'float': 'left',
            'border-right': '1px solid #ccc',
            'border-radius': 0
        },

        btn2: {
            'font-weight': 'bold',
            'border-right': 0
        }
    };


    function create(html, isConfirm, callback) {
        if (typeof callback !== 'function') {
            callback = $.noop;
        }
        var box = $('<div>').css(css.box);
        var table = $('<table><tr><td></td></tr></table>').css(css.table);
        var content = $('<div>').css(css.content);
        var word = $('<div>').css(css.word)
        word.html(html);

        var btns = $('<div>').css(css.btns);
        var btn1;
        var btn2 = $('<button>').css(css.btn).css(css.btn2);

        if (isConfirm) {
            btn1 = $('<button>').css(css.btn);
            btn1.html('取消');
            btn1.one('click', function(e) {
                box.remove();
                callback(false);
            });
            btns.append(btn1);
        } else {
            btn2.css('width', '100%');
        }

        btn2.html('确定');
        btn2.one('click', function(e) {
            box.remove();
            callback(true);
        });

        btns.append(btn2);
        content.append(word);
        content.append(btns);
        table.find('td').append(content);
        box.append(table);
        $('body').append(box);
    }

module.exports={
        alert: function(text, callback) {
            create(text, false, callback);
        },
        confirm: function(text, callback) {
            create(text, true, callback);
        }
    }
