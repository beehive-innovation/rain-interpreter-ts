import { BigNumber } from "ethers";
import { kvStorage, OverrideFns, StateConfig, opConfig } from "../interpreter/types";

/**
 * @public
 * Valid token types
 */
export enum AssetType {
    erc20,
    erc721,
    erc1155
}

/**
 * @public
 * Valid ISale status
 */
export enum iSaleStatus {
    PENDING,
    ACTIVE,
    SUCCESS,
    FAIL,
}

/**
 * @public
 * Valid IVerify status
 */
export enum iVerifyStatus {
    nil,
    added,
    approved,
    banned
}

/**
 * @public
 * Defines where and how data is used for a simulation
 * - always: read the data from on-chain all the times, any mock data will be ignored entirely
 * - once: only read the data from on-chain the first time simulation runs, optionally store 
 * that in mock data and reaed from mock data for next simulation runs
 * - never: read from mock data all the times, and never try to read data from on-chain, if mock
 * data is not available simulation will throw error
 */
export type SimulationMode = 'always' | 'once' | 'never'

/**
 * @public
 * ERC20 token mock type
 */
export type MockERC20 = { 
    type: AssetType.erc20;
    address: BigNumber; 
    balance: BigNumber; 
    totalSupply: BigNumber; 
    decimals: number;
    snapshotId?: BigNumber;
}

/**
 * @public
 * ERC721 token mock type
 */
export type MockERC721 = { 
    type: AssetType.erc721;
    address: BigNumber;
    id: BigNumber 
}

/**
 * @public
 * ERC1155 token mock type
 */
export type MockERC1155 = { 
    type: AssetType.erc1155;
    address: BigNumber;
    balance: BigNumber;
    id: BigNumber;
} 

/**
 * @public
 * Ethers account mock type
 */
export type MockAccount = {
    [key: string]: any;
    /**
     * Address of this account
     */
    address: BigNumber;
    /**
     * All the assets this account holds
     */
    assets: ( MockERC20 | MockERC721 | MockERC1155 )[];
    /**
     * If this account is a chainlink oracle, else this property will be an empty object
     */
    chainlink: { updatedAt: number; answer: BigNumber } | undefined;
    /**
     * All the reports for this account of any iTier contract
     */
    iTier: { iTierContract: BigNumber; report: BigNumber }[];
    /**
     * All the vaults for this account of any iOrderbook contract
     */
    iOrderbook: { 
        iOrderbookContract: BigNumber; 
        vaults: { tokenAddress: BigNumber; vaultId: BigNumber; balance: BigNumber }[] 
    }[];
    /**
     * If this account is a iSale, else this property will be an empty object
     */
    iSale: { status: iSaleStatus; reserve: MockERC20; token: MockERC20 } | undefined;
    /**
     * All Verify statuses for this account
     */
    iVerify: { iVerifyContract: BigNumber; status: iVerifyStatus; timestamp: number }[];
}

/**
 * @public
 * All data and information needed to make mock data
 */
export type Mock = {
    /**
     * Current block number of of the simulation
     */
    blockNumber: number;
    /**
     * Current block timestamp of the simulation
     */
    blockTimestamp: number;
    /**
     * Available mocked accounts
     */
    accounts: MockAccount[];
}

/**
 * @public
 * Arguments for initiating a default simulation which uses Rainterpreter opcodes
 */
export type RainterpreterSimulationArgs = {
    /**
     * Address of the interpreter
     */
    interpreterAddress: string;
    /**
     * (optional) - The StateConfigs (expressions) to store in this interpreter-ts instance
     */
    stateConfigs?: StateConfig[];
    /**
     * (optional) - Available storage key/value
     */
    storages?: kvStorage;
}

/**
 * @public
 * Arguments for initiating a default simulation which uses any custom opcodes' closures
 */
export type CustomSimulationArgs = {
    /**
     * Address of the interpreter
     */
    interpreterAddress: string;
    /**
     * Array of functions with opcode enums and their inputs and outputs
     */
    functionPointers: opConfig[];
    /**
     * (optional) - The StateConfigs (expressions) to store in this interpreter-ts instance
     */
    stateConfigs?: StateConfig[];
    /**
     * (optional) - Available storage key/value
     */
    storages?: kvStorage;
    /**
     * (optional) - Functions to override the original opcodes' closures (functionPointers)
     */
    overrides?: OverrideFns;
}

/**
 * @public
 * Result of a successfull evaluated expression in a simulation that is available in run() callback signature
 */
export type SimulationResult = {
    /**
     * Address of the interpreter
     */
    interpreter: string;
    /**
     * The final items in the stack, i.e the result of the eval
     */
    finalStack: BigNumber[];
    /**
     * Block number of the eval
     */
    blockNumber: number;
    /**
     * Block timestamp of the eval
     */
    blockTimestamp: number;
    /**
     * The expression that evaluated
     */
    expression: StateConfig;
    /**
     * Index of the expression within the interpreter-ts instance expressions
     */
    index: number;
}

/**
 * @public
 * Result of a failed expression eval in a simulation that is available in run() callback signature
 */
export type SimulationError = {
    /**
     * Address of the interpreter
     */
    interpreter: string;
    /**
     * The error msg
     */
    error: string;
    /**
     * Block number of the eval
     */
    blockNumber?: number;
    /**
     * Block timestamp of the eval
     */
    blockTimestamp?: number;
    /**
     * The expression that evaluated
     */
    expression?: StateConfig;
    /**
     * Index of the expression within the interpreter-ts instance expressions
     */
    index?: number;
}
