// 显示单个数据点的历史数据
function id_history(value) {
    $("#history_data").edatagrid({
        url: '../static/json/treegrid_data1.json',
        fitColumns: true,
        striped: true,
        // pagination: true,
        rownumbers: true,
        loadFilter: function(data, parentId) {
            return value
        },
        idField: 'id',
        columns: [
            [{
                    field: 'id',
                    title: self.parent.messages[initial]['common']['name'],
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            editable: false
                        }
                    }
                },
                {
                    field: 'val',
                    title: 'value',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            editable: false
                        }
                    }
                }, {
                    field: 'status',
                    title: 'status',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            editable: false
                        }
                    }
                }, {
                    field: 'timestamp',
                    title: 'timestamp',
                    width: 100,
                    align: 'center',
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                            editable: false
                        }
                    }
                }
            ]
        ],
        toolbar: [{
            text: '趋势图',
            iconCls: 'icon-add',
            handler: function() {
                values = $("#history_data").edatagrid('getData');
                echarts_dialog(values);
            }
        }]
    });
    $('#history_data_dialog').dialog({
        title: '历史数据',
        closable: false,
        draggable: false,
        modal: true,
        buttons: [{
            text: self.parent.messages[initial]['common']['ok'],
            iconCls: 'icon-ok',
            handler: function() {
                $('#history_data_dialog').dialog('close')
            }
        }, {
            text: self.parent.messages[initial]['common']['cancel'],
            iconCls: 'icon-cancel',
            handler: function() {
                $('#history_data_dialog').dialog('close')
            }
        }]
    });
}

// 显示趋势图
function echarts_dialog(values) {
    console.log(values)
    data_list = [];
    time_list = [];
    values['rows'].forEach(function(tag) {
        data_list.push(parseFloat(tag['val']));
        time_list.push(tag['timestamp']);
    })
    var myChart = echarts.init(document.getElementById('chart'));

    options = {
        title: {
            text: '设备历史采集数据趋势图',
            subtext: '数据来自黄山罗米测控技术有限公司',
            x: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        legend: {
            data: ['采集值'],
            x: 'left'
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        axisPointer: {
            link: {
                xAxisIndex: 'all'
            }
        },
        dataZoom: [{
            show: true,
            realtime: true,
            start: 30,
            end: 70,
            xAxisIndex: [0]
        }],
        grid: [{
            left: 50,
            right: 50,
            height: '70%'
        }],
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisLine: {
                onZero: true
            },
            data: time_list
        }],
        yAxis: [{
            name: '采集值(度)',
            type: 'value',
            max: Math.max.apply(null, data_list) // x轴最大值为数据列表中的最大值
        }],
        series: [{
            name: '采集值',
            type: 'line',
            symbolSize: 8,
            hoverAnimation: false,
            data: data_list
        }]
    };
    myChart.setOption(options);
    $('#chart_dialog').dialog({
        title: self.parent.messages[initial]['real_data']['write_operate'],
        closable: true,
        draggable: false,
        modal: true
    });
}