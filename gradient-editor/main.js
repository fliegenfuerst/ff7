let container=document.getElementById("container");
let gradient=document.getElementById("gradient");
let gradient2=document.getElementById("gradient2");
let cornerCursor=document.getElementById("gradientPreview-cursor");
let currentColor=document.getElementById("currentColor");
let colorPicker=document.getElementById("colorPicker");
let sliderValues=document.getElementsByClassName("slider-value");
let sliders=document.getElementsByClassName("slider-handle");
let currentCorner=0;
let settings=[[0,0,176],[0,0,128],[0,0,80],[0,0,32]];
let storageEnabled=false;
let test='test';
try {
	localStorage.setItem(test, test);
	localStorage.removeItem(test);
	storageEnabled=true;
} catch(e) {
	storageEnabled=false;
}
if(storageEnabled) {
	if(localStorage.getItem("settings")!==null){
		settings=JSON.parse(localStorage.getItem("settings"));
	}else{
		localStorage.setItem("settings",JSON.stringify(settings));
	}
}
for(let i=0;i<sliders.length;i++){
	dragElement(sliders[i],i);
}
updateView(false);
currentColor.onclick=function(){
	colorPicker.value="#"+toColorString(settings[currentCorner]);
	colorPicker.click();
};
colorPicker.onchange=function(){
	colorStringToValues(colorPicker.value);
};
function resetColors(){
	settings=[[0,0,176],[0,0,128],[0,0,80],[0,0,32]];
	updateView();
}
function copyChatString(){
	let tempInput=document.createElement("INPUT");
	tempInput.type="text";
	tempInput.value=getChatString();
	document.body.appendChild(tempInput);
	tempInput.select();
	document.execCommand('copy');
	document.body.removeChild(tempInput);
}
function getScrollValueNumber(num){
	let nums=[0,0,0];
	nums[0]=num%10;
	num=(num-nums[0])/10;
	nums[1]=num%10;
	nums[2]=(num-nums[1])/10;
	return String.fromCharCode(nums[2]+8320)+String.fromCharCode(nums[1]+8320)+String.fromCharCode(nums[0]+8320);
}
function selectCorner(e){
	let rect=e.target.getBoundingClientRect(); 
	let index=0;
	if(event.clientX-rect.left<e.target.offsetWidth/2){
		cornerCursor.style.left="-116px";
		cornerCursor.style.right="";
	}else{
		cornerCursor.style.left="";
		cornerCursor.style.right="-8px";
		index++;
	}
	if(event.clientY-rect.top<e.target.offsetHeight/2){
		cornerCursor.style.top="-20px";
		cornerCursor.style.bottom="";
	}else{
		cornerCursor.style.top="";
		cornerCursor.style.bottom="-60px";
		index+=2;
	}
	if(index!==currentCorner){
		currentCorner=index;
		updateView(false);
	}
}
function updateView(slideEvent){
	if(!slideEvent){
		sliders[0].style.left=settings[currentCorner][0]/255*(sliders[0].parentNode.offsetWidth-sliders[0].offsetWidth)-4+"px";
		sliders[1].style.left=settings[currentCorner][1]/255*(sliders[1].parentNode.offsetWidth-sliders[1].offsetWidth)-4+"px";
		sliders[2].style.left=settings[currentCorner][2]/255*(sliders[2].parentNode.offsetWidth-sliders[2].offsetWidth)-4+"px";
	}
	sliderValues[0].innerText=getScrollValueNumber(settings[currentCorner][0]);
	sliderValues[1].innerText=getScrollValueNumber(settings[currentCorner][1]);
	sliderValues[2].innerText=getScrollValueNumber(settings[currentCorner][2]);
	currentColor.style.backgroundColor="#"+toColorString(settings[currentCorner]);
	if(storageEnabled){
		localStorage.setItem("settings",JSON.stringify(settings));
	}
	updateGradient();
}
function colorStringToValues(hex){
	settings[currentCorner][0]=parseInt(hex.substring(1,3), 16);
	settings[currentCorner][1]=parseInt(hex.substring(3,5), 16);
	settings[currentCorner][2]=parseInt(hex.substring(5,7), 16);
	updateView(false);
}
function toColorString(rgb){
	return toHex(rgb[0])+toHex(rgb[1])+toHex(rgb[2]);
}
function toHex(intVal){
	let hex="0"+intVal.toString(16);
	return hex.substr(-2);
}
function updateGradient(){
	gradient.style.backgroundImage="linear-gradient(to bottom, #"+toColorString(settings[0])+", #"+toColorString(settings[2])+")";
	gradient2.style.backgroundImage="linear-gradient(to bottom, #"+toColorString(settings[1])+", #"+toColorString(settings[3])+")";
	gradient2.style.backgroundImage="-webkit-mask-image: linear-gradient(to left, #"+toColorString(settings[3])+", transparent)";
}
function getChatString(){
	return "!setColors "+toColorString(settings[0])+" "+toColorString(settings[1])+" "+toColorString(settings[2])+" "+toColorString(settings[3]);
}
function dragElement(elmnt,index) {
	let pos=nextPos=temp=0;
	let width=elmnt.parentNode.offsetWidth-elmnt.offsetWidth-4;
	elmnt.onmousedown=elmnt.ontouchstart=function(e){
		document.body.style.cursor="grabbing";
		elmnt.style.cursor="grabbing";
		e=e||window.event;
		e.preventDefault();
		pos=e.clientX;
		document.onmouseup=document.ontouchend=function(){
			document.onmouseup=document.ontouchend=document.onmousemove=document.ontouchmove=null;
			document.body.style.cursor="";
			elmnt.style.cursor="grab";
		};
		document.onmousemove=document.ontouchmove=function(e){
			e=e||window.event;
			e.preventDefault();
			nextPos=elmnt.offsetLeft-pos+event.clientX||event.touches[0].clientX;
			if(nextPos<-4){
				temp=-4;
			}else if(nextPos>width){
				temp=width;
			}else{
				pos=event.clientX||event.touches[0].clientX;
				temp=nextPos;
			}
			elmnt.style.left=temp+"px";
			settings[currentCorner][index]=Math.floor((temp+4)/(width+4)*255);
			updateView(true);
		};
	};	
}
