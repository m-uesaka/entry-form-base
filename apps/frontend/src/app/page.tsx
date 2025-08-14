import NewParticipantsForm from "./NewParticipantsForm";

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
