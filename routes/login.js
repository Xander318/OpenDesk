/**
 * Queries database for relevant results, pass to Python script, generate prediction
 */

// Connect string to Oracle                                                                        
var connectData = {
    "hostname": "mydbinstance.c108hdfvnlhj.us-east-1.rds.amazonaws.com",
    "port": 1521,
    "user": "agoldma",
    "password": "AcG1993!",
    "database": "OPENDESK" };
var oracle =  require("oracle");
var sk = require("scikit-node");
var zerorpc = require("zerorpc");
var client = new zerorpc.Client();

/////                                                                                              
// Query the oracle database, and call output_actors on the results                                
//                                                                                                 
// res = HTTP result object sent back to the client                                                
// userid = Name to query for                                                                      
function query_db(req,res,datepicker,date,timepicker,time,table) {
    if(datepicker&&timepicker){
    var dateArr = datepicker.split("-");
    var timeArr = timepicker.split(":");
    if(timeArr[1].substring(2,3) == "p"&&timeArr[0]!="12"){
	timeArr[0] = (parseInt(timeArr[0], 10) + 12).toString();}
    else{
	if(timeArr[0]=="12"){timeArr[0]="00";}
    }

    //String parsing to figure out user input date/time from datepicker/timepicker
    timeArr[1] = timeArr[1].substring(0, 2);
    var date = new Date(dateArr[0], parseInt(dateArr[1])-1, dateArr[2], timeArr[0], timeArr[1], 0, 0);
    var toPredictFor = (((date.getUTCDay()+6) % 7) * 24)+parseInt(timeArr[0], 10)+(parseInt(timeArr[1], 10))/60;
    toPredictFor = (toPredictFor+24)%168;
	oracle.connect(connectData, function(err, connection) {
		if ( err ) {
		    console.log(err);
		} else {

			//get timestamps from DB
		    var timeQuery = "";
		    timeQuery += "SELECT O.WEEKHOUR FROM OPENDESKDATA O WHERE O.SPACETYPE = '" + table + "'";
        
		    connection.execute(timeQuery, [], function(err, xTimeData) {
			    if ( err ) {
				console.log(err);
			    } else {

			    //get occupancies from DB
				var occQuery  = "";
				occQuery += "SELECT O.OCCUPANCY FROM OPENDESKDATA O WHERE O.SPACETYPE = '" + table + "'";
    
		    connection.execute(occQuery, [], function(err, yOccData) {
			    if (err) {
				console.log(err);
			    } else {
       				connection.close();
				
				//convert DB results to Python handleable objects
				var newXArr = [];
				var i = 0;
				for (var i = 0; i < xTimeData.length; i++) {
				    newXArr[i] = xTimeData[i].WEEKHOUR
				}
				
				var JSONx = {};
				JSONx.wh = newXArr;
				
				var newYArr = [];
				var j = 0;
				for (var j = 0; j < yOccData.length; j++) {
				    newYArr[j] = yOccData[j].OCCUPANCY
				}
				
				var JSONy = {};
				JSONy.occ = newYArr;

				//Pass DB results to Python Script, get back results and render prediction page
				client.connect("tcp://127.0.0.1:4242");
				client.invoke("predict", JSONx.wh, JSONy.occ, toPredictFor, function(err, result, more){
					if(err){console.log(err);}
					console.log(result);
					res.render('predict.jade', {
						title: 'Prediction',
						datepicker: datepicker,
						sklearnResults: result.toPrecision(3),                 
					        timepicker: timepicker,
						    table: table,
						    date: date
				       });
			       });
			    }
			});
			    }
			});
		}
	    });
    } else {
	res.redirect("/");
    }
}
                                                                                         
// This is what's called by the main app                                                           
exports.do_work = function(req, res){
    query_db(req,res,req.query.datepicker, 0, req.query.timepicker, 0,  req.query.table);
};

exports.logout = function(req, res){
    req.session.user = null;
    res.redirect("/");
};

