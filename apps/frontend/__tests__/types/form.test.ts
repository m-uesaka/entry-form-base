import { describe, it, expect } from 'bun:test'
import { PREFECTURES } from '../../src/types/form'
import type { NewParticipantFormData, FormErrors, FormState, Prefecture } from '../../src/types/form'

describe('form.ts', () => {
  describe('PREFECTURES定数', () => {
    it('47都道府県が定義されていること', () => {
      expect(PREFECTURES).toHaveLength(47)
    })

    it('すべての都道府県が正しく含まれていること', () => {
      const expectedPrefectures = [
        '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
        '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
        '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
        '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
        '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
        '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
        '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
      ]

      expectedPrefectures.forEach(prefecture => {
        expect(PREFECTURES).toContain(prefecture)
      })
    })

    it('重複する都道府県がないこと', () => {
      const uniquePrefectures = [...new Set(PREFECTURES)]
      expect(uniquePrefectures).toHaveLength(PREFECTURES.length)
    })

    it('各都道府県が文字列であること', () => {
      PREFECTURES.forEach(prefecture => {
        expect(typeof prefecture).toBe('string')
        expect(prefecture.length).toBeGreaterThan(0)
      })
    })

    it('北海道が最初に含まれていること', () => {
      expect(PREFECTURES[0]).toBe('北海道')
    })

    it('沖縄県が最後に含まれていること', () => {
      expect(PREFECTURES[PREFECTURES.length - 1]).toBe('沖縄県')
    })
  })

  describe('Prefecture型', () => {
    it('Prefecture型がPREFECTURES定数の要素と一致すること', () => {
      // TypeScriptの型レベルでのテスト
      // 実際の値でPrefecture型をテスト
      const tokyoAsPrefecture: Prefecture = '東京都'
      const hokkaidoAsPrefecture: Prefecture = '北海道'
      const okinawaAsPrefecture: Prefecture = '沖縄県'
      
      expect(PREFECTURES).toContain(tokyoAsPrefecture)
      expect(PREFECTURES).toContain(hokkaidoAsPrefecture)
      expect(PREFECTURES).toContain(okinawaAsPrefecture)
    })
  })

  describe('NewParticipantFormData型', () => {
    it('有効なNewParticipantFormDataオブジェクトを作成できること', () => {
      const validFormData: NewParticipantFormData = {
        lastNameKanji: '山田',
        firstNameKanji: '太郎',
        lastNameKana: 'やまだ',
        firstNameKana: 'たろう',
        email: 'test@example.com',
        displayName: 'タロー',
        prefecture: '東京都',
        freeText: 'よろしくお願いします',
        password: 'password123',
        confirmPassword: 'password123',
      }

      expect(typeof validFormData.lastNameKanji).toBe('string')
      expect(typeof validFormData.firstNameKanji).toBe('string')
      expect(typeof validFormData.lastNameKana).toBe('string')
      expect(typeof validFormData.firstNameKana).toBe('string')
      expect(typeof validFormData.email).toBe('string')
      expect(typeof validFormData.password).toBe('string')
      expect(typeof validFormData.confirmPassword).toBe('string')
    })

    it('オプションフィールドがundefinedでも有効であること', () => {
      const minimalFormData: NewParticipantFormData = {
        lastNameKanji: '山田',
        firstNameKanji: '太郎',
        lastNameKana: 'やまだ',
        firstNameKana: 'たろう',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }

      expect(minimalFormData.displayName).toBeUndefined()
      expect(minimalFormData.prefecture).toBeUndefined()
      expect(minimalFormData.freeText).toBeUndefined()
    })

    it('必須フィールドがすべて含まれていること', () => {
      const requiredFields = [
        'lastNameKanji',
        'firstNameKanji', 
        'lastNameKana',
        'firstNameKana',
        'email',
        'password',
        'confirmPassword'
      ]

      const formData: NewParticipantFormData = {
        lastNameKanji: '山田',
        firstNameKanji: '太郎',
        lastNameKana: 'やまだ',
        firstNameKana: 'たろう',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }

      requiredFields.forEach(field => {
        expect(formData).toHaveProperty(field)
        expect(typeof formData[field as keyof NewParticipantFormData]).toBe('string')
      })
    })
  })

  describe('FormErrors型', () => {
    it('有効なFormErrorsオブジェクトを作成できること', () => {
      const errors: FormErrors = {
        email: '有効なメールアドレスを入力してください',
        password: 'パスワードは10文字以上で入力してください',
        lastNameKanji: '名字（漢字）は必須です'
      }

      Object.values(errors).forEach(error => {
        expect(typeof error).toBe('string')
      })
    })

    it('空のエラーオブジェクトが作成できること', () => {
      const noErrors: FormErrors = {}
      expect(Object.keys(noErrors)).toHaveLength(0)
    })

    it('動的なキーでエラーを設定できること', () => {
      const errors: FormErrors = {}
      errors['dynamicField'] = 'エラーメッセージ'
      
      expect(errors.dynamicField).toBe('エラーメッセージ')
      expect(typeof errors.dynamicField).toBe('string')
    })
  })

  describe('FormState型', () => {
    it('有効なFormStateオブジェクトを作成できること', () => {
      const formState: FormState = {
        data: {
          lastNameKanji: '山田',
          firstNameKanji: '太郎',
          lastNameKana: 'やまだ',
          firstNameKana: 'たろう',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        },
        errors: {},
        isSubmitting: false,
      }

      expect(typeof formState.data).toBe('object')
      expect(typeof formState.errors).toBe('object')
      expect(typeof formState.isSubmitting).toBe('boolean')
      expect(formState.submitMessage).toBeUndefined()
    })

    it('submitMessageを含むFormStateオブジェクトを作成できること', () => {
      const formStateWithMessage: FormState = {
        data: {
          lastNameKanji: '山田',
          firstNameKanji: '太郎',
          lastNameKana: 'やまだ',
          firstNameKana: 'たろう',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        },
        errors: {},
        isSubmitting: true,
        submitMessage: '送信中...'
      }

      expect(typeof formStateWithMessage.submitMessage).toBe('string')
      expect(formStateWithMessage.submitMessage).toBe('送信中...')
      expect(formStateWithMessage.isSubmitting).toBe(true)
    })

    it('エラー状態のFormStateオブジェクトを作成できること', () => {
      const errorFormState: FormState = {
        data: {
          lastNameKanji: '',
          firstNameKanji: '',
          lastNameKana: '',
          firstNameKana: '',
          email: 'invalid-email',
          password: 'short',
          confirmPassword: 'different',
        },
        errors: {
          lastNameKanji: '名字（漢字）は必須です',
          firstNameKanji: '名前（漢字）は必須です',
          email: '有効なメールアドレスを入力してください',
          password: 'パスワードは10文字以上で入力してください'
        },
        isSubmitting: false,
        submitMessage: 'エラーがあります'
      }

      expect(Object.keys(errorFormState.errors)).toHaveLength(4)
      expect(errorFormState.isSubmitting).toBe(false)
      expect(errorFormState.submitMessage).toBe('エラーがあります')
    })
  })

  describe('型の統合性テスト', () => {
    it('FormStateがNewParticipantFormDataとFormErrorsを正しく使用できること', () => {
      const formData: NewParticipantFormData = {
        lastNameKanji: '田中',
        firstNameKanji: '花子',
        lastNameKana: 'たなか',
        firstNameKana: 'はなこ',
        email: 'hanako@example.com',
        displayName: 'ハナコ',
        prefecture: '大阪府',
        freeText: 'テストメッセージ',
        password: 'securepassword',
        confirmPassword: 'securepassword',
      }

      const errors: FormErrors = {}

      const state: FormState = {
        data: formData,
        errors: errors,
        isSubmitting: false
      }

      expect(state.data).toEqual(formData)
      expect(state.errors).toEqual(errors)
      expect(state.isSubmitting).toBe(false)
    })

    it('Prefecture型がPREFECTURES定数と一致していること', () => {
      // 各都道府県がPrefecture型として有効であることを確認
      PREFECTURES.forEach(prefecture => {
        const typedPrefecture: Prefecture = prefecture
        expect(typeof typedPrefecture).toBe('string')
        expect(PREFECTURES).toContain(typedPrefecture)
      })
    })
  })
})
