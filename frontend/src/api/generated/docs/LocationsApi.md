# LocationsApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createLocation**](LocationsApi.md#createlocation) | **POST** /api/locations | 地点の新規登録 |
| [**deleteLocation**](LocationsApi.md#deletelocation) | **DELETE** /api/locations/{id} | 地点の削除 |
| [**getLocation**](LocationsApi.md#getlocation) | **GET** /api/locations/{id} | 地点詳細の取得 |
| [**listLocations**](LocationsApi.md#listlocations) | **GET** /api/locations | 地点一覧の取得 |
| [**updateLocation**](LocationsApi.md#updatelocation) | **PUT** /api/locations/{id} | 地点の更新 |



## createLocation

> Location createLocation(locationRequest)

地点の新規登録

緯度・経度・タイトル・説明を指定して地点を新規登録する。

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '';
import type { CreateLocationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new LocationsApi();

  const body = {
    // LocationRequest
    locationRequest: ...,
  } satisfies CreateLocationRequest;

  try {
    const data = await api.createLocation(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **locationRequest** | [LocationRequest](LocationRequest.md) |  | |

### Return type

[**Location**](Location.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | 登録された地点 |  -  |
| **400** | リクエスト内容が不正（バリデーションエラー） |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteLocation

> deleteLocation(id)

地点の削除

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '';
import type { DeleteLocationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new LocationsApi();

  const body = {
    // string | 地点ID（UUID）
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteLocationRequest;

  try {
    const data = await api.deleteLocation(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | 地点ID（UUID） | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | 削除成功（本文なし） |  -  |
| **404** | 指定された地点が存在しない |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getLocation

> Location getLocation(id)

地点詳細の取得

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '';
import type { GetLocationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new LocationsApi();

  const body = {
    // string | 地点ID（UUID）
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetLocationRequest;

  try {
    const data = await api.getLocation(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | 地点ID（UUID） | [Defaults to `undefined`] |

### Return type

[**Location**](Location.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 地点詳細 |  -  |
| **404** | 指定された地点が存在しない |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listLocations

> Array&lt;Location&gt; listLocations()

地点一覧の取得

登録済みの全地点を作成日時の降順で取得する。

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '';
import type { ListLocationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new LocationsApi();

  try {
    const data = await api.listLocations();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;Location&gt;**](Location.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 地点一覧 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateLocation

> Location updateLocation(id, locationRequest)

地点の更新

### Example

```ts
import {
  Configuration,
  LocationsApi,
} from '';
import type { UpdateLocationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new LocationsApi();

  const body = {
    // string | 地点ID（UUID）
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // LocationRequest
    locationRequest: ...,
  } satisfies UpdateLocationRequest;

  try {
    const data = await api.updateLocation(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` | 地点ID（UUID） | [Defaults to `undefined`] |
| **locationRequest** | [LocationRequest](LocationRequest.md) |  | |

### Return type

[**Location**](Location.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 更新された地点 |  -  |
| **400** | リクエスト内容が不正（バリデーションエラー） |  -  |
| **404** | 指定された地点が存在しない |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

