// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Add this line

const app = express();
const port = 3000;

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());
app.use(cors());  // Add this line to enable CORS


const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token || token !== `Bearer ${API_TOKEN}`) {
      return res.status(403).send({ message: 'Invalid or missing API token' });
    }
    next();
}

// In-memory "database" with nested items
let items = [];

// Utility function to simulate database ID auto-increment
const generateId = (list) => list.length ? list[list.length - 1].id + 1 : 1;

// GET all items (Read) without pagination, filtering, and sorting
app.get('/api/items',verifyToken , (req, res) => {
    if(items.length == 0){
        res.status(400).send({ message: 'No Items' });
    } else {
        res.json({
            totalItems: items.length,
            items: items
        });    
    }
    
});

// GET a single item by ID (Read)
app.get('/api/items/:id',verifyToken , (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === itemId);

  if (item) {
    res.json(item);
  } else {
    res.status(404).send({ message: 'Item not found' });
  }
});

// POST a new item (Create) with validation
app.post('/api/items',verifyToken , (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).send({ message: 'Name and  description are required' });
  }

  const newItem = {
    id: generateId(items),
    name,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
    subItems: []  // Initialize empty sub-items array
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT (Update) an item by ID with validation and timestamp update
app.put('/api/items/:id',verifyToken , (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const { name, description, status } = req.body;
  const itemIndex = items.findIndex(i => i.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).send({ message: 'Item not found' });
  }

  if (!name || !description || !status) {
    return res.status(400).send({ message: 'Name, description, and status are required' });
  }

  items[itemIndex] = {
    ...items[itemIndex],
    name,
    description,
    status,
    updatedAt: new Date()
  };

  res.json(items[itemIndex]);
});

// DELETE an item by ID (Delete)
app.delete('/api/items/:id',verifyToken , (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const itemIndex = items.findIndex(i => i.id === itemId);

  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send({ message: 'Item not found' });
  }
});

// =========== SUB-ITEM (NESTED ITEM) ROUTES ===========

// POST a new sub-item to a specific item
app.post('/api/items/:id/subitems',verifyToken , (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const { name, description, status } = req.body;

  const item = items.find(i => i.id === itemId);
  if (!item) {
    return res.status(404).send({ message: 'Item not found' });
  }

  if (!name || !description || !status) {
    return res.status(400).send({ message: 'Sub-item name, description, and status are required' });
  }

  const newSubItem = {
    id: generateId(item.subItems),
    name,
    description,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  item.subItems.push(newSubItem);
  res.status(201).json(newSubItem);
});

// GET all sub-items of a specific item
app.get('/api/items/:id/subitems',verifyToken , (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === itemId);

  if (item) {
    res.json(item.subItems);
  } else {
    res.status(404).send({ message: 'Item not found' });
  }
});

// GET a specific sub-item of a specific item by sub-item ID
app.get('/api/items/:id/subitems/:subId',verifyToken , (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const subId = parseInt(req.params.subId, 10);
  const item = items.find(i => i.id === itemId);

  if (item) {
    const subItem = item.subItems.find(sub => sub.id === subId);
    if (subItem) {
      res.json(subItem);
    } else {
      res.status(404).send({ message: 'Sub-item not found' });
    }
  } else {
    res.status(404).send({ message: 'Item not found' });
  }
});

// PUT (Update) a sub-item by sub-item ID
app.put('/api/items/:id/subitems/:subId',verifyToken , (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const subId = parseInt(req.params.subId, 10);
  const { name, description, status } = req.body;

  const item = items.find(i => i.id === itemId);
  if (!item) {
    return res.status(404).send({ message: 'Item not found' });
  }

  const subItemIndex = item.subItems.findIndex(sub => sub.id === subId);
  if (subItemIndex === -1) {
    return res.status(404).send({ message: 'Sub-item not found' });
  }

  if (!name || !description || !status) {
    return res.status(400).send({ message: 'Sub-item name, description, and status are required' });
  }

  item.subItems[subItemIndex] = {
    ...item.subItems[subItemIndex],
    name,
    description,
    status,
    updatedAt: new Date(),
  };

  res.json(item.subItems[subItemIndex]);
});

// DELETE a sub-item by sub-item ID
app.delete('/api/items/:id/subitems/:subId',verifyToken , (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const subId = parseInt(req.params.subId, 10);

  const item = items.find(i => i.id === itemId);
  if (!item) {
    return res.status(404).send({ message: 'Item not found' });
  }

  const subItemIndex = item.subItems.findIndex(sub => sub.id === subId);
  if (subItemIndex === -1) {
    return res.status(404).send({ message: 'Sub-item not found' });
  }

  item.subItems.splice(subItemIndex, 1);
  res.status(204).send();
});

// Error handling for unknown routes
app.use((req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Nested CRUD API running on http://localhost:${port}`);
});