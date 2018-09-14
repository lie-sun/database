$(document).ready(function () {
    var useDb = '',
        tables = [],
        dbs = {};

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
        } else if (sql.indexOf("update") != -1) {
            /**
             * 更新表数据
             */
            update(sql);
        }
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
                /**
                 * 数据库已存在
                 */
                var dbname = createdatabaseresult[1];
                if (dbs.hasOwnProperty(dbname)) {
                    alert("此数据库已存在");
                    return false;
                }
                dbs[dbname] = {};
                console.log('创建库成功');
            }
        } else if (/table/i.test(sql)) {
            /**
             * 创建表
             */
            if (!useDb) {
                alert("暂未使用数据库");
                return false;
            }
            var creatatablereg = /\s*create\s+table\s+(\w+)/i;
            var createtableresult = creatatablereg.exec(sql);
            if (createtableresult) {
                var createtablename = createtableresult[1].toLowerCase();
                if (dbs[useDb].hasOwnProperty(createtablename)) {
                    alert("此表已存在");
                    return false;
                }
                var createtableths = createtableresult.input;
                createtableths = createtableths.substring(createtableths.indexOf("(") + 1, createtableths.trim().lastIndexOf(")"));
                var thsArr = createtableths.split(",");

                var titles = [];
                for (var i = 0; i < thsArr.length; i++) {
                    var thsreg = /\s*(\w+)\s*/i;
                    if (/^primary/i.test(thsArr[i].trim()) || /^FOREIGN/i.test(thsArr[i].trim())) {
                        continue;
                    }
                    var result = thsreg.exec(thsArr[i]);
                    titles.push(result[1]);
                }
                var obj = {};
                obj.title = titles;
                obj.data = [];
                dbs[useDb][createtablename] = obj;
                console.log(dbs);
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
            var usename = useresult[1];
            useDb = usename;
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
            var inserttablename = result[1].toLowerCase();
            // if(!dbs[useDb].hasOwnProperty(inserttablename)){
            //     alert("此表不存在");
            //     return false;
            // }
            result = result.input.substring(result.input.lastIndexOf("(") + 1, result.input.lastIndexOf(")"));
            var tharr = result.split(",");

            var title = dbs[useDb][inserttablename].title;
            var obj = {};
            for (var j = 0; j < tharr.length; j++) {
                obj[title[j]] = tharr[j].replace(/['|"]/g, '');
            }
            dbs[useDb][inserttablename].data.push(obj);
        }
        console.log(dbs);

    }

    /**
     * 更新表数据
     * @param {*} sql
     */
    function update(sql) {
        var sql = sql.split(";"),
            updatetablereg = /update\s(\w+)\sset\s(\w+)\s=\s['|"]?(\w+)['|"]?\swhere\s(\w+)\s=\s['|"]?(\w+)['|"]?/i;
        for (var i = 0; i < sql.length - 1; i++) {
            var result = updatetablereg.exec(sql[i].trim()),
                tablename = result[1].toLowerCase(),
                setname = result[2],
                setcon = result[3],
                tjname = result[4],
                tjcon = result[5],
                datas = dbs[useDb][tablename].data;
            for (var j = 0; j < datas.length; j++) {
                if (datas[j][tjname] == tjcon) {
                    dbs[useDb][tablename].data[j][setname] = setcon;
                }
            }
        }
        console.log(dbs);

    }

});