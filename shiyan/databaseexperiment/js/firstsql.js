$(document).ready(function () {
    var useDb = '',
        tables = [],
        dbs = {
            sct: {}
        },
        wheretables = {};

    $("#do").on("click", function () {
        //sql语句
        var sql = $(".CodeMirror-line ").text().trim().replace(/\s+/g, ' '),
            newsql = sql.toLowerCase();
        if (newsql.indexOf("create") != -1) {
            /**
             * 创建数据库、表
             */
            create(sql);
        } else if (newsql.indexOf('use') != -1) {
            /**
             * 使用数据库
             */
            usedb(sql);
        } else if (newsql.indexOf("insert") != -1) {
            /**
             * 插入数据
             */
            insert(sql);
        } else if (newsql.indexOf("update") != -1) {
            /**
             * 更新表数据
             */
            update(sql);
        } else if (newsql.indexOf("select") != -1) {
            /**
             * 查询数据
             */
            select(sql);
        } else if (newsql.indexOf("drop") != -1) {
            /**
             * 删除表
             */
            drop(sql);
        } else if (newsql.indexOf("alter") != -1) {
            /**
             * 修改表
             */
            alter(sql);
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
                // alert("暂未使用数据库");
                // return false;
                useDb = "sct";
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

                var titles = [], types = [];
                for (var i = 0; i < thsArr.length; i++) {
                    var thsreg = /\s*(\w+)\s*/i;
                    if (/^primary/i.test(thsArr[i].trim()) || /^FOREIGN/i.test(thsArr[i].trim())) {
                        continue;
                    }
                    var result = thsreg.exec(thsArr[i]);
                    types.push(result.input.trim().substr(result[1].length + 1).trim());
                    titles.push(result[1]);
                }
                var obj = {};
                obj.title = titles;
                obj.type = types;
                obj.data = [];
                dbs[useDb][createtablename] = obj;
                console.log(dbs);
            }
        }
    }

    /**
     * 修改表数据
     * @param sql
     */
    function alter(sql) {
        /**
         * 修改表数据
         */
        if (!useDb) {
            useDb = "sct";
        }
        var alterTableReg = /alter\stable\s(\w+)\sadd\s(\w+)\s(\w+)/i;
        var alterTableResult = alterTableReg.exec(sql);
        if (alterTableResult) {
            var alterTableName = alterTableResult[1].toLowerCase(),
                thName = alterTableResult[2],
                thType = alterTableResult[3];
            dbs[useDb][alterTableName]['title'].push(thName);
            dbs[useDb][alterTableName]['type'].push(thType);
            console.log(dbs);
        } else {
            var alterTableAReg = /alter\stable\s(\w+)\salter\scolumn\s(\w+)\s(\w+)/i;
            var alterTableAResult = alterTableAReg.exec(sql);
            if (alterTableAResult) {
                var alterTableRName = alterTableAResult[1].toLowerCase(),
                    thRName = alterTableAResult[2],
                    thRType = alterTableAResult[3];
                var indexs = dbs[useDb][alterTableRName]['title'].indexOf(thRName);
                dbs[useDb][alterTableRName]['type'][indexs] = thRType;
                console.log(dbs);
            }
        }
    }

    /**
     * 删除表
     * @param sql
     */
    function drop(sql) {
        /**
         * 删除表
         */
        if (!useDb) {
            alert("暂未使用数据库");
            return false;
        }
        var dropTableReg = /drop\stable\s(\w+)/i,
            dropTableResult = dropTableReg.exec(sql),
            dropTableName = dropTableResult[1].toLowerCase();
        delete dbs[useDb][dropTableName];
        alert("删除表成功");
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
            if (!dbs[useDb].hasOwnProperty(inserttablename)) {
                alert("此表不存在");
                return false;
            }
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

    /**
     * 查询语句
     * @param sql
     */
    function select(sql) {
        // if (!useDb) {
        //     alert("请先使用数据库");
        //     return false;
        // }
        var selectsql = sql.toLowerCase(),
            selectIndex = selectsql.indexOf('select') + 7,
            fromIndex = selectsql.indexOf('from'),
            whereIndex = selectsql.indexOf("where"),
            selectCon = sql.slice(selectIndex, fromIndex).trim(),
            fromCon = "",
            whereCon = "";
        //存在条件查询
        if (whereIndex != -1) {
            fromCon = sql.slice(fromIndex + 5, whereIndex).trim();
            whereCon = sql.slice(whereIndex + 6).trim();
            if (whereCon.toLowerCase().trim().indexOf('and') != -1) {
                //存在多条件查询
                alert(1);
            } else {
                //单条件查询 通过,分割
                if (fromCon.indexOf(",") != -1) {
                    var fromContent = fromCon.split(",");
                    for (let i = 0; i < fromContent.length; i++) {
                        //判断有没有别名
                        if (/\s|\sas\s/i.test(fromContent[i].trim())) {
                            //有别名
                            var hasOtherNameReg = /(\w+)\s(as)?\s?(\w+)/i;
                            var result = hasOtherNameReg.exec(fromContent[i].trim());
                            wheretables[result[3]] = dbs[useDb][result[1].toLowerCase()];
                            console.log(wheretables);
                        } else {
                            console.log(fromContent[i].trim());
                            console.log("无")
                        }
                    }
                    //进行数据查询

                }
            }
        } else {
            //不存在where
            fromCon = sql.slice(fromIndex + 5).toLowerCase();
            console.log(fromCon);
            var fromReg = /\s|,|as/i;
            if (!fromReg.exec(fromCon)) {
                //单表查询
                if (selectCon == '*') {
                    //select * from 表
                    var datas = dbs[useDb][fromCon].data, titles = dbs[useDb][fromCon].title,
                        str = "<table><thead><tr>";

                    for (var ii = 0; ii < titles.length; ii++) {
                        str += "<th>" + titles[ii] + "</th>";
                    }
                    str += "</thead><tbody>";
                    for (var i = 0; i < datas.length; i++) {
                        str += "<tr>";
                        for (var j = 0; j < titles.length; j++) {
                            str += "<td>" + datas[i][titles[j]] + "</td>";
                        }
                        str += "</tr>";
                    }
                    str += "</tbody></table>";
                    $(".tbs-con").html(str);
                }

            } else if (selectCon.indexOf("*") != -1) {
                //包括*
            } else {

            }
        }
    else
        {
            console.log("***")
        }

    }
}
})
;