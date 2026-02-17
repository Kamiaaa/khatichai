// app/api/search/route.ts
import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(request: Request) {
  try {
    await connectMongo();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Search products by name, description, etc.
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
      isActive: true,
    }).limit(20);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}