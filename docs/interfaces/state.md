[Home](../index.md) &gt; [State](./state.md)

# Interface State

The eval state of current expression of interpreter-ts

<b>Signature:</b>

```typescript
interface State 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [constants](./state.md#constants-property) | `BigNumber[]` | The expression's constants that is being evaluated |
|  [sources](./state.md#sources-property) | `Uint8Array[]` | The expression's sources that is being evaluated |
|  [stack](./state.md#stack-property) | `BigNumber[]` | The interpreter-ts's stack. |

## Property Details

<a id="constants-property"></a>

### constants

The expression's constants that is being evaluated

<b>Signature:</b>

```typescript
readonly constants: BigNumber[];
```

<a id="sources-property"></a>

### sources

The expression's sources that is being evaluated

<b>Signature:</b>

```typescript
readonly sources: Uint8Array[];
```

<a id="stack-property"></a>

### stack

The interpreter-ts's stack.

<b>Signature:</b>

```typescript
readonly stack: BigNumber[];
```
