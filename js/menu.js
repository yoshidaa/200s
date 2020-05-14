// -----------------------------------------------------------------
//  Global functions
// -----------------------------------------------------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

window.onload = function() {
  if( !Cookies.get( "boardmap" ) ){
    document.getElementById("panel_system_message").innerHTML = "Boardmap is not set.<br />Please set from <a href=\"./config/index.html\">Configuration Page</a>.";
    document.getElementById("panel_system_message").style.visibility = "visible";
  }

  off_all_category = function(){
    document.getElementById("fs_game_practice").disabled = true;
    document.getElementById("fs_game_zeroone").disabled  = true;
    document.getElementById("fs_game_cricket").disabled  = true;
    document.getElementById("fs_game_special").disabled  = true;
  }
  off_all_game_practice = function(){
    document.getElementById("rb_game_count_up").checked = false;
    document.getElementById("rb_game_cr_count_up").checked = false;
    document.getElementById("rb_game_bull_shoot").checked = false;
  }
  off_all_game_zeroone = function(){
    document.getElementById("rb_game_z0301").checked = false;
    document.getElementById("rb_game_z0501").checked = false;
    document.getElementById("rb_game_z0701").checked = false;
    document.getElementById("rb_game_z0901").checked = false;
    document.getElementById("rb_game_z1101").checked = false;
    document.getElementById("rb_game_z1501").checked = false;
  }
  off_all_game_cricket = function(){
    document.getElementById("rb_game_standard_cricket").checked = false;
    document.getElementById("rb_game_cutthroat_cricket").checked = false;
  }
  off_all_game_special = function(){
    document.getElementById("rb_game_big_bull").checked = false;
    document.getElementById("rb_game_yamaguchi_a").checked = false;
    document.getElementById("rb_game_yamaguchi_b").checked = false;
    document.getElementById("rb_game_yamaguchi_c").checked = false;
  }
  off_all_game = function(){
    off_all_game_practice();
    off_all_game_zeroone();
    off_all_game_cricket();
    off_all_game_special();
  }

  off_players = function(){
    document.getElementById("rb_player_1").checked = false;
    document.getElementById("rb_player_2").checked = false;
    document.getElementById("rb_player_3").checked = false;
    document.getElementById("rb_player_4").checked = false;
    document.getElementById("fs_player").display  = "none";
    document.getElementById("fs_player").disabled = true;
    document.getElementById("button_start").display = "none";
    document.getElementById("button_start").disabled = true ;
  }

  checked_category = function(){
    var categories = [ "practice", "zeroone", "cricket", "special" ];
    categories.forEach(function( category_name ){
      if( document.getElementById( "rb_category_" + category_name ).checked ){
        off_all_category();
        off_all_game();
        off_players();
        document.getElementById( "fs_game_" + category_name ).disabled = false;
      }
    });
  }

  checked_game = async function(){
    off_players();
    await sleep(10);
    document.getElementById("fs_player").disabled = false;
    document.getElementById("fs_player").display  = "block";
  }

  checked_player = async function(){
    if( document.getElementById("rb_player_1").checked ||
        document.getElementById("rb_player_2").checked ||
        document.getElementById("rb_player_3").checked ||
        document.getElementById("rb_player_4").checked ){
      document.getElementById("button_start").display = "block" ;
      document.getElementById("button_start").disabled = false ;
    }else{
      document.getElementById("button_start").display = "none" ;
      document.getElementById("button_start").disabled = true ;
    }
  }

  document.getElementById("rb_category_practice").onchange = checked_category ;
  document.getElementById("rb_category_zeroone").onchange  = checked_category ;
  document.getElementById("rb_category_cricket").onchange  = checked_category ;
  document.getElementById("rb_category_special").onchange  = checked_category ;

  document.getElementById("rb_game_count_up").onchange = checked_game ;
  document.getElementById("rb_game_cr_count_up").onchange = checked_game ;
  document.getElementById("rb_game_bull_shoot").onchange = checked_game ;
  document.getElementById("rb_game_z0301").onchange = checked_game ;
  document.getElementById("rb_game_z0501").onchange = checked_game ;
  document.getElementById("rb_game_z0701").onchange = checked_game ;
  document.getElementById("rb_game_z0901").onchange = checked_game ;
  document.getElementById("rb_game_z1101").onchange = checked_game ;
  document.getElementById("rb_game_z1501").onchange = checked_game ;
  document.getElementById("rb_game_standard_cricket").onchange = checked_game ;
  document.getElementById("rb_game_cutthroat_cricket").onchange = checked_game ;
  document.getElementById("rb_game_big_bull").onchange = checked_game ;
  document.getElementById("rb_game_yamaguchi_a").onchange = checked_game ;
  document.getElementById("rb_game_yamaguchi_b").onchange = checked_game ;
  document.getElementById("rb_game_yamaguchi_c").onchange = checked_game ;

  document.getElementById("rb_player_1").onchange = checked_player ;
  document.getElementById("rb_player_2").onchange = checked_player ;
  document.getElementById("rb_player_3").onchange = checked_player ;
  document.getElementById("rb_player_4").onchange = checked_player ;

  document.getElementById("bm_config").onclick = function(){ window.location.href = './config/index.html' } ;

  Y.id("bm_return").onclick = function(){
    Y.hide("board_menu");
    Y.show("button_menu");
  };

  category = getUrlParameter("category");
  game     = getUrlParameter("game");
  players  = getUrlParameter("players");
  if( category ){
    setTimeout(function(){ document.getElementById("rb_category_"+category).click(); },10);
    if( game ){
      setTimeout(function(){ document.getElementById("rb_game_"+game).click(); },50);
      if( players ){
        setTimeout(function(){ document.getElementById("rb_player_"+players).click(); },90);
      }
    }
  }

  Y.id("button_menu").onclick = function(){
    Y.id("bm_about").onclick = async function(){
      document.iframe.location = "./about/ydarts.html";
      Y.hide("board_menu");
      Y.show("board_about");
      await sleep(20);
      Y.id("board_main").onclick = function(){
        Y.hide("board_about");
        Y.show("button_menu");
        Y.id("board_main").onclick = function(){};
      };
      // dirty...
      await sleep(2000);
      document.iframe.onclick = function(){
        Y.hide("board_about");
        Y.show("button_menu");
      };
    };
    Y.hide("button_menu");
    Y.show("board_menu");
  }
  
  Y.show("board_main");
}
