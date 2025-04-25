import { NextRequest, NextResponse } from "next/server";
import db from '@/app/lib/db'

export async function DELETE(req: NextRequest) {
    try {
        const { pathname } = new URL(req.url);
        const p = pathname.split('/');
        const product_id = p.pop();
        const category_id = p.pop();

        const isExistCategory = await db.query(
            'SELECT * FROM Categories WHERE id = $1', [category_id]
        );
        if (isExistCategory.rows.length === 0) {
            return NextResponse.json(
                { message: "Invalid Category" },
                { status: 400 }
            );
        }

        const isExistProduct = await db.query(
            'SELECT * FROM Products WHERE id = $1', [product_id]
        );
        if (isExistProduct.rows.length === 0) {
            return NextResponse.json(
                { message: "Invalid Product" },
                { status: 400 }
            );
        }
        const deleteProducts = await db.query(
            'DELETE FROM Products WHERE category_id = $1 RETURNING id',
            [category_id]
        );
        return NextResponse.json(
            {
                success: true,
                message: "Product deleted successfully",
                deleted_product_id: product_id,
            },
            { status: 200 }
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "unknown error";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}


export async function PATCH(req: NextRequest) {
    try {
        const { pathname } = new URL(req.url);
        const pathSegments = pathname.split('/').filter(Boolean); // Filter out empty segments
        const product_id = pathSegments.pop();
        const category_id = pathSegments.pop();

        if (!category_id || !product_id || isNaN(Number(category_id)) || isNaN(Number(product_id))) {
            return NextResponse.json(
                { success: false, message: "Invalid category or product ID" },
                { status: 400 }
            );
        }

        const { name, description, price, stock } = await req.json();
        
        if (!name || !description || price === undefined || stock === undefined) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        if (price < 0 || stock < 0) {
            return NextResponse.json(
                { success: false, message: "Price and stock must be positive values" },
                { status: 400 }
            );
        }

        const categoryCheck = await db.query(
            'SELECT id FROM Categories WHERE id = $1', 
            [category_id]
        );
        
        if (categoryCheck.rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        const productCheck = await db.query(
            'SELECT id FROM Products WHERE id = $1 AND category_id = $2', 
            [product_id, category_id]
        );
        
        if (productCheck.rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "Product not found in specified category" },
                { status: 404 }
            );
        }

        const { rows: [updatedProduct] } = await db.query(
            `UPDATE Products 
             SET name = $1, 
                 description = $2, 
                 price = $3, 
                 stock = $4,
                 updated_at = NOW()
             WHERE id = $5
             RETURNING id, name, description, price, stock, category_id`,
            [name, description, price, stock, product_id]
        );

        return NextResponse.json(
            {
                success: true,
                message: "Product updated successfully",
                data: updatedProduct
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating product:', error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 500 }
        );
    }
}