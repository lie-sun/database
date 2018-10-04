$(document).ready(function () {
    var useDb = '',
        tables = [],
        dbs = {
            sct: {
                student: {
                    title: ['Sno', 'Sname', 'Ssex', 'Sage', 'Sdept'],
                    data: [
                        {
                            Sno: 200215121,
                            Sname: "李勇",
                            Ssex: "男",
                            Sage: 20,
                            Sdept: "CS"
                        },
                        {
                            Sno: 200215122,
                            Sname: "刘晨",
                            Ssex: "女",
                            Sage: 19,
                            Sdept: "CS"
                        },
                        {
                            Sno: 200215123,
                            Sname: "王敏",
                            Ssex: "女",
                            Sage: 18,
                            Sdept: "MA"
                        },
                        {
                            Sno: 200215125,
                            Sname: "张立",
                            Ssex: "男",
                            Sage: 19,
                            Sdept: "IS"
                        },
                    ]
                },
                sc: {
                    title: ['Sno', 'Cno', "Grade"],
                    data: [
                        {Sno: 200215121, Cno: 1, Grade: 92},
                        {Sno: 200215121, Cno: 2, Grade: 85},
                        {Sno: 200215121, Cno: 3, Grade: 85},
                        {Sno: 200215122, Cno: 2, Grade: 90},
                        {Sno: 200215122, Cno: 3, Grade: 80},
                    ]
                },
                course: {
                    title: [],
                    data: [],
                    type: []
                }
            }
        },
        wheretables = [],
        timeOut = "";

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
                changeText("创建库成功");
                console.log('创建库成功');

            }
        } else if (/table/i.test(sql)) {
            /**
             * 创建表
             */
            if (!useDb) {
                alert("暂未使用数据库");
                changeText("暂未使用数据库");
                return false;
            }
            var creatatablereg = /\s*create\s+table\s+(\w+)/i;
            var createtableresult = creatatablereg.exec(sql);
            if (createtableresult) {
                var createtablename = createtableresult[1].toLowerCase();
                if (dbs[useDb].hasOwnProperty(createtablename)) {
                    //alert("此表已存在");
                    $(".rightss .row").text("此表已存在");
                    setTimeout(() => {
                        $(".rightss .row").text("");
                    }, 2000);
                    return false;
                }
                var createtableths = createtableresult.input;
                createtableths = createtableths.substring(createtableths.indexOf("(") + 1, createtableths.trim().lastIndexOf(")"));
                var priIndex = "";
                var thsArr = "";
                if (createtableths.toLowerCase().indexOf("primary key (") != -1) {
                    priIndex = createtableths.toLowerCase().indexOf("primary") - 2;
                    thsArr = createtableths.substring(0, priIndex).split(",");
                } else {
                    thsArr = createtableths.split(",");
                }
                var titles = [], types = [];
                for (var i = 0; i < thsArr.length; i++) {
                    if (thsArr[i].toLowerCase().indexOf("foreign key") != -1) {

                    } else {
                        var thsreg = /\s*(\w+)\s*/i;
                        var result = thsreg.exec(thsArr[i]);
                        types.push(result.input.trim().substr(result[1].length + 1).trim());
                        titles.push(result[1]);
                    }

                }
                var obj = {};
                obj.title = titles;
                obj.type = types;
                obj.data = [];
                dbs[useDb][createtablename] = obj;
                changeText("创建表成功");

                console.log(dbs);
            }
        } else if (/UNIQUE/i.test(sql)) {
            console.log('UNIQUE');
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
            dropTableResult = dropTableReg.exec(sql);
        console.log(dropTableResult);

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
            changeText("使用库成功");
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
                // alert("此表不存在");
                changeText("此表不存在");
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
        changeText("添加数据成功");
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
        changeText("更新数据成功");
        console.log(dbs);

    }

    /**
     * 查询语句
     * @param sql
     */
    function select(sql) {
        if (!useDb) {
            // alert("请先使用数据库");
            // return false;
            useDb = 'sct';
        }
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

            } else {
                //单条件查询 通过,分割
                if (fromCon.indexOf(",") != -1) {
                    wheretables = [];
                    var fromContent = fromCon.split(",").map((e) => {
                        return e.trim();
                    });
                    for (let i = 0; i < fromContent.length; i++) {
                        //判断有没有别名
                        if (/\s|\sas\s/i.test(fromContent[i].trim())) {
                            //有别名
                            var hasOtherNameReg = /(\w+)\s(as)?\s?(\w+)/i;
                            var result = hasOtherNameReg.exec(fromContent[i].trim()),
                                obj = {};
                            obj[result[3]] = dbs[useDb][result[1].toLowerCase()];
                            wheretables.push(obj);
                        } else {
                            wheretables.push(dbs[useDb][fromContent[i].toLowerCase()]);
                        }
                    }
                    //进行数据查询

                    let thName = whereCon.substring(whereCon.indexOf(".") + 1, whereCon.indexOf("=")).trim();

                    if (wheretables.length == 2) {
                        var newData = [],
                            titles = [],
                            seleArr = [],
                            showTableDataStr = "<table><thead><tr>";
                        if (selectCon.indexOf("*") != -1) {

                        } else {
                            seleArr = selectCon.split(",").map((e) => {
                                return e.trim();
                            });
                            for (let ti = 0; ti < seleArr.length; ti++) {
                                if (seleArr[ti].indexOf(".") != -1) {
                                    titles.push(seleArr[ti].substring(seleArr[ti].indexOf(".") + 1,).trim());
                                    showTableDataStr += "<th>" + seleArr[ti].substring(seleArr[ti].indexOf(".") + 1,).trim() + "</th>";
                                } else {
                                    titles.push(seleArr[ti].trim());
                                    showTableDataStr += "<th>" + seleArr[ti].trim() + "</th>";
                                }
                            }
                        }
                        // for (let ti = 0; ti < seleArr.length; ti++) {
                        //     if (seleArr[ti].indexOf(".") != -1) {
                        //         titles.push(seleArr[ti].substring(seleArr[ti].indexOf(".") + 1,).trim());
                        //         showTableDataStr += "<th>" + seleArr[ti].substring(seleArr[ti].indexOf(".") + 1,).trim() + "</th>";
                        //     } else {
                        //         titles.push(seleArr[ti].trim());
                        //         showTableDataStr += "<th>" + seleArr[ti].trim() + "</th>";
                        //     }
                        // }
                        showTableDataStr += "</tr></thead><tbody>";
                        for (let fi = 0; fi < wheretables[0].data.length; fi++) {
                            var obj = {};
                            showTableDataStr += "<tr>";
                            for (let si = 0; si < wheretables[1].data.length; si++) {
                                if (wheretables[0].data[fi][thName] == wheretables[1].data[si][thName]) {
                                    if (selectCon.indexOf("*") != -1) {

                                    } else {

                                        for (let i = 0; i < seleArr.length; i++) {
                                            if (seleArr[i].indexOf(".") != -1) {

                                            } else {

                                            }
                                        }

                                    }

                                }
                            }
                            showTableDataStr += "</tr>";
                        }
                        showTableDataStr += "</tbody></table>";
                        $(".tbshowscon").html(showTableDataStr);
                    } else if (wheretables.length >= 3) {

                    }

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
                } else if (selectCon.indexOf("*") != -1) {
                    //包括*
                } else {

                }
            } else {
                console.log("***")
            }

        }
    }

    /**
     * 操作提示
     * @param text 提示内容
     */
    function changeText(text) {
        clearTimeout(timeOut);
        $(".rightss .row").text(text);
        timeOut = setTimeout(() => {
            $(".rightss .row").text("");
        }, 5000);
    }
});