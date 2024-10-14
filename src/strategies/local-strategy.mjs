import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../outils/database.mjs";

passport.serializeUser((user,done) => {
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null,user.id);
})

passport.deserializeUser((id,done) => {
    console.log(`Inside Deserialize`);
    try{
        const findUser = users.find((user) => user.id == id);
        if(!findUser)
            throw new Error('User not found');
        done(null,findUser);
    }catch(err){
        done(err,null);
    }
})

export default passport.use(
    new Strategy((username,password,done)=> {
        console.log(`username:${username}`);
        console.log(`password:${password}`);
        try{
            const findUser = users.find((user) => user.username == username)
            if(!findUser) 
                throw new Error('User not found');
            if(findUser.password !== password)
                throw new Error('Invalid Credentials');
            done(null,findUser);
        }catch(err){
            done(err,null);
        }
    })
)