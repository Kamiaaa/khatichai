"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Slide {
  src: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const Carousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Homepage slides
  const slides: Slide[] = [
    {
      src: "/img/slide-01.jpg",
      title: "New Arrivals",
      subtitle: "Discover the latest trends in our collection",
      buttonText: "Shop Now",
      buttonLink: "/new-arrivals",
    },
    {
      src: "/img/slide-02.jpg",
      title: "Exclusive Offers",
      subtitle: "Up to 50% off on selected items",
      buttonText: "Grab Offer",
      buttonLink: "/offers",
    },
    {
      src: "/img/slide-03.jpg",
      title: "Best Sellers",
      subtitle: "Our most popular products loved by customers",
      buttonText: "View Collection",
      buttonLink: "/best-sellers",
    },
  ];

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.clientWidth * index,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const scroll = (direction: "left" | "right") => {
    const newIndex =
      direction === "left"
        ? (currentIndex - 1 + slides.length) % slides.length
        : (currentIndex + 1) % slides.length;
    scrollToIndex(newIndex);
  };

  // Autoplay every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      scroll("right");
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="relative w-full">
      {/* Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow hover:bg-gray-100"
      >
        <FiChevronLeft size={24} />
      </button>

      {/* Slides */}
      <div ref={carouselRef} className="flex overflow-hidden snap-x snap-mandatory">
        {slides.map((slide, index) => (
          <div key={index} className="flex-shrink-0 w-full snap-center relative">
            <Image
              src={slide.src}
              alt={`Slide ${index + 1}`}
              width={1600}
              height={600}
              className="w-full h-[150px] md:h-[350px] object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow hover:bg-gray-100"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Slide Indicators - Mobile Optimized */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className="focus:outline-none transition-all duration-300"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className="relative">
              {/* Background circle */}
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-black dark:bg-white scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`} />

              {/* Active indicator ring animation */}
              {currentIndex === index && (
                <div className="absolute inset-0 -m-0.5 sm:-m-1 border border-black dark:border-white rounded-full animate-ping opacity-50" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;