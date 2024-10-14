import { Router } from "express";
import { validationResult,query,checkSchema,matchedData } from "express-validator";
import { users } from "../outils/database.mjs";
import { createUserValidationSchema } from "../outils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../outils/middleware.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../outils/herlpers.mjs";

const router = Router();

router.get(
    '/api/users',
    query('filter')
    .isString()
    .notEmpty()
    .withMessage('Must be not empty')
    .isLength({min:3,max:10})
    .withMessage('Must be at least 3-10 characters'),
    (request,response) => {
        console.log(request.session.id);
        request.sessionStore.get(request.session.id,(err,sessionData) => {
            if(err){
                console.log(err);
                throw err;
            }
            console.log(sessionData);
        })
        const result = validationResult(request);
        const {query:{filter,value}} = request;
        if(filter && value){
            return response.send(
                users.filter((user) =>  user[filter].includes(value))
            )
        }
        return response.status(201).send(users)
        
        
        
})

router.post(
    '/api/users',
    checkSchema(createUserValidationSchema),
    async (request, response) => {
        const result = validationResult(request);
        if(!result.isEmpty())
            return response.status(400).send(result.array());
        const data = matchedData(request);
        // hash the password with bcrypt 
        data.password = hashPassword(data.password);
        const newUser = new User(data);
        try{
            const savedUser = await newUser.save();
            return response.status(201).send(savedUser);
        }catch(err){
            console.log(err);
            return response.sendStatus(400);
        }
    }
)

router.get('/api/users/:id',resolveIndexByUserId,(request,response) => {
    const {indexUser} = request;
    const getUser = users[indexUser];
    if(!getUser)
        return response.sendStatus(404);
    return response.send(getUser);
})

router.put('/api/users/:id',resolveIndexByUserId,(request,response) => {
    const {body ,indexUser} = request;
    users[indexUser]  = {
        id:users[indexUser].id,
        ...body
    }
    return response.sendStatus(200);
})

router.patch('/api/users/:id',resolveIndexByUserId,(request,response) => {
    const {body,indexUser} = request;
    users[indexUser] = {...users[indexUser],...body};
    return response.sendStatus(200);
})

router.delete('/api/users/:id',resolveIndexByUserId,(request,response) => {
    const {indexUser} = request;
    users.splice(indexUser,1);
    return response.sendStatus(200);
})

export default router;