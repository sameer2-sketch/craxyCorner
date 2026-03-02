import React, { useState } from 'react';
import { data as initialData } from './data'; // Adjust path accordingly
import { Button, TextField, Select, MenuItem, Grid, Card, CardMedia, CardContent, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const moods = ['lovely', 'sad', 'excited'];
const categories = ['main', 'side', 'dessert', 'drink', 'snack'];

const AdminPage = () => {
  const [data, setData] = useState(initialData);
  const [selectedMood, setSelectedMood] = useState('happy');
  const [selectedCategory, setSelectedCategory] = useState('main');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemData, setItemData] = useState({ name: '', image: '', description: '' });

  const handleOpenDialog = (item = { name: '', image: '', description: '' }, index = null) => {
    setItemData(item);
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const handleSave = () => {
    const updatedCategory = [...data[selectedMood][selectedCategory]];
    if (editingIndex !== null) {
      updatedCategory[editingIndex] = itemData; // Edit
    } else {
      updatedCategory.push(itemData); // Add new
    }

    setData({
      ...data,
      [selectedMood]: {
        ...data[selectedMood],
        [selectedCategory]: updatedCategory
      }
    });
    setDialogOpen(false);
  };

  const handleDelete = (index) => {
    const updatedCategory = data[selectedMood][selectedCategory].filter((_, i) => i !== index);
    setData({
      ...data,
      [selectedMood]: {
        ...data[selectedMood],
        [selectedCategory]: updatedCategory
      }
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Admin Panel - CRUD Menu</Typography>
      
      <div style={{ marginBottom: 20 }}>
        <Select value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)} sx={{ mr: 2 }}>
          {moods.map(mood => <MenuItem key={mood} value={mood}>{mood}</MenuItem>)}
        </Select>

        <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)}
        </Select>

        <Button variant="contained" color="primary" startIcon={<Add />} sx={{ ml: 2 }} onClick={() => handleOpenDialog()}>
          Add Item
        </Button>
      </div>

      <Grid container spacing={2}>
        {data[selectedMood][selectedCategory].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia component="img" height="140" image={item.image} alt={item.name} />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">{item.description}</Typography>
              </CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px 16px' }}>
                <IconButton color="primary" onClick={() => handleOpenDialog(item, index)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(index)}>
                  <Delete />
                </IconButton>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editingIndex !== null ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={itemData.name}
            onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={itemData.image}
            onChange={(e) => setItemData({ ...itemData, image: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={itemData.description}
            onChange={(e) => setItemData({ ...itemData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingIndex !== null ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPage;
