import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { getUser, getUsers } from "../controller/user.controller.js";


const userRouter = Router();

userRouter.get('/',getUsers);

userRouter.get('/:id',authorize,getUser);

userRouter.post('/',(req,res)=> 
    res.send({title:'Create New User'}));

userRouter.put('/:id',(req,res)=> 
    res.send({title:'Update User'}));

userRouter.delete('/:id',(req,res)=> 
    res.send({title:'Delete User'}));

export default userRouter;
