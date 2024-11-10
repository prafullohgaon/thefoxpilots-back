const mongoose = require("mongoose")

const mondbUrl="mongodb+srv://ronanpraful:YVAh1DDwgC03V0wT@cluster0.8qthz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDb=()=>{
    return mongoose.connect(mondbUrl)
}
module.exports={connectDb}