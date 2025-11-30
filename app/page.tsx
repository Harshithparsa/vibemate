import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="p-10 bg-white dark:bg-zinc-900 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">
          Welcome to Social Connect App
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Start by signing in or creating your profile.
        </p>
        <Link
          href="/auth"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Go to Auth Page
        </Link>
      </div>
    </div>
  );
}
