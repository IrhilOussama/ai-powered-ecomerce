import { motion } from "framer-motion";
import Link from "next/link";

export const ErrorState = ({ message }: { message: string }) => (
  <div className="max-w-7xl mx-auto px-4 py-12 text-center min-h-screen flex items-center justify-center">
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-medium text-red-600">{message}</h2>
      <Link
        href="/"
        className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Return to Shop
      </Link>
    </motion.div>
  </div>
);