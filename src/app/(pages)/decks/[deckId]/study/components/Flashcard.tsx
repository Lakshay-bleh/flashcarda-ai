'use client';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

type FlashcardProps = {
  question: string;
  answer: string;
  flipped: boolean;
  onFlip: () => void;
  className?: string;
};

export default function Flashcard({
  question,
  answer,
  flipped,
  onFlip,
  className = '',
}: FlashcardProps) {
  return (
    <div
      onClick={onFlip}
      className={`flashcard-container cursor-pointer select-none transition-transform duration-300 ${flipped ? 'flipped' : ''} ${className}`}
    >
      <motion.div
        className="relative w-full h-48 bg-white dark:bg-gray-800 shadow rounded-lg p-4"
        animate={{ rotateY: flipped ? 180 : 0, transformStyle: 'preserve-3d' }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-lg" style={{ backfaceVisibility: 'hidden' }}>
          <ReactMarkdown>{question}</ReactMarkdown>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-lg rotate-y-180" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
          <ReactMarkdown>{answer}</ReactMarkdown>
        </div>
      </motion.div>
    </div>
  );
}
