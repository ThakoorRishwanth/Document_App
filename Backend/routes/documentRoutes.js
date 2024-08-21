const express = require('express');
const router = express.Router();
const { createDocument, getDocuments, updateDocument, deleteDocument } = require('../controllers/documentController'); // Destructure to import functions
const { protect } = require('../middlewares/authMiddleware');


// Routes
router.post('/', protect, createDocument); // POST /api/documents
router.get('/', protect, getDocuments); // GET /api/documents
router.put('/:id', protect, updateDocument); // PUT /api/documents/:id
router.delete('/:id', protect, deleteDocument); // DELETE /api/documents/:id

module.exports = router;
