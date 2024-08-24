import { Address, Bytes } from "@graphprotocol/graph-ts";
import {
  CollateralizationType,
  LendingType,
  Network,
  PermissionType,
  RiskType,
} from "../../../src/sdk/constants";
import { ProtocolData } from "../../../src/sdk/manager";

//////////////////////////////
/////        Time        /////
//////////////////////////////
export const DAYS_IN_MONTH = 30;

//////////////////////////////
///// Ethereum Addresses /////
//////////////////////////////

export const ZERO_ADDRESS = Address.fromString(
  "0x0000000000000000000000000000000000000000",
);

export const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
export const ETH_NAME = "Ether";
export const ETH_SYMBOL = "ETH";
export const ETH_DECIMALS = 18;
export const DEFAULT_DECIMALS = 18;
export const INTEREST_DECIMALS = 6;

// encourage address literals to be all lowercase to comparison errors when using strings.
// Global contracts
export const ISLE_GLOBALS = "0xd5175c76f5a129de4f53b0df5c878706e31910a1";
export const RECEIVABLE = "0x103d37376f312c0d3Fa4021351dc87811e0464b2";

// Pool-side contracts
export const POOL_ADDRESSES_PROVIDER =
  "0x454bc3c86ab284F2aa7a746733b23b46866fbedb";

/////////////////////////////
///// Protocol Specific /////
/////////////////////////////

export const PROTOCOL = "Isle Finance";
export const PROTOCOL_NAME = "Isle Finance";
export const PROTOCOL_SLUG = "isle-finance-v0";
export const PROTOCOL_NETWORK = Network._PLUME_TESTNET;
export const LENDING_TYPE = LendingType.POOLED;
export const LENDER_PERMISSION_TYPE = PermissionType.PERMISSIONED;
export const BORROWER_PERMISSION_TYPE = PermissionType.PERMISSIONED;
export const POOL_CREATOR_PERMISSION_TYPE = PermissionType.WHITELIST_ONLY; // Pool Admins
export const COLATERALIZATION_TYPE = CollateralizationType.OVER_COLLATERALIZED; // LTV at most 100%
export const RISK_TYPE = RiskType.ISOLATED;

export function getProtocolData(): ProtocolData {
  return new ProtocolData(
    Bytes.fromHexString(POOL_ADDRESSES_PROVIDER),
    PROTOCOL,
    PROTOCOL_NAME,
    PROTOCOL_SLUG,
    PROTOCOL_NETWORK,
    LENDING_TYPE,
    LENDER_PERMISSION_TYPE,
    BORROWER_PERMISSION_TYPE,
    POOL_CREATOR_PERMISSION_TYPE,
    COLATERALIZATION_TYPE,
    RISK_TYPE,
  );
}
