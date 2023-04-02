[Home](../index.md) &gt; [Simulation](./simulation.md)

# Class Simulation

All the things needed in order to conduct a simulation/forecast of Rain Interpreter. this uses RainInterpreterTs under the hood to eval expressions with provided opcode closures and data. Data is either mocked or fetched from on-chain as there are 3 types of simulation defined: always, once, never. These determine how the data will be handled and provided for default simulation which uses Rainterpreter opcodes and their default overrides. For a custom simulation that uses custom interpreter and opcode closures, the opcode closures need to be provided by the user.

<b>Signature:</b>

```typescript
class Simulation 
```

## Properties

|  Property | Type | Description |
|  --- | --- | --- |
|  [interpreterInstances](./simulation.md#interpreterInstances-property) | `RainInterpreterTs[]` |  |
|  [mock](./simulation.md#mock-property) | [Mock](../types/mock.md) |  |
|  [provider](./simulation.md#provider-property) | `Provider` | Ethersjs provider |

## Static Methods

|  Method | Description |
|  --- | --- |
|  [custom(providerish, configs, mock)](./simulation.md#custom-method-static-1) | Instantiates the class object with custom opcodes closures All simulations will be using these custom opcodes and their overrides |
|  [getBalance(mock, accountAddress, assetAddress, id)](./simulation.md#getBalance-method-static-1) | Method to get the balance of a asset for an account, returns zero if such asset or account is not present in the mock data |
|  [getChainlink(mock, chainlinkAddress)](./simulation.md#getChainlink-method-static-1) | Method to get the chainlink price from mock data, returns undefined if the chainlink account is not present |
|  [getDecimals(mock, accountAddress, assetAddress)](./simulation.md#getDecimals-method-static-1) | Method to get the total supply of a asset for an account, returns zero if such asset or account or token is of type erc721 or erc1155 |
|  [getISale(mock, iSaleAddress)](./simulation.md#getISale-method-static-1) | Method to get the iSale details from mock data, returns undefined if not present in mock data |
|  [getIVerifyStatusAtTime(mock, accountAddress, iVerifyAddress, timestamp)](./simulation.md#getIVerifyStatusAtTime-method-static-1) | Method to get the verify status of an account at certain timestamp from mock data, returns 0 if status of provided details is not present |
|  [getOwner(mock, assetAddress, id)](./simulation.md#getOwner-method-static-1) | Method to get the owner of an erc721 token with id |
|  [getReport(mock, accountAddress, iTierAddress)](./simulation.md#getReport-method-static-1) | Method to get the report of an account from mock data, returns NEVER if any of provided account or iTier address are not present in the mock data |
|  [getTotalSupply(mock, assetAddress, id)](./simulation.md#getTotalSupply-method-static-1) | Method to get the total supply of a asset for an account, returns zero if such asset or account or token id (in case of erc1155) is not present in the mock data and return or asset is of type erc721 |
|  [getVaultBalance(mock, accountAddress, iOrderbookAddress, tokenAddress, vaultId)](./simulation.md#getVaultBalance-method-static-1) | Method to get the vault balance of an account from mock data, returns 0 if vault with provided details is not present |
|  [rainterpreter(providerish, configs, mock)](./simulation.md#rainterpreter-method-static-1) | Instantiates the class object with default Rainterpreter opcodes All simulations will be using the Rainterpreter opcodes and its overrides all teh time |
|  [updateChainlink(mock, chainlinkAddress, updatedAt, answer)](./simulation.md#updateChainlink-method-static-1) | Method to update the mock data with an chainlink account that has aswer and updatedat properties If an account with this address is not present in the mock data, it will create it with provided details and if present the answwer and updatedAt properties will be updated to provided values |
|  [updateISale(mock, iSaleAddress, status, reserve, token)](./simulation.md#updateISale-method-static-1) | Method to update the mock data with provided iSale details for an account, If an account with this address is not present in the mock data, it will create it with provided details and if present the report property will be updated to provided values |
|  [updateIVerify(mock, accountAddress, iVerifyAddress, status, timestamp)](./simulation.md#updateIVerify-method-static-1) | Method to update the mock data with iVerify status for an account at a timestamp, If an account with this address is not present in the mock data, it will create it with provided details and if present the report property will be updated to provided values |
|  [updateMockAsset(mock, account, asset)](./simulation.md#updateMockAsset-method-static-1) | Method to update asset of an account in mock data, if the account is already present in the mock data, as well as the asset for that account, it will overwrite it with provided asset, so in order to for example update the balance of such account for that asset, caller must use the getBalance() and calculate the final amount seperately |
|  [updateReport(mock, accountAddress, iTierAddress, report)](./simulation.md#updateReport-method-static-1) | Method to update the mock data with report for an account, If an account with this address is not present in the mock data, it will create it with provided details and if present the report property will be updated to provided values |
|  [updateVault(mock, accountAddress, iOrderbookAddress, tokenAddress, vaultId, balance)](./simulation.md#updateVault-method-static-1) | Method to update the mock data with provided iOrderbook details for an account, If an account with this address is not present in the mock data, it will create it with provided details and if present the report property will be updated to provided values |

## Methods

|  Method | Description |
|  --- | --- |
|  [addAccounts(accounts)](./simulation.md#addAccounts-method-1) | Add an account to mock data, throws an error if no mock data is not present |
|  [findInterpreter(interpreterAddress)](./simulation.md#findInterpreter-method-1) | Method to get the RainInterpreterTs object in this Simulation instance |
|  [findInterpreterIndex(interpreterAddress)](./simulation.md#findInterpreterIndex-method-1) | Method to get the RainInterpreterTs index in this Simulation instance |
|  [initMock()](./simulation.md#initMock-method-1) | Initiates an empty mock data object if no mock obj is present with getting current block number and timestamp from on-chain, if mock data object is present, updates its blockNumber and blockTimstamp properties with current on-chain data |
|  [run(mode, numberOfRuns, simulationCases, callback)](./simulation.md#run-method-1) | Method to execute a simulation with desired configurations. Simulation can repeat x number of times and at each step one or more than one expression with provided configs can be evaled. The evaluated results are then available in a callback function for user to do any desired action with them and return any desired object or value at each repeat. If any of the evaluation thorws error it doesn't stop the simulation, but rather the result of that error with its msg are present in the callback function as well, so user can handle them in any way desired. There are 3 modes of data reads a simulation can have which is also available in data object for opcodes' closures to do whatever they wish based on them (default behaviour of rainterpreter simulation, but can differ for custom simulation): - always: read the data from on-chain all the times, any mock data will be ignored entirely - once: only read the data from on-chain the first time simulation runs, optionally store that in mock data and reaed from mock data for next simulation runs - never: read from mock data all the times, and never try to read data from on-chain, if mock data is not available simulation will throw error |
|  [setAccounts(accounts)](./simulation.md#setAccounts-method-1) | Set accounts for mock data, throws an error if no mock data is not present |
|  [setBlockNumber(number)](./simulation.md#setBlockNumber-method-1) | Set block number for mock data, throws an error if no mock data is not present |
|  [setBlockTimestamp(timestamp)](./simulation.md#setBlockTimestamp-method-1) | Set block timestamp for mock data, throws an error if no mock data is not present |
|  [setMock(mock)](./simulation.md#setMock-method-1) | Set mock data |

## Property Details

<a id="interpreterInstances-property"></a>

### interpreterInstances


<b>Signature:</b>

```typescript
readonly interpreterInstances: RainInterpreterTs[];
```

<a id="mock-property"></a>

### mock


<b>Signature:</b>

```typescript
mock?: Mock;
```

<a id="provider-property"></a>

### provider

Ethersjs provider

<b>Signature:</b>

```typescript
readonly provider: Provider;
```

## Static Method Details

<a id="custom-method-static-1"></a>

### custom(providerish, configs, mock)

Instantiates the class object with custom opcodes closures All simulations will be using these custom opcodes and their overrides

<b>Signature:</b>

```typescript
static custom(providerish: Providerish, configs: CustomSimulationArgs[], mock?: Mock): Simulation;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  providerish | [Providerish](../types/providerish.md) | The rpc url, chainId or a valid ethersjs provider |
|  configs | `CustomSimulationArgs[]` | Arguments needed to instantiate the RainInterpreterTs objects with custom opcode closures |
|  mock | [Mock](../types/mock.md) | Mock data |

<b>Returns:</b>

`Simulation`

<a id="getBalance-method-static-1"></a>

### getBalance(mock, accountAddress, assetAddress, id)

Method to get the balance of a asset for an account, returns zero if such asset or account is not present in the mock data

<b>Signature:</b>

```typescript
static getBalance(mock: Mock, accountAddress: string | BigNumber, assetAddress: string | BigNumber, id?: string | BigNumber): BigNumber;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data object |
|  accountAddress | `string \| BigNumber` | The account address |
|  assetAddress | `string \| BigNumber` | The asset address |
|  id | `string \| BigNumber` | id of the token for erc721 and erc1155 tokens or snapshot id of erc20 token (passing id for erc20 token will get the snapshot balance) |

<b>Returns:</b>

`BigNumber`

The balance of the account of the asset, 0 if either account or asset or id (in case of erc721 and erc1155) was not present

<a id="getChainlink-method-static-1"></a>

### getChainlink(mock, chainlinkAddress)

Method to get the chainlink price from mock data, returns undefined if the chainlink account is not present

<b>Signature:</b>

```typescript
static getChainlink(mock: Mock, chainlinkAddress: string | BigNumber): {
        updatedAt: number;
        answer: BigNumber;
    } | undefined;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data to search |
|  chainlinkAddress | `string \| BigNumber` | The address of chainlink contract |

<b>Returns:</b>

`{
        updatedAt: number;
        answer: BigNumber;
    } | undefined`

- object with asnwer and updatedAt properties and undefined if the address not present in mock data

<a id="getDecimals-method-static-1"></a>

### getDecimals(mock, accountAddress, assetAddress)

Method to get the total supply of a asset for an account, returns zero if such asset or account or token is of type erc721 or erc1155

<b>Signature:</b>

```typescript
static getDecimals(mock: Mock, accountAddress: string | BigNumber, assetAddress: string | BigNumber): number;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data object |
|  accountAddress | `string \| BigNumber` | The account address |
|  assetAddress | `string \| BigNumber` | The asset address |

<b>Returns:</b>

`number`

The balance of the account of the asset, 0 if either account or asset was not present

<a id="getISale-method-static-1"></a>

### getISale(mock, iSaleAddress)

Method to get the iSale details from mock data, returns undefined if not present in mock data

<b>Signature:</b>

```typescript
static getISale(mock: Mock, iSaleAddress: string | BigNumber): {
        status: number;
        reserve: MockERC20;
        token: MockERC20;
    } | undefined;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data to search |
|  iSaleAddress | `string \| BigNumber` | The address of the iSale contract |

<b>Returns:</b>

`{
        status: number;
        reserve: MockERC20;
        token: MockERC20;
    } | undefined`

- iSale status, reseve and rTKN details and balances, and undefined if iSale is not present in mock data

<a id="getIVerifyStatusAtTime-method-static-1"></a>

### getIVerifyStatusAtTime(mock, accountAddress, iVerifyAddress, timestamp)

Method to get the verify status of an account at certain timestamp from mock data, returns 0 if status of provided details is not present

<b>Signature:</b>

```typescript
static getIVerifyStatusAtTime(mock: Mock, accountAddress: string | BigNumber, iVerifyAddress: string | BigNumber, timestamp: number): number;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data |
|  accountAddress | `string \| BigNumber` | The address of the account to get its status |
|  iVerifyAddress | `string \| BigNumber` | Address of the iVerify contract |
|  timestamp | `number` | The timestamp |

<b>Returns:</b>

`number`

the status of the iVerify contract for the account, if not found returns 0 i.e. 'nil' status

<a id="getOwner-method-static-1"></a>

### getOwner(mock, assetAddress, id)

Method to get the owner of an erc721 token with id

<b>Signature:</b>

```typescript
static getOwner(mock: Mock, assetAddress: string | BigNumber, id: BigNumber): BigNumber | undefined;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data |
|  assetAddress | `string \| BigNumber` | ERC721 token address |
|  id | `BigNumber` | The id of the token |

<b>Returns:</b>

`BigNumber | undefined`

The owner of the address

<a id="getReport-method-static-1"></a>

### getReport(mock, accountAddress, iTierAddress)

Method to get the report of an account from mock data, returns NEVER if any of provided account or iTier address are not present in the mock data

<b>Signature:</b>

```typescript
static getReport(mock: Mock, accountAddress: string | BigNumber, iTierAddress: string | BigNumber): BigNumber;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data to search |
|  accountAddress | `string \| BigNumber` | The address of the account to get report for |
|  iTierAddress | `string \| BigNumber` | The address of the iTier contract |

<b>Returns:</b>

`BigNumber`

- The report of the account, return NEVER report if any of provided details are not present in mock data

<a id="getTotalSupply-method-static-1"></a>

### getTotalSupply(mock, assetAddress, id)

Method to get the total supply of a asset for an account, returns zero if such asset or account or token id (in case of erc1155) is not present in the mock data and return or asset is of type erc721

<b>Signature:</b>

```typescript
static getTotalSupply(mock: Mock, assetAddress: string | BigNumber, id?: string | BigNumber): BigNumber;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data object |
|  assetAddress | `string \| BigNumber` | The asset address |
|  id | `string \| BigNumber` | The id of the token for erc1155 tokens |

<b>Returns:</b>

`BigNumber`

The balance of the account of the asset, 0 if either account or asset was not present

<a id="getVaultBalance-method-static-1"></a>

### getVaultBalance(mock, accountAddress, iOrderbookAddress, tokenAddress, vaultId)

Method to get the vault balance of an account from mock data, returns 0 if vault with provided details is not present

<b>Signature:</b>

```typescript
static getVaultBalance(mock: Mock, accountAddress: string | BigNumber, iOrderbookAddress: string | BigNumber, tokenAddress: string | BigNumber, vaultId: string | BigNumber): BigNumber;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data to search |
|  accountAddress | `string \| BigNumber` | The address of the account to get its vault balance |
|  iOrderbookAddress | `string \| BigNumber` | The address of the iOrderbook contract |
|  tokenAddress | `string \| BigNumber` | The token address |
|  vaultId | `string \| BigNumber` | The vault id |

<b>Returns:</b>

`BigNumber`

- The vault balance

<a id="rainterpreter-method-static-1"></a>

### rainterpreter(providerish, configs, mock)

Instantiates the class object with default Rainterpreter opcodes All simulations will be using the Rainterpreter opcodes and its overrides all teh time

<b>Signature:</b>

```typescript
static rainterpreter(providerish: Providerish, configs: RainterpreterSimulationArgs[], mock?: Mock): Simulation;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  providerish | [Providerish](../types/providerish.md) | The rpc url, chainId or a valid ethersjs provider |
|  configs | `RainterpreterSimulationArgs[]` | Arguments needed to instantiate the RainInterpreterTs objects |
|  mock | [Mock](../types/mock.md) | Mock data |

<b>Returns:</b>

`Simulation`

<a id="updateChainlink-method-static-1"></a>

### updateChainlink(mock, chainlinkAddress, updatedAt, answer)

Method to update the mock data with an chainlink account that has aswer and updatedat properties If an account with this address is not present in the mock data, it will create it with provided details and if present the answwer and updatedAt properties will be updated to provided values

<b>Signature:</b>

```typescript
static updateChainlink(mock: Mock, chainlinkAddress: string | BigNumber, updatedAt: number, answer: BigNumber): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data to search |
|  chainlinkAddress | `string \| BigNumber` | The address of chainlink contract |
|  updatedAt | `number` | The answer property was updated at this many timestamps ago |
|  answer | `BigNumber` | Price of the chainlink oracle |

<b>Returns:</b>

`void`

<a id="updateISale-method-static-1"></a>

### updateISale(mock, iSaleAddress, status, reserve, token)

Method to update the mock data with provided iSale details for an account, If an account with this address is not present in the mock data, it will create it with provided details and if present the report property will be updated to provided values

<b>Signature:</b>

```typescript
static updateISale(mock: Mock, iSaleAddress: string | BigNumber, status: iSaleStatus, reserve: MockERC20, token: MockERC20): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data |
|  iSaleAddress | `string \| BigNumber` | Address of the iSale |
|  status | [iSaleStatus](../enums/isalestatus.md) | The iSale status |
|  reserve | [MockERC20](../types/mockerc20.md) | The reserve token |
|  token | [MockERC20](../types/mockerc20.md) | The rTKN |

<b>Returns:</b>

`void`

<a id="updateIVerify-method-static-1"></a>

### updateIVerify(mock, accountAddress, iVerifyAddress, status, timestamp)

Method to update the mock data with iVerify status for an account at a timestamp, If an account with this address is not present in the mock data, it will create it with provided details and if present the report property will be updated to provided values

<b>Signature:</b>

```typescript
static updateIVerify(mock: Mock, accountAddress: string | BigNumber, iVerifyAddress: string | BigNumber, status: iVerifyStatus, timestamp: number): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data |
|  accountAddress | `string \| BigNumber` | Address of the account to update its iVerify state |
|  iVerifyAddress | `string \| BigNumber` | The iVerify address |
|  status | [iVerifyStatus](../enums/iverifystatus.md) | The iVerify status of the account |
|  timestamp | `number` | The timestamp that status update is taking place at |

<b>Returns:</b>

`void`

<a id="updateMockAsset-method-static-1"></a>

### updateMockAsset(mock, account, asset)

Method to update asset of an account in mock data, if the account is already present in the mock data, as well as the asset for that account, it will overwrite it with provided asset, so in order to for example update the balance of such account for that asset, caller must use the getBalance() and calculate the final amount seperately

<b>Signature:</b>

```typescript
static updateMockAsset(mock: Mock, account: string | BigNumber, asset: MockERC20 | MockERC721 | MockERC1155): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data object |
|  account | `string \| BigNumber` | The account to update its assets |
|  asset | `MockERC20 \| MockERC721 \| MockERC1155` | The asset |

<b>Returns:</b>

`void`

<a id="updateReport-method-static-1"></a>

### updateReport(mock, accountAddress, iTierAddress, report)

Method to update the mock data with report for an account, If an account with this address is not present in the mock data, it will create it with provided details and if present the report property will be updated to provided values

<b>Signature:</b>

```typescript
static updateReport(mock: Mock, accountAddress: string | BigNumber, iTierAddress: string | BigNumber, report: BigNumber): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data |
|  accountAddress | `string \| BigNumber` | Address of the account to update its report |
|  iTierAddress | `string \| BigNumber` | The iTier address |
|  report | `BigNumber` | The iTier report of the account |

<b>Returns:</b>

`void`

<a id="updateVault-method-static-1"></a>

### updateVault(mock, accountAddress, iOrderbookAddress, tokenAddress, vaultId, balance)

Method to update the mock data with provided iOrderbook details for an account, If an account with this address is not present in the mock data, it will create it with provided details and if present the report property will be updated to provided values

<b>Signature:</b>

```typescript
static updateVault(mock: Mock, accountAddress: string | BigNumber, iOrderbookAddress: string | BigNumber, tokenAddress: string | BigNumber, vaultId: string | BigNumber, balance: BigNumber): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | The mock data |
|  accountAddress | `string \| BigNumber` | The address of the account to update its vault |
|  iOrderbookAddress | `string \| BigNumber` | Address of the iOrderbook |
|  tokenAddress | `string \| BigNumber` | The address of the token |
|  vaultId | `string \| BigNumber` | The vault id |
|  balance | `BigNumber` | The vault balance |

<b>Returns:</b>

`void`

## Method Details

<a id="addAccounts-method-1"></a>

### addAccounts(accounts)

Add an account to mock data, throws an error if no mock data is not present

<b>Signature:</b>

```typescript
addAccounts(accounts: MockAccount[]): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  accounts | `MockAccount[]` | Accounts to add to mock data |

<b>Returns:</b>

`void`

<a id="findInterpreter-method-1"></a>

### findInterpreter(interpreterAddress)

Method to get the RainInterpreterTs object in this Simulation instance

<b>Signature:</b>

```typescript
findInterpreter(interpreterAddress: string): RainInterpreterTs | undefined;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  interpreterAddress | `string` | Address of the interpreter |

<b>Returns:</b>

`RainInterpreterTs | undefined`

RainInterpreterTs object or undefined if no object is present with the provided address

<a id="findInterpreterIndex-method-1"></a>

### findInterpreterIndex(interpreterAddress)

Method to get the RainInterpreterTs index in this Simulation instance

<b>Signature:</b>

```typescript
findInterpreterIndex(interpreterAddress: string): number;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  interpreterAddress | `string` | Address of the interpreter |

<b>Returns:</b>

`number`

The index of the RainInterpreterTs in this Simulation instance

<a id="initMock-method-1"></a>

### initMock()

Initiates an empty mock data object if no mock obj is present with getting current block number and timestamp from on-chain, if mock data object is present, updates its blockNumber and blockTimstamp properties with current on-chain data

<b>Signature:</b>

```typescript
initMock(): Promise<void>;
```
<b>Returns:</b>

`Promise<void>`

<a id="run-method-1"></a>

### run(mode, numberOfRuns, simulationCases, callback)

Method to execute a simulation with desired configurations. Simulation can repeat x number of times and at each step one or more than one expression with provided configs can be evaled. The evaluated results are then available in a callback function for user to do any desired action with them and return any desired object or value at each repeat. If any of the evaluation thorws error it doesn't stop the simulation, but rather the result of that error with its msg are present in the callback function as well, so user can handle them in any way desired. There are 3 modes of data reads a simulation can have which is also available in data object for opcodes' closures to do whatever they wish based on them (default behaviour of rainterpreter simulation, but can differ for custom simulation): - always: read the data from on-chain all the times, any mock data will be ignored entirely - once: only read the data from on-chain the first time simulation runs, optionally store that in mock data and reaed from mock data for next simulation runs - never: read from mock data all the times, and never try to read data from on-chain, if mock data is not available simulation will throw error

<b>Signature:</b>

```typescript
run(mode: SimulationMode, numberOfRuns: number, simulationCases: {
        interpreter: string;
        sender: string;
        data: RuntimeData;
        config?: RunConfig;
    }[], callback: (results?: (SimulationResult | SimulationError)[], mock?: Mock) => any): Promise<any>;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mode | [SimulationMode](../types/simulationmode.md) | Mode of the simulation: always, once, never |
|  numberOfRuns | `number` | Defines how many time the simulation will run |
|  simulationCases | <pre>{&#010;    interpreter: string;&#010;    sender: string;&#010;    data: RuntimeData;&#010;    config?: RunConfig;&#010;}[]</pre> | The expressions and their runtime params needed for RainInterpreterTs to eval |
|  callback | `(results?: (SimulationResult \| SimulationError)[], mock?: Mock) => any` | The function where user can define what happens at each run, the result of evals and mock data are available as arguments and user can modify the mock data at each run as desired |

<b>Returns:</b>

`Promise<any>`

Anything that callback function returns

<a id="setAccounts-method-1"></a>

### setAccounts(accounts)

Set accounts for mock data, throws an error if no mock data is not present

<b>Signature:</b>

```typescript
setAccounts(accounts: MockAccount[]): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  accounts | `MockAccount[]` | The accounts to set |

<b>Returns:</b>

`void`

<a id="setBlockNumber-method-1"></a>

### setBlockNumber(number)

Set block number for mock data, throws an error if no mock data is not present

<b>Signature:</b>

```typescript
setBlockNumber(number: number): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  number | `number` | The block number to set |

<b>Returns:</b>

`void`

<a id="setBlockTimestamp-method-1"></a>

### setBlockTimestamp(timestamp)

Set block timestamp for mock data, throws an error if no mock data is not present

<b>Signature:</b>

```typescript
setBlockTimestamp(timestamp: number): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  timestamp | `number` | The block timestamp to set |

<b>Returns:</b>

`void`

<a id="setMock-method-1"></a>

### setMock(mock)

Set mock data

<b>Signature:</b>

```typescript
setMock(mock: Mock): void;
```

#### Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  mock | [Mock](../types/mock.md) | Mock data to set |

<b>Returns:</b>

`void`

