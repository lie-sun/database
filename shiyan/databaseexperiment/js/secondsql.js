$(document).ready(function () {
    $("#do").on("click", function () {
        //sql语句
        var sql = $(".CodeMirror-line ").text().trim().replace(/\s+/g, ' ');
        if (sql.indexOf("create") != -1) {
            /**
             * 创建数据库、表
             */
            create(sql);
        } else if (sql.indexOf('use') != -1) {
            /**
             * 使用数据库
             */
            usedb(sql);
        } else if (sql.indexOf("insert") != -1) {
            /**
             * 插入数据
             */
            insert(sql);
        }
    });

});


/**
 * 创建数据库、表
 * @param sql
 * @returns {boolean}
 */
function create(sql) {
    /**
     * 创建数据库
     */
    if (/database/i.test(sql)) {
        var createdatabasereg = /create\sdatabase\s(\w+)/i;
        var createdatabaseresult = createdatabasereg.exec(sql);
        if (createdatabaseresult) {
            var createdatabasename = createdatabaseresult[1];
            /**
             * 数据库已存在
             */
            if ($('.' + createdatabasename).length) {
                alert("此数据库已存在");
                return false;
            }

            var str = "<ul class='" + createdatabasename + "'><p class='dbname'><span><img src='images/jt-r.png' class='jt sm'> <img src='images/database.png' class='dbs sm'/></span>" + createdatabasename + "</p></ul>";
            $(".dbs-con").append(str);

            $("." + createdatabasename + '>p').on("click", function (e) {
                var src = $(this).children("span").children(".jt").attr("src");
                if (src == 'images/jt-r.png') {
                    $(this).children("span").children(".jt").attr("src", "images/jt-b.png");
                    $(this).parent().children("li").show();
                } else {
                    $(this).children("span").children(".jt").attr("src", "images/jt-r.png");
                    $(this).parent().children("li").hide();
                }
            })

        }
    } else if (/table/i.test(sql)) {
        /**
         * 创建表
         */
        var creatatablereg = /\s*create\s+table\s+(\w+)/i;
        var createtableresult = creatatablereg.exec(sql);
        if (createtableresult) {

            var createtablename = createtableresult[1];
            $(".rightss").append("<h2 class='" + createtablename + "'>表" + createtablename + "</h2>");
            var str = "<table class='" + createtablename.toLowerCase() + "'><tr>";
            var createtableths = createtableresult.input;
            createtableths = createtableths.substring(createtableths.indexOf("(") + 1, createtableths.trim().lastIndexOf(")"));
            var thsArr = createtableths.split(",");
            var ths = [];
            for (var i = 0; i < thsArr.length; i++) {
                var thsreg = /\s*(\w+)\s*/i;
                var result = thsreg.exec(thsArr[i]);

                var obj = {};
                obj.name = result[0].trim();
                ths.push(obj);
                str += "<th types='" + 1 + "'>" + result[0].trim() + "</th>";
            }
            str += "</tr></thead><tbody></tbody></table>";
            $(".rightss").append(str);
        }

    }

}

/**
 * 使用数据库区
 * @param sql
 */
function usedb(sql) {
    var usereg = /^use\s(\w+)/i;
    var useresult = usereg.exec(sql);
    if (useresult) {
        var usename = useresult[useresult.length - 1];
        $(".dbname").removeClass("active");
        $("." + usename).children("p").addClass("active").children(".jt").attr("src", "images/jt-b.png");
        dbName = usename;

    }
}

/**
 * 插入数据
 * @param sql
 */
function insert(sql) {
    var insertreg = /insert\sinto\s(\w+)/i;
    var sqlarr = sql.split(";");
    for (var i = 0; i < sqlarr.length - 1; i++) {
        var result = insertreg.exec(sqlarr[i]);
        var inserttablename = result[1];
        var tharr = [];
        result = result.input.substring(result.input.lastIndexOf("(") + 1, result.input.lastIndexOf(")"));
        tharr = result.split(",");
        console.log(tharr);
        var addth = "<tr>";
        for (var j = 0; j < tharr.length; j++) {
            addth += "<td>" + tharr[j].replace(/'|"/g,"") + "</td>";

        }
        addth += "</tr>";
        console.log(addth);
        $("." + inserttablename + " tbody").append(addth);
    }


}