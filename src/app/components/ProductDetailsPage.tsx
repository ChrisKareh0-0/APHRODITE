"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import CenterNavbar from "./CenterNavbar";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: string[];
  sizes: string[];
  inStock: boolean;
  stockCount: number;
  features: string[];
  specifications: Record<string, string>;
}

interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ProductDetailsPageProps {
  productId: number;
}

export default function ProductDetailsPage({ productId }: ProductDetailsPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews();
    fetchRelatedProducts();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProduct(data);
      setSelectedColor(data.colors?.[0] || "");
      setSelectedSize(data.sizes?.[0] || "");
    } catch (err) {
      console.error('Error fetching product:', err);
      // Fallback to mock data for development
      setProduct(getMockProduct(productId));
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      // Fallback to mock reviews
      setReviews(getMockReviews());
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/related`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRelatedProducts(data);
    } catch (err) {
      console.error('Error fetching related products:', err);
      // Fallback to mock related products
      setRelatedProducts(getMockRelatedProducts());
    }
  };

  const addToCart = async () => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
          color: selectedColor,
          size: selectedSize
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const result = await response.json();

      // Show success notification
      showNotification('Product added to cart!', 'success');
    } catch (err) {
      console.error('Error adding to cart:', err);
      showNotification('Failed to add to cart', 'error');
    }
  };

  const toggleWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle wishlist');
      }

      setIsWishlisted(!isWishlisted);
      showNotification(
        isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
        'success'
      );
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      showNotification('Failed to update wishlist', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Simple notification implementation
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`bx ${i < rating ? 'bxs-star' : 'bx-star'}`}></i>
    ));
  };

  // Mock data functions (fallback for development)
  const getMockProduct = (id: number): Product => ({
    id,
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
    }
  });

  const getMockReviews = (): Review[] => [
    {
      id: 1,
      userId: 101,
      userName: "Sarah Johnson",
      rating: 5,
      comment: "Amazing quality! The jacket fits perfectly and looks exactly as shown. Highly recommend!",
      date: "2024-01-15",
      verified: true
    },
    {
      id: 2,
      userId: 102,
      userName: "Mike Chen",
      rating: 4,
      comment: "Great jacket, good value for money. Only wish it came in more colors.",
      date: "2024-01-10",
      verified: true
    },
    {
      id: 3,
      userId: 103,
      userName: "Emma Davis",
      rating: 5,
      comment: "Perfect for the winter season. Very warm and stylish. Will definitely buy again!",
      date: "2024-01-08",
      verified: false
    }
  ];

  const getMockRelatedProducts = (): Product[] => [
    {
      id: 2,
      name: "PS England Shirt",
      price: 27.24,
      description: "Casual shirt perfect for everyday wear",
      category: "Clothing",
      brand: "PS England",
      rating: 4,
      reviewCount: 85,
      images: ["https://i.postimg.cc/j2FhzSjf/bs2.png"],
      colors: ["White", "Blue"],
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
      stockCount: 25,
      features: [],
      specifications: {}
    },
    {
      id: 3,
      name: "PS England T-Shirt",
      price: 15.99,
      description: "Comfortable cotton t-shirt",
      category: "Clothing",
      brand: "PS England",
      rating: 5,
      reviewCount: 156,
      images: ["https://i.postimg.cc/fbnB2yfj/na1.png"],
      colors: ["Black", "White", "Gray"],
      sizes: ["S", "M", "L", "XL"],
      inStock: true,
      stockCount: 30,
      features: [],
      specifications: {}
    }
  ];

  if (loading) {
    return (
      <div className="product-details-loading">
        <CenterNavbar />
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <CenterNavbar />
        <div className="error-message">
          <i className="bx bx-error"></i>
          <h2>Product Not Found</h2>
          <p>Sorry, we couldn&apos;t find the product you&apos;re looking for.</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CenterNavbar />
      <div className="main-content">
        <div className="product-details-page">
        <div className="product-details-container">

          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <i className="bx bx-chevron-right"></i>
            <Link href="/shop">{product.category}</Link>
            <i className="bx bx-chevron-right"></i>
            <span>{product.name}</span>
          </div>

          {/* Main Product Section */}
          <div className="product-main">

            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="main-image">
                <Image src={product.images[selectedImage]} alt={product.name} width={500} height={500} />
                <button
                  className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={toggleWishlist}
                >
                  <i className={`bx ${isWishlisted ? 'bxs-heart' : 'bx-heart'}`}></i>
                </button>
              </div>
              <div className="thumbnail-gallery">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image src={image} alt={`${product.name} ${index + 1}`} width={100} height={100} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div className="product-header">
                <h1>{product.name}</h1>
                <div className="product-brand">{product.brand}</div>
              </div>

              <div className="product-rating">
                <div className="stars">
                  {renderStars(Math.floor(product.rating))}
                  <span className="rating-text">({product.rating})</span>
                </div>
                <span className="review-count">{product.reviewCount} reviews</span>
              </div>

              <div className="product-price">
                <span className="current-price">${product.price}</span>
                {product.originalPrice && (
                  <span className="original-price">${product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <span className="discount">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              <div className="product-description">
                <p>{product.description}</p>
              </div>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="product-options">
                  <h3>Color</h3>
                  <div className="color-options">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`color-option ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                      >
                        <span className="color-name">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="product-options">
                  <h3>Size</h3>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-option ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="product-options">
                <h3>Quantity</h3>
                <div className="quantity-selector">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <i className="bx bx-minus"></i>
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                  >
                    <i className="bx bx-plus"></i>
                  </button>
                </div>
                <span className="stock-info">
                  {product.stockCount > 5 ? 'In Stock' : `Only ${product.stockCount} left`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="add-to-cart-btn"
                  onClick={addToCart}
                  disabled={!product.inStock}
                >
                  <i className="bx bx-shopping-bag"></i>
                  Add to Cart
                </button>
                <button className="buy-now-btn">
                  Buy Now
                </button>
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div className="product-features">
                  <h3>Key Features</h3>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>
                        <i className="bx bx-check"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="product-tabs">
            <div className="tab-headers">
              <button
                className={`tab-header ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`tab-header ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button
                className={`tab-header ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'description' && (
                <div className="tab-panel">
                  <h3>Product Description</h3>
                  <p>{product.description}</p>
                  {product.features.length > 0 && (
                    <div className="detailed-features">
                      <h4>Features:</h4>
                      <ul>
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="tab-panel">
                  <h3>Specifications</h3>
                  <div className="specifications-table">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="spec-row">
                        <span className="spec-label">{key}:</span>
                        <span className="spec-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="tab-panel">
                  <div className="reviews-summary">
                    <h3>Customer Reviews</h3>
                    <div className="rating-summary">
                      <div className="average-rating">
                        <span className="rating-number">{product.rating}</span>
                        <div className="stars">
                          {renderStars(Math.floor(product.rating))}
                        </div>
                        <span>Based on {product.reviewCount} reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <span className="reviewer-name">{review.userName}</span>
                            {review.verified && (
                              <span className="verified-badge">
                                <i className="bx bx-check-shield"></i>
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="review-rating">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <div className="review-content">
                          <p>{review.comment}</p>
                          <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products">
              <h2>You May Also Like</h2>
              <div className="related-products-grid">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="related-product-item">
                    <div className="product-image">
                      <Image src={relatedProduct.images[0]} alt={relatedProduct.name} width={200} height={200} />
                    </div>
                    <div className="product-info">
                      <h3>{relatedProduct.name}</h3>
                      <div className="rating">
                        {renderStars(relatedProduct.rating)}
                        <span>({relatedProduct.reviewCount || 0})</span>
                      </div>
                      <div className="price">${relatedProduct.price}</div>
                      <button className="quick-add-btn">
                        <i className="bx bx-plus"></i>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
}