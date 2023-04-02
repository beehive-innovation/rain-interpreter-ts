import { BigNumber, ethers } from "ethers";
import { AssetType } from "../simulation/types";
import { scale18 } from "../lib/FixedPointMath";
import { AllStandardOps } from "./allStandardOps";
import { Simulation } from "../simulation/simulation";
import { paddedUInt160, paddedUInt256 } from "../utils";
import { InterpreterData, OverrideFns } from "../interpreter/types";
import { 
    AggregatorV3Interface__factory,
    ERC1155BurnableUpgradeable__factory,
    ERC20BurnableUpgradeable__factory, 
    ERC20SnapshotUpgradeable__factory, 
    ERC721BurnableUpgradeable__factory,
    IOrderBookV1__factory,
    ISaleV2__factory,
    ITierV2__factory,
    IVerifyV1__factory,
} from "../typechain";


/**
 * @public
 * All default Rainterpreter override closures for Simulation
 */
export const defaultOverrides: OverrideFns = {
    [AllStandardOps.CHAINLINK_PRICE]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _feed = _inputs[0]
        const _staleAfter = _inputs[1]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                const _chainlink = Simulation.getChainlink(_data.mock, _feed)
                if (_chainlink) {
                    if ((_data.block.timestamp - _chainlink.updatedAt) < _staleAfter.toNumber()) {
                        return [_chainlink.answer]
                    }
                    else throw new Error('STALE_PRICE')
                }
                else throw new Error('undefined chainlink oracle feed')
            }
            else throw new Error('undefined chainlink oracle feed')
        }
        else {
            const _chainlink = AggregatorV3Interface__factory.connect(
                paddedUInt160(_feed),
                voidSigner
            )
            const _result = await _chainlink.latestRoundData({ blockTag })
            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateChainlink(
                    _data.mock,
                    _feed,
                    _result[3].toNumber(),
                    _result[1],
                )
            }
            if (
                BigNumber.from(
                    (await _data.provider.getBlock(_data.blockNumber)).timestamp
                )
                    .sub(_result[3])
                    .lt(_staleAfter)
            ) {
                return [
                    scale18(
                        _result[1],
                        await _chainlink.decimals({ blockTag })
                    )
                ]
            }
            else throw new Error('STALE_PRICE')
        }
    },

    [AllStandardOps.ERC20_BALANCE_OF]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _account = _inputs[1]
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) return [Simulation.getBalance(_data.mock, _account, _contract)]
            else return [BigNumber.from(0)]
        }
        else {
            const erc20Contract_ = ERC20BurnableUpgradeable__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _balance = await erc20Contract_.balanceOf(
                paddedUInt160(_account),
                { blockTag }
            )
            if (_data.mode === 'once') {
                const _decimals = await erc20Contract_.decimals({ blockTag })
                const _totalSupply = await erc20Contract_.totalSupply({ blockTag })
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateMockAsset(
                    _data.mock, 
                    _account, 
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _totalSupply,
                        decimals: _decimals,
                        balance: _balance
                    }
                )
            }
            return [_balance]
        }
    },

    [AllStandardOps.ERC20_TOTAL_SUPPLY]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) return [Simulation.getTotalSupply(_data.mock, _contract)]
            else return [BigNumber.from(0)]
        }
        else {
            const erc20Contract_ = ERC20BurnableUpgradeable__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _totalSupply = await erc20Contract_.totalSupply({ blockTag })
            if (_data.mode === 'once') {
                const _decimals = await erc20Contract_.decimals({ blockTag })
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                } 
                Simulation.updateMockAsset(
                    _data.mock, 
                    _data.sender, 
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _totalSupply,
                        decimals: _decimals,
                        balance: BigNumber.from(0)
                    }
                )
            }
            return [_totalSupply]
        }
    },

    [AllStandardOps.ERC20_SNAPSHOT_BALANCE_OF_AT]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _snapshotId = _inputs[2]
        const _account = _inputs[1]
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) return [
                Simulation.getBalance(_data.mock, _account, _contract, _snapshotId)
            ]
            else return [BigNumber.from(0)]
        }
        else {
            const erc20SnapshotContract_ = ERC20SnapshotUpgradeable__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _balance = await erc20SnapshotContract_.balanceOfAt(
                paddedUInt160(_account),
                _snapshotId,
                { blockTag }
            )
            if (_data.mode === 'once') {
                const _decimals = await erc20SnapshotContract_.decimals({ blockTag })
                const _totalSupply = await erc20SnapshotContract_.totalSupply({ blockTag })
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateMockAsset(
                    _data.mock, 
                    _account, 
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _totalSupply,
                        decimals: _decimals,
                        balance: _balance,
                        snapshotId: _snapshotId
                    }
                )
            }
            return [_balance]
        }
    },

    [AllStandardOps.ERC20_SNAPSHOT_TOTAL_SUPPLY_AT]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _snapshotId = _inputs[1]
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) return [Simulation.getTotalSupply(_data.mock, _contract, _snapshotId)]
            else return [BigNumber.from(0)]
        }
        else {
            const erc20SnapshotContract_ = ERC20SnapshotUpgradeable__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _totalSupply = await erc20SnapshotContract_.totalSupply({ blockTag })
            if (_data.mode === 'once') {
                const _decimals = await erc20SnapshotContract_.decimals({ blockTag })
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                } 
                Simulation.updateMockAsset(
                    _data.mock, 
                    _data.sender, 
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _totalSupply,
                        decimals: _decimals,
                        balance: BigNumber.from(0),
                        snapshotId: _snapshotId
                    }
                )
            }
            return [_totalSupply]
        }
    },

    [AllStandardOps.IERC721_BALANCE_OF]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _account = _inputs[1]
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) return [Simulation.getBalance(_data.mock, _account, _contract)]
            else return [BigNumber.from(0)]
        }
        else {
            const erc721Contract_ = ERC721BurnableUpgradeable__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _balance = await erc721Contract_.balanceOf(
                paddedUInt160(_account),
                { blockTag }
            )
            if (_data.mode === 'once') {
                if (!_data.mock) {
                    _data.mock = {
                        blockNumber: _data.block.number,
                        blockTimestamp: _data.block.timestamp,
                        accounts: []
                    }
                    for (let i = 0; i < _balance.toNumber(); i++) {
                        Simulation.updateMockAsset(
                            _data.mock, 
                            _account, 
                            {
                                type: AssetType.erc721,
                                address: _contract,
                                id: BigNumber.from(i + 1)
                            }
                        )
                    }
                }
                else {
                    let _mockBalance = Simulation.getBalance(_data.mock, _account, _contract)
                    let _diff = (_balance.sub(_mockBalance)).toNumber()
                    if (_diff > 0) {
                        let count = 0
                        while (_diff > 0) {
                            Simulation.updateMockAsset(
                                _data.mock, 
                                _account, 
                                {
                                    type: AssetType.erc721,
                                    address: _contract,
                                    id: BigNumber.from(++count)
                                }
                            )
                            _mockBalance = Simulation.getBalance(_data.mock, _account, _contract)
                            _diff = (_balance.sub(_mockBalance)).toNumber()
                        }
                    }
                }
            }
            return [_balance]
        }
    },

    [AllStandardOps.IERC721_OWNER_OF]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _id = _inputs[1]
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                const _owner = Simulation.getOwner(_data.mock, _contract, _id)
                if (_owner) return [_owner]
                else throw new Error('no matching data found')
            }
            else throw new Error('no matching data found')
        }
        else {
            const erc721Contract_ = ERC721BurnableUpgradeable__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _owner = await erc721Contract_.ownerOf(
                paddedUInt160(_id),
                { blockTag }
            )
            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateMockAsset(
                    _data.mock, 
                    _owner, 
                    {
                        type: AssetType.erc721,
                        address: _contract,
                        id: _id
                    }
                )
            }
            return [BigNumber.from(_owner)]
        }
    },

    [AllStandardOps.IERC1155_BALANCE_OF]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _id = _inputs[2]
        const _account = _inputs[1]
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) return [
                Simulation.getBalance(_data.mock, _account, _contract, _id)
            ]
            else return [BigNumber.from(0)]
        }
        else {
            const erc1155SnapshotContract_ = ERC1155BurnableUpgradeable__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _balance = await erc1155SnapshotContract_.balanceOf(
                paddedUInt160(_account),
                _id,
                { blockTag }
            )
            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateMockAsset(
                    _data.mock, 
                    _account, 
                    {
                        type: AssetType.erc1155,
                        address: _contract,
                        balance: _balance,
                        id: _id
                    }
                )
            }
            return [_balance]
        }
    },

    [AllStandardOps.IERC1155_BALANCE_OF_BATCH]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _size = _operand
        const _contract = _inputs[0]
        const _ids = _inputs.splice(-_size)
        const _accounts = _inputs.splice(-_size)
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            const _balances: BigNumber[] = []
            if (_data.mock) {
                for (let i = 0; i < _size; i++) {
                    _balances.push(
                        Simulation.getBalance(_data.mock, _accounts[i], _contract, _ids[i])
                    )
                }
            }
            else for (let i = 0; i < _size; i++) _balances.push(BigNumber.from(0))
            return _balances
        }
        else {
            const erc1155SnapshotContract_ = ERC1155BurnableUpgradeable__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _accs: string[] = []
            for (let i = 0; i < _size; i++) _accs.push(paddedUInt160(_accounts[i]))
            const _balances = await erc1155SnapshotContract_.balanceOfBatch(
                _accs,
                _ids,
                { blockTag }
            )
            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                for (let i = 0; i < _size; i++) {
                    Simulation.updateMockAsset(
                        _data.mock, 
                        _accounts[i], 
                        {
                            type: AssetType.erc1155,
                            address: _contract,
                            balance: _balances[i],
                            id: _ids[i]
                        }
                    )
                }
            }
            return _balances
        }
    },

    [AllStandardOps.IORDERBOOKV1_VAULT_BALANCE]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _contract = _inputs[0]
        const _owner = _inputs[1]
        const _token = _inputs[2]
        const _vaultId = _inputs[3]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                return [Simulation.getVaultBalance(_data.mock, _owner, _contract, _token, _vaultId)]
            }
            else return [BigNumber.from(0)]
        }
        else {
            const _iOrderbook = IOrderBookV1__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _balance = await _iOrderbook.vaultBalance(
                paddedUInt160(_owner),
                paddedUInt160(_token),
                _vaultId,
                { blockTag }
            )
            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateVault(
                    _data.mock, 
                    _owner,
                    _contract,
                    _token,
                    _vaultId,
                    _balance
                )
            }
            return [_balance]
        }
    },

    [AllStandardOps.ISALEV2_REMAINING_TOKEN_INVENTORY]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                const _remaining = Simulation.getISale(_data.mock, _contract)?.token.balance
                if (_remaining) return [_remaining]
                else throw new Error('undefined iSale')
            }
            else throw new Error('undefined iSale')
        }
        else {
            const _iSale = ISaleV2__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _status = await _iSale.saleStatus({ blockTag })
            const _token = await _iSale.token({ blockTag })
            const _reserve = await _iSale.reserve({ blockTag })
            const _received = await _iSale.totalReserveReceived({ blockTag })
            const _remaining = await _iSale.remainingTokenInventory({ blockTag })

            const _tokenContract = ERC20BurnableUpgradeable__factory.connect(
                _token,
                voidSigner
            )
            const _reserveContract = ERC20BurnableUpgradeable__factory.connect(
                _reserve,
                voidSigner
            )
            const _tokenSupply = await _tokenContract.totalSupply()
            const _reserveSupply = await _reserveContract.totalSupply()
            const _reserveDecimals = await _reserveContract.decimals()

            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateISale(
                    _data.mock, 
                    _contract,
                    _status,
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _reserveSupply,
                        decimals: _reserveDecimals,
                        balance: _received
                    },
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _tokenSupply,
                        decimals: 18,
                        balance: _remaining
                    }
                )
            }
            return [_remaining]
        }
    },

    [AllStandardOps.ISALEV2_RESERVE]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                const _address = Simulation.getISale(_data.mock, _contract)?.reserve.address
                if (_address) return [_address]
                else throw new Error('undefined iSale')
            }
            else throw new Error('undefined iSale')
        }
        else {
            const _iSale = ISaleV2__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _status = await _iSale.saleStatus({ blockTag })
            const _token = await _iSale.token({ blockTag })
            const _reserve = await _iSale.reserve({ blockTag })
            const _received = await _iSale.totalReserveReceived({ blockTag })
            const _remaining = await _iSale.remainingTokenInventory({ blockTag })

            const _tokenContract = ERC20BurnableUpgradeable__factory.connect(
                _token,
                voidSigner
            )
            const _reserveContract = ERC20BurnableUpgradeable__factory.connect(
                _reserve,
                voidSigner
            )
            const _tokenSupply = await _tokenContract.totalSupply()
            const _reserveSupply = await _reserveContract.totalSupply()
            const _reserveDecimals = await _reserveContract.decimals()

            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateISale(
                    _data.mock, 
                    _contract,
                    _status,
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _reserveSupply,
                        decimals: _reserveDecimals,
                        balance: _received
                    },
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _tokenSupply,
                        decimals: 18,
                        balance: _remaining
                    }
                )
            }
            return [BigNumber.from(_reserve)]
        }
    },

    [AllStandardOps.ISALEV2_SALE_STATUS]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                const _status = Simulation.getISale(_data.mock, _contract)?.status
                if (_status) return [BigNumber.from(_status)]
                else throw new Error('undefined iSale')
            }
            else throw new Error('undefined iSale')
        }
        else {
            const _iSale = ISaleV2__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _status = await _iSale.saleStatus({ blockTag })
            const _token = await _iSale.token({ blockTag })
            const _reserve = await _iSale.reserve({ blockTag })
            const _received = await _iSale.totalReserveReceived({ blockTag })
            const _remaining = await _iSale.remainingTokenInventory({ blockTag })

            const _tokenContract = ERC20BurnableUpgradeable__factory.connect(
                _token,
                voidSigner
            )
            const _reserveContract = ERC20BurnableUpgradeable__factory.connect(
                _reserve,
                voidSigner
            )
            const _tokenSupply = await _tokenContract.totalSupply()
            const _reserveSupply = await _reserveContract.totalSupply()
            const _reserveDecimals = await _reserveContract.decimals()

            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateISale(
                    _data.mock, 
                    _contract,
                    _status,
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _reserveSupply,
                        decimals: _reserveDecimals,
                        balance: _received
                    },
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _tokenSupply,
                        decimals: 18,
                        balance: _remaining
                    }
                )
            }
            return [BigNumber.from(_status)]
        }
    },

    [AllStandardOps.ISALEV2_TOKEN]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                const _address = Simulation.getISale(_data.mock, _contract)?.token.address
                if (_address) return [_address]
                else throw new Error('undefined iSale')
            }
            else throw new Error('undefined iSale')
        }
        else {
            const _iSale = ISaleV2__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _status = await _iSale.saleStatus({ blockTag })
            const _token = await _iSale.token({ blockTag })
            const _reserve = await _iSale.reserve({ blockTag })
            const _received = await _iSale.totalReserveReceived({ blockTag })
            const _remaining = await _iSale.remainingTokenInventory({ blockTag })

            const _tokenContract = ERC20BurnableUpgradeable__factory.connect(
                _token,
                voidSigner
            )
            const _reserveContract = ERC20BurnableUpgradeable__factory.connect(
                _reserve,
                voidSigner
            )
            const _tokenSupply = await _tokenContract.totalSupply()
            const _reserveSupply = await _reserveContract.totalSupply()
            const _reserveDecimals = await _reserveContract.decimals()

            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateISale(
                    _data.mock, 
                    _contract,
                    _status,
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _reserveSupply,
                        decimals: _reserveDecimals,
                        balance: _received
                    },
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _tokenSupply,
                        decimals: 18,
                        balance: _remaining
                    }
                )
            }
            return [BigNumber.from(_token)]
        }
    },

    [AllStandardOps.ISALEV2_TOTAL_RESERVE_RECEIVED]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _contract = _inputs[0]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                const _received = Simulation.getISale(_data.mock, _contract)?.reserve.balance
                if (_received) return [_received]
                else throw new Error('undefined iSale')
            }
            else throw new Error('undefined iSale')
        }
        else {
            const _iSale = ISaleV2__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _status = await _iSale.saleStatus({ blockTag })
            const _token = await _iSale.token({ blockTag })
            const _reserve = await _iSale.reserve({ blockTag })
            const _received = await _iSale.totalReserveReceived({ blockTag })
            const _remaining = await _iSale.remainingTokenInventory({ blockTag })

            const _tokenContract = ERC20BurnableUpgradeable__factory.connect(
                _token,
                voidSigner
            )
            const _reserveContract = ERC20BurnableUpgradeable__factory.connect(
                _reserve,
                voidSigner
            )
            const _tokenSupply = await _tokenContract.totalSupply()
            const _reserveSupply = await _reserveContract.totalSupply()
            const _reserveDecimals = await _reserveContract.decimals()

            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateISale(
                    _data.mock, 
                    _contract,
                    _status,
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _reserveSupply,
                        decimals: _reserveDecimals,
                        balance: _received
                    },
                    {
                        type: AssetType.erc20,
                        address: _contract,
                        totalSupply: _tokenSupply,
                        decimals: 18,
                        balance: _remaining
                    }
                )
            }
            return [_received]
        }
    },

    [AllStandardOps.IVERIFYV1_ACCOUNT_STATUS_AT_TIME]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _contract = _inputs[0]
        const _account = _inputs[1]
        const _timestamp = _inputs[2]
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                return [BigNumber.from(
                    Simulation.getIVerifyStatusAtTime(
                        _data.mock,
                        _account, 
                        _contract, 
                        _timestamp.toNumber()
                    )
                )]
            }
            else return [BigNumber.from(0)]
        }
        else {
            const _iVerify = IVerifyV1__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _status = await _iVerify.accountStatusAtTime(
                paddedUInt160(_account),
                _timestamp,
                { blockTag }
            )
            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateIVerify(
                    _data.mock, 
                    _account,
                    _contract,
                    _status.toNumber(),
                    _data.block.timestamp
                )
            }
            return [_status]
        }
    },

    [AllStandardOps.ITIERV2_REPORT]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _contract = _inputs[0]
        const _account = _inputs[1]
        const _context = _inputs.splice(-_operand)
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                return [Simulation.getReport(_data.mock, _account, _contract)]
            }
            else return [BigNumber.from(0)]
        }
        else {
            const _iTier = ITierV2__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _report = await _iTier.report(
                paddedUInt160(_account),
                _context,
                { blockTag }
            )
            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateReport(
                    _data.mock, 
                    _account,
                    _contract,
                    _report
                )
            }
            return [_report]
        }
    },

    [AllStandardOps.ITIERV2_REPORT_TIME_FOR_TIER]: async(
        _inputs: BigNumber[],
        _operand: number,
        _data: InterpreterData
    ): Promise<BigNumber[]> => {
        const _contract = _inputs[0]
        const _account = _inputs[1]
        const _tier = _inputs[2]
        const _context = _inputs.splice(-_operand)
        const blockTag = _data.blockNumber
        const voidSigner = _data.voidSigner
        if (
            _data.mode === 'never' || 
            (_data.mode === 'once' && _data.simulationCount && _data.simulationCount > 0)
        ) {
            if (_data.mock) {
                const _rep = Simulation.getReport(_data.mock, _account, _contract)
                const _singleRep = paddedUInt256(_rep).substring(2).slice(
                    (8 - _tier.toNumber()) * 8,
                    ((8 - _tier.toNumber()) * 8) + 8
                )
                return [BigNumber.from(_singleRep)]
            }
            else return [ethers.constants.MaxUint256]
        }
        else {
            const _iTier = ITierV2__factory.connect(
                paddedUInt160(_contract),
                voidSigner
            )
            const _signleReport = await _iTier.reportTimeForTier(
                paddedUInt160(_account),
                _tier,
                _context,
                { blockTag }
            )
            const _report = await _iTier.reportTimeForTier(
                paddedUInt160(_account),
                _tier,
                _context,
                { blockTag }
            )
            if (_data.mode === 'once') {
                if (!_data.mock) _data.mock = {
                    blockNumber: _data.block.number,
                    blockTimestamp: _data.block.timestamp,
                    accounts: []
                }
                Simulation.updateReport(
                    _data.mock, 
                    _account,
                    _contract,
                    _report
                )
            }
            return [_signleReport]
        }
    },
}

