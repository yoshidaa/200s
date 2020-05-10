var baseW = 1200;	//基準となるブレークポイント
var iOSviewportW = 0;
var ua = navigator.userAgent.toLowerCase();
var isiOS = (ua.indexOf("iphone") > -1) || (ua.indexOf("ipod") > -1) || (ua.indexOf("ipad") > -1);
if(isiOS){
	iOSviewportW = document.documentElement.clientWidth;
}
function updateMetaViewport(){
  var viewportContent;
  var w = window.outerWidth;
  if(isiOS){
    w = iOSviewportW;
  }
  var rate = w / baseW;
  viewportContent = "width=1280,initial-scale=" + rate;
  document.querySelector("meta[name='viewport']").setAttribute("content", viewportContent);
}

window.addEventListener("resize", updateMetaViewport, false);
window.addEventListener("orientationchange", updateMetaViewport, false);

var ev = document.createEvent("UIEvent");
ev.initEvent("resize", true, true)
window.dispatchEvent(ev);
