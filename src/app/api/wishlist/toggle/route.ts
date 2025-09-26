import { NextRequest, NextResponse } from 'next/server';

// Mock wishlist storage (in production, use database with user sessions)
let wishlistStorage: Record<string, number[]> = {};

// Mock products for validation
const products = [
  { id: 1, name: "PS England Premium Jacket", price: 89.99, inStock: true },
  { id: 2, name: "PS England Casual Shirt", price: 27.24, inStock: true },
  { id: 3, name: "PS England Classic Shoes", price: 37.24, inStock: true },
  { id: 4, name: "PS England Premium T-Shirt", price: 15.99, inStock: true },
  { id: 5, name: "PS England Sport Sneakers", price: 43.67, inStock: true },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, userId = 'guest' } = body;

    // Validate required fields
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 150));

    // Find product
    const product = products.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Initialize user wishlist if it doesn't exist
    if (!wishlistStorage[userId]) {
      wishlistStorage[userId] = [];
    }

    const userWishlist = wishlistStorage[userId];
    const isInWishlist = userWishlist.includes(productId);

    if (isInWishlist) {
      // Remove from wishlist
      const index = userWishlist.indexOf(productId);
      userWishlist.splice(index, 1);

      return NextResponse.json({
        message: 'Product removed from wishlist',
        isInWishlist: false,
        productId,
        wishlistCount: userWishlist.length
      });

    } else {
      // Add to wishlist
      userWishlist.push(productId);

      return NextResponse.json({
        message: 'Product added to wishlist',
        isInWishlist: true,
        productId,
        wishlistCount: userWishlist.length
      });
    }

  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'guest';

    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Get user's wishlist
    const userWishlist = wishlistStorage[userId] || [];

    // Get full product details for wishlist items
    const wishlistProducts = products
      .filter(product => userWishlist.includes(product.id))
      .map(product => ({
        ...product,
        addedAt: new Date().toISOString(), // In production, store actual timestamp
      }));

    return NextResponse.json({
      wishlist: wishlistProducts,
      count: wishlistProducts.length,
      userId
    });

  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}