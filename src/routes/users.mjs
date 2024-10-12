import { Router } from "express";
import { validationResult,query,checkSchema,matchedData } from "express-validator";
import { users } from "../outils/database.mjs";
import { createUserValidationSchema } from "../outils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../outils/middleware.mjs";

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

router.post(
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