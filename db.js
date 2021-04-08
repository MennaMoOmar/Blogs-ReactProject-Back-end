const mongoose = require('mongoose')
const {mongoURI} = require('./config')

mongoose.connect(mongoURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log("connected succesfully")
})
.catch((err)=>{
    console.log(err)
    process.exit(1)
})

// MOMGO_URI = "mongodb+srv://menna:123@cluster0.4dkru.mongodb.net/newsDB?retryWrites=true&w=majority" || "mongodb://localhost:27017/newsDB"