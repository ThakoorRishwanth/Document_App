// pages/DocumentPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { getDocuments, getDocumentById } from '../services/api';
import useAuth from '../hooks/useAuth';
import DocumentEditor from '../components/DocumentEditor';

const DocumentPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [versionHistory, setVersionHistory] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (user) {
        const docs = await getDocuments(localStorage.getItem('token'));
        setDocuments(docs);
      }
    };
    fetchDocuments();
  }, [user]);

  const handleViewHistory = async (docId) => {
    const doc = await getDocumentById(docId, localStorage.getItem('token'));
    setVersionHistory(doc.versions);
  };

  return (
    <Container>
      <Typography variant="h4">Documents</Typography>
      {selectedDocument && <DocumentEditor document={selectedDocument} />}
      {documents.length > 0 ? (
        documents.map((doc) => (
          <Box key={doc._id} sx={{ mt: 2 }}>
            <Typography variant="h6">{doc.title}</Typography>
            <Button onClick={() => setSelectedDocument(doc)} variant="outlined" sx={{ mt: 1 }}>
              Edit
            </Button>
            <Button onClick={() => handleViewHistory(doc._id)} variant="outlined" sx={{ mt: 1 }}>
              View History
            </Button>
          </Box>
        ))
      ) : (
        <Typography>No documents available</Typography>
      )}
      {versionHistory.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Version History:</Typography>
          {versionHistory.map((version, index) => (
            <Box key={index} sx={{ mt: 1 }}>
              <Typography>Version {index + 1} - {new Date(version.date).toLocaleString()}</Typography>
              <Button variant="outlined" onClick={() => handleRevert(version.id)}>
                Revert to this version
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default DocumentPage;
