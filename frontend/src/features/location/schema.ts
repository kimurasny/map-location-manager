import { z } from 'zod';

/**
 * 地点フォームのバリデーションスキーマ。
 * 制約は OpenAPI 仕様（LocationRequest）およびバックエンドのバリデーションと一致させる。
 */
export const locationFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  description: z
    .string()
    .max(1000, '説明は1000文字以内で入力してください')
    .optional(),
  latitude: z
    .number({ message: '緯度は数値で入力してください' })
    .min(-90, '緯度は-90以上で入力してください')
    .max(90, '緯度は90以下で入力してください'),
  longitude: z
    .number({ message: '経度は数値で入力してください' })
    .min(-180, '経度は-180以上で入力してください')
    .max(180, '経度は180以下で入力してください'),
});

/** フォームの入力値の型。 */
export type LocationFormValues = z.infer<typeof locationFormSchema>;
