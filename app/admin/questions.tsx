import { createClient } from "@/lib/supabase/server";

type QuestionRow = {
  id: string;
  name: string;
  email: string;
  question: string;
  created_at: string;
};

function formatSubmittedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Karachi",
  }).format(date);
}

export async function AdminQuestions() {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("questions")
    .select("id, name, email, question, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <section aria-labelledby="admin-questions-heading">
        <h2
          id="admin-questions-heading"
          className="text-lg font-semibold text-sand-50"
        >
          Questions
        </h2>
        <p
          className="mt-4 rounded-3xl border border-white/10 bg-forest-800 px-6 py-5 text-sm leading-relaxed text-sand-300"
          role="alert"
        >
          Questions could not be loaded.{" "}
          <a
            href="/admin"
            className="font-medium text-ember-400 hover:text-ember-300"
          >
            Try again
          </a>
          .
        </p>
      </section>
    );
  }

  const questions = (data ?? []) as QuestionRow[];

  return (
    <section aria-labelledby="admin-questions-heading">
      <h2
        id="admin-questions-heading"
        className="text-lg font-semibold text-sand-50"
      >
        Questions
      </h2>
      <p className="mt-2 text-sm text-sand-300">
        {questions.length === 0
          ? "Nothing submitted yet."
          : `${questions.length} submitted`}
      </p>

      {questions.length === 0 ? (
        <p className="mt-4 rounded-3xl border border-white/10 bg-forest-800 px-6 py-5 text-sm leading-relaxed text-sand-300">
          No questions yet.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {questions.map((item) => (
            <li key={item.id}>
              <article className="rounded-3xl border border-white/10 bg-forest-800 p-5 sm:p-6">
                <h3 className="text-base font-semibold text-sand-50">
                  {item.name}
                </h3>
                <p className="mt-1 break-all text-sm text-sand-300">
                  {item.email}
                </p>
                <p className="mt-2 text-xs text-sand-400">
                  <time dateTime={item.created_at}>
                    {formatSubmittedAt(item.created_at)}
                  </time>
                </p>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-sand-100">
                  {item.question}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
