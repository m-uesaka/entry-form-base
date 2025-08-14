import { describe, it, expect } from 'bun:test'

describe('ログインページ', () => {
  describe('基本構造', () => {
    it('ログインページファイルが存在すること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      expect(() => fs.readFileSync(loginPagePath, 'utf-8')).not.toThrow()
    })

    it('use clientディレクティブが含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('"use client"')
    })

    it('LoginFormData型がインポートされていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('LoginFormData')
    })
  })

  describe('フォーム要素', () => {
    it('メールアドレス入力フィールドが含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('email')
      expect(content).toContain('type="email"')
    })

    it('パスワード入力フィールドが含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('password')
      expect(content).toContain('type="password"')
    })

    it('ログインボタンが含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('ログイン')
      expect(content).toContain('type="submit"')
    })
  })

  describe('バリデーション', () => {
    it('validateEmail関数がインポートされていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('validateEmail')
    })

    it('バリデーション処理が含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('validateForm')
    })
  })

  describe('API統合', () => {
    it('ログインAPI呼び出し処理が含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('/login')
      expect(content).toContain('POST')
      expect(content).toContain('fetch')
    })

    it('ローカルストレージ保存処理が含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('localStorage.setItem')
      expect(content).toContain('participant')
    })
  })

  describe('ナビゲーション', () => {
    it('useRouterがインポートされていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('useRouter')
      expect(content).toContain('next/navigation')
    })

    it('マイページへのリダイレクト処理が含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const loginPagePath = path.join(__dirname, '../../src/app/login/page.tsx')
      const content = fs.readFileSync(loginPagePath, 'utf-8')

      expect(content).toContain('/mypage')
      expect(content).toContain('router.push')
    })
  })
})

describe('マイページ', () => {
  describe('基本構造', () => {
    it('マイページファイルが存在すること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      expect(() => fs.readFileSync(myPagePath, 'utf-8')).not.toThrow()
    })

    it('use clientディレクティブが含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('"use client"')
    })
  })

  describe('型定義', () => {
    it('必要な型がインポートされていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('Participant')
      expect(content).toContain('MyPageFormState')
      expect(content).toContain('PREFECTURES')
    })
  })

  describe('useActionState統合', () => {
    it('useActionStateがインポートされていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('useActionState')
    })

    it('updateParticipantActionがインポートされていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('updateParticipantAction')
      expect(content).toContain('@/actions/updateParticipant')
    })

    it('initialFormStateが定義されていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('initialFormState')
      expect(content).toContain('MyPageFormState')
    })

    it('formActionとisPendingが使用されていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('formAction')
      expect(content).toContain('isPending')
    })
  })

  describe('認証機能', () => {
    it('ログイン状態確認処理が含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('localStorage.getItem')
      expect(content).toContain('participant')
    })

    it('ログアウト処理が含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('handleLogout')
      expect(content).toContain('localStorage.removeItem')
    })
  })

  describe('フォーム要素', () => {
    it('必須フィールドが含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('lastNameKanji')
      expect(content).toContain('firstNameKanji')
      expect(content).toContain('lastNameKana')
      expect(content).toContain('firstNameKana')
      expect(content).toContain('email')
    })

    it('キャンセルチェックボックスが含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('isCancelled')
      expect(content).toContain('type="checkbox"')
      expect(content).toContain('キャンセルしますか')
    })

    it('都道府県選択とその他入力が含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('prefecture')
      expect(content).toContain('prefectureOther')
      expect(content).toContain('その他')
    })

    it('隠しフィールドでparticipantIdが送信されること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('name="participantId"')
      expect(content).toContain('type="hidden"')
    })
  })

  describe('フォーム送信', () => {
    it('form actionが正しく設定されていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('action={formAction}')
    })

    it('defaultValueが使用されていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('defaultValue={participant.')
      expect(content).toContain('defaultChecked={participant.')
    })
  })

  describe('UI要素', () => {
    it('参加者IDが表示されること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('参加者ID')
      expect(content).toContain('participant.id')
    })

    it('更新ボタンが含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('参加者情報を更新')
      expect(content).toContain('type="submit"')
    })

    it('isPendingが使用されていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('disabled={isPending}')
      expect(content).toContain('更新中...')
    })

    it('state.errorsとstate.submitMessageが使用されていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('state.errors')
      expect(content).toContain('state.submitMessage')
    })
  })

  describe('エラーハンドリング', () => {
    it('バリデーションエラー表示が含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('text-red-600')
      expect(content).toContain('border-red-300')
    })

    it('成功・エラーメッセージ表示が含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('bg-green-50')
      expect(content).toContain('bg-red-50')
      expect(content).toContain('text-green-700')
      expect(content).toContain('text-red-700')
    })
  })

  describe('localStorage統合', () => {
    it('更新成功時のlocalStorage更新処理が含まれていること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      expect(content).toContain('localStorage.setItem')
      expect(content).toContain('state.participant')
    })

    it('useEffectでlocalStorage更新が実行されること', () => {
      const fs = require('fs')
      const path = require('path')
      const myPagePath = path.join(__dirname, '../../src/app/mypage/page.tsx')
      const content = fs.readFileSync(myPagePath, 'utf-8')

      const useEffectMatch = content.match(/useEffect\([^}]+localStorage\.setItem[^}]+\}/)
      expect(useEffectMatch).toBeTruthy()
    })
  })
})
