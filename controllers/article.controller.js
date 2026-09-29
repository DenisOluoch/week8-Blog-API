const Joi = require("joi");
const ArticleModel = require("../models/article.model.js");

const postArticle = async (req, res, next) => {
    const articleSchema = Joi.object({
        title: Joi.string().min(5).max(100).required(),
        content: Joi.string().min(20).required(),
        author: Joi.string().optional().default("Guest Author"),
    });

    const { error, value } = articleSchema.validate(req.body);
    if (error) { // Fixed: trigger if there IS an error
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const{ title, content, author } = value;
        const newArticle = new ArticleModel({ title, content, author });
        await newArticle.save();
        return res.status(201).json({ message: "Article created successfully", data: newArticle });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getAllArticles = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    try {
        const articles = await ArticleModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        return res.status(200).json({ message: "Articles fetched successfully", data: articles });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: `Article with ID ${req.params.id} not found` }); // Fixed backticks
        }
        return res.status(200).json({ message: "Article fetched successfully", data: article });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const updateArticleById = async (req, res, next) => {
    const articleSchema = Joi.object({
        title: Joi.string().min(5).max(100).optional(),
        content: Joi.string().min(20).optional(),
        author: Joi.string().optional(),
    });

    const { error, value } = articleSchema.validate(req.body); // Fixed validation target to req.body
    if (error) { // Fixed: trigger if there IS an error
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const updatedArticle = await ArticleModel.findByIdAndUpdate(req.params.id, value, { 
            new: true,
            runValidators: true,
        });
        if (!updatedArticle) {
            return res.status(404).json({ message: `Article with ID ${req.params.id} not found` }); // Fixed backticks
        }
        return res.status(200).json({ message: "Article updated successfully", data: updatedArticle });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const deleteArticleById = async (req, res, next) => {
    try {
        const deletedArticle = await ArticleModel.findByIdAndDelete(req.params.id);
        if (!deletedArticle) {
            return res.status(404).json({ message: `Article with ID ${req.params.id} not found` }); // Fixed backticks
        }
        return res.status(200).json({ message: "Article deleted successfully", data: deletedArticle });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const searchArticles = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search query parameter 'q' is required" });
        }

        // Call your custom model static method
        const articles = await ArticleModel.searchByKeyword(q);

        return res.status(200).json({ 
            message: "Search completed successfully", 
            count: articles.length,
            data: articles 
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = {
    postArticle,
    getAllArticles,
    searchArticles,
    getArticleById,
    updateArticleById,
    deleteArticleById
};


