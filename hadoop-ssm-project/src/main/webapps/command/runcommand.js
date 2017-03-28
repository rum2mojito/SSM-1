/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
//run a command of input
function run(var1) {
    var number = var1.substring(var1.length-1);
    if (($('#cmd-'+number).val()) == "showCache") {
        var url= '/ssm/v1?op=SHOWCACHE&cmd=' + $('#cmd-'+number).val();
        $("#figure-"+number).show().siblings().hide();
        pie(number);
        // line(number);
        // bar(number);
    }else {
        // alert($('#cmd-'+number).val());
        var url = '/ssm/v1?op=RUNCOMMAND&cmd=' + $('#cmd-'+number).val();
        $("#output-"+number).show().siblings().hide();
        $.ajax({
            type: 'PUT',
            url: url
        }).then(function(data) {
            $('#stdout-'+number).html('');
            $('#stderr-'+number).html('');
            for (var j=0;j<data.stdout.length;j++) {
                $('#stdout-'+number).append(data.stdout[j]+'<br>');
            }
            for (var j=0;j<data.stderr.length;j++) {
                $('#stderr-'+number).append(data.stderr[j]+'<br>');
            }
        });
    }
}

//create a new command input
var i = 0;
function newDiv(var2) {
    i = i+1;
    var $div = $('<form onsubmit="return false;">'+
        '<div class="input-group" >'+
        '<input type="text" class="form-control" id="cmd-'+i+'" />'+
        '<span class="input-group-btn">'+
        '<button class="btn btn-default" data-loading-text="Running" type="button" onclick="run(this.id)" id="btn-run-cmd-'+i+'">Run!</button>'+
    '</span>'+
    '<span class="input-group-btn">'+
        '<button class="btn btn-default pull-right" id="btn-new-'+i+'" onclick="newDiv(this.id)">new</button>'+
       ' </span>'+
        '</div >'+

        '<div >'+
        '<div id="output-'+i+'" style="display: none;">'+
        'stdout is <p id="stdout-'+i+'"></p>'+
        'stderr is <p id="stderr-'+i+'"></p>'+
        '</div>'+
        '<div id="figure-'+i+'" class="row" style="display: none;">'+
        '<div class="col-xs-10 col-md-10">'+
        '<div id="myChart1-'+i+'" style="display:none;width:800px;height:400px;margin:0 auto;"></div>'+
        '<div id="myChart2-'+i+'" style="display:none;width:800px;height:400px;margin:0 auto;"></div>'+
        '<div id="myChart3-'+i+'" style="display:none;width:800px;height:400px;margin:0 auto;"></div>'+
        '</div>'+
        '<div class="col-xs-2 col-md-2">'+
        '<select class="form-control" id="select-'+i+'" name="chart" onchange="select(this.id)" >'+
        '<option value="line">line chart</option>'+
    '<option value="bar">bar chart</option>'+
    '<option value="pie">pie chart</option>'+
    '</select>'+
    '</div>'+
    '</div>'+

    '<div id="ring-'+i+'" style="width:400px;height:200px;margin:0 auto;">'+

        '</div>'+
        '</div>'+

        '</form>');
    $("#web-console").append($div);
}

//show a drowpdownlist to show different charts
function select(var3) {
    var number = var3.substring(var3.length-1);
    var type = $("#select-"+number).find(':selected').val();
    if(type === 'line') {
        line(number);
        $("#myChart1-"+number).show().siblings().hide();
    }
    if(type === 'bar') {
        bar(number);
        $("#myChart2-"+number).show().siblings().hide();
    }
    if(type === 'pie') {
        pie(number);
        $("#myChart3-"+number).show().siblings().hide();
    }
}

// show a pie chart
function pie(number) {
    var myChart = echarts.init(document.getElementById('myChart1-'+number));
    var option = {
        title : {
            text: 'Cache统计',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data: (function() {
                var arr1 = [];
                $.ajax({
                    type:"GET",
                    url : 'http://localhost:9871/ssm/v1?op=SHOWCACHE',
                    dataType:"json",
                    async: false,
                    success : function(result) {
                        for (var key in result) {
                            arr1.push(key);
                        }

                    },
                    error : function(errorMsg) {
                        alert("sorry, 请求数据失败");
                        myChart.hideLoading();
                    }
                })

                return arr1;
            })()

        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
//                              magicType : {
//                                  show: true,
//                                  type: ['pie', 'funnel'],
//                                  option: {
//                                      funnel: {
//                                          x: '25%',
//                                          width: '50%',
//                                          funnelAlign: 'left',
//                                          max: 1548
//                                      }
//                                  }
//                              },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        series : [
            {
                name:'Cache使用情况',
                type:'pie',
                radius : '55%',
                center: ['50%', '50%'],
                //                  data:[{"name":"cacheCapacity","value":"3"},{"name":"cacheRemaining","value":2},{"name":"cacheUsed","value":1},{"name":"cacheUsedPercentage","value":33}]
                data: (function() {
                    var arr = [];
                    $.ajax({
                        type:"GET",
                        url : 'http://localhost:9871/ssm/v1?op=SHOWCACHE',
                        async : false,
                        dataType:"json",
                        success : function(result) {
                            for (var key in result) {
                                arr.push({"name":key,"value":result[key]});
                            }
                        },
                        error : function(errorMsg) {
                            alert("sorry, 请求数据失败");
                            myChart.hideLoading();
                        }
                    })
                    return arr;
                })()

            }

        ]
    };

    myChart.setOption(option);
}

//show a line chart
function line(number) {
    var myChart = echarts.init(document.getElementById('myChart2-'+number));

    //指定图表的配置项和数据
    var option = {
        title: {
            //显示标题
            text: 'Cache统计',
            //标题显示的位置
//                        left: 'center'
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
//                              magicType : {
//                                  show: true,
//                                  type: ['line'],
//                              },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        tooltip: {trigger:'axis'},
        //在示例中我们看到图表中需要的数据为
        //显示需要统计的分类
        xAxis: [
            {
                data: (function() {
                    var arr1 = [];
                    $.ajax({
                        type:"GET",
                        url : 'http://localhost:9871/ssm/v1?op=SHOWCACHE',
                        dataType:"json",
                        async: false,
                        success : function(result) {
                            for (var key in result) {
                                arr1.push(key);
                            }

                        },
                        error : function(errorMsg) {
                            alert("sorry, 请求数据失败");
                            myChart.hideLoading();
                        }
                    })

                    return arr1;
                })()

            }
        ],

        yAxis: {},
        series: [{
            name: '数量',
            type: 'line',
            //        data : [3,2,1,33]
            data: (function() {
                var arr1 = [];
                $.ajax({
                    type:"GET",
                    url : 'http://localhost:9871/ssm/v1?op=SHOWCACHE',
                    dataType:"json",
                    async: false,
                    success : function(result) {
                        for (var key in result) {
                            arr1.push(result[key]);
                        }

                    },
                    error : function(errorMsg) {
                        alert("sorry, 请求数据失败");
                        myChart.hideLoading();
                    }
                })
                return arr1;
            })()
        }]

    };


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
// show a bar chart
function bar (number) {
    var myChart = echarts.init(document.getElementById('myChart3-'+number));

    //指定图表的配置项和数据
    var option = {
        title: {
            //显示标题
            text: 'Cache统计',
            //标题显示的位置
            left: 'center'
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
//                              magicType : {
//                                  show: true,
//                                  type: ['bar'],
//                              },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        tooltip: {trigger:'axis'},
        //在示例中我们看到图表中需要的数据为
        //显示需要统计的分类
        xAxis: [
            {
                data: (function() {
                    var arr1 = [];
                    $.ajax({
                        type:"GET",
                        url : 'http://localhost:9871/ssm/v1?op=SHOWCACHE',
                        dataType:"json",
                        async: false,
                        success : function(result) {
                            for (var key in result) {
                                arr1.push(key);
                            }

                        },
                        error : function(errorMsg) {
                            alert("sorry, 请求数据失败");
                            myChart.hideLoading();
                        }
                    })

                    return arr1;
                })()

            }
        ],

        yAxis: {},
        series: [{
            name: '数量',
            type: 'bar',
            //        data : [3,2,1,33]
            data: (function() {
                var arr1 = [];
                $.ajax({
                    type:"GET",
                    url : 'http://localhost:9871/ssm/v1?op=SHOWCACHE',
                    dataType:"json",
                    async: false,
                    success : function(result) {
                        for (var key in result) {
                            arr1.push(result[key]);
                        }

                    },
                    error : function(errorMsg) {
                        alert("sorry, 请求数据失败");
                        myChart.hideLoading();
                    }
                })
                return arr1;
            })()
        }]

    };


    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}






