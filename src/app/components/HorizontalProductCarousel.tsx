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
}

export default function HorizontalProductCarousel({ title, query }: { title: string, query: string }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
        {products.map((product: Product) => (
          <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
            <Image src={product.images && product.images.length > 0 ? (typeof product.images[0] === 'string' ? product.images[0] : (product.images[0] as {url: string}).url) : 'https://i.postimg.cc/t403yfn9/home2.jpg'} alt={product.name} width={200} height={200} />
            <div className="product-info">
              <p className="product-name">{product.name}</p>
              <div className="rating">
                {renderStars(Math.floor(product.rating || 0))}
              </div>
              <div className="price">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}