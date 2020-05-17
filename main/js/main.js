// -----------------------------------------------------------------
//  Global functions
// -----------------------------------------------------------------
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
    Y.id("sound_" + target).play();
  }

  play_award( award_name ){
    this.playing_award = "award_" + award_name;
    var target = Y.id(this.playing_award);
    if( target.tagName == "VIDEO" ){
      Y.hide("button_menu");
      Y.hide("board_main");
    }
    target.play();
  }

  stop_award(){
    var target = Y.id(this.playing_award);
    if( target.tagName == "VIDEO" ){
      target.pause();
      target.currentTime = 0;
    }
    this.playing_award = null;
  }
}


class BoardManager {
  static async display_mark_award(){
    var marks = game_mg.current_player.current_marks ;
    var tds = Y.id("board_nmark").getElementsByTagName("td");
    Y.show("board_nmark");
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
    Y.hide("board_nmark");
    system_mg.stop_award();
    for( var i = 0 ; i < 3 ; i++ ){
      tds[i].innerHTML = "";
    }
  }

  static slide_in( target_id )  { Y.id(target_id).style.animation  = "slide_i 0.3s";}
  static slide_out( target_id ) {
    Y.id(target_id).style.animation = "slide_o 0.3s";
    Y.id(target_id).addEventListener("animationend", function(){ Y.hide(target_id); }, { once: true } );
  }
}


class SystemManager {
  constructor(){
    this.mutex_keypress = 0;
    this.change_player();
    this.key_input_disabled = false;
  }

  async change_player(){
    Y.hide("board_change");
    game_mg.change_player();
    var board;
    // --- board routine -----------------------------------------------------
    if( !( game_mg.current_player.id == 0 && game_mg.current_round == 1 ) ){
      media_mg.play_sound("change");
      board = "board_remove";
      BoardManager.slide_in(board);
      Y.show(board);
      await sleep(1200);
      BoardManager.slide_out(board);
      panel_mg.update( game_mg );
    }

    var start_sound = "start";
    if( game_mg.current_player.id == 0 ){
      start_sound = ( game_mg.final_round ) ? "startFF" : "startF";
    }
    media_mg.play_sound(start_sound);

    if( game_mg.current_player.id == 0 ){
      var message = game_mg.final_round ? "Final Round" : "Round " + game_mg.current_round ;
      board = "board_round";
      Y.id(board).innerHTML = "<p class=\"message\">" + message + "</p>";
      BoardManager.slide_in(board);
      Y.show(board);
      await sleep(1000);
      BoardManager.slide_out(board);
    }

    board = "board_next";
    var colors = [ "#FFAA01", "#1CE6FE", "#FF0000", "#00FF00" ];
    // Y.id(board).style.color = colors[game_mg.current_player.id];
    var message = "Next Player<br />" + Y.t_span( "Player " + (game_mg.current_player.id + 1), { "class": "player" + (game_mg.current_player.id + 1) } );
    Y.id(board).innerHTML = "<p class=\"message\">" + message + "</p>";
    BoardManager.slide_in(board);
    Y.show(board);
    await sleep(1000);
    BoardManager.slide_out(board);
  }

  async bust(){
    this.key_input_disabled = true;
    media_mg.play_sound("bust");
    Y.show("board_bust");
    await sleep(2000);
    Y.hide("board_bust");
    game_mg.recalc();
    panel_mg.update( game_mg );
    this.key_input_disabled = false;
    Y.show("board_change");
  }

  play_award(){
    var award_name = game_mg.current_player.check_award();
    panel_mg.update( game_mg );
    if( award_name != null ){
      if( Y.id( "award_" + award_name ).tagName != "VIDEO" ){
        this.key_input_disabled = true ;
      }
      media_mg.play_award( award_name );
      Y.show( media_mg.playing_award );
    }
    return ( award_name != null );
  }

  stop_award(){
    this.key_input_disabled = false;
    Y.hide( media_mg.playing_award );
    media_mg.stop_award();
    if( this.check_end() ){
      this.game_over();
    }else{
      Y.show("board_change");
    }
    Y.show("button_menu");
    Y.show("board_main");
  }

  game_over(){
    media_mg.play_sound("out");
    game_mg.recalc();
    panel_mg.update( game_mg );
    Y.show("board_result");
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
    media_mg.play_sound( game_mg.key_to_sound( key ) );
    game_mg.update( key );
    panel_mg.update( game_mg, true );
  }

  async input_handling( key ){
    if( this.mutex_keypress == 0 && !this.key_input_disabled && !Y.is_shown("board_menu") ){
      this.mutex_keypress = 1;
      var changed = ( key == 'CH' );
      if( changed ){
        if( media_mg.playing_award != null ){ this.stop_award(); }
        else if( game_mg.current_player.thrown_darts < 3 ){
          game_mg.current_player.finish_round();
          this.key_input_disabled = this.play_award();
        }
        while( this.key_input_disabled ){ await sleep(10); }
        if( this.check_end( changed ) ){
          this.game_over();
          return ;
        }
        this.change_player();
      }else if( ( media_mg.playing_award == null ) && ( !Y.is_shown("board_change") ) ){
        if ( game_mg.current_player.thrown_darts < 3 ){ this.dart_update( key ); }
        await sleep(700);
        if( game_mg.current_player.is_bust ){
          game_mg.current_player.finish_round();
          this.bust();
        }else if( this.check_end( changed ) ){
          game_mg.current_player.finish_round();
          this.key_input_disabled = this.play_award();
          if( this.key_input_disabled == false ){ this.game_over(); }
          return ;
        }else if( game_mg.current_player.thrown_darts == 3 ){
          game_mg.current_player.finish_round();
          var award_played = this.play_award();
          if( !award_played ){
            Y.show("board_change");
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
var system_mg = null;

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
    Y.id("panel_system_message").innerHTML = "[Warning] Boardmap is not set.<br />Please set on <a href=\"../config/index.html\">Configuration Page</a>.";
    Y.id("panel_system_message").style.visibility = "visible";
  }

  game_mg   = new GameManager(players, gametype, bulltype, options);
  media_mg  = new MediaManager();
  system_mg = new SystemManager();
  panel_mg  = new PanelManager();

  [ "hattrick", "lowton", "highton", "ton80", "black", "bed", "9mark", "whitehorse" ].forEach(function( aname ){
    Y.id("award_" + aname).addEventListener( "ended", function() {
      system_mg.stop_award();
    });
  });

  Y.id("award_5mark").play = BoardManager.display_mark_award;
  Y.id("award_6mark").play = BoardManager.display_mark_award;
  Y.id("award_7mark").play = BoardManager.display_mark_award;
  Y.id("award_8mark").play = BoardManager.display_mark_award;

  document.addEventListener('keypress', function(e) {
    for (let key in boardmap) {
      if( e.keyCode == boardmap[key] ){
        system_mg.input_handling( key );
      }
    }
  });

  panel_mg.update( game_mg );
  Y.show("board_main");
  Y.id('board_loading').classList.add('loaded');
}

// For Test
var board_mg  = BoardManager;
var y         = Y;
var g         = GameManager;
