[Home](../index.md) &gt; [opClosure](./opclosure.md)

# Type opClosure

Type of an interpreter-ts opcode function (closure)

<b>Signature:</b>

```typescript
type opClosure = {
    (
    _inputs: BigNumber[], 
    _operand: number, 
    _data: InterpreterData): BigNumber[] | Promise<BigNumber[]>;
};
```
