import { useState, useMemo, useCallback } from 'react';
import { products, categories, roasts, Product } from './data/products';

interface CartItem {
  product: Product;
  quantity: number;
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesRoast = selectedRoast === 'All' || product.roast === selectedRoast;
      return matchesSearch && matchesCategory && matchesRoast;
    });
  }, [searchQuery, selectedCategory, selectedRoast]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const handleCheckout = () => {
    setIsCheckout(true);
    setIsCartOpen(false);
  };

  const completeOrder = () => {
    setOrderComplete(true);
    setCart([]);
    setTimeout(() => {
      setOrderComplete(false);
      setIsCheckout(false);
    }, 3000);
  };

  const getRoastColor = (roast: string) => {
    switch (roast) {
      case 'Light': return 'bg-amber-100 text-amber-800';
      case 'Light-Medium': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Dark': return 'bg-stone-200 text-stone-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Product Detail View
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans">
        {/* Header */}
        <header className="bg-stone-900 text-stone-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex items-center gap-2 text-stone-100 hover:text-amber-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-lg font-serif font-semibold tracking-wide">Ember & Bloom</span>
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:text-amber-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoastColor(selectedProduct.roast)}`}>
                  {selectedProduct.roast} Roast
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-amber-700 uppercase tracking-wider">{selectedProduct.category}</span>
                <span className="text-stone-300">•</span>
                <span className="text-sm text-stone-500">{selectedProduct.origin}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">
                {selectedProduct.name}
              </h1>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'text-amber-400' : 'text-stone-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-stone-500 ml-2">{selectedProduct.rating}</span>
              </div>
              <p className="text-lg text-stone-600 leading-relaxed mb-6">
                {selectedProduct.longDescription}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-stone-100 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">Weight</p>
                  <p className="text-lg font-semibold text-stone-800">{selectedProduct.weight}</p>
                </div>
                <div className="bg-stone-100 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">Roast</p>
                  <p className="text-lg font-semibold text-stone-800">{selectedProduct.roast}</p>
                </div>
              </div>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-stone-500 mb-2">Tasting Notes</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.notes.map(note => (
                    <span key={note} className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-sm font-medium">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <span className="text-3xl font-bold text-stone-900">${selectedProduct.price.toFixed(2)}</span>
                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="px-8 py-3 bg-stone-900 text-stone-100 rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        {isCartOpen && (
          <CartSidebar
            cart={cart}
            cartTotal={cartTotal}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            onClose={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
          />
        )}
      </div>
    );
  }

  // Checkout View
  if (isCheckout) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans">
        <header className="bg-stone-900 text-stone-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setIsCheckout(false)}
                className="flex items-center gap-2 text-stone-100 hover:text-amber-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-lg font-serif font-semibold tracking-wide">Ember & Bloom</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {orderComplete ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-3">Order Confirmed!</h2>
              <p className="text-stone-600 text-lg">Thank you for your purchase. Your coffee is on its way.</p>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">Checkout</h1>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <form onSubmit={(e) => { e.preventDefault(); completeOrder(); }} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-stone-800 mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <input type="email" placeholder="Email address" required className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                        <input type="tel" placeholder="Phone number" className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-stone-800 mb-4">Shipping Address</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="First name" required className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                          <input type="text" placeholder="Last name" required className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                        </div>
                        <input type="text" placeholder="Address" required className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="City" required className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                          <input type="text" placeholder="ZIP Code" required className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-stone-800 mb-4">Payment</h3>
                      <div className="space-y-4">
                        <input type="text" placeholder="Card number" required className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="MM/YY" required className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                          <input type="text" placeholder="CVC" required className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" />
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-stone-900 text-stone-100 rounded-xl font-semibold text-lg hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Place Order — ${cartTotal.toFixed(2)}
                    </button>
                  </form>
                </div>
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
                    <h3 className="text-lg font-semibold text-stone-800 mb-4">Order Summary</h3>
                    <div className="space-y-3 mb-4">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <p className="text-sm font-medium text-stone-800">{item.product.name}</p>
                              <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-stone-700">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-stone-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-stone-600">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-stone-600">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-100">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main Store View
  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Header */}
      <header className="bg-stone-900 text-stone-100 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-stone-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5A2,2 0 0,0 20,3Z" />
                </svg>
              </div>
              <h1 className="text-xl font-serif font-semibold tracking-wide">Ember & Bloom</h1>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-amber-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-stone-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-amber-300 text-sm uppercase tracking-widest mb-4 font-medium">Artisan Coffee Roasters</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Coffee, Crafted with <span className="text-amber-300">Intention</span>
            </h2>
            <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed">
              From seed to cup, we source and roast exceptional single-origin coffees and thoughtful blends for the discerning palate.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, origin, or tasting note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-stone-300 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-stone-800 placeholder-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-stone-100 shadow-md'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2 font-medium">Roast Level</label>
            <div className="flex flex-wrap gap-2">
              {roasts.map(roast => (
                <button
                  key={roast}
                  onClick={() => setSelectedRoast(roast)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedRoast === roast
                      ? 'bg-stone-900 text-stone-100 shadow-md'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {roast}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-stone-500 mb-6">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          {searchQuery && <span> for "<span className="text-stone-700 font-medium">{searchQuery}</span>"</span>}
        </p>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-stone-500 text-lg">No coffees match your search.</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedRoast('All'); }} className="mt-4 text-amber-700 hover:text-amber-900 font-medium">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-lg hover:border-amber-200 transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoastColor(product.roast)}`}>
                      {product.roast}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">{product.category}</span>
                    <span className="text-stone-300">•</span>
                    <span className="text-xs text-stone-500">{product.origin}</span>
                  </div>
                  <h3
                    className="text-lg font-serif font-bold text-stone-900 mb-2 cursor-pointer hover:text-amber-800 transition-colors"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {product.notes.map(note => (
                      <span key={note} className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md text-xs">
                        {note}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div>
                      <span className="text-xl font-bold text-stone-900">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-stone-400 ml-1">/ {product.weight}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-stone-900 text-stone-100 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-stone-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5A2,2 0 0,0 20,3Z" />
                  </svg>
                </div>
                <span className="text-stone-100 font-serif font-semibold">Ember & Bloom</span>
              </div>
              <p className="text-sm leading-relaxed">
                Specialty coffee roasted with care. We source directly from farmers who share our passion for quality and sustainability.
              </p>
            </div>
            <div>
              <h4 className="text-stone-100 font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-amber-300 transition-colors">Our Story</button></li>
                <li><button className="hover:text-amber-300 transition-colors">Subscription</button></li>
                <li><button className="hover:text-amber-300 transition-colors">Brewing Guides</button></li>
                <li><button className="hover:text-amber-300 transition-colors">Wholesale</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-stone-100 font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>hello@emberandbloom.co</li>
                <li>Mon–Fri: 8am – 6pm</li>
                <li>Free shipping on orders $35+</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 mt-8 pt-8 text-center text-xs text-stone-500">
            © 2026 Ember & Bloom Coffee Roasters. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <CartSidebar
          cart={cart}
          cartTotal={cartTotal}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}

// Cart Sidebar Component
function CartSidebar({
  cart,
  cartTotal,
  updateQuantity,
  removeFromCart,
  onClose,
  onCheckout
}: {
  cart: CartItem[];
  cartTotal: number;
  updateQuantity: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  onClose: () => void;
  onCheckout: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Sidebar */}
      <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-xl font-serif font-bold text-stone-900">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <p className="text-stone-500">Your cart is empty</p>
              <p className="text-sm text-stone-400 mt-1">Add some delicious coffee!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-4 p-3 bg-stone-50 rounded-xl">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-stone-800 truncate">{item.product.name}</h4>
                    <p className="text-xs text-stone-500">{item.product.weight}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md bg-white border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-800">${(item.product.price * item.quantity).toFixed(2)}</span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-stone-600">Subtotal</span>
              <span className="text-xl font-bold text-stone-900">${cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-stone-500 mb-4">Shipping calculated at checkout. Free on orders $35+.</p>
            <button
              onClick={onCheckout}
              className="w-full py-3.5 bg-stone-900 text-stone-100 rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow-md"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
