const joi = require('joi');

const createArticleSchema = joi.object({
    title: joi.string().min(5).max(100).required(),
    content: joi.string().min(20).required(),
});

const validateArticle = (req, res, next) => {
    console.log(req.body);
    const { error } = createArticleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const updateArticleSchema = joi.object({
    title: joi.string().min(5).max(100).trim().optional(),
    content: joi.string().min(20).trim().optional(),
});

const validateUpdateArticle = (req, res, next) => {
    console.log(req.body);
    const { error } = updateArticleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = {
    validateArticle,
    validateUpdateArticle,
};