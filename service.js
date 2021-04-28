const {port} = require('./config')

/* express */
const express = require ('express');
const app = express();
app.use(express.json())

/* CORS */
const cors = require('cors')
app.use(cors())

/*express-async-errores*/
require('express-async-errors')

/*import routers */
const userRouter = require('./router/user')
const postRouter = require('./router/post')
const imageRouter = require('./router/image')

require('./db')

/* user */
app.use('/user', userRouter);

/* post */
app.use('/post', postRouter);

/* image */
app.use('/image', imageRouter);

/* listenning on server */
app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})