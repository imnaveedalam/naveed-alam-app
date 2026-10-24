import { NextResponse } from "next/server";
import { notifyNewQuestion } from "@/lib/notify";
import { createSupabaseClient } from "@/lib/supabase";

type QuestionBody = {
  name?: unknown;
  email?: unknown;
  question?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: QuestionBody;

  try {
    body = (await request.json()) as QuestionBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = readString(body.name);
  const email = readString(body.email);
  const question = readString(body.question);

  if (name.length < 2 || name.length > 80) {
    return NextResponse.json(
      { error: "Enter a valid name." },
      { status: 400 },
    );
  }

  if (email.length > 120 || !emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  if (question.length < 10 || question.length > 1000) {
    return NextResponse.json(
      { error: "Enter a question between 10 and 1,000 characters." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("questions").insert({
    name,
    email,
    question,
  });

  if (error) {
    return NextResponse.json(
      { error: "The question could not be saved." },
      { status: 500 },
    );
  }

  await notifyNewQuestion({ name, email, question });

  return NextResponse.json({ ok: true });
}
