/**
 *Renders page asking for percentage inputs at date/time/space for database feedback
 */

exports.do_work = function(req, res){
	res.render('feedback.jade',
			   { title: "OpenDesk",
				 datepicker: req.query.datepicker,
				 timepicker: req.query.timepicker,
			     studySpace: req.query.studySpace,
			     date: req.query.date}
		  );
};