import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="min-h-screen bg-white dark:bg-black py-16 px-4"
      role="main"
    >
      <div className="max-w-xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Page not found</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          This tool doesn&apos;t exist (or the URL is wrong).
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2"
        >
          Go to homepage
        </Link>
      </div>
    </main>
  );
}
