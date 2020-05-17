String.prototype.paddingleft = function(char,n){
 var leftval = "";
 for(;leftval.length < n;leftval+=char);
 return (leftval+this.toString()).slice(-n);
}

class Y {
  static id(id)        { return document.getElementById(id); }

  static is_shown(id)  { return this.id(id).style.visibility == "visible"; }
  static show(id)      { this.id(id).style.visibility = "visible"; }
  static hide(id)      { this.id(id).style.visibility = "hidden";  }

  static tag( tag, opts={} ){
    var opt_str = "";
    for(let o in opts){
      opt_str += " " + o + "=\"" + opts[o] + "\"";
    }
    return "<" + tag + opt_str + ">";
  }

  static enctag( tag, value, opts={} ){
    return this.tag( tag, opts ) + value + "</" + tag + ">";
  }

  static t_img( path, opts={} )   { opts["src"] = path; return Y.tag( "img", opts ); }
  static t_span( value, opts={} ) { return Y.enctag( "span", value, opts ); }

  static addend_decomposition( t, s ){
    var result = [];
    for( var i = 0 ; i < Math.floor( t / s ) ; i++ ){
      result.push( s );
    }
    if( t % s != 0 ){
      result.push( t % s );
    }
    return result;
  }
}
