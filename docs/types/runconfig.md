[Home](../index.md) &gt; [RunConfig](./runconfig.md)

# Type RunConfig

Configurations and options for eval

<b>Signature:</b>

```typescript
type RunConfig = {
    expression?: StateConfig | number;
    namespaceType?: NamespaceType;
    block?: {
        number: number;
        timestamp: number;
    };
    entrypoint?: number;
    overrideFunctions?: OverrideFns;
    simulationArgs?: {
        mode: SimulationMode;
        simulationCount: number;
        mock?: Mock;
    };
};
```
