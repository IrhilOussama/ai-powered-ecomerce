"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { API_ENDPOINTS } from "@/lib/api_endpoints";
import Link from "next/link";
import { ErrorState } from "@/components/errorState";
import { LoadingSkeleton } from "@/components/loadingSkeleton";
import { motion } from "framer-motion";
import { MessageCircle } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  brand?: string;
  similar_products_ids: string[];
}
export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productResponse : Product = (await axios.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`)).data;
        setProduct(productResponse);

        const similarResponse = await Promise.all(productResponse.similar_products_ids.map(async (current_id) => {
          const result = (await axios.get(`${API_ENDPOINTS.PRODUCTS.BASE}/${current_id}`)).data;
          return result;
        }));
        setSimilarProducts(similarResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]); 

  if (loading) return <LoadingSkeleton />;
  if (product == null) return "product null"
  if (error) return <ErrorState message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid lg:grid-cols-2 gap-6 sm:gap-12"
      >
        {/* Product Images - Mobile Optimized */}
        <div className="sm:sticky sm:top-24 self-start order-1 sm:order-none">
          <div className="relative aspect-square rounded-xl sm:rounded-3xl overflow-hidden bg-gray-50">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Product Details - Mobile Optimized */}
        <div className="order-2 sm:order-none">

        {/* Product Details - Mobile Optimized */}
          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              {product.title}
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-primary">
              ${product.price}
            </p>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>

            <motion.a
              href={`https://wa.me/212703493979?text=${encodeURIComponent(
                `Hello! I would like to order:\n\n` +
                `Product: ${product.title}\n` +
                `ID: ${product.id}\n` +
                `Price: $${product.price}\n\n` +
                `Please let me know about availability.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 md:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-medium hover:bg-[#128C7E] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </motion.a>
          </motion.div>

          {/* Similar Products - Mobile Optimized */}
          <div className="mt-8 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-0">
              {similarProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-2 sm:p-4">
                      <h3 className="text-sm sm:text-base font-medium line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-primary font-bold mt-1 sm:mt-2 text-sm sm:text-base">
                        ${product.price}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};