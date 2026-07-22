import { ResponseError } from '@/api/generated';

/**
 * API 呼び出しのエラーからユーザー向けメッセージを抽出する。
 * バックエンドの ErrorResponse（message フィールド）を優先して利用する。
 */
export async function resolveApiErrorMessage(error: unknown): Promise<string> {
  if (error instanceof ResponseError) {
    try {
      const body = (await error.response.clone().json()) as { message?: string };
      if (body?.message) {
        return body.message;
      }
    } catch {
      // JSON 以外のレスポンスは無視してフォールバックする。
    }
    return `通信エラーが発生しました（HTTP ${error.response.status}）`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '予期しないエラーが発生しました';
}
