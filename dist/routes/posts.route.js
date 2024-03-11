"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_utils_1 = require("../auth/auth.utils");
const posts_model_1 = require("../models/posts.model");
let app = (0, express_1.Router)();
exports.app = app;
let listOfPosts = [];
const prisma = new client_1.PrismaClient();
app.get('/', async (req, res, next) => {
    /*prisma.post.findMany(
        {
            where:{
                id> 0
            }
        }
    )*/
});
app.post('/', auth_utils_1.AuthChecker, (req, res, next) => {
    let loggedinuser = res.getHeader('loggedinuser');
    if (loggedinuser) // Are they logged in?
     {
        let newPost = new posts_model_1.Post();
        Object.assign(newPost, req.body);
        newPost.posted_date = new Date();
        newPost.id = Date.now();
        newPost.post_by = loggedinuser.toString();
        listOfPosts.push(newPost);
        res.status(201).send(newPost);
    }
    else {
        res.status(401).send({ message: 'Back Hacker Go AwAY!' });
    }
});
