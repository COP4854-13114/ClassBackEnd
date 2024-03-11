import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { AuthChecker } from "../auth/auth.utils";
import { Post } from "../models/posts.model";
import { BlogUser } from "../models/users.model";
let app = Router();
let listOfPosts:Post[]=[];
const prisma = new PrismaClient();

app.get('/', async(req,res,next)=>{
    /*prisma.post.findMany(
        {
            where:{
                id> 0
            }
        }
    )*/
});

app.post('/', AuthChecker, (req,res,next)=>{

    let loggedinuser = res.getHeader('loggedinuser')
    if(loggedinuser) // Are they logged in?
    {
            let newPost = new Post();
            
            Object.assign(newPost, req.body);
            newPost.posted_date = new Date();
            newPost.id =Date.now();
            newPost.post_by = loggedinuser.toString();
            listOfPosts.push(newPost);
            res.status(201).send(newPost);
    }
    else
    {
        res.status(401).send({message:'Back Hacker Go AwAY!'});
    }
});




export {app};

