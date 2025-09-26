import { NextRequest, NextResponse } from 'next/server';

// Mock database - In production, replace with real database
const products = [
  {
    id: 1,
    name: "PS England Premium Jacket",
    price: 89.99,
    originalPrice: 120.00,
    description: "Discover our premium clothing collection featuring the latest trends in fashion. This jacket combines comfort, style, and durability for the modern wardrobe. Crafted with attention to detail and high-quality materials.",
    category: "Clothing",
    brand: "PS England",
    rating: 4.5,
    reviewCount: 128,
    images: [
      "https://i.postimg.cc/76X9ZV8m/Screenshot_from_2022-06-03_18-45-12.png",
      "https://i.postimg.cc/j2FhzSjf/bs2.png",
      "https://i.postimg.cc/fbnB2yfj/na1.png",
      "https://i.postimg.cc/8CmBZH5N/shoes.webp"
    ],
    colors: ["Black", "Navy", "Gray", "Brown"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: 15,
    features: [
      "Premium quality fabric",
      "Water-resistant coating",
      "Multiple pockets",
      "Adjustable cuffs",
      "Breathable lining"
    ],
    specifications: {
      "Material": "Cotton blend",
      "Care": "Machine washable",
      "Origin": "Made in England",
      "Weight": "850g",
      "Season": "All seasons"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "PS England Casual Shirt",
    price: 27.24,
    originalPrice: 35.00,
    description: "A comfortable and stylish casual shirt perfect for everyday wear. Made from high-quality cotton with excellent fit and finish.",
    category: "Clothing",
    brand: "PS England",
    rating: 4.2,
    reviewCount: 85,
    images: [
      "https://i.postimg.cc/j2FhzSjf/bs2.png",
      "https://i.postimg.cc/76X9ZV8m/Screenshot_from_2022-06-03_18-45-12.png"
    ],
    colors: ["White", "Blue", "Light Gray"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    stockCount: 25,
    features: [
      "100% Cotton",
      "Regular fit",
      "Easy care",
      "Versatile design"
    ],
    specifications: {
      "Material": "100% Cotton",
      "Care": "Machine washable",
      "Fit": "Regular",
      "Collar": "Button-down"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "PS England Classic Shoes",
    price: 37.24,
    description: "Step into style with our classic shoes. Perfect blend of comfort and elegance for any occasion.",
    category: "Shoes",
    brand: "PS England",
    rating: 4.0,
    reviewCount: 64,
    images: [
      "https://i.postimg.cc/8CmBZH5N/shoes.webp",
      "https://i.postimg.cc/QtjSDzPF/bs3.png"
    ],
    colors: ["Black", "Brown", "Dark Brown"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    inStock: true,
    stockCount: 12,
    features: [
      "Genuine leather",
      "Comfortable sole",
      "Durable construction",
      "Classic design"
    ],
    specifications: {
      "Material": "Genuine leather",
      "Sole": "Rubber",
      "Style": "Classic",
      "Care": "Polish regularly"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const product = products.find(p => p.id === productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Add some metadata
    const productWithMetadata = {
      ...product,
      views: Math.floor(Math.random() * 1000) + 100,
      lastUpdated: product.updatedAt,
      availability: product.inStock ? 'In Stock' : 'Out of Stock'
    };

    return NextResponse.json(productWithMetadata);

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const body = await request.json();

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Simulate database update delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product (in production, validate and sanitize input)
    products[productIndex] = {
      ...products[productIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(products[productIndex]);

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}