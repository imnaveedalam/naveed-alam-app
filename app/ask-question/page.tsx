import type { Metadata } from "next";
import { QuestionForm } from "@/components/question-form";

export const metadata: Metadata = {
  title: "Ask Question",
  description: "Ask Naveed Alam a travel question.",
};

export default function AskQuestionPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-400">
          From the road
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
          Ask a question
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-sand-300">
          Routes, seasons, gear, or a place you cannot stop thinking about.
        </p>
      </div>
      <QuestionForm />
    </div>
  );
}
