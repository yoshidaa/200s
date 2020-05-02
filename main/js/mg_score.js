function len( array, pat ){
  return array.filter(function(x){ return (x.indexOf(pat) != -1) }).length;
}

// -----------------------------------------------------------------
//  ScoreManager
// -----------------------------------------------------------------
class ScoreManager {
  constructor( n, category, game_type, bull="50_50" ){
    this.num_players = n ;
    this.bull_type   = bull;
    this.category    = category;
    if(      game_type == "count_up" ){
      this.game_type = game_type;
      this.game_name = "COUNT UP";
      this.round_limit = 8;
    }else if( game_type == "big_bull" ){
      this.game_type = game_type;
      this.game_name = "BIG BULL";
      this.round_limit = 8;
    }else if( game_type == "bull_shoot" ){
      this.game_type = game_type;
      this.game_name = "BULL SHOOT";
      this.round_limit = 8;
    }else if( game_type[0] == "z" ){
      this.game_type = category ;
      var ivalue = Number( game_type.substr(1) );
      this.game_name = ivalue + " GAME";
      if(      ivalue == 301 ){ this.round_limit = 10 ; }
      else if( ivalue == 501 ){ this.round_limit = 15 ; }
      else if( ivalue == 701 ){ this.round_limit = 15 ; }
      else if( ivalue == 901 ){ this.round_limit = 20 ; }
      else if( ivalue == 1101 ){ this.round_limit = 20 ; }
      else if( ivalue == 1501 ){ this.round_limit = 20 ; }
    }
    this.cur_player  = -1;
    this._round_data = [];
    this._total_data = [];
    this.init_total_data();
  }

  get_score( area ){
    if( ( this.game_type == "count_up" || this.game_type == "zeroone" ) ){
      if( area == "DB" ){ return 50 ; }
      else if( area == "SB" ){ return ( ( this.bull_type == "50_50" ) ? 50 : 25 ); }
      else if( area[0] == "T" ){ return 3 * Number( area.substr( 1, 2 ) ); }
      else if( area[0] == "D" ){ return 2 * Number( area.substr( 1, 2 ) ); }
      else { return Number( area.substr( 2, 2 ) ); }
    }else if( this.game_type == "big_bull" ){
      if( area == "DB" ){ return 70 ; }
      else if( area == "SB" ){ return 50 ; }
      else if( area[0] == "I" ){ return 50 ; }
      else if( area[0] == "T" ){ return 3 * Number( area.substr( 1, 2 ) ); }
      else if( area[0] == "D" ){ return 2 * Number( area.substr( 1, 2 ) ); }
      else { return Number( area.substr( 2, 2 ) ); }
    }else if( this.game_type == "bull_shoot" ){
      if( area == "DB" ){ return 50 ; }
      else if( area == "SB" ){ return 25 ; }
      else { return 0; }
    }
  }

  init_total_data(){
    for( var i = 0 ; i < this.num_players ; i++ ){
      this._total_data.push( this.initial_value_of_total_data );
    }
  }

  update_crdata(){
    var cr = this.current_round_data;
    cr["score"] = 0;
    for( var i = 0 ; i < this.thrown_darts ; i++ ){
      if( cr["bust"] == false ){
        cr["score"] += this.get_score( cr["areas"][i], this.bull );
      }
    }
  }

  update_total_data(){
    this._total_data[this.cur_player]["score"] = this.initial_value_of_total_score;
    var sum_score = 0;
    for( var i = 1 ; i <= this.current_round ; i++ ){
      var rd = this.round_data( i, this.current_player );
      if( rd["bust"] == false ){
        sum_score += rd["score"];
      }
    }

    if( this.game_type == "count_up" || this.game_type == "big_bull" || this.game_type == "bull_shoot" ){
      this._total_data[this.cur_player]["score"] += sum_score;
    }else if( this.game_type == "zeroone" ){
      this._total_data[this.cur_player]["score"] -= sum_score;
    }

    var num_darts = ( this.current_round - 1 ) * 3 + this.thrown_darts;
    this._total_data[this.cur_player]["stats"] = ( num_darts == 0 ) ? 0 : ( parseFloat( sum_score ) / num_darts ).toFixed(2);
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
    this.update_total_data();
    this.current_round_data["bust"] = this.is_bust_round ;
  }

  recalc(){
    this.update_crdata();
    this.update_total_data();
  }

  get thrown_darts(){
    var crdata = this.current_round_data;
    return crdata["areas"].length ;
  }

  get current_round(){
    return this._round_data.length;
  }

  get current_player(){
    return this.cur_player;
  }

  get current_round_data(){
    return this.round_data( this.current_round, this.current_player );
  }

  get final_player(){
    return ( this.current_player == ( this.num_players - 1 ) );
  }

  get final_round(){
    return ( this.current_round == this.round_limit );
  }

  get initial_value_of_round_data(){
    var ret ;
    if( this.game_type == "count_up" || this.game_type == "big_bull" || this.game_type == "bull_shoot" || this.game_type == "zeroone" ){
      ret = { "areas": [], "score": 0, "bust": false };
    }
    return ret;
  }

  get initial_value_of_total_score(){
    var ret;
    if( this.game_type == "count_up" || this.game_type == "big_bull" || this.game_type == "bull_shoot" ){
      ret = 0;
    }else if( this.game_type == "zeroone" ){
      ret = Number( this.game_name.substr(0,4) );
    }

    return ret;
  }

  get initial_value_of_total_data(){
    var ret = { "score": this.initial_value_of_total_score, "stats": 0, "awards": {} };
    return ret;
  }

  is_top_score( player=this.cur_player ){
    var temp = [];
    for( var i = 0 ; i < this.num_players ; i++ ){
      temp.push( this.total_score(i) );
    }
    if( this.game_type == "count_up" || this.game_type == "big_bull" || this.game_type == "bull_shoot" ){
      return ( this.total_score(player) == Math.max(...temp) );
    }else if( this.game_type == "zeroone" ){
      return ( this.total_score(player) == Math.min(...temp) );
    }
  }

  get is_game_out(){
    if( this.game_type == "zeroone" ){
      return this.total_score() == 0 ;
    }else{
      return false ;
    }
  }

  get is_bust_round(){
    if( this.game_type == "zeroone" ){
      return this.total_score() < 0 ;
    }else{
      return false ;
    }
  }

  total_score( player=this.cur_player ){
    return this._total_data[player]["score"];
  }

  total_stats( player=this.cur_player ){
    return this._total_data[player]["stats"];
  }

  total_awards( player=this.cur_player ){
    return this._total_data[player]["awards"];
  }

  round_data( round, player=this.cur_player ){
    return this._round_data[round-1][player];
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
      this.update_total_data();
      reversed = true;
    }

    return reversed;
  }

  check_award( data = this.current_round_data ){
    var award_name = null;
    var d_bull_count = 0;
    var   bull_count = 0;

    if( this.game_type == "count_up" || this.game_type == "bull_shoot" || this.game_type == "zeroone" ){
      d_bull_count = len( data["areas"], 'DB' );
        bull_count = len( data["areas"], 'DB' ) + len( data["areas"], 'SB' );
    }else if( this.game_type == "big_bull" ){
      d_bull_count = len( data["areas"], 'DB' ) + len( data["areas"], 'SB' );
        bull_count = d_bull_count + len( data["areas"], 'IS' );
    }

    if( data["bust"] == false ){
      if( d_bull_count == 3 ){         award_name = "black"; }
      else if( bull_count == 3 ){      award_name = "hattrick"; }
      else if( data["score"] == 180 ){ award_name = "ton80"; }
      else if( data["score"] >  150 ){ award_name = "highton"; }
      else if( data["score"] >= 100 ){ award_name = "lowton"; }
    }

    return award_name;
  }
}
