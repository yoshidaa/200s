// -----------------------------------------------------------------
//  Global functions
// -----------------------------------------------------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class SystemGlue {
  static key_to_sound( key, game, bull ){
    var target = key;
    if( key == "CH" ){ return "change" ; }

    if( game == "big_bull" ){
      if( key == "SB" ){ target = "d_bull"; }
      else if( key == "DB" ){ target = "u_bull"; }
      else if( key[0] == "I" ){ target = "s_bull"; }
      else if( key[1] == "S" ){ target = "single"; }
      else if( key[0] == "D" ){ target = "double"; }
      else if( key[0] == "T" && ( Number(key.substr(1,2)) <= 14 ) ){ target = "triple"; }
    }else if( game == "bull_shoot" ){
      if( key == "SB" ){ target = "s_bull"; }
      else if( key == "DB" ){ target = "d_bull"; }
      else { target = "dummy" ; }
    }else{
      if( game_mg.current_player.is_valid_area( key ) ){
        if( key == "SB" ){ target = "s_bull"; }
        else if( key == "DB" ){ target = "d_bull"; }
        else if( key[1] == "S" ){ target = "single"; }
        else if( key[0] == "D" ){ target = "double"; }
        else if( key[0] == "T" && ( Number(key.substr(1,2)) <= 14 ) ){ target = "triple"; }
      }else{
        target = "dummy" ;
      }
    }
    return target;
  }

  static key_to_dart( key ){
    var dart = ( key[1] == "S" ) ? Number( key.substr( 2, 3 ) ) : key;
    dart = ( dart == "SB" ) ? "<span class=\"history_bull\">S-Bull</span>" : dart;
    dart = ( dart == "DB" ) ? "<span class=\"history_bull\">D-Bull</span>" : dart;
    return dart;
  }

  static score_to_class( score ){
    var span_class = "normal";
    if( score > 150 ){
      span_class = "highton";
    }else if( score >= 100 ){
      span_class = "lowton";
    }

    return span_class;
  }
}


// -----------------------------------------------------------------
//  MediaManager
// -----------------------------------------------------------------
class MediaManager {
  constructor(){
    load_media();
    this.playing_award = null;
  }

  play_sound( target ){
    document.getElementById("sound_" + target).play();
  }

  play_award( award_name ){
    this.playing_award = "award_" + award_name;
    var target = document.getElementById(this.playing_award);
    if( target.tagName == "VIDEO" ){
      board_mg.hide("button_menu");
      board_mg.hide("board_main");
    }
    target.play();
  }

  stop_award(){
    var target = document.getElementById(this.playing_award);
    if( target.tagName == "VIDEO" ){
      target.pause();
      target.currentTime = 0;
    }
    this.playing_award = null;
  }
}


class BoardManager {
  constructor(){
    this.hide_board_round = function() {
      document.getElementById("board_round").style.visibility = "hidden";
    };
    this.hide_board_next  = function() {
      document.getElementById("board_next").style.visibility = "hidden";
    };
    this.hide_board_remove_darts = function() {
      document.getElementById("board_remove_darts").style.visibility = "hidden";
    };
  }

  async display_remove_darts(){
    var board = document.getElementById("board_remove_darts");
    board.removeEventListener('animationend', this.hide_board_remove_darts);
    board.style.visibility = "visible";
    board.style.animation = "slide_i 0.3s";
    await sleep(1200);
    board.style.animation = "slide_o 0.3s";
    board.addEventListener('animationend', this.hide_board_remove_darts);
  }

  async display_round( message ){
    var board = document.getElementById("board_round");
    board.innerHTML = "<p class=\"message\">" + message + "</p>";
    board.removeEventListener('animationend', this.hide_board_round);
    board.style.visibility = "visible";
    board.style.animation = "slide_i 0.3s";
    await sleep(1000);
    board.style.animation = "slide_o 0.3s";
    board.addEventListener('animationend', this.hide_board_round);
  }

  async display_next_player(){
    var board = document.getElementById("board_next");
    board.innerHTML = "<p class=\"message\">Next Player<br />Player " + ( game_mg.current_player.id + 1 ) + "</p>";
    board.removeEventListener('animationend', this.hide_board_next);
    board.style.visibility = "visible";
    board.style.animation = "slide_i 0.3s";
    await sleep(1000);
    board.style.animation = "slide_o 0.3s";
    board.addEventListener('animationend', this.hide_board_next);
  }

  async display_mark_award(){
    var marks = game_mg.current_player.current_marks ;
    var tds = document.getElementById("board_nmark").getElementsByTagName("td");
    board_mg.show("board_nmark");
    for( var i = 0 ; i < 3 ; i++ ){
      await sleep(700);
      if( marks[i] != 0 ){
        media_mg.play_sound("mark");
        tds[i].innerHTML = "<img src=\"img/mark" + marks[i] + ".png\" />";
      }else{
        tds[i].innerHTML = "<img src=\"img/mark0.png\" />";
      }
    }
    await sleep(1000);
    board_mg.hide("board_nmark");
    system_mg.stop_award();
    for( var i = 0 ; i < 3 ; i++ ){
      tds[i].innerHTML = "";
    }
  }

  async display_bust(){
    board_mg.show("board_bust");
    await sleep(2000);
    board_mg.hide("board_bust");
  }

  is_shown( target ){ return (document.getElementById(target).style.visibility == "visible"); }
  show( target )    { document.getElementById(target).style.visibility = "visible"; }
  hide( target )    { document.getElementById(target).style.visibility = "hidden";  }
}


class InterfaceManager { // といっても window.onload から constructor に移動しただけ...
  constructor(){
    document.getElementById("bm_unthrow").onclick = system_mg.dart_unthrow ;
    document.getElementById("bm_restart").onclick = function(){
      if( window.confirm('Are you sure you want to restart game?') ){ system_mg.restart_game(); }
    };

    document.getElementById("bm_endgame").onclick = function(){
      if( window.confirm('Are you sure you want to go back to the menu?') ){ system_mg.return_to_menu(); }
    };

    document.getElementById("bm_return").onclick = function(){
      panel_mg.update( game_mg );
      board_mg.hide("board_menu");
      board_mg.show("button_menu");
    };

    document.getElementById("button_menu").onclick = function(){
      var options = Object.keys( game_mg.players[0].options );
      if( options.length != 0 && game_mg.current_round == 1 && game_mg.current_player_idx == 0 && game_mg.current_player.thrown_darts == 0 ){
        document.getElementById("bm_options").className = "active";
        document.getElementById("bm_options").onclick = panel_mg.display_game_option ;
      }else{
        document.getElementById("bm_options").className = "inactive";
        document.getElementById("bm_options").onclick = function(){};
      }
      if( game_mg.game == "yamaguchi_a" || game_mg.game == "yamaguchi_b" || game_mg.game == "yamaguchi_c" ){
        document.getElementById("bm_about").onclick = async function(){
          document.iframe.location = "./about/" + game_mg.game + ".html";
          board_mg.hide("board_menu");
          board_mg.show("board_about");
          // dirty...
          await sleep(3000);
          document.iframe.onclick = function(){
            board_mg.hide("board_about");
            board_mg.show("button_menu");
          };
        };
      }else{
        document.getElementById("bm_about").className = "inactive";
      }
      panel_mg.update( game_mg );
      board_mg.hide("button_menu");
      board_mg.show("board_menu");
    };

    document.title = game_mg.game_name + " - " + document.title;

    document.getElementById("board_change").onclick  = keypress_enter;
    document.getElementById("board_videos").onclick  = keypress_enter;
    document.getElementById("button_retry").onclick  = function(){ system_mg.restart_game(); };
    document.getElementById("button_back").onclick   = function(){ system_mg.return_to_menu(); };
  }
}


class SystemManager {
  constructor(){
    this.mutex_keypress = 0;
    this.change_player();
    this.wait_award_ended = false;
  }

  async change_player(){
    board_mg.hide("board_change");
    game_mg.change_player();

    // --- board routine -----------------------------------------------------
    if( !( game_mg.current_player.id == 0 && game_mg.current_round == 1 ) ){
      media_mg.play_sound("change");
      board_mg.display_remove_darts();
      await sleep(1200);
    }

    var start_sound = "start";
    if( game_mg.current_player.id == 0 ){
      start_sound = ( game_mg.final_round ) ? "startFF" : "startF";
    }

    media_mg.play_sound(start_sound);
    panel_mg.update( game_mg );

    if( game_mg.current_player.id == 0 ){
      var message = game_mg.final_round ? "Final Round" : "Round " + game_mg.current_round ;
      board_mg.display_round( message );
      await sleep(1000);
    }

    board_mg.display_next_player();
  }

  async bust(){
    media_mg.play_sound("bust");
    board_mg.display_bust();
    await sleep(2000);
    game_mg.recalc();
    panel_mg.update( game_mg );
    board_mg.show("board_change");
  }

  play_award(){
    var award_name = game_mg.current_player.check_award();
    panel_mg.update( game_mg );
    if( award_name != null ){
      if( document.getElementById( "award_" + award_name ).tagName != "VIDEO" ){
        this.wait_award_ended = true ;
      }
      media_mg.play_award( award_name );
      board_mg.show( media_mg.playing_award );
    }
    return ( award_name != null );
  }

  stop_award(){
    this.wait_award_ended = false;
    board_mg.hide( media_mg.playing_award );
    media_mg.stop_award();
    if( this.check_end() ){
      this.game_over();
    }else{
      board_mg.show("board_change");
    }
    board_mg.show("button_menu");
    board_mg.show("board_main");
  }

  game_over(){
    media_mg.play_sound("out");
    game_mg.recalc();
    panel_mg.update( game_mg );
    board_mg.show("board_result");
  }

  dart_unthrow(){
    var reversed = game_mg.dart_unthrow();
    if( reversed ){
      media_mg.play_sound("single");
      panel_mg.update( game_mg );
    }
  }

  check_end( changed ){
    // round_limit
    var round_limit_end = ( game_mg.final_round && game_mg.final_player && ( changed || game_mg.current_player.thrown_darts == 3 ) );
    var game_out    = game_mg.current_player.is_game_out ;
    return round_limit_end || game_out ;
  }

  dart_update( key ){
    media_mg.play_sound( SystemGlue.key_to_sound( key, game_mg.game, game_mg.bull_type ) );
    game_mg.update( key );
    panel_mg.update( game_mg, true );
  }

  async input_handling( key ){
    if( this.mutex_keypress == 0 && !this.wait_award_ended && !board_mg.is_shown("board_menu") ){
      this.mutex_keypress = 1;
      var changed = ( key == 'CH' );
      if( changed ){
        if( media_mg.playing_award != null ){ this.stop_award(); }
        else if( game_mg.current_player.thrown_darts < 3 ){
          game_mg.current_player.finish_round();
          this.wait_award_ended = this.play_award();
        }
        while( this.wait_award_ended ){ await sleep(10); }
        if( this.check_end( changed ) ){
          this.game_over();
          return ;
        }
        this.change_player();
      }else if( ( media_mg.playing_award == null ) && ( !board_mg.is_shown("board_change") ) ){
        if ( game_mg.current_player.thrown_darts < 3 ){ this.dart_update( key ); }
        await sleep(700);
        if( game_mg.current_player.is_bust ){
          game_mg.current_player.finish_round();
          this.bust();
        }else if( this.check_end( changed ) ){
          game_mg.current_player.finish_round();
          this.wait_award_ended = this.play_award();
          if( this.wait_award_ended == false ){ this.game_over(); }
          return ;
        }else if( game_mg.current_player.thrown_darts == 3 ){
          game_mg.current_player.finish_round();
          var award_played = this.play_award();
          if( !award_played ){
            board_mg.show("board_change");
          }
        }
      }
      panel_mg.update( game_mg );
      await sleep(700);
      this.mutex_keypress = 0;
    }
  }

  restart_game(){
    var params         = {};
    var params_prestr  = [];
    params["players"]  = game_mg.players.length;
    params["category"] = category;
    params["game"   ]  = game_mg.game;
    params["bull"   ]  = game_mg.bull_type;
    params["options"]  = [];
    for( var i = 0 ; i < players ; i++ ){
      params["options"][i] = game_mg.players[i].options ;
    }
    Object.keys( params ).forEach(function( pname ){
      if( pname != "options" ){
        params_prestr.push( pname + "=" + params[pname] );
      }else{
        params_prestr.push( pname + "=" + JSON.stringify( params[pname] ) );
      }
    });
    window.location.href = './index.html?' + params_prestr.join("&");
  }

  return_to_menu(){
    var params         = {};
    var params_prestr  = [];
    params["players"]  = game_mg.players.length;
    params["category"] = category;
    params["game"   ]  = game_mg.game;
    Object.keys( params ).forEach(function( pname ){
      params_prestr.push( pname + "=" + params[pname] );
    });
    var url = '../index.html?' + params_prestr.join("&");
    window.location.href = url;
  }
}

function keypress_enter(){ document.dispatchEvent( new KeyboardEvent( "keypress", { keyCode: 13 })); }

// Managers
var game_mg   = null;
var media_mg  = null;
var panel_mg  = null;
var board_mg  = null;
var system_mg = null;
var iface_mg  = null;
var boardmap ;

var category;

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

window.onload = function() {
  players   = Number( getUrlParameter('players') || "2" );
  gametype  = getUrlParameter('game')    || "count_up";
  bulltype  = getUrlParameter('bull')    || "50_50";
  category  = getUrlParameter('category')|| "practice";
  options   = getUrlParameter('options') || [];

  if( options.length != 0 ) options = JSON.parse( options );

  if( Cookies.get( "boardmap" ) ){
    boardmap = JSON.parse( Cookies.get( "boardmap" ) );
  }else{
    boardmap = boardmap_org ;
    document.getElementById("panel_system_message").innerHTML = "Boardmap is not set.<br />Please set on <a href=\"../config/index.html\">Configuration Page</a>.";
    document.getElementById("panel_system_message").style.visibility = "visible";
  }

  game_mg   = new GameManager(players, gametype, bulltype, options);
  media_mg  = new MediaManager();
  panel_mg  = new PanelManager();
  board_mg  = new BoardManager();
  system_mg = new SystemManager();
  iface_mg  = new InterfaceManager();

  [ "hattrick", "lowton", "highton", "ton80", "black", "bed", "9mark", "whitehorse" ].forEach(function( aname ){
    document.getElementById("award_" + aname).addEventListener( "ended", function() {
      system_mg.stop_award();
    });
  });

  document.getElementById("award_5mark").play = board_mg.display_mark_award;
  document.getElementById("award_6mark").play = board_mg.display_mark_award;
  document.getElementById("award_7mark").play = board_mg.display_mark_award;
  document.getElementById("award_8mark").play = board_mg.display_mark_award;

  document.addEventListener('keypress', function(e) {
    for (let key in boardmap) {
      if( e.keyCode == boardmap[key] ){
        system_mg.input_handling( key );
      }
    }
  });

  panel_mg.update( game_mg );
  board_mg.show("board_main");
  document.getElementById('board_loading').classList.add('loaded');
}
