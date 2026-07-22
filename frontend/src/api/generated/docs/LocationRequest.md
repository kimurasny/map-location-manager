
# LocationRequest

地点の登録・更新リクエスト

## Properties

Name | Type
------------ | -------------
`title` | string
`description` | string
`latitude` | number
`longitude` | number

## Example

```typescript
import type { LocationRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "title": 東京駅,
  "description": JR東日本・東京メトロの主要駅,
  "latitude": 35.681236,
  "longitude": 139.767125,
} satisfies LocationRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LocationRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


