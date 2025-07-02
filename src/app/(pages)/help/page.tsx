"use client"

import React, { useState } from "react";
import Sidebar from "../../../../components/Sidebar";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "How do I create a new deck?",
    answer:
      "To create a new deck, navigate to the 'Decks' page and click the 'Create Deck' button. Enter a name and description, then save your deck.",
  },
  {
    question: "How can I add flashcards to a deck?",
    answer:
      "Open the deck you want to add flashcards to. Click 'Add Flashcard' and fill in the question and answer fields. Then save the flashcard.",
  },
  {
    question: "Can I edit or delete flashcards?",
    answer:
      "Yes! Open the flashcard you want to edit or delete. You can update the question and answer, or click the delete button to remove it permanently.",
  },
  {
    question: "How does the Analytics Dashboard work?",
    answer:
      "The Analytics Dashboard provides insights into your decks and flashcards, showing totals and averages, as well as charts visualizing your progress.",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "Go to the sign-in page and click 'Forgot Password'. Follow the instructions to reset your password via email.",
  },
  {
    question: "Who can I contact for support?",
    answer:
      "For support, please email support@flashdecks.com or visit our contact page for more options.",
  },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(({ question, answer }) =>
    question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 hidden sm:block">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-grow flex flex-col py-12 px-8 sm:px-12 lg:px-16 overflow-auto">
          <header className="max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Help & Support</h1>
            <p className="text-lg text-indigo-100 max-w-xl">
              Find answers to common questions and get help navigating FlashDecks.
            </p>
          </header>

          {/* Search Input */}
          <div className="w-full max-w-4xl mx-auto mb-12 px-4">
            <div className="w-full rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
              <input
                type="search"
                aria-label="Search help topics"
                placeholder="Search help topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-5 text-lg text-black focus:outline-none focus:ring-4 focus:ring-pink-400"
              />
            </div>
          </div>

          {/* FAQ Accordion */}
          <section className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
            {filteredFaqs.length === 0 ? (
              <p className="text-indigo-200 text-center py-12">
                No results found for &quot;{searchTerm}&quot;
              </p>
            ) : (
              <ul>
                {filteredFaqs.map(({ question, answer }, i) => (
                  <li key={i} className="border-b border-white/20 last:border-none">
                    <button
                      onClick={() => toggleIndex(i)}
                      className="w-full text-left flex justify-between items-center py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                      aria-expanded={openIndex === i}
                      aria-controls={`faq-answer-${i}`}
                      id={`faq-question-${i}`}
                    >
                      <span className="text-xl font-semibold">{question}</span>
                      <svg
                        className={`w-6 h-6 transition-transform duration-300 ${
                          openIndex === i ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                        openIndex === i ? "max-h-96 py-2" : "max-h-0"
                      }`}
                    >
                      <p className="text-indigo-100 pl-2">{answer}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Contact Support */}
          <footer className="max-w-4xl mx-auto mt-16 text-center text-indigo-200">
            <p>
              Can&apos;t find what you&apos;re looking for? Contact our support team at{" "}
              <a href="mailto:support@flashdecks.com" className="text-pink-400 hover:underline">
                support@flashdecks.com
              </a>
              .
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
