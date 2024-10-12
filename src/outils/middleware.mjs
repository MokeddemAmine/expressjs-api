import { users } from "./database.mjs";

export const resolveIndexByUserId = (request,response,next) => {
    const {params:{id}} = request;
    const ID = parseInt(id);
    if(isNaN(ID))
        return response.sendStatus(400);
    const indexUser = users.findIndex((user) => user.id === ID)
    if(indexUser == -1)
        return response.sendStatus(404)
    request.indexUser = indexUser;
    next();
}