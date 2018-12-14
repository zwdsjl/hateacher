
var courseId = "0";
courseId = getUrlParam("courseId");
console.log(courseId);
var scripts = document.createElement('script');
if ($("#button_content1").length > 0) {
    console.log("学员:" + $(".name").text());
    var checkList = setInterval(function () {
        console.log("等待课程列表加载...");
        if ($("#button_content1 .list").length > 0) {
            console.log("加载课程列表完成!");
            clearInterval(checkList);
            //filterList();
            chrome.extension.sendRequest({ command: "start" }, function (response) {
                
            });
            chrome.extension.onRequest.addListener(
                function (request, sender, sendResponse) {
                    console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
                    if (request.closed == true) {
                        console.log("学习页面已关闭,重新启动页面!");
                        $("#button_content1").empty();
                        
                        var event = document.createEvent("MouseEvents");
                        event.initEvent("click", true, true);　　　　　　　　　　　　　　//这里的click可以换成你想触发的行为
                        $(".kecheng_tab").find("a")[0].dispatchEvent(event);
                        var showList = setInterval(function(){
                            if ($("#button_content1 .list").length > 0){
                                filterList();
                                clearInterval(showList);
                            }
                        },1000);
                    }
                    else
                        sendResponse({}); // snub them.
                });
        }
    }, 500);
} else {
    console.log("打开的不是课程列表页!");
}

if ($(".contentplay").length > 0 && courseId != "0") {
    addCode();
    setTimeout(function () { $(".contentplay").remove(); }, 3000);
    setInterval(function () {
        var step = $("#zonggong").text().match(/\d+/)[0];
        var sum = getUrlParam("sum");
        if (!sum) {
            window.close();
        }
        if (parseInt(step)>=parseInt(sum)) {
            chrome.extension.sendRequest({ command: "closetab" }, function (response) {
                
            });
        }
    }, 1000);
}

function filterList() {
    $("#button_content1 .list").each(function (i, e) {
        var now = $(e).find("span").eq(0).text().match(/\d+/)[0];
        var sum = $(e).find(".rs_jindu_text").eq(0).text().match(/\d+/)[0];
        //console.log($(e).find(".rs_jindu_text").eq(0).text().match(/\d+/)[0]);
        var kid = $(e).find(".qxx").attr("onclick");
        //console.log(now + ":" + sum);
        var hrefUrl = $(e).find(".kcal_title").find("a");
        var openUrl = hrefUrl.attr("href") + "&" + $.param({ sum: sum });
        hrefUrl.attr("href", openUrl);
        if (parseInt(now) < parseInt(sum)) {
            //console.log($.param({ sum: sum }));

            chrome.extension.sendRequest({ command: "opentab", url: openUrl }, function (response) {
                console.log(response.farewell);
            });
            return false;
            var event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);　　　　　　　　　　　　　　//这里的click可以换成你想触发的行为
            $(e).find(".qxx")[0].dispatchEvent(event);
            return false;
        }
        //console.log(kid.match(/\d+/)[0] + " 已完成");
        if(i >= $("#button_content1 .list").length-1){
            chrome.extension.sendRequest({ command: "finish" }, function (response) {
                
            });
        }
    });
}

function addCode() {

    scripts.text = `
    // var randomTime = 1200;
    // clearTimeout(timer1);
    // function setRandomTipTime() {
    // 	randomTime = getRandomSecond();
    // }

    // function getRandomSecond() {
    //     //return getRandom(20) * 60 +  getRandom(10);  //2-20 分钟的随机数
    //     return 1200;  //10-20 分钟的随机数
    // }
function updateStudyTime(doclose) {
	try{
		;
		//document.form2.thzt.value=parseInt(document.form2.thzt.value)+parseInt(document.form2.passedtime.value);	 
		//jQuery("#benci").html(document.form2.thzt.value);
		//zonggongTime=parseInt(zonggongTime)+60;//+parseInt(document.form2.passedtime.value);
		//var url="http://study.teacheredu.cn/proj/studentwork/update_studytime.json?courseId=1161123&studyTime="+ document.form2.passedtime.value;
			  
		//jQuery.getJSON(url,function(d){
		//	document.form2.leiji.value=d.studytime;
		//	begintime=0;
		//	var zminute = parseInt(d.studytime/3600);
		//	var zsecond =  parseInt((d.studytime%3600)/60);
		//	jQuery("#zonggong").html(zminute+"小时"+zsecond+"分钟" );
		//});
		
		var url="http://study.teacheredu.cn/proj/studentwork/studyAjax/AddStudyTime.json";
		jQuery.ajax({ type: "POST", url: url,  dataType:"json",
       		data: "courseId="+${courseId}+"&studyTime="+ document.form2.passedtime.value,
       		success: function(msg){
              	 	if(msg!=0){
              			document.form2.leiji.value=msg;
            			begintime=0;
            			var zminute = parseInt(msg/3600);
            			var zsecond =  parseInt((msg%3600)/60);
            			//jQuery("#zonggong").html(zminute+"小时"+zsecond+"分钟" );
						if(fulltime != ""){
                    		if(parseInt(msg/60)>fulltime){
                    			jQuery("#zonggong").html(parseInt(fulltime)+"分钟")
                    		}
                    	}else{
                    			jQuery("#zonggong").html(parseInt(msg/60)+"分钟")
                    	}
            		}else{
                        //alert( "更新时间失败,原因是你打开多个浏览器同时学习，只能记录第一次学习的时间。");
                        console.log("更新时间失败,原因是你打开多个浏览器同时学习，只能记录第一次学习的时间。");
            			window.close();
            		}
       		}
		});
				
		if(doclose==1) {
			//关闭课程播放界面
			window.opener=null;
        	window.open("","_self");
   		 	window.close();
		}	
	}catch(err) {
		alter(err.message);
	}
	
}
function openTishi(minute,second) {
	;
	if(minute==randomTime )  //学习15分钟时弹出窗口 提示更新时间
	{
		if(second=="0")
		{						
    		var tishiTime=document.form2.thzt.value;
    		console.log("已经学习了"+tishiTime+",点击确定更新学习时间.");
    		updateStudyTime(0);
    		setRandomTipTime();
		}
	}
}

function openTishi(second)
{
	;
	if(second==randomTime )  //随机时间提示
	{		
		var tishiTime=document.form2.thzt.value;
		if('1' != '0'){//根据配置来判断是否弹窗（默认会弹窗 '' != '0'）
        console.log("已经学习了"+tishiTime+",点击确定更新学习时间.");
		}
		updateStudyTime(0);	
		setRandomTipTime();
	}
}

function callParentVideoifplay(videoifplay){
	//alert("videoifplayFlag:"+videoifplay);
	videoifplayFlag = true;
}



// function DoConverseCallTimer() {
// 	if(isClose==1) {
//     	return;
//     }
//  	if(document.form2.thzt.value == "") {
//       //alert("请输入倒计时开始的秒数！");
//  	} else {
// 		//document.form2.conversestart.disabled=true;
// 		var minute="0";
//     	var second="0";
// 		if(videoifplayFlag){
// 			begintime = parseInt(begintime)+1;  //**在这里+1秒
// 		}
// 		minute = parseInt(begintime/60);
// 		second = begintime%60;
// 		//document.form2.passedtime.value=minute;
// 		//if (minute>="1")
// 		//{
// 		//document.form2.update.disabled=false;
// 		//}
// 		if(minute<"21") {
// 			document.form2.thzt.value =minute+"分"+second+"秒";
// 			jQuery("#benci").html(minute+"分"+second+"秒");
// 		} else{
// 			document.form2.thzt.value =minute+"分"+second+"秒";
// 			return;
// 		}	
// 		timer1 = window.setTimeout("DoConverseCallTimer()",10);
// 		document.form2.passedtime.value = begintime;
// 		openTishi(begintime);
//  	}
// }
// DoConverseCallTimer();
window.onbeforeunload = function() {
    return;
}

`;
    document.head.appendChild(scripts);
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}