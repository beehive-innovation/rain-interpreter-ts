import { OpChainlinkOraclePrice } from './ops/chainlink/OpChainlinkOraclePrice';
import { OpCall } from './ops/core/OpCall';
import { OpContext } from './ops/core/OpContext';
import { OpDebug } from './ops/core/OpDebug';
import { OpDoWhile } from './ops/core/OpDoWhile';
import { OpLoopN } from './ops/core/OpLoopN';
import { OpReadMemory } from './ops/core/OpReadMemory';
import { OpSet } from './ops/core/OpSet';
import { OpHash } from './ops/crypto/OpHash';
import { OpERC1155BalanceOf } from './ops/erc1155/OpERC1155BalanceOf';
import { OpERC1155BalanceOfBatch } from './ops/erc1155/OpERC1155BalanceOfBatch';
import { OpERC20BalanceOf } from './ops/erc20/OpERC20BalanceOf';
import { OpERC20TotalSupply } from './ops/erc20/OpERC20TotalSupply';
import { OpERC20SnapshotBalanceOfAt } from './ops/erc20/snapshot/OpERC20SnapshotBalanceOfAt';
import { OpERC20SnapshotTotalSupplyAt } from './ops/erc20/snapshot/OpERC20SnapshotTotalSupplyAt';
import { OpERC721BalanceOf } from './ops/erc721/OpERC721BalanceOf';
import { OpERC721OwnerOf } from './ops/erc721/OpERC721OwnerOf';
import { OpEnsure } from './ops/error/OpEnsure';
import { OpBlockNumber } from './ops/evm/OpBlockNumber';
import { OpCaller } from './ops/evm/OpCaller';
import { OpThisAddress } from './ops/evm/OpThisAddress';
import { OpTimestamp } from './ops/evm/OpTimestamp';
import { OpExplode32 } from './ops/list/OpExplode32';
import { OpScale18 } from './ops/math/fixedPoint/OpScale18';
import { OpScale18Div } from './ops/math/fixedPoint/OpScale18Div';
import { OpScale18Mul } from './ops/math/fixedPoint/OpScale18Mul';
import { OpScaleBy } from './ops/math/fixedPoint/OpScaleBy';
import { OpScaleN } from './ops/math/fixedPoint/OpScaleN';
import { OpAny } from './ops/math/logic/OpAny';
import { OpEagerIf } from './ops/math/logic/OpEagerIf';
import { OpEqualTo } from './ops/math/logic/OpEqualTo';
import { OpEvery } from './ops/math/logic/OpEvery';
import { OpGreaterThan } from './ops/math/logic/OpGreaterThan';
import { OpIsZero } from './ops/math/logic/OpIsZero';
import { OpLessThan } from './ops/math/logic/OpLessThan';
import { OpAdd } from './ops/math/OpAdd';
import { OpDiv } from './ops/math/OpDiv';
import { OpExp } from './ops/math/OpExp';
import { OpMax } from './ops/math/OpMax';
import { OpMin } from './ops/math/OpMin';
import { OpMod } from './ops/math/OpMod';
import { OpMul } from './ops/math/OpMul';
import { OpSub } from './ops/math/OpSub';
import { OpSaturatingAdd } from './ops/math/saturating/OpSaturatingAdd';
import { OpSaturatingMul } from './ops/math/saturating/OpSaturatingMul';
import { OpSaturatingSub } from './ops/math/saturating/OpSaturatingSub';
import { OpIOrderBookV1VaultBalance } from './ops/rain/IOrderBookV1/OpIOrderBookV1VaultBalance';
import { OpISaleV2RemainingTokenInventory } from './ops/rain/ISaleV2/OpISaleV2RemainingTokenInventory';
import { OpISaleV2Reserve } from './ops/rain/ISaleV2/OpISaleV2Reserve';
import { OpISaleV2SaleStatus } from './ops/rain/ISaleV2/OpISaleV2SaleStatus';
import { OpISaleV2Token } from './ops/rain/ISaleV2/OpISaleV2Token';
import { OpISaleV2TotalReserveReceived } from './ops/rain/ISaleV2/OpISaleV2TotalReserveReceived';
import { OpITierV2Report } from './ops/tier/OpITierV2Report';
import { OpITierV2ReportTimesForTier } from './ops/tier/OpITierV2ReportTimesForTier';
import { OpSaturatingDiff } from './ops/tier/OpSaturatingDiff';
import { OpSelectLte } from './ops/tier/OpSelectLte';
import { OpUpdateTimesForTierRange } from './ops/tier/OpUpdateTimesForTierRange';
import { OpGet } from './ops/core/OpGet';
import { AllStandardOps } from './allStandardOps';
import { opConfig } from '../interpreter/types';
import { OpIVerifyV1AccountStatusAtTime } from './ops/rain/IVerifyV1/OpIVerifyV1AccountStatusAtTime';
import { OpContextRow } from './ops/core/OpContextRow';
import { OpFoldContext } from './ops/core/OpFoldContext';


/**
 * @public
 * All Standard Rainterpreter OpMeta with Function Pointers
 */
export const rainterpreterOpConfigs: opConfig[] = [
    {
        enum: AllStandardOps.CHAINLINK_PRICE,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpChainlinkOraclePrice,
    },
    {
        enum: AllStandardOps.CALL,
        outputs: (_operand) => (_operand >> 4) & 15,
        inputs: (_operand) => _operand & 15,
        functionPointer: OpCall,
    },
    {
        enum: AllStandardOps.CONTEXT,
        outputs: (_operand) => 1,
        inputs: (_operand) => 0,
        functionPointer: OpContext,
    },
    {
        enum: AllStandardOps.CONTEXT_ROW,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpContextRow,
    },
    {
        enum: AllStandardOps.DEBUG,
        outputs: (_operand) => 0,
        inputs: (_operand) => 0,
        functionPointer: OpDebug,
    },
    {
        enum: AllStandardOps.DO_WHILE,
        outputs: (_operand) => (_operand & 15) + 1,
        inputs: (_operand) => _operand & 15 + 1,
        functionPointer: OpDoWhile,
    },
    {
        enum: AllStandardOps.FOLD_CONTEXT,
        outputs: (_operand) => _operand >> 12,
        inputs: (_operand) => _operand >> 12,
        functionPointer: OpFoldContext,
    },
    {
        enum: AllStandardOps.LOOP_N,
        outputs: (_operand) => (_operand >> 4) & 15,
        inputs: (_operand) => _operand & 15,
        functionPointer: OpLoopN,
    },
    {
        // @TODO: update
        enum: AllStandardOps.READ_MEMORY,
        outputs: (_operand) => 1,
        inputs: (_operand) => 0,
        functionPointer: OpReadMemory,
    },
    {
        enum: AllStandardOps.SET,
        outputs: (_operand) => 0,
        inputs: (_operand) => 2,
        functionPointer: OpSet,
    },
    {
        enum: AllStandardOps.HASH,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpHash,
    },
    {
        enum: AllStandardOps.ERC20_BALANCE_OF,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpERC20BalanceOf,
    },
    {
        enum: AllStandardOps.ERC20_TOTAL_SUPPLY,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpERC20TotalSupply,
    },
    {
        enum: AllStandardOps.ERC20_SNAPSHOT_BALANCE_OF_AT,
        outputs: (_operand) => 1,
        inputs: (_operand) => 3,
        functionPointer: OpERC20SnapshotBalanceOfAt,
    },
    {
        enum: AllStandardOps.ERC20_SNAPSHOT_TOTAL_SUPPLY_AT,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpERC20SnapshotTotalSupplyAt,
    },
    {
        enum: AllStandardOps.IERC721_BALANCE_OF,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpERC721BalanceOf,
    },
    {
        enum: AllStandardOps.IERC721_OWNER_OF,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpERC721OwnerOf,
    },
    {
        enum: AllStandardOps.IERC1155_BALANCE_OF,
        outputs: (_operand) => 1,
        inputs: (_operand) => 3,
        functionPointer: OpERC1155BalanceOf,
    },
    {
        enum: AllStandardOps.IERC1155_BALANCE_OF_BATCH,
        outputs: (_operand) => _operand,
        inputs: (_operand) => (_operand * 2) + 1,
        functionPointer: OpERC1155BalanceOfBatch,
    },
    {
        enum: AllStandardOps.BLOCK_NUMBER,
        outputs: (_operand) => 1,
        inputs: (_operand) => 0,
        functionPointer: OpBlockNumber,
    },
    {
        enum: AllStandardOps.CALLER,
        outputs: (_operand) => 1,
        inputs: (_operand) => 0,
        functionPointer: OpCaller,
    },
    {
        enum: AllStandardOps.THIS_ADDRESS,
        outputs: (_operand) => 1,
        inputs: (_operand) => 0,
        functionPointer: OpThisAddress,
    },
    {
        enum: AllStandardOps.BLOCK_TIMESTAMP,
        outputs: (_operand) => 1,
        inputs: (_operand) => 0,
        functionPointer: OpTimestamp,
    },
    {
        enum: AllStandardOps.ENSURE,
        outputs: (_operand) => 0,
        inputs: (_operand) => _operand,
        functionPointer: OpEnsure,
    },
    {
        enum: AllStandardOps.SCALE18,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpScale18,
    },
    {
        enum: AllStandardOps.SCALE18_DIV,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpScale18Div,
    },
    {
        enum: AllStandardOps.SCALE18_MUL,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpScale18Mul,
    },
    {
        enum: AllStandardOps.SCALE_BY,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpScaleBy,
    },
    {
        enum: AllStandardOps.SCALEN,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpScaleN,
    },
    {
        enum: AllStandardOps.EXPLODE32,
        outputs: (_operand) => 8,
        inputs: (_operand) => 1,
        functionPointer: OpExplode32,
    },
    {
        enum: AllStandardOps.ANY,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpAny,
    },
    {
        enum: AllStandardOps.EAGER_IF,
        outputs: (_operand) => 1,
        inputs: (_operand) => 3,
        functionPointer: OpEagerIf,
    },
    {
        enum: AllStandardOps.EQUAL_TO,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpEqualTo,
    },
    {
        enum: AllStandardOps.EVERY,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpEvery,
    },
    {
        enum: AllStandardOps.GREATER_THAN,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpGreaterThan,
    },
    {
        enum: AllStandardOps.ISZERO,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpIsZero,
    },
    {
        enum: AllStandardOps.LESS_THAN,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpLessThan,
    },
    {
        enum: AllStandardOps.SATURATING_ADD,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpSaturatingAdd,
    },
    {
        enum: AllStandardOps.SATURATING_MUL,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpSaturatingMul,
    },
    {
        enum: AllStandardOps.SATURATING_SUB,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpSaturatingSub,
    },
    {
        enum: AllStandardOps.ADD,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpAdd,
    },
    {
        enum: AllStandardOps.DIV,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpDiv,
    },
    {
        enum: AllStandardOps.EXP,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpExp,
    },
    {
        enum: AllStandardOps.MAX,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpMax,
    },
    {
        enum: AllStandardOps.MIN,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpMin,
    },
    {
        enum: AllStandardOps.MOD,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpMod,
    },
    {
        enum: AllStandardOps.MUL,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpMul,
    },
    {
        enum: AllStandardOps.SUB,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand,
        functionPointer: OpSub,
    },
    {
        enum: AllStandardOps.IORDERBOOKV1_VAULT_BALANCE,
        outputs: (_operand) => 1,
        inputs: (_operand) => 4,
        functionPointer: OpIOrderBookV1VaultBalance,
    },
    {
        enum: AllStandardOps.ISALEV2_REMAINING_TOKEN_INVENTORY,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpISaleV2RemainingTokenInventory,
    },
    {
        enum: AllStandardOps.ISALEV2_RESERVE,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpISaleV2Reserve,
    },
    {
        enum: AllStandardOps.ISALEV2_SALE_STATUS,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpISaleV2SaleStatus,
    },
    {
        enum: AllStandardOps.ISALEV2_TOKEN,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpISaleV2Token,
    },
    {
        enum: AllStandardOps.ISALEV2_TOTAL_RESERVE_RECEIVED,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpISaleV2TotalReserveReceived,
    },
    {
        enum: AllStandardOps.IVERIFYV1_ACCOUNT_STATUS_AT_TIME,
        outputs: (_operand) => 1,
        inputs: (_operand) => 3,
        functionPointer: OpIVerifyV1AccountStatusAtTime,
    },
    {
        enum: AllStandardOps.ITIERV2_REPORT,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand + 2,
        functionPointer: OpITierV2Report,
    },
    {
        enum: AllStandardOps.ITIERV2_REPORT_TIME_FOR_TIER,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand + 3,
        functionPointer: OpITierV2ReportTimesForTier,
    },
    {
        enum: AllStandardOps.SATURATING_DIFF,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpSaturatingDiff,
    },
    {
        enum: AllStandardOps.SELECT_LTE,
        outputs: (_operand) => 1,
        inputs: (_operand) => _operand & 256,
        functionPointer: OpSelectLte,
    },
    {
        enum: AllStandardOps.UPDATE_TIMES_FOR_TIER_RANGE,
        outputs: (_operand) => 1,
        inputs: (_operand) => 2,
        functionPointer: OpUpdateTimesForTierRange,
    },
    {
        enum: AllStandardOps.GET,
        outputs: (_operand) => 1,
        inputs: (_operand) => 1,
        functionPointer: OpGet,
    }
]
