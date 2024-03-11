"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_route_1 = require("./routes/posts.route");
const users_route_1 = require("./routes/users.route");
let app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/users', users_route_1.app);
app.use('/posts', posts_route_1.app);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
