import { zeroAddress } from "viem";
import { UserOperation } from "./types";
import { EntryPoint } from "./abi";

export const CONTRACT_ABI = EntryPoint;
export const DEFAULT_ADDRESS = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
export const DEFAULT_USEROP: UserOperation = {
  sender: zeroAddress,
  nonce: 0n,
  initCode: "0x",
  callData: "0x",
  accountGasLimits: "0x",
  preVerificationGas:0n,
  gasFees:"0x",
  paymasterAndData: "0x",
  signature: "0x",
};
