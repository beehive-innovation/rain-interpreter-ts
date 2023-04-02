[Home](../index.md) &gt; [ReservedData](./reserveddata.md)

# Type ReservedData

Reserved properties and values available to opcodes' closures at runtime, these will stay intact during eval with some exceptions which are 'storage' and 'mock' that can reassigned and/or modified during eval

<b>Signature:</b>

```typescript
type ReservedData = {
    provider: Provider;
    voidSigner: VoidSigner;
    stateConfig: StateConfig;
    stack: BigNumber[];
    interpreterAddress: string;
    sender: string;
    namespaceType: NamespaceType;
    block: {
        number: number;
        timestamp: number;
    };
    opConfigs: opConfig[];
    overrides: OverrideFns;
    storage: kvStorage;
    mode?: SimulationMode;
    mock?: Mock;
    simulationCount?: number;
};
```
