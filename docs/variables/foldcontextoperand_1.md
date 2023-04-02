[Home](../index.md) &gt; [foldContextOperand](./foldcontextoperand_1.md)

# Function foldContextOperand()

Builds the operand for RainInterpreter's `FOLD_CONTEXT` opcode by packing 4 numbers into 2 bytes.

<b>Signature:</b>

```typescript
function foldContextOperand(sourceIndex: number, foldColumn: number, width: number, inputs: number): number;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  sourceIndex | `number` | index of function source |
|  foldColumn | `number` | column to start from |
|  width | `number` | width of the column |
|  inputs | `number` | accumulator input count |

<b>Returns:</b>

`number`

a 2 bytes size number

