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

- ✅ User authentication and authorization  
- 🛍️ Product catalog management  
- 📦 Order processing system  
- 📊 User order history  

## Database Schema

### Tables Structure

| Table        | Description |
|--------------|-------------|
| **Users**    | Stores user credentials and roles (customer/admin) |
| **Categories** | Product classification |
| **Products** | Items with price, stock, and category |
| **Orders**   | Customer purchases with status tracking |
| **Order_Items** | Individual ordered products with price snapshots |



