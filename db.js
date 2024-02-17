const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// //CODE FOR .env include
// const dotenv = require('dotenv')
// dotenv.config({path:__dirname+'/.env'});

// const MONGOURI ="mongodb://127.0.0.1:27017/iNotebook?directConnection=true"
const MONGOURI ="mongodb+srv://vishnunakade:qA8P5E4VaxwBmKWB@inotebook.wquvmsr.mongodb.net/?retryWrites=true&w=majority"

const connectToMongo = async() => {
    mongoose.connect(MONGOURI, () => {
        console.log("Connected to Mongoos Successfully");
    })
}
module.exports = connectToMongo;

