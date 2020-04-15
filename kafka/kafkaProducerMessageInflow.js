// This file will handle the communication to Kafka Nodes through Kafka Producer Service
// This will be the entrypoint for this application to send messages to kafka producer

const {producerInstance} = require("./kafkaProducerService");
module.exports ={
    sendData:(payloads)=>{
        try{
            // payloads = [{
            //     topic : "RESPONSE_FOR_JWT_VERIFICATION_FOR_BANKING_INSERT_DATA",
            //     messages : JSON.stringify({
            //         type : "INSERT_DATA",
            //         data : "deleted"
            //     })
            // }]
            producerInstance.sendData(payloads)
        }catch(e){
            console.log(e)
        }
    }
}