[Home](../index.md) &gt; [CustomSimulationArgs](./customsimulationargs.md)

# Type CustomSimulationArgs

Arguments for initiating a default simulation which uses any custom opcodes' closures

<b>Signature:</b>

```typescript
type CustomSimulationArgs = {
    interpreterAddress: string;
    functionPointers: opConfig[];
    stateConfigs?: StateConfig[];
    storages?: kvStorage;
    overrides?: OverrideFns;
};
```
