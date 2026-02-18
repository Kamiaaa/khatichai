"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  displayImage?: string;
  productCount: number;
}

const CategoryCard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/categories", {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}`);
  };

  // Fallback colors for categories without images
  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-50 to-blue-100',
      'bg-gradient-to-br from-green-50 to-green-100',
      'bg-gradient-to-br from-purple-50 to-purple-100',
      'bg-gradient-to-br from-red-50 to-red-100',
      'bg-gradient-to-br from-yellow-50 to-yellow-100',
      'bg-gradient-to-br from-pink-50 to-pink-100',
      'bg-gradient-to-br from-indigo-50 to-indigo-100',
      'bg-gradient-to-br from-teal-50 to-teal-100',
    ];
    return colors[index % colors.length];
  };

  // Fallback icon for categories without images
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();

    if (name.includes('electronic') || name.includes('tech')) return '💻';
    if (name.includes('cloth') || name.includes('fashion')) return '👕';
    if (name.includes('home') || name.includes('kitchen')) return '🏠';
    if (name.includes('book')) return '📚';
    if (name.includes('sport')) return '⚽';
    if (name.includes('beauty') || name.includes('cosmetic')) return '💄';
    if (name.includes('toy') || name.includes('game')) return '🎮';
    if (name.includes('auto')) return '🚗';
    if (name.includes('phone') || name.includes('mobile')) return '📱';
    if (name.includes('food') || name.includes('grocery')) return '🍎';

    return '🛒';
  };

  if (loading) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Loading categories...
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-gray-200 h-64"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 font-medium mb-2">Error loading categories</p>
            <p className="text-red-500 text-sm mb-4">{error}</p>
            <button
              onClick={fetchCategories}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shop by Category
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-yellow-800">No categories found with products.</p>
            <p className="text-yellow-600 text-sm mt-2">
              Please add categories and products from admin panel.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Shop by Category
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our wide range of products by category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {categories.map((cat, index) => {
          const bgColor = getCategoryColor(index);
          const icon = getCategoryIcon(cat.name);
          const hasImage = cat.displayImage || cat.image;

          return (
            <div
              key={cat._id}
              onClick={() => handleCategoryClick(cat.slug)}
              className="group relative bg-white cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden shadow-lg hover:shadow-xl border border-gray-100"
            >
              {/* Image Container - Full View */}
              <div
                className={`relative h-52 w-full ${!hasImage ? bgColor : "bg-transparent"
                  } flex items-center justify-center overflow-hidden`}
              >
                {hasImage ? (
                  <>
                    <img
                      src={cat.displayImage || cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute bottom-6 w-full text-center">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                        {cat.name}
                      </h3>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4">{icon}</div>
                    <h3 className="text-2xl font-bold text-black">{cat.name}</h3>
                  </div>
                )}
              </div>

              {/* No separate content div needed - everything is on the image */}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryCard;