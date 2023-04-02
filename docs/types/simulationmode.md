[Home](../index.md) &gt; [SimulationMode](./simulationmode.md)

# Type SimulationMode

Defines where and how data is used for a simulation - always: read the data from on-chain all the times, any mock data will be ignored entirely - once: only read the data from on-chain the first time simulation runs, optionally store that in mock data and reaed from mock data for next simulation runs - never: read from mock data all the times, and never try to read data from on-chain, if mock data is not available simulation will throw error

<b>Signature:</b>

```typescript
type SimulationMode = 'always' | 'once' | 'never';
```
