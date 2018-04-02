//计算todolist个数
var count=document.getElementById('count');
var timer;
// localStorage.clear();
$(document).ready(function(){
	for(var i = 0;i<localStorage.length; i++){
		var key=localStorage.key(i),
			val=localStorage[key];
		$("#function_li").before("<div class='todolist'><div class='list_left'><input type='checkbox' class='Checkbox'></input><i class='iconfont_gou icon-sggg'></i></div><div class='list_right'>"+val+"</div><div class='clear'></div><i class='iconfont icon-cha'></div></div>");
		var list_right=document.getElementsByClassName("list_right");
		list_right[i].setAttribute("data-hex",key);		
		//判断todolist是否存在
		judgefunc();
		//复选框选择
		check();
		//两个任务的转换时，复选框选择
		judgeList();
		//箭头样式
		judgeArrow();
		//判断list为空时箭头的样式
		Arrowtoggle();
	}
	dblclick();
	$('.icon-cha').click(function(){
		var key=$(this).prev().prev().attr("data-hex");
		$(this).parent().remove();
		localStorage.removeItem(key);
		judgefunc();
		Arrowtoggle();
	});
});
//输入
$('#Input').keydown(function(){
	if(event.keyCode==13){

		var $this=$(this),
			date = new Date().toLocaleString();
		//输入为空时弹出警告,trim()消除空格
		if(this.value.trim()==""){
			alert('请输入内容');
		}
		else{
			//jq对象转化为DOM对象
			var $this=$(this);
			$("#function_li").before("<div class='todolist'><div class='list_left'><input type='checkbox' class='Checkbox'></input><i class='iconfont_gou icon-sggg'></i></div><div class='list_right'>"+this.value+"</div><div class='clear'></div><i class='iconfont icon-cha'></div></div>");
			$('.list_right').attr("data-hex",date);
			localStorage.setItem(date,this.value);
			console.log(localStorage.length)
			//输入后使value为0
			$(this).val("");
		}
		//添加事件
		//判断todolist是否存在
		judgefunc();
		//复选框选择
		check();
		//两个任务的转换时，复选框选择
		judgeList();
		//箭头样式
		judgeArrow();
		//判断list为空时箭头的样式
		Arrowtoggle();
		//双击事件
		var list_right=$('.list_right');
		//双击事件
		//先清除后添加，防止重复绑定
		$('.list_right').off("dblclick");
		dblclick();
		//删除节点
		$('.icon-cha').click(function(){
			var key=$(this).prev().prev().attr("data-hex")
			localStorage.removeItem(key);
			$(this).parent().remove();
			judgefunc();
		});
	}
});
//输入事件结束

var Checkbox=document.getElementsByClassName('Checkbox');
//输入框箭头样式切换,全选和全不选
$('.arrow-checkbox').click(function(){
	if($('#arrow').hasClass("arrowchange")){
		$('#arrow').removeClass("arrowchange");
		for(var i=0;i<Checkbox.length;i++){
			Checkbox[i].checked=false;
		}
	}
	else{
		$('#arrow').addClass("arrowchange");
		$('.falseChecked').attr("checked",true);
		for(var i=0;i<Checkbox.length;i++){
			Checkbox[i].checked=true;
		}
	}
	//全选并且让自己改变状态
	judgefunc();
	judgeList();
});

//fadeIn为出现。fadeOut为消失
//All
$('#function_li-2').click(function(){
	$('.Checkbox').parent().parent().fadeIn('300');
	$(this).toggleClass('func_liChange');
	$(this).siblings().removeClass("func_liChange");
	$(this).addClass("function_li-2add");
});

//Active筛选
$('#function_li-3').click(function(){
	//先消失后淡出
	$('.Checkbox:checked').parent().parent().hide();
	$('.Checkbox:not(:checked)').parent().parent().fadeIn('300','linear');
	$(this).addClass('func_liChange');
	$(this).siblings().removeClass("func_liChange");
	$('#function_li-2').removeClass('function_li-2add');
});

//Complete筛选
$('#function_li-4').click(function(){
	$('.Checkbox:not(:checked)').parent().parent().hide();
	$('.Checkbox:checked').parent().parent().fadeIn('300','linear');
	$(this).addClass('func_liChange');
	$(this).siblings().removeClass("func_liChange");
	$('#function_li-2').removeClass('function_li-2add');
});

//clear completed 删除全部已勾选的
$('#function_li-5').click(function(){
	var key=document.getElementsByClassName('trueChecked');
	for(var i=0;i<$('#Ul input[type="checkbox"]:checked').length;i++){
		var one=$(key[i]).parent().next().attr("data-hex");
		console.log($(key[i]).parent().next());
		console.log(one);
		localStorage.removeItem(one);
	}
	//选中被勾选的
	$('#Ul input[type="checkbox"]:checked').parent().parent().remove();
	judgefunc();
	judgeArrow();
	Arrowtoggle();
});

//定时器判断复选框被选择时的样式
timer=setInterval(function(){
	//为选中和未选中的checkbox分别加类名
	$(".Checkbox").each(function(){
		if($(this).is(':checked')){
			$(this).addClass('trueChecked');
			$(this).next().addClass('icon-show');
			$(this).parent().next().addClass('wordChange');
		}
		else{
			$(this).removeClass('trueChecked');
			$(this).next().removeClass('icon-show');
			$(this).parent().next().removeClass('wordChange');
		}
	});
	count.innerHTML=$('#Ul input[type="checkbox"]:not(:checked)').length;
});

function dblclick(){
	$('.list_right').on("dblclick",function(){
		var $Oldhtml=$(this).text();
		//插入新输入框
		var date = new Date().toLocaleString();
			$(this).attr("data-hex",date);
		$(this).html("<input class='Newinput' type='text'>");
		$('.Newinput').val($Oldhtml);
		//获得焦点
		$('.Newinput').focus();
		//选择全部文本
		$('.Newinput').get(0).setSelectionRange(0, $Oldhtml.length);
		$('.Newinput').parent().next().next().addClass("displayLeft");
		$('.Newinput').parent().prev().children().addClass("displayLeft");
		//当$('Newinput')离开焦点时就会执行此函数
		$('.Newinput').on('blur',function(){
			judgevoid();
			judgefunc();
			Arrowtoggle();
			var $Newhtml=$('.Newinput').val();
			var key=$(this).parent().attr("data-hex");
			console.log(key)
			key=$('.Newinput').val();
			console.log(key)
			$('.Newinput').parent().prev().children().removeClass("displayLeft")
			$('.Newinput').parent().next().next().removeClass("displayLeft");
			$(this).parent().text($Newhtml);
			$(this).remove();
		});
		$('.Newinput').on("keydown",function(){
			//回车
			if(event.keyCode==13){
				judgevoid();
				judgefunc();
				Arrowtoggle();
				$(this).blur();
			}
			//esc
			if(event.keyCode==27){
				$(this).parent().text($Oldhtml);
				$(this).remove();
			}
		});
		//判断新输入为空时消除这项
		function judgevoid(){
			if($('.Newinput').val()==""){
				$('.Newinput').parent().parent().remove();
			}
		}
	});
}
//判断list为空时箭头的样式
function Arrowtoggle(){
	if($('.Checkbox').length!=0){
		$('#arrow').addClass('arrowadd');
		$('.arrow-checkbox').addClass('arrowadd');
	}
	else{
		$('#arrow').removeClass('arrowadd');
		$('.arrow-checkbox').removeClass('arrowadd');
	}
}
//被选择复选框数量等于总复选框时图标转换
function judgeArrow(){
	if($('.Checkbox:checked').length==$('.Checkbox').length&&$('.Checkbox:checked').length!=0){
		$('.arrow-checkbox').attr("checked",true);
		//箭头样式转换
		$('#arrow').addClass('arrowchange');
	}
	else{
		$('.arrow-checkbox').attr("checked",false);
		$('#arrow').removeClass('arrowchange');
	}
}

//复选框被选择时
function check(){
	$('.Checkbox').click(function(){
		judgefunc();
		judgeList();
		judgeArrow();
	});
}

//判断todolist是否存在
function judgefunc(){
	//判断todolist存在则任务栏出现
	if($('.todolist').length!=0){
		$("#function_li").css("display","block");
	}
	else{
		$("#function_li").css("display","none");
	}
	//判断被选中的todolist存在则消除出现
	if($('.Checkbox').is(':checked')){
		$('#function_li-5').fadeIn('300','linear');
	}
	else{
		$('#function_li-5').fadeOut('300','linear');
	}
}

//判断两个任务的切换
function judgeList(){
	if($('.Radio3').is(':checked')){
		$('.Checkbox:checked').parent().parent().fadeOut('300','linear');
	}
	if($('.Radio4').is(':checked')){
		$('.Checkbox:not(:checked)').parent().parent().fadeOut('300','linear');
	}
}
