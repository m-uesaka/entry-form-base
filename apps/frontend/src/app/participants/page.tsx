import PublicEntryList from "../PublicEntryList";
import Link from "next/link";

export default function ParticipantsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
          >
            ← 参加者登録に戻る
          </Link>
        </div>
        
        <PublicEntryList />
      </div>
    </div>
  );
}
