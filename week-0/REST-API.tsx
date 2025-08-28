import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

// Define the Item interface
interface Item {
  id: number;
  name: string;
  description: string;
}

// Create an Express application
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory database for items
let items: Item[] = [
  { id: 1, name: 'Item 1', description: 'This is the first item' },
  { id: 2, name: 'Item 2', description: 'This is the second item' },
];

// GET endpoint to retrieve all items
app.get('/items', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: items,
  });
});

// POST endpoint to create a new item
app.post('/items', (req: Request, res: Response) => {
  const { name, description } = req.body;
  
  // Validate request body
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      error: 'Please provide name and description',
    });
  }
  
  // Create new item
  const newItem: Item = {
    id: items.length + 1,
    name,
    description,
  };
  
  // Add to items array
  items.push(newItem);
  
  // Return success response
  res.status(201).json({
    success: true,
    data: newItem,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;