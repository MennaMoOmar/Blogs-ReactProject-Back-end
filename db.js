const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/newsDB",{
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