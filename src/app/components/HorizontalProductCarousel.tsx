"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  images: Array<{url: string}> | string[];
  rating: number;
  description?: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
  originalPrice?: number;
}

export default function HorizontalProductCarousel({ title, query }: { title: string, query: string }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [justAddedId, setJustAddedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?${query}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, title]);

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const handleAddToCart = async (productId: number) => {
    try {
      setAddingId(productId);
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to add to cart');
      }
      setJustAddedId(productId);
      setTimeout(() => setJustAddedId((prev) => (prev === productId ? null : prev)), 1500);
    } catch (e) {
      console.error(e);
    } finally {
      setAddingId(null);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`bx ${i < rating ? 'bxs-star' : 'bx-star'}`}></i>
    ));
  };

  if (loading) {
    return (
      <div className="horizontal-carousel-loading">
        <h2>{title}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="horizontal-carousel">
      <h2>{title}</h2>
      <div className="products-container">
        {products.map((product: Product, index: number) => (
          <div
            key={product.id}
            className="product-card animated-card"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="product-image-wrapper" onClick={() => handleProductClick(product.id)}>
              <Image
                src={
                  product.images && product.images.length > 0
                    ? (typeof product.images[0] === 'string'
                      ? product.images[0]
                      : (product.images[0] as { url: string }).url)
                    : 'https://i.postimg.cc/t403yfn9/home2.jpg'
                }
                alt={product.name}
                width={250}
                height={200}
              />
              <div className="product-overlay">
                <button className="overlay-btn" aria-label="Quick view">
                  <i className="bx bx-show"></i>
                </button>
                <button className="overlay-btn" aria-label="Add to wishlist">
                  <i className="bx bx-heart"></i>
                </button>
              </div>
            </div>

            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <div className="price">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="original-price">${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}</span>
                )}
                <span className="current-price">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
              </div>

              {/* Product Info Section */}
              <div className="product-details">
                {product.brand && (
                  <div className="product-brand">
                    <span className="label">Brand:</span> {product.brand}
                  </div>
                )}
                {product.category && (
                  <div className="product-category">
                    <span className="label">Category:</span> {product.category}
                  </div>
                )}
                {product.description && (
                  <div className="product-description">
                    {product.description.length > 60
                      ? `${product.description.substring(0, 60)}...`
                      : product.description}
                  </div>
                )}
                <div className="stock-status">
                  <span className={`stock-indicator ${product.inStock !== false ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock !== false ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="product-actions">
                <button
                  className={`add-to-cart-btn ${justAddedId === product.id ? 'added' : ''}`}
                  onClick={() => handleAddToCart(product.id)}
                  disabled={addingId === product.id}
                >
                  {addingId === product.id ? 'Adding…' : justAddedId === product.id ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
              <div className="rating">
                {renderStars(Math.floor(product.rating || 0))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}