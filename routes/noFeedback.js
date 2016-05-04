/**
 * Adds datapoint back into database based on noFeedback loop
 */

var connectData = {
    "hostname": "mydbinstance.c108hdfvnlhj.us-east-1.rds.amazonaws.com",
    "port": 1521,
    "user": "agoldma",
    "password": "AcG1993!",
    "database": "OPENDESK" };
var oracle =  require("oracle");

function addDataPoint(req,res,date,occupancy,studySpace){
    console.log(date);
    console.log(occupancy);

    var dateObj = new Date(date);

    var dateClass = dateObj.getUTCDay();
    if (dateClass==0){dateClass=7;}
    var weekHour = (((dateObj.getUTCDay()+6) % 7) * 24)+(dateObj.getUTCHours())+(dateObj.getUTCMinutes()/60);

    oracle.connect(connectData, function(err, connection) {
            if ( err ) {
                console.log(err);
            } else {
                var insertQuery = "";
                insertQuery += "INSERT INTO OPENDESKDATA (DAYCLASSIFICATION, WEEKHOUR, SPACETYPE, OCCUPANCY, DATESTAMP) VALUES (" +
                    dateClass+ ", "+ weekHour + ", '" + studySpace + "', " + occupancy + ", '" + date + "')";

                connection.setAutoCommit(true);
                connection.execute(insertQuery, [], function(err, result) {
                        if ( err ) {
                            console.log(err);
                        } else {
                            connection.close();
                        }
                    });
            }
        });
}






exports.do_work = function(req, res){
    addDataPoint(req,res,req.query.date,1,req.query.studySpace)
    res.render('index.jade',
        { title: "OpenDesk",
	});
};
