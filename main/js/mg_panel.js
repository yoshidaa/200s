// -----------------------------------------------------------------
//  PanelManager
// -----------------------------------------------------------------
function put_img( path, opts={} ){
  var opt_str = "";
  for(let o in opts){
    opt_str = " " + o + "=\"" + opts[o] + "\""
  }
  return "<img src=\"" + path + "\"" + opt_str + ">";
}

function addend_decomposition( t, s ){
  var result = [];
  for( var i = 0 ; i < Math.floor( t / s ) ; i++ ){
    result.push( s );
  }
  result.push( t % s );
  return result;
}

class PanelManager {
  constructor(){
    for( var i = 1 ; i <= 4 ; i++ ){
      // board_main
      document.getElementById("player"+i+"title").style.display = "none";
      document.getElementById("player"+i+"score").style.display = "none";
      // board_result
      [ "winner", "player", "darts", "score", "stats", "rating", "awards" ].forEach(function( trname ){
        document.getElementById("result_player"+i+trname).style.display = "none";
      });
    }
    document.getElementById("board_result_title").innerHTML = game_mg.game_name + " Result";
    for( var i = 1 ; i <= game_mg.num_players ; i++ ){
      var title = document.getElementById("player"+i+"title");
      title.style.display = "table-cell";
      title.style.width   = ( 100 / game_mg.num_players ) + "%";
      document.getElementById("player"+i+"score").style.display = "table-cell";

      // board_result
      [ "winner", "player", "darts", "score", "stats", "rating", "awards" ].forEach(function( trname ){
        var td = document.getElementById("result_player"+i+trname);
        td.style.display = "table-cell";
        td.style.width   = ( 80 / game_mg.num_players ) + "%";
      });
    }
    if( game_mg.game == "yamaguchi_a" || game_mg.game == "yamaguchi_b" || game_mg.game == "yamaguchi_c" ){
      document.getElementById("panel_total_mark").style.visibility  = "visible";
      document.getElementById("panel_total_score").style.visibility = "hidden";
    }else{
      document.getElementById("panel_total_mark").style.visibility  = "hidden";
      document.getElementById("panel_total_score").style.visibility = "visibile";
    }


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
          document.getElementById("board_main").onclick = function(){
            board_mg.hide("board_about");
            board_mg.show("button_menu");
            document.getElementById("board_main").onclick = function(){};
          };
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

  static copy_tr( ptr ){
    return ptr.parentNode.insertBefore(ptr.cloneNode(true), ptr.nextSibling);
  }

  update( game_mg, latest=false ){
    this.update_wallpaper( game_mg );
    this.update_game_message( game_mg );
    this.update_dart_history( game_mg, latest );
    this.update_score_history( game_mg, latest );
    this.update_info( game_mg );
    this.update_score( game_mg );
    this.update_stats( game_mg );
  }

  update_game_message( game_mg ){
    var panel = document.getElementById("panel_game_message");
    var message = game_mg.game_message();
    if( message == "" ){
      panel.style.display = "none";
    }else{
      panel.innerHTML = "<p>" + message + "</p>";
      panel.style.display = "block";
    }
  }

  update_wallpaper( game_mg ){
    document.getElementById("board_main").style.backgroundImage = "url('./img/player" + (game_mg.current_player.id + 1) + ".png')";
  }

  update_info( game_mg ){
    document.getElementById("player").innerHTML = "Player " + ( game_mg.current_player.id + 1 );
    document.getElementById("round").innerHTML = "ROUND <span class=\"round\">" + game_mg.current_round + "</span> / " + game_mg.round_limit + "";
    document.getElementById("game_name").innerHTML = game_mg.game_name ;

    // OPTIONS
    var options = Object.keys( game_mg.current_player.options );
    var options_str = "" ;
    for( var i = 0 ; i < options.length ; i++ ){
      var optkey = options[i];
      var optval = game_mg.current_player.options[optkey];
      if( optkey == "out" ){
        options_str += optval.toUpperCase() + " " + optkey.toUpperCase() ;
      }else if( optkey == "bull" ){
        var type = ( optval == "50_50" ) ? "FAT" : "SEPARATE";
        options_str += type + " " + optkey.toUpperCase() ;
      }else if( optkey == "number_of_marks" ){
        options_str += optval + " TIMES / TARGET";
      }else{
        options_str += optkey.toUpperCase() + ": " + optval.toUpperCase() ;
      }
      options_str += ( i == options.length - 1 ) ? "" : "<br />";
    }
    document.getElementById("options").innerHTML = options_str ;
  }

  update_stats( game_mg ){
    document.getElementById("stats").innerHTML = game_mg.stats_type + ": " + game_mg.current_player.total_stats ;
  }

  update_score( game_mg ){
    var player = game_mg.current_player;
    var score = player.total_score;
    document.getElementById("score_value").innerHTML = ( score == -1 ) ? "<span style=\"font-size: 200px;\">No Score</span>" : score;
    var ft_colors = [ "#FFAA01", "#1CE6FE", "#FF0000", "#00FF00" ];
    var bg_colors = [ "#FFCC99", "#CBFAFF", "#FFC0C0", "#C0FFC0" ];
    document.getElementById("panel_total_score").style.color = ft_colors[player.id];

    // for yamaguchi_a/yamaguchi_b/yamaguchi_c
    var next_tmt_top     = document.getElementById("panel_game_message").offsetTop + document.getElementById("panel_game_message").offsetHeight;
    var next_tmt_bottom  = document.getElementById("panel_player_scores").offsetTop;
    var next_tmt_height  = next_tmt_bottom - next_tmt_top;
    var next_tmt_marksize= Math.min( ( next_tmt_height - 70 ) / 7, 54 );
    var markstyle = { "style": "width: " + next_tmt_marksize + ";height: " + next_tmt_marksize };

    var total_mark_table = document.getElementById("panel_total_mark");
    var trs              = total_mark_table.getElementsByTagName("tr");
    var tds_number       = total_mark_table.getElementsByClassName("number");
    var tds_point        = total_mark_table.getElementsByClassName("point");
    var tds_clear        = total_mark_table.getElementsByClassName("clear");
    var cr_marks         = game_mg.current_player.sum_marks();
    for( var i = 0 ; i < tds_point.length ; i++ ){
      var key  = tds_number[i].innerHTML;
      var area = ( key == "BULL" ) ? "SB" : "T" + key ;
      if( game_mg.current_player.is_valid_area( area ) ){
        tds_number[i].style.color = "#000";
        tds_number[i].style.backgroundColor = ft_colors[player.id];
      }else{
        tds_number[i].style.color = "#333";
        tds_number[i].style.backgroundColor = "";
      }
      tds_point[i].innerHTML = "";
      var marks = cr_marks[key];
      var goal;
      if( game_mg.game == "yamaguchi_a" || game_mg.game == "yamaguchi_b" ){
        goal = game_mg.current_player.options["number_of_marks"];
      }else if( game_mg.game == "yamaguchi_c" ){
        goal = 3;
      }
      var mark_fg = addend_decomposition( marks, 3 );
      var mark_bg = addend_decomposition( goal,  3 );
      for( var j = 0 ; j < mark_bg.length ; j++ ){
        var fg = mark_fg[j] || "0";
        var bg = mark_bg[j];
        tds_point[i].innerHTML += put_img( "img/mini_mark" + fg + "_" + bg + ".png", markstyle );
      }
      tds_clear[i].innerHTML = (cr_marks[key] >= goal) ? put_img( "img/hanko_taihenyokudekimashita_pink.png", markstyle ) : "";
    }
    total_mark_table.style.left = ( document.getElementById("board_main").clientWidth - total_mark_table.clientWidth ) / 2;

    var img_crown = "img/mark_oukan_crown1_gold.png";
    for( var i = 1 ; i <= game_mg.num_players ; i++ ){
      var current = ( (i-1) == player.id );
      var score = game_mg.players[i-1].total_score;

      // board_main
      var td_score = document.getElementById("player"+i+"score");
      var td_title = document.getElementById("player"+i+"title");
      td_score.innerHTML             = ( score == -1 ) ? "-" : score ;
      if( game_mg.players[i-1].score_mode == "total_marks_percent" )
        td_score.innerHTML += "<span class=\"percent\">%</span>"
      td_score.style.color           = current ? "#101010"         : "#333";
      td_score.style.backgroundColor = current ? bg_colors[player.id] : "#ccc";
      td_title.innerHTML             = "Player " + i + " " + ( game_mg.is_top_score(i-1) ? put_img(img_crown, {"class": "mini_crown"}) : "" )
      td_title.style.color           = current ? "#000"            : "#ccc" ;
      td_title.style.backgroundColor = current ? ft_colors[player.id] : "#333";

      // board_result
      var td_winner = document.getElementById("result_player"+i+"winner");
      var td_darts  = document.getElementById("result_player"+i+"darts");
      var td_score  = document.getElementById("result_player"+i+"score");
      var td_stats  = document.getElementById("result_player"+i+"stats");
      var td_awards = document.getElementById("result_player"+i+"awards");
      document.getElementById("result_stats_title").innerHTML = game_mg.stats_type ;

      td_winner.innerHTML = game_mg.is_top_score(i-1) ? put_img(img_crown, {"class": "crown"}) : "";
      td_darts.innerHTML = game_mg.players[i-1].total_thrown_darts;
      td_score.innerHTML = ( score == -1 ) ? "No Score" : score;
      if( game_mg.players[i-1].score_mode == "total_marks_percent" )
        td_score.innerHTML += " %"
      td_stats.innerHTML = game_mg.players[i-1].total_stats;
      var awards = game_mg.players[i-1].total_awards;
      var awards_str = [];
      [ "hattrick", "lowton", "highton", "ton80", "black", "bed",
        "9mark", "8mark", "7mark", "6mark", "5mark", "whitehorse" ].forEach(function( aname ){
        var title = "HAT TRICK";
        if( aname == "lowton"     ){ title = "LOW TON"; }
        if( aname == "highton"    ){ title = "HIGH TON"; }
        if( aname == "ton80"      ){ title = "TON80"; }
        if( aname == "bed"        ){ title = "3 IN A BED"; }
        if( aname == "9mark"      ){ title = "9MARK"; }
        if( aname == "8mark"      ){ title = "8MARK"; }
        if( aname == "7mark"      ){ title = "7MARK"; }
        if( aname == "6mark"      ){ title = "6MARK"; }
        if( aname == "5mark"      ){ title = "5MARK"; }
        if( aname == "black"      ){ title = "3 IN THE BLACK"; }
        if( aname == "whitehorse" ){ title = "WHITE HORSE"; }
        if( awards[aname] ){
          awards_str.push(title + "&nbsp;&nbsp;" + awards[aname]);
        }
      });
      td_awards.innerHTML = awards_str.join("<br />");
    }
  }

  update_score_history( game_mg, latest=false ){
    var table  = document.getElementById("panel_information");
    var from   = latest ? game_mg.current_round : 1;
    var offset = 6;
    var lines  = 8;

    for( var i = from ; i <= game_mg.current_round ; i++ ){
      var tr = table.rows[i+offset] || PanelManager.copy_tr( table.rows[i+offset-1] );
      var data = game_mg.current_player.round_data( i );
      var sp_class = "history_" + SystemGlue.score_to_class( data["score"] );
      tr.cells[0].innerHTML = i + "R";
      if( game_mg.stats_type == "PPD" ){
        tr.cells[1].innerHTML = '<span class=' + sp_class + '>' + data["score"] + '</span>';
      }else{ // MPR
        var marks = game_mg.current_player.round_marks( i );
        tr.cells[1].innerHTML = "";
        for( var j = 0 ; j < marks.length ; j++ ){
          tr.cells[1].innerHTML += put_img("img/mini_mark"+marks[j]+".png", {"class": "mini_mark"});
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
    var table  = document.getElementById("panel_history");
    var from   = latest ? game_mg.current_round : 1;
    var offset = 1;
    var lines  = 8;

    for( var i = from ; i <= game_mg.current_round ; i++ ){
      var tr = table.rows[i+offset] || PanelManager.copy_tr( table.rows[i+offset-1] );
      var data = game_mg.current_player.round_data( i );
      var darts = data["darts"];
      tr.cells[0].innerHTML = i + "R";
      for( var j = 0 ; j < 3 ; j++ ){
        tr.cells[j+1].innerHTML = darts[j] ? SystemGlue.key_to_dart(darts[j]["area"]) : "";
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

    if( document.getElementById("panel_game_option").getElementsByTagName("tr").length > options.length ){
      document.getElementById("board_menu").style.visibility = "hidden";
      document.getElementById("board_game_option").style.visibility = "visible";
      return ; // already generated
    }

    var base  = document.getElementById("panel_game_option").getElementsByTagName("tr")[0];
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

    document.getElementById("board_menu").style.visibility = "hidden";
    document.getElementById("board_game_option").style.visibility = "visible";
    document.getElementById("button_ok").onclick = function(){
      document.getElementById("board_game_option").style.visibility = "hidden";
      document.getElementById("board_menu").style.visibility = "visible";
    };
  }
}
