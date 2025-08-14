"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/utils/client";
import {
  type Participant,
  type UpdateParticipantFormData,
  PREFECTURES,
} from "@/types/form";

export default function MyPage() {
  const router = useRouter();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [formData, setFormData] = useState<UpdateParticipantFormData>({
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
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitMessage, setSubmitMessage] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async (
      data: UpdateParticipantFormData & { participantId: string },
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { participantId, prefectureOther, ...baseData } = data;

      // 「その他」が選択されており、prefectureOtherに値がある場合は、そちらを使用
      const submitData = {
        ...baseData,
        prefecture:
          data.prefecture === "その他" && data.prefectureOther
            ? data.prefectureOther
            : data.prefecture,
      };

      const response = await client.participants[":id"].$put({
        param: { id: data.participantId },
        json: submitData,
      });

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await (client as any).participants[participantId].$put(
          {
            json: submitData,
          },
        );
        return await response.json();
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // フォールバック処理
        const API_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
        const response = await fetch(
          `${API_URL}/participants/${participantId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        return await response.json();
      }
    },
    onSuccess: (data) => {
      if (data.success && data.participant) {
        setSubmitMessage("参加者情報を更新しました");
        localStorage.setItem("participant", JSON.stringify(data.participant));
        setParticipant(data.participant);
        setErrors({});
      } else {
        setSubmitMessage(data.message || "更新に失敗しました");
      }
    },
    onError: (error: Error) => {
      setSubmitMessage(error.message || "更新に失敗しました");
      setErrors({});
    },
  });

  // ログイン状態を確認し、参加者情報を読み込み
  useEffect(() => {
    const savedParticipant = localStorage.getItem("participant");
    if (!savedParticipant) {
      router.push("/login");
      return;
    }

    const parsedParticipant = JSON.parse(savedParticipant) as Participant;
    setParticipant(parsedParticipant);

    // フォームデータを初期化
    setFormData({
      lastNameKanji: parsedParticipant.lastNameKanji,
      firstNameKanji: parsedParticipant.firstNameKanji,
      lastNameKana: parsedParticipant.lastNameKana,
      firstNameKana: parsedParticipant.firstNameKana,
      email: parsedParticipant.email,
      displayName: parsedParticipant.displayName || "",
      prefecture: parsedParticipant.prefecture || "",
      prefectureOther: "",
      freeText: parsedParticipant.freeText || "",
      isCancelled: parsedParticipant.isCancelled,
    });
  }, [router]);

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("participant");
    router.push("/login");
  };

  const handleInputChange = (
    field: keyof UpdateParticipantFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // エラーをクリア
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!participant) return;

    // バリデーション (簡易版)
    const newErrors: { [key: string]: string } = {};
    if (!formData.lastNameKanji.trim())
      newErrors.lastNameKanji = "名字（漢字）は必須です";
    if (!formData.firstNameKanji.trim())
      newErrors.firstNameKanji = "名前（漢字）は必須です";
    if (!formData.lastNameKana.trim())
      newErrors.lastNameKana = "名字（ふりがな）は必須です";
    if (!formData.firstNameKana.trim())
      newErrors.firstNameKana = "名前（ふりがな）は必須です";
    if (!formData.email.trim()) newErrors.email = "メールアドレスは必須です";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitMessage("");
    mutation.mutate({ ...formData, participantId: participant.id });
  };

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
            <h1 className="text-2xl font-bold text-gray-900">
              参加者マイページ
            </h1>
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
              参加者ID:{" "}
              <span className="font-mono font-semibold">{participant.id}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              登録日:{" "}
              {new Date(participant.createdAt).toLocaleDateString("ja-JP")}
            </p>
          </div>
        </div>

        {/* フォーム */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              参加者情報の変更
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* 参加者IDを隠しフィールドで送信 */}
            <input type="hidden" name="participantId" value={participant.id} />

            {submitMessage && (
              <div
                className={`p-4 rounded-md ${
                  submitMessage.includes("更新しました")
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    submitMessage.includes("更新しました")
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {submitMessage}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 名字（漢字） */}
              <div>
                <label
                  htmlFor="lastNameKanji"
                  className="block text-sm font-medium text-gray-700"
                >
                  名字（漢字） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastNameKanji"
                  id="lastNameKanji"
                  value={formData.lastNameKanji}
                  onChange={(e) =>
                    handleInputChange("lastNameKanji", e.target.value)
                  }
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.lastNameKanji ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.lastNameKanji && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastNameKanji}
                  </p>
                )}
              </div>

              {/* 名前（漢字） */}
              <div>
                <label
                  htmlFor="firstNameKanji"
                  className="block text-sm font-medium text-gray-700"
                >
                  名前（漢字） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstNameKanji"
                  id="firstNameKanji"
                  value={formData.firstNameKanji}
                  onChange={(e) =>
                    handleInputChange("firstNameKanji", e.target.value)
                  }
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.firstNameKanji ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.firstNameKanji && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstNameKanji}
                  </p>
                )}
              </div>

              {/* 名字（ふりがな） */}
              <div>
                <label
                  htmlFor="lastNameKana"
                  className="block text-sm font-medium text-gray-700"
                >
                  名字（ふりがな） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastNameKana"
                  id="lastNameKana"
                  value={formData.lastNameKana}
                  onChange={(e) =>
                    handleInputChange("lastNameKana", e.target.value)
                  }
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.lastNameKana ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="やまだ"
                />
                {errors.lastNameKana && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastNameKana}
                  </p>
                )}
              </div>

              {/* 名前（ふりがな） */}
              <div>
                <label
                  htmlFor="firstNameKana"
                  className="block text-sm font-medium text-gray-700"
                >
                  名前（ふりがな） <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstNameKana"
                  id="firstNameKana"
                  value={formData.firstNameKana}
                  onChange={(e) =>
                    handleInputChange("firstNameKana", e.target.value)
                  }
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    errors.firstNameKana ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="たろう"
                />
                {errors.firstNameKana && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstNameKana}
                  </p>
                )}
              </div>
            </div>

            {/* メールアドレス */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* 表示名 */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700"
              >
                表示名（任意）
              </label>
              <input
                type="text"
                name="displayName"
                id="displayName"
                value={formData.displayName}
                onChange={(e) =>
                  handleInputChange("displayName", e.target.value)
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="表示名を入力（空白の場合は氏名が表示されます）"
              />
            </div>

            {/* 都道府県 */}
            <div>
              <label
                htmlFor="prefecture"
                className="block text-sm font-medium text-gray-700"
              >
                お住まいの都道府県（任意）
              </label>
              <select
                name="prefecture"
                id="prefecture"
                value={formData.prefecture}
                onChange={(e) =>
                  handleInputChange("prefecture", e.target.value)
                }
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
              <label
                htmlFor="prefectureOther"
                className="block text-sm font-medium text-gray-700"
              >
                具体的な都道府県名（「その他」を選択した場合のみ記入）
              </label>
              <input
                type="text"
                name="prefectureOther"
                id="prefectureOther"
                value={formData.prefectureOther}
                onChange={(e) =>
                  handleInputChange("prefectureOther", e.target.value)
                }
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.prefectureOther ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="都道府県名を入力してください"
              />
              {errors.prefectureOther && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.prefectureOther}
                </p>
              )}
            </div>

            {/* 自由記入欄 */}
            <div>
              <label
                htmlFor="freeText"
                className="block text-sm font-medium text-gray-700"
              >
                自由記入欄（任意）
              </label>
              <textarea
                name="freeText"
                id="freeText"
                rows={4}
                value={formData.freeText}
                onChange={(e) => handleInputChange("freeText", e.target.value)}
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
                    checked={formData.isCancelled}
                    onChange={(e) =>
                      handleInputChange("isCancelled", e.target.checked)
                    }
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="isCancelled"
                    className="font-medium text-red-700"
                  >
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
                disabled={mutation.isPending}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {mutation.isPending ? "更新中..." : "参加者情報を更新"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
