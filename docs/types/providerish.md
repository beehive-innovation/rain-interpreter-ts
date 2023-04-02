[Home](../index.md) &gt; [Providerish](./providerish.md)

# Type Providerish

Type needed to construct a provider, which is either: - chain id of the network to construct the Provider from default or .evn URLs - https(s) or websocket (ws, wss) URL of the RPC to construct the Provider from - any valid ethersjs Provider

<b>Signature:</b>

```typescript
type Providerish = BigNumberish | string | Provider;
```
