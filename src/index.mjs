import express from "express";
import routes from './routes/index.mjs';
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import './strategies/local-strategy.mjs';
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const app = express();

mongoose.connect('mongodb://localhost/expressdb')
    .then(() => console.log('DB connect'))
    .catch((err) => console.log(`Error : ${err}`))

app.use(express.json())
app.use(cookieParser('secretpass'));
app.use(session({
    secret:'amine web dev',
    saveUninitialized:true,
    resave:true,
    cookie:{
        maxAge:1000 * 60 * 60,
    },
    store:MongoStore.create({
        client:mongoose.connection.getClient()
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post('/api/auth',passport.authenticate('local'),(request,response) => {
    response.sendStatus(200);
})

app.get('/api/auth/status',(request,response) => {
    console.log(`Inside /auth/status endpoint`);
    console.log(request.user);
    console.log(request.session);
    console.log(request.sessionID);
    return request.user ? response.send(request.user) : response.sendStatus(401);
})
app.post('/api/auth/logout',(request,response) => {
    if(!request.user)
        return response.sendStatus(401);
    request.logout((err) => {
        if(err) return response.sendStatus(400);
        response.send(200);
    })
})

const PORT = process.env.PORT || 3000;

app.get('/',(request,response) => {
    response.status(201).send({msg:'amine mokeddem'})
})

app.listen(PORT,() => {
    console.log(`Running on Port ${PORT}`);
})