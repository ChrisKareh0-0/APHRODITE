import { NextRequest, NextResponse } from 'next/server';

// Mock products database
const products = [
  {
    id: 1,
    name: "PS England Premium Jacket",
    price: 89.99,
    originalPrice: 120.00,
    description: "Discover our premium clothing collection featuring the latest trends in fashion. This jacket combines comfort, style, and durability for the modern wardrobe.",
    category: "Clothing",
    brand: "PS England",
    rating: 4.5,
    reviewCount: 128,
    images: ["https://i.postimg.cc/76X9ZV8m/Screenshot_from_2022-06-03_18-45-12.png"],
    colors: ["Black", "Navy", "Gray", "Brown"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: 15,
    tags: ["premium", "winter", "jacket", "water-resistant"],
    featured: true,
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "PS England Casual Shirt",
    price: 27.24,
    originalPrice: 35.00,
    description: "A comfortable and stylish casual shirt perfect for everyday wear. Made from high-quality cotton.",
    category: "Clothing",
    brand: "PS England",
    rating: 4.2,
    reviewCount: 85,
    images: ["https://i.postimg.cc/j2FhzSjf/bs2.png"],
    colors: ["White", "Blue", "Light Gray"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    stockCount: 25,
    tags: ["casual", "cotton", "shirt", "everyday"],
    featured: false,
    createdAt: "2024-01-02T00:00:00Z"
  },
  {
    id: 3,
    name: "PS England Classic Shoes",
    price: 37.24,
    description: "Step into style with our classic shoes. Perfect blend of comfort and elegance.",
    category: "Shoes",
    brand: "PS England",
    rating: 4.0,
    reviewCount: 64,
    images: ["https://i.postimg.cc/8CmBZH5N/shoes.webp"],
    colors: ["Black", "Brown", "Dark Brown"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    inStock: true,
    stockCount: 12,
    tags: ["classic", "leather", "formal", "durable"],
    featured: true,
    createdAt: "2024-01-03T00:00:00Z"
  },
  {
    id: 4,
    name: "PS England Premium T-Shirt",
    price: 15.99,
    description: "Comfortable cotton t-shirt perfect for casual wear.",
    category: "Clothing",
    brand: "PS England",
    rating: 4.8,
    reviewCount: 156,
    images: ["https://i.postimg.cc/fbnB2yfj/na1.png"],
    colors: ["Black", "White", "Gray", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    stockCount: 50,
    tags: ["casual", "cotton", "comfortable", "basic"],
    featured: false,
    createdAt: "2024-01-04T00:00:00Z"
  },
  {
    id: 5,
    name: "PS England Sport Sneakers",
    price: 43.67,
    description: "Athletic sneakers designed for performance and style.",
    category: "Shoes",
    brand: "PS England",
    rating: 4.6,
    reviewCount: 92,
    images: ["https://i.postimg.cc/QtjSDzPF/bs3.png"],
    colors: ["White", "Black", "Gray"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    inStock: true,
    stockCount: 18,
    tags: ["sport", "sneakers", "comfortable", "athletic"],
    featured: true,
    createdAt: "2024-01-05T00:00:00Z"
  },
  {
    id: 6,
    name: "PS England Designer Bag",
    price: 9.28,
    description: "Stylish designer bag perfect for any occasion.",
    category: "Accessories",
    brand: "PS England",
    rating: 3.8,
    reviewCount: 34,
    images: ["https://i.postimg.cc/zD02zJq8/na2.png"],
    colors: ["Black", "Brown", "Navy"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 8,
    tags: ["accessories", "bag", "stylish", "compact"],
    featured: false,
    createdAt: "2024-01-06T00:00:00Z"
  },
  {
    id: 7,
    name: "PS England Sunglasses",
    price: 6.24,
    description: "Premium sunglasses with UV protection.",
    category: "Accessories",
    brand: "PS England",
    rating: 4.9,
    reviewCount: 78,
    images: ["https://i.postimg.cc/Dfj5VBcz/sunglasses1.jpg"],
    colors: ["Black", "Brown", "Silver"],
    sizes: ["One Size"],
    inStock: true,
    stockCount: 22,
    tags: ["accessories", "sunglasses", "uv-protection", "stylish"],
    featured: false,
    createdAt: "2024-01-07T00:00:00Z"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
    const sortBy = searchParams.get('sortBy') || 'created';
    const orderBy = searchParams.get('orderBy') || 'desc';
    const inStockOnly = searchParams.get('inStockOnly') === 'true';
    const featured = searchParams.get('featured') === 'true';

    // Simulate database query delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Filter products
    let filteredProducts = [...products];

    // Text search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Brand filter
    if (brand) {
      filteredProducts = filteredProducts.filter(product =>
        product.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    // Price range filter
    filteredProducts = filteredProducts.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    );

    // Stock filter
    if (inStockOnly) {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }

    // Featured filter
    if (featured) {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'reviews':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (orderBy === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });

    // Pagination
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Add computed fields to products
    const productsWithComputedFields = paginatedProducts.map(product => ({
      ...product,
      discount: product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0,
      availability: product.inStock
        ? (product.stockCount > 5 ? 'In Stock' : 'Limited Stock')
        : 'Out of Stock'
    }));

    // Get filter options for UI
    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];
    const priceRange = {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price))
    };

    return NextResponse.json({
      products: productsWithComputedFields,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: endIndex < total,
        hasPrev: page > 1
      },
      filters: {
        categories,
        brands,
        priceRange,
        appliedFilters: {
          search,
          category,
          brand,
          minPrice,
          maxPrice,
          sortBy,
          orderBy,
          inStockOnly,
          featured
        }
      },
      metadata: {
        totalProducts: products.length,
        searchQuery: search,
        resultsCount: total
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}