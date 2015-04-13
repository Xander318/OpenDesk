exports.do_work = function(req, res){
	res.render('thankyou.jade',
			   { title: "OpenDesk",
				 datepicker: req.query.datepicker,
				 timepicker: req.query.timepicker,
				 studySpace: req.query.studySpace}
		  );
};