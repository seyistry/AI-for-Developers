# Simple REST API

A simple REST API built with Express.js and TypeScript that provides two endpoints:
- GET /items - Retrieve all items
- POST /items - Create a new item

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

   The server will start on port 3000.

## API Endpoints

### GET /items

Returns a list of all items.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Item 1",
      "description": "This is the first item"
    },
    {
      "id": 2,
      "name": "Item 2",
      "description": "This is the second item"
    }
  ]
}
```

### POST /items

Creates a new item.

**Request Body:**
```json
{
  "name": "New Item",
  "description": "Description of the new item"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "New Item",
    "description": "Description of the new item"
  }
}
```

## Build for Production

To build the project for production:

```
npm run build
```

This will compile the TypeScript code to JavaScript in the `dist` directory.

To start the production server:

```
npm start
```