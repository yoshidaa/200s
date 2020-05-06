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
      [ "winner", "player", "score", "stats", "rating", "awards" ].forEach(function( trname ){
        document.getElementById("result_player"+i+trname).style.display = "none";
      });
    }
    for( var i = 1 ; i <= score_mg.num_players ; i++ ){
      var title = document.getElementById("player"+i+"title");
      title.style.display = "table-cell";
      title.style.width   = ( 100 / score_mg.num_players ) + "%";
      document.getElementById("player"+i+"score").style.display = "table-cell";

      // board_result
      [ "winner", "player", "score", "stats", "rating", "awards" ].forEach(function( trname ){
        var td = document.getElementById("result_player"+i+trname);
        td.style.display = "table-cell";
        td.style.width   = ( 80 / score_mg.num_players ) + "%";
      });
    }
  }

  copy_tr( ptr ){
    return ptr.parentNode.insertBefore(ptr.cloneNode(true), ptr.nextSibling);
  }

  update( score_mg, latest=false ){
    this.update_wallpaper( score_mg );
    this.update_game_message( score_mg );
    this.update_dart_history( score_mg, latest );
    this.update_score_history( score_mg, latest );
    this.update_info( score_mg );
    this.update_score( score_mg );
    this.update_stats( score_mg );
  }

  update_game_message( score_mg ){
    var panel = document.getElementById("panel_game_message");
    var message = score_mg.game_message();
    if( message == "" ){
      panel.style.display = "none";
    }else{
      panel.innerHTML = "<p>" + message + "</p>";
      panel.style.display = "block";
    }
  }

  update_wallpaper( score_mg ){
    document.getElementById("board_main").style.backgroundImage = "url('./img/player" + (score_mg.current_player + 1) + ".png')";
  }

  update_info( score_mg ){
    document.getElementById("player").innerHTML = "Player " + ( score_mg.current_player + 1 );
    document.getElementById("round").innerHTML = "ROUND " + score_mg.current_round + "/" + score_mg.round_limit;
    document.getElementById("game_name").innerHTML = score_mg.game_name ;
  }

  update_stats( score_mg ){
    document.getElementById("stats").innerHTML = score_mg.stats_name + ": " + score_mg.total_stats( score_mg.current_player );
  }

  update_score( score_mg ){
    var player = score_mg.current_player;
    var score = score_mg.total_score( player );
    document.getElementById("score_value").innerHTML = score;
    var ft_colors = [ "#FFAA01", "#1CE6FE", "#FF0000", "#00FF00" ];
    var bg_colors = [ "#FFCC99", "#CBFAFF", "#FFC0C0", "#C0FFC0" ];
    document.getElementById("panel_main").style.color = ft_colors[player];

    for( var i = 1 ; i <= score_mg.num_players ; i++ ){
      var current = ( (i-1) == player );

      // board_main
      var td_score = document.getElementById("player"+i+"score");
      var td_title = document.getElementById("player"+i+"title");
      td_score.innerHTML             = score_mg.total_score(i-1) ;
      td_score.style.color           = current ? "#101010"         : "#333";
      td_score.style.backgroundColor = current ? bg_colors[player] : "#ccc";
      td_title.style.color           = current ? "#000"            : "#ccc" ;
      td_title.style.backgroundColor = current ? ft_colors[player] : "#333";

      // board_result
      var td_winner = document.getElementById("result_player"+i+"winner");
      var td_score  = document.getElementById("result_player"+i+"score");
      var td_stats  = document.getElementById("result_player"+i+"stats");
      var td_awards = document.getElementById("result_player"+i+"awards");
      document.getElementById("result_stats_title").innerHTML = score_mg.stats_name ;

      td_winner.innerHTML = score_mg.is_top_score(i-1) ? "<img src=\"img/crown.png\" />" : "";
      td_score.innerHTML = score_mg.total_score(i-1);
      td_stats.innerHTML = score_mg.total_stats(i-1);
      var awards = score_mg.total_awards(i-1);
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

  update_score_history( score_mg, latest=false ){
    var table  = document.getElementById("panel_information");
    var from   = latest ? score_mg.current_round : 1;
    var offset = 5;
    var lines  = 8;

    for( var i = from ; i <= score_mg.current_round ; i++ ){
      var tr = table.rows[i+offset] || this.copy_tr( table.rows[i+offset-1] );
      var data = score_mg.round_data( i, score_mg.current_player );
      var sp_class = "history_" + SystemGlue.score_to_class( data["score"] );
      tr.cells[0].innerHTML = i + "R";
      tr.cells[1].innerHTML = '<span class=' + sp_class + '>' + data["score"] + '</span>';
      tr.style.display = ( score_mg.current_round - i + 1 > lines ) ? "none" : "table-row";
    }

    // for after unthrow
    for( var ii = i + offset ; ii < table.rows.length ; ii++ ){
      table.deleteRow(ii);
    }
  }

  update_dart_history( score_mg, latest=false ){
    var table  = document.getElementById("panel_history");
    var from   = latest ? score_mg.current_round : 1;
    var offset = 1;
    var lines  = 8;

    for( var i = from ; i <= score_mg.current_round ; i++ ){
      var tr = table.rows[i+offset] || this.copy_tr( table.rows[i+offset-1] );
      var data = score_mg.round_data( i, score_mg.current_player );
      tr.cells[0].innerHTML = i + "R";
      for( var j = 0 ; j < 3 ; j++ ){
        tr.cells[j+1].innerHTML = data["areas"][j] ? SystemGlue.key_to_dart(data["areas"][j]) : "";
      }
      tr.style.display = ( score_mg.current_round - i + 1 > lines ) ? "none" : "table-row";
    }

    // for after unthrow
    for( var ii = i + offset ; ii < table.rows.length ; ii++ ){
      table.deleteRow(ii);
    }
  }
}
