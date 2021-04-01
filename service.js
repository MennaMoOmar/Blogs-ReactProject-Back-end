/* express */
const express = require ('express');
const port = 3001;
const app = express();
app.use(express.json())

/*import routers */
const userRouter = require('./router/user')

require('./db')

/* user */
app.use('/user', userRouter);

/* listenning on server */
app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})