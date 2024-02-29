import express from 'express';
import { BlogUser } from './models/users.model';
import { app as PostRouter } from './routes/posts.route'
import {app as UserRoute, listOfUsers} from './routes/users.route';
import bcrypt from 'bcrypt';

let app = express();
app.use(express.json());
app.use('/', (req,res,next)=>{
  if(req.headers['authorization'])
  {
    let userInfo = req.headers['authorization'].split(' ')[1]; //Base 64 Encoded
    let decodedUserInfo = atob(userInfo);
    let userName= decodedUserInfo.split(':')[0];
    let password= decodedUserInfo.split(':')[1];
    let foundUser:BlogUser|undefined=undefined;
    for(let u of listOfUsers)
    {
      if(u.userName==userName)
      {
        foundUser=u;
        break;
      }
    }
    if(foundUser==undefined)
    {
      res.status(401).send({message:'Invalid Username'});
    }
    else{
      bcrypt.compare(password,foundUser.password,(err,result)=>{
        if(result)
        {
          next();
        }
        else
          res.status(401).send({message:'Password'});
      })
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
