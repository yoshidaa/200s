// -----------------------------------------------------------------
//  PanelManager
// -----------------------------------------------------------------
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
      if( game_mg.game == "yamaguchi_a" || game_mg.game == "yamaguchi_b" ){
        var goal              = game_mg.current_player.options["number_of_marks"];
        var num_marked_full   = Math.floor( marks / 3 );
        var num_marked_rem    = marks % 3;
        var num_unmarked      = Math.max( 0, goal - ( Math.ceil( marks / 3 ) * 3 ) );
        var num_unmarked_full = Math.floor( num_unmarked / 3 );
        var num_unmarked_rem  = num_unmarked % 3;
        var num_marked_rem_bg = ( ( goal % 3 != 0 ) && ( num_unmarked_full == 0 && num_unmarked_rem == 0 ) ) ? goal % 3 : 3 ;

        for( var j = 0 ; j < num_marked_full ; j++ ){   tds_point[i].innerHTML += '<img src="img/mini_mark3.png" />'; }
        tds_point[i].innerHTML += (num_marked_rem > 0) ? '<img src="img/mini_mark' + num_marked_rem + '_' + num_marked_rem_bg + '.png" />' : "";
        for( var j = 0 ; j < num_unmarked_full ; j++ ){ tds_point[i].innerHTML += '<img src="img/mini_mark3_gray.png" />'; }
        tds_point[i].innerHTML += (num_unmarked_rem > 0) ? '<img src="img/mini_mark' + num_unmarked_rem + '_gray.png" />' : "";

        tds_clear[i].innerHTML = (cr_marks[key] >= goal) ? '<img src="img/hanko_taihenyokudekimashita_pink.png" />' : "";
      }else if( game_mg.game == "yamaguchi_c" ){
        var opened = (marks >= 3);
        var rem    = marks % 3;
        if( opened ){ tds_point[i].innerHTML = '<img src="img/mini_mark3.png" />'; }
        else{         tds_point[i].innerHTML = '<img src="img/mini_mark' + rem + '_3.png" />'; }
        tds_clear[i].innerHTML  = (cr_marks[key] >= 3) ? '<img src="img/hanko_taihenyokudekimashita_pink.png" />' : "";
      }
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
      td_title.innerHTML             = "Player " + i + " " + ( game_mg.is_top_score(i-1) ? "<img src=\"" + img_crown + "\" class=\"mini_crown\" />" : "" )
      td_title.style.color           = current ? "#000"            : "#ccc" ;
      td_title.style.backgroundColor = current ? ft_colors[player.id] : "#333";

      // board_result
      var td_winner = document.getElementById("result_player"+i+"winner");
      var td_darts  = document.getElementById("result_player"+i+"darts");
      var td_score  = document.getElementById("result_player"+i+"score");
      var td_stats  = document.getElementById("result_player"+i+"stats");
      var td_awards = document.getElementById("result_player"+i+"awards");
      document.getElementById("result_stats_title").innerHTML = game_mg.stats_type ;

      td_winner.innerHTML = game_mg.is_top_score(i-1) ? "<img src=\"" + img_crown + "\" class=\"crown\" />" : "";
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
          tr.cells[1].innerHTML += '<img src="img/mini_mark' + marks[j] + '.png" class="mini_mark"/>';
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
