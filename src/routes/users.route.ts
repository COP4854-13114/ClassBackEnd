import { Router } from "express";
import { BlogUser } from "../models/users.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltRounds =10;

let listOfUsers:BlogUser[]=[];

 let app = Router();
 app.post('/Login', (req,res,next)=>{
  if(req.headers['authorization'])
  {
    let userInfo = req.headers['authorization'].split(' ')[1]; //Base 64 Encoded
    let decodedUserInfo = atob(userInfo);
    let userName= decodedUserInfo.split(':')[0];
    let password= decodedUserInfo.split(':')[1];
    let foundUser:BlogUser|undefined=undefined;
    for(let u of listOfUsers)
    {
      if(u.userName==userName)
      {
        foundUser=u;
        break;
      }
    }
    if(foundUser==undefined)
    {
      res.status(401).send({message:'Invalid Username or Password'});
    }
    else{
      bcrypt.compare(password,foundUser.password,(err,result)=>{
        if(result)
        {
          let token = jwt.sign({username:foundUser?.userName,  exp: Math.floor(Date.now() / 1000) + (60)},'SECREETKEY');
          res.status(200).send({token:token});
        }
        else
          res.status(401).send({message:'Invalid Username or Password'});
      })
    }
  }
  else
  {
    res.status(401).send({message:'Invalid Username or Password'});
  }
 
})
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