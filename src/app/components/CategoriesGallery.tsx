"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
}

interface Category {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  color: string;
  category: string;
  products: Product[];
}

export default function CategoriesGallery() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      // Fetch products by category
      const categoriesData = await Promise.all([
        fetch('/api/products?category=Clothing&limit=3').then(res => res.json()),
        fetch('/api/products?category=Shoes&limit=3').then(res => res.json()),
        fetch('/api/products?category=Accessories&limit=3').then(res => res.json()),
      ]);

      const processedCategories = [
        {
          id: 1,
          title: "Clothing Collection",
          subtitle: "Fashion Forward",
          description: "Discover our premium clothing collection featuring the latest trends in fashion. From casual wear to formal attire.",
          image: "https://i.postimg.cc/Xqmwr12c/clothing.webp",
          color: "#27323c",
          category: "Clothing",
          products: categoriesData[0].products || []
        },
        {
          id: 2,
          title: "Shoes Collection",
          subtitle: "Step in Style",
          description: "Walk with confidence in our exclusive shoe collection. From elegant dress shoes to comfortable sneakers.",
          image: "https://i.postimg.cc/8CmBZH5N/shoes.webp",
          color: "#19304a",
          category: "Shoes",
          products: categoriesData[1].products || []
        },
        {
          id: 3,
          title: "Accessories",
          subtitle: "Complete Your Look",
          description: "Perfect finishing touches with our curated accessories collection. From bags to sunglasses and jewelry.",
          image: "https://i.postimg.cc/MHv7KJYp/access.webp",
          color: "#2b2533",
          category: "Accessories",
          products: categoriesData[2].products || []
        }
      ];

      setCategories(processedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to empty categories
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  const handleViewAllClick = (category: string) => {
    router.push(`/products?category=${category}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [categories.length]);

  const handleCategoryClick = (index: number) => {
    setActiveCategory(index);
  };

  return (
    <div className="categories-gallery" ref={galleryRef}>
      <div className="categories-gallery__container">

        {/* Header */}
        <div className="categories-gallery__header">
          <h2 className="categories-gallery__title">Our Collections</h2>
          <p className="categories-gallery__subtitle">Explore our curated selection of premium products</p>
        </div>

        {/* Main Gallery */}
        <div className="categories-gallery__main">

          {/* Category Navigation */}
          <div className="categories-gallery__nav">
            {categories.map((category, index) => (
              <button
                key={category.id}
                className={`categories-gallery__nav-item ${index === activeCategory ? 'active' : ''}`}
                onClick={() => handleCategoryClick(index)}
                style={{ '--accent-color': category.color } as React.CSSProperties}
              >
                <span className="categories-gallery__nav-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="categories-gallery__nav-text">
                  <h3>{category.title}</h3>
                  <p>{category.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="categories-gallery__content">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`categories-gallery__content-item ${index === activeCategory ? 'active' : ''}`}
                style={{ '--bg-color': category.color } as React.CSSProperties}
              >

                {/* Hero Image */}
                <div className="categories-gallery__hero">
                  <div
                    className="categories-gallery__hero-image"
                    style={{ backgroundImage: `url(${category.image})` }}
                  >
                    <div className="categories-gallery__hero-overlay">
                      <div className="categories-gallery__hero-content">
                        <h2>{category.title}</h2>
                        <p>{category.description}</p>
                        <button className="categories-gallery__cta" onClick={() => handleViewAllClick(category.category)}>
                          Shop Collection
                          <i className="bx bx-right-arrow-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="categories-gallery__products">
                  <h3>Featured Products</h3>
                  <div className="categories-gallery__products-grid">
                    {category.products.map((product, pidx) => (
                      <div key={pidx} className="categories-gallery__product">
                        <div className="categories-gallery__product-image" onClick={() => handleProductClick(product.id)}>
                          <Image src={product.images[0]} alt={product.name} width={200} height={200} />
                          <div className="categories-gallery__product-overlay">
                            <button className="categories-gallery__product-btn">
                              <i className="bx bx-shopping-bag"></i>
                            </button>
                          </div>
                        </div>
                        <div className="categories-gallery__product-info">
                          <h4>{product.name}</h4>
                          <span className="price">${product.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Progress Indicators */}
        <div className="categories-gallery__indicators">
          {categories.map((_, index) => (
            <button
              key={index}
              className={`categories-gallery__indicator ${index === activeCategory ? 'active' : ''}`}
              onClick={() => handleCategoryClick(index)}
            >
              <span className="sr-only">Go to category {index + 1}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}