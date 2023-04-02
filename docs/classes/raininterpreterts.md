[Home](../index.md) &gt; [RainInterpreterTs](./raininterpreterts.md)

# Class RainInterpreterTs

- The typescript (javascript) version of the RainInterpreter.sol, which basically does the same job offchain, i.e evaluates an expression off-chain with either reading necessary data with onchain calls or by some provided mock data. There are many usecases, simulating and forecasting are just a few to mention.

<b>Signature:</b>

```typescript
class RainInterpreterTs 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [expressions](./raininterpreterts.md#expressions-property) | `StateConfig[]` | The expressions of this iterpreter |
|  [interpreterAddress](./raininterpreterts.md#interpreterAddress-property) | `string` | The interpreter's address |
|  [lastStack](./raininterpreterts.md#lastStack-property) | `BigNumber[]` | The latest result (final stack) of an evaluated expression. |
|  [opConfigs](./raininterpreterts.md#opConfigs-property) | `opConfig[]` | Array of opcodes' enums and their ts functions, inputs and outputs which defines the closure for each of them |
|  [overrideFns](./raininterpreterts.md#overrideFns-property) | [OverrideFns](../types/overridefns.md) | Functions to override the existing opcodes ts functions (closures) |
|  [provider](./raininterpreterts.md#provider-property) | `Provider` | An ethersjs provider used to read onchain data |
|  [state](./raininterpreterts.md#state-property) | [State](../interfaces/state.md) | The state which which is used to eval an expression. |
|  [storage](./raininterpreterts.md#storage-property) | [kvStorage](../types/kvstorage.md) | An object to store key/value pairs of an interpreter which is mapped by each msg.sender and namespace |
|  [voidSigner](./raininterpreterts.md#voidSigner-property) | `VoidSigner` | An etherjs VoidSigner used to read onchain data |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [addStorage(storage, sender, namespace, kv)](./raininterpreterts.md#addStorage-method-static-1) | Method to add key/value item to a kvStorage object |
|  [getStorage(storage, sender, namespace)](./raininterpreterts.md#getStorage-method-static-1) | Methdo to get the k/v items of a sender and namespace, undefined if doesn't exist |

## Methods

|  Method | Description |
|  --- | --- |
|  [addExpression(stateConfig)](./raininterpreterts.md#addExpression-method-1) | Method to add StateConfig to an instance of interpreter-ts |
|  [run(sender, data, config)](./raininterpreterts.md#run-method-1) | Method to run eval for an expression of an instance of interpreter-ts. If no expression or index provided it will evaluate the last available expression in the instance's expressions array |

## Property Details

<a id="expressions-property"></a>

### expressions

The expressions of this iterpreter

<b>Signature:</b>

```typescript
readonly expressions: StateConfig[];
```

<a id="interpreterAddress-property"></a>

### interpreterAddress

The interpreter's address

<b>Signature:</b>

```typescript
readonly interpreterAddress: string;
```

<a id="lastStack-property"></a>

### lastStack

The latest result (final stack) of an evaluated expression.

<b>Signature:</b>

```typescript
readonly lastStack: BigNumber[];
```

<a id="opConfigs-property"></a>

### opConfigs

Array of opcodes' enums and their ts functions, inputs and outputs which defines the closure for each of them

<b>Signature:</b>

```typescript
readonly opConfigs: opConfig[];
```

<a id="overrideFns-property"></a>

### overrideFns

Functions to override the existing opcodes ts functions (closures)

<b>Signature:</b>

```typescript
readonly overrideFns?: OverrideFns;
```

<a id="provider-property"></a>

### provider

An ethersjs provider used to read onchain data

<b>Signature:</b>

```typescript
readonly provider: Provider;
```

<a id="state-property"></a>

### state

The state which which is used to eval an expression.

<b>Signature:</b>

```typescript
readonly state: State;
```

<a id="storage-property"></a>

### storage

An object to store key/value pairs of an interpreter which is mapped by each msg.sender and namespace

<b>Signature:</b>

```typescript
readonly storage: kvStorage;
```

<a id="voidSigner-property"></a>

### voidSigner

An etherjs VoidSigner used to read onchain data

<b>Signature:</b>

```typescript
readonly voidSigner: VoidSigner;
```

## Static Method Details

<a id="addStorage-method-static-1"></a>

### addStorage(storage, sender, namespace, kv)

Method to add key/value item to a kvStorage object

<b>Signature:</b>

```typescript
static addStorage(storage: kvStorage, sender: string, namespace: string, kv: {
        key: BigNumber;
        value: BigNumber;
    }): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  storage | [kvStorage](../types/kvstorage.md) | The storage obj to add the kv to under sender and namespace |
|  sender | `string` | The msg.sender address, address that calls the eval method of interpreter |
|  namespace | `string` | Namespace of the k/v storage, public namespaces are 0, and for private ones it is the address of owner of k/v storage |
|  kv | <pre>{&#010;    key: BigNumber;&#010;    value: BigNumber;&#010;}</pre> | The key/value pair |

<b>Returns:</b>

`void`

<a id="getStorage-method-static-1"></a>

### getStorage(storage, sender, namespace)

Methdo to get the k/v items of a sender and namespace, undefined if doesn't exist

<b>Signature:</b>

```typescript
static getStorage(storage: kvStorage, sender: string, namespace: string): {
        key: BigNumber;
        value: BigNumber;
    }[] | undefined;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  storage | [kvStorage](../types/kvstorage.md) | The storage obj to add the kv to under sender and namespace |
|  sender | `string` | The msg.sender address, address that calls the eval method of interpreter |
|  namespace | `string` | Namespace of the k/v storage, public namespaces are 0, and for private ones it is the address of owner of k/v storage |

<b>Returns:</b>

`{
        key: BigNumber;
        value: BigNumber;
    }[] | undefined`

Array of key/value pairs, undefined if not found

## Method Details

<a id="addExpression-method-1"></a>

### addExpression(stateConfig)

Method to add StateConfig to an instance of interpreter-ts

<b>Signature:</b>

```typescript
addExpression(stateConfig: StateConfig): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  stateConfig | [StateConfig](../types/stateconfig.md) | StateConfig to add |

<b>Returns:</b>

`void`

<a id="run-method-1"></a>

### run(sender, data, config)

Method to run eval for an expression of an instance of interpreter-ts. If no expression or index provided it will evaluate the last available expression in the instance's expressions array

<b>Signature:</b>

```typescript
run(sender: string, data: RuntimeData, config?: RunConfig): Promise<EvalResult>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  sender | `string` | The msg.sender, the address that calls the eval method of interpreter-ts |
|  data | [RuntimeData](../types/runtimedata.md) | Used as any additional data that opcode functions may need |
|  config | [RunConfig](../types/runconfig.md) | (optional) config for interpreter-ts eval |

<b>Returns:</b>

`Promise<EvalResult>`

- An object with array of BigNumbers as final stack items and block number and timestamp.

