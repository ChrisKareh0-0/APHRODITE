import { NextRequest, NextResponse } from 'next/server';

// Mock cart storage (in production, use database with user sessions)
let cartStorage: Record<string, any[]> = {};

// Mock products for validation
const products = [
  { id: 1, name: "PS England Premium Jacket", price: 89.99, stockCount: 15, inStock: true },
  { id: 2, name: "PS England Casual Shirt", price: 27.24, stockCount: 25, inStock: true },
  { id: 3, name: "PS England Classic Shoes", price: 37.24, stockCount: 12, inStock: true },
  { id: 4, name: "PS England Premium T-Shirt", price: 15.99, stockCount: 50, inStock: true },
  { id: 5, name: "PS England Sport Sneakers", price: 43.67, stockCount: 18, inStock: true },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1, color, size, userId = 'guest' } = body;

    // Validate required fields
    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid product ID or quantity' },
        { status: 400 }
      );
    }

    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Find product
    const product = products.find(p => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check stock availability
    if (!product.inStock) {
      return NextResponse.json(
        { error: 'Product is out of stock' },
        { status: 400 }
      );
    }

    // Initialize user cart if it doesn't exist
    if (!cartStorage[userId]) {
      cartStorage[userId] = [];
    }

    const userCart = cartStorage[userId];

    // Check if item already exists in cart (same product, color, size)
    const existingItemIndex = userCart.findIndex(item =>
      item.productId === productId &&
      item.color === color &&
      item.size === size
    );

    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      const existingItem = userCart[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      // Check if new quantity exceeds stock
      if (newQuantity > product.stockCount) {
        return NextResponse.json(
          {
            error: `Only ${product.stockCount} items available in stock`,
            availableQuantity: product.stockCount - existingItem.quantity
          },
          { status: 400 }
        );
      }

      userCart[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        message: 'Cart updated successfully',
        item: userCart[existingItemIndex],
        cartTotal: calculateCartTotal(userCart)
      });

    } else {
      // Add new item to cart
      if (quantity > product.stockCount) {
        return NextResponse.json(
          {
            error: `Only ${product.stockCount} items available in stock`,
            availableQuantity: product.stockCount
          },
          { status: 400 }
        );
      }

      const newItem = {
        id: Date.now(), // In production, use proper ID generation
        productId,
        productName: product.name,
        price: product.price,
        quantity,
        color: color || null,
        size: size || null,
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      userCart.push(newItem);

      return NextResponse.json({
        message: 'Item added to cart successfully',
        item: newItem,
        cartTotal: calculateCartTotal(userCart)
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateCartTotal(cart: any[]) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal: Number(subtotal.toFixed(2)),
    itemCount,
    tax: Number((subtotal * 0.08).toFixed(2)), // 8% tax
    total: Number((subtotal * 1.08).toFixed(2))
  };
}