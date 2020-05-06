function len( array, pat ){
  return array.filter(function(x){ return (x.indexOf(pat) != -1) }).length;
}

function sum(arr){
  return arr.reduce( function( prev, current, i, arr ) { return prev + current; });
}

function count( arr, value ){
  return arr.filter( function(x){ return x === value } ).length;
}

// -----------------------------------------------------------------
//  ScoreManager
// -----------------------------------------------------------------
class ScoreManager {
  constructor( n, category, game_code, bull="50_50" ){
    this.num_players = n ;
    this.bull_type   = bull;
    if(      game_code == "count_up" || game_code == "big_bull" || game_code == "bull_shoot" ){
      this.category       = "count_up" ;
      this.game           = game_code;
      this.game_name      = game_code.replace( "_", " " ).toUpperCase();
      this.round_limit    = 8;
      this.initial_score  = 0;
      this.top_score_type = "high";
      this.stats_name     = "PPD";
    }else if( game_code == "cr_count_up" ){
      this.category       = "count_up" ;
      this.game           = game_code;
      this.game_name      = game_code.replace( "_", " " ).toUpperCase();
      this.round_limit    = 8;
      this.initial_score  = 0;
      this.top_score_type = "high";
      this.target_for_rounds = { 1: "20", 2: "19", 3: "18", 4: "17", 5: "16", 6: "15", 7: "BULL" };
      this.stats_name     = "MPR";
    }else if( game_code[0] == "z" ){
      var ivalue = Number( game_code.substr(1) );
      var round_limits = { 301: 10, 501: 15, 701: 15, 901: 20, 1101: 20, 1501: 20 };
      this.category       = "zeroone" ;
      this.game           = "zeroone" ;
      this.game_name      = ivalue + " GAME";
      this.round_limit    = round_limits[ivalue];
      this.initial_score  = ivalue ;
      this.top_score_type = "low";
      this.stats_name     = "PPD";
    }
    this.cur_player  = -1;
    this._round_data = [];
    this._total_data = [];
    this.init_total_data();
  }

  change_player(){
    if( this._round_data.length != 0 ) this.update_awards();
    this.cur_player = ( this.cur_player + 1 ) % this.num_players;
    if( this.cur_player == 0 ) this.change_round();
  }

  change_round(){
    var temp = [];
    for( var i = 0 ; i < this.num_players ; i++ ){
      temp.push( this.initial_value_of_round_data );
    }
    this._round_data.push( temp );
  }

  reverse_player(){
    var reversed = false;
    if( this.thrown_darts == 0 ){
      if( this.current_player == 0 ){
        if( this.current_round != 1 ){
          this._round_data.pop();
          this.cur_player  = this.num_players - 1;
          reversed = true;
        }
      }else{
        this.cur_player -= 1;
        reversed = true;
      }
    }
    return reversed ;
  }

  dart_unthrow(){
    var reversed = this.reverse_player();
    if( this.thrown_darts != 0 ){
      this.current_round_data["areas"].pop();
      this.update_crdata();
      this.update_total_score();
      this.update_total_marks();
      this.update_total_stats();
      reversed = true;
    }
    return reversed;
  }

  init_total_data(){
    for( var i = 0 ; i < this.num_players ; i++ ){
      this._total_data.push( this.initial_value_of_total_data );
    }
  }

  update_awards(){
    var award = this.check_award( this.current_round_data );
    if( award ){
      if( !this._total_data[this.cur_player]["awards"][award] ){
        this._total_data[this.cur_player]["awards"][award] = 0;
      }
      this._total_data[this.cur_player]["awards"][award] += 1;
    }
  }

  update( key ){
    this.current_round_data["areas"].push( key );
    this.update_crdata();
    this.update_total_score();
    this.update_total_marks();
    this.update_total_stats();
    this.current_round_data["bust"] = this.is_bust_round ;
  }

  recalc(){
    this.update_crdata();
    this.update_total_score();
    this.update_total_marks();
    this.update_total_stats();
  }

  // 
  get thrown_darts()      { return this.current_round_data["areas"].length ; }
  get total_thrown_darts(){ return ( this.current_round - 1 ) * 3 + this.thrown_darts; }
  get current_round()     { return this._round_data.length; }
  get current_player()    { return this.cur_player; }
  get current_round_data(){ return this.round_data( this.current_round, this.current_player ); }
  get final_player()      { return ( this.current_player == ( this.num_players - 1 ) ); }
  get final_round()       { return ( this.current_round == this.round_limit ); }
  get initial_marks()     { return { "20": 0, "19": 0, "18": 0, "17": 0, "16": 0, "15": 0, "BULL": 0 }; }
  get initial_value_of_round_data(){
    return { "round": this.current_round + 1,
             "areas": [],
             "score": 0,
             "marks": this.initial_marks,
             "bust": false };
  }
  get initial_value_of_total_data(){
    return { "score": this.initial_score,
             "marks": this.initial_marks,
             "stats": 0,
             "awards": {} };
  }

  get current_marks(){
    var marks = [];
    for( var i = 0 ; i < 3 ; i++ ){
      var area = this.current_round_data["areas"][i];
      if( area && this.is_valid_throw( area, this.current_round ) ){
        marks.push( Area.to_mark_point( area ) );
      }else{
        marks.push( 0 );
      }
    }
    return marks;
  }

  // 
  total_score( player=this.cur_player ){ return this._total_data[player]["score"]; }
  total_stats( player=this.cur_player ){ return this._total_data[player]["stats"]; }
  total_marks( player=this.cur_player ){ return this._total_data[player]["marks"]; }
  total_awards( player=this.cur_player ){ return this._total_data[player]["awards"]; }
  round_data( round, player=this.cur_player ){ return this._round_data[round-1][player]; }

  is_valid_round( cr ){
    if( this.category == "zeroone" ){
      return ( cr["bust"] == false );
    }else{
      return true;
    }
  }

  is_valid_throw( area, round ){
    var valid;
    if( this.game == "cr_count_up" ){
      var target = this.target_for_rounds[round];
      valid = target ? Area.is( area, target ) : Area.is_cricket_number( area );
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
        if( this.is_valid_throw( cr["areas"][i], cr["round"] ) ){
          cr["score"] += this.area_to_score( cr["areas"][i] );
          if( Area.to_mark_key( cr["areas"][i] ) )
            cr["marks"][ Area.to_mark_key( cr["areas"][i] ) ] += Area.to_mark_point( cr["areas"][i] );
        }
      }
    }
  }

  sum_score(){
    var score = 0;
    for( var round = 1 ; round <= this.current_round ; round++ ){
      var rd = this.round_data( round, this.current_player );
      score += ( rd["bust"] == false ) ? rd["score"] : 0;
    }
    return score ;
  }

  update_total_score(){
    var total = this._total_data[this.cur_player];
    if( this.category == "count_up" ){
      total["score"] = this.initial_score + this.sum_score();
    }else if( this.category == "zeroone" ){
      total["score"] = this.initial_score - this.sum_score();
    }
  }

  sum_marks(){
    var marks = this.initial_marks ;
    for( var round = 1 ; round <= this.current_round ; round++ ){
      var rd = this.round_data( round, this.current_player );
      var keys = Object.keys(marks);
      for( var i = 0 ; i < keys.length ; i++ ){
        marks[keys[i]] += rd["marks"][keys[i]];
      }
    }
    return marks;
  }

  update_total_marks(){
    var total = this._total_data[this.cur_player];
    total["marks"] = this.sum_marks();
  }

  update_total_stats(){
    var total = this._total_data[this.cur_player];
    if( this.game == "cr_count_up" ){
      total["stats"] = ( this.total_thrown_darts == 0 ) ? 0
                     : ( parseFloat( sum( Object.values( this.sum_marks() ) ) ) / ( this.total_thrown_darts / 3 ) ).toFixed(2);
    }else{
      total["stats"] = ( this.total_thrown_darts == 0 ) ? 0
                     : ( parseFloat( this.sum_score() ) / this.total_thrown_darts ).toFixed(2);
    }
  }

  prediction( player=this.cur_player ){
    return ( this.total_thrown_darts == 0 ) ? 0 : Math.round( ( this.total_score() / this.total_thrown_darts ) * 3 * this.round_limit );
  }

  is_top_score( player=this.cur_player ){
    var temp = [];
    for( var i = 0 ; i < this.num_players ; i++ ){
      temp.push( this.total_score(i) );
    }
    var top_score = ( this.top_score_type == "high" ) ? Math.max(...temp) : Math.min(...temp) ;
    return ( this.total_score(player) == top_score );
  }

  get is_game_out(){
    var cond = false;
    cond = cond || ( ( this.category == "zeroone" ) && ( this.total_score() == 0 ) );
    // cond = cond || ( ( this.category == "cricket" ) && this.is_top_score() && this.is_all_marked() );
    return cond ;
  }

  get is_bust_round(){ return ( ( this.category == "zeroone" ) && ( this.total_score() < 0 ) ); }

  game_message(){
    if( this.game == "cr_count_up" ){
      var target = this.target_for_rounds[this.current_round];
      return target ? "THROW AT <strong>" + target + "</strong>" : "THROW AT ANY CRICKET NUMBERS";
    }else if( this.category == "count_up" ){
      return "SCORE PREDICTION <strong>" + this.prediction() + "</strong>";
    }else{
      return "";
    }
  }

  area_to_score( area ){
    var score;
    if( this.game == "big_bull" ){
      if(      Area.is_DB( area ) ) score = 70 ;
      else if( Area.is_SB( area ) ) score = 50 ;
      else if( Area.is_IS( area ) ) score = 50 ; // BIG BULL
      else if( Area.is_OS( area ) ) score = 1 * Area.to_number( area ) ;
      else if( Area.is_D( area )  ) score = 2 * Area.to_number( area ) ;
      else if( Area.is_T( area )  ) score = 3 * Area.to_number( area ) ;
    }else if( this.game == "bull_shoot" ){
      if(      Area.is_DB( area ) ) score = 50 ;
      else if( Area.is_SB( area ) ) score = 25 ;
      else                               score = 0;
    }else{
      var sepa = ( this.bull_type == "25_50" );
      sepa = sepa || this.game == "cr_count_up" ;
      sepa = sepa || this.category == "cricket" ;
      if(      Area.is_DB( area ) ) score = 50 ;
      else if( Area.is_SB( area ) ) score = sepa ? 25 : 50 ;
      else if( Area.is_IS( area ) ) score = 1 * Area.to_number( area ) ;
      else if( Area.is_OS( area ) ) score = 1 * Area.to_number( area ) ;
      else if( Area.is_D( area )  ) score = 2 * Area.to_number( area ) ;
      else if( Area.is_T( area )  ) score = 3 * Area.to_number( area ) ;
    }
    return score;
  }

  check_award( data = this.current_round_data ){
    var award_name = null;
    var d_bull_count = 0;
    var   bull_count = 0;

    if( this.game == "big_bull" ){
      d_bull_count = len( data["areas"], 'DB' ) + len( data["areas"], 'SB' );
        bull_count = d_bull_count + len( data["areas"], 'IS' );
    }else{
      d_bull_count = len( data["areas"], 'DB' );
        bull_count = len( data["areas"], 'DB' ) + len( data["areas"], 'SB' );
    }

    if( data["bust"] == false ){
      if( d_bull_count == 3 )                                   { award_name = "black"; }
      else if( bull_count == 3 )                                { award_name = "hattrick"; }
      else if( data["score"] == 180 )                           { award_name = "ton80"; }
      else if( this.game == "cr_count_up" )
      {
        if(      count( Object.values( data["marks"] ), 3 ) == 3 ){ award_name = "whitehorse"; }
        else if( count( Object.values( data["marks"] ), 9 ) == 1 ){ award_name = "bed"; }
        else if( sum( Object.values( data["marks"] ) ) == 9 )     { award_name = "9mark"; }
        else if( sum( Object.values( data["marks"] ) ) == 8 )     { award_name = "8mark"; }
        else if( sum( Object.values( data["marks"] ) ) == 7 )     { award_name = "7mark"; }
        else if( sum( Object.values( data["marks"] ) ) == 6 )     { award_name = "6mark"; }
        else if( sum( Object.values( data["marks"] ) ) == 5 )     { award_name = "5mark"; }
      }
      else if( data["score"] >  150 )                           { award_name = "highton"; }
      else if( data["score"] >= 100 )                           { award_name = "lowton"; }
    }

    return award_name;
  }
}
