// app/deals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export default function TodaysDealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [discountRange, setDiscountRange] = useState<[number, number]>([10, 90]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('discount-high');

  // Simple currency formatter - returns string only
  const formatPrice = (price: number): string => {
    return `৳${price.toFixed(2)}`;
  };

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round((1 - price / originalPrice) * 100);
  };

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const productsWithDiscounts = products.filter(p => p.originalPrice && p.originalPrice > p.price);
  const categories = ['all', ...new Set(productsWithDiscounts.map(p => p.category))];

  const filteredDeals = productsWithDiscounts
    .filter(p => {
      const discount = calculateDiscount(p.price, p.originalPrice);
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (discount < discountRange[0] || discount > discountRange[1]) return false;
      if (p.rating < minRating) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    })
    .sort((a, b) => {
      const da = calculateDiscount(a.price, a.originalPrice);
      const db = calculateDiscount(b.price, b.originalPrice);
      
      switch (sortBy) {
        case 'discount-high': return db - da;
        case 'discount-low': return da - db;
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return db - da;
      }
    });

  const resetFilters = () => {
    setSelectedCategory('all');
    setDiscountRange([10, 90]);
    setMinRating(0);
    setInStockOnly(true);
    setSortBy('discount-high');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
          <p className="mt-3 text-gray-600">Loading today's deals...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Error loading deals</h3>
            <p className="mt-1 text-red-700">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-red-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Today's <span className="text-red-600">Hot Deals</span>
          </h1>
          
          {/* Countdown Timer */}
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
            <div className="text-sm font-semibold text-gray-600 mb-3">Deals end in:</div>
            <div className="flex justify-center space-x-4">
              {['hours', 'minutes', 'seconds'].map((unit) => (
                <div key={unit} className="text-center">
                  <div className="bg-red-100 text-red-800 rounded-lg py-2 px-3 text-2xl font-bold">
                    {timeLeft[unit as keyof typeof timeLeft].toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {productsWithDiscounts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-medium text-gray-900">No deals available today</h2>
            <p className="mt-2 text-gray-500">Check back later!</p>
            <Link
              href="/products"
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="lg:w-80 bg-white rounded-xl shadow-sm p-6 h-fit">
              <div className="flex justify-between items-center mb-6 pb-3 border-b">
                <h2 className="text-xl font-bold">Filter Deals</h2>
                <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-full text-sm">
                  {filteredDeals.length} deals
                </span>
              </div>

              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="text-red-600"
                        />
                        <span className="ml-2 text-sm capitalize">
                          {cat} ({cat === 'all' ? productsWithDiscounts.length : productsWithDiscounts.filter(p => p.category === cat).length})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Discount Range */}
                <div>
                  <h3 className="font-semibold mb-3">
                    Discount: {discountRange[0]}% - {discountRange[1]}%
                  </h3>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={discountRange[1]}
                    onChange={(e) => setDiscountRange([discountRange[0], parseInt(e.target.value)])}
                    className="w-full accent-red-600"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-semibold mb-3">Minimum Rating</h3>
                  <div className="flex space-x-2">
                    {[0, 3, 4, 5].map(r => (
                      <button
                        key={r}
                        onClick={() => setMinRating(r)}
                        className={`w-8 h-8 rounded-full ${
                          minRating === r ? 'bg-red-600 text-white' : 'bg-gray-100'
                        }`}
                      >
                        {r === 0 ? '★' : r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* In Stock Only */}
                <label className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                    className="text-red-600 rounded"
                  />
                  <span className="ml-2 text-sm">In Stock Only</span>
                </label>

                {/* Sort By */}
                <div>
                  <h3 className="font-semibold mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="discount-high">Highest Discount</option>
                    <option value="discount-low">Lowest Discount</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest Deals</option>
                  </select>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Deals Grid */}
            <div className="flex-1">
              {/* Results count */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex justify-between">
                  <span>Showing {filteredDeals.length} of {productsWithDiscounts.length} deals</span>
                  <span>Save up to {Math.max(...productsWithDiscounts.map(p => calculateDiscount(p.price, p.originalPrice)))}%</span>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDeals.map(product => {
                  const discount = calculateDiscount(product.price, product.originalPrice);
                  
                  return (
                    <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all relative">
                      {/* Discount Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-red-600 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg">
                          {discount}% OFF
                        </span>
                      </div>

                      {/* Image */}
                      <div className="h-52 bg-gray-100 flex justify-center overflow-hidden">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="w-auto h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full capitalize">
                            {product.category}
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map(star => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="ml-3 text-lg text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {product.originalPrice && (
                            <div className="text-sm text-green-600 font-medium mt-1">
                              You save {formatPrice(product.originalPrice - product.price)}
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <Link
                          href={`/products/${product._id}`}
                          className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                          View Deal
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* No Results */}
              {filteredDeals.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center max-w-2xl mx-auto mt-6">
                  <h2 className="text-xl font-medium mb-2">No deals match your filters</h2>
                  <p className="text-gray-500 mb-4">Try adjusting your filters</p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}