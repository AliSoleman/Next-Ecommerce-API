import { NextRequest , NextResponse } from "next/server";
import db from '@/app/lib/db'

// get all products related to this category
export const GET = async ( req : NextRequest ) => {
  try {
     const {pathname} = new URL (req.url);
     const category_id = pathname.split('/').pop();
     const isExist = await db.query('SELECT * FROM Categories WHERE id = $1' , [category_id]);
     if ( isExist.rows.length === 0 ) {
       return NextResponse.json({message : "Invalid Category"} , {status : 404});
     }
     const {rows} = await db.query('SELECT * FROM Products WHERE category_id = $1' , [category_id]);
     return NextResponse.json({message : rows} , {status : 200});

  } catch ( error ) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({message : errorMessage} , {status : 500});
  }
}