"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/utils/client";
import { validateParticipantForm, validateField } from "@/utils/validation";
import { NewParticipantFormData, FormState, PREFECTURES } from "@/types/form";

const initialState: FormState = {
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
    password: "",
    confirmPassword: "",
  },
  errors: {},
  isSubmitting: false,
};

export default function NewParticipantsForm() {
  const [state, setState] = useState<FormState>(initialState);

  const mutation = useMutation({
    mutationFn: async (data: NewParticipantFormData) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, prefectureOther, ...baseData } = data;

      // 「その他」が選択されており、prefectureOtherに値がある場合は、そちらを使用
      const submitData = {
        ...baseData,
        prefecture:
          data.prefecture === "その他" && data.prefectureOther
            ? data.prefectureOther
            : data.prefecture,
      };

      try {
        const response = await (client as any).participants.$post({
          json: submitData,
        });
        return await response.json();
      } catch (error) {
        // フォールバック処理
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
        const response = await fetch(`${API_URL}/participants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        return await response.json();
      }
    },
    onSuccess: () => {
      setState({
        data: initialState.data,
        errors: {},
        isSubmitting: false,
        submitMessage: "参加者登録が完了しました！",
      });
    },
    onError: (error: Error) => {
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          submit: error.message || "登録に失敗しました",
        },
        isSubmitting: false,
      }));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // バリデーション
    const errors = validateParticipantForm(state.data);

    if (Object.keys(errors).length > 0) {
      setState(prev => ({
        ...prev,
        errors,
        isSubmitting: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true, errors: {} }));
    mutation.mutate(state.data);
  };

  const handleInputChange = (
    field: keyof NewParticipantFormData,
    value: string,
  ) => {
    // フォームデータを更新
    setState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
    }));

    // Field-level validation on change
    const fieldError = validateField(field, value, {
      ...state.data,
      [field]: value,
    });

    // Clear field error if validation passes
    if (!fieldError && state.errors[field]) {
      setState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: "",
        },
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">新規参加者登録</h2>

      {state.submitMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {state.submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="lastNameKanji"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              名字（漢字） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastNameKanji"
              name="lastNameKanji"
              value={state.data.lastNameKanji}
              onChange={(e) =>
                handleInputChange("lastNameKanji", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                state.errors.lastNameKanji
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="田中"
            />
            {state.errors.lastNameKanji && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.lastNameKanji}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="firstNameKanji"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              名前（漢字） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstNameKanji"
              name="firstNameKanji"
              value={state.data.firstNameKanji}
              onChange={(e) =>
                handleInputChange("firstNameKanji", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                state.errors.firstNameKanji
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="太郎"
            />
            {state.errors.firstNameKanji && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.firstNameKanji}
              </p>
            )}
          </div>
        </div>

        {/* Kana fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="lastNameKana"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              名字（ふりがな） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastNameKana"
              name="lastNameKana"
              value={state.data.lastNameKana}
              onChange={(e) =>
                handleInputChange("lastNameKana", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                state.errors.lastNameKana ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="たなか"
            />
            {state.errors.lastNameKana && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.lastNameKana}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="firstNameKana"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              名前（ふりがな） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstNameKana"
              name="firstNameKana"
              value={state.data.firstNameKana}
              onChange={(e) =>
                handleInputChange("firstNameKana", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                state.errors.firstNameKana
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="たろう"
            />
            {state.errors.firstNameKana && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.firstNameKana}
              </p>
            )}
          </div>
        </div>

        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={state.data.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              state.errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="example@example.com"
          />
          {state.errors.email && (
            <p className="mt-1 text-sm text-red-500">{state.errors.email}</p>
          )}
        </div>

        {/* Display name field */}
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            表示名（web上で表示される名前）
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={state.data.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="タロウ"
          />
          <p className="mt-1 text-sm text-gray-500">
            空欄の場合はフルネームが使用されます
          </p>
        </div>

        {/* Prefecture field */}
        <div>
          <label
            htmlFor="prefecture"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            在住地
          </label>
          <select
            id="prefecture"
            name="prefecture"
            value={state.data.prefecture}
            onChange={(e) => handleInputChange("prefecture", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((pref) => (
              <option key={pref} value={pref}>
                {pref}
              </option>
            ))}
          </select>
        </div>

        {/* Prefecture Other field - always shown */}
        <div>
          <label
            htmlFor="prefectureOther"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            （上で「その他」を選ばれた方）差し支えなければ、具体的な在住地をお書きください。
          </label>
          <input
            type="text"
            id="prefectureOther"
            name="prefectureOther"
            value={state.data.prefectureOther}
            onChange={(e) =>
              handleInputChange("prefectureOther", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例: 海外、日本国外など"
          />
        </div>

        {/* Free text field */}
        <div>
          <label
            htmlFor="freeText"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            自由記述欄
          </label>
          <textarea
            id="freeText"
            name="freeText"
            value={state.data.freeText}
            onChange={(e) => handleInputChange("freeText", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="その他ご質問やコメントがあればこちらにどうぞ"
          />
        </div>

        {/* Password fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              パスワード （10文字以上）<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={state.data.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                state.errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="10文字以上"
            />
            {state.errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.password}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              マイページへのログインに使用します
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              パスワード確認 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={state.data.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                state.errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="パスワードを再入力"
            />
            {state.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {state.errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div>
          {state.errors.submit && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {state.errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={state.isSubmitting || mutation.isPending}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              state.isSubmitting || mutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {state.isSubmitting || mutation.isPending ? "登録中..." : "参加者登録"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-500">
        <p>
          <span className="text-red-500">*</span> 必須項目
        </p>
        <p>登録いただいた情報は、イベントの運営にのみ使用いたします。</p>
      </div>
    </div>
  );
}
