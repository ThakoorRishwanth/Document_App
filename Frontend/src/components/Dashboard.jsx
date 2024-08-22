// components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, TextField, Box } from '@mui/material';

import useAuth from '../hooks/useAuth';
import DocumentEditor from './DocumentEditor';
import { createDocument, deleteDocument, getDocuments } from '../services/api';

const Dashboard = () => {
  const { user, logout, loading, refreshUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      if (user) {
        const docs = await getDocuments(localStorage.getItem('token'));
        setDocuments(docs);
      }
    };
    fetchDocuments();
  }, [user]);

  const handleCreateDocument = async () => {
    if (newDocumentTitle.trim()) {
      await createDocument({ title: newDocumentTitle }, localStorage.getItem('token'));
      setNewDocumentTitle('');
      await refreshUser(); // Refresh to get the updated document list
    }
  };

  const handleDeleteDocument = async (id) => {
    await deleteDocument(id, localStorage.getItem('token'));
    await refreshUser(); // Refresh to get the updated document list
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>You need to be logged in to view this page.</p>;
  }

  return (
    <Container>
      <Typography variant="h4">Dashboard</Typography>
      <TextField
        label="New Document Title"
        value={newDocumentTitle}
        onChange={(e) => setNewDocumentTitle(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleCreateDocument}>
        Create Document
      </Button>
      {documents.map(doc => (
        <Box key={doc._id} sx={{ mt: 2 }}>
          <Typography variant="h6">{doc.title}</Typography>
          <Typography variant="body2">Last modified: {new Date(doc.updatedAt).toLocaleString()}</Typography>
          <Button variant="outlined" onClick={() => setSelectedDocument(doc)}>
            Edit
          </Button>
          <Button variant="outlined" color="error" onClick={() => handleDeleteDocument(doc._id)}>
            Delete
          </Button>
        </Box>
      ))}
      {selectedDocument && <DocumentEditor document={selectedDocument} />}
      <Button variant="contained" color="secondary" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
