import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';

let AuthChecker = (req:Request,res:Response,next:NextFunction)=>
{
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
      else if(header.includes('Basic') && req.url=='/users/Login')
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
  };

  export {AuthChecker};