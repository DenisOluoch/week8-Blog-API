const Joi = require('joi');

const createArticleSchema = Joi.object({
    title: Joi.string().min(5).max(100).trim().required(),
    content: Joi.string().min(20).trim().required(),
    author: Joi.string().trim().optional()
});

const validateArticle = (req, res, next) => {
    const { error } = createArticleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const updateArticleSchema = Joi.object({
    title: Joi.string().min(5).max(100).trim().optional(),
    content: Joi.string().min(20).trim().optional(),
    author: Joi.string().trim().optional()
});

const validateUpdateArticle = (req, res, next) => {
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