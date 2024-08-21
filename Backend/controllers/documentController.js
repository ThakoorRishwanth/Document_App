const Document = require('../models/Document');
const mongoose = require('mongoose');
const io = require('../server').io;  // Import the WebSocket instance from server.js

// Create a new document
exports.createDocument = async (req, res) => {
    const { title, content, collaborators = [] } = req.body;

    try {
        const document = new Document({
            title,
            content,
            owner: req.user.id, // Dynamically set the owner
            collaborators: [...collaborators, req.user.id], // Add the owner to collaborators
        });

        await document.save();

        res.status(201).json(document);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all documents for the logged-in user
exports.getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ collaborators: req.user.id }).populate('owner', 'username email');
        res.json(documents);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a specific document by ID
exports.getDocumentById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid document ID' });
    }

    try {
        const document = await Document.findById(id).populate('owner', 'username email');

        if (!document || !document.collaborators.includes(req.user.id)) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json(document);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a document
exports.updateDocument = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid document ID' });
    }

    try {
        const document = await Document.findById(id);

        if (!document || !document.collaborators.includes(req.user.id)) {
            return res.status(404).json({ message: 'Document not found' });
        }

        document.title = title || document.title;
        document.content = content || document.content;
        document.lastModified = Date.now();

        await document.save();

        // Emit WebSocket event
        io.emit('documentUpdated', { id, title, content });

        res.json(document);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a document
exports.deleteDocument = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid document ID' });
    }

    try {
        const document = await Document.findById(id);

        if (!document || document.owner.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Document not found or unauthorized' });
        }

        await document.remove();

        res.json({ message: 'Document deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
