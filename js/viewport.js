var contentWidth  = 1280;
var contentHeight = 720;
var clientWidth   = document.documentElement.clientWidth;
var clientHeight  = document.documentElement.clientHeight;

function updateMetaViewport(){
  var viewportContent;
  var rateW = (clientWidth / contentWidth).toFixed(3);
  var rateH = (clientHeight / contentHeight).toFixed(3);
  var rate  = Math.min( rateW, rateH );
  viewportContent = "width=" + contentWidth + ",height=" + contentHeight + "initial-scale=" + rate;
  if( rate < 1 ){
    document.querySelector("meta[name='viewport']").setAttribute("content", viewportContent);
  }
}

window.addEventListener("resize", updateMetaViewport, false);
window.addEventListener("orientationchange", updateMetaViewport, false);

var ev = document.createEvent("UIEvent");
ev.initEvent("resize", true, true)
window.dispatchEvent(ev);
