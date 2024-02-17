const Joi = require('joi');
const  ValError  = require('./ValError');

const schema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number()
        .min(0)
        .max(500)
        .required(),
     
    description: Joi.string()
                .required(),
    
    location : Joi.string()
              .required(),

    imageSelect : Joi.array()

}).required(); 


const reviewSchema = Joi.object({
        rating : Joi.number().required(),
        reviewDescp : Joi.string().required(),
}).required();


function validateSchema(req , res , next) {
    const { error } =  schema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ValError(msg, 400)
    }
    else{
        next();     
    }
}


function validateReviewSchema(req , res , next) {
    const { error } =  reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ValError(msg, 400)
    }
    else{
        next();     
    }
}

module.exports.validateSchema = validateSchema;
module.exports.validateReviewSchema = validateReviewSchema;