import { Router } from "express";
import { Post } from "../models/posts.model";
import { BlogUser } from "../models/users.model";
let app = Router();
let listOfPosts:Post[]=[];


app.get('/', (req,res,next)=>{
    res.status(200).send(listOfPosts);
});

app.post('/', (req,res,next)=>{

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

