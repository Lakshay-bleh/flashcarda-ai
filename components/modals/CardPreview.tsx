'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

type CardPreviewProps = {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  answer: string;
};

export default function CardPreview({ isOpen, onClose, question, answer }: CardPreviewProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full shadow-lg"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-semibold mb-4">Flashcard Preview</h2>

          <div className="mb-5">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Question</h3>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{question}</ReactMarkdown>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Answer</h3>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
