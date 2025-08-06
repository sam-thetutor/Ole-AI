# Dasta

A comprehensive payment platform built with React, Node.js, and Soroban smart contracts.

## Documentation

All documentation has been organized in the `docs/` folder:

- **General Documentation**: `docs/general/`
  - [Main README](docs/general/README.md)
  - [Tests Documentation](docs/general/README.md)
  - [Repomix Output](docs/general/repomix-output.md)

- **Backend Documentation**: `docs/backend/`
  - [Backend README](docs/backend/README.md)
  - [Username Feature](docs/backend/USERNAME_FEATURE.md)
  - [USDC Integration Guide](docs/backend/USDC_FUNDING_GUIDE.md)
  - [Environment Setup](docs/backend/ENVIRONMENT_SETUP.md)
  - [Wallet Service Modifications](docs/backend/WALLET_SERVICE_MODIFICATIONS.md)
  - [Funding README](docs/backend/FUNDING_README.md)
  - [USDC Issue Analysis](docs/backend/USDC_ISSUE_ANALYSIS.md)
  - [OpenAI Tool Selection](docs/backend/OPENAI_TOOL_SELECTION.md)
  - [Direct Tool Integration Report](docs/backend/DIRECT_TOOL_INTEGRATION_REPORT.md)
  - [Environment Summary](docs/backend/ENVIRONMENT_SUMMARY.md)
  - [USDC Integration README](docs/backend/USDC_INTEGRATION_README.md)
  - [Token Transfer README](docs/backend/TOKEN_TRANSFER_README.md)
  - [USDC Integration](docs/backend/USDC_INTEGRATION.md)
  - [Wallet Creation with USDC](docs/backend/WALLET_CREATION_WITH_USDC.md)
  - [Integration Summary](docs/backend/INTEGRATION_SUMMARY.md)
  - [USDC Integration Complete](docs/backend/USDC_INTEGRATION_COMPLETE.md)
  - [LangGraph Implementation](docs/backend/LANGGRAPH_IMPLEMENTATION.md)

- **Soroban Documentation**: `docs/soroban/`
  - [Soroban README](docs/soroban/README.md)
  - [Hello World Package README](docs/soroban/README.md)

- **Frontend Documentation**: `docs/frontend/`
  - [Payment Page README](docs/frontend/README.md)

## Project Structure

```
Dasta/
├── docs/              # All documentation
├── tests/             # All test files
├── src/               # Frontend React application
├── backend/           # Backend Node.js application
├── soroban/           # Soroban smart contracts
└── README.md          # This file
```

## Quick Start

1. **Frontend**: Navigate to the root directory and run `npm install && npm run dev`
2. **Backend**: Navigate to `backend/` and run `npm install && npm start`
3. **Soroban**: Navigate to `soroban/` and run `cargo build`

For detailed setup instructions, see the documentation in the `docs/` folder.

## Features

### Username Management
Users can set and manage their usernames through the AI agent:
- Set username: "set my username to crypto_king"
- Check username: "what's my username?"
- Check availability: "is crypto_king available?"
- Username display on dashboard
- Validation and uniqueness enforcement

## API Configuration

The frontend connects to the backend API for wallet authentication and data management. The API configuration is handled automatically:

- **Development**: Uses Vite proxy to avoid CORS issues
- **Production**: Connects directly to the production backend

If you need to customize the API endpoint, you can set the `VITE_API_BASE_URL` environment variable.

### Troubleshooting API Issues

If you encounter "Failed to fetch" errors when connecting wallets:

1. **Check Network Connectivity**: Ensure your internet connection is stable
2. **CORS Issues**: The backend needs to allow requests from your frontend domain
3. **Backend Status**: Verify the backend is running and accessible
4. **Retry Logic**: The app includes automatic retry logic for failed requests

For production deployments, ensure the backend CORS configuration includes your frontend domain. 