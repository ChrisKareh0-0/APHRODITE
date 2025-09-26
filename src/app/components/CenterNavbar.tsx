"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CenterNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: "bx-home-alt" },
    { id: "collection", label: "Collections", icon: "bx-grid-alt" },
    { id: "sellers", label: "Shop", icon: "bx-shopping-bag" },
    { id: "contact", label: "Contact", icon: "bx-message-dots" }
  ];

  // Product database for search
  const allProducts = [
    { id: 1, name: "PS England Shoes", price: 37.24, category: "Shoes", image: "https://i.postimg.cc/8CmBZH5N/shoes.webp", rating: 4 },
    { id: 2, name: "PS England Jacket", price: 17.24, category: "Clothing", image: "https://i.postimg.cc/76X9ZV8m/Screenshot_from_2022-06-03_18-45-12.png", rating: 2 },
    { id: 3, name: "PS England Shirt", price: 27.24, category: "Clothing", image: "https://i.postimg.cc/j2FhzSjf/bs2.png", rating: 4 },
    { id: 4, name: "PS England Sneakers", price: 43.67, category: "Shoes", image: "https://i.postimg.cc/QtjSDzPF/bs3.png", rating: 5 },
    { id: 5, name: "PS England T-Shirt", price: 10.23, category: "Clothing", image: "https://i.postimg.cc/fbnB2yfj/na1.png", rating: 5 },
    { id: 6, name: "PS England Bag", price: 9.28, category: "Accessories", image: "https://i.postimg.cc/zD02zJq8/na2.png", rating: 1 },
    { id: 7, name: "PS England Sunglass", price: 6.24, category: "Accessories", image: "https://i.postimg.cc/Dfj5VBcz/sunglasses1.jpg", rating: 5 },
    { id: 8, name: "PS England Boots", price: 43.67, category: "Shoes", image: "https://i.postimg.cc/FszW12Kc/na4.png", rating: 5 },
    { id: 9, name: "Designer Jacket", price: 89.99, category: "Clothing", image: "https://i.postimg.cc/76X9ZV8m/Screenshot_from_2022-06-03_18-45-12.png", rating: 5 },
    { id: 10, name: "Casual Shirt", price: 27.24, category: "Clothing", image: "https://i.postimg.cc/j2FhzSjf/bs2.png", rating: 4 },
    { id: 11, name: "Premium T-Shirt", price: 15.99, category: "Clothing", image: "https://i.postimg.cc/fbnB2yfj/na1.png", rating: 4 },
    { id: 12, name: "Classic Shoes", price: 37.24, category: "Shoes", image: "https://i.postimg.cc/8CmBZH5N/shoes.webp", rating: 4 },
    { id: 13, name: "Sport Sneakers", price: 43.67, category: "Shoes", image: "https://i.postimg.cc/QtjSDzPF/bs3.png", rating: 5 },
    { id: 14, name: "Casual Boots", price: 65.00, category: "Shoes", image: "https://i.postimg.cc/FszW12Kc/na4.png", rating: 5 },
    { id: 15, name: "Designer Bag", price: 9.28, category: "Accessories", image: "https://i.postimg.cc/zD02zJq8/na2.png", rating: 3 },
    { id: 16, name: "Sunglasses", price: 6.24, category: "Accessories", image: "https://i.postimg.cc/Dfj5VBcz/sunglasses1.jpg", rating: 5 },
    { id: 17, name: "Luxury Watch", price: 125.00, category: "Accessories", image: "https://i.postimg.cc/MHv7KJYp/access.webp", rating: 4 }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Cart functionality
  const addToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.center-navbar__search-container') && isSearchOpen) {
        setIsSearchOpen(false);
      }
      if (!target.closest('.center-navbar__cart-container') && isCartOpen) {
        setIsCartOpen(false);
      }
      if (!target.closest('.center-navbar__profile-container') && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen, isCartOpen, isProfileOpen]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`bx ${i < rating ? 'bxs-star' : 'bx-star'}`}></i>
    ));
  };

  return (
    <>
      <nav className={`center-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="center-navbar__container">

          {/* Logo */}
          <div className="center-navbar__logo">
            <h2>APHRODITE</h2>
          </div>

          {/* Desktop Navigation */}
          <div className="center-navbar__nav">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                className={`center-navbar__nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
                style={{ '--item-index': index } as React.CSSProperties}
              >
                <i className={`bx ${item.icon}`}></i>
                <span>{item.label}</span>
                <div className="center-navbar__nav-indicator"></div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="center-navbar__actions">

            {/* Search */}
            <div className="center-navbar__search-container">
              <button
                className={`center-navbar__action-btn search-btn ${isSearchOpen ? 'active' : ''}`}
                onClick={toggleSearch}
              >
                <i className={`bx ${isSearchOpen ? 'bx-x' : 'bx-search'}`}></i>
                <span className="tooltip">Search</span>
              </button>

              {isSearchOpen && (
                <div className="center-navbar__search-dropdown">
                  <div className="center-navbar__search-input-container">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="center-navbar__search-input"
                      autoFocus
                    />
                    <i className="bx bx-search search-icon"></i>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="center-navbar__search-results">
                      <div className="search-results-header">
                        <span>Found {searchResults.length} products</span>
                      </div>
                      <div className="search-results-list">
                        {searchResults.slice(0, 6).map(product => (
                          <div key={product.id} className="search-result-item">
                            <img src={product.image} alt={product.name} />
                            <div className="search-result-info">
                              <h4>{product.name}</h4>
                              <span className="category">{product.category}</span>
                              <div className="rating">
                                {renderStars(product.rating)}
                              </div>
                            </div>
                            <div className="search-result-actions">
                              <span className="price">${product.price}</span>
                              <button
                                className="add-to-cart-btn"
                                onClick={() => addToCart(product)}
                              >
                                <i className="bx bx-plus"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {searchResults.length > 6 && (
                        <div className="search-results-footer">
                          <button onClick={() => scrollToSection('sellers')}>
                            View all {searchResults.length} results
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {searchQuery && searchResults.length === 0 && (
                    <div className="center-navbar__search-no-results">
                      <i className="bx bx-search-alt-2"></i>
                      <p>No products found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="center-navbar__cart-container">
              <button
                className="center-navbar__action-btn cart-btn"
                onClick={toggleCart}
              >
                <i className="bx bx-shopping-bag"></i>
                {getTotalItems() > 0 && (
                  <span className="cart-count">{getTotalItems()}</span>
                )}
                <span className="tooltip">Cart</span>
              </button>

              {isCartOpen && (
                <div className="center-navbar__cart-dropdown">
                  <div className="cart-header">
                    <h3>Shopping Cart</h3>
                    <span>{getTotalItems()} items</span>
                  </div>

                  {cartItems.length > 0 ? (
                    <>
                      <div className="cart-items">
                        {cartItems.map(item => (
                          <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.name} />
                            <div className="cart-item-info">
                              <h4>{item.name}</h4>
                              <span className="price">${item.price}</span>
                            </div>
                            <div className="cart-item-controls">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                <i className="bx bx-minus"></i>
                              </button>
                              <span>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                <i className="bx bx-plus"></i>
                              </button>
                              <button
                                className="remove-btn"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <i className="bx bx-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="cart-footer">
                        <div className="cart-total">
                          <strong>Total: ${getTotalPrice().toFixed(2)}</strong>
                        </div>
                        <button className="checkout-btn">
                          Checkout
                          <i className="bx bx-right-arrow-alt"></i>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="cart-empty">
                      <i className="bx bx-shopping-bag"></i>
                      <p>Your cart is empty</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="center-navbar__profile-container">
              {/* <button
                className="center-navbar__action-btn profile-btn"
                onClick={toggleProfile}
              >
                <i className="bx bx-user"></i>
                <span className="tooltip">Account</span>
              </button> */}

              {isProfileOpen && (
                <div className="center-navbar__profile-dropdown">
                  <div className="profile-header">
                    <div className="profile-avatar">
                      <i className="bx bx-user"></i>
                    </div>
                    <div className="profile-info">
                      <h3>John Doe</h3>
                      <span>Premium Member</span>
                    </div>
                  </div>
                  <div className="profile-menu">
                    <button className="profile-menu-item">
                      <i className="bx bx-user"></i>
                      <span>My Profile</span>
                    </button>
                    <button className="profile-menu-item">
                      <i className="bx bx-package"></i>
                      <span>My Orders</span>
                    </button>
                    <button className="profile-menu-item">
                      <i className="bx bx-heart"></i>
                      <span>Wishlist</span>
                    </button>
                    <button className="profile-menu-item">
                      <i className="bx bx-cog"></i>
                      <span>Settings</span>
                    </button>
                    <hr />
                    <button className="profile-menu-item logout">
                      <i className="bx bx-log-out"></i>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`center-navbar__mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

        {/* Mobile Menu */}
        <div className={`center-navbar__mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="center-navbar__mobile-nav">
            {navItems.map((item) => (
              <button
                key={`mobile-${item.id}`}
                className={`center-navbar__mobile-nav-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                <i className={`bx ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="center-navbar__mobile-actions">
            <button className="center-navbar__mobile-action-btn">
              <i className="bx bx-search"></i>
              <span>Search</span>
            </button>
            <button className="center-navbar__mobile-action-btn">
              <i className="bx bx-user"></i>
              <span>Account</span>
            </button>
          </div>
        </div>

        {/* Background Blur Overlay */}
        <div className={`center-navbar__backdrop ${isMobileMenuOpen ? 'active' : ''}`}></div>
      </nav>

      {/* Spacer to prevent content from being hidden under fixed navbar */}
      <div className="center-navbar__spacer"></div>
    </>
  );
}