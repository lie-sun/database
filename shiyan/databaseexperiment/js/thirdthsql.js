$(document).ready(function () {
    $("#do").on("click", function () {
        //sql语句
        var sql = $(".CodeMirror-line ").text().trim();
        var createreg = /\s*update\s+(\w+)\n*\s*set\s+(\w+)\s*=\s*(\w+)\+?(\d*)\n*\s*where\s+(\w+)\s*=\s*\'\s*(\w+)\s*\'/i;
        var createreult = createreg.exec(sql);
        var tablename = createreult[1],
            updatename = createreult[2],
            ldname = createreult[3],
            num = createreult[4],
            conditionname = createreult[5],
            condition = createreult[6],
            ths = $("." + tablename + " tbody td"),
            len = ths.length;
        for (var i=0;i<len;i++) {
            if(ths.eq(i).text()==condition){
                ths.eq(i).parent().parent()
            }
        }

    })
})