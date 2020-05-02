var boardmap;
var count;
var configurable = false;

function start_config(){
  document.getElementById("panel_main").style.display = "block";
  count = 0;
  configurable = true;
}

window.onload = function() {
  boardmap = Cookies.get("boardmap");
  if( !boardmap ){
    boardmap = { 'CH': 13 };
    document.getElementById("panel_status").innerHTML = "Config Status: Not Yet";
  }else{
    document.getElementById("panel_status").innerHTML = "Config Status: OK";
  }

  keys = [ "SB", "DB",
           "OS20", "OS01", "OS18", "OS04", "OS13", "OS06", "OS10", "OS15", "OS02", "OS17", "OS03", "OS19", "OS07", "OS16", "OS08", "OS11", "OS14", "OS09", "OS12", "OS05",
           "IS20", "IS01", "IS18", "IS04", "IS13", "IS06", "IS10", "IS15", "IS02", "IS17", "IS03", "IS19", "IS07", "IS16", "IS08", "IS11", "IS14", "IS09", "IS12", "IS05",
            "D20",  "D01",  "D18",  "D04",  "D13",  "D06",  "D10",  "D15",  "D02",  "D17",  "D03",  "D19",  "D07",  "D16",  "D08",  "D11",  "D14",  "D09",  "D12",  "D05",
            "T20",  "T01",  "T18",  "T04",  "T13",  "T06",  "T10",  "T15",  "T02",  "T17",  "T03",  "T19",  "T07",  "T16",  "T08",  "T11",  "T14",  "T09",  "T12",  "T05" ];
  comment = { "SB": "Single Bull", "DB": "Double Bull" };

  document.addEventListener('keypress', function(e) {
    if( configurable ){
      configurable = false;
      boardmap[keys[count]] = e.keyCode;
      count += 1;
      if( count == keys.length ){
        document.getElementById("panel_main").innerHTML = "Complete!";
        Cookies.set( "boardmap", boardmap );
        location.reload();
        return
      }
      setTimeout( function(){ configurable = true }, 500 );
      next_key = comment[keys[count]] || keys[count] ;
      document.getElementById("panel_main").innerHTML = "Press " + next_key ;
    }
  });

  document.getElementById("button_start").onclick = start_config;
  document.getElementById("button_back").onclick = function(){ window.location.href = '../index.html' };
}
