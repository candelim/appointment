const express = require('express'),
  app =  express(),
  request = require('request'),
  bodyParser= require('body-parser'),
  cookieParser = require('cookie-parser'),
//  path = require("path"),
  mongoose = require('mongoose'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json'),
  appointment = require('./models/appointment'),
	kafka = require('./kafka.js'),
	logger = require('./logger.js');
//const propPath = process.env.PROPPATH;
//const config = require(propPath);
	topicName = process.env.TOPICNAME;

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
		logger.write('Error de conexión a mongodb', 'error')
  }
  else {
    app.listen(8080, () => {
			logger.write('listening on 8080','info');
    })
  }
});


app.post('/appointment', function(req, res, next) {
	logger.write('Appointment created','info');

	var options = {
          url: process.env.DATEURL,
	  method: 'GET',
	};

	request(options, function (error, response, body) {
		validDate = response.body.replace('"','').replace('"','');
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
		  kafka.insert('Apointment: ' + idparam, topicName);
			res.json(data);
		});

	});
});

app.get('/appointment', function(req, res, next) {
	logger.write('Appointment Get','info');
  appointment.find({}, function (err, data) { 
    if (err) throw err;
    res.json(data);
  })
});


app.get('/appointment/:id', function(req,res, next){
	logger.write('Appointment Get','info');

	appointment.find({id: req.params.id}, function (err, data) { 
		if (err) throw err;
		res.json(data);
  })
});

app.delete('/appointment/:id', function(req,res, next){
	logger.write('Appointment deleted','info');

	appointment.deleteOne({id: req.params.id}, function (err, data) { 
    if (err) throw err;
    res.sendStatus(204);
  })
});

app.patch('/appointment/:id', function(req,res, next){
	logger.write('Appointment patched','info');

	appointment.updateOne({id: req.params.id}, {status: 'cancelled'}, {upsert: true}, function (err){
		if (err) throw err;
		res.sendStatus(200);
	});
});

app.get('/health', function(req,res, next){
	logger.write('Service Status OK','info');

	res.sendStatus(200);
});
