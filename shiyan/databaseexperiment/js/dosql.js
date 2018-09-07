window.onload=function(){
    //根据DOM元素的id构造出一个编辑器
    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: "text/x-sql", //实现Java代码高亮
        lineNumbers: true,
        theme: "dracula",
        keyMap: "sublime",
        extraKeys: {
            "Ctrl": "autocomplete"
        },
        hint: CodeMirror.hint.sql,
        lineWrapping: true, //是否换行
        foldGutter: true, //是否折叠
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"], //添加行号栏，折叠栏
    });

    editor.setSize('height', '260px');
    // 最小高度
    const MIN_HEIGHT = 260;

    //对编辑器这个node添加鼠标事件
    var editorNode = document.getElementById('code');

    var hahahha = document.getElementsByClassName('CodeMirror-wrap')[0];
    console.log('初始值：' + hahahha.offsetHeight);
    // 
    var dragBar = document.getElementById('handle');

    // 返回编辑器的高度
    function getHeight(node) {
        let h = window.getComputedStyle(node, null).height.replace(/px$/, "");
        if (h === 'auto') {
            h = node.offsetHeight;
        }
        return parseInt(h);
    }

    // 释放鼠标的时候触发的事件
    function release() {

        console.log('end');
        // 删除和添加都是使用两个参数的
        document.body.removeEventListener('mousemove', drag);
        window.removeEventListener('mouseup', release);
    }

    // drag 事件
    function drag(e) {
        console.log('drag');
        console.log('e.y:' + e.y);
        console.log('pos_y:' + pos_y);
        console.log('startHeight:' + startHeight);
        console.log('-----------')
        console.log(startHeight + e.y - pos_y);
        editor.setSize('height', Math.max(MIN_HEIGHT, (startHeight + e.y - pos_y)) + "px");
    }

    dragBar.addEventListener('mousedown', function (e) {
        console.log('start');
        // 开始高度
        startHeight = getHeight(hahahha);
        console.log('开始高度：' + startHeight);
        pos_x = e.x;
        pos_y = e.y;
        //只有按下鼠标移动的时候才能移动
        document.body.addEventListener('mousemove', drag);
        window.addEventListener('mouseup', release);
    });


    function getSelectedRange() {
        return {
            from: editor.getCursor(true),
            to: editor.getCursor(false)
        };
    }

    //代码的格式化
    function autoFormatSelection() {
        // 获取输入的值
        console.log(editor.getValue());
        console.log('123');
        console.log('范围：' + JSON.stringify(getSelectedRange()));
        var range = getSelectedRange();
        editor.autoFormatRange(range.from, range.to);

        function format() {
            console.time('formatting');

            let str = sqlFormatter.format(editor.getValue(), {
                language: 'sql'
            });
            editor.setValue(str);
            console.log('格式化的代码:' + str);
            console.timeEnd('formatting');
        }
        format();
    }

    var formatButton = document.getElementById('format');
    formatButton.addEventListener('click', autoFormatSelection);
}