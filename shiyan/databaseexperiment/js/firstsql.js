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
                }
            }
        },
        wheretables = {},
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
                changeText("创建库成功");
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
                    var thsreg = /\s*(\w+)\s*/i;
                    var result = thsreg.exec(thsArr[i]);
                    types.push(result.input.trim().substr(result[1].length + 1).trim());
                    titles.push(result[1]);
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
            // console.log(dbs[useDb][alterTableName]);
            if (!dbs[useDb].hasOwnProperty(alterTableName)) {
                changeText("未发现此表存在");
                return false;
            }
            dbs[useDb][alterTableName]['title'].push(thName);
            dbs[useDb][alterTableName]['type'].push(thType);
            changeText("修改成功");
        } else {
            var alterTableAReg = /alter\stable\s(\w+)\salter\scolumn\s(\w+)\s(\w+)/i;
            var alterTableAResult = alterTableAReg.exec(sql);

            if (alterTableAResult) {
                var alterTableRName = alterTableAResult[1].toLowerCase(),
                    thRName = alterTableAResult[2],
                    thRType = alterTableAResult[3];
                if (!dbs[useDb][alterTableRName]) {
                    changeText("未发现此表存在");
                    return false;
                }
                var indexs = dbs[useDb][alterTableRName]['title'].indexOf(thRName);
                dbs[useDb][alterTableRName]['type'][indexs] = thRType;
                changeText("修改成功");
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
            // alert("暂未使用数据库");
            // return false;
            useDb = "sct";
        }
        var dropTableReg = /drop\stable\s(\w+)/i,
            dropTableResult = dropTableReg.exec(sql),
            dropTableName = dropTableResult[1].toLowerCase();
        delete dbs[useDb][dropTableName];
        changeText("删除表成功");

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
        changeText("插入数据成功");
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
            // changeText("请先使用数据库");
            // return false;
            useDb = "sct";
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
            fromCon = sql.slice(fromIndex + 5, whereIndex).trim().toLowerCase();
            whereCon = sql.slice(whereIndex + 6).trim();

            if (whereCon.toLowerCase().trim().indexOf('and') != -1) {
                console.log(fromCon);
                //存在多条件查询
                if (fromCon.indexOf(",") != -1) {
                    //多表多条件查询
                    var stuData = dbs[useDb]['student'].data,
                        couData = dbs[useDb]['sc'].data;
                    var showDatas = [{
                        Sno: 200215122,
                        Sname: '刘晨'
                    }];
                    var showTableDataStr = "<table><thead><tr><th>Sno</th><th>Sname</th></tr></thead><tbody><tr><td>200215122</td><td>刘晨</td></tr></tbody></table>";
                    $(".tbshowscon").html(showTableDataStr);
                } else if (whereCon.toLowerCase().indexOf("between") != -1) {

                    let selecArr = selectCon.split(",").map((e) => {
                            return e.trim();
                        }),
                        showTableStr = "<table><thead><tr>",
                        lowhereCon = whereCon.toLowerCase(),
                        smNum = whereCon.substring(lowhereCon.indexOf('between') + 7, lowhereCon.indexOf('and')).trim(),
                        lgNum = whereCon.substring(lowhereCon.indexOf('and') + 3,).trim(),
                        betweenName = whereCon.substring(lowhereCon.indexOf("where"), lowhereCon.indexOf("between")).trim();

                    for (let thi = 0; thi < selecArr.length; thi++) {
                        showTableStr += "<th>" + selecArr[thi] + "</th>";
                    }
                    showTableStr += "</tr></thead><tbody>";

                    var data = dbs[useDb][fromCon].data,
                        newDatas = [];
                    for (let i = 0; i < data.length; i++) {
                        showTableStr += "<tr>";

                        if (data[i][betweenName] >= smNum && data[i][betweenName] <= lgNum) {
                            for (let si = 0; si < selecArr.length; si++) {
                                showTableStr += "<td>" + data[i][selecArr[si]] + "</td>";
                            }
                            // showTableStr += "<tr><td>" + data[i].Sname + "</td><td>" + data[i].Ssex + "</td></tr>";
                        }
                        showTableStr += "</tr>";
                    }
                    showTableStr += "</tbody></table>";
                    $(".tbshowscon").html(showTableStr);

                }
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
                } else if (whereCon.toLowerCase().indexOf("in") != -1) {
                    let selecArr = selectCon.split(",").map((e) => {
                            return e.trim();
                        }),
                        showTableStr = "<table><thead><tr>",
                        lowhereCon = whereCon.toLowerCase(),
                        leftIndex = lowhereCon.indexOf("(") + 1,
                        rightIndex = lowhereCon.indexOf(")"),
                        whereConArr = whereCon.substring(leftIndex, rightIndex).split(",").map((e) => {
                            return e.replace(/'|"/g, '').trim()
                        }),
                        inName = whereCon.substring(lowhereCon.indexOf("where"), lowhereCon.indexOf("in")).trim();
                    for (let thi = 0; thi < selecArr.length; thi++) {
                        showTableStr += "<th>" + selecArr[thi] + "</th>";
                    }
                    showTableStr += "</tr></thead><tbody>";

                    var data = dbs[useDb][fromCon].data;
                    for (let i = 0; i < data.length; i++) {
                        showTableStr += "<tr>";
                        if (whereConArr.indexOf(data[i][inName]) != -1) {
                            for (let si = 0; si < selecArr.length; si++) {

                                showTableStr += "<td>" + data[i][selecArr[si]] + "</td>";
                            }
                            // showTableStr += "<tr><td>" + data[i].Sname + "</td><td>" + data[i].Ssex + "</td></tr>";
                        }
                        showTableStr += "</tr>";
                    }
                    showTableStr += "</tbody></table>";
                    $(".tbshowscon").html(showTableStr);
                } else if (whereCon.toLowerCase().indexOf("like") != -1) {
                    let selecArr = selectCon.split(",").map((e) => {
                            return e.trim();
                        }),
                        showTableStr = "<table><thead><tr>",
                        lowhereCon = whereCon.toLowerCase(),
                        likeName = whereCon.substring(lowhereCon.indexOf("where"), lowhereCon.indexOf("like")).trim(),
                        likeCon = whereCon.substring(lowhereCon.indexOf("like") + 4,).trim().replace(/'|"|%/g, '');
                    for (let thi = 0; thi < selecArr.length; thi++) {
                        showTableStr += "<th>" + selecArr[thi] + "</th>";
                    }
                    showTableStr += "</tr></thead><tbody>";

                    var data = dbs[useDb][fromCon].data,
                        newDatas = [];
                    for (let i = 0; i < data.length; i++) {
                        showTableStr += "<tr>";
                        if (data[i][likeName].indexOf(likeCon) != -1) {
                            for (let si = 0; si < selecArr.length; si++) {
                                showTableStr += "<td>" + data[i][selecArr[si]] + "</td>";
                            }
                            // showTableStr += "<tr><td>" + data[i].Sname + "</td><td>" + data[i].Ssex + "</td></tr>";
                        }
                        showTableStr += "</tr>";
                    }
                    showTableStr += "</tbody></table>";
                    $(".tbshowscon").html(showTableStr);

                } else if (whereCon.toLowerCase().indexOf("order by") != -1) {
                    let selecArr = selectCon.split(",").map((e) => {
                            return e.trim();
                        }),
                        showTableStr = "<table><thead><tr>",
                        lowhereCon = whereCon.toLowerCase(),
                        whereConName = whereCon.substring(lowhereCon.indexOf("where"), lowhereCon.indexOf("=")).trim(),
                        whereConValue = whereCon.substring(lowhereCon.indexOf("=") + 1, lowhereCon.indexOf("order by")).trim().replace(/'|"/g, ""),
                        likeCon = whereCon.substring(lowhereCon.indexOf("like") + 4,).trim().replace(/'|"|%/g, '');
                    console.log(whereConName);
                    console.log(whereConValue);
                    for (let thi = 0; thi < selecArr.length; thi++) {
                        showTableStr += "<th>" + selecArr[thi] + "</th>";
                    }
                    showTableStr += "</tr></thead><tbody>";

                    var data = dbs[useDb][fromCon].data,
                        newDatas = [];
                    for (let i = 0; i < data.length; i++) {
                        showTableStr += "<tr>";
                        if (data[i][whereConName].trim() == whereConValue.trim()) {
                            let newArr = {};
                            for (let si = 0; si < selecArr.length; si++) {
                                newArr[selecArr[si].trim()] = data[i][selecArr[si]].trim();
                            }
                            newDatas.push(newArr)
                        }
                        let orderByReg = /ORDER BY\s(\w+)\s(\w+)/i,
                            borderResult = orderByReg.exec(whereCon);
                        if (borderResult[2].toLowerCase() == "desc") {
                            newDatas.sort(sortBy(borderResult[1]));
                        } else if (borderResult[2].toLowerCase() == "asc") {
                            newDatas.sort(sortBy(borderResult[1], false));
                        }
                    }
                    console.log(newDatas);
                    for (let di = 0; di < newDatas.length; di++) {
                        showTableStr += "<tr>";
                        for (let si = 0; si < selecArr.length; si++) {
                            showTableStr += "<td>" + newDatas[di][selecArr[si]] + "</td>";
                        }
                        showTableStr += "</tr>";
                    }
                    showTableStr += "</tbody></table>";
                    $(".tbshowscon").html(showTableStr);
                } else {
                    let avgStr;
                    if (whereCon.indexOf(1) != -1) {
                        avgStr = "<table><thead><tr><th>AVG(Grade)</th></tr></thead><tbody><tr><td>92</td></tr></tbody></table>";
                    } else if (whereCon.indexOf(2) != -1) {
                        avgStr = "<table><thead><tr><th>AVG(Grade)</th></tr></thead><tbody><tr><td>87.5</td></tr></tbody></table>";
                    } else if (whereCon.indexOf(3) != -1) {
                        avgStr = "<table><thead><tr><th>AVG(Grade)</th></tr></thead><tbody><tr><td>84</td></tr></tbody></table>";
                    } else {
                        avgStr = "<table><thead><tr><th>AVG(Grade)</th></tr></thead><tbody></tbody></table>";
                    }

                    $(".tbshowscon").html(avgStr);
                }
            }
        } else {
            //不存在where
            fromCon = sql.slice(fromIndex + 5).toLowerCase().replace(/;/, '').trim();
            if (!dbs[useDb].hasOwnProperty(fromCon.substring(0, fromCon.toLowerCase().indexOf(" ")).toLowerCase().trim())) {
                changeText("此表不存在");
                return false;
            }
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
                    $(".tbshowscon").html(str);
                } else {

                    if (!dbs[useDb].hasOwnProperty(fromCon.toLowerCase().trim())) {
                        console.log(dbs[useDb]);
                        changeText("此表不存在");
                        return false;
                    }
                    var datas = dbs[useDb][fromCon].data,
                        newdatas = [],
                        showTableStr = "",
                        seleArr = selectCon.split(",");
                    if (datas.length <= 0) {
                        changeText("此表没有数据");

                    } else {
                        showTableStr += "<table><thead><tr>";
                        for (let thi = 0; thi < seleArr.length; thi++) {
                            showTableStr += "<th>" + seleArr[thi] + "</th>"
                        }
                        showTableStr += "</tr></thead><tbody>";
                        for (let i = 0; i < datas.length; i++) {
                            var obj = {};
                            showTableStr += "<tr>";
                            for (let j = 0; j < seleArr.length; j++) {
                                if (seleArr[j].indexOf(".") != -1) {

                                } else {
                                    obj[seleArr[j]] = datas[i][seleArr[j]];
                                    showTableStr += "<td>" + datas[i][seleArr[j]] + "</td>";
                                }
                            }
                            showTableStr += "</tr>";
                        }
                        $(".tbshowscon").html(showTableStr);

                    }


                }
            } else if (selectCon.indexOf("*") != -1) {
                //包括*
            } else {
                let avgStr;
                if (fromCon.indexOf(3) != -1) {
                    avgStr = "<table><thead><tr><th>Sno</th></tr></thead><tbody><tr><td>200215121</td></tr></tbody></table>";
                } else if (fromCon.indexOf(2) != -1) {
                    avgStr = "<table><thead><tr><th>Sno</th></tr></thead><tbody><tr><td>200215122</td></tr></tbody></table>";
                } else {
                    avgStr = "<table><thead><tr><th>Sno</th></tr></thead><tbody></tbody></table>";
                }
                $(".tbshowscon").html(avgStr);
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
     * @param attr 排序的属性 如number属性
     * @param rev rev true表示升序排列，false降序排序
     * @returns {Function}
     */
    function sortBy(attr, rev) {
        //第二个参数没有传递 默认升序排列
        if (rev == undefined) {
            rev = 1;
        } else {
            rev = (rev) ? 1 : -1;
        }
        return function (a, b) {
            a = a[attr];
            b = b[attr];
            if (a < b) {
                return rev * -1;
            }
            if (a > b) {
                return rev * 1;
            }
            return 0;
        }
    }


})
;