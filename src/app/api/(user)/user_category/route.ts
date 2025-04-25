import { NextRequest, NextResponse } from "next/server";
import db from '@/app/lib/db'

// Get all categories
export const GET = async (req: NextRequest) => {
    try {
        const { rows } = await db.query('SELECT * FROM Categories', []);
        return NextResponse.json( { message: rows }, { status: 200 } );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknonw error";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}