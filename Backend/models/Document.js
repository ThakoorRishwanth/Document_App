const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: '',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    versionHistory: [
        {
            content: String,
            timestamp: {
                type: Date,
                default: Date.now,
            },
        }
    ]
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
