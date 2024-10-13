import express from "express";
import routes from './routes/index.mjs';
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json())
app.use(cookieParser('secretpass'));
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get('/',(request,response) => {
    response.cookie('ssid','abcdefghijklmnopqrstuv',{maxAge:1000 * 10 ,signed:true})
    response.status(201).send({msg:'amine mokeddem'})
})

app.listen(PORT,() => {
    console.log(`Running on Port ${PORT}`);
})