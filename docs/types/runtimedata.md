[Home](../index.md) &gt; [RuntimeData](./runtimedata.md)

# Type RuntimeData

Additional data available for opcodes' closures during eval, some names are reserved as they are necessary for any eval such as context and namespace

<b>Signature:</b>

```typescript
type RuntimeData = {
    [key: string]: any;
    context: BigNumber[][];
    namespace?: string;
};
```
