var sleep = function(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

class Test {
  constructor( vec ){
    var url         = "/dartslive200s/main/index.html?";
    this.num_players = vec["darts"].length;
    var params      = [ "players=" + this.num_players ];
    for( let k in vec["params"] ){
      params.push( k + "=" + vec["params"][k] );
    }
    document.main.location = url + params.join("&");
    this.main = document.main;
    this.darts = vec["darts"];
    this.exps  = vec["exps"];
  }

  async initialize(){
    await sleep(2000);
    (await this.wait_shown("board_main"));

    // override methods
    this.main.sleep              = function(ms){ return new Promise(resolve => setTimeout(resolve, 1)); }
    this.main.board_mg.slide_in  = function(target_id){ document.main.y.show(target_id); }
    this.main.board_mg.slide_out = function(target_id){ document.main.y.hide(target_id); }
    this.main.board_mg.display_mark_award = function(){
      Y.show("board_nmark");
      Y.hide("board_nmark");
      document.main.system_mg.stop_award();
    }
    this.sleep_per_throw = 80;
    this.sleep_before_ch = 200;
    this.sleep_after_ch  = 80;
    return true;
  }

  send_key( key ){
    this.main.system_mg.input_handling( key );
  }

  async forward_round( keys ){
    var s = [];
    for( let k in keys ){
      this.send_key(keys[k]);
      s.push( await sleep(this.sleep_per_throw) );
    }
    s.push( await sleep(this.sleep_before_ch) );
    this.send_key("CH");
    s.push( await sleep(this.sleep_after_ch) );

    return Promise.all( s );
  }

  async forward_game( keys_array ){
    var s = []
    for( let k in keys_array ){
      s.push( await this.forward_round( keys_array[k] ) );
    }
    return s;
  }

  async wait_shown( id ){
    var timeout_count = 200; // 20s for timeout
    while( !this.main.y.is_shown(id) && timeout_count > 0 ){
      await sleep(100);
      timeout_count -= 1;
    }
    if( timeout_count == 0 ){
      console.log("[Error] wait_shown Timeout. (" + id + ")");
    }
    return !(timeout_count == 0);
  }

  check_result( id, rhash ){
    var player = id + 1;
    var cond = true;
    var local_cond;
    var errors = [];
    for( let key in rhash ){
      try{
        var val_id = "result_player"+player+key;
        var value  = this.main.y.id(val_id).innerHTML;
      }catch(e){
        errors.push("[Error] Invalid Key for \"" + key + "\" (" + val_id + ")");
        return { "result": false, "errors": errors };
      }
      var exp;
      if( key == "awards" ){
        var dut = [];
        for( let a in rhash["awards"] ){
          dut.push( this.main.g.awards[a] + "=" + rhash["awards"][a] );
        }
        exp   = dut;
        value = value.split("<br>").map( function(e){ return e.split("&nbsp;&nbsp;").join("=") } );
        local_cond = (value.join(", ") == exp.join(", "));
        cond = cond && local_cond;
        if( !local_cond ){
          var exp_str = exp.filter(i => value.indexOf(i) == -1)
          var val_str = value.filter(i => exp.indexOf(i) == -1)
          errors.push("  - [DIFF(" + id + ")] result(" + key + ") is differ from exp.\n" +
                      "              { exp: " + exp_str + ", dut: " + val_str + " }");
        }
      }else{
        exp   = rhash[key];
        local_cond = (value == exp);
        cond = cond && local_cond;
        if( !local_cond ){
          errors.push("  - [DIFF(" + id + ")] result(" + key + ") is differ from exp.\n" +
                      "              { exp: " + exp + ", dut: " + value + " }");
        }
      }
    }

    return { "result": cond, "errors": errors };
  }

  async test_game(){
    var result = true;
    var s = [];
    var errors = [];

    for( var r = 0 ; r < this.darts[0].length ; r++ ){
      for( var p = 0 ; p < this.num_players ; p++ ){
        s.push( await this.forward_round( this.darts[p][r] ) );
      }
    }
    await Promise.all( await s );

    await this.wait_shown("board_result");

    for( var p = 0 ; p < this.num_players ; p++ ){
      var check = this.check_result( p, this.exps["result"][p] );
      result = result && check["result"];
      errors = errors.concat( check["errors"] )
    }

    return { "result": result, "errors": errors };
  }
}

window.onload = async function(){
  for( let v in vecs ){
    test  = new Test( vecs[v] );
    await test.initialize();
    check = await test.test_game();
    console.log( "[vec:" + v + "] " + (check["result"] ? "OK" : "NG") );
    if( !check["result"] ){
      console.log(check["errors"].join("\n"));
    }
  }
}
