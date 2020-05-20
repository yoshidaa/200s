// -----------------------------------------------------------------
//  PanelManager
// -----------------------------------------------------------------
class PanelManager {
  constructor(){
    for( var i = 1 ; i <= 4 ; i++ ){
      // board_main
      Y.id("player"+i+"title").style.display = "none";
      Y.id("player"+i+"score").style.display = "none";
      // board_result
      [ "winner", "player", "darts", "score", "stats", "rating", "awards" ].forEach(function( trname ){
        Y.id("result_player"+i+trname).style.display = "none";
      });
    }

    Y.id("board_result_title").innerHTML = game_mg.game_name + " Result";

    for( var i = 1 ; i <= game_mg.num_players ; i++ ){
      var title = Y.id("player"+i+"title");
      title.style.display = "table-cell";
      title.style.width   = ( 100 / game_mg.num_players ) + "%";
      Y.id("player"+i+"score").style.display = "table-cell";

      // board_result
      [ "winner", "player", "darts", "score", "stats", "rating", "awards" ].forEach(function( trname ){
        var td = Y.id("result_player"+i+trname);
        td.style.display = "table-cell";
        td.style.width   = ( 80 / game_mg.num_players ) + "%";
      });
    }

    if( game_mg.game == "yamaguchi_a" || game_mg.game == "yamaguchi_b" || game_mg.game == "yamaguchi_c" ){
      Y.show("panel_total_mark");
      Y.hide("panel_total_score");
    }else{
      Y.hide("panel_total_mark");
      Y.show("panel_total_score");
    }

    Y.id("bm_unthrow").onclick = system_mg.dart_unthrow ;

    Y.id("bm_restart").onclick = function(){
      if( window.confirm('Are you sure you want to restart game?') ){
        system_mg.restart_game();
      }
    };

    Y.id("bm_endgame").onclick = function(){
      if( window.confirm('Are you sure you want to go back to the menu?') ){
        system_mg.return_to_menu();
      }
    };

    Y.id("bm_return").onclick = function(){
      panel_mg.update( game_mg );
      Y.hide("board_menu");
      Y.show("button_menu");
    };

    Y.id("button_menu").onclick = function(){
      var options = Object.keys( game_mg.players[0].options );
      if( options.length != 0 && game_mg.current_round == 1 && game_mg.current_player_idx == 0 && game_mg.current_player.thrown_darts == 0 ){
        Y.id("bm_options").className = "active";
        Y.id("bm_options").onclick = panel_mg.display_game_option ;
      }else{
        Y.id("bm_options").className = "inactive";
        Y.id("bm_options").onclick = function(){};
      }
      if( game_mg.game == "yamaguchi_a" || game_mg.game == "yamaguchi_b" || game_mg.game == "yamaguchi_c" ){
        Y.id("bm_about").onclick = async function(){
          document.iframe.location = "./about/" + game_mg.game + ".html";
          Y.hide("board_menu");
          Y.show("board_about");
          // dirty...
          Y.id("board_main").onclick = function(){
            Y.hide("board_about");
            Y.show("button_menu");
            Y.id("board_main").onclick = function(){};
          };
          await sleep(3000);
          document.iframe.onclick = function(){
            Y.hide("board_about");
            Y.show("button_menu");
          };
        };
      }else{
        Y.id("bm_about").className = "inactive";
      }
      panel_mg.update( game_mg );
      Y.hide("button_menu");
      Y.show("board_menu");
    };

    document.title = game_mg.game_name + " - " + document.title;

    Y.id("board_change").onclick = keypress_enter;
    Y.id("board_videos").onclick = keypress_enter;
    Y.id("button_retry").onclick = system_mg.restart_game;
    Y.id("button_back").onclick  = system_mg.return_to_menu;
  }

  static copy_tr( ptr ){
    return ptr.parentNode.insertBefore(ptr.cloneNode(true), ptr.nextSibling);
  }

  update( game_mg, latest=false ){
    this.update_wallpaper( game_mg );
    this.update_game_message( game_mg );
    this.update_dart_history( game_mg, latest );
    this.update_score_history( game_mg, latest );
    this.update_info( game_mg );
    this.update_marks( game_mg );
    this.update_score( game_mg );
    this.update_stats( game_mg );
  }

  update_game_message( game_mg ){
    var panel = Y.id("panel_game_message");
    var message = game_mg.game_message();
    if( message == "" ){
      panel.style.display = "none";
    }else{
      panel.innerHTML = "<p>" + message + "</p>";
      panel.style.display = "block";
    }
  }

  update_wallpaper( game_mg ){
    Y.id("board_main").style.backgroundImage = "url('./img/player" + (game_mg.current_player.id + 1) + ".png')";
  }

  update_info( game_mg ){
    Y.id("player").innerHTML = "Player " + ( game_mg.current_player.id + 1 );
    Y.id("round").innerHTML = "ROUND " + Y.t_span( game_mg.current_round, { "class": "round" } ) + " / " + game_mg.round_limit + "";
    Y.id("game_name").innerHTML = game_mg.game_name ;

    // OPTIONS
    var options = Object.keys( game_mg.current_player.options );
    var options_str = [] ;
    for( var i = 0 ; i < options.length ; i++ ){
      var optkey = options[i];
      var optval = game_mg.current_player.options[optkey];
      if( optkey == "out" )                 { options_str.push( optval.toUpperCase() + " " + optkey.toUpperCase() ); }
      else if( optkey == "bull" )           { options_str.push( ( ( optval == "50_50" ) ? "FAT" : "SEPARATE" ) + " " + optkey.toUpperCase() ); }
      else if( optkey == "number_of_marks" ){ options_str.push( optval + " TIMES / TARGET" ); }
      else                                  { options_str.push( optkey.toUpperCase() + ": " + optval.toUpperCase() ); }
    }
    Y.id("options").innerHTML = options_str.join("<br />") ;
  }

  update_stats( game_mg ){
    Y.id("stats").innerHTML = game_mg.stats_type + ": " + game_mg.current_player.total_stats ;
  }

  update_marks( game_mg ){
    var player = game_mg.current_player;

    var ft_colors = [ "#FFAA01", "#1CE6FE", "#FF0000", "#00FF00" ];
    var bg_colors = [ "#FFCC99", "#CBFAFF", "#FFC0C0", "#C0FFC0" ];

    // for yamaguchi_a/yamaguchi_b/yamaguchi_c
    if( game_mg.stats_type == "MPR" ){
      var next_tmt_top     = Y.id("panel_game_message").offsetTop + Y.id("panel_game_message").offsetHeight + 8;
      var next_tmt_bottom  = Y.id("panel_player_scores").offsetTop - 8;
      var next_tmt_height  = next_tmt_bottom - next_tmt_top;
      var next_tmt_marksize= Math.min( ( next_tmt_height - 50 ) / 7, 64 );
      var markstyle = { "style": "width: " + next_tmt_marksize + ";height: " + next_tmt_marksize };

      var total_mark_table = Y.id("panel_total_mark");
      var trs              = total_mark_table.getElementsByTagName("tr");
      var tds_number       = total_mark_table.getElementsByClassName("number");
      var tds_point        = total_mark_table.getElementsByClassName("point");
      var tds_clear        = total_mark_table.getElementsByClassName("clear");
      var cr_marks         = player.sum_marks();
      for( var i = 0 ; i < tds_point.length ; i++ ){
        var key  = tds_number[i].innerHTML;
        var area = ( key == "BULL" ) ? "SB" : "T" + key ;
        if( player.is_valid_area( area ) ){
          tds_number[i].style.color = "#000";
          tds_number[i].style.backgroundColor = ft_colors[player.id];
        }else{
          tds_number[i].style.color = "#333";
          tds_number[i].style.backgroundColor = "";
        }
        tds_point[i].innerHTML = "";
        var marks = cr_marks[key];
        var goal  = 3; // as default
        if( game_mg.game == "yamaguchi_a" || game_mg.game == "yamaguchi_b" ){
          goal = player.options["number_of_marks"];
        }
        var mark_fg = Y.addend_decomposition( marks, 3 );
        var mark_bg = Y.addend_decomposition( goal,  3 );
        for( var j = 0 ; j < mark_bg.length ; j++ ){
          var fg = mark_fg[j] || "0";
          var bg = mark_bg[j];
          tds_point[i].innerHTML += Y.t_img( "img/mini_mark" + fg + "_" + bg + ".png", markstyle );
        }
        tds_clear[i].innerHTML = (cr_marks[key] >= goal) ? Y.t_img( "img/hanko_taihenyokudekimashita_pink.png", markstyle ) : "";
      }
      total_mark_table.style.top  = next_tmt_top ;
      total_mark_table.style.left = ( Y.id("board_main").clientWidth - total_mark_table.clientWidth ) / 2;
    }
  }

  update_score( game_mg ){
    var player = game_mg.current_player;
    var score = player.total_score;
    Y.id("score_value").innerHTML = ( score == -1 ) ? Y.t_span( "No Score", { "style": "font-size: 200px;" } ) : score;
    var ft_colors = [ "#FFAA01", "#1CE6FE", "#FF0000", "#00FF00" ];
    var bg_colors = [ "#FFCC99", "#CBFAFF", "#FFC0C0", "#C0FFC0" ];
    Y.id("panel_total_score").style.color = ft_colors[player.id];

    var img_crown = "img/mark_oukan_crown1_gold.png";
    for( var i = 1 ; i <= game_mg.num_players ; i++ ){
      var current = ( (i-1) == player.id );
      var score = game_mg.players[i-1].total_score;

      // board_main
      var td_score = Y.id("player"+i+"score");
      var td_title = Y.id("player"+i+"title");
      td_score.innerHTML             = ( score == -1 ) ? "-" : score ;
      if( game_mg.players[i-1].score_mode == "total_marks_percent" )
        td_score.innerHTML += Y.t_span( "%", { "class": "percent" } )
      td_score.style.color           = current ? "#101010"         : "#333";
      td_score.style.backgroundColor = current ? bg_colors[player.id] : "#ccc";
      td_title.innerHTML             = "Player " + i + " " + ( game_mg.is_top_score(i-1) ? Y.t_img(img_crown, {"class": "mini_crown"}) : "" )
      td_title.style.color           = current ? "#000"            : "#ccc" ;
      td_title.style.backgroundColor = current ? ft_colors[player.id] : "#333";

      // board_result
      var td_winner = Y.id("result_player"+i+"winner");
      var td_darts  = Y.id("result_player"+i+"darts");
      var td_score  = Y.id("result_player"+i+"score");
      var td_stats  = Y.id("result_player"+i+"stats");
      var td_awards = Y.id("result_player"+i+"awards");
      Y.id("result_stats_title").innerHTML = game_mg.stats_type ;

      // td_winner.innerHTML = game_mg.is_top_score(i-1) ? Y.t_img(img_crown, {"class": "crown"}) : "";
      var over_type = game_mg.players[i-1].over_type;
      td_winner.className = game_mg.is_top_score(i-1) ? "crown" : "";
      if( over_type == "BOOO" || over_type == "NORMAL" ){
        td_winner.innerHTML = "";
      }else{
        td_winner.innerHTML = Y.t_span( over_type );
      }
      td_darts.innerHTML = game_mg.players[i-1].total_thrown_darts;
      td_score.innerHTML = ( score == -1 ) ? "No Score" : score;
      if( game_mg.players[i-1].score_mode == "total_marks_percent" )
        td_score.innerHTML += " %"
      td_stats.innerHTML = game_mg.players[i-1].total_stats;
      var awards = game_mg.players[i-1].total_awards;
      var awards_str = [];
      Object.keys( GameManager.awards ).forEach(function( aname ){
        if( awards[aname] ){
          awards_str.push( GameManager.awards[aname] + "&nbsp;&nbsp;" + awards[aname]);
        }
      });
      td_awards.innerHTML = awards_str.join("<br />");
    }
  }

  update_score_history( game_mg, latest=false ){
    var table  = Y.id("panel_information");
    var from   = latest ? game_mg.current_round : 1;
    var offset = 6;
    var lines  = 8;

    for( var i = from ; i <= game_mg.current_round ; i++ ){
      var tr = table.rows[i+offset] || PanelManager.copy_tr( table.rows[i+offset-1] );
      var data = game_mg.current_player.round_data( i );
      var span_class = "normal";
      if( data["score"] >= 150 ){
        span_class = "history_highton";
      }else if( data["score"] >= 100 ){
        span_class = "history_lowton";
      }
      tr.cells[0].innerHTML = i + "R";
      if( game_mg.stats_type == "PPD" ){
        tr.cells[1].innerHTML = Y.t_span( data["score"], { "class": span_class } );
      }else{ // MPR
        var marks = game_mg.current_player.round_marks( i );
        var markimg;
        tr.cells[1].innerHTML = "";
        for( var j = 0 ; j < marks.length ; j++ ){
          markimg = "img/mini_mark" + marks[j] + ".png";
          tr.cells[1].innerHTML += Y.t_img( markimg, {"class": "mini_mark"} );
        }
      }
      tr.style.display = ( game_mg.current_round - i + 1 > lines ) ? "none" : "table-row";
    }

    // for after unthrow
    for( var ii = i + offset ; ii < table.rows.length ; ii++ ){
      table.deleteRow(ii);
    }
  }

  update_dart_history( game_mg, latest=false ){
    var table  = Y.id("panel_history");
    var from   = latest ? game_mg.current_round : 1;
    var offset = 1;
    var lines  = 8;

    for( var i = from ; i <= game_mg.current_round ; i++ ){
      var tr = table.rows[i+offset] || PanelManager.copy_tr( table.rows[i+offset-1] );
      var data = game_mg.current_player.round_data( i );
      var darts = data["darts"];
      tr.cells[0].innerHTML = i + "R";
      for( var j = 0 ; j < 3 ; j++ ){
        if( darts[j] ){
          var key  = darts[j]["area"];
          var dart = ( key[1] == "S" ) ? Number( key.substr( 2, 3 ) ) : key;
          dart = ( dart == "SB" ) ? Y.t_span( "S-Bull", { "class": "history_bull" } ) : dart;
          dart = ( dart == "DB" ) ? Y.t_span( "D-Bull", { "class": "history_bull" } ) : dart;
          tr.cells[j+1].innerHTML = dart;
        }else{
          tr.cells[j+1].innerHTML = "";
        }
      }
      tr.style.display = ( game_mg.current_round - i + 1 > lines ) ? "none" : "table-row";
    }

    // for after unthrow
    for( var ii = i + offset ; ii < table.rows.length ; ii++ ){
      table.deleteRow(ii);
    }
  }

  display_game_option(){
    var options = Object.keys( game_mg.players[0].options );

    var set_next_option = function( player_idx, option_name ){
      var player = game_mg.players[player_idx];
      var cur_value = player.options[option_name];
      var cur_index = player.opt_candidates[option_name].indexOf(cur_value);
      var nxt_index = ( cur_index + 1 ) % player.opt_candidates[option_name].length ;
      var nxt_value = player.opt_candidates[option_name][nxt_index];
      player.options[option_name] = nxt_value;
      return player.options[option_name];
    }

    if( Y.id("panel_game_option").getElementsByTagName("tr").length > options.length ){
      Y.hide("board_menu");
      Y.show("board_game_option");
      return ; // already generated
    }

    var base  = Y.id("panel_game_option").getElementsByTagName("tr")[0];
    for( var i = game_mg.players.length + 1 ; i < 5 ; i++ ){
      base.getElementsByTagName("td")[i].style.display = "none";
    }
    for( var i = 0 ; i < options.length ; i++ ){
      var added = PanelManager.copy_tr(base);
      var tds   = added.getElementsByTagName("td");
      added.className = "";
      tds[0].innerHTML = options[i].toUpperCase();
      Array.prototype.forEach.call( tds, ( e => e.removeAttribute("id") ) );
      for( var p = 0 ; p < game_mg.players.length ; p++ ){
        tds[p+1].innerHTML = game_mg.players[p].options[options[i]];
        tds[p+1].onclick = function(){
          var opts = Object.keys( game_mg.players[0].options );
          var p = this.getAttribute("player");
          var i = this.getAttribute("opt_id");
          this.innerHTML = this.set_next_option( p, opts[i] );
        };
        tds[p+1].setAttribute("player", p);
        tds[p+1].setAttribute("opt_id", i);
        tds[p+1].set_next_option = set_next_option;
      }
    }

    Y.hide("board_menu");
    Y.show("board_game_option");
    Y.id("button_ok").onclick = function(){
      Y.hide("board_game_option");
      Y.show("board_menu");
    };
  }
}
