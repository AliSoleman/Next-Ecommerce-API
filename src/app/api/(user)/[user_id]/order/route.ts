import { NextResponse, NextRequest } from "next/server";
import db from '@/app/lib/db'

export async function POST(req: NextRequest) {
    try {
        const { pathname } = new URL(req.url);
        const p = pathname.split('/');
        p.pop();
        const user_id = p.pop();
        const { items } = await req.json();
        console.log(items);
        const isExistUser = await db.query('SELECT * FROM Users WHERE id = $1', [user_id]);
        if (isExistUser.rows.length === 0) {
            return NextResponse.json({ message: "This user does not exist" }, { status: 404 });
        }
        // Begin transaction
        await db.query('BEGIN');
        const orderResult = await db.query('INSERT INTO Orders (user_id , total_price) VALUES ($1 , $2) RETURNING id', [user_id, 0]);
        const orderId = orderResult.rows[0].id;

        let totalAmount = 0;
        for (const item of items) {
            const productResult = await db.query('SELECT price FROM Products WHERE id = $1', [item.productId]);
            const unitPrice = productResult.rows[0].price;
            const subtotal = unitPrice * item.quantity;
            await db.query(
                'INSERT INTO Order_Items (order_id, product_id, quantity, unit_price)  VALUES ($1, $2, $3, $4)',
                [orderId, item.productId, item.quantity, unitPrice]
            );
            totalAmount += subtotal;
        }
        await db.query(
            'UPDATE Orders SET total_price = $1 WHERE id = $2',
            [totalAmount, orderId]
        );

        // Commit transaction
        await db.query('COMMIT');
        return NextResponse.json({ message: 'Order created successfully' }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { pathname } = new URL(req.url);
        const p = pathname.split('/');
        p.pop();
        const user_id = p.pop();
        
        // Check if user exists
        const isExistUser = await db.query('SELECT * FROM Users WHERE id = $1', [user_id]);
        if (isExistUser.rows.length === 0) {
            return NextResponse.json({ message: "This user does not exist" }, { status: 404 });
        }

        // Get all orders for the user with their items
        const orders = await db.query(
            `SELECT 
                o.id, 
                o.total_price, 
                o.status, 
                o.created_at,
                json_agg(
                    json_build_object(
                        'product_id', oi.product_id,
                        'product_name', p.name,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'subtotal', oi.subtotal
                    )
                ) as items
            FROM Orders o
            JOIN Order_Items oi ON o.id = oi.order_id
            JOIN Products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC`,
            [user_id]
        );

        return NextResponse.json(orders.rows, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "unknown error";
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
