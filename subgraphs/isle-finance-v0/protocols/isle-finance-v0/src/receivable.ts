// import {
//   AdminChanged as AdminChangedEvent,
//   Approval as ApprovalEvent,
//   ApprovalForAll as ApprovalForAllEvent,
//   AssetBurned as AssetBurnedEvent,
//   AssetCreated as AssetCreatedEvent,
//   BeaconUpgraded as BeaconUpgradedEvent,
//   Initialized as InitializedEvent,
//   IsleGlobalsSet as IsleGlobalsSetEvent,
//   Transfer as TransferEvent,
//   TransferGovernor as TransferGovernorEvent,
//   Upgraded as UpgradedEvent,
// } from "../../../generated/Receivable/Receivable";
// import {
//   AssetBurned,
//   AssetCreated,
//   Transfer,
// } from "../../../generated/schema";

// export function handleAssetBurned(event: AssetBurnedEvent): void {
//   let entity = new AssetBurned(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.tokenId_ = event.params.tokenId_;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleAssetCreated(event: AssetCreatedEvent): void {
//   let entity = new AssetCreated(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.buyer_ = event.params.buyer_;
//   entity.seller_ = event.params.seller_;
//   entity.tokenId_ = event.params.tokenId_;
//   entity.faceAmount_ = event.params.faceAmount_;
//   entity.repaymentTimestamp_ = event.params.repaymentTimestamp_;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }


// export function handleTransfer(event: TransferEvent): void {
//   let entity = new Transfer(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.from = event.params.from;
//   entity.to = event.params.to;
//   entity.tokenId = event.params.tokenId;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }
