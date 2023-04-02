[Home](./index.md)

# @rainprotocol/interpreter-ts

## Classes

|  Class | Description |
|  --- | --- |
|  [RainInterpreterTs](./classes/raininterpreterts.md) | - The typescript (javascript) version of the RainInterpreter.sol, which basically does the same job offchain, i.e evaluates an expression off-chain with either reading necessary data with onchain calls or by some provided mock data. There are many usecases, simulating and forecasting are just a few to mention. |
|  [Simulation](./classes/simulation.md) | All the things needed in order to conduct a simulation/forecast of Rain Interpreter. this uses RainInterpreterTs under the hood to eval expressions with provided opcode closures and data. Data is either mocked or fetched from on-chain as there are 3 types of simulation defined: always, once, never. These determine how the data will be handled and provided for default simulation which uses Rainterpreter opcodes and their default overrides. For a custom simulation that uses custom interpreter and opcode closures, the opcode closures need to be provided by the user. |

## Enumerations

|  Enumeration | Description |
|  --- | --- |
|  [AllStandardOps](./enums/allstandardops.md) | All the standard Op Codes |
|  [AssetType](./enums/assettype.md) | Valid token types |
|  [Debug](./enums/debug.md) |  |
|  [iSaleStatus](./enums/isalestatus.md) | Valid ISale status |
|  [iVerifyStatus](./enums/iverifystatus.md) | Valid IVerify status |
|  [MemoryType](./enums/memorytype.md) |  |
|  [NamespaceType](./enums/namespacetype.md) | Defines the namespace type for each expression that is being evaluated |
|  [selectLteLogic](./enums/selectltelogic.md) | An enum for selectLte logic |
|  [selectLteMode](./enums/selectltemode.md) | An enum for selectLte mode |
|  [Tier](./enums/tier.md) | All the contract tier levels availables in all ITier contracts. |

## Functions

|  Function | Description |
|  --- | --- |
|  [callOperand(inputSize, outputSize, sourceIndex)](./variables/calloperand_1.md) | Builds the operand for RainInterpreter's `CALL` opcode by packing 3 numbers into a single byte. |
|  [callSize(sourceIndex, loopSize, valSize)](./variables/callsize_1.md) | Constructs the operand for RainVM's `zipmap` opcode by packing 3 numbers into a single byte. All parameters use zero-based counting i.e. an `fnSize` of 0 means to allocate one element (32 bytes) on the stack to define your functions, while an `fnSize` of 3 means to allocate all four elements (4 \* 32 bytes) on the stack. |
|  [deepFreeze(object)](./variables/deepfreeze_1.md) | Deeply freezes an object, all of the properties of propterties gets frozen |
|  [doWhileOperand(inputSize, reserved, sourceIndex)](./variables/dowhileoperand_1.md) | Builds the operand for RainInterpreter's `DO_WHILE` opcode by packing 3 numbers into a single byte. |
|  [extractFromMap(map, properties)](./variables/extractfrommap_1.md) | Extract some of the properites from a Map as a new Map with same keys. |
|  [extractFromRecord(record, properties)](./variables/extractfromrecord_1.md) | Extract some of the properties from a Record as new Record with same keys. |
|  [foldContextOperand(sourceIndex, foldColumn, width, inputs)](./variables/foldcontextoperand_1.md) | Builds the operand for RainInterpreter's `FOLD_CONTEXT` opcode by packing 4 numbers into 2 bytes. |
|  [isBigNumberish(value)](./variables/isbignumberish_1.md) | function to check if the a value is of type BigNumberish |
|  [loopNOperand(n, inputSize, outputSize, sourceIndex)](./variables/loopnoperand_1.md) | Builds the operand for RainInterpreter's `LOOP_N` opcode by packing 4 numbers into a single byte. |
|  [mapToRecord(map, properties)](./variables/maptorecord_1.md) | Conver a Map to a equivelant Record (a key/value pair object). Map keys must be of type acceptable by Record constructor, which are string, number or symbol. |
|  [memoryOperand(type, offset)](./variables/memoryoperand_1.md) | Constructs operand for standard STATE opecode |
|  [recordToMap(record, properties)](./variables/recordtomap_1.md) | Conver a Record (a key/value pair object) to a equivelant Map. Map keys will be of type acceptable by Record constructor, which are string, number or symbol. |
|  [selectLteOperand(logic, mode, inputSize)](./variables/selectlteoperand_1.md) | function to set up the operand for a SELECT\_LTE opcode |
|  [tierRange(startTier, endTier)](./variables/tierrange_1.md) | function to pack start/end tier range into a byte size number for the UPDATE\_BLOCKS\_FOR\_TIER\_RANGE opcode |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [State](./interfaces/state.md) | The eval state of current expression of interpreter-ts |

## Variables

|  Variable | Description |
|  --- | --- |
|  [areEqualStateConfigs](./variables/areequalstateconfigs.md) | Checks 2 StateConfig objects to see if they are equal or not |
|  [arrayify](./variables/arrayify.md) | ethers arrayify |
|  [bytify](./variables/bytify.md) | Converts a value to raw bytes representation. Assumes `value` is less than or equal to 1 byte, unless a desired `bytesLength` is specified. |
|  [concat](./variables/concat.md) | ethers concat |
|  [defaultOverrides](./variables/defaultoverrides.md) | All default Rainterpreter override closures for Simulation |
|  [defaultProvidersUrls](./variables/defaultprovidersurls.md) | Default RPC URLs for networks, in order to use personal RPC, set its URL in a .env file with defined keys below This object can be expanded by user as desired to include more networks, just add the desired key/value (number -<!-- -->&gt; string) to this object as you do normally with any js object |
|  [eighteenZeros](./variables/eighteenzeros.md) |  |
|  [fixedPointDiv](./variables/fixedpointdiv.md) |  |
|  [fixedPointMul](./variables/fixedpointmul.md) |  |
|  [getProvider](./variables/getprovider.md) | Function to get an ethers Provider |
|  [hexlify](./variables/hexlify.md) | ethers hexlify |
|  [hexZeroPad](./variables/hexzeropad.md) | ethers hexZeroPad |
|  [max](./variables/max.md) | calculate the maximum among array of BigNumbers |
|  [min](./variables/min.md) | calculate the minimum among array of BigNumbers |
|  [op](./variables/op.md) | Converts an opcode and operand to bytes, and returns their concatenation. |
|  [paddedUInt128](./variables/paddeduint128.md) | Utility function to produce 128 bits size hexString |
|  [paddedUInt160](./variables/paddeduint160.md) | Utility function that transforms a BigNumberish to an ether address (40 char length hexString) |
|  [paddedUInt256](./variables/paddeduint256.md) | Utility function that transforms a BigNumberish from the output of the ITierV2 contract report |
|  [paddedUInt32](./variables/paddeduint32.md) | Utility function to produce 32 bits size hexString |
|  [paddedUInt64](./variables/paddeduint64.md) | Utility function to produce 64 bits size hexString |
|  [parseUnits](./variables/parseunits.md) | ethers parseUnits |
|  [rainterpreterOpConfigs](./variables/rainterpreteropconfigs.md) | All Standard Rainterpreter OpMeta with Function Pointers |
|  [saturatingAdd](./variables/saturatingadd.md) |  |
|  [saturatingDiff](./variables/saturatingdiff.md) |  |
|  [saturatingMul](./variables/saturatingmul.md) |  |
|  [saturatingSub](./variables/saturatingsub.md) |  |
|  [scale18](./variables/scale18.md) |  |
|  [scaleBy](./variables/scaleby.md) |  |
|  [scaleN](./variables/scalen.md) |  |
|  [selectLte](./variables/selectlte.md) |  |
|  [updateTimesForTierRange](./variables/updatetimesfortierrange.md) |  |
|  [zeroPad](./variables/zeropad.md) | ethers zeroPad |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [CustomSimulationArgs](./types/customsimulationargs.md) | Arguments for initiating a default simulation which uses any custom opcodes' closures |
|  [EvalResult](./types/evalresult.md) | Results of evaluated expression by RainInterpreterTs at a specific block number and timestamp |
|  [Hexable](./types/hexable.md) | A native type for ethers Hexable |
|  [InterpreterData](./types/interpreterdata.md) | All data and values available to opcodes' closures during eval, consists of Reserved and Runtime data |
|  [kvStorage](./types/kvstorage.md) | Type os interpreter-ts storage obj which holds key/value pairs mapped by sender and namespace addresses |
|  [Mock](./types/mock.md) | All data and information needed to make mock data |
|  [MockAccount](./types/mockaccount.md) | Ethers account mock type |
|  [MockERC1155](./types/mockerc1155.md) | ERC1155 token mock type |
|  [MockERC20](./types/mockerc20.md) | ERC20 token mock type |
|  [MockERC721](./types/mockerc721.md) | ERC721 token mock type |
|  [opClosure](./types/opclosure.md) | Type of an interpreter-ts opcode function (closure) |
|  [opConfig](./types/opconfig.md) | All needed for interpreter-ts to eval an opcode |
|  [OverrideFns](./types/overridefns.md) | Functions (closures) to override opcodes' original functions |
|  [Providerish](./types/providerish.md) | Type needed to construct a provider, which is either: - chain id of the network to construct the Provider from default or .evn URLs - https(s) or websocket (ws, wss) URL of the RPC to construct the Provider from - any valid ethersjs Provider |
|  [RainterpreterSimulationArgs](./types/rainterpretersimulationargs.md) | Arguments for initiating a default simulation which uses Rainterpreter opcodes |
|  [ReservedData](./types/reserveddata.md) | Reserved properties and values available to opcodes' closures at runtime, these will stay intact during eval with some exceptions which are 'storage' and 'mock' that can reassigned and/or modified during eval |
|  [RunConfig](./types/runconfig.md) | Configurations and options for eval |
|  [RuntimeData](./types/runtimedata.md) | Additional data available for opcodes' closures during eval, some names are reserved as they are necessary for any eval such as context and namespace |
|  [SimulationError](./types/simulationerror.md) | Result of a failed expression eval in a simulation that is available in run() callback signature |
|  [SimulationMode](./types/simulationmode.md) | Defines where and how data is used for a simulation - always: read the data from on-chain all the times, any mock data will be ignored entirely - once: only read the data from on-chain the first time simulation runs, optionally store that in mock data and reaed from mock data for next simulation runs - never: read from mock data all the times, and never try to read data from on-chain, if mock data is not available simulation will throw error |
|  [SimulationResult](./types/simulationresult.md) | Result of a successfull evaluated expression in a simulation that is available in run() callback signature |
|  [StateConfig](./types/stateconfig.md) | Type of valid parsed expression, i.e. compiled bytes |

