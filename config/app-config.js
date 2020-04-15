/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const bodyParser = require('body-parser');
const cors = require('cors');
const ExpressConfigModule = require('./express-config');

const {middlewareHelper } = require("../utils/authMiddleware")

const { producerInstance} = require("../kafka/kafkaProducerService")
const { consumerInstace } = require("../kafka/kafkaConsumerService");
const {sendData} = require("../kafka/kafkaProducerMessageInflow");

class AppConfig {
  constructor(app) {
    process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);

      // application specific logging, throwing an error, or other logic here
    });
    this.app = app;
  }

  includeConfig() {
    this.loadAppLevelConfig();
    this.loadExpressConfig();
  }

  loadAppLevelConfig() {
    this.app.use(
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
    );
    this.app.use(
      cors(),
    );

    require("../responseHandler");
    this.app.use(async (req, res, next) => {
      if (req.headers['authorization']) {
        try {
          const accessToken = req.headers['authorization'];
          const {exp,email,role,userData} = await middlewareHelper(accessToken);
          // console.log("received message on appconfig",userData)

          // Check if token has expired
          if (exp < Date.now().valueOf() / 1000) {
            return _handleResponse(req, res, "JWT token has expired, please login to obtain a new one");
          }
          // const userData =  await Dbhelper.getDocumentByEmail(email)
          res.locals.loggedInUser = userData;
          next();
        } catch (e) {
          console.log("appconfig: Here is Error Object ", e.message)
          return _handleResponse(req, res, e);
        }
      } else {
        console.log("here in else part ");
        next();
      }
    });
    setTimeout(() => {
      // kafkaConsumerInstance.initializeConsumer()
      consumerInstace.startListenForTopics()
    }, 5000);

  }

  loadExpressConfig() {
    new ExpressConfigModule(this.app).setAppEngine();
  }
}
module.exports = AppConfig;
