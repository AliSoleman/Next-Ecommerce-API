import { NextResponse , NextRequest } from "next/server";
import db from '@/app/lib/db'
import bcrypt from "bcryptjs";

export async function POST ( req : NextRequest ) {
    try {
       const {name , email , password} = await req.json();
       if ( !name || !email || !password ) {
        return NextResponse.json({message : "name , email , and password are required"} , {status : 400});
       }
       const isExistEmail = await db.query('SELECT * FROM Users WHERE email = $1' , [email]);
       if ( isExistEmail.rows.length !== 0 ) {
        return NextResponse.json({message : "User already exist"} , {status : 400});
       }
       const hashPassword = await bcrypt.hash(password , await bcrypt.genSalt(10) );
       const newUser = await db.query("INSERT INTO Users (name , email , password) VALUES ($1 ,$2 , $3) RETURNING *" , [name , email , hashPassword]);
       return NextResponse.json({message : newUser}  , {status : 200});
    } catch ( error ) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({message : errorMessage} , {status  : 500});
    }
}