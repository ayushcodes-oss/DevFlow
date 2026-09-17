const mongoose = require("mongoose");

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mangoooo DB Successfully");
  }catch(error){
    console.error("MONGODB connectiom error",error.message);
    process.exit(1);
  }
};

module.exports = connectDB;