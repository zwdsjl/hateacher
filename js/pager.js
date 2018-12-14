Date.prototype.format = function(format){
 /*
  * eg:format="YYYY-MM-dd hh:mm:ss";
  */
 var o = {
  "M+" :  this.getMonth()+1,  //month
  "d+" :  this.getDate(),     //day
  "h+" :  this.getHours(),    //hour
      "m+" :  this.getMinutes(),  //minute
      "s+" :  this.getSeconds(), //second
      "q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
      "S"  :  this.getMilliseconds() //millisecond
   }
  
   if(/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
   }
 
   for(var k in o) {
    if(new RegExp("("+ k +")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    }
   }
 return format;
}

		var dslx=dslx||{};
		dslx.tools=dslx.tools||{};
		dslx.tools.utils={
				text:function(o,clm){
					return o?o.toString():(typeof clm["def"]!="undefined"?clm["def"]:"");
				},
				no:function(o,clm,index){
					return o;
				},
				sec2date:function(o,clm){
					return o>0?new Date(o).format("yyyy-MM-dd hh:mm:ss"):"";
				}
		};
		dslx.tools.pager={
			//创建分页内容
			rendcon:	function(root,op,el,rs,cloumn_renders){
				if(!el){return;}
				var obj=rs["objList"];
				var pageBean=rs["pageBean"];
				el.data("pageBean",pageBean);
				/*var _all_width=0;
				jQuery.each(cloumn_renders,function(i,n){
					_all_width+=(n.width?n.width:1);
				});*/
				
				el.empty();
				for(var o in obj){
					var clmdata=obj[o];
					var tb_row=jQuery(op.rowdom).addClass(op.rowclass).appendTo(el);
					for(var ci in cloumn_renders){
						var clm=cloumn_renders[ci];
						var value=clmdata[clm.fname];
						var index=parseInt(o)+1;
						if(typeof value == "undefined"){value=clm.def;}
						var nr=clm.render?clm.render(value,clmdata,index):value;
						if(!(nr instanceof jQuery)){//如果返回不是jQuery对象 就可以进行格式化操作
							var ctype=clm["type"];
							if(!ctype){
								ctype="text";
							}
							nr=dslx.tools.utils[ctype](nr,clm,index);
						}
						if(op.celldom){
							///	var cellsty={"width":(clm.width?clm.width:1)*100/_all_width+"%","float":"left","clear":(ci==cloumn_renders.size?"right":"none")};
							var cellsty= clm.width?{"width": clm.width +"px"}:{};
							jQuery(op.celldom).addClass(op.cellclass?op.cellclass:"").addClass(clm.cellclass||"").appendTo(tb_row).html(nr||"&nbsp;").css(cellsty);
						}else{
							tb_row.append(nr);
						}
					}
				}
			},
			rendLinks:function(root,op,pageBean,el){
				if(!el) return;
				el.addClass("fanye");
				function getPageLabel(text,cls){
					return jQuery('<a href="javascript:void(0);" class="page_label '+(cls||"")+'">'+text+'</a>');
				}
				function gotoPage(p){
					p=(p>pageBean.totalPage)?pageBean.totalPage:p;
					p=(p<1)?1:p;
					if(typeof(op.params) == "string"){
						var sz=op.params.split("&curPage=");
						var sz_n=[];
						sz_n.push(sz[0]);
						sz_n.push("&curPage=");
						var sub_n=sz[1].split("&");
						sub_n[0]=p;
						sz_n.push(sub_n.join("&"));
						op.params=sz_n.join("");
					}else{
						op.params.curPage=p;
					}
					jQuery.reloadPageWith(op,root);
				}
				if(pageBean&&el){
					el.empty();
					var __totalPage=pageBean.totalPage;
					var __curPage=pageBean.curPage;
					if(!op.shortMode){
						el.append("<span class='fdeephui shotlab' >共"+pageBean.totalCount+"条/共"+__totalPage+"页</span>");
					}
					
					if(!(op.shortMode && __totalPage <=1)){
						if(__totalPage >= __curPage){
							var lab=getPageLabel("&lt; 上一页").click(function(){
								gotoPage(__curPage-1);
							});
							if(__curPage >1 ) {el.append(lab);}else{el.append("<span class='disabled'>&lt; 上一页</span>");}
							var labExt= 4;//op.labExt!=-1?op.labExt:0;
							
							var __page_start = __curPage - labExt;
							var __page_end = __curPage + labExt;
							if(__page_start <= 0 ){
								__page_end = __page_end - __page_start;
								__page_start = 1;
							}
							if(__page_end > __totalPage ){
								__page_end = __totalPage;
							}
							if(!op.shortMode){
								for(var i=__page_start;i<=__page_end;i++ ){
									var lab=getPageLabel(i,"shotlab").click(function(){
										gotoPage(this.innerHTML);
									});
									if(__curPage == i){
										lab=jQuery("<span>"+i+"</span>");
										lab.addClass("current");
									}
									el.append(lab);
								}
							}
							var lab=getPageLabel("下一页  &gt;").click(function(){
								gotoPage(__curPage+1);
							});
							if(__curPage < __totalPage){ el.append(lab);}else{el.append("<span class='disabled' >下一页  &gt;</span>");}
							if(!op.shortMode){
								el.append('<span class="shotlab"><input class="page_num_input fanyek" onafterpaste="this.value=this.value.replace(/D/g,\'\')" onkeyup="this.value=this.value.replace(/D/g,\'\')" size="2"></span>').append(jQuery('<input type="button" class="fdeephui fanyek shotlab" value="跳转">').click(function(){
									var p=jQuery(this).prev("span").find(".page_num_input").val();
										var v=jQuery(this).prev('span').find('.page_num_input').val();
										if(!(v>0)){alert('您输入的页数不存在');return;};
										if((v>__totalPage)){alert('您输入的页数不存在');return;};
										gotoPage(p);
									}));
							}
							if(op.shortMode){ 
								//jQuery(".current").hide();
								//jQuery(".shotlab").hide();
							}
						}
					}
				}
			},
			getRow:function(el,grid){
				if(!grid){return null;}else{
					var op=grid.data("op");
					if(el){
						if(el.hasClass(op.rowclass)){return el;}else{
							return el.parents("."+op.rowclass);
						}
					}else{
						return null;
					}
				}
			},
			getel:function(con,root){
				if((typeof con)=="function"){
					con=con(root);
				}
				return con;
			}
		};
	
		
		
		
	jQuery.extend({
		rendPage: function(op,el) { 
			var  defaultOp={
					//url:"",
					//renders:[],
					rowclass:"grid_row",
					rowdom:"<tr></tr>",
					cellclass:"grid_cell",
					celldom:"<td></td>",
					params:{},
					callback:function(root,json,op){
						var pageBean=op.getPageBean(json);
						root.data("pageBean",pageBean);
						if(op.renders){
							var con=op.body;
							con=dslx.tools.pager.getel(con,root);
							var link_con=op.links;
							link_con=dslx.tools.pager.getel(link_con,root);
							dslx.tools.pager.rendcon(root,op,con,json,op.renders,link_con);
							dslx.tools.pager.rendLinks(root,op,pageBean,link_con);
						}
					},
					beforerender:function(json,con,link_con,op){},
					afterrender:function(json,con,link_con,op){},
					head:function(el){ return false; },//获取放连接的容器
					links:function(el){ return false; },//获取放连接的容器
					body:function(el){ return el;},//获取放内容的容器
					getPageBean:function(data){return data["pageBean"];},
					getObjList:function(data){return  data["pageBean"];},
					error:function(con,link_con,XMLHttpRequest, textStatus, errorThrown){
						//alert(XMLHttpRequest);
						if(!con){return;}
						if(!link_con){return;}
						link_con.empty();
						con.html("<p  style='color:red'>加载数据出错</p>");
					}
			};
			op=jQuery.extend({},defaultOp,op);
			el.data("op",op);
			
			this.rendHead(op,el);//设置头
			
			var _deal_param="";
			if(typeof(op.params) == "object"){
					for(var _p in op.params){
						_deal_param+="&"+_p+"="+op.params[_p];
					}
					if(_deal_param.length>0){_deal_param=_deal_param.substring(1);}
			}else{
				_deal_param=op.params;
			}
			
			var con=op.body;
			con=dslx.tools.pager.getel(con,el);
			var link_con=op.links;
			link_con=dslx.tools.pager.getel(link_con,el);
			jQuery.ajax({
				type: "POST",
				url: op.url,
				 dataType: "text",
				data: _deal_param,
				success: function(json){
					var json=eval("("+json+")");
					op.beforerender(json,con,link_con,op);
					op.callback(el,json,op);
					op.afterrender(json,con,link_con,op);
					if(op.iframeHeight){ 
						var bHeight = document.body.scrollHeight;
				        var dHeight = document.documentElement.scrollHeight;
				        var height = Math.min(bHeight, dHeight);
				        
				        parent.document.getElementById("iframe_"+op.params.topicId).height=height;
						//parent.document.getElementById("iframe_"+op.params.topicId).height=document.documentElement.scrollHeight;
					}
					if(op.sanjiIframeHeight){ 
						var bHeight = document.body.scrollHeight;
				        var dHeight = document.documentElement.scrollHeight;
				        var height = Math.min(bHeight, dHeight);
				        
				        parent.document.getElementById("iframe1").height=height;
						//parent.document.getElementById("iframe1").height=document.documentElement.scrollHeight;
					}
					if(op.wdhf){
						//研讨翻页的时候，清零
						parent.myReplyCount = 0;
						$("a[name='wxgdhf']").each(
		            	  	function(){
		            	  		parent.myReplyCount++;
		    					$(this).click();
		            		}
		        	    );
					}
				},
				error:function (XMLHttpRequest, textStatus, errorThrown) {
					op.error(con,link_con,XMLHttpRequest, textStatus, errorThrown);
				}
			});
		},
		reloadPageWith:function(op,el){
			if(!op){
				op=el.data("op");
			}
			el.rendPage(op);
		},
		rendHead:function(op,el){
			var head=op.head;
			head=dslx.tools.pager.getel(head,el);
			if(!head){return;}
			//head.addClass(op.rowclass);
			//还需要检查是否已经渲染了头 不重复渲染
			cloumn_renders=op.renders;
			head.empty()
			for(var ci in cloumn_renders){
				var clm=cloumn_renders[ci];
				var value=clm.dname;
				var nr=value?value:"";
				if(op.celldom){
					///	var cellsty={"width":(clm.width?clm.width:1)*100/_all_width+"%","float":"left","clear":(ci==cloumn_renders.size?"right":"none")};
					var cellsty= clm.width?{"width": clm.width +"px"}:{};
					jQuery(op.celldom).addClass(op.cellclass?op.cellclass:"").html(nr||"&nbsp;").css(cellsty).appendTo(head);
				}else{
					head.html(nr);
				}
			}
			
		}
	});
	jQuery.fn.extend({
		rendPage: function(op) { 
			jQuery.rendPage(op,this); 
		},
		reloadPageWith: function(op) { 
			jQuery.reloadPageWith(op,this); 
		}
	});