exports.write = function (mess, loglevel) {

const winston = require('winston'),
	SplunkStreamEvent = require('winston-splunk-httplogger');

// Create the logger
  var splunkSettings = {
    host: process.env.SPLUNK_HOST,
    token: process.env.SPLUNK_TOKEN,
    port: process.env.SPLUNK_PORT,
    path: process.env.SPLUNK_PATH,
    protocol: process.env.SPLUNK_PROTOCOL,
    source: process.env.SOURCE,
    sourcetype: process.env.SOURCETYPE,
    index: process.env.INDEX
  };

  const logConfiguration = {
    level: process.env.LEVEL,
    transports: [
      new winston.transports.Console(),
      new SplunkStreamEvent({ splunk: splunkSettings, level: process.env.LEVEL })		
    ]
  };

  const logger = winston.createLogger(logConfiguration);

  logger.log({
    level: loglevel,
    message: mess
  });

}