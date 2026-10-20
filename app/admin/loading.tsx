export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ember-400">
        Private
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-sand-50 sm:text-5xl">
        Admin
      </h1>
      <p className="mt-4 text-sm text-sand-300" role="status">
        Loading...
      </p>
    </div>
  );
}
