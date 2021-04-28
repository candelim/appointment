const express = require('express'),
  app =  express(),
  request = require('request'),
  bodyParser= require('body-parser'),
  cookieParser = require('cookie-parser'),
  path = require("path"),
  mongoose = require('mongoose'),
  moment = require('moment'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json'),
  appointment = require('./models/appointment');

//const propPath = process.env.PROPPATH;
//const config = require(propPath);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const secret = process.env.USER + ":" + process.env.PASS,
	ip = process.env.IP,
	database = process.env.DATABASE,
	connstring = 'mongodb://' + secret + '@' + ip + '/' + database;

mongoose.connect(connstring, {useNewUrlParser: true}, function (error) {
  if (error) {
    console.log(error);
  }
  else {
    app.listen(8080, () => {
      console.log('listening on 8080')
    })
  }
});


app.post('/appointment', function(req, res, next) {
	console.log('Appointment created');
	var year = 2019,
	month = 11,
	day = 15;

	var options = {
          url: 'http://random-dates-alfa-project.apps.ocp4.labs.semperti.local/availableDates',
	  method: 'GET',
	};

	request(options, function (error, response, body) {
		console.log( 'startDateTime: ' + response.body);
		console.log( 'endDateTime: ' + response.body);
		validDate =  moment().format(response.body);
		console.log(validDate);
		var idparam = Math.floor(Math.random() * 100);
		data = {
			id: idparam, 
			href: "", 
			externalId: "", 
			category: "", 
			description: "Appointment " + idparam, 
			status: "initialized",
			creationDate: new Date(),
			lastUpdate: new Date(),
			validFor: { startDateTime: new Date(validDate), endDateTime: new Date(validDate)},
			baseType: "",
			type: "",
			schemaLocation: ""
		};

		appointment.updateOne({id: idparam}, data, {upsert: true}, function (err){
		  if (err) throw err;
		  //res.sendStatus(200);
		  res.json(data);
		});

	});
});

app.get('/appointment', function(req, res, next) {
  console.log('Appointment Get');
  appointment.find({}, function (err, data) { 
    if (err) throw err;
    res.json(data);
  })
  //res.sendStatus(200);
});


app.get('/appointment/:id', function(req,res, next){
	console.log('Appointment Get');
	appointment.find({id: req.params.id}, function (err, data) { 
		if (err) throw err;
		res.json(data);
  })
});

app.delete('/appointment/:id', function(req,res, next){
	console.log('Appointment deleted');
	appointment.deleteOne({id: req.params.id}, function (err, data) { 
    if (err) throw err;
    res.sendStatus(204);
  })
});

app.patch('/appointment/:id', function(req,res, next){
	console.log('Appointment patched');
	appointment.updateOne({id: req.params.id}, {status: 'cancelled'}, {upsert: true}, function (err){
		if (err) throw err;
		res.sendStatus(200);
		//res.json(data);
	});
});

app.get('/health', function(req,res, next){
	console.log('Service Status OK');
	res.sendStatus(200);
});
