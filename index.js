const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');

require("dotenv").config()

const app = express();
app.use(bodyParser.json());
app.use(express.json({}));
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.set('views','./views')

const userRoute = require('./routes/user')
const postRoute = require('./routes/post')
const commentRoute = require('./routes/comment');
const catRoute = require('./routes/category')
const authRoute = require('./routes/authRoute')

app.use("/users",userRoute)
app.use("/post",postRoute)
app.use("/comment",commentRoute)
app.use('/category',catRoute)
app.use('/',authRoute)
// app.use(require('./routes/user'))

const PORT = process.env.PORT

app.listen(PORT,() => {
    console.log(`Seerver is running at PORT Number ${PORT}`)
})