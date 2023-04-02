import { BigNumber, ethers } from "ethers";
import { Provider } from '@ethersproject/abstract-provider'
import { getProvider, Providerish } from "../defaultProviders";
import { RainInterpreterTs } from "../interpreter/RainInterpreterTs";
import { RunConfig, RuntimeData, StateConfig } from "../interpreter/types";
import { rainterpreterOpConfigs } from "../rainterpreter/rainterpreterOpConfigs";
import { defaultOverrides } from "../rainterpreter/defaultOverrides";
import { 
    RainterpreterSimulationArgs,
    Mock,
    SimulationResult,
    CustomSimulationArgs,
    MockAccount,
    SimulationError, 
    SimulationMode,
    MockERC20,
    MockERC721,
    MockERC1155,
    AssetType,
    iSaleStatus,
    iVerifyStatus
} from "./types";


/**
 * @public
 * All the things needed in order to conduct a simulation/forecast of Rain Interpreter.
 * this uses RainInterpreterTs under the hood to eval expressions with provided opcode closures
 * and data. Data is either mocked or fetched from on-chain as there are 3 types of simulation
 * defined: always, once, never. These determine how the data will be handled and provided for
 * default simulation which uses Rainterpreter opcodes and their default overrides.
 * For a custom simulation that uses custom interpreter and opcode closures, the opcode closures 
 * need to be provided by the user.
 */
export class Simulation {
    /**
     * @public
     */
    public mock?: Mock

    /**
     * @public
     */
    public readonly interpreterInstances: RainInterpreterTs[] = []

    /**
     * @public
     * Ethersjs provider
     */
    public readonly provider: Provider

    /**
     * Constructor of the class
     */
    private constructor(provider: Provider, mock?: Mock) {
        this.provider = provider
        if (mock) this.mock = mock
    }

    /**
     * @public
     * Instantiates the class object with default Rainterpreter opcodes
     * All simulations will be using the Rainterpreter opcodes and its overrides
     * all teh time
     * 
     * @param providerish - The rpc url, chainId or a valid ethersjs provider
     * @param configs - Arguments needed to instantiate the RainInterpreterTs objects
     * @param mock - Mock data
     */
    public static rainterpreter(
        providerish: Providerish,
        configs: RainterpreterSimulationArgs[],
        mock?: Mock
    ): Simulation {
        const _provider = getProvider(providerish)
        const _instance = new Simulation(_provider, mock)
        for (let i = 0; i < configs.length; i++) {
            const _index = _instance.interpreterInstances.findIndex(
                v => v.interpreterAddress === 
                    configs[i].interpreterAddress.toLowerCase()
            )
            if (_index < 0) {
                _instance.interpreterInstances.push(new RainInterpreterTs(
                    configs[i].interpreterAddress,
                    _provider,
                    rainterpreterOpConfigs,
                    defaultOverrides,
                    configs[i].stateConfigs,
                    configs[i].storages
                ))
            }
            else {
                const _tmp = configs[i].stateConfigs
                if (_tmp && _tmp.length) {
                    _instance.interpreterInstances[_index].expressions.push(..._tmp)
                }
            }
        }
        return _instance
    }

    /**
     * @public
     * Instantiates the class object with custom opcodes closures
     * All simulations will be using these custom opcodes and their overrides
     * 
     * @param providerish - The rpc url, chainId or a valid ethersjs provider
     * @param configs - Arguments needed to instantiate the RainInterpreterTs objects with custom opcode closures
     * @param mock - Mock data
     */
    public static custom(
        providerish: Providerish,
        configs: CustomSimulationArgs[],
        mock?: Mock
    ): Simulation {
        const _provider = getProvider(providerish)
        const _instance = new Simulation(_provider, mock)
        for (let i = 0; i < configs.length; i++) {
            const _index = _instance.interpreterInstances.findIndex(
                v => v.interpreterAddress === 
                    configs[i].interpreterAddress.toLowerCase()
            )
            if (_index < 0) {
                _instance.interpreterInstances.push(new RainInterpreterTs(
                    configs[i].interpreterAddress,
                    _provider,
                    configs[i].functionPointers,
                    configs[i].overrides,
                    configs[i].stateConfigs,
                    configs[i].storages
                ))
            }
            else {
                const _tmp = configs[i].stateConfigs
                if (_tmp && _tmp.length) {
                    _instance.interpreterInstances[_index].expressions.push(..._tmp)
                }
            }
        }
        return _instance
    }

    /**
     * @public
     * Initiates an empty mock data object if no mock obj is present with getting current block number 
     * and timestamp from on-chain, if mock data object is present, updates its blockNumber and blockTimstamp 
     * properties with current on-chain data
     */
    public async initMock() {
        const _number = await this.provider.getBlockNumber()
        const _timestamp = (await this.provider.getBlock(_number)).timestamp
        if (this.mock) {
            this.mock.blockNumber = _number
            this.mock.blockTimestamp = _timestamp
        }
        else this.mock = {
            blockNumber: _number,
            blockTimestamp: _timestamp,
            accounts: []
        }
    }

    /**
     * @public
     * Method to get the RainInterpreterTs object in this Simulation instance
     * 
     * @param interpreterAddress - Address of the interpreter
     * @returns RainInterpreterTs object or undefined if no object is present with the provided address
     */
    public findInterpreter(interpreterAddress: string): RainInterpreterTs | undefined {
        interpreterAddress = interpreterAddress.toLowerCase()
        return this.interpreterInstances.find(
            v => v.interpreterAddress === interpreterAddress
        )
    }
    
    /**
     * @public
     * Method to get the RainInterpreterTs index in this Simulation instance
     * 
     * @param interpreterAddress - Address of the interpreter
     * @returns The index of the RainInterpreterTs in this Simulation instance
     */
    public findInterpreterIndex(interpreterAddress: string): number {
        interpreterAddress = interpreterAddress.toLowerCase()
        return this.interpreterInstances.findIndex(
            v => v.interpreterAddress === interpreterAddress
        )
    }

    /**
     * @public
     * Set mock data
     * 
     * @param mock - Mock data to set
     */
    public setMock(mock: Mock) {
        this.mock = mock
    }

    /**
     * @public
     * Set block number for mock data, throws an error if no mock data is not present
     * 
     * @param number - The block number to set
     */
    public setBlockNumber(number: number) {
        if (this.mock) this.mock.blockNumber = number
        else throw new Error("mock data doesn't exists")
    }

    /**
     * @public
     * Set block timestamp for mock data, throws an error if no mock data is not present
     * 
     * @param timestamp - The block timestamp to set
     */
    public setBlockTimestamp(timestamp: number) {
        if (this.mock) this.mock.blockTimestamp = timestamp
        else throw new Error("mock data doesn't exists")
    }

    /**
     * @public
     * Set accounts for mock data, throws an error if no mock data is not present
     * 
     * @param accounts - The accounts to set
     */
    public setAccounts(accounts: MockAccount[]) {
        if (this.mock) this.mock.accounts = accounts
        else throw new Error("mock data doesn't exists")
    }

    /**
     * @public
     * Add an account to mock data, throws an error if no mock data is not present
     * 
     * @param accounts - Accounts to add to mock data
     */
    public addAccounts(accounts: MockAccount[]) {
        if (this.mock) {
            for (let i = 0; i < accounts.length; i++) {
                const _index = this.mock.accounts.findIndex(
                    v => v.address.eq(accounts[i].address)
                )
                if (_index < 0) this.mock.accounts.push(accounts[i])
                else this.mock.accounts[_index] = accounts[i]
            }
        }
        else throw new Error("mock data doesn't exists")
    }

    /**
     * @public
     * Method to execute a simulation with desired configurations. Simulation can repeat x number of times and
     * at each step one or more than one expression with provided configs can be evaled. The evaluated results
     * are then available in a callback function for user to do any desired action with them and return any desired
     * object or value at each repeat. If any of the evaluation thorws error it doesn't stop the simulation, but
     * rather the result of that error with its msg are present in the callback function as well, so user can handle 
     * them in any way desired.
     * There are 3 modes of data reads a simulation can have which is also available in data object for opcodes' closures
     * to do whatever they wish based on them (default behaviour of rainterpreter simulation, but can differ for 
     * custom simulation):
     * - always: read the data from on-chain all the times, any mock data will be ignored entirely
     * - once: only read the data from on-chain the first time simulation runs, optionally store 
     * that in mock data and reaed from mock data for next simulation runs
     * - never: read from mock data all the times, and never try to read data from on-chain, if mock
     * data is not available simulation will throw error
     * 
     * @param mode - Mode of the simulation: always, once, never
     * @param numberOfRuns - Defines how many time the simulation will run
     * @param simulationCases - The expressions and their runtime params needed for RainInterpreterTs to eval
     * @param callback - The function where user can define what happens at each run, the result of evals and 
     * mock data are available as arguments and user can modify the mock data at each run as desired
     * @returns Anything that callback function returns
     */
    public async run(
        mode: SimulationMode,
        numberOfRuns: number,
        simulationCases: {
            interpreter: string,
            sender: string,
            data: RuntimeData,
            config?: RunConfig
        }[],
        callback: (results?: (SimulationResult | SimulationError)[], mock?: Mock) => any,
    ): Promise<any> {
        if (simulationCases.length && numberOfRuns > 0) {
            const _returnObj: any[] = []
            for (let i = 0; i < numberOfRuns; i++) {
                const _results: (SimulationResult | SimulationError)[] = []
                let _block: { number: number; timestamp: number } | undefined

                // handle block number and timestamp for each simulation mode
                if (mode === 'never') {
                    if (!this.mock) await this.initMock()
                    else {
                        _block = {
                            number: this.mock.blockNumber,
                            timestamp: this.mock.blockTimestamp
                        }
                    }
                }
                if (mode === 'once') {
                    if (i === 0) {
                        await this.initMock().then(() => _block = {
                            number: this.mock?.blockNumber ?? 0,
                            timestamp: this.mock?.blockTimestamp ?? 0
                        })
                    }
                }
                if (mode === 'always') _block = undefined

                // start eval expressions
                for (let j = 0; j < simulationCases.length; j++) {
                    const _interpreter = this.findInterpreter(simulationCases[j].interpreter)
                    if (_interpreter) {
                        let _exp: StateConfig | undefined
                        let _index: number | undefined
                        let _err = ''

                        // handle expression/index to eval
                        if (!simulationCases[j].config?.expression) {
                            _index = _interpreter.expressions.length - 1 < 0 
                                ? undefined 
                                : _interpreter.expressions.length - 1
                            if (_index) _exp = _interpreter.expressions[_index]
                            else _err = `cannot find any expressions to run on interpreter ${
                                _interpreter.interpreterAddress.toLowerCase()
                            }`
                        }
                        else {
                            if (typeof simulationCases[j].config?.expression === 'number') {
                                if (
                                    simulationCases[j].config?.expression as number < 
                                        _interpreter.expressions.length
                                ) {
                                    _index = simulationCases[j].config?.expression as number
                                    if (_index < 0) {
                                        _index = undefined
                                        _exp = undefined
                                        _err = 'invalid expression index'
                                    }
                                    else _exp = _interpreter.expressions[_index]
                                }
                                else {
                                    _index = _interpreter.expressions.length - 1
                                    _exp = _interpreter.expressions[_index]
                                }
                            }
                            else {
                                _index = _interpreter.expressions.length
                                _exp = simulationCases[j].config?.expression as StateConfig
                            }
                        }
                        
                        // // set simulation mode and mock to data object and freeze the mode
                        // if (simulationCases[j].data) {
                        //     simulationCases[j].data.mode = mode
                        //     simulationCases[j].data.mock = this.mock
                        // }
                        // else {
                        //     simulationCases[j].data = {
                        //         mode: mode,
                        //         mock: this.mock
                        //     }
                        // }
                        // Object.freeze(simulationCases[j].data.mode)
                        
                        // store the eval result or errors of expressions
                        if (_err.length) {
                            _results.push({
                                interpreter: _interpreter.interpreterAddress.toLowerCase(),
                                error: _err,
                                blockNumber: _block?.number,
                                blockTimestamp: _block?.timestamp,
                                expression: _exp,
                                index: _index
                            })
                        }
                        else {
                            try {
                                const _evalResult = await _interpreter.run(
                                    simulationCases[j].sender,
                                    simulationCases[j].data,
                                    {
                                        expression: simulationCases[j].config?.expression,
                                        namespaceType: simulationCases[j].config?.namespaceType,
                                        block: _block,
                                        entrypoint: simulationCases[j].config?.entrypoint,
                                        overrideFunctions: 
                                            simulationCases[j].config?.overrideFunctions,
                                        simulationArgs: {
                                            mode,
                                            mock: this.mock,
                                            simulationCount: i
                                        }
                                    }
                                )
                                _results.push({
                                    interpreter: _interpreter.interpreterAddress.toLowerCase(),
                                    finalStack: _evalResult.finalStack,
                                    blockNumber: _evalResult.blockNumber,
                                    blockTimestamp: _evalResult.blockTimestamp,
                                    expression: _exp as StateConfig,
                                    index: _index as number
                                })
                            }
                            catch(_e) {
                                _results.push({
                                    interpreter: _interpreter.interpreterAddress.toLowerCase(),
                                    error: `eval failed, reason: ${_e}`,
                                    blockNumber: _block?.number,
                                    blockTimestamp: _block?.timestamp,
                                    expression: _exp as StateConfig,
                                    index: _index as number
                                })
                            }
                        }
                    }
                    else {
                        _results.push({
                            interpreter: simulationCases[j].interpreter.toLowerCase(),
                            error: 'no interpreter instance exists with this address',
                            blockNumber: _block?.number,
                            blockTimestamp: _block?.timestamp,
                            expression: 
                                simulationCases[j].config?.expression && 
                                typeof simulationCases[j].config?.expression !== 'number' 
                                    ? simulationCases[j].config?.expression as StateConfig 
                                    : undefined,
                            index: 
                                simulationCases[j].config?.expression &&
                                typeof simulationCases[j].config?.expression === 'number' 
                                    ? simulationCases[j].config?.expression as number 
                                    : undefined,
                        })
                    }
                }
                // store the result of callback function at each run
                _returnObj.push(callback(_results, this.mock))
            }
            return _returnObj
        }
        else throw new Error('nothing to run')
    }

    /**
     * @public
     * Method to get the balance of a asset for an account, returns zero if such asset or account is not
     * present in the mock data
     * 
     * @param mock - The mock data object
     * @param accountAddress - The account address
     * @param assetAddress - The asset address
     * @param id - id of the token for erc721 and erc1155 tokens or snapshot id of erc20 token (passing 
     * id for erc20 token will get the snapshot balance)
     * @returns The balance of the account of the asset, 0 if either account or asset or id (in case of 
     * erc721 and erc1155) was not present
     */
    public static getBalance(
        mock: Mock,
        accountAddress: string | BigNumber,
        assetAddress: string | BigNumber,
        id?: string |  BigNumber
    ): BigNumber {
        const _asset = mock.accounts.find(
            v => v.address.eq(accountAddress)
        )?.assets.find(
            v => v.address.eq(assetAddress)
        )
        if (_asset) {
            if (_asset.type === AssetType.erc20) {
                if (id) {
                    const _snapshot = mock.accounts.find(
                        v => v.address.eq(accountAddress)
                    )?.assets.find(
                        v => v.type === AssetType.erc20 && 
                            v.address.eq(assetAddress) &&
                            v.snapshotId && 
                            v.snapshotId.eq(id)
                    )
                    if (_snapshot) return (_snapshot as MockERC20).balance
                    else return BigNumber.from(0)
                }
                else return _asset.balance
            }
            else if (_asset.type === AssetType.erc721) {
                const _allERC721s = mock.accounts.find(
                    v => v.address.eq(accountAddress)
                )?.assets.filter(
                    v => v.address.eq(assetAddress)
                ) as MockERC721[]
                return BigNumber.from(_allERC721s.length)
            }
            else {
                if (id) {
                    return (mock.accounts.find(
                        v => v.address.eq(accountAddress)
                    )?.assets.find(
                        v => v.address.eq(assetAddress) && (v as MockERC1155).id.eq(id)
                    ) as MockERC1155).balance
                }
                else return BigNumber.from(0)
            }
        }
        else return BigNumber.from(0)
    }

    /**
     * @public
     * Method to get the total supply of a asset for an account, returns zero if such asset or account 
     * or token id (in case of erc1155) is not present in the mock data and return or asset is of type erc721
     * 
     * @param mock - The mock data object
     * @param assetAddress - The asset address
     * @param id - The id of the token for erc1155 tokens
     * @returns The balance of the account of the asset, 0 if either account or asset was not present
     */
    public static getTotalSupply(
        mock: Mock,
        assetAddress: string | BigNumber,
        id?: string | BigNumber
    ): BigNumber {
        const _asset = mock.accounts.find(
            v => v.assets.find(
                e => e.address.eq(assetAddress)
            )
        )?.assets.find(
            v => v.address.eq(assetAddress)
        )
        if (_asset) {
            if (_asset.type === AssetType.erc20) {
                if (id) {
                    const _snapshot = mock.accounts.find(
                        v => v.assets.find(
                            e => e.address.eq(assetAddress)
                        )
                    )?.assets.find(
                        v => v.type === AssetType.erc20 && 
                            v.address.eq(assetAddress) &&
                            v.snapshotId &&
                            v.snapshotId.eq(id)
                    )
                    if (_snapshot) return (_snapshot as MockERC20).totalSupply
                    else return _asset.totalSupply
                }
                return _asset.totalSupply
            }
            else throw new Error('not erc20 token')
        }
        else return BigNumber.from(0)
    }

    /**
     * @public
     * Method to get the total supply of a asset for an account, returns zero if such asset or account 
     * or token is of type erc721 or erc1155
     * 
     * @param mock - The mock data object
     * @param accountAddress - The account address
     * @param assetAddress - The asset address
     * @returns The balance of the account of the asset, 0 if either account or asset was not present
     */
    public static getDecimals(
        mock: Mock,
        accountAddress: string | BigNumber,
        assetAddress: string | BigNumber,
    ): number {
        const _asset = mock.accounts.find(
            v => v.address.eq(accountAddress)
        )?.assets.find(
            v => v.address.eq(assetAddress)
        )
        if (_asset) {
            if (_asset.type === AssetType.erc20) return _asset.decimals
            else return 0
        }
        else return 0
    }

    /**
     * @public
     * Method to get the owner of an erc721 token with id
     * 
     * @param mock - The mock data
     * @param assetAddress - ERC721 token address
     * @param id - The id of the token
     * @returns The owner of the address
     */
    public static getOwner(
        mock: Mock,
        assetAddress: string | BigNumber,
        id: BigNumber
    ): BigNumber | undefined {
        return mock.accounts.find(
            v => v.assets.find(
                e => e.address.eq(assetAddress) &&
                    e.type === AssetType.erc721 &&
                    e.id.eq(id)
            )
        )?.address
    }

    /**
     * @public
     * Method to update asset of an account in mock data, if the account is already present in the mock
     * data, as well as the asset for that account, it will overwrite it with provided asset, so in order to
     * for example update the balance of such account for that asset, caller must use the getBalance() and 
     * calculate the final amount seperately
     * 
     * @param mock - The mock data object
     * @param account - The account to update its assets
     * @param asset - The asset
     */
    public static updateMockAsset(
        mock: Mock,
        account: string | BigNumber,
        asset: MockERC20 | MockERC721 | MockERC1155
    ) {
        // if (typeof account === 'string' || account instanceof BigNumber) {
        const _index = mock.accounts.findIndex(v => v.address.eq(account))
        if (_index > -1) {
            if (asset.type === AssetType.erc20) {
                const _assetIndex = mock.accounts[_index].assets.findIndex(
                    v => v.address.eq(asset.address)
                )
                if (_assetIndex > -1) mock.accounts[_index].assets[_assetIndex] = asset
                else mock.accounts[_index].assets.push(asset)
            }
            else {
                const _assetIndex = mock.accounts[_index].assets.findIndex(
                    v => v.address.eq(asset.address) &&
                        (v.type === AssetType.erc721 || v.type === AssetType.erc1155) &&
                        v.id.eq(asset.id)
                )
                if (_assetIndex > -1) mock.accounts[_index].assets[_assetIndex] = asset
                else mock.accounts[_index].assets.push(asset)
            }
        }
        else mock.accounts.push({
            address: BigNumber.from(account),
            assets: [asset],
            chainlink: undefined,
            iSale: undefined,
            iTier: [],
            iOrderbook: [],
            iVerify: []
        })
        // }
        // else {
        //     const _index = mock.accounts.findIndex(v => v.address.eq(account.address))
        //     if (_index > -1) {
        //         if (asset.type === AssetType.erc20) {
        //             const _assetIndex = mock.accounts[_index].assets.findIndex(
        //                 v => v.address.eq(asset.address)
        //             )
        //             if (_assetIndex > -1) mock.accounts[_index].assets[_assetIndex] = asset
        //             else mock.accounts[_index].assets.push(asset)
        //         }
        //         else {
        //             const _assetIndex = mock.accounts[_index].assets.findIndex(
        //                 v => v.address.eq(asset.address) &&
        //                     (v.type === AssetType.erc721 || v.type === AssetType.erc1155) &&
        //                     v.id.eq(asset.id)
        //             )
        //             if (_assetIndex > -1) mock.accounts[_index].assets[_assetIndex] = asset
        //             else mock.accounts[_index].assets.push(asset)
        //         }
        //     }
        //     else {
        //         if (account.assets.find(v => v.address.eq(asset.address))) {
        //             account.assets[
        //                 account.assets.findIndex(v => v.address.eq(asset.address))
        //             ] = asset
        //             mock.accounts.push(account)
        //         }
        //         else mock.accounts.push({
        //             address: account.address,
        //             assets: [
        //                 ...account.assets,
        //                 asset
        //             ],
        //             chainlink: account.chainlink,
        //             iSale: account.iSale,
        //             iTier: account.iTier,
        //             iOrderbook: account.iOrderbook
        //         })
        //     }
        // }
    }

    /**
     * @public
     * Method to get the chainlink price from mock data, returns undefined if the chainlink account is not present
     * 
     * @param mock - The mock data to search
     * @param chainlinkAddress - The address of chainlink contract
     * @returns - object with asnwer and updatedAt properties and undefined if the address not present in mock data
     */
    public static getChainlink(
        mock: Mock,
        chainlinkAddress: string | BigNumber
    ): { updatedAt: number, answer: BigNumber} | undefined {
        return mock.accounts.find(v => v.address.eq(chainlinkAddress))?.chainlink
    }

    /**
     * @public
     * Method to update the mock data with an chainlink account that has aswer and updatedat properties
     * If an account with this address is not present in the mock data, it will create it with provided details
     * and if present the answwer and updatedAt properties will be updated to provided values
     * 
     * @param mock - The mock data to search
     * @param chainlinkAddress - The address of chainlink contract
     * @param updatedAt - The answer property was updated at this many timestamps ago 
     * @param answer - Price of the chainlink oracle
     */
    public static updateChainlink(
        mock: Mock,
        chainlinkAddress: string | BigNumber,
        updatedAt: number,
        answer: BigNumber
    ) {
        const _index = mock.accounts.findIndex(v => v.address.eq(chainlinkAddress))
        if (_index > -1) mock.accounts[_index].chainlink = {
            updatedAt,
            answer
        }
        else mock.accounts.push({
            address: BigNumber.from(chainlinkAddress),
            assets: [],
            chainlink: { updatedAt, answer},
            iSale: undefined,
            iTier: [],
            iOrderbook: [],
            iVerify: []
        })
    }

    /**
     * @public
     * Method to get the report of an account from mock data, returns NEVER if any of provided account or iTier 
     * address are not present in the mock data
     * 
     * @param mock - The mock data to search
     * @param accountAddress - The address of the account to get report for
     * @param iTierAddress - The address of the iTier contract
     * @returns - The report of the account, return NEVER report if any of provided details are not present in mock data
     */
    public static getReport(
        mock: Mock,
        accountAddress: string | BigNumber,
        iTierAddress: string | BigNumber,
    ): BigNumber {
        const _report = (mock.accounts.find(
            v => v.address.eq(accountAddress)
        ))?.iTier.find(
            v => v.iTierContract.eq(iTierAddress)
        )?.report
        if (_report) return _report
        else return ethers.constants.MaxUint256
    }

    /**
     * @public
     * Method to update the mock data with report for an account, If an account with this address is
     * not present in the mock data, it will create it with provided details and if present the report 
     * property will be updated to provided values
     * 
     * @param mock - The mock data
     * @param accountAddress - Address of the account to update its report
     * @param iTierAddress - The iTier address
     * @param report - The iTier report of the account
     */
    public static updateReport(
        mock: Mock,
        accountAddress: string | BigNumber,
        iTierAddress: string | BigNumber,
        report: BigNumber
    ) {
        const _index = mock.accounts.findIndex(v => v.address.eq(accountAddress))
        if (_index > -1) {
            const _iTierIndex = mock.accounts[_index].iTier.findIndex(
                v => v.iTierContract.eq(iTierAddress)
            )
            if (_iTierIndex > -1) mock.accounts[_index].iTier[_iTierIndex].report = report
            else mock.accounts[_index].iTier.push({
                iTierContract: BigNumber.from(iTierAddress),
                report
            })
        }
        else mock.accounts.push({
            address: BigNumber.from(accountAddress),
            assets: [],
            chainlink: undefined,
            iSale: undefined,
            iOrderbook: [],
            iTier: [{ iTierContract: BigNumber.from(iTierAddress), report }],
            iVerify: []
        })
    }

    /**
     * @public
     * Method to get the iSale details from mock data, returns undefined if not present in mock data
     * 
     * @param mock - The mock data to search
     * @param iSaleAddress - The address of the iSale contract
     * @returns - iSale status, reseve and rTKN details and balances, and undefined if iSale is not present in mock data
     */
    public static getISale(
        mock: Mock,
        iSaleAddress: string | BigNumber
    ): { 
        status: number;
        reserve: MockERC20;
        token: MockERC20;
    } | undefined {
        return mock.accounts.find(
            v => v.address.eq(iSaleAddress)
        )?.iSale
    }

    /**
     * @public
     * Method to update the mock data with provided iSale details for an account, If an account with this 
     * address is not present in the mock data, it will create it with provided details and if present the 
     * report property will be updated to provided values
     * 
     * @param mock - The mock data
     * @param iSaleAddress - Address of the iSale 
     * @param status - The iSale status
     * @param reserve - The reserve token
     * @param token - The rTKN
     */
    public static updateISale(
        mock: Mock,
        iSaleAddress: string | BigNumber,
        status: iSaleStatus,
        reserve: MockERC20,
        token: MockERC20
    ) {
        const _index = mock.accounts.findIndex(
            v => v.address.eq(iSaleAddress)
        )
        if (_index > -1) mock.accounts[_index].iSale = {
            status,
            reserve,
            token
        }
        else mock.accounts.push({
            address: BigNumber.from(iSaleAddress),
            assets: [],
            chainlink: undefined,
            iTier: [],
            iOrderbook: [],
            iSale: { status, reserve, token },
            iVerify: []
        })
    }

    /**
     * @public
     * Method to get the vault balance of an account from mock data, returns 0 if vault with 
     * provided details is not present
     * 
     * @param mock - The mock data to search
     * @param accountAddress - The address of the account to get its vault balance
     * @param iOrderbookAddress - The address of the iOrderbook contract
     * @param tokenAddress - The token address
     * @param vaultId - The vault id
     * @returns - The vault balance 
     */
    public static getVaultBalance(
        mock: Mock,
        accountAddress: string | BigNumber,
        iOrderbookAddress: string | BigNumber,
        tokenAddress: string | BigNumber,
        vaultId: string | BigNumber,
    ): BigNumber {
        const _balance = mock.accounts.find(
            v => v.address.eq(accountAddress)
        )?.iOrderbook.find(
            v => 
                v.iOrderbookContract.eq(iOrderbookAddress)
        )?.vaults.find(
            e => 
                e.tokenAddress.eq(tokenAddress) && 
                e.vaultId.eq(vaultId)
        )?.balance
        if (_balance) return _balance
        else return BigNumber.from(0)
    }

    /**
     * @public
     * Method to update the mock data with provided iOrderbook details for an account, If an account with this 
     * address is not present in the mock data, it will create it with provided details and if present the 
     * report property will be updated to provided values
     * 
     * @param mock - The mock data
     * @param accountAddress - The address of the account to update its vault
     * @param iOrderbookAddress - Address of the iOrderbook
     * @param tokenAddress - The address of the token
     * @param vaultId - The vault id
     * @param balance - The vault balance
     */
    public static updateVault(
        mock: Mock,
        accountAddress: string | BigNumber,
        iOrderbookAddress: string | BigNumber,
        tokenAddress: string | BigNumber,
        vaultId: string | BigNumber,
        balance: BigNumber,
    ) {
        const _index = mock.accounts.findIndex(
            v => v.address.eq(accountAddress)
        )
        if (_index > -1) {
            const _iOrderbookIndex = mock.accounts[_index].iOrderbook.findIndex(
                v => v.iOrderbookContract.eq(iOrderbookAddress)
            )
            if (_iOrderbookIndex > -1) {
                const _vaultIndex = mock.accounts[_index].iOrderbook[
                    _iOrderbookIndex
                ].vaults.findIndex(
                    v => v.tokenAddress.eq(tokenAddress) && v.vaultId.eq(vaultId)
                )
                if (_vaultIndex > -1) mock.accounts[_index].iOrderbook[
                    _iOrderbookIndex
                ].vaults[_vaultIndex].balance = balance
                else mock.accounts[_index].iOrderbook[_iOrderbookIndex].vaults.push({
                    tokenAddress: BigNumber.from(tokenAddress),
                    vaultId: BigNumber.from(tokenAddress),
                    balance
                })
            }
            else mock.accounts[_index].iOrderbook.push({
                iOrderbookContract: BigNumber.from(iOrderbookAddress),
                vaults: [{
                    tokenAddress: BigNumber.from(tokenAddress),
                    vaultId: BigNumber.from(tokenAddress),
                    balance
                }]
            })
        }
        else mock.accounts.push({
            address: BigNumber.from(accountAddress),
            assets: [],
            chainlink: undefined,
            iSale: undefined,
            iTier: [],
            iOrderbook: [{
                iOrderbookContract: BigNumber.from(iOrderbookAddress),
                vaults: [{
                    tokenAddress: BigNumber.from(tokenAddress),
                    vaultId: BigNumber.from(vaultId),
                    balance
                }]
            }],
            iVerify: []
        })
    }

    /**
     * @public
     * Method to get the verify status of an account at certain timestamp from mock data, returns 0 if status of 
     * provided details is not present
     * 
     * @param mock - The mock data
     * @param accountAddress - The address of the account to get its status
     * @param iVerifyAddress - Address of the iVerify contract
     * @param timestamp - The timestamp
     * @returns the status of the iVerify contract for the account, if not found returns 0 i.e. 'nil' status
     */
    public static getIVerifyStatusAtTime(
        mock: Mock,
        accountAddress: string | BigNumber,
        iVerifyAddress: string | BigNumber,
        timestamp: number
    ): number {
        let _status = iVerifyStatus.nil
        const _statuses = mock.accounts.find(
            v => v.address.eq(accountAddress)
        )?.iVerify.filter(
            v => 
                v.iVerifyContract.eq(iVerifyAddress) && 
                v.timestamp <= timestamp
        )
        if (_statuses?.length) {
            _status = _statuses.reduce(
                (a, b) => a.timestamp > b.timestamp ? a : b
            ).status
        }
        return _status
    }

    /**
     * @public
     * Method to update the mock data with iVerify status for an account at a timestamp, If an account 
     * with this address is not present in the mock data, it will create it with provided details and 
     * if present the report property will be updated to provided values
     * 
     * @param mock - The mock data
     * @param accountAddress - Address of the account to update its iVerify state
     * @param iVerifyAddress - The iVerify address
     * @param status - The iVerify status of the account
     * @param timestamp - The timestamp that status update is taking place at
     */
    public static updateIVerify(
        mock: Mock,
        accountAddress: string | BigNumber,
        iVerifyAddress: string | BigNumber,
        status: iVerifyStatus,
        timestamp: number
    ) {
        const _index = mock.accounts.findIndex(v => v.address.eq(accountAddress))
        if (_index > -1) {
            const _iVerify = mock.accounts[_index].iVerify.filter(
                v => v.iVerifyContract.eq(iVerifyAddress) &&
                     v.timestamp === timestamp
            )
            if (_iVerify.length) {
                for (let i = 0; i < _iVerify.length; i++) {
                    _iVerify[i].status = status
                }
            }
            else _iVerify.push({
                iVerifyContract: BigNumber.from(iVerifyAddress),
                status,
                timestamp
            })
        }
        else mock.accounts.push({
            address: BigNumber.from(accountAddress),
            assets: [],
            chainlink: undefined,
            iSale: undefined,
            iOrderbook: [],
            iTier: [],
            iVerify: [{ iVerifyContract: BigNumber.from(iVerifyAddress), status, timestamp}]
        })
    }
}

