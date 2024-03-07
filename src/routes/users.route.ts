import { Router } from "express";
import { BlogUser } from "../models/users.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
const saltRounds =10;
const prisma = new PrismaClient();

let listOfUsers:BlogUser[]=[];

 let app = Router();
 app.post('/Login', async (req,res,next)=>{
  if(req.headers['authorization'])
  {
    let userInfo = req.headers['authorization'].split(' ')[1]; //Base 64 Encoded
    let decodedUserInfo = atob(userInfo);
    let userName= decodedUserInfo.split(':')[0];
    let password= decodedUserInfo.split(':')[1];
 
 
    prisma.user.findUnique({
      where:{
        userName:userName
      }
    }).then((userFound)=>{
      if(userFound)
      {
        bcrypt.compare(password,userFound.password,(err,result)=>{
          if(result)
          {
            let token = jwt.sign({username:userFound.userName,  exp: Math.floor(Date.now() / 1000) + (60)},'SECREETKEY');
            res.status(200).send({token:token});
          }
          else
            res.status(401).send({message:'Invalid Username or Password'});
        })
      }
      else
      {
        res.status(401).send({message:'Invalid Username or Password'});
      }
    })
  }
  else
  {
    res.status(401).send({message:'Invalid Username or Password'});
  }
 
})
 
app.post('/', async (req,res,next)=>{

    //let newUser = new BlogUser();
    bcrypt.genSalt(saltRounds, (err, salt)=>{
        bcrypt.hash(req.body.password,salt, (err,hash)=>{
           prisma.user.create({
            data:{
              userName: req.body.username,
              password: hash
            }
           }).then((user)=>{
              res.send(user);
           }).catch((err)=>{
              res.status(400).send({message: JSON.stringify(err)});
           })
            /*newUser.userName = req.body.username;
            newUser.password = hash;
            listOfUsers.push(newUser);
            res.send(newUser);*/
        });
        
    })
    //Object.assign(newUser, req.body);
 });



 export {app, listOfUsers}