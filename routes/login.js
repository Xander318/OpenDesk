// Connect string to Oracle
var connectData = { 
  "hostname": "mydbinstance.c108hdfvnlhj.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "agoldma", 
  "password": "AcG1993!", 
  "database": "OPENDESK" };
var oracle =  require("oracle");

/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// userid = Name to query for
function query_db(req,res,datepicker,time,table) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    console.log(err);
    } else {
    var date = $(this).datepicker('getDate');
        var dayOfWeek = date.getUTCDay();
        var query = "";
        query += "SELECT O.OCCUPANCY, O.WEEKHOUR FROM OPENDESKDATA O WHERE O.SPACETYPE = 'Couch'"
        
        
        connection.execute(query, 
[], 
     function(err, results) {
              if ( err ) {
            console.log(err);
              }
        else {
          connection.close();
        res.render('signup.jade', { 
title: 'Prediction',
    datepicker: date,
    timepicker: time,
    table: table
});
        }});
    }
  });
}
        
        
        
        
        /*
        
        
        
        
        
  // selecting rows
  connection.execute("SELECT * FROM USERS U WHERE U.U_ID = " + "'" + userid + "'", 
     [], 
     function(err, results) {
      if ( err ) {
      console.log(err);
      } else {
      var bcrypt = require('bcrypt')
      var salt = bcrypt.genSaltSync(10);
// Hash the password with the salt
var hash = bcrypt.hashSync(password, salt) + "";
//determines if the hashes are equal or for legacy if DEFAULT_PASSWORD is used
var equalsPassword = bcrypt.compareSync(password, results[0].PASSWORD_HASH) ||
(password == "DEFAULT_PASSWORD" && results[0].PASSWORD_HASH == "DEFAULT_PASSWORD"); // true
//console.log(equalsPassword);
//console.log(bcrypt.compareSync("hello", hash));
      //if no query returned or wrong password
      if (results.length < 1 || !equalsPassword){
      connection.close();
     console.log("Wrong Username or Password");
     res.render('index.jade', { 
  title: 'Wrong Username or Password' 
  });
     }
     //else correct password
     else{
     //Saves the user. Nish said to do this though
     //thought it doesn't work.
     //note dont save results[0] since this is not done
     //in signup.js
     req.session.user = userid;
      connection.close(); // done with the connection
      //THIS IS WHERE YOU SHOULD CALL YOUR FUNCTION
      //YOU CAN REMOVE LINE OF CODE BELOW
      res.redirect('/newsfeed/');
      }
      }

  }); // end connection.execute
    }
  }); // end oracle.connect
}*/


/////
// This is what's called by the main app 
exports.do_work = function(req, res){
query_db(req,res,req.query.datepicker, req.query.timepicker, req.query.table);
};

exports.logout = function(req, res){
req.session.user = null;
res.redirect("/");
};