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

    if( game == "count_up" || game == "zeroone" ){
      if( key == "SB" ){ target = "s_bull"; }
      else if( key == "DB" ){ target = "d_bull"; }
      else if( key[1] == "S" ){ target = "single"; }
      else if( key[0] == "D" ){ target = "double"; }
      else if( key[0] == "T" && ( Number(key.substr(1,2)) <= 14 ) ){ target = "triple"; }
    }else if( game == "big_bull" ){
      if( key == "SB" ){ target = "d_bull"; }
      else if( key == "DB" ){ target = "u_bull"; }
      else if( key[0] == "I" ){ target = "s_bull"; }
      else if( key[1] == "S" ){ target = "single"; }
      else if( key[0] == "D" ){ target = "double"; }
      else if( key[0] == "T" && ( Number(key.substr(1,2)) <= 14 ) ){ target = "triple"; }
    }else if( game == "bull_shoot" ){
      if( key == "SB" ){ target = "s_bull"; }
      else if( key == "DB" ){ target = "d_bull"; }
      else { target = "dummy_audio" ; }
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
    this.playing_award = null;
  }

  play_sound( target ){
    document.getElementById(target).play();
  }

  play_award( award_name ){
    this.playing_award = "award_" + award_name;
    document.getElementById(this.playing_award).play();
  }

  stop_award(){
    document.getElementById(this.playing_award).pause();
    document.getElementById(this.playing_award).currentTime = 0;
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
    board.innerHTML = "<p class=\"message\">Next Player<br />Player " + ( score_mg.current_player + 1 ) + "</p>";
    board.removeEventListener('animationend', this.hide_board_next);
    board.style.visibility = "visible";
    board.style.animation = "slide_i 0.3s";
    await sleep(1000);
    board.style.animation = "slide_o 0.3s";
    board.addEventListener('animationend', this.hide_board_next);
  }

  async display_bust(){
    board_mg.show("board_bust");
    await sleep(2000);
    board_mg.hide("board_bust");
  }

  is_shown( target ){
    return (document.getElementById(target).style.visibility == "visible");
  }

  show( target ){
    document.getElementById(target).style.visibility = "visible";
  }

  hide( target ){
    document.getElementById(target).style.visibility = "hidden";
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
    score_mg.change_player();

    // --- board routine -----------------------------------------------------
    if( !( score_mg.current_player == 0 && score_mg.current_round == 1 ) ){
      media_mg.play_sound("change");
      board_mg.display_remove_darts();
      await sleep(1200);
    }

    var start_sound = "start";
    if( score_mg.current_player == 0 ){
      start_sound = ( score_mg.final_round ) ? "startFF" : "startF";
    }

    media_mg.play_sound(start_sound);
    panel_mg.update( score_mg );

    if( score_mg.current_player == 0 ){
      var message = score_mg.final_round ? "Final Round" : "Round " + score_mg.current_round ;
      board_mg.display_round( message );
      await sleep(1000);
    }

    board_mg.display_next_player();
  }

  async bust(){
    media_mg.play_sound("bust");
    board_mg.display_bust();
    await sleep(2000);
    score_mg.recalc();
    panel_mg.update( score_mg );
    board_mg.show("board_change");
  }

  play_award(){
    var award_name = score_mg.check_award();
    if( award_name != null ){
      board_mg.hide("board_main");
      media_mg.play_award( award_name );
      board_mg.show( media_mg.playing_award );
    }
    return ( award_name != null );
  }

  stop_award(){
    this.wait_award_ended = false;
    board_mg.hide( media_mg.playing_award );
    media_mg.stop_award();
    board_mg.show("board_main");
    if( this.check_end() ){
      this.game_over();
    }
  }

  game_over(){
    media_mg.play_sound("out");
    score_mg.update_awards();
    panel_mg.update( score_mg );
    board_mg.show("board_result");
  }

  dart_unthrow(){
    var reversed = score_mg.dart_unthrow();
    if( reversed ){
      media_mg.play_sound("single");
      panel_mg.update( score_mg );
    }
  }

  check_end( changed ){
    // round_limit
    var round_limit_end = ( score_mg.final_round && score_mg.final_player && ( changed || score_mg.thrown_darts == 3 ) );
    var game_out    = score_mg.is_game_out ;
    return round_limit_end || game_out ;
  }

  dart_update( key ){
    media_mg.play_sound( SystemGlue.key_to_sound( key, score_mg.game_type, score_mg.bull_type ) );
    score_mg.update( key );
    panel_mg.update( score_mg, true );
  }

  async input_handling( key ){
    if( this.mutex_keypress == 0 && !this.wait_award_ended && !board_mg.is_shown("board_menu") ){
      this.mutex_keypress = 1;
      var changed = ( key == 'CH' );
      if( changed ){
        if( media_mg.playing_award != null ){ this.stop_award(); }
        else if( score_mg.thrown_darts < 3 ){ this.wait_award_ended = this.play_award(); }
        while( this.wait_award_ended ){ await sleep(10); }
        if( this.check_end( changed ) ){ return ; }
        this.change_player();
      }else if( ( media_mg.playing_award == null ) && ( !board_mg.is_shown("board_change") ) ){
        if ( score_mg.thrown_darts < 3 ){ this.dart_update( key ); }
        await sleep(700);
        if( score_mg.is_bust_round ){
          this.bust();
        }else if( this.check_end( changed ) ){
          this.wait_award_ended = this.play_award();
          if( this.wait_award_ended == false ){ this.game_over(); }
          return ;
        }else if( score_mg.thrown_darts == 3 ){
          this.play_award();
          board_mg.show("board_change");
        }
      }
      await sleep(700);
      this.mutex_keypress = 0;
    }
  }
}

function keypress_enter(){
  document.dispatchEvent( new KeyboardEvent( "keypress", { keyCode: 13 })) ;
}

// Managers
var score_mg  = null;
var media_mg  = null;
var panel_mg  = null;
var board_mg  = null;
var system_mg = null;
var boardmap ;

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

window.onload = function() {
  players   = Number( getUrlParameter('players') || "2" );
  gametype  = getUrlParameter('game')     || "count_up";
  bulltype  = getUrlParameter('bull')     || "50_50";
  category  = getUrlParameter('category') || "practice";

  if( Cookies.get( "boardmap" ) ){
    boardmap = JSON.parse( Cookies.get( "boardmap" ) );
    if( boardmap["\\n"] == undefined ) boardmap["\\n"] = 13 ;
  }else{
    boardmap = boardmap_org ;
    document.getElementById("panel_system_message").innerHTML = "Boardmap is not set.<br />Please set from <a href=\"../config/index.html\">Configuration Page</a>.";
    document.getElementById("panel_system_message").style.visibility = "visible";
  }

  score_mg  = new ScoreManager(players, category, gametype, bulltype);
  media_mg  = new MediaManager();
  panel_mg  = new PanelManager();
  board_mg  = new BoardManager();
  system_mg = new SystemManager();

  document.getElementById("bm_unthrow").onclick    = system_mg.dart_unthrow ;
  document.getElementById("bm_endgame").onclick    = function(){ window.location.href = '../index.html' } ;
  document.getElementById("bm_return").onclick     = function(){ board_mg.hide("board_menu");  board_mg.show("button_menu"); };
  document.getElementById("button_menu").onclick   = function(){ board_mg.hide("button_menu"); board_mg.show("board_menu"); };
  document.getElementById("board_change").onclick  = keypress_enter;
  document.getElementById("board_videos").onclick  = keypress_enter;
  document.getElementById("button_retry").onclick  = function(){ location.reload(); };
  document.getElementById("button_back").onclick   = function(){ window.location.href = '../index.html' } ;

  [ "hattrick", "lowton", "highton", "ton80", "black", "whitehorse" ].forEach(function( aname ){
    document.getElementById("award_" + aname).addEventListener( "ended", function() {
      system_mg.stop_award();
    });
  });

  document.addEventListener('keypress', function(e) {
    for (let key in boardmap) {
      if( e.keyCode == boardmap[key] ){
        system_mg.input_handling( key );
      }
    }
  });

  panel_mg.update( score_mg );
  board_mg.show("board_main");
  document.getElementById('board_loading').classList.add('loaded');
}
