import { Provider } from '@ethersproject/abstract-provider'
import { BigNumber, BigNumberish, BytesLike, VoidSigner } from "ethers";
import { Mock, SimulationMode } from "../simulation/types";


/**
 * @public
 * Type of valid parsed expression, i.e. compiled bytes
 */
export type StateConfig = {
    /**
     * Sources verbatim.
     */
    sources: BytesLike[];
    /**
     * Constants verbatim.
     */
    constants: BigNumberish[];
}

/**
 * @public
 * The eval state of current expression of interpreter-ts
 */
export interface State {
    /**
     * The interpreter-ts's stack.
     */
    readonly stack: BigNumber[];
    /**
     * The expression's constants that is being evaluated
     */
    readonly constants: BigNumber[];
    /**
     * The expression's sources that is being evaluated
     */
    readonly sources: Uint8Array[];
}

/**
 * @public
 * Defines the namespace type for each expression that is being evaluated
 */
export enum NamespaceType {
    /**
     * Public namespace which is always 0
     */
    public,
    /**
     * Private namespaces which are mapped by an address
     */
    private,
    /**
     * Means there is no storage access available for a sender
     */
    none
}

/**
 * @public
 * Type os interpreter-ts storage obj which holds key/value pairs mapped 
 * by sender and namespace addresses
 */
export type kvStorage = {
    [sender: string]: {
        [namespace: string]: {
            key: BigNumber;
            value: BigNumber;
        }[]
    }
}

/**
 * @public
 * Reserved properties and values available to opcodes' closures at runtime, these will 
 * stay intact during eval with some exceptions which are 'storage' and 'mock' that can 
 * reassigned and/or modified during eval
 */
export type ReservedData = {
    /**
     * The ethersjs provider of this instance
     */
    provider: Provider;
    /**
     * The ethersjs VoidSigner of this instance
     */
    voidSigner: VoidSigner;
    /**
     * The current StateConfig that is being evaluated, i.e constants and sources
     */
    stateConfig: StateConfig;
    /**
     * The current stack, with all items inside at current moment
     */
    stack: BigNumber[];
    /**
     * The interpreter address of this instance
     */
    interpreterAddress: string;
    /**
     * The sender (msg.sender) address of current eval
     */
    sender: string;
    /**
     * Type of namespace of current sender and eval, default type is public
     */
    namespaceType: NamespaceType;
    /**
     * An object that consists of number and timestamp properties
     */
    block: { number: number; timestamp: number};
    /**
     * opcodes' configs, ie the opcode enum, input, output and closure
     */
    opConfigs: opConfig[]
    /**
     * The OverrideFns, functions that override original opcode functions at runtime
     */
    overrides: OverrideFns;
    /**
     * The key/value storage of this instance which can be reassigned and modified 
     * during eval, e.g SET
     */
    storage: kvStorage;
    /**
     * The simulation mode i.e where and how to get the necessary data, modes are always, once or never
     */
    mode?: SimulationMode;
    /**
     * The simulation mock data object, can be reassigned and modified during eval
     */
    mock?: Mock;
    /**
     * The loop index of a simulation, i.e simulation repeat count. Any assigned value by user at 
     * function call will be ignored as this value is handled internally by Simulation and would be
     * available to opcodes. 
     */
    simulationCount?: number
}

/**
 * @public
 * Additional data available for opcodes' closures during eval, some names are reserved 
 * as they are necessary for any eval such as context and namespace
 */
export type RuntimeData = {
    [key: string]: any;
    /**
     * All context values (for CONTEXT opcode) goes here as a 2D array of BigNumberish values
     */
    context: BigNumber[][];
    /**
     * Namespace address, The private k/v storage is namespaced by this address, will be ignored 
     * for 'public' and 'none' namespace types
     */
    namespace?: string;
}

/**
 * @public
 * All data and values available to opcodes' closures during eval, consists of Reserved and Runtime data
 */
export type InterpreterData = ReservedData & RuntimeData

/**
 * @public
 * Type of an interpreter-ts opcode function (closure)
 */
export type opClosure = {(
        /**
         * inputs of the opcode function
         */
        _inputs: BigNumber[],
        /**
         * operand of the opcode which tells the opcode what to do
         */
        _operand: number, 
        /**
         * All data and values that opcode may need to function as intended
         */
        _data: InterpreterData
    ): BigNumber[] | Promise<BigNumber[]>
}

/**
 * @public
 * All needed for interpreter-ts to eval an opcode
 */
export type opConfig = {
    /**
     * Opcode's enum
     */
    enum: number;
    /**
     * number of items an opcode will take from stack
     * @param _operand - operand to calculate the inputs from
     * @returns number of items to take from stack
     */
    inputs: (_operand: number) => number;
    /**
     * number of items an opcode will put back into the stack
     * @param _operand - operand to calculate the outputs from
     * @returns number of items to put back into the stack
     */
    outputs: (_operand: number) => number;
    /**
     * Opcode's function
     */
    functionPointer: opClosure;
}

/**
* @public
* Functions (closures) to override opcodes' original functions
*/
export type OverrideFns = {
    [key: number]: opClosure
}

/**
 * @public
 * Configurations and options for eval
 */
export type RunConfig = {
    /**
     * The expression to eval or its index in interpreter-ts expressions array
     */
    expression?: StateConfig | number,
    /**
     * Type of the namespace of this eval, defines how storage would be accessible by GET/SET
     */
    namespaceType?: NamespaceType,
    /**
     * Block number and timestamp that this eval will be based on
     */
    block?: { number: number; timestamp: number},
    /**
     * The expression's sources index to eval, default is 0
     */
    entrypoint?: number,
    /**
     * Functions to override the original opcodes' closures
     */
    overrideFunctions?: OverrideFns
    /**
     * Arguments passed by Simulation class internally and are available in 'data' for opcode closures to use
     */
    simulationArgs?: {
        /**
        * The simulation mode i.e where and how to get the necessary data, modes are always, once or never
        */
        mode: SimulationMode;
        /**
         * The loop index of a simulation, i.e simulation repeat count. this value is handled internally by 
         * Simulation and would be available to opcodes. 
         */
        simulationCount: number
        /**
         * The simulation mock data object, can be reassigned and modified during eval
         */
        mock?: Mock;
    }
}

/**
 * @public
 * Results of evaluated expression by RainInterpreterTs at a specific block number and timestamp
 */
export type EvalResult = {
    /**
     * The final stack items, ie the result fo eval
     */
    finalStack: BigNumber[];
    /**
     * The block number this eval executed at
     */
    blockNumber: number;
    /**
     * The block timestamp this eval executed at
     */
    blockTimestamp: number; 
}