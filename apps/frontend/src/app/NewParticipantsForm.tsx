'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface NewParticipantFormData {
  lastNameKanji: string
  firstNameKanji: string
  lastNameKana: string
  firstNameKana: string
  email: string
  displayName?: string
  prefecture?: string
  freeText?: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  [key: string]: string
}

export default function NewParticipantsForm() {
  const queryClient = useQueryClient()
  
  const [formData, setFormData] = useState<NewParticipantFormData>({
    lastNameKanji: '',
    firstNameKanji: '',
    lastNameKana: '',
    firstNameKana: '',
    email: '',
    displayName: '',
    prefecture: '',
    freeText: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mutation for creating new participant
  const createParticipantMutation = useMutation({
    mutationFn: async (data: Omit<NewParticipantFormData, 'confirmPassword'>) => {
      // バックエンドのURL（開発環境用）
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';
      const response = await fetch(`${API_URL}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      // Reset form
      setFormData({
        lastNameKanji: '',
        firstNameKanji: '',
        lastNameKana: '',
        firstNameKana: '',
        email: '',
        displayName: '',
        prefecture: '',
        freeText: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      alert('参加者登録が完了しました！');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      setErrors({ submit: error.message });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required field validation
    if (!formData.lastNameKanji.trim()) {
      newErrors.lastNameKanji = '名字（漢字）は必須です'
    }
    if (!formData.firstNameKanji.trim()) {
      newErrors.firstNameKanji = '名前（漢字）は必須です'
    }
    if (!formData.lastNameKana.trim()) {
      newErrors.lastNameKana = '名字（ふりがな）は必須です'
    }
    if (!formData.firstNameKana.trim()) {
      newErrors.firstNameKana = '名前（ふりがな）は必須です'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }
    if (!formData.password.trim()) {
      newErrors.password = 'パスワードは必須です'
    } else if (formData.password.length < 10) {
      newErrors.password = 'パスワードは10文字以上で入力してください'
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'パスワード確認は必須です'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません'
    }

    // Kana validation (basic check for Japanese characters)
    if (formData.lastNameKana && !/^[ひらがなー]+$/.test(formData.lastNameKana)) {
      newErrors.lastNameKana = 'ひらがなで入力してください'
    }
    if (formData.firstNameKana && !/^[ひらがなー]+$/.test(formData.firstNameKana)) {
      newErrors.firstNameKana = 'ひらがなで入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    const { confirmPassword, ...submitData } = formData
    createParticipantMutation.mutate(submitData)
  }

  const handleInputChange = (field: keyof NewParticipantFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
    '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
    '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
    '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
  ]

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">新規参加者登録</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastNameKanji" className="block text-sm font-medium text-gray-700 mb-1">
              名字（漢字） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastNameKanji"
              value={formData.lastNameKanji}
              onChange={handleInputChange('lastNameKanji')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastNameKanji ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="田中"
            />
            {errors.lastNameKanji && <p className="mt-1 text-sm text-red-500">{errors.lastNameKanji}</p>}
          </div>

          <div>
            <label htmlFor="firstNameKanji" className="block text-sm font-medium text-gray-700 mb-1">
              名前（漢字） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstNameKanji"
              value={formData.firstNameKanji}
              onChange={handleInputChange('firstNameKanji')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstNameKanji ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="太郎"
            />
            {errors.firstNameKanji && <p className="mt-1 text-sm text-red-500">{errors.firstNameKanji}</p>}
          </div>
        </div>

        {/* Kana fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lastNameKana" className="block text-sm font-medium text-gray-700 mb-1">
              名字（ふりがな） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastNameKana"
              value={formData.lastNameKana}
              onChange={handleInputChange('lastNameKana')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lastNameKana ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="たなか"
            />
            {errors.lastNameKana && <p className="mt-1 text-sm text-red-500">{errors.lastNameKana}</p>}
          </div>

          <div>
            <label htmlFor="firstNameKana" className="block text-sm font-medium text-gray-700 mb-1">
              名前（ふりがな） <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstNameKana"
              value={formData.firstNameKana}
              onChange={handleInputChange('firstNameKana')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.firstNameKana ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="たろう"
            />
            {errors.firstNameKana && <p className="mt-1 text-sm text-red-500">{errors.firstNameKana}</p>}
          </div>
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="example@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* Display name field */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            表示名（web上で表示される名前）
          </label>
          <input
            type="text"
            id="displayName"
            value={formData.displayName}
            onChange={handleInputChange('displayName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="タロウ"
          />
          <p className="mt-1 text-sm text-gray-500">空欄の場合は名前（漢字）が使用されます</p>
        </div>

        {/* Prefecture field */}
        <div>
          <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">
            在住地
          </label>
          <select
            id="prefecture"
            value={formData.prefecture}
            onChange={(e) => setFormData(prev => ({ ...prev, prefecture: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">選択してください</option>
            {prefectures.map((pref) => (
              <option key={pref} value={pref}>{pref}</option>
            ))}
          </select>
        </div>

        {/* Free text field */}
        <div>
          <label htmlFor="freeText" className="block text-sm font-medium text-gray-700 mb-1">
            自由記述欄
          </label>
          <textarea
            id="freeText"
            value={formData.freeText}
            onChange={handleInputChange('freeText')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="その他ご質問やコメントがあればこちらにどうぞ"
          />
        </div>

        {/* Password fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="10文字以上"
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            <p className="mt-1 text-sm text-gray-500">マイページへのログインに使用します</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード確認 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="パスワードを再入力"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Submit button */}
        <div>
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.submit}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? '登録中...' : '参加者登録'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-500">
        <p><span className="text-red-500">*</span> 必須項目</p>
        <p>登録いただいた情報は、イベントの運営にのみ使用いたします。</p>
      </div>
    </div>
  )
}
