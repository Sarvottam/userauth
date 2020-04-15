const kafka = require('kafka-node');
const {kafka_server} = require("../config/constant")
const topicArray = require("./kafkaTopics")

class KafkaProducer {

    constructor() {
        try {
            if(!this.producer){
                console.log("Here initializing Producer ")
                const Producer = kafka.Producer;
                const client = new kafka.KafkaClient({ kafka_server: kafka_server, reconnectOnIdle: true, autoConnect: true });
                this.producer = new Producer(client,{requireAcks:1});
    
                let newTopicsArray = topicArray.map(data => {
                    return data.topic;
                })
                let _this = this;
                this.producer.on('ready', function (err) {
                    _this.producer.createTopics(newTopicsArray, true, (err, data) => {
                        console.log("data createTopics", data)
                        console.log("data err", err)
                    })
                });
                this.producer.on('error', function (err) {
                    console.log("error Producer", err);
                });
            }
        }
        catch (e) {
            console.log("Error in initializing Producer", e)
            // initializeProducer()
        }
    }

   async sendData(payloads) {
        try {
            if(!payloads){
                throw("payloads while sending data is empty ")
            }
            this.producer.on('ready', async function () {
                console.log('Kafka Producer is Ready');
            })

            this.producer.send(payloads, (err, data) => {
                if (err) {
                    throw("error while sending data ",err)
                } else {
                    console.log("data here after sending ", data)
                }
            });
        }
        catch (e) {
            console.log("kafkaProducerService Error in send ",e);
            let errorMessage =e.message? e.message:e
            throw (errorMessage)
        }
    }
}

module.exports ={producerInstance: new KafkaProducer()}