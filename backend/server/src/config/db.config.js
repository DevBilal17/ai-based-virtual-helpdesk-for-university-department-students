const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            dbName:"Virtual_Helpdesk"
        })
        console.log("Connected to MongoDB");
        mongoose.connection.on("connected",()=>{
            console.log("Connected to MongoDB");
        })
        mongoose.connection.on("error",(err)=>{
            console.error("Error connecting to MongoDB:", err);
            process.exit(1);
        })
    }    
    catch(error){
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

module.exports = connectDB;