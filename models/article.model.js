const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 100,
        },
        content: {
            type: String,
            required: true,
            minlength: 20,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    }, 

    {timestamps: true});
    
        
    articleSchema.statics.searchByKeyword = function(keyword) {
        return this.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { content: { $regex: keyword, $options: 'i' } },
            ]
        });
    };

module.exports = mongoose.model("Article", articleSchema);