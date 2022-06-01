//JS
layui.use(['element', 'layer', 'util'], function(){
    var element = layui.element
        ,layer = layui.layer
        ,util = layui.util
        ,$ = layui.$;

    //头部事件
    util.event('lay-header-event', {
        //左侧菜单事件
        menuLeft: function(othis){
            let page = $(othis).attr("page");

            let iframes = document.querySelectorAll("#content iframe");
            let exist = false;
            if(iframes) {
               let len = iframes.length;
                for (let i = 0; i < len; i++) {

                let iframe = iframes[i];
                    $(iframe).hide();
                    let srcPageName = $(iframe).attr("src");
                    if(srcPageName === page) {
                        // 存在, 直接显示, 避免页面刷新
                        $(iframe).show();
                        exist = true;
                    }
                }
            }

            if(!exist) {
                // 不存在, 新增
                let iframe = $(`<iframe data-frameid=" ${page} " scrolling="auto" frameborder="0" src="${page}" style="width:100%;height:99%;" lay-ifame-event="iframe"></iframe>`);
                $("#content").append(iframe);
            }


        }
        ,menuRight: function(){
            layer.open({
                type: 1
                ,content: '<div style="padding: 15px;">处理右侧面板的操作</div>'
                ,area: ['260px', '100%']
                ,offset: 'rt' //右上角
                ,anim: 5
                ,shadeClose: true
            });
        }
    });

    $("body").on("load", `iframe`, function () {
       alert(3);
    });

    util.event('lay-ifame-event', {
        iframe: function (e) {
            const iframeWin = e.contentWindow;
            iframeWin.require = window.require;
        }
    }, "load");

});

class HomePage{
    constructor() {


    }



}