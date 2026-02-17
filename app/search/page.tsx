// app/search/page.tsx
// app/search/page.tsx
'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  SlidersHorizontal,
  Star,
  ChevronRight,
  X,
  Loader2,
  ShoppingBag,
  Tag,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Filter,
  ArrowLeft
} from 'lucide-react';

interface Product {
  _id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: {
    _id: string;
    name: string;
  };
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const formatCurrency = (amount: number) => (
    <span className="flex items-baseline">
      <span className="text-xl font-bold mr-1">৳</span>
      <span className="text-2xl font-bold">{amount.toFixed(0)}</span>
    </span>
  );

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to fetch search results');

      const data: Product[] = await res.json();
      setProducts(data);

      if (data.length) {
        const max = Math.max(...data.map(p => p.price));
        const calculatedMax = Math.max(1000, Math.ceil(max / 100) * 100);
        setPriceRange([0, calculatedMax]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // Calculate derived values
  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category?.name).filter(Boolean));
    return ['All Categories', ...Array.from(uniqueCategories)];
  }, [products]);

  const maxAvailablePrice = useMemo(() => {
    if (products.length === 0) return 1000;
    const max = Math.max(...products.map(p => p.price));
    return Math.max(1000, Math.ceil(max / 100) * 100);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        // Category filter
        if (selectedCategory !== 'All Categories' && product.category?.name !== selectedCategory) {
          return false;
        }

        // Price range filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
          return false;
        }

        // Rating filter
        if (product.rating < minRating) {
          return false;
        }

        // Stock filter
        if (inStockOnly && !product.inStock) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          default: // relevance - keep original order from API
            return 0;
        }
      });
  }, [products, selectedCategory, priceRange, minRating, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All Categories');
    setPriceRange([0, maxAvailablePrice]);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('relevance');
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Enter a search term</h3>
            <p className="text-gray-600 mb-8">
              Search for products by name, category, or description
            </p>
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-100 transition-all"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
        <p className="text-gray-600">Searching for "{query}"...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Failed</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchSearchResults}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header with Search Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pl-12 pr-24 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition text-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Results Summary and Sort Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:shadow transition"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredProducts.length}</span> results found for "{query}"
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500">Sort by:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Alphabetical</option>
                </select>

                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-700 px-3 py-2 hover:bg-emerald-50 rounded-lg transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* SIDEBAR */}
          <aside className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 fixed md:static top-0 left-0 h-full md:h-auto w-80 md:w-72 
            bg-white md:bg-transparent z-50 md:z-auto 
            transform transition-transform duration-300 ease-in-out md:transition-none
            md:block
          `}>
            <div className="h-full md:h-auto bg-white md:rounded-xl md:shadow-sm p-6 md:p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              {categories.length > 1 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all
                          ${selectedCategory === cat
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'hover:bg-gray-50 text-gray-700'
                          }
                        `}
                      >
                        <span className="capitalize">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              {products.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Price Range
                    </h3>
                    <span className="text-sm text-emerald-600 font-medium">
                      ৳{priceRange[0]} - ৳{priceRange[1]}
                    </span>
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max={maxAvailablePrice}
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>৳0</span>
                      <span>৳{maxAvailablePrice}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Minimum Rating
                </h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1, 0].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2 rounded-lg transition
                        ${minRating === rating
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'fill-current text-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm">
                        {rating === 0 ? 'Any rating' : `${rating}+ stars`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Filter */}
              <div className="mb-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  No products match your search criteria for "{query}". Try different keywords or adjust your filters.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-100 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Reset All Filters
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Product Image */}
                      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                              Save ৳{(product.originalPrice - product.price).toFixed(0)}
                            </span>
                          )}
                          {!product.inStock && (
                            <span className="bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className="bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3" />
                            {product.category?.name || 'Uncategorized'}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition">
                          {product.name}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current text-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({product.reviews} reviews)
                          </span>
                        </div>

                        {/* Price and CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {formatCurrency(product.price)}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-sm text-gray-400 line-through">
                                ৳{product.originalPrice.toFixed(0)}
                              </div>
                            )}
                          </div>

                          <Link
                            href={`/products/${product._id}`}
                            className="group/btn relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-emerald-700 font-medium transition-all duration-300"
                          >
                            <span>View Details</span>
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}