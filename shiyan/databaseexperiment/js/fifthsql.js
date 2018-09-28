$(document).ready(function () {
    $("#do").on("click", function () {
        //sql语句
        var sql = $(".CodeMirror-line ").text().trim().replace(/\s+/g, ' '),
            sql = sql.replace(/'|"/g, ''),
            newsql = sql.toLowerCase().replace(/'|"/g, '');
        if (newsql.indexOf("grant") != -1) {
            grant(sql);
        } else if (newsql.indexOf("revoke") != -1) {
            revoke(sql);
        }
    })

    /**
     * 授权
     * @param sql
     */
    function grant(sql) {
        var grantReg = /grant\s(\w+)\son\stable\s(\w+)\sto\s(\w+)/i,
            grantResult = grantReg.exec(sql);
        if (grantResult) {
            let type = grantResult[1],
                table = grantResult[2],
                user = grantResult[3];
            alert("把" + type + " " + table + "表的权限给了用户" + user);
        }
    }

    /**
     * 收回
     * @param sql
     */
    function revoke(sql) {
        let revokeReg = /revoke\s(\w+)\((\w+)\)\son\stable\s(\w+)\sfrom\s(\w+)/i,
            revokeResult = revokeReg.exec(sql);
        if (revokeResult) {
            let user = revokeResult[4],
                table = revokeResult[3],
                type = revokeResult[1],
                th = revokeResult[2];
            alert("把用户" + user + " " + type + " " + table + "表" + th + "的权限收回");
        }
    }
});