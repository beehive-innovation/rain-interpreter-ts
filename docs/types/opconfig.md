[Home](../index.md) &gt; [opConfig](./opconfig.md)

# Type opConfig

All needed for interpreter-ts to eval an opcode

<b>Signature:</b>

```typescript
type opConfig = {
    enum: number;
    inputs: (_operand: number) => number;
    outputs: (_operand: number) => number;
    functionPointer: opClosure;
};
```
