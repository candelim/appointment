exports.write = function (mess, loglevel) {

const winston = require('winston'),
	SplunkStreamEvent = require('winston-splunk-httplogger'),

// Create the logger
  var splunkSettings = {
    host: process.env.SPLUNK_HOST,
    token: process.env.SPLUNK_TOKEN,
    port: process.env.SPLUNK_PORT,
    path: process.env.SPLUNK_PATH,
    protocol: process.env.SPLUNK_PROTOCOL,
    level: process.env.LEVEL,
    source: process.env.SOURCE,
    sourcetype: process.env.SOURCETYPE,
    index: process.env.INDEX
  };

  const logConfiguration = {
    transports: [
      new winston.transports.Console(),
      new SplunkStreamEvent({ splunk: splunkSettings })		
    ]
  };

  const logger = winston.createLogger(logConfiguration);

  logger.log({
    level: loglevel,
    message: mess
  });

}