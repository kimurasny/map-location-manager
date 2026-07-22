
# Location

保存済みの地点情報

## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`description` | string
`latitude` | number
`longitude` | number
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { Location } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 3f2504e0-4f89-41d3-9a0c-0305e82c3301,
  "title": 東京駅,
  "description": JR東日本・東京メトロの主要駅,
  "latitude": 35.681236,
  "longitude": 139.767125,
  "createdAt": null,
  "updatedAt": null,
} satisfies Location

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Location
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


