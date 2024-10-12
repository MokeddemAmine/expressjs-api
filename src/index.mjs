import express from "express";
import {query,body,validationResult, matchedData,checkSchema} from 'express-validator'
import { createUserValidationSchema } from "./outils/validationSchemas.mjs";

const app = express();

app.use(express.json())

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

app.get('/',(request,response) => {
    response.status(201).send({msg:'amine mokeddem'})
})

app.get('/api/users',
query('filter').isString().notEmpty().withMessage('Must be not empty').isLength({min:3,max:10}).withMessage('Must be at least 3-10 characters'),
(request,response) => {
    const result = validationResult(request);
    console.log(result);
    const {query:{filter,value}} = request;
    if(filter && value){
        return response.send(
            users.filter((user) =>  user[filter].includes(value))
        )
    }
   return response.status(201).send(users)
})

app.post(
    '/api/users',
    checkSchema(createUserValidationSchema),
    (request, response) => {
        const result = validationResult(request);
        if(!result.isEmpty())
            return response.status(400).send({errors: result.array()})
        const data = matchedData(request);
        const newUser = {id:users[users.length -1].id + 1, ...data}
        users.push(newUser);
        return response.status(201).send(newUser);
    }
)

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