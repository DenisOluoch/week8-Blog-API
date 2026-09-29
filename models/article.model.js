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
            type: String,
            default: "Guest Author",
        },
    }, 
    {
        timestamps: true,
        statics: {
            searchByKeyword(keyword) {
                const regex = new RegExp(keyword, 'i'); // 'i' for case-insensitive
                return this.find({
                    $or: [
                        { title: { $regex: regex } },
                        { content: { $regex: regex } },
                        { author: { $regex: regex } }
                    ]
                });
            }
        }
    }
);

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;