"use client";

import { API_ENDPOINTS } from "@/lib/api_endpoints";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface Category {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  categorie_id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  category_title: string;
  similar_products_ids: string[];
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.PRODUCTS.BASE);
        setProducts(response.data.slice(0, 9));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.CATEGORIES.BASE);
        setCategories(response.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <main className="flex flex-col items-center bg-gray-50">
      {/* Hero Section - Modern Gradient Overlay */}
      <div className="relative w-full h-[70vh] max-h-[800px]">
        <Image
          src="/images/landing.jpg"
          alt="E-commerce Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute bottom-10 left-10 text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">Discover Your Style</h1>
          <p className="text-xl mb-6">Premium quality products for your everyday life</p>
          <Link 
            href="/products" 
            className="inline-block bg-white text-black font-medium px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Categories Section - Card Style */}
      <section className="w-full max-w-7xl px-6 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <Link href="/categories" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-80">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{category.title}</h3>
                <p className="text-sm opacity-90">{category.description}</p>
                <Link 
                  href={`/products/category/${category.title}`} 
                  className="mt-3 inline-block text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Products Section - Modern Card Grid */}
      <section className="w-full max-w-7xl px-6 py-16 bg-white">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Trending Products</h2>
          <Link href="/products" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
              </div>
              <div className="p-6">
                <span className="text-sm text-gray-500">{product.category_title}</span>
                <h3 className="text-xl font-semibold mt-1 mb-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-gray-600 line-clamp-2 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">${product.price}</span>
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm font-medium px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center text-white px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Shopping Experience?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers today</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/products" 
              className="bg-white text-primary font-medium px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Browse Collection
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent border-2 border-white text-white font-medium px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}