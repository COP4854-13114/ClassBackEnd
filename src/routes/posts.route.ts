import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { AuthChecker } from "../auth/auth.utils";
import { Post } from "../models/posts.model";
import { BlogUser } from "../models/users.model";
let app = Router();

const prisma = new PrismaClient();

app.get('/', async(req,res,next)=>{
    prisma.post.findMany(
        {
            include:{
                created_by:{
                    select:{
                        id:true,
                        userName:true
                    }
                }
            }
        }
    ).then((postArray)=>{
        res.status(200).send(postArray);
    });
});

app.post('/', AuthChecker, async (req,res,next)=>{

    let loggedinuser = res.getHeader('loggedinuser')
    if(loggedinuser) // Are they logged in?
    {
           let currentUser =loggedinuser.toString();
           prisma.user.findUnique({
            where:{
                userName: currentUser
            }
           }).then((currentUser)=>{
            prisma.post.create({
                data:{
                    title:req.body.title,
                    content: req.body.content,
                    posted_date: new Date(),
                    created_by:{
                        connect: {id: currentUser!.id }
                    }
                }
            }).then((newPost)=>{
                res.status(201).send(newPost);
            })
        });
    }
    else
    {
        res.status(401).send({message:'Back Hacker Go AwAY!'});
    }
});




export {app};

