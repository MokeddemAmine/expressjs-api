import express from "express";

const app = express();

app.use(express.json())

const PORT = process.env.PORT || 3000;

const users = [
    {id:1,username:'aminemokeddem'},
    {id:2,username:'mohammed'},
    {id:3,username:'nouri'}
];

app.get('/',(request,response) => {
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

app.get('/api/users/:id',(request,response) => {
    const id = parseInt(request.params.id);
    if(isNaN(id)){
        return response.status(400).send({msg:'Bad Request. Invalid ID'});
    }
    const getUser = users.find((user) => user.id === id);
    if(!getUser)
        return response.sendStatus(404);
    return response.send(getUser);
})

app.put('/api/users/:id',(request,response) => {
    const {body,params:{id}} = request;
    const theId = parseInt(id);
    if(isNaN(theId))
        return response.sendStatus(400);
    const indexUser = users.findIndex((user) => user.id === theId)
    if(indexUser == -1)
        return response.sendStatus(404)
    users[indexUser]  = {
        id:theId,
        ...body
    }
    return response.sendStatus(200);
})

app.patch('/api/users/:id',(request,response) => {
    const {body,params:{id}} = request;
    const ID = parseInt(id);
    if(isNaN(ID))
        return response.sendStatus(400);
    const indexUser = users.findIndex((user) => user.id == ID);
    if(ID == -1)
        return response.sendStatus(404);
    users[ID] = {...users[ID],...body};
    return response.sendStatus(200);
})

app.listen(PORT,() => {
    console.log(`Running on Port ${PORT}`);
})