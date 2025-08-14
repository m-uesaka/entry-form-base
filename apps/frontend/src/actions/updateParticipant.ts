"use server";

import {
  type UpdateParticipantFormData,
  type MyPageFormState,
} from "@/types/form";
import { validateField } from "@/utils/validation";
import { client } from "@/utils/client";

// API呼び出し用のヘルパー関数
async function callUpdateAPI(
  participantId: number,
  updateData: UpdateParticipantFormData,
) {
  try {
    // Honoクライアントを使用してデータを更新
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (client as any).participants[participantId].$put({
      json: updateData,
    });

    if (!response.ok) {
      throw new Error("参加者データの更新に失敗しました");
    }

    return response.json();
  } catch {
    // フォールバック: 直接fetchを使用
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
    const response = await fetch(`${API_URL}/participants/${participantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  }
}

export async function updateParticipantAction(
  prevState: MyPageFormState,
  formData: FormData,
): Promise<MyPageFormState> {
  try {
    // フォームデータを取得
    const participantId = parseInt(formData.get("participantId") as string, 10);
    const lastNameKanji = formData.get("lastNameKanji") as string;
    const firstNameKanji = formData.get("firstNameKanji") as string;
    const lastNameKana = formData.get("lastNameKana") as string;
    const firstNameKana = formData.get("firstNameKana") as string;
    const email = formData.get("email") as string;
    const displayName = formData.get("displayName") as string;
    const prefecture = formData.get("prefecture") as string;
    const prefectureOther = formData.get("prefectureOther") as string;
    const freeText = formData.get("freeText") as string;
    const isCancelled = formData.get("isCancelled") === "on";

    // 更新データオブジェクトを構築
    const updateData: UpdateParticipantFormData = {
      lastNameKanji: lastNameKanji || "",
      firstNameKanji: firstNameKanji || "",
      lastNameKana: lastNameKana || "",
      firstNameKana: firstNameKana || "",
      email: email || "",
      displayName: displayName || "",
      prefecture:
        prefecture === "その他"
          ? prefectureOther?.trim() || "その他"
          : prefecture,
      prefectureOther: "",
      freeText: freeText || "",
      isCancelled,
    };

    // バリデーション
    const errors: { [key: string]: string } = {};

    // 必須フィールドのバリデーション
    const requiredFields = [
      "lastNameKanji",
      "firstNameKanji",
      "lastNameKana",
      "firstNameKana",
      "email",
    ] as const;

    for (const field of requiredFields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = validateField(field, updateData[field], updateData as any);
      if (error) {
        errors[field] = error;
      }
    }

    // バリデーションエラーがある場合
    if (Object.keys(errors).length > 0) {
      return {
        data: updateData,
        isSubmitting: false,
        errors,
        submitMessage: "",
        participant: prevState.participant,
      };
    }

    // API呼び出し
    const result = await callUpdateAPI(participantId, updateData);

    if (result.success) {
      return {
        data: updateData,
        isSubmitting: false,
        errors: {},
        submitMessage: "参加者情報を更新しました",
        participant: result.participant,
      };
    } else {
      return {
        data: updateData,
        isSubmitting: false,
        errors: {},
        submitMessage: result.message || "更新に失敗しました",
        participant: prevState.participant,
      };
    }
  } catch (error) {
    console.error("Update participant action failed:", error);
    return {
      data: prevState.data,
      isSubmitting: false,
      errors: {},
      submitMessage:
        "更新に失敗しました。しばらく経ってから再度お試しください。",
      participant: prevState.participant,
    };
  }
}
