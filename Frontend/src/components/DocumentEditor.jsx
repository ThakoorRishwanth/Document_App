// components/DocumentEditor.jsx (updated)
import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, Toolbar, Box, Typography } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import { updateDocument, getDocumentById } from '../services/api';
import io from 'socket.io-client';

const socket = io('https://document-app-a9qh.onrender.com');

const DocumentEditor = ({ document }) => {
  const [editorContent, setEditorContent] = useState(document.content || '');
  const [format, setFormat] = useState({ bold: false, italic: false, underline: false });
  const [collaborators, setCollaborators] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    socket.emit('joinDocument', document._id);

    socket.on('collaborators', (collabs) => setCollaborators(collabs));
    socket.on('documentUpdate', (content) => setEditorContent(content));
    socket.on('newComment', (comment) => setComments(prev => [...prev, comment]));

    return () => {
      socket.emit('leaveDocument', document._id);
      socket.off();
    };
  }, [document._id]);

  const handleFormatChange = (style) => {
    setFormat((prev) => ({ ...prev, [style]: !prev[style] }));
  };

  const applyFormat = (text) => {
    let formattedText = text;
    if (format.bold) formattedText = `<b>${formattedText}</b>`;
    if (format.italic) formattedText = `<i>${formattedText}</i>`;
    if (format.underline) formattedText = `<u>${formattedText}</u>`;
    return formattedText;
  };

  const handleChange = (event) => {
    const newText = event.target.value;
    setEditorContent(newText);
    socket.emit('updateDocument', { docId: document._id, content: applyFormat(newText) });
  };

  const handleSave = async () => {
    await updateDocument(document._id, { content: editorContent }, localStorage.getItem('token'));
  };

  const handleComment = () => {
    if (selectedText.trim() && newComment.trim()) {
      socket.emit('addComment', { docId: document._id, text: newComment, position: selectedText });
      setNewComment('');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Toolbar>
        <IconButton onClick={() => handleFormatChange('bold')}>
          <FormatBoldIcon color={format.bold ? 'primary' : 'action'} />
        </IconButton>
        <IconButton onClick={() => handleFormatChange('italic')}>
          <FormatItalicIcon color={format.italic ? 'primary' : 'action'} />
        </IconButton>
        <IconButton onClick={() => handleFormatChange('underline')}>
          <FormatUnderlinedIcon color={format.underline ? 'primary' : 'action'} />
        </IconButton>
      </Toolbar>
      <TextField
        multiline
        rows={10}
        variant="outlined"
        fullWidth
        value={editorContent}
        onChange={handleChange}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
        Save
      </Button>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Collaborators:</Typography>
        {collaborators.map(collab => (
          <Typography key={collab.id}>{collab.name}</Typography>
        ))}
      </Box>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="New Comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleComment}>
          Add Comment
        </Button>
        {comments.map((comment, index) => (
          <Box key={index} sx={{ mt: 1 }}>
            <Typography variant="body2">{comment.text}</Typography>
            <Typography variant="caption">At position: {comment.position}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DocumentEditor;
