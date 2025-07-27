# Payment Page Component

## Overview

The Payment Page component allows users to interact with payment links. It supports both fixed and global payment links with different payment flows.

## Features

### Fixed Payment Links
- Shows the exact amount to be paid
- Single "Pay" button for the fixed amount
- Direct payment to the link creator

### Global Payment Links
- Shows total contributions and contributor count
- Input field for custom contribution amount
- Flexible payment amounts

## Routes

- **URL Pattern**: `/pay/:linkId`
- **Example**: `/pay/abc123def456` or `/pay/fixed-50-xlm`

## API Integration

The component integrates with the following API endpoints:

- `GET /api/payment-links/:linkId` - Get payment link details
- `POST /api/payment-links/pay-fixed` - Pay fixed amount
- `POST /api/payment-links/contribute` - Contribute to global link

## User Flow

1. **Load Payment Link**: User visits `/pay/:linkId`
2. **View Details**: Payment link information is displayed
3. **Connect Wallet**: If not connected, user must connect their Stellar wallet
4. **Make Payment**: 
   - Fixed: Click "Pay X XLM" button
   - Global: Enter amount and click "Contribute"
5. **Success**: Redirect to dashboard after successful payment

## Styling

The component uses a modern, glassmorphism design with:
- Gradient backgrounds
- Blur effects
- Animated elements
- Responsive design
- Stellar-themed colors (#00ff88)

## Testing

To test the payment page:

1. **Fixed Payment Link**: Visit `/pay/fixed-50-xlm`
2. **Global Payment Link**: Visit `/pay/global-donation-link`

## Dependencies

- React Router for navigation
- Stellar Wallet Context for wallet connection
- API Service for backend communication
- Custom CSS for styling 