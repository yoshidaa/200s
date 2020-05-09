class Area{
  static to_number_str( area ){ return area.substr( -2, 2 ); }
  static to_number( area ){ return Number( Area.to_number_str( area ) ); }
  static is( area, target ){
    if( isNaN(Number(target)) == false ){ return ( Area.to_number( area ) == Number( target ) ); }
    else if( target == "BULL" )         { return Area.is_BULL( area ); }
    else{ throw Area.constructor.name + ": invalid target (" + target + ")"; }
  }

  static is_cricket_number( area ){
    var cricket_numbers = [ "20", "19", "18", "17", "16", "15", "BULL" ];
    return cricket_numbers.some( function(e){ return Area.is( area, e ) } );
  }

  static to_mark_key( area ){
    if( !Area.is_cricket_number( area ) ){
      return false;
    }else{
      return Area.is_BULL( area ) ? "BULL" : Area.to_number_str( area );
    }
  }

  static to_mark_point( area ){
    if( !Area.is_cricket_number( area ) ){
      return 0;
    }else{
      return Area.is_SB( area ) ? 1 :
             Area.is_DB( area ) ? 2 :
             Area.is_T( area )  ? 3 :
             Area.is_D( area )  ? 2 :
             Area.is_S( area )  ? 1 : 0;
    }
  }

  static to_score( area, game, stats_type, bull_type ){
    var score;
    if( game == "big_bull" ){
      if(      Area.is_DB( area ) ) score = 70 ;
      else if( Area.is_SB( area ) ) score = 50 ;
      else if( Area.is_IS( area ) ) score = 50 ; // BIG BULL
      else if( Area.is_OS( area ) ) score = 1 * Area.to_number( area ) ;
      else if( Area.is_D( area )  ) score = 2 * Area.to_number( area ) ;
      else if( Area.is_T( area )  ) score = 3 * Area.to_number( area ) ;
    }else if( game == "bull_shoot" ){
      if(      Area.is_DB( area ) ) score = 50 ;
      else if( Area.is_SB( area ) ) score = 25 ;
      else                               score = 0;
    }else{
      var sepa = ( bull_type == "25_50" ) || ( stats_type == "MPR" );
      if(      Area.is_DB( area ) ) score = 50 ;
      else if( Area.is_SB( area ) ) score = sepa ? 25 : 50 ;
      else if( Area.is_IS( area ) ) score = 1 * Area.to_number( area ) ;
      else if( Area.is_OS( area ) ) score = 1 * Area.to_number( area ) ;
      else if( Area.is_D( area )  ) score = 2 * Area.to_number( area ) ;
      else if( Area.is_T( area )  ) score = 3 * Area.to_number( area ) ;
    }
    return score;
  }

  static is_IS( area )  { return area[0] == "I"; }
  static is_OS( area )  { return area[0] == "O"; }
  static is_S( area )   { return Area.is_IS( area ) || Area.is_OS( area ); }
  static is_D( area )   { return area[0] == "D" && area != "DB" ; }
  static is_T( area )   { return area[0] == "T"; }
  static is_SB( area )  { return area    == "SB"; }
  static is_DB( area )  { return area    == "DB"; }
  static is_BULL( area ){ return Area.is_SB( area ) || Area.is_DB( area ); }
}
