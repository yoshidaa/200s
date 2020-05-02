var round_data = [ { "areas": [], "score": 0 } ];
var total_score = 0;
var wait_change_button = false;
var wait_playing_award = false;
var playing_award = null;

function play_sound( key ){
  if( key == "SB" ){ target = "s_bull"; }
  else if( key == "DB" ){ target = "d_bull"; }
  else if( key == "CH" ){ target = "change"; }
  else if( key[1] == "S" ){ target = "single"; }
  else if( key[0] == "D" ){ target = "double"; }
  else if( key[0] == "T" && ( Number(key.substr(1,2)) <= 14 ) ){ target = "triple"; }
  else { target = key; }
  document.getElementById(target).play();
}

let len = function(array,pat) {
  return array.filter(function(x){return x===pat}).length;
}

function get_score( area, bull="fat" ){
  if( area == "DB" ){ return 50 ; }
  else if( area == "SB" ){ return ( ( bull == "fat" ) ? 50 : 25 ); }
  else if( area[0] == "T" ){ return 3 * Number( area.substr( 1, 2 ) ); }
  else if( area[0] == "D" ){ return 2 * Number( area.substr( 1, 2 ) ); }
  else { return Number( area.substr( 2, 2 ) ); }
}

function check_and_play_awards( data ){
  if( len( data["areas"], 'DB' ) == 3 ){          award_name = "black"; }
  else if( ( len( data["areas"], 'DB' )
           + len( data["areas"], 'SB' ) ) == 3 ){ award_name = "hattrick"; }
  else if( data["score"] == 180 ){                award_name = "ton80"; }
  else if( data["score"] >= 150 ){                award_name = "highton"; }
  else if( data["score"] >= 100 ){                award_name = "lowton"; }
  else{
    award_name = null;
  }

  if( award_name != null ){
    document.getElementById("award_" + award_name).play();
  }else{
    document.getElementById("press_change_button").style.display = "block";
  }

  return ( award_name != null );
}

function stop_playing_award(){
  if( playing_award != null ){
    v = document.getElementById(playing_award);
    v.pause();
    v.currentTime = 0;
    v.style.display = "none";
    playing_award = null;
    document.getElementById("main_board").style.display = "block";
  }
}

function update_tr( tr, data ){
  function get_display_key( key ){
    display_key = ( key[1] == "S" ) ? key.substr( 2, 3 ) : key;
    display_key = ( display_key == "SB" ) ? "<span class=\"history_bull\">S-Bull</span>" : display_key;
    display_key = ( display_key == "DB" ) ? "<span class=\"history_bull\">D-Bull</span>" : display_key;
    return display_key;
  }

  for( var i = 0 ; i < 3 ; i++ ){
    if( data["areas"][i] ){
      tr.cells[i+1].innerHTML = get_display_key(data["areas"][i]);
    }else{
      tr.cells[i+1].innerHTML = "";
    }
  }

  if( data["score"] > 150 ){
    sp_class = "highton";
  }else if( data["score"] >= 100 ){
    sp_class = "lowton";
  }else{
    sp_class = "normal";
  }
  tr.cells[ 4 ].innerHTML = '<span class="history_' + sp_class + '">' + data["score"] + '</span>';

  num_darts = ( round_data.length - 1 ) * 3 + round_data[ round_data.length - 1 ]["areas"].length;
  ppd = ( parseFloat( total_score ) / num_darts ).toFixed(2);

  document.getElementById("ppd").innerHTML = "PPD: " + ppd;
}

function update_table( historyboard ){
  for( var i = 0 ; i < round_data.length ; i++ ){
    var tr = historyboard.rows[i+1];
    if( tr == undefined ){
      ptr = historyboard.rows[i];
      tr = ptr.parentNode.insertBefore(ptr.cloneNode(true), ptr.nextSibling);
      tr.cells[0].innerHTML = ( i + 1 ) + "R";
    }
    update_tr( tr, round_data[i] );
    if( round_data.length - i > 8 ){
      tr.style.display = "none";
    }else{
      tr.style.display = "table-row";
    }
  }
  for( ii = i + 1 ; ii < historyboard.rows.length ; ii++ ){
    historyboard.deleteRow(ii);
  }
}

function change_round( historyboard ){
  round_data.push( { "areas": [], "score": 0 } );
  document.getElementById("press_change_button").style.display = "none";
  wait_change_button = false;
  document.getElementById("round").innerHTML = round_data.length + "R / 9999R";
  update_table( historyboard );
}

function update_historyboard( historyboard, key ){
  var crdata = round_data[round_data.length - 1];
  score = get_score( key );
  crdata["areas"].push( key );
  crdata["score"] += score;
  total_score += score;
  document.getElementById("score_value").innerHTML = total_score;
  update_tr( historyboard.rows[round_data.length], crdata );
}

function unthrow_dart(){
  var historyboard = document.getElementById("history");
  var crdata = round_data[round_data.length - 1];
  if( crdata["areas"].length != 0 ){
    key = crdata["areas"].pop();
    score = get_score(key);
    total_score -= score;
    crdata["score"] -= score;
    document.getElementById("score_value").innerHTML = total_score;
    update_tr( historyboard.rows[round_data.length], crdata );
  }else{
    if( round_data.length != 1 ){
      round_data.pop();
      var crdata = round_data[round_data.length - 1];
      if( crdata["areas"].length != 0 ){
        key = crdata["areas"].pop();
        score = get_score(key);
        total_score -= score;
        crdata["score"] -= score;
      }
      document.getElementById("score_value").innerHTML = total_score;
      update_table( historyboard );
    }
  }
}

var mutex = 0;

document.addEventListener('keypress', function(e) {
  if( mutex == 0 ){
    mutex = 1;
    var historyboard = document.getElementById("history");
    crdata = round_data[round_data.length - 1];
    for (let key in boardmap) {
      if( !wait_playing_award && e.keyCode == keymap[boardmap[key]] ){
        if( key == 'CH' ){
          play_sound( key );
          if( crdata["areas"].length < 3 ){
            wait_playing_award = check_and_play_awards( crdata );
          }else{
            stop_playing_award();
          }
          change_round( historyboard );
          setTimeout( function () {
              document.getElementById("start").play();
            }, "1500"
          );
        }else if( wait_change_button == false ){
          if ( crdata["areas"].length < 3 ){
            play_sound( key );
            update_historyboard( historyboard, key );
          }
          if ( crdata["areas"].length == 3 ){
            setTimeout( function () {
              check_and_play_awards( crdata );
              }, "500"
            );
            wait_change_button = true;
          }
        }
      }
    }
    setTimeout( function () {
      mutex = 0;
      }, "700"
    );
  }
});

window.onload = function() {
  const spinner = document.getElementById('loading');
  spinner.classList.add('loaded');

  document.getElementById("history").onclick = unthrow_dart;
  document.getElementById("press_change_button").onclick = function(){
    document.dispatchEvent( new KeyboardEvent( "keypress", { keyCode: 13 })) ;
  };
  document.getElementById("videos").onclick = function(){
    document.dispatchEvent( new KeyboardEvent( "keypress", { keyCode: 13 })) ;
  };

  [ "hattrick", "lowton", "highton", "ton80", "black", "whitehorse" ].forEach(function( aname ){
    v = document.getElementById("award_" + aname);
    v.addEventListener( "play",  function() {
      document.getElementById("award_" + aname).style.display = "block";
      document.getElementById("main_board").style.display = "none";
      playing_award = "award_" + aname;
    });
    v.addEventListener( "ended", function() {
      document.getElementById("award_" + aname).style.display = "none";
      document.getElementById("main_board").style.display = "block";
      if( wait_change_button == true ){
        document.getElementById("press_change_button").style.display = "block";
      }
      playing_award = null;
      wait_playing_award = false;
    });
  });
}
