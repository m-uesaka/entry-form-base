import NewParticipantsForm from "./NewParticipantsForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            イベント参加者登録
          </h1>
          <p className="text-lg text-gray-600">
            こちらから新規参加者の登録を行うことができます
          </p>

          {/* ナビゲーションリンク */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              参加者ログイン
            </Link>
            <Link
              href="/participants"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              参加者一覧を見る
            </Link>
          </div>
        </header>

        <main>
          <NewParticipantsForm />
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2025 Event Registration System</p>
        </footer>
      </div>
    </div>
  );
}
