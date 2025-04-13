"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import { API_ENDPOINTS } from "@/lib/api_endpoints";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface Category {
  id: string;
  title: string;
  image: string | null;
  product_count: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const hoverCard = {
  scale: 1.02,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsMap, setProductsMap] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default category image path
  const DEFAULT_CATEGORY_IMAGE = "/images/default_category.jpg";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const categoriesResponse = await axios.get(API_ENDPOINTS.CATEGORIES.BASE);
        const categoriesData = categoriesResponse.data.map((category: Category) => ({
          ...category,
          image: category.image || DEFAULT_CATEGORY_IMAGE
        }));
        setCategories(categoriesData);

        const productsPromises = categoriesData.map(async (category: Category) => {
          const response = await axios.get(
            `${API_ENDPOINTS.PRODUCTS.BASE}?category=${category.id}&page=1&limit=4`
          );
          return { categoryId: category.id, products: response.data };
        });

        const productsResults = await Promise.all(productsPromises);
        const newProductsMap = productsResults.reduce((acc, result) => ({
          ...acc,
          [result.categoryId]: result.products
        }), {});

        setProductsMap(newProductsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12"
        >
          <div className="h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-1/3 mx-auto animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-4"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto px-4 py-12 text-center"
      >
        <h2 className="text-2xl font-medium text-red-600 mb-4">{error}</h2>
        <Link 
          href="/" 
          className="inline-block px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-300"
        >
          Return to Home
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-800 to-primary bg-clip-text text-transparent"
      >
        Discover Our Collections
      </motion.h1>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={itemVariants}
            whileHover={hoverCard}
            className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <Link href={`/products/category/${category.title}`} className="absolute inset-0 z-10" />
            
            {/* Category Image with default fallback */}
            <div className="relative aspect-video overflow-hidden">
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <Image
                  src={category.image || DEFAULT_CATEGORY_IMAGE}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to default image if the original fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_CATEGORY_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </motion.div>
            </div>

            {/* Category Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <motion.h3 
                  whileHover={{ color: "#3b82f6" }}
                  className="text-xl font-bold text-gray-900 transition-colors duration-300"
                >
                  {category.title}
                </motion.h3>
                <span className="text-xs font-medium text-white bg-primary px-2 py-1 rounded-full">
                  {category.product_count} items
                </span>
              </div>

              {/* Product Previews */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {productsMap[category.id]?.map((product) => (
                  <motion.div 
                    key={product.id} 
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-square overflow-hidden rounded-lg border border-gray-100"
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                  </motion.div>
                ))}
              </div>

              {/* View All CTA */}
              <motion.div 
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-1 text-primary font-medium cursor-pointer"
              >
                <span className="text-sm">Explore collection</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}