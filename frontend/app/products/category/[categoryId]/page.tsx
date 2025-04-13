"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api_endpoints";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category_id: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  product_count: string;
}

export default function CategoryProductsPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoriesResponse = await axios.get(API_ENDPOINTS.CATEGORIES.BASE);
        const foundCategory = categoriesResponse.data.find(
          (c: Category) => c.title === params.categoryId
        );
        
        if (!foundCategory) {
          throw new Error("Category not found");
        }
        setCategory(foundCategory);

        // Fetch category products
        const productsResponse = await axios.get(
          `${API_ENDPOINTS.PRODUCTS.BASE}?category=${foundCategory.id}&page=${page}&limit=${limit}`
        );
        
        setProducts(productsResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    if (params.categoryId) {
      fetchData();
    }
  }, [params.categoryId, page]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-40 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-medium text-red-600">{error}</h2>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-12 text-center">
        {category?.image && (
          <div className="relative h-60 w-full mb-6 rounded-xl overflow-hidden">
            <Image
              src={category.image}
              alt={category.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4">{category?.title}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {category?.description || "Explore our curated collection in this category"}
        </p>
        <p className="mt-4 text-sm text-gray-500">
          {category?.product_count} products available
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
              <p className="text-primary font-semibold mt-2">${product.price}</p>
              <Link
                href={`/products/${product.id}`}
                className="absolute inset-0 z-10"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-12 flex justify-center gap-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}