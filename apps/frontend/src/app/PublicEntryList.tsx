"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "@/utils/client";
import { type Participant, type ParticipantsResponse } from "@/types/form";

export default function PublicEntryList() {
  // 参加者データを取得するメソッド
  const fetchParticipants = async (): Promise<ParticipantsResponse> => {
    try {
      // Honoクライアントを使用してデータを取得
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await (client as any).participants.$get();
      
      if (!response.ok) {
        throw new Error("参加者データの取得に失敗しました");
      }

      return response.json();
    } catch {
      // フォールバック: 直接fetchを使用
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
      const response = await fetch(`${API_URL}/participants`);
      
      if (!response.ok) {
        throw new Error("参加者データの取得に失敗しました");
      }

      return response.json();
    }
  };

  // useQueryを使用してparticipantsデータを取得
  const {
    data: participantsResponse,
    isLoading,
    error,
  } = useQuery<ParticipantsResponse, Error>({
    queryKey: ["participants"],
    queryFn: fetchParticipants,
  });

  const participants = participantsResponse?.participants ?? [];

  // キャンセルしていない参加者数を計算
  const activeParticipantCount = participants.filter(
    (participant) => !participant.isCancelled
  ).length;

  // 表示名を取得する関数
  const getDisplayName = (participant: Participant): string => {
    if (participant.isCancelled) {
      return "＜キャンセル＞";
    }
    return participant.displayName || 
           `${participant.lastNameKanji} ${participant.firstNameKanji}`;
  };

  // 在住地を取得する関数
  const getPrefecture = (participant: Participant): string => {
    if (participant.isCancelled) {
      return "＜キャンセル＞";
    }
    return participant.prefecture || "未記入";
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">参加者一覧</h2>
      
      {/* 参加者数表示 */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-lg font-semibold text-blue-800">
          現在の参加者数: <span className="text-2xl">{activeParticipantCount}</span>名
        </p>
        <p className="text-sm text-blue-600 mt-1">
          （キャンセルされた方は除く）
        </p>
      </div>

      {/* 参加者リスト */}
      {participants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          参加者が登録されていません
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  ID
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  表示名
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  在住地
                </th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr
                  key={participant.id}
                  className={`hover:bg-gray-50 ${
                    participant.isCancelled 
                      ? "bg-gray-100 text-gray-500" 
                      : ""
                  }`}
                >
                  <td className="border border-gray-300 px-4 py-3 font-mono text-sm">
                    {participant.id}
                  </td>
                  <td className={`border border-gray-300 px-4 py-3 ${
                    participant.isCancelled ? "italic" : ""
                  }`}>
                    {getDisplayName(participant)}
                  </td>
                  <td className={`border border-gray-300 px-4 py-3 ${
                    participant.isCancelled ? "italic" : ""
                  }`}>
                    {getPrefecture(participant)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* フッター情報 */}
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>キャンセルされた参加者は背景色を変えて表示されます</p>
      </div>
    </div>
  );
}
