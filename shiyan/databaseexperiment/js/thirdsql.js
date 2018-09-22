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

                }
            }
        };

    $("#do").on("click", function () {
        //sql语句
        var sql = $(".CodeMirror-line ").text().trim().replace(/\s+/g, ' '),
            newsql = sql.toLowerCase();
        if (newsql.indexOf("delete") != -1) {
            deletes(sql);
        } else if (newsql.indexOf("insert") != -1) {
            insert(sql);
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
            console.log(deleteTableResult);
            let deteTableName = deleteTableResult[1].toLowerCase(),
                deleteCon = deleteTableResult.input,
                deleteContoLowerCase = deleteCon.toLowerCase(),
                deleteWhere = deleteContoLowerCase.substr(deleteContoLowerCase.indexOf("where") + 5).trim().replace(/'|"/g,""),
                deleteWhereArr = deleteWhere.split("=");

            console.log(deleteWhereArr);

        }
    }

    /**
     * 添加数据
     * @param sql
     */
    function insert(sql) {

    }

});