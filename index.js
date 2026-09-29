require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const connectDB = require('./database/connectDB');
const logRequest = require('./middlewares/logger.js'); 
const errorHandler = require('./middlewares/errorHandler.js'); 

const ArticleRoutes = require('./routes/article.route.js');

dns.setServers(['8.8.8.8', '1.1.1.1']);
const app = express();
const PORT = process.env.PORT || 3007; 

connectDB();

app.use(express.json());
app.use(cors('*'));
app.use(logRequest); 

// Mount routes
app.use('/api/articles', ArticleRoutes);

// Error handler MUST be at the bottom (after routes)
app.use(errorHandler); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});