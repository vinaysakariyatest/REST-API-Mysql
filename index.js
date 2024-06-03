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
app.use(express.static('public'));

const userRoute = require('./routes/user')
const postRoute = require('./routes/post')
const commentRoute = require('./routes/comment');
const authRoute = require('./routes/authRoute')
const adminRoute = require('./routes/admin')
const bloggerRoute = require('./routes/blogger');

app.use("/users",userRoute)
app.use("/post",postRoute)
app.use("/comment",commentRoute)
app.use('/',authRoute)
app.use('/admin',adminRoute)
app.use('/blogger',bloggerRoute)
// app.use(require('./routes/user'))

const PORT = process.env.PORT

app.listen(PORT,() => {
    console.log(`Server is running at PORT Number ${PORT}`)
})