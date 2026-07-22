import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { locationsApi } from '@/api/client';
import type { Location, LocationRequest } from '@/types/location';

/**
 * React Query のクエリキー定義。
 * サーバー状態は React Query が唯一の情報源として管理し、useState では保持しない。
 */
export const locationKeys = {
  all: ['locations'] as const,
  detail: (id: string) => ['locations', id] as const,
};

/** 地点一覧を取得する。 */
export function useLocations(): UseQueryResult<Location[]> {
  return useQuery({
    queryKey: locationKeys.all,
    queryFn: () => locationsApi.listLocations(),
  });
}

/** 地点を新規登録する。成功時に一覧キャッシュを無効化する。 */
export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: LocationRequest) =>
      locationsApi.createLocation({ locationRequest: request }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
}

/** 地点を更新する。成功時に一覧・詳細キャッシュを無効化する。 */
export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: LocationRequest }) =>
      locationsApi.updateLocation({ id, locationRequest: request }),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: locationKeys.all });
      void queryClient.invalidateQueries({
        queryKey: locationKeys.detail(updated.id),
      });
    },
  });
}

/** 地点を削除する。成功時に一覧キャッシュを無効化する。 */
export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => locationsApi.deleteLocation({ id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: locationKeys.all });
    },
  });
}
