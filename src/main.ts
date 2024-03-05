import express from 'express';
import { BlogUser } from './models/users.model';
import { app as PostRouter } from './routes/posts.route'
import {app as UserRoute, listOfUsers} from './routes/users.route';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let app = express();
app.use(express.json());
app.use('/', (req,res,next)=>{
  if(req.headers['authorization'])
  {
    let header = req.headers['authorization'];
    if(header.includes('Bearer'))
    {
      let token = header.split(' ')[1];
      try
      {
        let payload = jwt.verify(token,'SECREETKEY') as any;
        res.setHeader('loggedinuser',payload.username);
        next();
      }
      catch(e)
      {
        res.status(401).send({message:'Cant hack me!'});
      }

      
    }
    else if(header.includes('Basic') && req.url=='/Login')
    {
      next();
    }
    else
    {
      res.status(401).send({message:'Cant hack me!'});
    }
  }
  else
    next();
});
app.use('/users', UserRoute);
app.use('/posts',PostRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
