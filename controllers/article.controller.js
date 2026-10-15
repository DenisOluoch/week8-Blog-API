const Joi = require("joi");
const ArticleModel = require("../models/article.model.js");

const postArticle = async (req, res, next) => {
    const articleSchema = Joi.object({
        title: Joi.string().min(5).max(100).trim().required(),
        content: Joi.string().min(20).trim().required(),
    });

    const { error, value } = articleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const newArticle = new ArticleModel({ 
            title: value.title, 
            content: value.content, 
            author: req.user._id // Links to the authenticated user ID
        });

        await newArticle.save();
        await newArticle.populate('author', 'name email');

        return res.status(201).json({ message: "Article created successfully", data: newArticle });
    } catch (error) {
        next(error);
    }
};

const getAllArticles = async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    
    try {
        const articles = await ArticleModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'name email'); // Populates user details

        return res.status(200).json({ message: "Articles fetched successfully", data: articles });
    } catch (error) {
        next(error);
    }
};

const getArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id)
            .populate('author', 'name email');

        if (!article) {
            return res.status(404).json({ message: `Article with ID ${req.params.id} not found` });
        }
        return res.status(200).json({ message: "Article fetched successfully", data: article });
    } catch (error) {
        next(error);
    }
};

const updateArticleById = async (req, res, next) => {
    const articleSchema = Joi.object({
        title: Joi.string().min(5).max(100).optional(),
        content: Joi.string().min(20).optional(),
    });

    const { error, value } = articleSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: `Article with ID ${req.params.id} not found` });
        }

        // Safe Ownership Check with requested error messages
        if (!article.author) {
            return res.status(403).json({ message: "Unauthorized: This article has no assigned author, and this operation can only be done by the owner." });
        }

        const authorId = article.author._id ? article.author._id.toString() : article.author.toString();
        if (authorId !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: This operation can only be done by the owner." });
        }

        const updatedArticle = await ArticleModel.findByIdAndUpdate(req.params.id, value, { 
            new: true,
            runValidators: true,
        }).populate('author', 'name email');

        return res.status(200).json({ message: "Article updated successfully", data: updatedArticle });
    } catch (error) {
        next(error);
    }
};

const deleteArticleById = async (req, res, next) => {
    try {
        const article = await ArticleModel.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: `Article with ID ${req.params.id} not found` });
        }

        // Safe Ownership Check with requested error messages
        if (!article.author) {
            return res.status(403).json({ message: "Unauthorized: This article has no assigned author, and this operation can only be done by the owner." });
        }

        const authorId = article.author._id ? article.author._id.toString() : article.author.toString();
        if (authorId !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: This operation can only be done by the owner." });
        }

        await ArticleModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Article deleted successfully", data: article });
    } catch (error) {
        next(error);
    }
};

const searchArticles = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: "Search query parameter 'q' is required" });
        }

        const articles = await ArticleModel.searchByKeyword(q).populate('author', 'name email');

        return res.status(200).json({ 
            message: "Search completed successfully", 
            count: articles.length,
            data: articles 
        });
    } catch (error) {
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