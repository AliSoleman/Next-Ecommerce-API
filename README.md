This is a [Next.js](https://nextjs.org) project

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# E-Commerce API

A RESTful API for an e-commerce platform built with Next.js and PostgreSQL.

## Features

- User authentication and authorization
- Product catalog management
- Order processing
- User order history

## Database Schema

### Tables

1. **Users**
   - Stores user information including name, email, password, and role
   - Roles: 'customer' (default) or 'admin'

2. **Categories**
   - Product categories

3. **Products**
   - Product information including price, stock, and category

4. **Orders**
   - Order headers with total price and status
   - Statuses: 'pending' (default), 'completed', 'cancelled'

5. **Order_Items**
   - Individual items within an order
   - Stores price at time of purchase (unit_price)
   - Automatically calculates subtotal (quantity × unit_price)

## API Endpoints

### Orders

#### Create an Order
`POST /api/[user_id]/orders`

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}




