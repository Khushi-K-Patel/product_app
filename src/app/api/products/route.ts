import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

// Add or Update Product Count
export async function POST(request: NextRequest) {
    await dbConnect();
    const { name, count } = await request.json();

    if (!name || typeof count !== 'number') {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Check if the product already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
        existingProduct.count += count;
        await existingProduct.save();
        return NextResponse.json(existingProduct, { status: 200 });
    }

    // Create a new product
    const newProduct = await Product.create({ name, count });
    return NextResponse.json(newProduct, { status: 201 });
}

// Get All Products or Specific Product by Name
// export async function GET(request: NextRequest) {
//     await dbConnect();
//    // Extract search params from the URL
//    const { searchParams } = new URL(request.url);
//    const name = searchParams.get('name');

//     if (name) {
//         const product = await Product.findOne({ name });
//         if (!product) {
//             return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//         }
//         return NextResponse.json(product, { status: 200 });
//     }

//     // Fetch all products if no name is provided
//     const products = await Product.find({});
//     return NextResponse.json(products, { status: 200 });
// }


export async function GET(request: NextRequest) {
    await dbConnect();

    // Extract search params from the URL
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    let query = {};
    if (name) {
        query = { name };
    } else if (search) {
        query = { name: { $regex: search, $options: 'i' } };
    }

    try {
        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip(skip)
            .limit(limit)
            .lean();

        const totalPages = Math.ceil(totalProducts / limit);

        return NextResponse.json({
            products,
            currentPage: page,
            totalPages,
            totalItems: totalProducts
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Update Product by Name
export async function PUT(request: NextRequest) {
    await dbConnect();
    const { name, newName, count } = await request.json();
    // Validate input: At least the current name is required
    if (!name || (newName == null && count == null)) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Find the product by its current name
    const product = await Product.findOne({ name });

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if any changes are being made
    const isNameUnchanged = !newName;
    const isCountUnchanged = count == product.count;

    if (isNameUnchanged && isCountUnchanged) {
        return NextResponse.json({ error: 'At least one change is required' }, { status: 400 });
    }

    // Update fields if provided
    if (newName) product.name = newName;
    if (count !== undefined) product.count = count;

    // Save the updated product
    await product.save();
    return NextResponse.json(product, { status: 200 });
}




// Delete Product by Name
export async function DELETE(request: NextRequest) {
    await dbConnect();
    const { productName:name } = await request.json();

    if (!name) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const product = await Product.findOneAndDelete({ name });
    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
}
