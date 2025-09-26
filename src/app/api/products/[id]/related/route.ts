import { NextRequest, NextResponse } from 'next/server';

// Mock products database (same as main products)
const products = [
  {
    id: 1,
    name: "PS England Premium Jacket",
    price: 89.99,
    originalPrice: 120.00,
    category: "Clothing",
    brand: "PS England",
    rating: 4.5,
    reviewCount: 128,
    images: ["https://i.postimg.cc/76X9ZV8m/Screenshot_from_2022-06-03_18-45-12.png"],
    tags: ["premium", "winter", "jacket", "water-resistant"],
    colors: ["Black", "Navy", "Gray", "Brown"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: 15
  },
  {
    id: 2,
    name: "PS England Casual Shirt",
    price: 27.24,
    originalPrice: 35.00,
    category: "Clothing",
    brand: "PS England",
    rating: 4.2,
    reviewCount: 85,
    images: ["https://i.postimg.cc/j2FhzSjf/bs2.png"],
    tags: ["casual", "cotton", "shirt", "everyday"],
    colors: ["White", "Blue", "Light Gray"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    stockCount: 25
  },
  {
    id: 3,
    name: "PS England Classic Shoes",
    price: 37.24,
    category: "Shoes",
    brand: "PS England",
    rating: 4.0,
    reviewCount: 64,
    images: ["https://i.postimg.cc/8CmBZH5N/shoes.webp"],
    tags: ["classic", "leather", "formal", "durable"],
    colors: ["Black", "Brown", "Dark Brown"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    inStock: true,
    stockCount: 12
  },
  {
    id: 4,
    name: "PS England Premium T-Shirt",
    price: 15.99,
    category: "Clothing",
    brand: "PS England",
    rating: 4.8,
    reviewCount: 156,
    images: ["https://i.postimg.cc/fbnB2yfj/na1.png"],
    tags: ["casual", "cotton", "comfortable", "basic"],
    colors: ["Black", "White", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: 50
  },
  {
    id: 5,
    name: "PS England Sport Sneakers",
    price: 43.67,
    category: "Shoes",
    brand: "PS England",
    rating: 4.6,
    reviewCount: 92,
    images: ["https://i.postimg.cc/QtjSDzPF/bs3.png"],
    tags: ["sport", "sneakers", "comfortable", "casual"],
    colors: ["White", "Black", "Gray"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    inStock: true,
    stockCount: 18
  },
  {
    id: 6,
    name: "PS England Designer Bag",
    price: 9.28,
    category: "Accessories",
    brand: "PS England",
    rating: 3.8,
    reviewCount: 34,
    images: ["https://i.postimg.cc/zD02zJq8/na2.png"],
    tags: ["accessories", "bag", "stylish", "compact"],
    colors: ["Black", "Brown", "Navy"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 8
  },
  {
    id: 7,
    name: "PS England Sunglasses",
    price: 6.24,
    category: "Accessories",
    brand: "PS England",
    rating: 4.9,
    reviewCount: 78,
    images: ["https://i.postimg.cc/Dfj5VBcz/sunglasses1.jpg"],
    tags: ["accessories", "sunglasses", "uv-protection", "stylish"],
    colors: ["Black", "Brown", "Silver"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 22
  }
];

function calculateSimilarityScore(product1: any, product2: any): number {
  let score = 0;

  // Same category gets high score
  if (product1.category === product2.category) {
    score += 50;
  }

  // Same brand gets medium score
  if (product1.brand === product2.brand) {
    score += 30;
  }

  // Similar price range gets medium score
  const priceDiff = Math.abs(product1.price - product2.price);
  const avgPrice = (product1.price + product2.price) / 2;
  const priceSimiliarity = Math.max(0, 1 - (priceDiff / avgPrice));
  score += priceSimiliarity * 20;

  // Common tags get bonus points
  const commonTags = product1.tags?.filter((tag: string) =>
    product2.tags?.includes(tag)
  ) || [];
  score += commonTags.length * 10;

  // Similar ratings get small bonus
  const ratingDiff = Math.abs(product1.rating - product2.rating);
  const ratingScore = Math.max(0, 1 - (ratingDiff / 5));
  score += ratingScore * 5;

  return score;
}

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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4');

    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const currentProduct = products.find(p => p.id === productId);

    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate similarity scores for all other products
    const otherProducts = products.filter(p => p.id !== productId);

    const relatedProducts = otherProducts
      .map(product => ({
        ...product,
        similarityScore: calculateSimilarityScore(currentProduct, product)
      }))
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit)
      .map(({ similarityScore, ...product }) => ({
        ...product,
        // Add some additional computed fields
        discount: product.originalPrice
          ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
          : 0,
        isPopular: product.reviewCount > 80,
        isNew: product.id > Math.max(...products.map(p => p.id)) - 2,
        availability: product.inStock
          ? (product.stockCount > 5 ? 'In Stock' : 'Limited Stock')
          : 'Out of Stock'
      }));

    return NextResponse.json({
      products: relatedProducts,
      metadata: {
        basedOn: currentProduct.name,
        algorithm: 'similarity-based',
        factors: [
          'Same category',
          'Same brand',
          'Similar price range',
          'Common tags',
          'Similar ratings'
        ]
      }
    });

  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}