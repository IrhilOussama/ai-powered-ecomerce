import { motion } from "framer-motion";

export const LoadingSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl overflow-hidden"
        >
          <div className="aspect-square bg-gray-100 animate-pulse" />
          <div className="p-6 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
            <div className="h-6 bg-gray-100 rounded w-2/3 animate-pulse" />
            <div className="h-5 bg-gray-100 rounded w-1/4 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);