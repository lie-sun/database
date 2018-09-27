$(document).ready(function () {


    $("#do").on("click", function () {
        //sql语句
        var sql = $(".CodeMirror-line ").text().trim().replace(/\s+/g, ' '),
            newsql = sql.toLowerCase().replace(/'|"/g, '');
        if (newsql.indexOf("create view") != -1) {
            createView(sql);
        } else if (newsql.indexOf("select") == 0) {
            selectView(sql);
        }else if (newsql.indexOf("drop")){
            drop(sql);
        }
    });

    /**
     * 创建视图
     * @param sql
     */
    function createView(sql) {
        var LowerCasesql = sql.toLowerCase();
        var viewname = sql.substring(LowerCasesql.indexOf("view") + 4, LowerCasesql.indexOf("as")).trim().toLowerCase(),
            ascon = sql.substring(LowerCasesql.indexOf("as") + 2),
            selectcon = sql.substring(LowerCasesql.indexOf("select")+6,LowerCasesql.indexOf("from")),
            fromcon = "";
        if(LowerCasesql.indexOf("where")!=-1){
            fromcon = sql.substring(LowerCasesql.indexOf("from")+4,LowerCasesql.indexOf("where"))
        }else{
            fromcon = sql.substring(LowerCasesql.indexOf("from")+4);
        }

        console.log(fromcon);

    }

    /**
     * 查询视图
     * @param sql
     */
    function selectView(sql) {
        console.log("select");
    }

    /**
     * 插入数据
     * @param sql
     */
    function insert(sql) {
        console.log("insert");

    }

    /**
     * 删除视图
     * @param sql
     */
    function drop(sql) {
        console.log("drop");
    }
});