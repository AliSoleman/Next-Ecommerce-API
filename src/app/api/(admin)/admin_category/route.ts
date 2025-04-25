import { NextResponse, NextRequest } from "next/server";
import db from '@/app/lib/db'

export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();
        if (!name || typeof name !== 'string') {
            return NextResponse.json(
                { message: "Category name is required and must be a string" },
                { status: 400 }
            );
        }
        const { rows } = await db.query("INSERT INTO Categories (name) VALUES ($1) RETURNING *", [name]);
        return NextResponse.json(
            { message: rows[0] },
            { status: 200 }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}