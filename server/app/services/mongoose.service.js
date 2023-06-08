const mongoose = require('mongoose');
require("dotenv").config();
const { MONGO_DB_URL } = process.env;
let count = 0;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};
const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect(MONGO_DB_URL, options).then(()=>{
        console.log('MongoDB is connected')
    }).catch(err=>{
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;