// app/api/search/route.ts
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";
import { Types } from "mongoose";

// Define the populated product type
interface PopulatedProduct {
  _id: Types.ObjectId;
  productId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: {
    _id: Types.ObjectId;
    name: string;
    slug?: string;
  } | null;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the response type
interface ProductResponse {
  _id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: {
    _id: string;
    name: string;
  } | null;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: Request) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    
    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    console.log("Searching for:", query);

    // Create case-insensitive regex for search
    const searchRegex = new RegExp(query, "i");

    // Search products and populate category
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { productId: searchRegex },
        { features: { $in: [searchRegex] } }
      ]
    })
    .populate({
      path: "category",
      select: "name slug"
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

    console.log(`Found ${products.length} products for query: "${query}"`);

    // Type assertion with 'as unknown' first, then cast to PopulatedProduct[]
    const typedProducts = products as unknown as PopulatedProduct[];

    // Format the response
    const formattedProducts: ProductResponse[] = typedProducts.map(product => ({
      _id: product._id.toString(),
      productId: product.productId,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      category: product.category ? {
        _id: product.category._id.toString(),
        name: product.category.name
      } : null,
      images: product.images,
      rating: product.rating,
      reviews: product.reviews,
      inStock: product.inStock,
      features: product.features,
      createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: product.updatedAt?.toISOString() || new Date().toISOString()
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}