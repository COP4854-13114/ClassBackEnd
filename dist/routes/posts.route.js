"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const auth_utils_1 = require("../auth/auth.utils");
let app = (0, express_1.Router)();
exports.app = app;
const prisma = new client_1.PrismaClient();
app.get('/', async (req, res, next) => {
    prisma.post.findMany({
        include: {
            created_by: {
                select: {
                    id: true,
                    userName: true
                }
            }
        }
    }).then((postArray) => {
        res.status(200).send(postArray);
    });
});
app.post('/', auth_utils_1.AuthChecker, async (req, res, next) => {
    let loggedinuser = res.getHeader('loggedinuser');
    if (loggedinuser) // Are they logged in?
     {
        let currentUser = loggedinuser.toString();
        prisma.user.findUnique({
            where: {
                userName: currentUser
            }
        }).then((currentUser) => {
            prisma.post.create({
                data: {
                    title: req.body.title,
                    content: req.body.content,
                    posted_date: new Date(),
                    created_by: {
                        connect: { id: currentUser.id }
                    }
                }
            }).then((newPost) => {
                res.status(201).send(newPost);
            });
        });
    }
    else {
        res.status(401).send({ message: 'Back Hacker Go AwAY!' });
    }
});
