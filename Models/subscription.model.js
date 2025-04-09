import mongoose from "mongoose";

const subscriptionSchema= new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength:2,
        maxLength:100
    },
    price:{
        type: Number,
        required:[true, 'Subcription is required'],
        min:[0,'Price must be greater'],
    },
    currency:{
        type:String,
        enum:['USD','EUR','GBP'],
        default:'USD'
    },
    frequency:{
        type:String,
        enum:['daily','weekly','monthly','yearly'],
    },
    category:{
        type:String,
        enum:['sports','news','entertainment','lifestyle','technology','finance','politics','other'],
        required: true,
    },
    paymentMethod:{
        type: String,
        required: true,
        trim:true,
    },
    status:{
        type:String,
        enum:['Active','Cancelled','Expired'],
        default:'Active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
          validator: function (value) {
            if (!(value instanceof Date) || isNaN(value)) return false;
      
            const inputDate = new Date(value);
            const now = new Date();
      
            inputDate.setHours(0, 0, 0, 0);
            now.setHours(0, 0, 0, 0);
      
            return inputDate <= now;
          },
          message: 'Start date must be today or in the past',
        }
      },
    renewalDate:{
        type:Date,
        validate:{
            validator:function(value){
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start Date',
        }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
        index:true,
    }

},{timestamps: true});


//renewal auto-cal
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate && this.frequency) {
      const renewalPeriods = {
        weekly: 7,
        monthly: 30,
        yearly: 365,
      };
  
      const daysToAdd = renewalPeriods[this.frequency];
  
      if (daysToAdd) {
        const start = new Date(this.startDate);
        start.setDate(start.getDate() + daysToAdd);
        this.renewalDate = start;
      }
    }
  
    if (this.renewalDate && this.renewalDate < new Date()) {
      this.status = 'Expired';
    }
  
    next();
  });
  

const Subscription= mongoose.model('Subscription',subscriptionSchema)

export default Subscription;