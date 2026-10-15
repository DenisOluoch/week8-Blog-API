const express = require('express');
const {
    postArticle,
    getAllArticles,
    searchArticles,
    getArticleById,
    updateArticleById,
    deleteArticleById
} = require('../controllers/article.controller.js');

const { validateArticle, validateUpdateArticle } = require('../middlewares/validateArticle.js'); 
const requireAuth = require('../middlewares/requireAuth.js');

const router = express.Router();

// All main CRUD routes protected with requireAuth[cite: 1]
router.post('/', requireAuth, validateArticle, postArticle);
router.get('/', requireAuth, getAllArticles);
router.get('/search', searchArticles);
router.get('/:id', requireAuth, getArticleById);
router.put('/:id', requireAuth, validateUpdateArticle, updateArticleById);
router.delete('/:id', requireAuth, deleteArticleById);

module.exports = router;