import { NextResponse, NextRequest } from "next/server";
import db from '@/app/lib/db'

export async function GET(req: NextRequest) {
    try {
        const { pathname } = new URL(req.url);
        const p = pathname.split('/');
        const product_id = p.pop();
        const category_id = p.pop();
        const isExistCategory = await db.query('SELECT * FROM Categories WHERE id = $1', [category_id]);
        if (isExistCategory.rows.length === 0) {
            return NextResponse.json({ message: "Invalid category_id" }, { status: 404 });
        }
        const isExistProduct = await db.query('SELECT * FROM Products WHERE id = $1', [product_id]);
        if (isExistProduct.rows.length === 0) {
            return NextResponse.json({ message: "Invalid product_id" }, { status: 404 });
        }

        return NextResponse.json({ message: isExistProduct.rows }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown Error";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}