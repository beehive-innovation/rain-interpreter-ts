import { BigNumber } from "ethers";
import { InterpreterData, opClosure } from "../../../interpreter/types";
import { ERC1155BurnableUpgradeable__factory } from "../../../typechain";
import { paddedUInt160 } from "../../../utils";

/**
 * @public
 */
export const OpERC1155BalanceOfBatch: opClosure = async(
    _inputs: BigNumber[],
    _operand: number,
    _data: InterpreterData
): Promise<BigNumber[]> => {
    const item3_ = _inputs.splice(-(_operand + 1))
    const item2_ = _inputs.splice(-(_operand + 1))
    const item1_ = _inputs.pop()
    const blockTag = _data.blockNumber
    const voidSigner = _data.voidSigner
    if (
        item1_ &&
        item2_ &&
        item3_ &&
        item2_.length === item3_.length
    ) {
        const tokenIds_: BigNumber[] = []
        for (let i = 0; i < item3_.length; i++) {
            tokenIds_.push(BigNumber.from(item3_[i]))
        }
        const accounts_: string[] = []
        for (let i = 0; i < item2_.length; i++) {
            accounts_.push(paddedUInt160(item2_[i]))
        }
        const erc1155Address_ = paddedUInt160(item1_)
        try {
            const erc1155Contract_ = ERC1155BurnableUpgradeable__factory.connect(
                erc1155Address_,
                voidSigner
            )
            return (await erc1155Contract_.balanceOfBatch(accounts_, tokenIds_, { blockTag }))
        }
        catch(err) {
            throw new Error(`something went wrong, reason: ${err}`)
        }
    } 

    else throw new Error('Undefined stack variable')
}