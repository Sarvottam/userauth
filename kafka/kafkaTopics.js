module.exports = [{
    "topic":"INSERT_DATA",
    "partition": 0 
},{
    "topic":"RESPONSE_FOR_JWT_VERIFICATION_FOR_BANKING_INSERT",
    "partition": 0 
},
]
//If you omit the partition key for a message, it will default to partition 0. 
//If you have only one partition, then the Producer and HighLevelProducer are doing the same thing.

// module.exports = [{
//     "topic":"INSERT_DATA",
//     "partition": 0 
// },{
//     "topic":"UPDATE_DATA",
//     "partition": 0 
// },{
//     "topic":"DELETE_DATA",
//     "partition": 0 
// }
// ]