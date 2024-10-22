import {
  Address,
  numberToHex,
  encodeAbiParameters,
  parseAbiParameters,
  keccak256,
  pad,
  toHex,
  Hex,
  concat,
} from "viem";
import { RawUserOperation, UserOperation } from "./types";

  /**
   * For accountGasLimits, gas1 represents callGasLimit and gas2 represents verificationGasLimit.
   * For gasFees, gas1 represents maxFeePerGas and gas2 represents maxPriorityFeePerGas.
   */
export const packGas = (gas1: bigint, gas2: bigint):Hex => { 

  return concat([
    pad(toHex(gas1), { size: 16 }),
    pad(toHex(gas2), { size: 16 })
  ]);
}


export const calculateUserOpHash = (
  userop: UserOperation,
  entryPoint: Address,
  chainId: number,
) => {
  const packed = encodeAbiParameters(
    parseAbiParameters(
      "address, uint256, bytes32, bytes32, bytes32, uint256, bytes32, bytes32",
    ),
    [
      userop.sender,
      userop.nonce,
      keccak256(userop.initCode),
      keccak256(userop.callData),
      userop.accountGasLimits,
      userop.preVerificationGas,
      userop.gasFees,
      keccak256(userop.paymasterAndData),
    ],
  );

  const enc = encodeAbiParameters(
    parseAbiParameters("bytes32, address, uint256"),
    [keccak256(packed), entryPoint, BigInt(chainId)],
  );

  return keccak256(enc);
};

export const toRawUserOperation = (userop: UserOperation): RawUserOperation => {
  return {
    sender: userop.sender,
    nonce: numberToHex(userop.nonce),
    initCode: userop.initCode,
    callData: userop.callData,
    accountGasLimits: userop.accountGasLimits,
    preVerificationGas: numberToHex(userop.preVerificationGas),
    gasFees: userop.gasFees,
    paymasterAndData: userop.paymasterAndData,
    signature: userop.signature,
  };
};
