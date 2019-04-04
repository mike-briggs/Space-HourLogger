exports.validate = function(email,pswd){
    
    // true means invalid, so our conditions got reversed
    return {
        email: email.length === 0,
        password: pswd.length === 0,
      };
  }
