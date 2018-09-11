$(document).ready(function () {
    $("#do").on("click", function () {
        //获取输入语句
        var sql = $(".CodeMirror-line ").text().trim();

        var sql = sql.replace(/\s+/g,' ');

        //创建语句正则
        var creatatablereg = /\s*create\s+table\s+(\w+)/i;
        var createtableresult = creatatablereg.exec(sql);
        if(createtableresult){

            var createtablename = createtableresult[1];
            $(".rightss").append("<h2 class='"+createtablename+"'>表"+createtablename+"</h2>");
            var str  = "<table class='"+createtablename+"'><tr>";
            var createtableths = createtableresult.input;
            createtableths = createtableths.substring(createtableths.indexOf("(")+1,createtableths.trim().lastIndexOf(")"));
            var thsArr = createtableths.split(",");
            var ths = [];
            for(var i=0;i<thsArr.length;i++){
                var thsreg = /\s*(\w+)\s*/i;
                var result = thsreg.exec(thsArr[i]);

                var obj = {};
                obj.name = result[0].trim();
                ths.push(obj);
                str += "<th types='"+1+"'>"+result[0].trim()+"</th>";
            }
            str +="</tr></thead><tbody></tbody></table>";
            $(".rightss").append(str);
        }else{
            /*
        * 删除库语句
        * */
            var deltablereg = /\s*drop\s+table\s+(\w+)/i;
            var deltableresult = deltablereg.exec(sql);
            if(deltableresult){
                var deltablename = deltableresult[1];
                $("."+deltablename).remove();
            }else{
                /*
                * 修改表之添加
                * */
                var altertablereg = /\s*alter\s+table\s+(\w+)\s+add\s+(\w+)\s+(\w+)/i;

                altertableresult = altertablereg.exec(sql);
                if(altertableresult){
                    var altertablename = altertableresult[1];
                    var altertableth =  altertableresult[2];
                    var altertablethtype =  altertableresult[3];
                    var th = "<th types='"+altertablethtype+"'>"+altertableth+"</th>";
                    $("."+altertablename+" thead").append(th);
                }else{
                    /**
                     * 修改表之修改
                     */
                    var altertablalterreg = /\s*alter\s+table\s+(\w+)\s+alter\s+COLUMN\s+(\w+)\s+(\w+)/i;

                    var altertablealterresult = altertablalterreg.exec(sql);
                    if(altertablealterresult){
                        var altertablealtername = altertablealterresult[1];
                        var alterth = altertablealterresult[2];
                        var alterthtype = altertablealterresult[3];
                    }else{
                        /**
                         * 创建数据库
                         */
                        var creatadatabase = /\s*create\s+database\s(\w+)/i;
                        var createdatabaseresult = creatadatabase.exec(sql);
                        if(createdatabaseresult){
                            var createdatabasename = createdatabaseresult[1];

                        }else{
                            /**
                             * 使用数据库
                             */
                            var usedatabasereg = /\s*use\s+(\w+)/i;
                            var usedatabaseresult = usedatabasereg.exec(sql);
                            if(usedatabaseresult){
                                var usedatabasename = usedatabaseresult[1];

                            }else{

                            }
                        }
                    }
                }

            }
        }



    })
});