function updateMetaViewport(){
  var viewportContent;
  var contentWidth  = 1280;
  var contentHeight = 720;
  var clientWidth   = screen.width;
  var clientHeight  = screen.height;
  var rateW = (clientWidth / contentWidth).toFixed(3);
  var rateH = (clientHeight / contentHeight).toFixed(3);
  var rate  = rateW ;// Math.min( rateW, rateH );
  viewportContent = "width=" + contentWidth + ",initial-scale=" + rate;
  if( rate < 1 ){
  //  document.querySelector("meta[name='viewport']").setAttribute("content", viewportContent);
  }
  if( panel_mg != undefined ){
    panel_mg.update( game_mg );
  }
}

window.addEventListener("resize", updateMetaViewport, false);
window.addEventListener("orientationchange", updateMetaViewport, false);

var ev = document.createEvent("UIEvent");
ev.initEvent("resize", true, true)
window.dispatchEvent(ev);
