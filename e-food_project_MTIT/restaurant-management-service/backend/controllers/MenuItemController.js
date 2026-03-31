// const { restaurantDB } = req.app.locals.dbs;
// const MenuItem = require('../models/MenuItem');

// Create Menu Item
exports.create = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const MenuItem = require('../models/MenuItem')(restaurantDB);
  try {
    const {
      name,
      description,
      price,
      category,
      discount,
      prepTime,
      tags,
      ingredients,
      stock,
      lowStockThreshold,
      isAvailable,
      sizes,
      addOns,
      restaurantId,
    } = req.body;

    const parsedSizes = sizes ? JSON.parse(sizes) : [];
    const parsedAddOns = addOns ? JSON.parse(addOns) : [];

    const finalPrice = price - (price * (discount || 0) / 100);

  
    let imageUrls = [];
    if (req.file) {
      imageUrls = [`/uploads/menuitems/${req.file.filename}`];
    }

    // let imageUrls = [];
    // if (req.files && req.files.length > 0) {
    //   imageUrls = req.files.map(file => `/uploads/menuitems/${file.filename}`);
    // } else if (req.file) {
    //   imageUrls = [`/uploads/menuitems/${req.file.filename}`];
    // }


    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      discount,
      finalPrice,
      prepTime,
      tags: tags?.split(',').map(t => t.trim()) || [],
      ingredients: ingredients?.split(',').map(i => i.trim()) || [],
      stock,
      lowStockThreshold,
      isAvailable: isAvailable === 'true',
      sizes: parsedSizes,
      addOns: parsedAddOns,
      restaurantId,
      image: imageUrls
    });

    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    console.error("MenuItem creation error:", JSON.stringify(err, null, 2));
    res.status(400).json({ error: err.message || 'Invalid input. Please check your data.' });
  }
};


// Get All
// Get All
exports.getAll = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const MenuItem = require('../models/MenuItem')(restaurantDB);
  try {
    const { restaurantId } = req.query;  // 🛑 Get restaurantId from query params

    let filter = {};
    if (restaurantId) {
      filter.restaurantId = restaurantId;   // 🔥 Filter by restaurantId
    }

    const items = await MenuItem.find(filter).populate('restaurantId', 'name');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};




// Get One
exports.getOne = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const MenuItem = require('../models/MenuItem')(restaurantDB);
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.update = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const MenuItem = require('../models/MenuItem')(restaurantDB);
  try {
    const updateData = req.body;

    if (updateData.sizes && typeof updateData.sizes === 'string') {
      updateData.sizes = JSON.parse(updateData.sizes);
    }

    if (updateData.addOns && typeof updateData.addOns === 'string') {
      updateData.addOns = JSON.parse(updateData.addOns);
    }

    if (updateData.tags) {
      updateData.tags = updateData.tags.split(',').map(t => t.trim());
    }

    if (updateData.ingredients) {
      updateData.ingredients = updateData.ingredients.split(',').map(i => i.trim());
    }

    // Recalculate final price if price/discount changes
    if (updateData.price && updateData.discount !== undefined) {
      const price = parseFloat(updateData.price);
      const discount = parseFloat(updateData.discount);
      updateData.finalPrice = price - (price * discount / 100);
    }

    
    if (req.files && req.files.length > 0) {
      updateData.image = req.files.map(file => `/uploads/menuitems/${file.filename}`);
    } else {
      // If no new image uploaded, keep old images
      const existingMenuItem = await MenuItem.findById(req.params.id);
      updateData.image = existingMenuItem.image;
    }
    

    const updated = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Update failed.' });
  }
};

// Delete
exports.remove = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const MenuItem = require('../models/MenuItem')(restaurantDB);
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};