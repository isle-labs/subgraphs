import {
  Address,
  BigDecimal,
  BigInt,
  Bytes,
  ethereum,
  log,
} from "@graphprotocol/graph-ts";
import {
  PoolAddressesProvider,
  ProxyCreated,
} from "../../../generated/PoolAddressesProvider/PoolAddressesProvider";
import {
  Initialized as WithdrawalManagerInitialized,
  WithdrawalUpdated,
  WithdrawalProcessed,
  WithdrawalManager,
} from "../../../generated/templates/WithdrawalManager/WithdrawalManager";
import {
  Initialized as PoolConfiguratorInitialized,
  PoolLimitSet,
  AdminFeeSet,
  MaxCoverLiquidationSet,
  CoverDeposited,
  CoverWithdrawn,
  CoverLiquidated,
  PoolConfigurator,
} from "../../../generated/templates/PoolConfigurator/PoolConfigurator";
import {
  Initialized as LoanManagerInitialized,
  PaymentAdded,
  LoanRepaid,
  FeesPaid,
  IssuanceParamsUpdated,
  LoanManager,
} from "../../../generated/templates/LoanManager/LoanManager";
import {
  Pool as PoolTemplate,
  PoolConfigurator as PoolConfiguratorTemplate,
  LoanManager as LoanManagerTemplate,
  WithdrawalManager as WithdrawalManagerTemplate,
} from "../../../generated/templates";
import {
  Deposit,
  Withdraw,
  Pool,
} from "../../../generated/templates/Pool/Pool";
import {
  BIGDECIMAL_ONE,
  BIGDECIMAL_ZERO,
  BIGINT_ZERO,
  exponentToBigDecimal,
  InterestRateSide,
  InterestRateType,
  INT_ZERO,
  SECONDS_PER_DAY,
  TokenType,
} from "../../../src/sdk/constants";
import { DataManager } from "../../../src/sdk/manager";
import { TokenManager } from "../../../src/sdk/token";
import { getProtocolData, INTEREST_DECIMALS, DAYS_IN_MONTH } from "./constants";
import {
  MarketDailySnapshot,
  _Loan,
  _WithdrawalRequest,
} from "../../../generated/schema";
import { ERC20 } from "../../../generated/templates/Pool/ERC20";

///////////////////////////////////
//// Addresses Provider Events ////
///////////////////////////////////

//
// Pool-side contracts created event
export function handleProxyCreated(event: ProxyCreated): void {
  // create which template depends on the event.params.id
  // note that the type of id is Bytes, so we need to convert it to a string
  const id = event.params.id.toString();
  if (id == "POOL_CONFIGURATOR") {
    PoolConfiguratorTemplate.create(event.params.proxyAddress);
  } else if (id == "LOAN_MANAGER") {
    LoanManagerTemplate.create(event.params.proxyAddress);
  } else if (id == "WITHDRAWAL_MANAGER") {
    WithdrawalManagerTemplate.create(event.params.proxyAddress);
  } else {
    log.error(
      "[handleProxyCreated] ProxyCreated event with id {} does not have a template",
      [id],
    );
  }
}

///////////////////////////////////
//// Withdrawal Manager Events ////
///////////////////////////////////

export function handleWithdrawalManagerInitialized(
  event: WithdrawalManagerInitialized,
): void {
  const withdrawalManagerContract = WithdrawalManager.bind(event.address);
  // get current config of the withdrawal manager
  const tryGetCurrentConfig = withdrawalManagerContract.try_getCurrentConfig();
  if (tryGetCurrentConfig.reverted) {
    log.error(
      "[handleWithdrawalManagerInitialized] WithdrawalManager contract {} does not have a currentConfig",
      [event.address.toHexString()],
    );
    return;
  }

  const tryAddressesProvider =
    withdrawalManagerContract.try_ADDRESSES_PROVIDER();
  if (tryAddressesProvider.reverted) {
    log.error(
      "[handleWithdrawalManagerInitialized] WithdrawalManager contract {} does not have an addressesProvider",
      [event.address.toHexString()],
    );
    return;
  }
  const PoolAddressesProviderContract = PoolAddressesProvider.bind(
    tryAddressesProvider.value,
  );

  const tryGetPoolConfigurator =
    PoolAddressesProviderContract.try_getPoolConfigurator();
  if (tryGetPoolConfigurator.reverted) {
    log.error(
      "[handleWithdrawalManagerInitialized] PoolAddressesProvider contract {} does not have a poolConfigurator",
      [tryAddressesProvider.value.toHexString()],
    );
    return;
  }
  const PoolConfiguratorContract = PoolConfigurator.bind(
    tryGetPoolConfigurator.value,
  );

  const tryPool = PoolConfiguratorContract.try_pool();
  if (tryPool.reverted) {
    log.error(
      "[handleWithdrawalManagerInitialized] PoolConfigurator contract {} does not have a pool",
      [tryGetPoolConfigurator.value.toHexString()],
    );
    return;
  }
  const tryAsset = PoolConfiguratorContract.try_asset();
  if (tryAsset.reverted) {
    log.error(
      "[handleWithdrawalManagerInitialized] PoolConfigurator contract {} does not have an asset",
      [tryGetPoolConfigurator.value.toHexString()],
    );
    return;
  }

  const manager = new DataManager(
    tryPool.value,
    tryAsset.value,
    event,
    getProtocolData(),
  );

  const market = manager.getMarket();
  market._withdrawalManager = Bytes.fromHexString(event.address.toHexString());

  market._cycleDuration = tryGetCurrentConfig.value.cycleDuration;
  market._windowDuration = tryGetCurrentConfig.value.windowDuration;
  market.save();
}

export function handleWithdrawalUpdated(event: WithdrawalUpdated): void {
  const withdrawalManagerContract = WithdrawalManager.bind(event.address);
  const tryCurrentCycleId = withdrawalManagerContract.try_getCurrentCycleId();
  if (tryCurrentCycleId.reverted) {
    log.error(
      "[handleWithdrawalUpdated] WithdrawalManager contract {} does not have a currentCycleId",
      [event.address.toHexString()],
    );
    return;
  }
  const exitCycleIdBytes = Bytes.fromI32(tryCurrentCycleId.value.toI32());
  const requestId = event.address.concat(exitCycleIdBytes);
  const request = getOrCreateWithdrawalRequest(requestId, event);
  request.exitCycleId = tryCurrentCycleId.value;
  if (event.params.lockedShares_ == BIGINT_ZERO) {
    return;
  }
  request.lockedShare = event.params.lockedShares_;
  request.state = "PENDING";
  request.save();
}

export function handleWithdrawalProcessed(event: WithdrawalProcessed): void {
  const withdrawalManagerContract = WithdrawalManager.bind(event.address);
  const tryCurrentCycleId = withdrawalManagerContract.try_getCurrentCycleId();
  if (tryCurrentCycleId.reverted) {
    log.error(
      "[handleWithdrawalProcessed] WithdrawalManager contract {} does not have a currentCycleId",
      [event.address.toHexString()],
    );
    return;
  }
  const exitCycleIdBytes = Bytes.fromI32(tryCurrentCycleId.value.toI32());
  const requestId = event.address.concat(exitCycleIdBytes);
  const request = getOrCreateWithdrawalRequest(requestId, event);
  request.state = "WITHDRAWN";
  request.save();
}

/////////////////////
//// Pool Events ////
/////////////////////

export function handlePoolConfiguratorInitialized(
  event: PoolConfiguratorInitialized,
): void {
  PoolTemplate.create(event.params.pool_);

  const poolContract = Pool.bind(event.params.pool_);
  const outputToken = new TokenManager(
    event.params.pool_,
    event,
    TokenType.NON_REBASING,
  );

  const tryInputToken = poolContract.try_asset();
  if (tryInputToken.reverted) {
    log.error(
      "[handlePoolConfiguratorInitialized] Pool contract {} does not have an asset",
      [event.params.pool_.toHexString()],
    );
    return;
  }

  const manager = new DataManager(
    event.params.pool_,
    tryInputToken.value,
    event,
    getProtocolData(),
  );

  // new market, set both interest rates as 0
  const market = manager.getMarket();
  manager.getOrUpdateRate(
    InterestRateSide.BORROWER,
    InterestRateType.FIXED,
    BIGDECIMAL_ZERO,
  );
  manager.getOrUpdateRate(
    InterestRateSide.LENDER,
    InterestRateType.VARIABLE,
    BIGDECIMAL_ZERO,
  );

  const tryConfigurator = poolContract.try_configurator();
  if (tryConfigurator.reverted) {
    log.error(
      "[handlePoolConfiguratorInitialized] Pool contract {} does not have a configurator",
      [event.params.pool_.toHexString()],
    );
    return;
  }

  const poolConfiguratorContract = PoolConfigurator.bind(tryConfigurator.value);
  // get configs of the pool
  const tryAdmin = poolConfiguratorContract.try_admin();
  if (tryAdmin.reverted) {
    log.error(
      "[handlePoolConfiguratorInitialized] PoolConfigurator contract {} does not have an admin",
      [tryConfigurator.value.toHexString()],
    );
    return;
  }

  // update market with isle specifics
  market.id = event.params.pool_;
  market.name = outputToken.getToken().name;
  market.outputToken = outputToken.getToken().id;
  market.outputTokenSupply = BIGINT_ZERO;
  market.outputTokenPriceUSD = BIGDECIMAL_ZERO;
  market.exchangeRate = BIGDECIMAL_ZERO; // Exchange rate = (inputTokenBalance / outputTokenSupply) OR (totalAssets() / totalSupply())
  market.isActive = true; // Set to true for now, but is actually affected by ContractPausedSet/ProtocolPausedSet
  market.canBorrowFrom = true; // Set to true for now, but is acutally affected by ContractPausedSet/ProtocolPausedSet
  market.canUseAsCollateral = false; // We currently only support using Receivables as collateral
  market.borrowedToken = tryInputToken.value;
  market.stableBorrowedTokenBalance = BIGINT_ZERO;
  market._poolConfigurator = tryConfigurator.value;
  market._admin = tryAdmin.value;
  market._maxCoverLiquidation = BIGINT_ZERO;
  market._poolCover = BIGINT_ZERO;
  market._adminFee = BIGINT_ZERO;
  market.save();
}

// handle deposits to the pool
export function handleDeposit(event: Deposit): void {
  const poolContract = Pool.bind(event.address);
  const tryInputToken = poolContract.try_asset();
  if (tryInputToken.reverted) {
    log.error("[handleDeposit] Pool contract {} does not have an asset", [
      event.address.toHexString(),
    ]);
    return;
  }

  const manager = new DataManager(
    event.address,
    tryInputToken.value,
    event,
    getProtocolData(),
  );
  updateMarketAndProtocol(manager, event);
  const market = manager.getMarket();

  const amountUSD = getTotalValueUSD(
    event.params.assets,
    manager.getInputToken().decimals,
    market.inputTokenPriceUSD,
  );

  manager.createDeposit(
    market.inputToken,
    event.params.owner,
    event.params.assets,
    amountUSD,
    getBalanceOf(event.address, event.params.owner),
    InterestRateType.VARIABLE,
  );
}

// handle withdrawals from the pool
export function handleWithdraw(event: Withdraw): void {
  const poolContract = Pool.bind(event.address);
  const tryInputToken = poolContract.try_asset();
  if (tryInputToken.reverted) {
    log.error("[handleWithdraw] Pool contract {} does not have an asset", [
      event.address.toHexString(),
    ]);
    return;
  }

  const manager = new DataManager(
    event.address,
    tryInputToken.value,
    event,
    getProtocolData(),
  );
  updateMarketAndProtocol(manager, event);
  const market = manager.getMarket();

  const amountUSD = getTotalValueUSD(
    event.params.assets,
    manager.getInputToken().decimals,
    market.inputTokenPriceUSD,
  );

  manager.createWithdraw(
    market.inputToken,
    event.params.owner,
    event.params.assets,
    amountUSD,
    getBalanceOf(event.address, event.params.owner),
    InterestRateType.VARIABLE,
  );
}

// handle the pool limit set
export function handlePoolLimitSet(event: PoolLimitSet): void {
  // get input token
  const poolConfiguratorContract = PoolConfigurator.bind(event.address);
  const tryAsset = poolConfiguratorContract.try_asset();
  if (tryAsset.reverted) {
    log.error(
      "[handlePoolLimitSet] PoolConfigurator contract {} does not have an asset",
      [event.address.toHexString()],
    );
    return;
  }
  const tryPool = poolConfiguratorContract.try_pool();
  if (tryPool.reverted) {
    log.error(
      "[handlePoolLimitSet] PoolConfigurator contract {} does not have a pool",
      [event.address.toHexString()],
    );
    return;
  }

  const manager = new DataManager(
    tryPool.value,
    tryAsset.value,
    event,
    getProtocolData(),
  );
  const market = manager.getMarket();
  market.supplyCap = event.params.poolLimit_;
  market.save();
}

// handle admin fee of the pool set
export function handleAdminFeeSet(event: AdminFeeSet): void {
  // get input token
  const poolConfiguratorContract = PoolConfigurator.bind(event.address);
  const tryAsset = poolConfiguratorContract.try_asset();
  if (tryAsset.reverted) {
    log.error(
      "[handleAdminFeeSet] PoolConfigurator contract {} does not have an asset",
      [event.address.toHexString()],
    );
    return;
  }
  const tryPool = poolConfiguratorContract.try_pool();
  if (tryPool.reverted) {
    log.error(
      "[handleAdminFeeSet] PoolConfigurator contract {} does not have a pool",
      [event.address.toHexString()],
    );
    return;
  }

  const manager = new DataManager(
    tryPool.value,
    tryAsset.value,
    event,
    getProtocolData(),
  );
  const market = manager.getMarket();
  market._adminFee = event.params.adminFee_;
  market.save();
}

// handle max cover liquidation of the pool set
export function handleMaxCoverLiquidationSet(
  event: MaxCoverLiquidationSet,
): void {
  // get input token
  const poolConfiguratorContract = PoolConfigurator.bind(event.address);
  const tryAsset = poolConfiguratorContract.try_asset();
  if (tryAsset.reverted) {
    log.error(
      "[handleMaxCoverLiquidationSet] PoolConfigurator contract {} does not have an asset",
      [event.address.toHexString()],
    );
    return;
  }
  const tryPool = poolConfiguratorContract.try_pool();
  if (tryPool.reverted) {
    log.error(
      "[handleMaxCoverLiquidationSet] PoolConfigurator contract {} does not have a pool",
      [event.address.toHexString()],
    );
    return;
  }

  const manager = new DataManager(
    tryPool.value,
    tryAsset.value,
    event,
    getProtocolData(),
  );
  const market = manager.getMarket();
  market._maxCoverLiquidation = BigInt.fromI32(
    event.params.maxCoverLiquidation_,
  );
  market.save();
}

// handle cover deposited to the pool
export function handleCoverDeposited(event: CoverDeposited): void {
  // get input token
  const poolConfiguratorContract = PoolConfigurator.bind(event.address);
  const tryAsset = poolConfiguratorContract.try_asset();
  if (tryAsset.reverted) {
    log.error(
      "[handleCoverDeposited] PoolConfigurator contract {} does not have an asset",
      [event.address.toHexString()],
    );
    return;
  }
  const tryPool = poolConfiguratorContract.try_pool();
  if (tryPool.reverted) {
    log.error(
      "[handleCoverDeposited] PoolConfigurator contract {} does not have a pool",
      [event.address.toHexString()],
    );
    return;
  }

  const manager = new DataManager(
    tryPool.value,
    tryAsset.value,
    event,
    getProtocolData(),
  );
  const market = manager.getMarket();
  if (!market._poolCover) {
    market._poolCover = BIGINT_ZERO;
  }

  market._poolCover = market._poolCover!.plus(event.params.amount_);
  market.save();
}

// handle cover withdrawn from the pool
export function handleCoverWithdrawn(event: CoverWithdrawn): void {
  // get input token
  const poolConfiguratorContract = PoolConfigurator.bind(event.address);
  const tryAsset = poolConfiguratorContract.try_asset();
  if (tryAsset.reverted) {
    log.error(
      "[handleCoverWithdrawn] PoolConfigurator contract {} does not have an asset",
      [event.address.toHexString()],
    );
    return;
  }
  const tryPool = poolConfiguratorContract.try_pool();
  if (tryPool.reverted) {
    log.error(
      "[handleCoverWithdrawn] PoolConfigurator contract {} does not have a pool",
      [event.address.toHexString()],
    );
    return;
  }

  const manager = new DataManager(
    tryPool.value,
    tryAsset.value,
    event,
    getProtocolData(),
  );
  const market = manager.getMarket();

  market._poolCover = market._poolCover!.minus(event.params.amount_);
  market.save();
}

// handle cover liquidated
export function handleCoverLiquidated(event: CoverLiquidated): void {
  // get input token
  const poolConfiguratorContract = PoolConfigurator.bind(event.address);
  const tryAsset = poolConfiguratorContract.try_asset();
  if (tryAsset.reverted) {
    log.error(
      "[handleCoverLiquidated] PoolConfigurator contract {} does not have an asset",
      [event.address.toHexString()],
    );
    return;
  }
  const tryPool = poolConfiguratorContract.try_pool();
  if (tryPool.reverted) {
    log.error(
      "[handleCoverLiquidated] PoolConfigurator contract {} does not have a pool",
      [event.address.toHexString()],
    );
    return;
  }

  const manager = new DataManager(
    tryPool.value,
    tryAsset.value,
    event,
    getProtocolData(),
  );
  const market = manager.getMarket();

  market._poolCover = market._poolCover!.minus(event.params.toPool_);
  market.save();
}

//////////////////////////////
//// Loan Manager Events /////
//////////////////////////////

export function handleLoanManagerInitialized(
  event: LoanManagerInitialized,
): void {
  const loanManagerContract = LoanManager.bind(event.address);

  // get the asset, i.e. the input token
  const tryAsset = loanManagerContract.try_fundsAsset();
  if (tryAsset.reverted) {
    log.error(
      "[handleLoanManagerInitialized] LoanManager contract {} does not have an asset",
      [event.address.toHexString()],
    );
    return;
  }

  // get the market, i.e. the pool
  const tryAddressesProvider = loanManagerContract.try_ADDRESSES_PROVIDER();
  if (tryAddressesProvider.reverted) {
    log.error(
      "[handleLoanManagerInitialized] LoanManager contract {} does not have an addressesProvider",
      [event.address.toHexString()],
    );
    return;
  }
  const PoolAddressesProviderContract = PoolAddressesProvider.bind(
    tryAddressesProvider.value,
  );

  const tryGetPoolConfigurator =
    PoolAddressesProviderContract.try_getPoolConfigurator();
  if (tryGetPoolConfigurator.reverted) {
    log.error(
      "[handleLoanManagerInitialized] PoolAddressesProvider contract {} does not have a poolConfigurator",
      [tryAddressesProvider.value.toHexString()],
    );
    return;
  }
  const PoolConfiguratorContract = PoolConfigurator.bind(
    tryGetPoolConfigurator.value,
  );

  const tryPool = PoolConfiguratorContract.try_pool();
  if (tryPool.reverted) {
    log.error(
      "[handleLoanManagerInitialized] PoolConfigurator contract {} does not have a pool",
      [tryGetPoolConfigurator.value.toHexString()],
    );
    return;
  }

  const manager = new DataManager(
    tryPool.value,
    tryAsset.value,
    event,
    getProtocolData(),
  );

  const market = manager.getMarket();
  market._loanManager = Bytes.fromHexString(event.address.toHexString());
  market.save();
}

// handles borrow creations for loans
export function handlePaymentAdded(event: PaymentAdded): void {
  const loanIdBytes = Bytes.fromI32(event.params.loanId_);
  const loanId = event.address.concat(loanIdBytes);
  const loan = getOrCreateLoan(loanId, event);

  const loanManagerContract = LoanManager.bind(event.address);

  // get the market, i.e. the pool
  const tryAddressesProvider = loanManagerContract.try_ADDRESSES_PROVIDER();
  if (tryAddressesProvider.reverted) {
    log.error(
      "[handlePaymentAdded] LoanManager contract {} does not have an addressesProvider",
      [event.address.toHexString()],
    );
    return;
  }
  const PoolAddressesProviderContract = PoolAddressesProvider.bind(
    tryAddressesProvider.value,
  );

  const tryGetPoolConfigurator =
    PoolAddressesProviderContract.try_getPoolConfigurator();
  if (tryGetPoolConfigurator.reverted) {
    log.error(
      "[handlePaymentAdded] PoolAddressesProvider contract {} does not have a poolConfigurator",
      [tryAddressesProvider.value.toHexString()],
    );
    return;
  }
  const PoolConfiguratorContract = PoolConfigurator.bind(
    tryGetPoolConfigurator.value,
  );

  const tryPool = PoolConfiguratorContract.try_pool();
  if (tryPool.reverted) {
    log.error(
      "[handlePaymentAdded] PoolConfigurator contract {} does not have a pool",
      [tryGetPoolConfigurator.value.toHexString()],
    );
    return;
  }

  // get the borrower
  const tryBorrower = PoolConfiguratorContract.try_buyer();
  if (tryBorrower.reverted) {
    log.error(
      "[handlePaymentAdded] PoolConfigurator contract {} does not have a buyer",
      [tryGetPoolConfigurator.value.toHexString()],
    );
    return;
  }

  const poolContract = Pool.bind(tryPool.value);
  const tryInputToken = poolContract.try_asset();
  if (tryInputToken.reverted) {
    log.error("[handlePaymentAdded] Pool contract {} does not have an asset", [
      tryPool.value.toHexString(),
    ]);
    return;
  }

  const manager = new DataManager(
    tryPool.value,
    tryInputToken.value,
    event,
    getProtocolData(),
  );

  const inputTokenPriceUSD = BIGDECIMAL_ONE; // notice that in Isle Finance v0, the price of all stablecoins are hardcoded to 1
  const inputTokenDecimals = manager.getInputToken().decimals;

  // get principal of the loan
  const tryLoanInfo = loanManagerContract.try_getLoanInfo(event.params.loanId_);
  if (tryLoanInfo.reverted) {
    log.error(
      "[handlePaymentAdded] LoanManager contract {} does not have a loa info",
      [event.address.toHexString()],
    );
    return;
  }

  const principal = tryLoanInfo.value.principal;
  const receivableTokenId = tryLoanInfo.value.receivableTokenId;

  loan.market = Bytes.fromHexString(tryPool.value.toHexString());
  loan.loanManager = Bytes.fromHexString(event.address.toHexString());
  loan.borrower = tryBorrower.value;
  loan.gracePeriod = tryLoanInfo.value.gracePeriod;
  loan.isActive = true;
  loan.isDefaulted = false;
  loan.receivableTokenId = receivableTokenId;
  loan.principal = principal;
  loan.interestRate = tryLoanInfo.value.interestRate;
  loan.lateInterestPremiumRate = tryLoanInfo.value.lateInterestPremiumRate;
  loan.financeTimestamp = tryLoanInfo.value.startDate;
  loan.maturityTimestamp = tryLoanInfo.value.dueDate;

  loan.save();

  manager.createBorrow(
    tryInputToken.value,
    tryBorrower.value,
    principal,
    getTotalValueUSD(principal, inputTokenDecimals, inputTokenPriceUSD),
    principal,
    inputTokenPriceUSD,
    InterestRateType.FIXED,
  );
}

// Handle loan repayments
export function handleLoanRepaid(event: LoanRepaid): void {
  const loanIdBytes = Bytes.fromI32(event.params.loanId_);
  const loanId = event.address.concat(loanIdBytes);
  const loan = getOrCreateLoan(loanId, event);
  if (!loan.market) {
    log.error("[handleLoanRepaid] Loan {} does not have a market", [
      event.address.toHexString(),
    ]);
    return;
  }
  const poolContract = Pool.bind(Address.fromBytes(loan.market!));
  const tryAsset = poolContract.try_asset();
  if (tryAsset.reverted) {
    log.error("[handleLoanRepaid] Pool contract {} does not have an asset", [
      loan.market!.toHexString(),
    ]);
    return;
  }

  const manager = new DataManager(
    loan.market!,
    tryAsset.value,
    event,
    getProtocolData(),
  );
  updateMarketAndProtocol(manager, event);

  const loanManagerContract = LoanManager.bind(event.address);
  const tryLoanInfo = loanManagerContract.try_getLoanInfo(event.params.loanId_);
  if (tryLoanInfo.reverted) {
    log.error(
      "[handlePaymentAdded] LoanManager contract {} does not have a loa info",
      [event.address.toHexString()],
    );
    return;
  }
  const borrower = tryLoanInfo.value.buyer;
  const inputTokenPriceUSD = BIGDECIMAL_ONE; // notice that in Isle Finance v0, the price of all stablecoins are hardcoded to 1
  const repayAmount = event.params.principal_.plus(event.params.interest_);
  const inputTokenDecimals = manager.getInputToken().decimals;
  manager.createRepay(
    tryAsset.value,
    borrower,
    repayAmount,
    getTotalValueUSD(repayAmount, inputTokenDecimals, inputTokenPriceUSD),
    event.params.principal_,
    inputTokenPriceUSD,
    InterestRateType.FIXED,
  );
  loan.isActive = false;
  loan.isDefaulted = false;
  loan.save();
}

// update protocol revenue collected
export function handleFeesPaid(event: FeesPaid): void {
  const loanIdBytes = Bytes.fromI32(event.params.loanId_);
  const loanId = event.address.concat(loanIdBytes);
  const loan = getOrCreateLoan(loanId, event);
  if (!loan.market) {
    log.error("[handleFeesPaid] Loan {} does not have a market", [
      event.address.toHexString(),
    ]);
    return;
  }
  const poolContract = Pool.bind(Address.fromBytes(loan.market!));
  const tryAsset = poolContract.try_asset();
  if (tryAsset.reverted) {
    log.error("[handleFeesPaid] Pool contract {} does not have an asset", [
      loan.market!.toHexString(),
    ]);
    return;
  }

  const manager = new DataManager(
    loan.market!,
    tryAsset.value,
    event,
    getProtocolData(),
  );
  updateMarketAndProtocol(manager, event);

  const inputTokenPriceUSD = BIGDECIMAL_ONE; // notice that in Isle Finance v0, the price of all stablecoins are hardcoded to 1
  const inputTokenDecimals = manager.getInputToken().decimals;

  manager.addProtocolRevenue(
    getTotalValueUSD(
      event.params.protocolFee_,
      inputTokenDecimals,
      inputTokenPriceUSD,
    ),
  );
}

// handle issuance params updated
export function handleIssuanceParamsUpdated(
  event: IssuanceParamsUpdated,
): void {
  const loanManagerContract = LoanManager.bind(event.address);

  // get the market, i.e. the pool
  const tryAddressesProvider = loanManagerContract.try_ADDRESSES_PROVIDER();
  if (tryAddressesProvider.reverted) {
    log.error(
      "[handleIssuanceParamsUpdated] LoanManager contract {} does not have an addressesProvider",
      [event.address.toHexString()],
    );
    return;
  }
  const PoolAddressesProviderContract = PoolAddressesProvider.bind(
    tryAddressesProvider.value,
  );

  const tryGetPoolConfigurator =
    PoolAddressesProviderContract.try_getPoolConfigurator();
  if (tryGetPoolConfigurator.reverted) {
    log.error(
      "[handleIssuanceParamsUpdated] PoolAddressesProvider contract {} does not have a poolConfigurator",
      [tryAddressesProvider.value.toHexString()],
    );
    return;
  }
  const PoolConfiguratorContract = PoolConfigurator.bind(
    tryGetPoolConfigurator.value,
  );

  const tryPool = PoolConfiguratorContract.try_pool();
  if (tryPool.reverted) {
    log.error(
      "[handleIssuanceParamsUpdated] PoolConfigurator contract {} does not have a pool",
      [tryGetPoolConfigurator.value.toHexString()],
    );
    return;
  }

  const poolContract = Pool.bind(tryPool.value);
  const tryInputToken = poolContract.try_asset();
  if (tryInputToken.reverted) {
    log.error(
      "[handleIssuanceParamsUpdated] Pool contract {} does not have an asset",
      [tryPool.value.toHexString()],
    );
    return;
  }

  const manager = new DataManager(
    tryPool.value,
    tryInputToken.value,
    event,
    getProtocolData(),
  );

  const market = manager.getMarket();
  updateMarketAndProtocol(manager, event);
  market.save();
}

/////////////////
//// Helpers ////
/////////////////

// Updates the market and protocol with latest data
// Prices, balances, exchange rate, TVL, rates
function updateMarketAndProtocol(
  manager: DataManager,
  event: ethereum.Event,
): void {
  const market = manager.getMarket();
  if (!market._loanManager) {
    log.error(
      "[updateMarketAndProtocol] Market {} does not have a loan manager",
      [market.id.toHexString()],
    );
    return;
  }
  const loanManagerContract = LoanManager.bind(
    Address.fromBytes(market._loanManager!),
  );
  const poolContract = Pool.bind(Address.fromBytes(market.id));

  const tryBalance = poolContract.try_totalAssets(); // input tokens
  const tryTotalSupply = poolContract.try_totalSupply(); // output tokens
  if (tryBalance.reverted || tryTotalSupply.reverted) {
    log.error(
      "[updateMarketAndProtocol] Pool contract {} does not have a totalAssets or totalSupply",
      [market.id.toHexString()],
    );
    return;
  }
  const inputTokenPriceUSD = BIGDECIMAL_ONE;
  const tryAUM = loanManagerContract.try_assetsUnderManagement();
  if (tryAUM.reverted) {
    log.error(
      "[updateMarketAndProtocol] LoanManager contract {} does not have a assetsUnderManagement",
      [market._loanManager!.toHexString()],
    );
    return;
  }

  const exchangeRate = safeDiv(
    tryTotalSupply.value.toBigDecimal(),
    tryBalance.value.toBigDecimal(),
  );

  market.outputTokenSupply = tryTotalSupply.value;
  market.outputTokenPriceUSD = inputTokenPriceUSD.times(exchangeRate); // use exchange rate to get price of output token
  market.save();

  manager.updateMarketAndProtocolData(
    inputTokenPriceUSD,
    tryBalance.value,
    tryAUM.value,
    null,
    null,
    exchangeRate,
  );

  // calculate accounted interest on the loans
  const tryAccountedInterest = loanManagerContract.try_accountedInterest();
  if (tryAccountedInterest.reverted) {
    log.error(
      "[updateMarketAndProtocol] LoanManager contract {} does not have a getAccountedInterest",
      [market._loanManager!.toHexString()],
    );
    return;
  }
  if (!market._prevRevenue) {
    market._prevRevenue = BIGINT_ZERO;
  }

  if (market._prevRevenue!.lt(tryAccountedInterest.value)) {
    const revenueDelta = tryAccountedInterest.value.minus(market._prevRevenue!);
    market._prevRevenue = tryAccountedInterest.value;
    market.save();

    manager.addSupplyRevenue(
      getTotalValueUSD(
        revenueDelta,
        manager.getInputToken().decimals,
        inputTokenPriceUSD,
      ),
    );
  }

  // update withdrawal info
  const withdrawalManagerContract = WithdrawalManager.bind(
    Address.fromBytes(market._withdrawalManager!),
  );

  const tryGetCurrentCycleId =
    withdrawalManagerContract.try_getCurrentCycleId();
  if (tryGetCurrentCycleId.reverted) {
    log.error(
      "[updateMarketAndProtocol] WithdrawalManager contract {} does not have a getCurrentCycleId",
      [market._withdrawalManager!.toHexString()],
    );
    return;
  }

  const tryLockedLiquidity = withdrawalManagerContract.try_lockedLiquidity();
  if (tryLockedLiquidity.reverted) {
    log.error(
      "[updateMarketAndProtocol] WithdrawalManager contract {} does not have a lockedLiquidity",
      [market._withdrawalManager!.toHexString()],
    );
    return;
  }

  market._currentWithdrawalCycleId = tryGetCurrentCycleId.value.toI32();
  market._lockedLiquidityInWindow = tryLockedLiquidity.value;
  market.save();

  updateBorrowRate(manager);
  updateSupplyRate(manager, event);
}

function updateBorrowRate(manager: DataManager): void {
  const market = manager.getMarket();

  // update borrow rate using the rate from the loans
  let totalPrincipal = BIGDECIMAL_ZERO;
  let rateAmount = BIGDECIMAL_ZERO;

  const loansOfMarket = market._loans.load();

  if (!loansOfMarket) {
    log.error("[updateMarketAndProtocol] Market {} does not have any loans", [
      market.id.toHexString(),
    ]);
    return;
  }
  for (let i = 0; i < loansOfMarket.length; i++) {
    const loan = loansOfMarket[i];
    const principalBigInt = loan.principal;
    const rateBigInt = loan.interestRate;

    if (!principalBigInt || !rateBigInt) {
      log.error(
        "[updateMarketAndProtocol] Loan {} does not have a principal or interestRate",
        [loan.id.toHexString()],
      );
      return;
    }

    // principal = 5000e18
    const principal = principalBigInt.toBigDecimal();
    totalPrincipal = totalPrincipal.plus(principal);

    // rateAmount = 5000e18 * 0.12e6 / 1e6 = 600e18
    rateAmount = rateAmount.plus(
      principal.times(
        rateBigInt.toBigDecimal().div(exponentToBigDecimal(INTEREST_DECIMALS)),
      ),
    );
  }

  // borrow rate = annual interest on all principal / total principal (in APR)

  // catch divide by zero
  if (totalPrincipal.equals(BIGDECIMAL_ZERO)) return;

  // borrowRate = 600e18 / 5000e18 * 100 = 12, meaning 12% APR
  const borrowRate = safeDiv(rateAmount, totalPrincipal).times(
    exponentToBigDecimal(2),
  );
  manager.getOrUpdateRate(
    InterestRateSide.BORROWER,
    InterestRateType.FIXED,
    borrowRate,
  );
}

function updateSupplyRate(manager: DataManager, event: ethereum.Event): void {
  const market = manager.getMarket();

  // update supply rate using interest from the last 30 days
  let totalInterest = BIGDECIMAL_ZERO;
  let days = event.block.timestamp.toI32() / SECONDS_PER_DAY;

  for (let i = 0; i < DAYS_IN_MONTH; i++) {
    const snapshotID = market.id.concat(Bytes.fromI32(days));
    const thisDailyMarketSnapshot = MarketDailySnapshot.load(snapshotID);
    if (thisDailyMarketSnapshot) {
      totalInterest = totalInterest.plus(
        thisDailyMarketSnapshot.dailySupplySideRevenueUSD,
      );
    }
    // decrement days
    days--;
  }
  // catch divide by zero
  if (market.totalDepositBalanceUSD.equals(BIGDECIMAL_ZERO)) return;

  const supplyRate = safeDiv(
    totalInterest,
    market.totalDepositBalanceUSD,
  ).times(exponentToBigDecimal(2)); // E.g. 5.21% should be stored as 5.21
  manager.getOrUpdateRate(
    InterestRateSide.LENDER,
    InterestRateType.VARIABLE,
    supplyRate,
  );
}

//
// get the account balance of an account for any erc20 token
function getBalanceOf(erc20Contract: Address, account: Address): BigInt {
  const contract = ERC20.bind(erc20Contract);
  const tryBalance = contract.try_balanceOf(account);
  if (tryBalance.reverted) {
    log.error(
      "[getBalanceOf] Could not get balance of contract {} for account {}",
      [contract._address.toHexString(), account.toHexString()],
    );
    return BIGINT_ZERO;
  }
  return tryBalance.value;
}

// get the price of any amount with error handling
function getTotalValueUSD(
  amount: BigInt,
  decimals: i32,
  priceUSD: BigDecimal,
): BigDecimal {
  if (decimals <= INT_ZERO) {
    return amount.toBigDecimal().times(priceUSD);
  } else {
    return amount
      .toBigDecimal()
      .div(exponentToBigDecimal(decimals))
      .times(priceUSD);
  }
}

function safeDiv(a: BigDecimal, b: BigDecimal): BigDecimal {
  if (b == BIGDECIMAL_ZERO) {
    return BIGDECIMAL_ZERO;
  }
  return a.div(b);
}

function getOrCreateLoan(loanId: Bytes, event: ethereum.Event): _Loan {
  let loan = _Loan.load(loanId);
  if (!loan) {
    loan = new _Loan(loanId);
    loan.createdTimestamp = event.block.timestamp;
    loan.save();
  }
  return loan;
}

function getOrCreateWithdrawalRequest(
  requestId: Bytes,
  event: ethereum.Event,
): _WithdrawalRequest {
  let request = _WithdrawalRequest.load(requestId);
  if (!request) {
    request = new _WithdrawalRequest(requestId);
    request.createdTimestamp = event.block.timestamp;
    request.save();
  }
  return request;
}
