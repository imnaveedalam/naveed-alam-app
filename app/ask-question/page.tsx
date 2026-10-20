import type { Metadata } from "next";
import { QuestionForm } from "@/components/question-form";

export const metadata: Metadata = {
  title: "Ask Question",
  description: "Ask Naveed Alam a travel question.",
};

const topics = [
  { label: "Routes", detail: "Coast roads, plains, and the high passes." },
  { label: "Seasons", detail: "When a road is worth taking." },
  { label: "Gear", detail: "What actually stays on the bike." },
  { label: "Places", detail: "A valley or town you cannot shake." },
];

export default function AskQuestionPage() {
  return (
    <div className="page-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start lg:gap-14">
      <div>
        <p className="kicker">From the road</p>
        <h1 className="page-title">Ask a question</h1>
        <p className="lede">
          Routes, seasons, gear, or a place you cannot stop thinking about.
        </p>
        <ul className="mt-9 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1">
          {topics.map((topic) => (
            <li key={topic.label} className="panel panel-hover px-5 py-4 sm:px-5 sm:py-5">
              <p className="text-sm font-semibold tracking-tight text-sand-50">
                {topic.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-sand-300">
                {topic.detail}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <QuestionForm />
    </div>
  );
}
