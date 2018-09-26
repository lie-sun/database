$(document).ready(function () {
    var useDb = 'stc',
        dbs = {
            stc: {
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
        };

    showMsg('student');
    showMsg('sc');

    $("#do").on("click", function () {
        //sql语句
        var sql = $(".CodeMirror-line ").text().trim().replace(/\s+/g, ' '),
            newsql = sql.toLowerCase();
        if (newsql.indexOf("delete") != -1) {
            deletes(sql);
        } else if (newsql.indexOf("insert") != -1) {
            insert(sql);
        } else if (newsql.indexOf("update") != -1) {
            update(sql);
        }
    });

    /**
     * 删除表
     * @param sql
     */
    function deletes(sql) {
        var deleteTableReg = /delete\sfrom\s(\w+)/i,
            deleteTableResult = deleteTableReg.exec(sql);
        if (deleteTableResult) {
            let deteTableName = deleteTableResult[1].toLowerCase(),
                deleteCon = deleteTableResult.input,
                deleteContoLowerCase = deleteCon.toLowerCase(),
                deleteWhere = deleteCon.substr(deleteContoLowerCase.indexOf("where") + 5).trim().replace(/'|"/g, ""),
                deleteWhereArr = deleteWhere.split("=");
            var data = dbs[useDb][deteTableName].data;
            for (let i = 0; i < data.length; i++) {
                if (data[i][deleteWhereArr[0]] == deleteWhereArr[1]) {
                    dbs[useDb][deteTableName].data.splice(i, 1);
                }
            }
            showMsg(deteTableName);
        }
    }

    /**
     * 添加数据
     * @param sql
     */
    function insert(sql) {

        var insertTableReg = /insert\sinto\s(\w+)/i,
            insertResult = insertTableReg.exec(sql);
        if (insertResult) {
            var insertName = insertResult[1].toLowerCase(),
                insertStr = insertResult.input,
                insertStrTolowerCase = insertResult.input.toLowerCase(),
                thStr = insertStr.substring(insertStrTolowerCase.indexOf("into") + 4, insertStrTolowerCase.indexOf("values")),
                newthStr = thStr.substring(thStr.indexOf("(") + 1, thStr.indexOf(")")),
                valueStr = insertStr.substring(insertStrTolowerCase.indexOf("values") + 6).replace(/'|"/g, '').replace(/\(|\)/g, ''),
                addThArr = dbs[useDb][insertName].title,
                addValArr = valueStr.split(",");
            console.log(valueStr);
            var obj = {};
            for (var j = 0; j < addThArr.length; j++) {
                if (!addValArr[j]) {
                    obj[addThArr[j]] = "";
                } else {
                    obj[addThArr[j]] = addValArr[j].trim();
                }

            }
            dbs[useDb][insertName].data.push(obj);
            showMsg(insertName);
            console.log(dbs);


        }
    }

    /**
     * 更新表数据
     * @param {*} sql
     */
    function update(sql) {
        var updatetablereg = /update\s(\w+)/i;
        var result = updatetablereg.exec(sql),
            tablename = result[1].toLowerCase(),
            updateStr = result.input.replace(/'|"/g, ''),
            updateStrToLowerCase = result.input.toLowerCase().trim(),
            datas = dbs[useDb][tablename].data,
            whereStr = updateStr.substring(updateStrToLowerCase.indexOf("where") + 5).trim(),
            setStr = updateStr.substring(updateStrToLowerCase.indexOf('set') + 3, updateStrToLowerCase.indexOf('where')).trim(),
            tjname = whereStr.split('=')[0].trim(),
            tjcon = whereStr.split('=')[1].trim(),
            setname = setStr.split('=')[0].trim(),
            setcon = setStr.split('=')[1].trim();
        if (setcon.indexOf("+") != -1) {
            var setconname = setcon.split("+")[0].trim(),
                setconnum = setcon.split("+")[1].trim();
            for (var i = 0; i < datas.length; i++) {
                if (datas[i][tjname] == tjcon) {
                    dbs[useDb][tablename]['data'][i][setname] = parseInt(dbs[useDb][tablename]['data'][i][setconname]) + parseInt(setconnum);
                }
            }
            showMsg(tablename);

        } else {
            if (dbs[useDb][tablename]['title'].indexOf(setcon) != -1) {
                for (var ii = 0; ii < datas.length; ii++) {
                    if (datas[i][tjname] == tjcon) {
                        dbs[useDb][tablename]['data'][ii][setname] = dbs[useDb][tablename]['data'][ii][setcon];
                    }
                }
                showMsg(tablename);
            } else {
                for (var iii = 0; iii < datas.length; iii++) {
                    if (datas[iii][tjname] == tjcon) {
                        dbs[useDb][tablename]['data'][iii][setname] = setcon;
                    }
                }
                console.log(dbs);
                showMsg(tablename);
            }
        }
    }


    function showMsg(tableName) {
        if (!tableName) {
            alert("请表名不正确");
            return false;
        }
        var tablemsg = dbs[useDb][tableName],
            data = tablemsg.data,
            title = tablemsg.title;
        var str = "<table><thead><tr>";
        for (var z = 0; z < title.length; z++) {
            str += "<th>" + title[z] + "</th>"
        }
        str += "</tr></thead><tbody>";
        for (var i = 0; i < data.length; i++) {
            str += "<tr>";
            for (var j = 0; j < title.length; j++) {
                var addData = data[i][title[j]] ? data[i][title[j]] : "";
                str += "<td>" + addData + "</td>"
            }
            str += "</tr>";
        }
        str += "</tbody></table>";
        $("." + tableName).html(str);
    }

});