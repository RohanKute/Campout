const BaseJoi = require('joi');
const  ValError  = require('./ValError');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            method(){
                return this.$_addRule('escapeHTML');
            },
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

const schema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number()
        .min(0)
        .max(500)
        .required(),
     
    description: Joi.string()
                .required()
                .escapeHTML(),
    
    location : Joi.string()
              .required()
              .escapeHTML(),

    imageSelect : Joi.array()

}).required(); 


const reviewSchema = Joi.object({
        rating : Joi.number().required(),
        reviewDescp : Joi.string().required().escapeHTML(),
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