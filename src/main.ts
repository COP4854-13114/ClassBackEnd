import express from 'express';
import { BlogUser } from './models/users.model';
import { app as PostRouter } from './routes/posts.route'
import {app as UserRoute, listOfUsers} from './routes/users.route';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let app = express();
app.use(express.json());


app.use('/users', UserRoute);
app.use('/posts',PostRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
