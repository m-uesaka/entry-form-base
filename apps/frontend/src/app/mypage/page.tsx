"use client";

import { useState, useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { type Participant, type MyPageFormState, PREFECTURES } from "@/types/form";
import { updateParticipantAction } from "@/actions/updateParticipant";

export default function MyPage() {
  const router = useRouter();
  const [participant, setParticipant] = useState<Participant | null>(null);

  // 初期状態
  const initialFormState: MyPageFormState = {
    data: {
      lastNameKanji: "",
      firstNameKanji: "",
      lastNameKana: "",
      firstNameKana: "",
      email: "",
      displayName: "",
      prefecture: "",
      prefectureOther: "",
      freeText: "",
      isCancelled: false,
    },
    isSubmitting: false,
    errors: {},
    submitMessage: "",
    participant: null,
  };

  // useActionStateを使用
  const [state, formAction, isPending] = useActionState(
    updateParticipantAction,
    initialFormState
  );

  // ログイン状態を確認し、参加者情報を読み込み
  useEffect(() => {
    const savedParticipant = localStorage.getItem("participant");
    if (!savedParticipant) {
      router.push("/login");
      return;
    }

    const parsedParticipant = JSON.parse(savedParticipant) as Participant;
    setParticipant(parsedParticipant);
  }, [router]);

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("participant");
    router.push("/login");
  };

  // 更新成功時にlocalStorageを更新
  useEffect(() => {
    if (state.participant && state.submitMessage?.includes("更新しました")) {
      localStorage.setItem("participant", JSON.stringify(state.participant));
      setParticipant(state.participant);
    }
  }, [state.participant, state.submitMessage]);

  if (!participant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">参加者マイページ</h1>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ログアウト
            </button>
          </div>
          <div className="px-6 py-4">
            <p className="text-gray-600">
              参加者ID: <span className="font-mono font-semibold">{participant.id}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              登録日: {new Date(participant.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>

        {/* フォーム */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">参加者情報の変更</h2>
          </div>
          
          <form action={formAction} className="px-6 py-6 space-y-6">
            {/* 参加者IDを隠しフィールドで送信 */}
            <input type="hidden" name="participantId" value={participant.id} />
            
            {state.submitMessage && (
              <div className={`p-4 rounded-md ${
                state.submitMessage.includes("更新しました") 
                  ? "bg-green-50 border border-green-200" 
                  : "bg-red-50 border border-red-200"
              }`}>
                <p className={`text-sm ${
                  state.submitMessage.includes("更新しました") ? "text-green-700" : "text-red-700"
                }`}>
                  {state.submitMessage}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 名字（漢字） */}
              <div>
                <label htmlFor="lastNameKanji" className="block text-sm font-medium text-gray-700">
                  名字（漢字） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastNameKanji"
                  id="lastNameKanji"
                  defaultValue={participant.lastNameKanji}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    state.errors.lastNameKanji ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {state.errors.lastNameKanji && (
                  <p className="mt-1 text-sm text-red-600">{state.errors.lastNameKanji}</p>
                )}
              </div>

              {/* 名前（漢字） */}
              <div>
                <label htmlFor="firstNameKanji" className="block text-sm font-medium text-gray-700">
                  名前（漢字） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstNameKanji"
                  id="firstNameKanji"
                  defaultValue={participant.firstNameKanji}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    state.errors.firstNameKanji ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {state.errors.firstNameKanji && (
                  <p className="mt-1 text-sm text-red-600">{state.errors.firstNameKanji}</p>
                )}
              </div>

              {/* 名字（ふりがな） */}
              <div>
                <label htmlFor="lastNameKana" className="block text-sm font-medium text-gray-700">
                  名字（ふりがな） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastNameKana"
                  id="lastNameKana"
                  defaultValue={participant.lastNameKana}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    state.errors.lastNameKana ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="やまだ"
                />
                {state.errors.lastNameKana && (
                  <p className="mt-1 text-sm text-red-600">{state.errors.lastNameKana}</p>
                )}
              </div>

              {/* 名前（ふりがな） */}
              <div>
                <label htmlFor="firstNameKana" className="block text-sm font-medium text-gray-700">
                  名前（ふりがな） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstNameKana"
                  id="firstNameKana"
                  defaultValue={participant.firstNameKana}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    state.errors.firstNameKana ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="たろう"
                />
                {state.errors.firstNameKana && (
                  <p className="mt-1 text-sm text-red-600">{state.errors.firstNameKana}</p>
                )}
              </div>
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                defaultValue={participant.email}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  state.errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="example@email.com"
              />
              {state.errors.email && (
                <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>
              )}
            </div>

            {/* 表示名 */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                表示名（任意）
              </label>
              <input
                type="text"
                name="displayName"
                id="displayName"
                defaultValue={participant.displayName || ""}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="表示名を入力（空白の場合は氏名が表示されます）"
              />
            </div>

            {/* 都道府県 */}
            <div>
              <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700">
                お住まいの都道府県（任意）
              </label>
              <select
                name="prefecture"
                id="prefecture"
                defaultValue={participant.prefecture || ""}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">選択してください</option>
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
            </div>

            {/* その他の都道府県（条件付き表示は難しいので、常に表示し、サーバーサイドでバリデーション） */}
            <div>
              <label htmlFor="prefectureOther" className="block text-sm font-medium text-gray-700">
                具体的な都道府県名（「その他」を選択した場合のみ記入）
              </label>
              <input
                type="text"
                name="prefectureOther"
                id="prefectureOther"
                defaultValue=""
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  state.errors.prefectureOther ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="都道府県名を入力してください"
              />
              {state.errors.prefectureOther && (
                <p className="mt-1 text-sm text-red-600">{state.errors.prefectureOther}</p>
              )}
            </div>

            {/* 自由記入欄 */}
            <div>
              <label htmlFor="freeText" className="block text-sm font-medium text-gray-700">
                自由記入欄（任意）
              </label>
              <textarea
                name="freeText"
                id="freeText"
                rows={4}
                defaultValue={participant.freeText || ""}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="ご質問やご要望などがありましたらご記入ください"
              />
            </div>

            {/* キャンセルチェックボックス */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isCancelled"
                    name="isCancelled"
                    type="checkbox"
                    defaultChecked={participant.isCancelled}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isCancelled" className="font-medium text-red-700">
                    参加をキャンセルしますか？
                  </label>
                  <p className="text-red-600">
                    このチェックボックスをONにして更新すると、参加がキャンセルされます。
                  </p>
                </div>
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isPending}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isPending ? "更新中..." : "参加者情報を更新"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
