import { Router } from "express";
import { BlogUser } from "../models/users.model";
import bcrypt from 'bcrypt';

const saltRounds =10;

let listOfUsers:BlogUser[]=[];

 let app = Router();
 app.post('/', (req,res,next)=>{

    let newUser = new BlogUser();
    bcrypt.genSalt(saltRounds, (err, salt)=>{
        bcrypt.hash(req.body.password,salt, (err,hash)=>{
            newUser.userName = req.body.username;
            newUser.password = hash;
            listOfUsers.push(newUser);
            res.send(newUser);
        });
        
    })
    //Object.assign(newUser, req.body);
 });

 export {app, listOfUsers}