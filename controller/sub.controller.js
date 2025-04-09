import { workflowClient } from "../config/upstash.js";
import Subscription from "../Models/subscription.model.js";
import { SERVER_URL } from '../config/env.js';



export const createSub=async (req,res,next)=>{
    try {
        const sub= await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        await workflowClient.trigger({
            url:`${SERVER_URL}/api/v1/workflow/subs/reminder`
        })

        res.status(201).json({success:true,data:sub})
    } catch (e) {
        next(e);
    }
}

export const getUserSub=async(req,res,next)=>{
    try {
        if (req.user.id !== req.params.id){
            const error = new Error('You are not the Owner');
            error.status= 401;
            throw error;
        }
        const subs= await Subscription.find({user: req.params.id});
        
        res.status(200).json({success:true, data:subs});
    } catch (error) {
        next(error);
    }
}


export const getAllSubs=async(req,res,next)=>{
    try {
        const subs =await Subscription.find({user:req.user.id});
        res.status(200).json({success:true,data:subs});
    } catch (error) {
        next(error);
    }
}

export const subDetails=async(req,res,next)=>{
    try {
        const sub= await Subscription.findById(req.params.id);
        if (!sub) {
            return res.status(404).json({success:false,message:"Subscription not found"});            
        }
        return res.status(200).json({success:true, data:sub})
    } catch (error) {
        next(error);
    }

}