const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Create
router.post('/', async(req, res) => {
  const item = new MenuItem(req.body);
  
  try{
    await item.save();
    res.json(item);
  }catch(error){
    res.json({message: error});
  }
});

// Read
router.get('/:restaurantId', async(req, res) => {
  try{
    const items = await MenuItem.find({restaurantId: req.params.restaurantId});
    res.json(items); 
  }catch(error){
    res.json({message: error});
  }
});

// Update
router.put('/:id', async(req, res) => {
  try{
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updated);
  }catch(error){
    res.json({message: error});
  }
});

// Delete
router.delete('/:id', async(req, res) => {
  try{
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({message: 'Deleted !'});
  }catch(error){
    res.json({message: error});
  }
});

module.exports = router;