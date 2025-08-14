import { NewParticipantFormData, FormErrors } from "@/types/form";

export const validateParticipantForm = (
  formData: NewParticipantFormData,
): FormErrors => {
  const errors: FormErrors = {};

  // Required field validation
  if (!formData.lastNameKanji.trim()) {
    errors.lastNameKanji = "名字（漢字）は必須です";
  }
  if (!formData.firstNameKanji.trim()) {
    errors.firstNameKanji = "名前（漢字）は必須です";
  }
  if (!formData.lastNameKana.trim()) {
    errors.lastNameKana = "名字（ふりがな）は必須です";
  }
  if (!formData.firstNameKana.trim()) {
    errors.firstNameKana = "名前（ふりがな）は必須です";
  }
  if (!formData.email.trim()) {
    errors.email = "メールアドレスは必須です";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "有効なメールアドレスを入力してください";
  }
  if (!formData.password.trim()) {
    errors.password = "パスワードは必須です";
  } else if (formData.password.length < 10) {
    errors.password = "パスワードは10文字以上で入力してください";
  }
  if (!formData.confirmPassword.trim()) {
    errors.confirmPassword = "パスワード確認は必須です";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "パスワードが一致しません";
  }

  // Kana validation (basic check for Japanese characters)
  if (
    formData.lastNameKana &&
    !/^[\u3040-\u309F\u30FC]+$/.test(formData.lastNameKana)
  ) {
    errors.lastNameKana = "ひらがなで入力してください";
  }
  if (
    formData.firstNameKana &&
    !/^[\u3040-\u309F\u30FC]+$/.test(formData.firstNameKana)
  ) {
    errors.firstNameKana = "ひらがなで入力してください";
  }

  return errors;
};

export const validateField = (
  field: keyof NewParticipantFormData,
  value: string,
  formData: NewParticipantFormData,
): string | null => {
  switch (field) {
    case "lastNameKanji":
      if (!value.trim()) return "名字（漢字）は必須です";
      break;
    case "firstNameKanji":
      if (!value.trim()) return "名前（漢字）は必須です";
      break;
    case "lastNameKana":
      if (!value.trim()) return "名字（ふりがな）は必須です";
      if (value && !/^[\u3040-\u309F\u30FC]+$/.test(value))
        return "ひらがなで入力してください";
      break;
    case "firstNameKana":
      if (!value.trim()) return "名前（ふりがな）は必須です";
      if (value && !/^[\u3040-\u309F\u30FC]+$/.test(value))
        return "ひらがなで入力してください";
      break;
    case "email":
      if (!value.trim()) return "メールアドレスは必須です";
      if (!/\S+@\S+\.\S+/.test(value))
        return "有効なメールアドレスを入力してください";
      break;
    case "password":
      if (!value.trim()) return "パスワードは必須です";
      if (value.length < 10) return "パスワードは10文字以上で入力してください";
      break;
    case "confirmPassword":
      if (!value.trim()) return "パスワード確認は必須です";
      if (formData.password !== value) return "パスワードが一致しません";
      break;
  }
  return null;
};

// 単独でメールアドレスをバリデーションする関数
export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return "メールアドレスは必須です";
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "有効なメールアドレスを入力してください";
  }
  return null;
};
