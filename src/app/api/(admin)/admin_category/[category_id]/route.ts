import { NextResponse, NextRequest } from "next/server";
import db from '@/app/lib/db'

export async function POST(req: NextRequest) {
    try {
        const { pathname } = new URL(req.url);
        const category_id = pathname.split('/').pop();
        const { name, description, price, stock } = await req.json();

        if (!category_id || isNaN(Number(category_id))) {
            return NextResponse.json(
                { message: "Invalid category ID" },
                { status: 400 }
            );
        }

        if (!name || !description || price === undefined || stock === undefined) {
            return NextResponse.json(
                { message: "All fields (name, description, price, stock) are required" },
                { status: 400 }
            );
        }

        const categoryCheck = await db.query(
            'SELECT id FROM Categories WHERE id = $1',
            [category_id]
        );

        if (categoryCheck.rows.length === 0) {
            return NextResponse.json(
                { message: "Category does not exist" },
                { status: 404 }
            );
        }

        const productInsert = await db.query(
            `INSERT INTO Products 
           (name, description, price, stock, category_id) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING *`,
            [name, description, price, stock, category_id]
        );

        return NextResponse.json(
            {
                message: "Product created successfully",
                product: productInsert.rows[0]
            },
            { status: 201 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "unknown error";
        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { pathname } = new URL(req.url);
        const category_id = pathname.split('/').pop();

        const deleteProducts = await db.query(
            'DELETE FROM Products WHERE category_id = $1 RETURNING id',
            [category_id]
        );
        const deleteCategory = await db.query(
            'DELETE FROM Categories WHERE id = $1 RETURNING id',
            [category_id]
        );
        return NextResponse.json(
            {
                success: true,
                message: "Category and associated products deleted successfully",
                deleted_category_id: category_id,
                deleted_products_count: deleteProducts.rowCount
            },
            { status: 200 }
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: errorMessage },
            { status: 500 }
        );
    }
}


export async function PATCH ( req : NextRequest ) {
    try {
        const { pathname } = new URL(req.url);
        const category_id = pathname.split('/').pop();
        const { name } = await req.json();

        if (!category_id || isNaN(Number(category_id))) {
            return NextResponse.json(
                { message: "Invalid category ID" },
                { status: 400 }
            );
        }
        if (!name) {
            return NextResponse.json(
                { message: "Category name is required" },
                { status: 400 }
            );
        }
        const categoryCheck = await db.query('SELECT id FROM Categories WHERE id = $1',[category_id]);
        if (categoryCheck.rows.length === 0) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        const updatedCategory = await db.query(
            'UPDATE Categories SET name = $1 WHERE id = $2 RETURNING *',
            [name, category_id]
        );

        return NextResponse.json(
            {
                success: true,
                message: "Category name updated successfully",
                category: updatedCategory.rows[0]
            },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "unknowon error";
        return NextResponse.json(
            {message : errorMessage},
            {status : 500}
        );
    }
}