const kafka = require('kafka-node');
const { kafka_server } = require("../config/constant")
const { processEventData } = require("./kafkaConsumerMessageOutflow")
const topicArray = require("./kafkaTopics")

class KafkaConsumer {
  constructor() {
    try {
      if (!this.consumer) {
        const Consumer = kafka.Consumer;
        const client = new kafka.KafkaClient();
        if (topicArray && topicArray.length > 0) {
          this.consumer = new Consumer(client, topicArray,
            {
              autoCommit: true,
              fetchMaxWaitMs: 1000,
              fetchMaxBytes: 1024 * 1024,
              encoding: 'utf8',
              fromOffset: false
            }
          );
          // let newTopicsArray = topicArray.map(data=>{
          //         return data.topic;
          //     })
          // this.consumer.addTopics(newTopicsArray,(err,data)=>{
          //   console.log("data  ",data)
          //   console.log("err  ",err)
          // })

          this.consumer.on('error', function (err) {
            console.log('error consumer', err);
          });
          // [{ topic: 'feed-service', partition: 0 }]
        }
      }
    } catch (e) {
      console.log("Heres error ", e)
    }
  }

  consumerReady(){ 
    return new Promise((resolve, reject) => {
      resolve(this.consumer);
    // this.consumer.on('ready', () => {
    //   console.log('consumer ready');
    //   resolve(this.consumer);
    // });
  });
}

  startListenForTopics() {
    try {
      console.log(" startListenForTopics 111 ")
      if (this.consumer) {
        console.log("startListenForTopics ")
        // this.consumer.on('message', async function (message) {
        //   // const consumerdata = JSON.parse(message.value);
        //   console.log("received  ===>", message);
        //   return processEventData(message)
        // });
      } else {
        this.initializeConsumer()
      }
    }
    catch (e) {
      console.log(e);
    }
  }
}

module.exports = { consumerInstace: new KafkaConsumer() }