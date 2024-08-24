// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class ConfigurationUpdated extends ethereum.Event {
  get params(): ConfigurationUpdated__Params {
    return new ConfigurationUpdated__Params(this);
  }
}

export class ConfigurationUpdated__Params {
  _event: ConfigurationUpdated;

  constructor(event: ConfigurationUpdated) {
    this._event = event;
  }

  get configId_(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get initialCycleId_(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get initialCycleTime_(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get cycleDuration_(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get windowDuration_(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class Initialized extends ethereum.Event {
  get params(): Initialized__Params {
    return new Initialized__Params(this);
  }
}

export class Initialized__Params {
  _event: Initialized;

  constructor(event: Initialized) {
    this._event = event;
  }

  get poolAddressesProvider_(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get cycleDuration_(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get windowDuration_(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class WithdrawalCancelled extends ethereum.Event {
  get params(): WithdrawalCancelled__Params {
    return new WithdrawalCancelled__Params(this);
  }
}

export class WithdrawalCancelled__Params {
  _event: WithdrawalCancelled;

  constructor(event: WithdrawalCancelled) {
    this._event = event;
  }

  get account_(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class WithdrawalProcessed extends ethereum.Event {
  get params(): WithdrawalProcessed__Params {
    return new WithdrawalProcessed__Params(this);
  }
}

export class WithdrawalProcessed__Params {
  _event: WithdrawalProcessed;

  constructor(event: WithdrawalProcessed) {
    this._event = event;
  }

  get account_(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get sharesToRedeem_(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get assetsToWithdraw_(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class WithdrawalUpdated extends ethereum.Event {
  get params(): WithdrawalUpdated__Params {
    return new WithdrawalUpdated__Params(this);
  }
}

export class WithdrawalUpdated__Params {
  _event: WithdrawalUpdated;

  constructor(event: WithdrawalUpdated) {
    this._event = event;
  }

  get account_(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get lockedShares_(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get windowStart_(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get windowEnd_(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class WithdrawalManager__getConfigAtIdResultConfig_Struct extends ethereum.Tuple {
  get initialCycleId(): BigInt {
    return this[0].toBigInt();
  }

  get initialCycleTime(): BigInt {
    return this[1].toBigInt();
  }

  get cycleDuration(): BigInt {
    return this[2].toBigInt();
  }

  get windowDuration(): BigInt {
    return this[3].toBigInt();
  }
}

export class WithdrawalManager__getCurrentConfigResultConfig_Struct extends ethereum.Tuple {
  get initialCycleId(): BigInt {
    return this[0].toBigInt();
  }

  get initialCycleTime(): BigInt {
    return this[1].toBigInt();
  }

  get cycleDuration(): BigInt {
    return this[2].toBigInt();
  }

  get windowDuration(): BigInt {
    return this[3].toBigInt();
  }
}

export class WithdrawalManager__getCycleConfigResultConfig_Struct extends ethereum.Tuple {
  get initialCycleId(): BigInt {
    return this[0].toBigInt();
  }

  get initialCycleTime(): BigInt {
    return this[1].toBigInt();
  }

  get cycleDuration(): BigInt {
    return this[2].toBigInt();
  }

  get windowDuration(): BigInt {
    return this[3].toBigInt();
  }
}

export class WithdrawalManager__getRedeemableAmountsResult {
  value0: BigInt;
  value1: BigInt;
  value2: boolean;

  constructor(value0: BigInt, value1: BigInt, value2: boolean) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromBoolean(this.value2));
    return map;
  }

  getRedeemableShares_(): BigInt {
    return this.value0;
  }

  getResultingAssets_(): BigInt {
    return this.value1;
  }

  getPartialLiquidity_(): boolean {
    return this.value2;
  }
}

export class WithdrawalManager__getWindowAtIdResult {
  value0: BigInt;
  value1: BigInt;

  constructor(value0: BigInt, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  getWindowStart_(): BigInt {
    return this.value0;
  }

  getWindowEnd_(): BigInt {
    return this.value1;
  }
}

export class WithdrawalManager__previewRedeemResult {
  value0: BigInt;
  value1: BigInt;

  constructor(value0: BigInt, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  getRedeemableShares_(): BigInt {
    return this.value0;
  }

  getResultingAssets_(): BigInt {
    return this.value1;
  }
}

export class WithdrawalManager__processExitResult {
  value0: BigInt;
  value1: BigInt;

  constructor(value0: BigInt, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }

  getRedeemableShares_(): BigInt {
    return this.value0;
  }

  getResultingAssets_(): BigInt {
    return this.value1;
  }
}

export class WithdrawalManager extends ethereum.SmartContract {
  static bind(address: Address): WithdrawalManager {
    return new WithdrawalManager("WithdrawalManager", address);
  }

  ADDRESSES_PROVIDER(): Address {
    let result = super.call(
      "ADDRESSES_PROVIDER",
      "ADDRESSES_PROVIDER():(address)",
      [],
    );

    return result[0].toAddress();
  }

  try_ADDRESSES_PROVIDER(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "ADDRESSES_PROVIDER",
      "ADDRESSES_PROVIDER():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  WITHDRAWAL_MANAGER_REVISION(): BigInt {
    let result = super.call(
      "WITHDRAWAL_MANAGER_REVISION",
      "WITHDRAWAL_MANAGER_REVISION():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_WITHDRAWAL_MANAGER_REVISION(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "WITHDRAWAL_MANAGER_REVISION",
      "WITHDRAWAL_MANAGER_REVISION():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  exitCycleId(param0: Address): BigInt {
    let result = super.call("exitCycleId", "exitCycleId(address):(uint256)", [
      ethereum.Value.fromAddress(param0),
    ]);

    return result[0].toBigInt();
  }

  try_exitCycleId(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "exitCycleId",
      "exitCycleId(address):(uint256)",
      [ethereum.Value.fromAddress(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getConfigAtId(
    cycleId_: BigInt,
  ): WithdrawalManager__getConfigAtIdResultConfig_Struct {
    let result = super.call(
      "getConfigAtId",
      "getConfigAtId(uint256):((uint64,uint64,uint64,uint64))",
      [ethereum.Value.fromUnsignedBigInt(cycleId_)],
    );

    return changetype<WithdrawalManager__getConfigAtIdResultConfig_Struct>(
      result[0].toTuple(),
    );
  }

  try_getConfigAtId(
    cycleId_: BigInt,
  ): ethereum.CallResult<WithdrawalManager__getConfigAtIdResultConfig_Struct> {
    let result = super.tryCall(
      "getConfigAtId",
      "getConfigAtId(uint256):((uint64,uint64,uint64,uint64))",
      [ethereum.Value.fromUnsignedBigInt(cycleId_)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<WithdrawalManager__getConfigAtIdResultConfig_Struct>(
        value[0].toTuple(),
      ),
    );
  }

  getCurrentConfig(): WithdrawalManager__getCurrentConfigResultConfig_Struct {
    let result = super.call(
      "getCurrentConfig",
      "getCurrentConfig():((uint64,uint64,uint64,uint64))",
      [],
    );

    return changetype<WithdrawalManager__getCurrentConfigResultConfig_Struct>(
      result[0].toTuple(),
    );
  }

  try_getCurrentConfig(): ethereum.CallResult<WithdrawalManager__getCurrentConfigResultConfig_Struct> {
    let result = super.tryCall(
      "getCurrentConfig",
      "getCurrentConfig():((uint64,uint64,uint64,uint64))",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<WithdrawalManager__getCurrentConfigResultConfig_Struct>(
        value[0].toTuple(),
      ),
    );
  }

  getCurrentCycleId(): BigInt {
    let result = super.call(
      "getCurrentCycleId",
      "getCurrentCycleId():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_getCurrentCycleId(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getCurrentCycleId",
      "getCurrentCycleId():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getCycleConfig(
    configId_: BigInt,
  ): WithdrawalManager__getCycleConfigResultConfig_Struct {
    let result = super.call(
      "getCycleConfig",
      "getCycleConfig(uint256):((uint64,uint64,uint64,uint64))",
      [ethereum.Value.fromUnsignedBigInt(configId_)],
    );

    return changetype<WithdrawalManager__getCycleConfigResultConfig_Struct>(
      result[0].toTuple(),
    );
  }

  try_getCycleConfig(
    configId_: BigInt,
  ): ethereum.CallResult<WithdrawalManager__getCycleConfigResultConfig_Struct> {
    let result = super.tryCall(
      "getCycleConfig",
      "getCycleConfig(uint256):((uint64,uint64,uint64,uint64))",
      [ethereum.Value.fromUnsignedBigInt(configId_)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<WithdrawalManager__getCycleConfigResultConfig_Struct>(
        value[0].toTuple(),
      ),
    );
  }

  getRedeemableAmounts(
    lockedShares_: BigInt,
    owner_: Address,
  ): WithdrawalManager__getRedeemableAmountsResult {
    let result = super.call(
      "getRedeemableAmounts",
      "getRedeemableAmounts(uint256,address):(uint256,uint256,bool)",
      [
        ethereum.Value.fromUnsignedBigInt(lockedShares_),
        ethereum.Value.fromAddress(owner_),
      ],
    );

    return new WithdrawalManager__getRedeemableAmountsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBoolean(),
    );
  }

  try_getRedeemableAmounts(
    lockedShares_: BigInt,
    owner_: Address,
  ): ethereum.CallResult<WithdrawalManager__getRedeemableAmountsResult> {
    let result = super.tryCall(
      "getRedeemableAmounts",
      "getRedeemableAmounts(uint256,address):(uint256,uint256,bool)",
      [
        ethereum.Value.fromUnsignedBigInt(lockedShares_),
        ethereum.Value.fromAddress(owner_),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new WithdrawalManager__getRedeemableAmountsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBoolean(),
      ),
    );
  }

  getWindowAtId(cycleId_: BigInt): WithdrawalManager__getWindowAtIdResult {
    let result = super.call(
      "getWindowAtId",
      "getWindowAtId(uint256):(uint64,uint64)",
      [ethereum.Value.fromUnsignedBigInt(cycleId_)],
    );

    return new WithdrawalManager__getWindowAtIdResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
    );
  }

  try_getWindowAtId(
    cycleId_: BigInt,
  ): ethereum.CallResult<WithdrawalManager__getWindowAtIdResult> {
    let result = super.tryCall(
      "getWindowAtId",
      "getWindowAtId(uint256):(uint64,uint64)",
      [ethereum.Value.fromUnsignedBigInt(cycleId_)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new WithdrawalManager__getWindowAtIdResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
      ),
    );
  }

  getWindowStart(cycleId_: BigInt): BigInt {
    let result = super.call(
      "getWindowStart",
      "getWindowStart(uint256):(uint64)",
      [ethereum.Value.fromUnsignedBigInt(cycleId_)],
    );

    return result[0].toBigInt();
  }

  try_getWindowStart(cycleId_: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getWindowStart",
      "getWindowStart(uint256):(uint64)",
      [ethereum.Value.fromUnsignedBigInt(cycleId_)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  isInExitWindow(owner_: Address): boolean {
    let result = super.call(
      "isInExitWindow",
      "isInExitWindow(address):(bool)",
      [ethereum.Value.fromAddress(owner_)],
    );

    return result[0].toBoolean();
  }

  try_isInExitWindow(owner_: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isInExitWindow",
      "isInExitWindow(address):(bool)",
      [ethereum.Value.fromAddress(owner_)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  latestConfigId(): BigInt {
    let result = super.call("latestConfigId", "latestConfigId():(uint256)", []);

    return result[0].toBigInt();
  }

  try_latestConfigId(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "latestConfigId",
      "latestConfigId():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  lockedLiquidity(): BigInt {
    let result = super.call(
      "lockedLiquidity",
      "lockedLiquidity():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_lockedLiquidity(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "lockedLiquidity",
      "lockedLiquidity():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  lockedShares(param0: Address): BigInt {
    let result = super.call("lockedShares", "lockedShares(address):(uint256)", [
      ethereum.Value.fromAddress(param0),
    ]);

    return result[0].toBigInt();
  }

  try_lockedShares(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "lockedShares",
      "lockedShares(address):(uint256)",
      [ethereum.Value.fromAddress(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  previewRedeem(
    owner_: Address,
    shares_: BigInt,
  ): WithdrawalManager__previewRedeemResult {
    let result = super.call(
      "previewRedeem",
      "previewRedeem(address,uint256):(uint256,uint256)",
      [
        ethereum.Value.fromAddress(owner_),
        ethereum.Value.fromUnsignedBigInt(shares_),
      ],
    );

    return new WithdrawalManager__previewRedeemResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
    );
  }

  try_previewRedeem(
    owner_: Address,
    shares_: BigInt,
  ): ethereum.CallResult<WithdrawalManager__previewRedeemResult> {
    let result = super.tryCall(
      "previewRedeem",
      "previewRedeem(address,uint256):(uint256,uint256)",
      [
        ethereum.Value.fromAddress(owner_),
        ethereum.Value.fromUnsignedBigInt(shares_),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new WithdrawalManager__previewRedeemResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
      ),
    );
  }

  processExit(
    requestedShares_: BigInt,
    owner_: Address,
  ): WithdrawalManager__processExitResult {
    let result = super.call(
      "processExit",
      "processExit(uint256,address):(uint256,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(requestedShares_),
        ethereum.Value.fromAddress(owner_),
      ],
    );

    return new WithdrawalManager__processExitResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
    );
  }

  try_processExit(
    requestedShares_: BigInt,
    owner_: Address,
  ): ethereum.CallResult<WithdrawalManager__processExitResult> {
    let result = super.tryCall(
      "processExit",
      "processExit(uint256,address):(uint256,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(requestedShares_),
        ethereum.Value.fromAddress(owner_),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new WithdrawalManager__processExitResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
      ),
    );
  }

  removeShares(shares_: BigInt, owner_: Address): BigInt {
    let result = super.call(
      "removeShares",
      "removeShares(uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(shares_),
        ethereum.Value.fromAddress(owner_),
      ],
    );

    return result[0].toBigInt();
  }

  try_removeShares(
    shares_: BigInt,
    owner_: Address,
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "removeShares",
      "removeShares(uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(shares_),
        ethereum.Value.fromAddress(owner_),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalCycleShares(param0: BigInt): BigInt {
    let result = super.call(
      "totalCycleShares",
      "totalCycleShares(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)],
    );

    return result[0].toBigInt();
  }

  try_totalCycleShares(param0: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalCycleShares",
      "totalCycleShares(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get provider_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AddSharesCall extends ethereum.Call {
  get inputs(): AddSharesCall__Inputs {
    return new AddSharesCall__Inputs(this);
  }

  get outputs(): AddSharesCall__Outputs {
    return new AddSharesCall__Outputs(this);
  }
}

export class AddSharesCall__Inputs {
  _call: AddSharesCall;

  constructor(call: AddSharesCall) {
    this._call = call;
  }

  get shares_(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get owner_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class AddSharesCall__Outputs {
  _call: AddSharesCall;

  constructor(call: AddSharesCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get provider_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get cycleDuration_(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get windowDuration_(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class ProcessExitCall extends ethereum.Call {
  get inputs(): ProcessExitCall__Inputs {
    return new ProcessExitCall__Inputs(this);
  }

  get outputs(): ProcessExitCall__Outputs {
    return new ProcessExitCall__Outputs(this);
  }
}

export class ProcessExitCall__Inputs {
  _call: ProcessExitCall;

  constructor(call: ProcessExitCall) {
    this._call = call;
  }

  get requestedShares_(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get owner_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ProcessExitCall__Outputs {
  _call: ProcessExitCall;

  constructor(call: ProcessExitCall) {
    this._call = call;
  }

  get redeemableShares_(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }

  get resultingAssets_(): BigInt {
    return this._call.outputValues[1].value.toBigInt();
  }
}

export class RemoveSharesCall extends ethereum.Call {
  get inputs(): RemoveSharesCall__Inputs {
    return new RemoveSharesCall__Inputs(this);
  }

  get outputs(): RemoveSharesCall__Outputs {
    return new RemoveSharesCall__Outputs(this);
  }
}

export class RemoveSharesCall__Inputs {
  _call: RemoveSharesCall;

  constructor(call: RemoveSharesCall) {
    this._call = call;
  }

  get shares_(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get owner_(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RemoveSharesCall__Outputs {
  _call: RemoveSharesCall;

  constructor(call: RemoveSharesCall) {
    this._call = call;
  }

  get sharesReturned_(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class SetExitConfigCall extends ethereum.Call {
  get inputs(): SetExitConfigCall__Inputs {
    return new SetExitConfigCall__Inputs(this);
  }

  get outputs(): SetExitConfigCall__Outputs {
    return new SetExitConfigCall__Outputs(this);
  }
}

export class SetExitConfigCall__Inputs {
  _call: SetExitConfigCall;

  constructor(call: SetExitConfigCall) {
    this._call = call;
  }

  get cycleDuration_(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get windowDuration_(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetExitConfigCall__Outputs {
  _call: SetExitConfigCall;

  constructor(call: SetExitConfigCall) {
    this._call = call;
  }
}
