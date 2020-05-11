/*jshint esversion: 6 */
/*jshint sub:true*/
function len( array, pat ){
  return array.filter(function(x){ return (x.indexOf(pat) != -1); }).length;
}

function sum(arr){
  return arr.reduce( function( prev, current, i, arr ) { return prev + current; });
}

function count( arr, value ){
  return arr.filter( function(x){ return x === value; } ).length;
}

// -----------------------------------------------------------------
//  Player
// -----------------------------------------------------------------
class Player {
  constructor( id, game_code, bull="50_50", opt={} ){
    this.id          = id;
    this.bull_type   = bull;
    if(      game_code == "count_up" || game_code == "big_bull" || game_code == "bull_shoot" ){
      this.category        = "count_up";
      this.game            = game_code;
      this.round_limit     = 8;
      this.initial_score   = 0;
      this.score_mode      = "total_score";
      this.stats_type      = "PPD";
      this.options         = { };
    }else if( game_code == "cr_count_up" ){
      this.category        = "count_up";
      this.game            = game_code;
      this.round_limit     = 8;
      this.initial_score   = 0;
      this.score_mode      = "total_score";
      this.target_numbers  = [ "20", "19", "18", "17", "16", "15", "BULL" ];
      this.stats_type      = "MPR";
      this.options         = { };
    }else if( game_code[0] == "z" ){
      var ivalue = Number( game_code.substr(1) );
      var round_limits = { 301: 10, 501: 15, 701: 15, 901: 20, 1101: 20, 1501: 20 };
      this.category        = "zeroone";
      this.game            = "zeroone";
      this.round_limit     = round_limits[ivalue];
      this.initial_score   = ivalue ;
      this.score_mode      = "zeroone";
      this.stats_type      = "PPD";
      this.options         = { "out": "OPEN", "bull": "50_50" };
      this.opt_candidates  = { "out": [ "OPEN", "MASTER", "DOUBLE" ],
                               "bull": [ "50_50", "25_50" ] };
    }else if( game_code == "yamaguchi_a" ){
      this.category        = "cricket" ;
      this.game            = game_code;
      this.round_limit     = 99;
      this.initial_score   = 0;
      this.score_mode      = "total_marks_percent";
      this.target_numbers  = [ "20", "19", "18", "17", "16", "15", "BULL", "CLEAR" ];
      this.stats_type      = "MPR";
      this.options         = { "number_of_marks": 10 };
      this.opt_candidates  = { "number_of_marks": [ 10, 9, 8, 7, 6, 5, 4, 3 ] };
    }else if( game_code == "yamaguchi_b" ){
      this.category        = "cricket" ;
      this.game            = game_code;
      this.round_limit     = 99;
      this.initial_score   = 0;
      this.score_mode      = "total_marks_percent";
      this.target_numbers  = [ "20", "19", "18", "17", "16", "15", "BULL", "CLEAR" ];
      this.stats_type      = "MPR";
      this.options         = { "number_of_marks": 3 };
      this.opt_candidates  = { "number_of_marks": [ 3, 6, 9 ] };
    }else if( game_code == "yamaguchi_c" ){
      this.category        = "cricket" ;
      this.game            = game_code;
      this.round_limit     = 20;
      this.initial_score   = -1;
      this.score_mode      = "total_awards";
      this.target_numbers  = [ "20", "19", "18", "17", "16", "15", "BULL", "CLEAR" ];
      this.stats_type      = "MPR";
      this.options         = { "award": "whitehorse" };
      this.opt_candidates  = { "award": [ "whitehorse", "any9mark" ] };
    }
    if( Object.keys( opt ).length != 0 ){ this.options = opt; }
    this.round_finished = false ;
    this._round_data    = [];
    this._total_data    = this.initial_value_of_total_data;
  }

  get initial_value_of_round_data(){
    return { "round" : this.current_round + 1,
             "darts": [],
             "score" : 0,
             "marks" : this.initial_marks,
             "bust"  : false };
  }
  get initial_value_of_total_data(){
    return { "score": this.initial_score,
             "marks": this.initial_marks,
             "stats": 0,
             "awards": {} };
  }

  get current_round()     { return this._round_data.length; }
  get current_round_data(){ return this.round_data( this.current_round ); }

  get total_data()        { return this._total_data; }
  get total_score()       { return this.total_data["score"]; }
  get total_stats()       { return this.total_data["stats"]; }
  get total_marks()       { return this.total_data["marks"]; }
  get total_awards()      { return this.total_data["awards"]; }

  get thrown_darts()      { return this.round_finished ? 3 : this.current_round_data["darts"].length ; }
  get total_thrown_darts(){ return ( this.current_round - 1 ) * 3 + this.thrown_darts ; }

  get initial_marks()     { return { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, "BULL": 0 }; }
  get current_marks()     { return this.darts_to_marks( this.current_round_data["darts"] ); }
  get latest_dart()       {
    if( this.current_round_data["darts"][this.thrown_darts - 1] ){
      return this.current_round_data["darts"][this.thrown_darts - 1]["area"];
    }else{
      return "";
    }
  }
  get is_bust()           {
    if( this.category == "zeroone" ){
      return ( ( this.total_score < 0 ) || ( this.total_score == 1 && this.options["out"] != "OPEN" ) );
    }
    return false;
  }

  darts_to_marks( darts ){
    var marks = [];
    for( var i = 0 ; i < 3 ; i++ ){
      var dart = darts[i];
      marks.push( ( dart && dart["valid"] ) ? Area.to_mark_point( dart["area"] ) : 0 );
    }
    return marks;
  }

  round_data( round ) { return this._round_data[round-1]; }
  round_marks( round ){ return this.darts_to_marks( this._round_data[round-1]["darts"] ); }
  change_round()      { this._round_data.push( this.initial_value_of_round_data );
                        this.round_finished = false; }
  reverse()           { this._round_data.pop(); }

  dart_unthrow(){
    this.current_round_data["darts"].pop();
    this.update_crdata();
    this.update_total_data();
  }

  is_valid_round( cr ){
    if( this.category == "zeroone" ){
      return ( cr["bust"] == false );
    }else{
      return true;
    }
  }

  is_valid_area( area ){
    var valid;
    if( this.game == "cr_count_up" ){
      var target = this.target_numbers[this.stage];
      valid = target ? Area.is( area, target ) : Area.is_cricket_number( area );
    }else if( this.game == "yamaguchi_a" ){
      if( this.stage == 7 ) return true; // for panel_mg.display_score()...
      valid = Area.is( area, this.target_numbers[this.stage] );
    }else if( this.game == "yamaguchi_b" ){
      if( this.stage == 7 ) return true; // for panel_mg.display_score()...
      if( this.stage == 6 ){ return Area.is_BULL( area ); }
      else{ return ( Area.is_T( area ) && Area.is_cricket_number( area ) ) && ( this.total_marks[Area.to_number(area)] < this.options["number_of_marks"] ); }
    }else if( this.game == "yamaguchi_c" ){
      if( this.stage == 0 ){
        return Area.is_BULL( area );
      }else if( this.stage == 1 || this.stage == 2 ){
        return Area.is_cricket_number( area ) && !Area.is_BULL( area );
      }else if( this.stage == 3 ){
        return ( this.thrown_darts != 2 ) ? false : Area.is_BULL( area );
      }
    }else{
      valid = true ;
    }
    return valid;
  }

  update_crdata(){
    var cr = this.current_round_data;
    cr["score"] = 0;
    cr["marks"] = this.initial_marks;
    if( this.is_valid_round( cr ) ){
      for( var i = 0 ; i < this.thrown_darts ; i++ ){
        var dart = cr["darts"][i];
        if( dart && dart["valid"] ){
          cr["score"] += Area.to_score( dart["area"], this.game, this.stats_type, this.bull_type );
          if( Area.to_mark_key( dart["area"] ) )
            cr["marks"][ Area.to_mark_key( dart["area"] ) ] += Area.to_mark_point( dart["area"] );
        }
      }
    }
  }

  sum_score(){
    var score = 0;
    for( var round = 1 ; round <= this.current_round ; round++ ){
      var rd = this.round_data( round );
      score += ( rd["bust"] == false ) ? rd["score"] : 0;
    }
    return score ;
  }

  update_total_score(){
    var total = this.total_data;
    if( this.score_mode == "total_score" ){
      total["score"] = this.initial_score + this.sum_score();
    }else if( this.score_mode == "zeroone" ){
      total["score"] = this.initial_score - this.sum_score();
    }else if( this.score_mode == "darts_count" ){
      total["score"] = this.total_thrown_darts;
    }else if( this.score_mode == "total_marks_percent" ){
      total["score"] = ( 100.0 * sum( Object.values( this.total_marks ) ) / ( this.options["number_of_marks"] * 7 ) ).toFixed(1) ;
    }else if( this.score_mode == "total_awards" ){
      if( this.options["award"] == "whitehorse" ){
        total["score"] = this.total_awards[this.options["award"]] || 0;
      }else if( this.options["award"] == "any9mark" ){
        total["score"]  = 0;
        total["score"] += this.total_awards["whitehorse"] || 0;
        total["score"] += this.total_awards["bed"] || 0;
        total["score"] += this.total_awards["9mark"] || 0;
      }

      // stage check
      if( !this.check_marks_yamaguchi_c() ){
        total["score"] = -1;
      }
      if( this.current_round == this.round_limit && this.thrown_darts == 3 && !Area.is_BULL( this.latest_dart ) ){
        total["score"] = -1;
      }
    }
  }

  sum_marks(){
    var marks = this.initial_marks ;
    for( var round = 1 ; round <= this.current_round ; round++ ){
      var rd = this.round_data( round );
      var keys = Object.keys(marks);
      for( var i = 0 ; i < keys.length ; i++ ){
        marks[keys[i]] += rd["marks"][keys[i]];
        if( this.game == "yamaguchi_a" || this.game == "yamaguchi_b" ){
          marks[keys[i]] = Math.min( marks[keys[i]], this.options["number_of_marks"] );
        }
        if( this.game == "yamaguchi_c" && this.stage != 4 && keys[i] == "BULL" ){
          marks[keys[i]] = Math.min( marks[keys[i]], 2 );
        }
      }
    }
    return marks;
  }

  update_total_marks(){
    var total = this.total_data;
    total["marks"] = this.sum_marks();
  }

  update_total_stats(){
    var total = this.total_data;
    if( this.stats_type == "MPR" ){
      total["stats"] = ( this.total_thrown_darts == 0 ) ? 0
                     : ( parseFloat( sum( Object.values( this.sum_marks() ) ) ) / ( this.total_thrown_darts / 3 ) ).toFixed(2);
    }else if( this.stats_type == "PPD" ){
      total["stats"] = ( this.total_thrown_darts == 0 ) ? 0
                     : ( parseFloat( this.sum_score() ) / this.total_thrown_darts ).toFixed(2);
    }else{
      throw "invalid stats_type: " + this.stats_type ;
    }
  }

  prediction(){
    return ( this.total_thrown_darts == 0 ) ? 0
          : Math.round( ( this.total_score / this.total_thrown_darts ) * 3 * this.round_limit );
  }

  is_incomplete_number( number ){
    var total = this.total_marks;
    if( this.game == "yamaguchi_a" || this.game == "yamaguchi_b" ){
      return ( total[number.toString()] < this.options["number_of_marks"] );
    }else if( this.game == "yamaguchi_c" ){
      return ( total[number.toString()] < 3 );
    }else{
      throw "is_imcomplete_number is not supported at this game (" + this.game + ")";
    }
  }

  check_marks_yamaguchi_c(){
    return ( this.total_marks["20"] >= 3 ) && ( this.total_marks["19"] >= 3 )
        && ( this.total_marks["18"] >= 3 ) && ( this.total_marks["17"] >= 3 )
        && ( this.total_marks["16"] >= 3 ) && ( this.total_marks["15"] >= 3 );
  }

  get stage(){
    var stage = 0;
    if( this.game == "yamaguchi_a" ){
      while( stage != 7 && !this.is_incomplete_number( this.target_numbers[stage] ) ) stage += 1;
    }else if( this.game == "yamaguchi_b" ){
      for( var i = 0 ; i < this.target_numbers.length ; i++ ){
        if( stage != 7 && !this.is_incomplete_number( this.target_numbers[stage] ) ) stage += 1;
      }
    }else if( this.game == "yamaguchi_c" ){
      if( this.total_marks["BULL"] < 2 ){
        return 0;
      }else if( this.current_round == this.round_limit ){
        return 3;
      }else if( this.check_marks_yamaguchi_c() ){
        return 2;
      }else{
        return 1;
      }
    }else{ // cr_count_up
      stage = this.current_round - 1;
    }
    return stage ;
  }

  update( key ){
    this.current_round_data["darts"].push( { "area": key, "valid": this.is_valid_area( key ) } );
    this.update_crdata();
    this.update_total_data();
    this.current_round_data["bust"] = this.is_bust ;
  }

  update_total_data(){
    this.update_total_marks();
    this.update_total_score();
    this.update_total_stats();
    this.update_total_awards();
  }

  update_total_awards(){
    var awards = {};
    for( var i = 1 ; i <= this.current_round ; i++ ){
      var award = this.check_award( this.round_data(i) );
      if( award ){
        if( !awards[award] ){
          awards[award] = 0;
        }
        awards[award] += 1;
      }
    }
    this.total_data["awards"] = awards;
  }

  recalc(){
    this.update_crdata();
    this.update_total_data();
  }

  get is_game_out(){
    var cond = false;
    if( this.game == "zeroone" && this.total_score == 0 ){
      var latest = this.latest_dart;
      cond = cond || ( this.options["out"] == "MASTER" && ( Area.is_S( latest ) == false ) );
      cond = cond || ( this.options["out"] == "DOUBLE" && ( Area.is_D( latest ) || Area.is_DB( latest ) ) );
      cond = cond || ( this.options["out"] == "OPEN" );
    }else if( this.game == "yamaguchi_a" || this.game == "yamaguchi_b" ){
      cond = ( this.stage == 7 );
    }
    // cond = cond || ( ( this.category == "cricket" ) && this.is_top_score() && this.is_all_marked() );
    return cond;
  }

  finish_round(){
    this.round_finished = true;
    this.recalc();
  }

  check_award( data = this.current_round_data ){
    var award_name = null;
    var d_bull_count = 0;
    var   bull_count = 0;

    var areas = [];
    for( var i = 0 ; i < data["darts"].length ; i++ ){
      if( data["darts"][i] && data["darts"][i]["valid"] ){
        areas.push( data["darts"][i]["area"] );
      }
    }

    if( this.game == "big_bull" ){
      d_bull_count = len( areas, "DB" ) + len( areas, "SB" );
        bull_count = d_bull_count + len( areas, "IS" );
    }else{
      d_bull_count = len( areas, "DB" );
        bull_count = d_bull_count + len( areas, "SB" );
    }

    if( data["bust"] == false ){
      if( d_bull_count == 3 )          { award_name = "black"; }
      else if( bull_count == 3 )       { award_name = "hattrick"; }
      else if( data["score"] == 180 )  { award_name = "ton80"; }
      else if( this.stats_type == "MPR" )
      {
        var marks = Object.values( data["marks"] );
        if(      count(marks, 3) == 3 ){ award_name = "whitehorse"; }
        else if( count(marks, 9) == 1 ){ award_name = "bed"; }
        else if( sum(marks) == 9 )     { award_name = "9mark"; }
        else if( sum(marks) == 8 )     { award_name = "8mark"; }
        else if( sum(marks) == 7 )     { award_name = "7mark"; }
        else if( sum(marks) == 6 )     { award_name = "6mark"; }
        else if( sum(marks) == 5 )     { award_name = "5mark"; }
      }
      else if( data["score"] >  150 )  { award_name = "highton"; }
      else if( data["score"] >= 100 )  { award_name = "lowton"; }
    }

    return award_name;
  }

  game_message(){
    var target;
    var str = [];
    if( this.game == "cr_count_up" ){
      target = this.target_numbers[this.stage];
      return target ? "THROW AT <strong>" + target + "</strong>" : "THROW AT ANY CRICKET NUMBERS";
    }else if( this.game == "yamaguchi_a" ){
      target = "<strong>" + this.target_numbers[this.stage] + "</strong>";
      return ( target == "CLEAR" ) ? "CLEAR!!!" : "THROW AT " + target;
    }else if( this.game == "yamaguchi_b" ){
      if( this.stage == 6 ) return "THROW AT <strong>BULL</strong>";
      else{
        for( var i = 0 ; i < 6 ; i++ ){
          target = this.target_numbers[i];
          if( this.is_incomplete_number( target ) ){
            str.push( "<span class=\"little_strong\">T" + target + "</span>" );
          }
        }
        return "THROW AT " + str.join(",") ;
      }
    }else if( this.game == "yamaguchi_c" ){
      if( this.stage == 0 ) return "1. THROW AT <strong>BULL</strong>";
      if( this.stage == 1 ){
        for( var i = 0 ; i < 6 ; i++ ){
          target = this.target_numbers[i];
          if( this.is_incomplete_number( target ) ){
            str.push( "<span class=\"little_strong\">" + target + "</span>" );
          }
        }
        return "2. OPEN " + str.join(",") ;
      }
      if( this.stage == 2 ) return "3. MAKE " + this.options["award"].toUpperCase() + "!!";
      if( this.stage == 3 ){
        if( this.thrown_darts  < 2 ) return "4. THROW AT ANY AREA (ignored)";
        if( this.thrown_darts == 2 ) return "4. THROW AT <strong>BULL</strong>";
        if( this.thrown_darts == 3 &&  Area.is_BULL( this.latest_dart ) ) return "Congratulations";
        if( this.thrown_darts == 3 && !Area.is_BULL( this.latest_dart ) ) return "GAME OVER";
      }
    }else if( this.category == "count_up" ){
      return "SCORE PREDICTION <strong>" + this.prediction() + "</strong>";
    }else{
      return "";
    }
  }
}




// -----------------------------------------------------------------
//  GameManager
// -----------------------------------------------------------------
class GameManager {
  constructor( n, game_code, bull="50_50", options=[] ){
    this.num_players = n ;
    this.bull_type   = bull;
    this.game        = game_code;
    this.game_name   = game_code.replace( "_", " " ).toUpperCase();
    if(       game_code == "count_up" || game_code == "big_bull" || game_code == "bull_shoot" ){
      this.score_mode      = "total_score";
      this.stats_type      = "PPD";
    }else if( game_code == "cr_count_up" ){
      this.score_mode      = "total_score";
      this.stats_type      = "MPR";
    }else if( game_code[0] == "z" ){
      var ivalue           = Number( game_code.substr(1) );
      this.game_name       = ivalue + " GAME";
      this.score_mode      = "zeroone";
      this.stats_type      = "PPD";
    }else if( game_code == "yamaguchi_a" ){
      this.game_name       = "山口練習法 1";
      this.score_mode      = "total_marks_percent";
      this.stats_type      = "MPR";
    }else if( game_code == "yamaguchi_b" ){
      this.game_name       = "山口練習法 2";
      this.score_mode      = "total_marks_percent";
      this.stats_type      = "MPR";
    }else if( game_code == "yamaguchi_c" ){
      this.game_name       = "山口練習法 3";
      this.score_mode      = "total_awards";
      this.stats_type      = "MPR";
    }
    this.current_player_idx = -1;
    this.players = [];
    for( var i = 0 ; i < this.num_players ; i++ ){
      var opt = options[i] || {};
      this.players.push( new Player(i, game_code, bull, opt) );
    }
  }

  change_player(){
    this.current_player_idx = ( this.current_player_idx + 1 ) % this.num_players;
    if( this.current_player_idx == 0 ) this.change_round();
  }

  change_round(){
    for( var i = 0 ; i < this.num_players ; i++ ){
      this.players[i].change_round();
    }
  }

  reverse_player(){
    var reversed = false;
    if( this.current_player.thrown_darts == 0 ){
      if( this.current_player.id == 0 ){
        if( this.current_round != 1 ){
          this.current_player.reverse();
          this.current_player_idx = this.num_players - 1;
          reversed = true;
        }
      }else{
        this.current_player_idx -= 1;
        reversed = true;
      }
    }
    return reversed ;
  }

  dart_unthrow(){
    var reversed = this.reverse_player();
    if( this.current_player.thrown_darts != 0 ){
      this.current_player.dart_unthrow();
      reversed = true;
    }
    return reversed;
  }

  get current_player(){ return this.players[this.current_player_idx]; }
  get current_round() { return this.current_player.current_round ; }
  get round_limit()   { return this.current_player.round_limit ; }

  get final_player()  { return ( this.current_player.id == ( this.num_players - 1 ) ); }
  get final_round()   { return ( this.current_round == this.round_limit ); }

  update( key )       { this.current_player.update( key ); }
  recalc()            { this.current_player.recalc(); }
  game_message()      { return this.current_player.game_message(); }

  is_top_score( player=this.current_player_idx ){
    var temp = [];
    for( var i = 0 ; i < this.num_players ; i++ ){
      temp.push( this.players[i].total_score );
    }
    var top_score = ( this.score_mode == "zeroone" ) ? Math.min(...temp) : Math.max(...temp) ;
    return ( this.players[player].total_score == top_score );
  }
}
