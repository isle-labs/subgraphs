# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the **Isle Finance v1 Subgraph**, a GraphQL-based indexing solution for the Isle Finance lending protocol built using The Graph Protocol. It follows the Messari 3.1.0 lending schema standard and indexes data across multiple blockchain networks including Hedera, Plume, Base Sepolia, BSC Testnet, Monad Testnet, and Sepolia.

## Common Development Commands

### Build and Code Generation
- `npm run codegen` - Generate TypeScript types from GraphQL schema and ABIs
- `npm run build` - Build the subgraph for deployment
- `npm run format` - Format code using Prettier

### External Build System
The project uses a custom build system via the `messari` command:
- `messari build isle-finance-v1-<network>` - Build subgraph for specific network

## Architecture

### Core Protocol Components
The subgraph indexes four main smart contract templates:
- **PoolAddressesProvider** - Factory contract that creates lending pools
- **LoanManager** - Handles loan lifecycle (requests, funding, repayment, defaults)
- **PoolConfigurator** - Manages pool settings, limits, fees, and cover
- **Pool** - Core lending pool for deposits/withdrawals
- **WithdrawalManager** - Handles withdrawal requests and processing

### Data Sources and Templates
- **Data Source**: `PoolAddressesProvider` contract that emits `ProxyCreated` events
- **Templates**: Dynamically created contract instances for each pool deployment
- **Event Handlers**: Located in `protocols/isle-finance-v1/src/mapping.ts`

### Schema Structure
Follows Messari 3.1.0 lending protocol schema:
- **Protocol-level**: `LendingProtocol` entity tracking TVL, users, revenue
- **Market-level**: `Market` entity for individual lending pools
- **Account-level**: `Account` and `Position` entities for user interactions
- **Event-level**: `Deposit`, `Withdraw`, `Borrow`, `Repay`, `Liquidate` events

### Isle-Specific Features
- **Loan Tracking**: Custom `_Loan` entity for loan lifecycle management
- **Withdrawal Cycles**: `_WithdrawalRequest` and `_ExitConfigs` for withdrawal windows
- **Pool Cover**: Admin-managed insurance fund tracking
- **Receivable Tokens**: NFT representation of loan positions

### Multi-Network Configuration
- Network-specific configurations in `protocols/isle-finance-v1/config/deployments/`
- Template-based deployment using Mustache templating in `protocols/isle-finance-v1/config/templates/`
- Supported networks: Hedera Mainnet/Testnet, Plume Mainnet/Testnet/Devnet, Base Sepolia, BSC Testnet, Monad Testnet, Sepolia

### SDK Integration
- Custom lending SDK in `sdk/` directory following Messari standards
- Key classes: `DataManager`, `account.ts`, `manager.ts`, `position.ts`, `snapshots.ts`
- Revenue tracking via `DataManager.addProtocolRevenue()` and `DataManager.addSupplyRevenue()`
- Standard workflow: Update market data before creating event entities

## File Structure
```
/protocols/isle-finance-v1/src/mapping.ts - Main event handlers
/schema.graphql - GraphQL schema (Messari 3.1.0 lending)
/subgraph.yaml - Network-specific subgraph manifest
/abis/ - Contract ABIs for type generation
/sdk/ - Lending SDK utilities
```

## Development Notes

- Uses AssemblyScript for event handler logic
- Price feeds and token data handled via ERC20 contract calls
- Revenue calculations based on interest payments and fees
- Position tracking for both collateral and borrowing sides
- Snapshot entities for historical data aggregation
- Follows Graph Protocol best practices for entity relationships and indexing performance