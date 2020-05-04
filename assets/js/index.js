$(function () {

    var index = 0

    var tabsIndex = 0

    var timer = 0

    var arr = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png"]

    var tabs = [
        "DASHBOARD",
        "PROJECTS",
        "CALENDAR",
        "MAILBOX",
        "SETTINGS"
    ]

    var init = function () {
        arr.forEach(function (item) {
            $(".banner").append(`<li>
            <img src="assets/img/${item}" />
        </li>`)
            $(".indexes").append(`<li></li>`)
        })
        tabs.forEach(function (item) {
            $(".tabs ul").append(`<li>${item}<hr/></li>`)
        })
        $(".banner li").first().addClass("active")
        $(".indexes li").first().addClass("active")
        $(".tabs li").first().addClass("active")
    }

    // 绑定事件
    var bindEvent = function () {
        $(".indexes li").click(function () {
            clearInterval(timer)
            index = $(this).index()
            changeStyle()
            run()
        })

        $(".carousel").hover(function () {
            clearInterval(timer)
        }, function () {
            run()
        })

        $(".tabs li").hover(function () {
            var hoverIndex = $(this).index()
            $(".tabs li").eq(hoverIndex).addClass("active").siblings(".active").removeClass("active")
        }, function () {
            $(".tabs li").eq(tabsIndex).addClass("active").siblings(".active").removeClass("active")
        })

        $(".tabs li").click(function () {
            tabsIndex = $(this).index()
            $(".tabs li").eq(tabsIndex).addClass("active").siblings(".active").removeClass("active")
        })

        $(".arrow-left").click(function () {
            clearInterval(timer)
            if (--index === -1) index = arr.length - 1
            changeStyle()
            run()
        })

        $(".arrow-right").click(function () {
            clearInterval(timer)
            if (++index === arr.length) index = 0
            changeStyle()
            run()
        })
    }

    var run = function () {
        timer = setInterval(function () {
            if (++index === arr.length) index = 0
            changeStyle()
        }, 3000)
    }

    var changeStyle = function () {
        $(".banner li").eq(index).addClass("active").siblings(".active").removeClass("active")
        $(".indexes li").eq(index).addClass("active").siblings(".active").removeClass("active")
    }

    init()
    bindEvent()
    run()

    // 基于准备好的dom，初始化echarts实例
    var graphChart = echarts.init(document.getElementById('graph'))
    var pieChart = echarts.init(document.getElementById('pie'))
    var barChart = echarts.init(document.getElementById('bar'))

    // 指定图表的配置项和数据
    var graphOption = {
        title: {
            text: '曲线图数据展示',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        color: ['#4687f0'],
        series: [{
            name: '数据',
            data: [],
            type: 'line',
            smooth: true,
            areaStyle: {
                color: 'rgba(68, 134, 239, 0.1)'
            },
            itemStyle: { normal: { label: { show: true } } }
        }]
    }

    var pieOption = {
        title: {
            text: '饼状图数据展示',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
            {
                name: '数据',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    var barOption = {
        title: {
            text: '柱状图数据展示',
            left: 'center'
        },
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                name: '商品数',
                type: 'value'
            }
        ],
        series: [
            {
                name: '数据',
                type: 'bar',
                barWidth: '60%',
                data: []
            }
        ]
    }

    $.get("https://edu.telking.com/api/?type=month", res => {
        if (res.code === 200) {
            graphOption.xAxis.data = res.data.xAxis
            graphOption.series[0].data = res.data.series
            graphChart.setOption(graphOption)
        }
    })

    $.get("https://edu.telking.com/api/?type=week", res => {
        if (res.code === 200) {
            let xAxis = res.data.xAxis
            let series = res.data.series
            for (let i in series) {
                pieOption.series[0].data.push({
                    value: series[i],
                    name: xAxis[i]
                })
            }
            pieChart.setOption(pieOption)

            barOption.xAxis[0].data = xAxis
            barOption.series[0].data = series
            barChart.setOption(barOption)
        }
    })

})