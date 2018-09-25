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
                        {}
                    ]

                }
            }
        };


    showMsg('student');

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
            console.log(dbs)

        }
    }

    /**
     * 添加数据
     * @param sql
     */
    function insert(sql) {

    }

    /**
     * 更新数据
     * @param sql
     */
    function update(sql) {

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
                str +="<td>"+data[i][title[j]]+"</td>"
            }
            str += "</tr>";
        }
        str += "</tbody></table>";
        $(".rightss").html(str);
    }

});