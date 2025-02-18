$(function (){
    $("#content").on('click', '#test111', function(){
        // 添加页码div
        $("#content").html("");
        $("#content").append(
            "<div id='waterOrderSearch'></div>" +
            "<div id='waterOrderMain'><table id='waterOrderTable'></table></div>" +
            "<div class='lq-page'></div>"
            );
        var pageNum = 1;
        var pageSize = 5;
        var lastPage;
        var buildingId;
        var roomId;

        // 初始化页面
        viewAllWaterOrder(pageNum, pageSize, setSelect);
        var curView = "viewAllWaterOrder";


        // 查看所有
        $("#waterOrderSearch").on('click', '#viewAll', function(){
            viewAllWaterOrder(pageNum, pageSize, setSelect);
            curView = "viewAllWaterOrder";
            $(".firstOption").prop("selected",true);
        })

        // 搜索
        $("#waterOrderSearch").on('click', '#search', function(){
            buildingId = $("#building").val()
            var floor = $("#floor").val();
            var room = $("#room").val();
            roomId = floor + room;
            if(buildingId != "null"){
                if(floor != "null" && room != "null"){
                    pageNum = 1;
                    viewRoomWaterOrder(buildingId, roomId, pageNum, pageSize, setSelect);
                    curView = "viewRoomWaterOrder"
                }else if(floor == "null" && room == "null"){
                    pageNum = 1;
                    viewBuildingWaterOrder(buildingId, pageNum, pageSize, setSelect);
                    curView = "viewBuildingWaterOrder";
                }else {
                    alert("请确认查找信息")
                }
            }else {
                alert("请确认查找信息")
            }
        })

        // 重置搜索
        $("#waterOrderSearch").on('click', '#reset', function(){
            $(".firstOption").prop("selected",true);
        })

        // 点击页码
        $(".lq-page").on('click','.page',function(){
            $(".page.on").attr("class", "page");
            $(this).attr("class", "page on");
            pageNum = parseInt($(this).html());
            checkAndView(curView);
        })

        // 点击首页
        $(".lq-page").on('click','.page-start',function(){
            pageNum = 1;
            $(".page.on").attr("class", "page");
            $(".page-before").next().attr("class", "page on");
            checkAndView(curView);
        })

        // 点击尾页
        $(".lq-page").on('click','.page-end',function(){
            pageNum = lastPage;
            $(".page.on").attr("class", "page");
            $(".page-after").prev().attr("class", "page on");
            checkAndView(curView);
        })

        // 点击下一页
        $(".lq-page").on('click','.page-after',function(){
            var pageOn = $(this).siblings('.on');
            pageNum = parseInt(pageOn.html());
            if(pageNum+1 <= lastPage){
                pageNum++;
                checkAndView(curView);
                $(".page.on").attr("class", "page");
                pageOn.next().attr("class", "page on");
            }
        })

        // 点击上一页
        $(".lq-page").on('click','.page-before',function(){
            var pageOn = $(this).siblings('.on');
            pageNum = parseInt(pageOn.html());
            if(pageNum-1 >= 1){
                pageNum--;
                checkAndView(curView);
                $(".page.on").attr("class", "page");
                pageOn.prev().attr("class", "page on");
            }
        })

        // 显示所有数据
        function viewAllWaterOrder(pageNum, pageSize, setSelect){
            $.ajax({
                url:"getAllWaterOrder?pageNum=" + pageNum + "&pageSize=" + pageSize,
                async: false,
                method: 'post',
                success:function(data) {
                    if(setSelect != null){
                        setSelect(data);
                    }
                    view(data);
                    lastPage = data.navigateLastPage;
                }
            })
        }

        // 根据楼栋号显示数据
        function viewBuildingWaterOrder(buildingId, pageNum, pageSize, setSelect){
            $.ajax({
                url:"getBuildingWaterOrder?buildingId=" + buildingId + "&pageNum=" + pageNum + "&pageSize=" + pageSize,
                async: false,
                method: 'post',
                success:function(data) {
                    if(setSelect != null){
                        setSelect(data);
                    }
                    view(data);
                    lastPage = data.navigateLastPage;
                }
            })
        }

        // 根据宿舍号显示数据
        function viewRoomWaterOrder(buildingId, roomId, pageNum, pageSize, setSelect){
            $.ajax({
                url:"getRoomWaterOrder?buildingId=" + buildingId + "&roomId=" + roomId + "&pageNum=" + pageNum + "&pageSize=" + pageSize,
                async: false,
                method: 'post',
                success:function(data) {
                    if(setSelect != null){
                        setSelect(data);
                    }
                    view(data);
                    lastPage = data.navigateLastPage;
                }
            })
        }

        // 确认当前显示的信息 并显示
        function checkAndView(curView){
            if(curView == "viewAllWaterOrder"){
                viewAllWaterOrder(pageNum, pageSize, null)
            }else if(curView == "viewBuildingWaterOrder"){
                viewBuildingWaterOrder(buildingId, pageNum, pageSize, null);
            }else if(curView == "viewRoomWaterOrder"){
                viewRoomWaterOrder(buildingId, roomId, pageNum, pageSize, null);
            }
        }

        // 渲染数据
        function view(data){
            var buildings = ['25', '26', '27', '28', '29', '30'];
            var floors = ['1', '2', '3', '4', '5', '6'];
            var rooms = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
            setSearch(buildings, floors, rooms);
            $("#waterOrderTable").html("");  // 清空表格
            $("#waterOrderTable").append(
                $("<thead><tr><td>楼栋</td><td>宿舍号</td><td>姓名</td><td>数量</td><td>金额</td><td>时间</td></tr></thead><tbody></tbody>")
            )
            $.each(data.list, function(index, waterOrder) {
                var tr = $("<tr>"
                    + "<td>" + waterOrder.buildingId + "</td>"
                    + "<td>" + waterOrder.roomId + "</td>"
                    + "<td>" + waterOrder.username + "</td>"
                    + "<td> " + waterOrder.number + "</td>"
                    + "<td>" + waterOrder.amount + "</td>"
                    + "<td>" + waterOrder.orderTime + "</td>"
                    + "</tr>");
                $("#waterOrderTable>tbody").append(tr);
            })
        }

        // 设置页码
        function setSelect(data){
            // $("#page").html("");  // 清空
            $(".lq-page").html("");  // 清空
            var pages = data.navigatepageNums;
            if(pages.length >= 2){
                $(".lq-page").append('<span class="page-start">首页</span>');
                $(".lq-page").append('<span class="page-before">上一页</span>');
                $.each(pages, function(index, page) {
                    if(index == 0){
                        var span = $("<span class=\"page on\">"+ page +"</span>");
                    }else {
                        var span = $("<span class=\"page\">"+ page +"</span>")
                    }
                    // var option = $("<option id='option" + page + "'>" + page + "</option>");
                    $(".lq-page").append(span);
                    // $("#page").append(option);
                })
                $(".lq-page").append('<span class="page-after">下一页</span><span class="page-end">尾页</span>');
            }
        }

        // 设置楼栋号
        function setBuildingSelect(data){
            $("#building").html("");  // 清空
            $("#building").append("<option class='firstOption' selected='selected' value='null'>==楼栋==</option>");
            $.each(data, function(index, buildingId) {
                var option = $("<option value='" + buildingId + "'>#" + buildingId + "</option>");
                $("#building").append(option);
            })
        }

        // 设置楼层
        function setFloorSelect(data){
            $("#floor").html("");  // 清空
            $("#floor").append("<option class='firstOption' selected='selected' value='null'>==楼层==</option>");
            $.each(data, function(index, floor) {
                var option = $("<option value='" + floor + "'>" + floor + "</option>");
                $("#floor").append(option);
            })
        }

        // 设置宿舍号
        function setRoomSelect(data) {
            $("#room").html("");  // 清空
            $("#room").append("<option class='firstOption' selected='selected' value='null'>==房间==</option>")
            $.each(data, function (index, room) {
                var option = $("<option value='" + room + "'>" + room + "</option>");
                $("#room").append(option);
            })
        }

        // 渲染搜索栏
        function setSearch(buildings, floors, rooms){
            $("#waterOrderSearch").html("");  // 清空
            $("#waterOrderSearch").append(
                "<select id='building'></select>" +
                "<select id='floor'></select>" +
                "<select id='room'></select>" +
                "<input type='button' id='search' value='查询'>" +
                "<input type='button' id='reset' value='重置'>" +
                "<input type='button' id='viewAll' value='查看所有'><br>"
            );
            setBuildingSelect(buildings);
            setFloorSelect(floors);
            setRoomSelect(rooms);
        }
    })
})


