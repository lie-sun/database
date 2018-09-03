$(document).ready(function () {
    var dbName = "";
    $("#do").on("click", function (params) {
        var sql = $(".CodeMirror-line ").text().trim();
        /* 什么都不输的时候打出来是空，尽然不等于'' */

        //创建数据库
        var createreg = /^create\sdatabase\s(\w+)\s?\w*/i; //是否创建库语句检测
        var sreg = /(\w*(\s)\w*)+/g;
        if (!sreg.test(sql)) {
            alert("sql语句出问题了，请检查后执行");
            return false;
        }

        var result = createreg.exec(sql);
        if (result) {
            var databaseName = result[result.length - 1];
            if ($('.' + databaseName).length) {
                alert("此数据库已存在");
                return false;
            }

            var str = "<ul class='" + databaseName + "'><p class='dbname'><span><img src='images/jt-r.png' class='jt sm'> <img src='images/database.png' class='dbs sm'/></span>" + databaseName + "</p></ul>";
            $(".dbs-con").append(str);

            $("." + databaseName + '>p').on("click", function (e) {
                var src = $(this).children("span").children(".jt").attr("src");
                if (src == 'images/jt-r.png') {
                    $(this).children("span").children(".jt").attr("src", "images/jt-b.png");
                    $(this).parent().children("li").show();
                } else {
                    $(this).children("span").children(".jt").attr("src", "images/jt-r.png");
                    $(this).parent().children("li").hide();
                }
            })
        } else {
            //删除数据库
            var delreg = /^drop\sdatabase\s(\w+)/i;
            var delresult = delreg.exec(sql);
            if (delresult) {
                var delname = delresult[delresult.length - 1];
                if ($("." + delname).length <= 0) {
                    alert("此数据库不存在");
                    return false;
                }
                $("." + delname).remove();
            } else {
                //使用数据库
                var usereg = /^use\s(\w+)/i;
                var useresult = usereg.exec(sql);
                if (useresult) {
                    var usename = useresult[useresult.length - 1];
                    $(".dbname").removeClass("active");
                    $("." + usename).children("p").addClass("active").children(".jt").attr("src", "images/jt-b.png");
                    dbName = usename;

                } else {
                    //建表
                    var createtablereg = /^create\stable\s(\w+)/i;
                    var createtableresult = createtablereg.exec(sql);
                    if (createtableresult) {
                        if (!dbName) {
                            alert("请选择数据库后在创建表");
                            return false;
                        }
                        var tablename = createtableresult[createtableresult.length - 1];
                        var index = createtableresult.input.trim().indexOf("(");
                        var lastindex = createtableresult.input.trim().lastIndexOf(")");
                        var tablestr = createtableresult.input.substring(index + 1, lastindex);
                        var tableArr = tablestr.split(",");
                        var talen = tableArr.length;
                        var threg = /^\s*(\w*)\s*/i;
                        var tbstr = "<table class='" + tablename + "'><thead><tr>";
                        for (var i = 0; i < talen; i++) {
                            tbstr += "<th>" + threg.exec(tableArr[i])[1] + "</th>";
                        }
                        tbstr += "</th></thead>";
                        $(".tbs-con table").hide();
                        $(".tbs-con").append(tbstr);
                        var dbsli = "<li class='" + tablename + " litbs'>" + tablename + "</li>";
                        $("." + dbName).append(dbsli);
                    } else {
                        //删除表
                        var deltablereg = /^\s*drop\s*table\s*(\w+)/i;
                        var deltableresult = deltablereg.exec(sql);
                        if (deltableresult) {
                            if (!dbName) {
                                alert("请选择删除所在表数据库");
                                return false;
                            }
                            var deltablename = deltableresult[deltableresult.length - 1];
                            $(".dbs-con li." + deltablename).remove();
                            $(".tbs-con table." + deltablename).remove();
                        } else {
                            //修改表之添加
                            var altertablereg = /^\s*alter\s+table\s+(\w*)\s*add\s*((\w*)\s*(\w*))*/i;
                            var altertableresult = altertablereg.exec(sql);
                            if (altertableresult) {
                                if (!dbName) {
                                    alert("请选择删除所在表数据库");
                                    return false;
                                }
                                var altertablename = altertableresult[1]; //表名
                                var altertablethname = altertableresult[2]; //添加字段的名字
                                var addthstr = "<th>" + altertablethname + "</th>";
                                $("table." + altertablename + " thead tr").append(addthstr);
                            } else {
                                // 修改表之删除
                                var altertabledelreg = /^\s*alter\s+table\s+(\w+)\s+drop\s+(\w+)/i;
                                var altertabledelresult = altertabledelreg.exec(sql);
                                console.log(altertabledelresult);
                                if (altertabledelresult) {
                                    if (!dbName) {
                                        alert("请选择删除所在表数据库");
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
})