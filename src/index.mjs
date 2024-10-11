import express from "express";

const app = express();

app.use(express.json())

const loggingMiddleware = (request,response,next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}

app.use(loggingMiddleware); 

const resolveIndexByUserId = (request,response,next) => {
    const {params:{id}} = request;
    const theId = parseInt(id);
    if(isNaN(theId))
        return response.sendStatus(400);
    const indexUser = users.findIndex((user) => user.id === theId)
    if(indexUser == -1)
        return response.sendStatus(404)
    request.indexUser = indexUser;
    next();
}

const PORT = process.env.PORT || 3000;

const users = [
    {id:1,username:'aminemokeddem'},
    {id:2,username:'mohammed'},
    {id:3,username:'nouri'}
];

app.get('/',loggingMiddleware,(request,response) => {
    response.status(201).send({msg:'amine mokeddem'})
})

app.get('/api/users',(request,response) => {
    const {query:{filter,value}} = request;
    if(filter && value){
        return response.send(
            users.filter((user) =>  user[filter].includes(value))
        )
    }
   return response.status(201).send(users)
})

app.post('/api/users',(request, response) => {
    const {body} = request;
    const newUser = {id:users[users.length -1].id + 1, ...body}
    users.push(newUser);
    return response.status(201).send(newUser);
})

app.get('/api/users/:id',resolveIndexByUserId,(request,response) => {
    const {indexUser} = request;
    const getUser = users[indexUser];
    if(!getUser)
        return response.sendStatus(404);
    return response.send(getUser);
})

app.put('/api/users/:id',resolveIndexByUserId,(request,response) => {
    const {body ,indexUser} = request;
    users[indexUser]  = {
        id:users[indexUser].id,
        ...body
    }
    return response.sendStatus(200);
})

app.patch('/api/users/:id',resolveIndexByUserId,(request,response) => {
    const {body,indexUser} = request;
    users[indexUser] = {...users[indexUser],...body};
    return response.sendStatus(200);
})

app.delete('/api/users/:id',resolveIndexByUserId,(request,response) => {
    const {indexUser} = request;
    users.splice(indexUser,1);
    return response.sendStatus(200);
})

app.listen(PORT,() => {
    console.log(`Running on Port ${PORT}`);
})