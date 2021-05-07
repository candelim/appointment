exports.insert = function (mess,topicName) {
	
	const logger = require('./logger.js');

	const kafka = require('kafka-node'),
		Producer = kafka.Producer,
		KeyedMessage = kafka.KeyedMessage,
		ip = process.env.IP_HOST,
		port = process.env.PORT_HOST,
	    	Client = kafka.KafkaClient,
    		client = new Client({
        			autoConnect: true,
        			kafkaHost: ip + ':' + port
    			}),
		producer = new Producer(client);

	var payloads = [
	   { topic: topicName, messages: mess, partition: 0 }
	];

	producer.on('ready', function () {
		producer.send(payloads, function (err, data) {
			//console.log(data);
			logger.write(data, 'info');
			producer.close();
		});
	});

	producer.on('error', function (err) {
		//console.log('Error');
		logger.write('Error en conexión a Kafka','error');
		producer.close();
	});

}