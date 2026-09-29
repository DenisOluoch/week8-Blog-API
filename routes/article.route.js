const express = require('express');
const {
    postArticle, // Make sure this matches the exact export name in your controller!
    getAllArticles,
    searchArticles,
    getArticleById,
    updateArticleById,
    deleteArticleById
} = require('../controllers/article.controller.js');

const router = express.Router();

// Use '/' instead of '/articles' because index.js already prefixes with '/api/articles'
router.post('/', postArticle);
router.get('/', getAllArticles);
router.get('/search', searchArticles);
router.get('/:id', getArticleById);
router.put('/:id', updateArticleById);
router.delete('/:id', deleteArticleById);
module.exports = router;