'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

type PreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  question: string;
  answer: string;
};

export default function PreviewModal({ isOpen, onClose, question, answer }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-semibold mb-4">Flashcard Preview</h3>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Question:</h4>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{question}</ReactMarkdown>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Answer:</h4>
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
