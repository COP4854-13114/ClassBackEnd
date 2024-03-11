"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOfUsers = exports.app = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const auth_utils_1 = require("../auth/auth.utils");
const saltRounds = 10;
const prisma = new client_1.PrismaClient();
let listOfUsers = [];
exports.listOfUsers = listOfUsers;
let app = (0, express_1.Router)();
exports.app = app;
app.post('/Login', auth_utils_1.AuthChecker, async (req, res, next) => {
    if (req.headers['authorization']) {
        let userInfo = req.headers['authorization'].split(' ')[1]; //Base 64 Encoded
        let decodedUserInfo = atob(userInfo);
        let userName = decodedUserInfo.split(':')[0];
        let password = decodedUserInfo.split(':')[1];
        prisma.user.findUnique({
            where: {
                userName: userName
            }
        }).then((userFound) => {
            if (userFound) {
                bcrypt_1.default.compare(password, userFound.password, (err, result) => {
                    if (result) {
                        let token = jsonwebtoken_1.default.sign({ username: userFound.userName, exp: Math.floor(Date.now() / 1000) + (60) }, 'SECREETKEY');
                        res.status(200).send({ token: token });
                    }
                    else
                        res.status(401).send({ message: 'Invalid Username or Password' });
                });
            }
            else {
                res.status(401).send({ message: 'Invalid Username or Password' });
            }
        });
    }
    else {
        res.status(401).send({ message: 'Invalid Username or Password' });
    }
});
app.post('/', async (req, res, next) => {
    //let newUser = new BlogUser();
    bcrypt_1.default.genSalt(saltRounds, (err, salt) => {
        bcrypt_1.default.hash(req.body.password, salt, (err, hash) => {
            prisma.user.create({
                data: {
                    userName: req.body.username,
                    password: hash
                }
            }).then((user) => {
                res.send(user);
            }).catch((err) => {
                res.status(400).send({ message: JSON.stringify(err) });
            });
            /*newUser.userName = req.body.username;
            newUser.password = hash;
            listOfUsers.push(newUser);
            res.send(newUser);*/
        });
    });
    //Object.assign(newUser, req.body);
});
