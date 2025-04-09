import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createSub, getAllSubs, getUserSub, subDetails } from "../controller/sub.controller.js";


const subscriptionRouter=Router();

subscriptionRouter.get('/', authorize,getAllSubs);

subscriptionRouter.get('/:id', authorize,subDetails);

subscriptionRouter.post('/',authorize,createSub);

subscriptionRouter.put('/:id', (req,res)=>
    res.send({title: 'Update sub details'}));

subscriptionRouter.delete('/:id', (req,res)=>
    res.send({title: 'Delete sub'}));

subscriptionRouter.get('/user/:id',authorize,getUserSub);

subscriptionRouter.put('/:id/cancel', (req,res)=>
    res.send({title: 'Cancel a sub'}));

subscriptionRouter.get('/upcoming-renewals', (req,res)=>
    res.send({title: 'Get upcoming renewals'}));

export default subscriptionRouter;
