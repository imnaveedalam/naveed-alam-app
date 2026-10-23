import type { Metadata } from "next";
import { Backpack, CalendarDays, Map, Motorbike } from "lucide-react";
import { QuestionForm } from "@/components/question-form";

export const metadata: Metadata = {
  title: "Ask Question",
  description:
    "Ask Naveed Alam a motorcycle travel question about routes, seasons, gear, or places across Pakistan.",
  openGraph: {
    title: "Ask Question · Naveed Alam",
    description:
      "Ask about motorcycle routes, seasons, gear, and places across Pakistan.",
  },
};

const topics = [
  {
    label: "Routes",
    detail: "Coast roads, plains, and the high passes.",
    icon: Map,
  },
  {
    label: "Seasons",
    detail: "When a road is worth taking.",
    icon: CalendarDays,
  },
  {
    label: "Gear",
    detail: "What actually stays on the bike.",
    icon: Backpack,
  },
  {
    label: "Places",
    detail: "A valley or town you cannot shake.",
    icon: Motorbike,
  },
];

export default function AskQuestionPage() {
  return (
    <div className="page-shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start lg:gap-14">
      <div>
        <p className="kicker inline-flex items-center gap-2">
          <Motorbike className="h-4 w-4" aria-hidden="true" />
          From the road
        </p>
        <h1 className="page-title">Ask a question</h1>
        <p className="lede">
          Routes, seasons, gear, or a place you cannot stop thinking about.
        </p>
        <ul className="mt-9 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <li
                key={topic.label}
                className="panel panel-hover px-5 py-4 sm:px-5 sm:py-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-forest-950/60 text-ember-400">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="font-display text-base uppercase tracking-[0.12em] text-sand-50">
                    {topic.label}
                  </p>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-sand-300">
                  {topic.detail}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <QuestionForm />
    </div>
  );
}
