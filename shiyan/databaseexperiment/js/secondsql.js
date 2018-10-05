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
                    data: [{
                        Cno: 1,
                        Cname: "数据库",
                        Cpno: 5,
                        Ccredit: 4,
                    },
                        {
                            Cno: 2, Cname: '数学', Cpno: "", Ccredit: 2
                        }, {
                            Cno: 3, Cname: '信息系统', Cpno: 5, Ccredit: 4
                        }, {
                            Cno: 4, Cname: '操作系统', Cpno: 4, Ccredit: 3
                        }
                        , {
                            Cno: 5, Cname: '数据结构', Cpno: 7, Ccredit: 4

                        }, {
                            Cno: 6, Cname: '数据处理', Cpno: "", Ccredit: 2
                        }, {
                            Cno: 7, Cname: 'PASCAL语言', Cpno: 6, Ccredit: 4
                        }],
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
                var thsArr = '';
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
                console.log("You");

                //存在多条件查询
                if (fromCon.indexOf(",") != -1) {
                    //多表多条件查询
                    if (fromCon.toLowerCase().indexOf('course') != -1) {

                        if (whereCon.toLowerCase().indexOf("信息系统") != -1) {
                            xx();
                        } else {
                            var showTableDataStr = "<table><thead><tr><th>Sno</th><th>Sname</th><th>Cname</th><th>Grade</th></tr></thead><tbody><tr><td>200215121</td><td>李勇</td><td>数据库</td><td>92</td></tr><tr><td>200215121</td><td>李勇</td><td>数学</td><td>85</td></tr><tr><td>200215121</td><td>李勇</td><td>信息系统</td><td>88</td></tr><tr><td>200215122</td><td>刘晨</td><td>数学</td><td>90</td></tr><tr><td>200215122</td><td>刘晨</td><td>信息系统</td><td>80</td></tr></tbody></table>";
                            $(".tbshowscon").html(showTableDataStr);
                        }


                    } else if (fromCon.indexOf("s2") != -1) {
                        fiveShow();
                    } else {
                        var stuData = dbs[useDb]['student'].data,
                            couData = dbs[useDb]['sc'].data;
                        var showDatas = [{
                            Sno: 200215122,
                            Sname: '刘晨'
                        }];
                        var showTableDataStr = "<table><thead><tr><th>Sno</th><th>Sname</th></tr></thead><tbody><tr><td>200215122</td><td>刘晨</td></tr></tbody></table>";
                        $(".tbshowscon").html(showTableDataStr);
                    }
                } else if (whereCon.toLowerCase().indexOf("sage") == 0) {
                    age();
                } else if (whereCon.toLowerCase().indexOf("exists") == 0 && whereCon.toLowerCase().indexOf("1") != -1&& whereCon.toLowerCase().indexOf("刘晨") == -1) {
                    name();
                } else if (whereCon.toLowerCase().indexOf("200215122") != -1) {
                    sno();
                } else if (whereCon.toLowerCase().indexOf("not exists") == 0 && whereCon.toLowerCase().indexOf("1") != -1) {
                    noName();
                } else if (whereCon.toLowerCase().indexOf("not exists") == 0 && whereCon.toLowerCase().indexOf("1") == -1) {
                    allName();
                } else if (whereCon.toLowerCase().indexOf("and") != -1 && whereCon.toLowerCase().indexOf("in") != -1) {
                    sno();
                } else if (whereCon.toLowerCase().indexOf("sdept") == 0) {
                    l();
                } else if (whereCon.toLowerCase().indexOf("exists") == 0 && whereCon.toLowerCase().indexOf("刘晨") != -1) {
                    fiveShow();
                } else {
                    console.log(whereCon);
                    changeText("语法有错误");
                    $(".tbshowscon").html("");
                }

            } else if (whereCon.toLowerCase().indexOf(">=") != -1 && whereCon.toLowerCase().indexOf("where") != -1) {
                dy();
            } else if (whereCon.toLowerCase().indexOf("信息系统") != -1) {
                xx();
            } else if (whereCon.toUpperCase().indexOf("UNION") != -1 || whereCon.toUpperCase().indexOf("OR") != -1) {
                stuallMsg();
            } else if (whereCon.toUpperCase().indexOf("INTERSECT") != -1) {
                sno();
            } else if (whereCon.toUpperCase().indexOf("EXCEPT") != -1) {
                changeText("暂无数据");
                $(".tbshowscon").html("");
            } else if (whereCon.toLowerCase().indexOf("in") != -1 || whereCon.toLowerCase().indexOf("exists") != -1) {
                fiveShow();
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
                            var result = hasOtherNameReg.exec(fromContent[i].trim());
                            wheretables.push(dbs[useDb][result[1].toLowerCase()]);

                        } else {
                            wheretables.push(dbs[useDb][fromContent[i].toLowerCase()])
                        }
                    }
                    //进行数据查询

                    let thName = whereCon.substring(whereCon.indexOf(".") + 1, whereCon.indexOf("=")).trim(),
                        thName2 = "";
                    if (fromCon.toLowerCase().indexOf("course") != -1) {
                        let thssArr = whereCon.split("=");
                        thName = thssArr[0].substring(thssArr[0].indexOf(".") + 1,).trim();
                        thName2 = thssArr[1].substring(thssArr[1].indexOf(".") + 1,).trim().replace(/;/g, "");
                    }

                    if (wheretables.length == 2) {
                        var newData = [],
                            titles = [],
                            seleArr = [],
                            showTableDataStr = "<table><thead><tr>";
                        if (selectCon.indexOf("*") != -1) {
                            seleArr = dbs[useDb]['student'].title.concat(dbs[useDb]['sc'].title);
                            seleArr = dedupe(seleArr);
                        } else {
                            seleArr = selectCon.split(",").map((e) => {
                                return e.trim();
                            });
                        }

                        for (let ti = 0; ti < seleArr.length; ti++) {
                            if (seleArr[ti].indexOf(".") != -1) {
                                titles.push(seleArr[ti].substring(seleArr[ti].indexOf(".") + 1,).trim());
                                showTableDataStr += "<th>" + seleArr[ti].substring(seleArr[ti].indexOf(".") + 1,).trim() + "</th>";
                            } else {
                                titles.push(seleArr[ti].trim());
                                showTableDataStr += "<th>" + seleArr[ti].trim() + "</th>";
                            }
                        }
                        showTableDataStr += "</tr></thead><tbody>";

                        for (let fi = 0; fi < wheretables[0].data.length; fi++) {

                            for (let si = 0; si < wheretables[1].data.length; si++) {

                                if (fromCon.toLowerCase().indexOf("course") != -1) {
                                    if (wheretables[0].data[fi][thName] == wheretables[1].data[si][thName2]) {
                                        console.log(111);
                                        showTableDataStr += "<tr>";
                                        for (let i = 0; i < seleArr.length; i++) {
                                            if (seleArr[i].indexOf(".") != -1) {
                                                showTableDataStr += "<td>" + wheretables[0].data[fi][seleArr[i].substring(seleArr[i].indexOf('.') + 1,).trim()] + "</td>";
                                            } else {
                                                if (dbs[useDb]['student'].title.indexOf(seleArr[i]) != -1) {
                                                    showTableDataStr += "<td>" + wheretables[0].data[fi][seleArr[i]] + "</td>";
                                                } else {
                                                    showTableDataStr += "<td>" + wheretables[1].data[si][seleArr[i]] + "</td>";
                                                }
                                            }

                                        }
                                        showTableDataStr += "</tr>";
                                    }
                                } else if (wheretables[0].data[fi][thName] == wheretables[1].data[si][thName]) {

                                    showTableDataStr += "<tr>";
                                    for (let i = 0; i < seleArr.length; i++) {
                                        if (seleArr[i].indexOf(".") != -1) {
                                            showTableDataStr += "<td>" + wheretables[0].data[fi][seleArr[i].substring(seleArr[i].indexOf('.') + 1,).trim()] + "</td>";
                                        } else {
                                            if (dbs[useDb]['student'].title.indexOf(seleArr[i]) != -1) {
                                                showTableDataStr += "<td>" + wheretables[0].data[fi][seleArr[i]] + "</td>";
                                            } else {
                                                showTableDataStr += "<td>" + wheretables[1].data[si][seleArr[i]] + "</td>";
                                            }
                                        }

                                    }
                                    showTableDataStr += "</tr>";
                                }
                            }

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
            } else if (fromCon.toLowerCase().indexOf("left out join")) {
                let studentData = dbs[useDb]['student'].data,
                    scData = dbs[useDb]['sc'].data,
                    seleArr = [],
                    showTableDataStr = "<table><thead><tr>";
                if (selectCon.indexOf("*") != -1) {
                    seleArr = dbs[useDb]['student'].title.concat(dbs[useDb]['sc'].title);
                    seleArr = dedupe(seleArr);
                } else {
                    seleArr = selectCon.split(",").map((e) => {
                        return e.trim();
                    });
                }
                console.log(seleArr);
                for (let ti = 0; ti < seleArr.length; ti++) {
                    if (seleArr[ti].indexOf(".") != -1) {
                        showTableDataStr += "<th>" + seleArr[ti].substring(seleArr[ti].indexOf(".") + 1,).trim() + "</th>";
                    } else {
                        showTableDataStr += "<th>" + seleArr[ti].trim() + "</th>";
                    }
                }
                showTableDataStr += "</tr></thead><tbody>";
                for (let i = 0; i < studentData.length; i++) {
                    for (let j = 0; j < scData.length; j++) {
                        if (studentData[i].Sno == scData[j].Sno) {
                            showTableDataStr += "<tr>";
                            for (let ii = 0; ii < seleArr.length; ii++) {
                                if (seleArr[ii].indexOf(".") != -1) {
                                    showTableDataStr += "<td>" + studentData[i][seleArr[ii].substring(seleArr[ii].indexOf('.') + 1,).trim()] + "</td>";
                                } else {
                                    if (dbs[useDb]['student'].title.indexOf(seleArr[ii]) != -1) {
                                        showTableDataStr += "<td>" + studentData[i][seleArr[ii]] + "</td>";
                                    } else {
                                        showTableDataStr += "<td>" + scData[j][seleArr[ii]] + "</td>";
                                    }
                                }

                            }
                            showTableDataStr += "</tr>";
                        }
                    }
                }

                $(".tbshowscon").html(showTableDataStr);
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

    /**
     * 数组去重
     * @param array
     * @returns {any[]}
     */
    function dedupe(array) {
        return Array.from(new Set(array));
    }

    function fiveShow() {
        var showTableDataStr = "<table><thead><tr><th>Sno</th><th>Sname</th><th>Sdept</th></tr></thead><tbody><tr><td>200215121</td><td>李勇</td><td>CS</td></tr><tr><td>200215122</td><td>刘晨</td><td>CS</td></tr></tbody></table>";
        $(".tbshowscon").html(showTableDataStr);
    }

    function xx() {
        var showTableDataStr = "<table><thead><tr><th>Sno</th><th>Sname</th></tr></thead><tbody><tr><td>200215121</td><td>李勇</td></tr><tr><td>200215122</td><td>刘晨</td></tr></tbody></table>";
        $(".tbshowscon").html(showTableDataStr);
    }

    function dy() {
        var showTableDataStr = "<table><thead><tr><th>Sno</th><th>Cno</th></tr></thead><tbody><tr><td>200215121</td><td>1</td></tr><tr><td>200215122</td><td>2</td></tr></tbody></table>";
        $(".tbshowscon").html(showTableDataStr);
    }

    function age() {
        var showTableDataStr = "<table><thead><tr><th>Sname</th><th>Sage</th></tr></thead><tbody><tr><td>王敏</td><td>18</td></tr></tbody></table>";
        $(".tbshowscon").html(showTableDataStr);
    }

    function name() {
        var showTableDataStr = "<table><thead><tr><th>Sname</th></tr></thead><tbody><tr><td>李勇</td></tr></tbody></table>";
        $(".tbshowscon").html(showTableDataStr);
    }

    function noName() {
        var showTableDataStr = "<table><thead><tr><th>Sname</th></tr></thead><tbody><tr><td>刘晨</td></tr><tr><td>王敏</td></tr><tr><td>张立</td></tr></tbody></table>";
        $(".tbshowscon").html(showTableDataStr);
    }

    function allName() {
        var showTableDataStr = "<table><thead><tr><th>Sname</th></tr></thead><tbody><tr><td>暂无数据</td></tr></tbody></table>";
        $(".tbshowscon").html(showTableDataStr);
    }

    function sno() {
        var showTableDataStr = "<table><thead><tr><th>Sno</th></tr></thead><tbody><tr><td>200215121</td></tr></tbody></table>";
        $(".tbshowscon").html(showTableDataStr);
    }

    function stuallMsg() {
        var showTableDataStr = "<table><thead><tr><th>Sno</th><th>Sname</th><th>Ssex</th><th>Sage</th><th>Sdept</th></tr></thead><tbody><tr><td>200215121</td><td>李勇</td><td>男</td><td>20</td><td>CS</td></tr><tr><td>200215122</td><td>刘晨</td><td>女</td><td>19</td><td>CS</td></tr></tbody></table>";
        $(".tbshowscon").html(showTableDataStr);
    }

    function l() {
        var showTableDataStr = "<table><thead><tr><th>Sno</th><th>Sname</th><th>Ssex</th><th>Sage</th><th>Sdept</th></tr></thead><tbody><tr><td>200215121</td><td>李勇</td><td>男</td><td>20</td><td>CS</td></tr></tbody></table>";
        $(".tbshowscon").html(showTableDataStr);
    }
});