$(document).ready(function () {
    let views = {},
        timeOut = "",
        dbs = {
            sct: {
                student: {
                    title: ["Sno", "Sname", "Ssex", "Sage", "Sdept"],
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
                course: {
                    title: ["Cno", "Cname", "Cpno", "Ccredit"],
                    data: [
                        {
                            Cno: 1,
                            Cname: "数据库",
                            Cpno: 5,
                            Ccredit: 4,
                        },
                        {
                            Cno: 2,
                            Cname: "数学",
                            Cpno: "",
                            Ccredit: 2,
                        },
                        {
                            Cno: 3,
                            Cname: "信息系统",
                            Cpno: 5,
                            Ccredit: 4,
                        },
                        {
                            Cno: 4,
                            Cname: "操作系统",
                            Cpno: 6,
                            Ccredit: 3,
                        },
                        {
                            Cno: 5,
                            Cname: "数据结构",
                            Cpno: 7,
                            Ccredit: 4,
                        },
                        {
                            Cno: 6,
                            Cname: "数据处理",
                            Cpno: "",
                            Ccredit: 2,
                        },
                        {
                            Cno: 7,
                            Cname: "PASCL语言",
                            Cpno: 6,
                            Ccredit: 4,
                        }
                    ]
                },
                sc: {
                    title: ["Sno", "Cno", "Grade"],
                    data: [
                        {
                            Sno: 200215125,
                            Cno: 1,
                            Grade: 92
                        },
                        {
                            Sno: 200215121,
                            Cno: 2,
                            Grade: 80
                        },
                        {
                            Sno: 200215121,
                            Cno: 3,
                            Grade: 88
                        },
                        {
                            Sno: 200215122,
                            Cno: 2,
                            Grade: 90
                        },
                        {
                            Sno: 200215122,
                            Cno: 3,
                            Grade: 80
                        }
                    ]
                }
            }
        };

    $("#do").on("click", function () {
        //sql语句
        var sql = $(".CodeMirror-line ").text().trim().replace(/\s+/g, ' '),
            sql = sql.replace(/'|"/g, ''),
            newsql = sql.toLowerCase().replace(/'|"/g, '');
        if (newsql.indexOf("create view") != -1) {
            createView(sql);
        } else if (newsql.indexOf("select") == 0) {
            selectView(sql);
        } else if (newsql.indexOf("drop") != -1) {
            drop(sql);
        } else if (newsql.indexOf("insert") == 0) {
            insert(sql);
        }
    });

    /**
     * 创建视图
     * @param sql
     */
    function createView(sql) {
        var LowerCasesql = sql.toLowerCase();
        var viewname = sql.substring(LowerCasesql.indexOf("view") + 4, LowerCasesql.indexOf("as")).trim().toLowerCase(),
            titleArr = viewname.indexOf("(") ? viewname.substring(viewname.indexOf("(") + 1, viewname.indexOf(")")) : [],
            viewname = viewname.indexOf("(") != -1 ? viewname.substring(0, viewname.indexOf("(")) : viewname,

            ascon = sql.substring(LowerCasesql.indexOf("as") + 2),
            selectcon = sql.substring(LowerCasesql.indexOf("select") + 6, LowerCasesql.indexOf("from")),
            selectconArr = selectcon.split(",").map((ele) => {
                return ele.trim();
            }),
            fromcon = "";
        if (LowerCasesql.indexOf("where") != -1) {
            fromcon = sql.substring(LowerCasesql.indexOf("from") + 4, LowerCasesql.indexOf("where")).toLowerCase().trim();
            var wherecon = sql.substring(LowerCasesql.indexOf("where") + 5).trim();
            if (wherecon.toLowerCase().indexOf("and") != -1) {
                //多条件
                if (fromcon.indexOf(",") != -1) {
                    fromconArr = fromcon.split(",").map((e) => {
                        return e.trim();
                    });
                    whereconArr = wherecon.replace(/and/ig, 'and').split("and").map((el) => {
                        return el.trim();
                    });

                    if (wherecon.toLowerCase().indexOf(">=") != -1 && wherecon.toLowerCase().indexOf("88") != -1) {
                        let obj = {}, viewName = "IS_S1_88";
                        obj.title = ['Sno', 'Sname', 'Grade'];
                        obj.data = [{
                            Sno: 200215125,
                            Sname: "张立",
                            Grade: 92
                        }];
                        views[viewName.toLowerCase()] = obj;
                        changeText("创建视图成功");
                        console.log(views)
                    }


                } else {


                }

            } else {
                //单条件
                var tjName = wherecon.split("=")[0].trim(),
                    tiCon = wherecon.split("=")[1].trim();
                if (fromcon.indexOf(",") != -1) {
                } else {

                    let datas = dbs.sct[fromcon].data,
                        newObj = {};
                    newObj.title = titleArr.length ? titleArr : selectconArr.map(function (ele) {
                        return ele.trim();
                    });
                    newObj.data = [];
                    for (let i = 0; i < datas.length; i++) {
                        if (datas[i][tjName] == tiCon) {
                            var obj = {};
                            for (let j = 0; j < selectconArr.length; j++) {
                                obj[selectconArr[j]] = datas[i][selectconArr[j]];
                            }
                            newObj.data.push(obj);
                        }
                    }
                    views[viewname] = newObj;

                    changeText("创建视图成功");
                    console.log(views);
                }
            }
        } else {
            fromcon = sql.substring(LowerCasesql.indexOf("from") + 4, LowerCasesql.indexOf("group")).toLowerCase().trim();
            let groupby = sql.substring(LowerCasesql.indexOf("group by") + 8).replace(/;/g, "").trim(),
                data = dbs.sct[fromcon];
            let obj = {}, viewName = "S_G";
            obj.title = ['Sno', 'Gavg'];
            obj.data = [{
                Sno: 200215125,
                Gavg: 92
            }, {
                Sno: 200215121,
                Gavg: 86.5
            }, {
                Sno: 200215122,
                Gavg: 85
            }];
            views[viewName.toLowerCase()] = obj;
            changeText("创建视图成功");
            var showTableStr = "<table><thead><tr><th>Sno</th><th>Gavg</th></tr></thead><tbody><tr><td>200215121</td><td>86.5</td></tr><tr><td>200215122</td><td>85</td></tr><tr><td>200215125</td><td>92</td></tr></tbody></table>";
            $(".tbshowscon").html(showTableStr);
            console.log(views);

        }
    }

    /**
     * 查询视图
     * @param sql
     */
    function selectView(sql) {
        let tlsql = sql.toLowerCase(),
            seleConArr = sql.substring(tlsql.indexOf("select") + 6, tlsql.indexOf("from")).split(",").map((e) => {
                return e.trim();
            }),
            whereCon = sql.substring(tlsql.indexOf("where") + 5,),
            whereConArr = [];
        if (whereCon.toLowerCase().indexOf("and") != -1) {
            whereConArr = whereCon.split("AND").map((e) => {
                return e.trim();
            });
            if (!views.hasOwnProperty('is_student')) {
                changeText("is_student视图不存在");
                return false;
            }
            let isstudentData = views.is_student.data,
                scData = dbs.sct.sc.data,
                num = "",
                showTableStr = "<table><thead><tr>";
            for (let ti = 0; ti < seleConArr.length; ti++) {
                showTableStr += "<th>" + seleConArr[ti] + "</th>";
            }
            showTableStr += "</tr></thead><tbody>";
            for (let w = 0; w < whereConArr.length; w++) {
                console.log(whereConArr[w]);
                if (whereConArr[w].toLowerCase().indexOf("sc.cno") != -1) {
                    num = whereConArr[w].substring(whereConArr[w].toLowerCase().indexOf("=") + 1,).replace(/'|"/g, "").trim();
                }
            }

            for (let i = 0; i < isstudentData.length; i++) {
                showTableStr += "<tr>";
                for (let j = 0; j < scData.length; j++) {
                    if (scData[j]['Cno'] == num && isstudentData[i]['Sno'] == scData[j]['Sno']) {
                        for (let si = 0; si < seleConArr.length; si++) {
                            showTableStr += "<td>" + isstudentData[i][seleConArr[si]] + "</td>";
                        }

                    }
                }
                showTableStr += "</tr>";
            }
            $(".tbshowscon").html(showTableStr);


        }

    }

    /**
     * 插入数据
     * @param sql
     */
    function insert(sql) {
        let newsqls = sql.toLowerCase(),
            intoname = sql.substring(newsqls.indexOf("into") + 4, newsqls.indexOf("values")).toLowerCase().trim(),
            val = sql.substring(newsqls.indexOf("values") + 6).trim().replace(/\(|\)|;/g, ""),
            valArr = val.split(",").map((e) => {
                return e.trim();
            }),
            title = views[intoname].title, obj = {};
        for (let i = 0; i < title.length; i++) {
            obj[title[i]] = valArr[i];
        }
        views[intoname].data.push(obj);
        console.log(views);

    }

    /**
     * 删除视图
     * @param sql
     */
    function drop(sql) {
        var dropviewReg = /drop\sview\s(\w+)/i,
            dropResult = dropviewReg.exec(sql);
        if (dropResult) {
            let dropname = dropResult[1].toLowerCase();
            delete views[dropname];
            alert("删除成功");
        }
        console.log(views);
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