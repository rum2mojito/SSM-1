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
(function() {
  "use strict";

  var myChart = echarts.init(document.getElementById('myChart'));
  var option = {
          title : {
              text: 'Cache统计饼图',
              x:'center'
          },
          tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              orient : 'vertical',
              x : 'left',
              data:['cacheCapacity','cacheRemaining','cacheUsed','cacheUsedPercentage']
          },
          toolbox: {
              show : true,
              feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {
                      show: true,
                      type: ['pie', 'funnel'],
                      option: {
                          funnel: {
                              x: '25%',
                              width: '50%',
                              funnelAlign: 'left',
                              max: 1548
                          }
                      }
                  },
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
              center: ['50%', '60%'],
//                  data:[{name:'cacheCapacity',value:3},{name:'cacheRemaining',value:2},{name:'cacheUsed',value:1},{name:'cacheUsedPercentage',value:33}]
              data: (function() {
                var arr = [];
                $.ajax({
                    type:"post",
                    async : false,
                    url : 'http://localhost:9871/ssm/v1?cmd=ls&op=SHOWCACHE',
                    data : {},
                    dataType:"json",
                    success : function(result) {
                    alert(result);
                        var keys = [];
                        var values = [];
                        for (var key in result) {
                            keys.push(key);
                            values.push(result[key]);
                            arr.push({name:key.toString(),value:result[key]});

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


})();