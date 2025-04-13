"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/api_endpoints";
import { LoadingSkeleton } from "@/components/loadingSkeleton";
import { ErrorState } from "@/components/errorState";
import { ShoppingBagIcon } from "lucide-react";


interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category_title: string;
  similar_products_ids: string[];
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.PRODUCTS.BASE);
        setProducts(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent"
      >
        Our Premium Collection
      </motion.h1>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence>
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group relative"
            >
              <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                <div className="p-6">
                  <span className="text-sm text-primary font-medium">
                    {product.category_title}
                  </span>
                  <h3 className="text-xl font-bold mt-2 mb-1">{product.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">${product.price}</p>
                </div>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-24 right-4 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingBagIcon />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};


