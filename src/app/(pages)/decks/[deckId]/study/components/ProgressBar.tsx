'use client'
import { motion } from 'framer-motion';

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full mb-6">
      <motion.div
        className="h-full bg-blue-600 rounded-full"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}
