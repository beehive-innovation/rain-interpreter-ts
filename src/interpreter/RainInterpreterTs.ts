import { arrayify, deepFreeze } from '../utils';
import { BigNumber, VoidSigner } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider'
import { getProvider, Providerish } from '../defaultProviders';
import { 
    OverrideFns,
    State,
    kvStorage,
    NamespaceType,
    StateConfig,
    opConfig,
    RunConfig,
    RuntimeData,
    InterpreterData,
    EvalResult,
} from './types';


/**
 * @public - The typescript (javascript) version of the RainInterpreter.sol, which basically does 
 * the same job offchain, i.e evaluates an expression off-chain with either reading necessary data
 * with onchain calls or by some provided mock data. There are many usecases, simulating and forecasting
 * are just a few to mention.
 */
export class RainInterpreterTs {
    /**
     * @public
     * The latest result (final stack) of an evaluated expression.
     */
    public readonly lastStack: BigNumber[] = [];

    /**
     * @public
     * The state which which is used to eval an expression.
     */
    public readonly state: State;

    /**
     * @public
     * The expressions of this iterpreter
     */
    public readonly expressions: StateConfig[] = [];

    /**
     * @public
     * The interpreter's address
     */
    public readonly interpreterAddress: string;

    /**
     * @public
     * Array of opcodes' enums and their ts functions, inputs and 
     * outputs which defines the closure for each of them
     */
    public readonly opConfigs: opConfig[];

    /**
     * @public
     * Functions to override the existing opcodes ts functions (closures)
     */
    public readonly overrideFns?: OverrideFns;

    /**
     * @public
     * An object to store key/value pairs of an interpreter which is mapped by
     * each msg.sender and namespace
     */
    public readonly storage: kvStorage = {};

    /**
     * @public
     * An ethersjs provider used to read onchain data
     */
    public readonly provider: Provider;

    /**
     * @public
     * An etherjs VoidSigner used to read onchain data
     */
    public readonly voidSigner: VoidSigner;

    /**
     * The private constructor of RainInterpreterTs which initiates the RainInterpreterTs and also a State for a RainVM script.
     * This is a private constructore so for instantiating the class object one need to use the static .init() method
     *
     * @param interpreterAddress - The interpreter's address
     * @param providerish - The chainId or rpc url or a valid ethersj provider
     * @param opConfigs - Array of functions (closures) paired with opcodes' enums and their inputs and ouputs
     * @param overrides - (optional) The functions to override the original opcode functions of interpreter-ts instance
     * @param stateConfigs - (optional) StateConfigs to add to this instance of interpreter-ts
     * @param storages - (optional) The storage obj to add to this interpreter-ts instance
     */
    constructor(
        interpreterAddress: string,
        providerish: Providerish,
        opConfigs: opConfig[],
        overrides?: OverrideFns,
        stateConfigs?: StateConfig[],
        storages?: kvStorage
    ) {
        this.state = {
            stack: [],
            constants: [],
            sources: [],
        }
        if (stateConfigs?.length) {
            for (let i = 0; i < stateConfigs.length; i++) {
                this.addExpression(stateConfigs[i])
            }
        }
        if (storages && Object.keys(storages).length) {
            const strgs = Object.keys(storages);
            for (let i = 0; i < strgs.length; i++) {
                const items = Object.keys(storages[strgs[i]])
                for (let j = 0; j < items.length; j++) {
                    for (let k = 0; k < storages[strgs[i]][items[j]].length; k++) {
                        RainInterpreterTs.addStorage(
                            this.storage,
                            strgs[i].toLowerCase(),
                            items[j].toLowerCase(),
                            storages[strgs[i]][items[j]][k]
                        )
                    }
                }
            }
        }
        this.interpreterAddress = interpreterAddress.toLowerCase()
        this.opConfigs = opConfigs
        this.overrideFns = overrides;
        this.provider = getProvider(providerish)
        this.voidSigner = new VoidSigner(
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            this.provider
        )
        deepFreeze(this.opConfigs)
        deepFreeze(this.overrideFns)
    }

    /**
     * The main workhorse of interpreter-ts, basically the typescript (or javascript) version of 'eval' 
     * method in RainInterpreter.sol. It evals the expression based on each opcode's functions or 
     * override functions provided.
     *
     * @param data - Used as any additional data that opcode functions may need.
     * @param expIndex - Index of the expression in expression array of class
     * @param overrideFns - The functions to override the original opcode functions of interpreter-ts instance
     * @param blockNumber - The block number of this run
     * @param blockTimestamp - The block timestamp of this run
     * @param entrypoint - (optional) The entrypoint of expression sources
     */
    private async eval(
        data: InterpreterData,
        expIndex: number,
        overrideFns: OverrideFns,
        blockNumber: number,
        blockTimestamp: number,
        entrypoint?: number,
    ): Promise<void> {
        // keeping a copy of original immutable data props to make sure they 
        // don't get changed during eval by re-assigning them
        const _sender = data.sender
        const _namespaceType = data.namespaceType
        const _mode = data.mode
        const _simulationCount = data.simulationCount
        const _namespace = data.namespace
        const _context: BigNumber[][] = []
        for (let i = 0; i < data.context.length; i++) {
            _context.push([...data.context[i]])
        }
        deepFreeze(_context)
        const _block = { number: blockNumber, timestamp: blockTimestamp }
        deepFreeze(_block)

        // setting the entrypoint
        const _entrypoint = entrypoint && entrypoint >= 0 ? entrypoint : 0

        // start eval
        for (let i = 0; i < this.state.sources[_entrypoint]?.length; i += 4) {

            // reassigning the immutable data items to keep them intact during eval in case 
            // opcodes closures change them, some other props such as storage and mock are 
            // excluded as they are mutable
            data.provider           = this.provider
            data.voidSigner         = this.voidSigner
            data.interpreterAddress = this.interpreterAddress
            data.stateConfig        = this.expressions[expIndex]
            data.opConfigs          = this.opConfigs
            data.overrides          = overrideFns
            data.sender             = _sender
            data.namespaceType      = _namespaceType
            data.mode               = _mode
            data.simulationCount    = _simulationCount
            data.namespace          = _namespace
            data.context            = _context
            data.block              = _block

            // re-assign stack prop in data to current stack at each step
            data.stack = [...this.state.stack]

            const _op = (this.state.sources[_entrypoint][i] << 8) +
                this.state.sources[_entrypoint][i + 1]

            const _operand = (this.state.sources[_entrypoint][i + 2] << 8) +
                this.state.sources[_entrypoint][i + 3]

            const _index = this.opConfigs.findIndex(v => v.enum === _op)

            if (_index > -1) {
                const _inputs = this.opConfigs[_index].inputs(_operand)
                const _outputs = this.opConfigs[_index].outputs(_operand)
                const _peekUp = _inputs > 0 ? this.state.stack.splice(-_inputs) : []
                let _result: BigNumber[]
                if (_peekUp.length === _inputs) {
                    if (overrideFns && Object.keys(overrideFns).includes(_op.toString())) {
                        _result = await overrideFns[_op](_peekUp, _operand, data)
                    }
                    else _result = await this.dispatch(
                        _peekUp,
                        _index,
                        _operand,
                        data
                    )
                    if (_result.length === _outputs) {
                        this.state.stack.push(..._result)
                    }
                    else throw new Error('integrity check failed')
                }
                else throw new Error('stack underflow')
            }
            else throw new Error(`opcode with enum ${_op} doesn't exsit in provided opmeta`)
        }
    }

    /**
     * Method used by eval to dispatch function of each opcode in an expression.
     *
     * @param inputs - Items taken from stack as inputs of opcode functions.
     * @param opcode - The opcode enum to dispatch and run its function.
     * @param operand - The opcode's operand
     * @param data - Used as any additional data that opcode functions may need.
     * @returns Array of BigNumber that are returned by the opcode function
     */
    private async dispatch(
        inputs: BigNumber[],
        opcode: number,
        operand: number,
        data: InterpreterData
    ): Promise<BigNumber[]> {
        return await this.opConfigs[opcode].functionPointer.call(
            this,
            inputs,
            operand,
            data
        )
    }

    /**
     * Method to set expression for eval from expressions property
     * 
     * @param index - The index of the expression in expressions proprty
     */
    private setExpression(index: number) {
        const _stateConfig = this.expressions[index]
        this.state.constants.splice(-this.state.constants.length)
        this.state.sources.splice(-this.state.sources.length)
        for (let i = 0; i < _stateConfig.constants.length; i++) {
            this.state.constants.push(BigNumber.from(_stateConfig.constants[i]))
        }
        for (let i = 0; i < _stateConfig.sources.length; i++) {
            this.state.sources.push(
                arrayify(
                    _stateConfig.sources[i],
                    { allowMissingPrefix: true }
                )
            )
        }
    }

    /**
     * @public
     * Method to run eval for an expression of an instance of interpreter-ts. If no expression or index 
     * provided it will evaluate the last available expression in the instance's expressions array
     *
     * @param sender - The msg.sender, the address that calls the eval method of interpreter-ts
     * @param data - Used as any additional data that opcode functions may need
     * @param config - (optional) config for interpreter-ts eval
     * @returns - An object with array of BigNumbers as final stack items and block number and timestamp.
     */
    public async run(
        sender: string,
        data: RuntimeData,
        config?: RunConfig,
    ): Promise<EvalResult> {
        // default expression to run is the last expression
        let _index = this.expressions.length - 1

        // handle the expression to eval
        if (config?.expression) {
            if (typeof config.expression === 'number') {
                if (config.expression < this.expressions.length) _index = config.expression
            }
            else {
                this.addExpression(config.expression)
                _index++
            }
        }

        // eval if expression exists and error if it doesn't
        if (_index > -1) {

            // set the expression in state for eval
            this.setExpression(_index)

            // handle the block number and timestamp
            let _number, _timestamp;
            if (!config?.block) {
                _number = await this.provider.getBlockNumber(),
                _timestamp = (await this.provider.getBlock(_number)).timestamp
            }
            else {
                _number = config.block.number
                _timestamp = config.block.timestamp
            }

            // set the runtime overrides
            let overrides: OverrideFns = {}
            if (this.overrideFns) overrides = this.overrideFns
            if (config?.overrideFunctions) overrides = config.overrideFunctions
            deepFreeze(overrides)

            // construct the interpreter data obj
            const _interpreterData: InterpreterData = {
                provider: this.provider,
                voidSigner: this.voidSigner,
                stateConfig: this.expressions[_index],
                stack: [...this.state.stack],
                interpreterAddress: this.interpreterAddress,
                sender: sender.toLowerCase(),
                namespaceType: config?.namespaceType ?? NamespaceType.public,
                block: { number: _number, timestamp: _timestamp },
                opConfigs: this.opConfigs,
                overrides,
                storage: this.storage,
                mock: config?.simulationArgs?.mock,
                mode: config?.simulationArgs?.mode,
                simulationCount: config?.simulationArgs?.simulationCount,
                ...data
            } 

            // start eval and put the results into the lastStack
            this.lastStack.splice(-this.lastStack.length)
            await this.eval(
                _interpreterData, 
                _index, 
                overrides, 
                _number, 
                _timestamp, 
                config?.entrypoint
            )
            this.lastStack.push(
                ...this.state.stack.splice(-this.state.stack.length)
            )

            return {
                finalStack: [...this.lastStack],
                blockNumber: _number,
                blockTimestamp: _timestamp
            }
        }
        else throw new Error('no expression exists')
    }

    /**
     * @public
     * Method to add StateConfig to an instance of interpreter-ts
     * 
     * @param stateConfig - StateConfig to add
     */
    public addExpression(stateConfig: StateConfig) {
        this.expressions.push(...[stateConfig])
        deepFreeze(this.expressions[this.expressions.length - 1])
    }

    /**
     * @public
     * Method to add key/value item to a kvStorage object
     * 
     * @param storage - The storage obj to add the kv to under sender and namespace
     * @param sender - The msg.sender address, address that calls the eval method of interpreter
     * @param namespace - Namespace of the k/v storage, public namespaces are 0, and for private 
     * ones it is the address of owner of k/v storage
     * @param kv - The key/value pair
     */
    public static addStorage(
        storage: kvStorage,
        sender: string,
        namespace: string,
        kv: { key: BigNumber; value: BigNumber }
    ) {
        if (
            storage[sender.toLowerCase()] && 
            Object.keys(storage[sender.toLowerCase()]).length
        ) {
            const _index = Object.keys(storage[sender.toLowerCase()]).findIndex(
                v => v.toLowerCase() === namespace.toLowerCase()
            )
            if (_index < 0) storage[sender.toLowerCase()][namespace.toLowerCase()] = [kv]
            else {
                const _keyIndex = storage[sender.toLowerCase()][
                    namespace.toLowerCase()
                ].findIndex(
                    v => v.key.eq(kv.key)
                )
                if (_keyIndex < 0) storage[sender.toLowerCase()][
                    namespace.toLowerCase()
                ].push(kv)
                else storage[sender.toLowerCase()][
                    namespace.toLowerCase()
                ][_keyIndex].value = kv.value
            }
        }
        else storage[sender.toLowerCase()] = {
            [namespace.toLowerCase()]: [kv]
        }
    }

    /**
     * @public
     * Methdo to get the k/v items of a sender and namespace, undefined if doesn't exist
     * 
     * @param storage - The storage obj to add the kv to under sender and namespace
     * @param sender - The msg.sender address, address that calls the eval method of interpreter
     * @param namespace - Namespace of the k/v storage, public namespaces are 0, and for private 
     * ones it is the address of owner of k/v storage
     * @returns Array of key/value pairs, undefined if not found
     */
    public static getStorage(
        storage: kvStorage,
        sender: string,
        namespace: string
    ): { key: BigNumber; value: BigNumber}[] | undefined {
        try{
            return storage[sender.toLowerCase()][namespace.toLowerCase()]
        }
        catch {
            return undefined
        }
    }
}

