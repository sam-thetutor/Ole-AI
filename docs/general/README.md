# Tests Directory

This directory contains all test files organized by type and technology stack.

## Structure

```
tests/
├── frontend/          # React/TypeScript frontend tests
├── backend/           # Node.js/JavaScript backend tests
├── soroban/           # Soroban smart contract tests
└── README.md          # This file
```

## Frontend Tests (`frontend/`)

- **PaymentPageTest.tsx** - Test component for payment page functionality

## Backend Tests (`backend/`)

Contains 35 JavaScript test files for backend functionality:

### Core Test Files
- `test-account-mismatch.js`
- `test-account-state.js`
- `test-actual-wallet.js`
- `test-actual-wallet-transfer.js`
- `test-amount-conversion.js`
- `test-available-wallet-transfer.js`
- `test-create-account-transfer.js`
- `test-corrected-transfer.js`
- `test-database-wallets.js`
- `test-different-destination.js`
- `test-exact-pattern.js`
- `test-fresh-wallets.js`
- `test-large-amounts.js`
- `test-mainnet-comparison.js`
- `test-modified-wallet-service.js`
- `test-simple-transfer.js`
- `test-tiny-transfer.js`
- `test-transfer-direct.js`
- `test-usdc-transfer.js`
- `test-xlm-transfer.js`

### USDC Integration Tests
- `simple-usdc-test.js`
- `test-funding-integration.js`
- `test-integrated-funding.js`
- `test-langgraph.js`
- `test-new-wallet-creation.js`
- `test-usdc.js`
- `test-usdc-funding.js`
- `test-usdc-funding-complete.js`
- `test-usdc-funding-service.js`
- `test-usdc-funding-simple.js`
- `test-usdc-funding-with-existing-wallet.js`

### Debug Files
- `debug-account.js`
- `debug-underfunded-issue.js`
- `debug-xlm-transfer.js`

### Investigation Files
- `deep-account-investigation.js`
- `inspect-account.js`

### Environment Tests
- `test-environments.js`

## Soroban Tests (`soroban/`)

- **test.rs** - Rust tests for the hello-world smart contract

## Running Tests

### Frontend Tests
```bash
# Run frontend tests (if using a test runner like Jest)
npm test
```

### Backend Tests
```bash
# Navigate to backend directory
cd backend

# Run individual test files
node ../tests/backend/test-simple-transfer.js
node ../tests/backend/test-usdc-funding.js
```

### Soroban Tests
```bash
# Navigate to soroban directory
cd soroban

# Run contract tests
cargo test
```

## Notes

- The import path for `PaymentPageTest.tsx` has been updated in `src/App.tsx`
- The Soroban test module has been updated to include the moved test file
- All test files have been moved from their original locations to maintain a centralized test structure
- Backend test files include both core functionality tests and USDC integration tests 