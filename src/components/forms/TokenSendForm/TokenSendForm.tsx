import React from 'react';
import MultiStepForm from '../../common/MultiStepForm';
import type { FormStep } from '../../common/MultiStepForm';
import { AmountStep, RecipientStep, ConfirmationStep } from '../../common/FormSteps/TokenSendStep';
import apiService from '../../../services/api';
import './TokenSendForm.css';

interface TokenSendFormProps {
  prefill?: {
    amount?: string;
    asset?: string;
    recipient?: string;
  };
  onComplete: (result: any) => void;
  onCancel: () => void;
}

const TokenSendForm: React.FC<TokenSendFormProps> = ({
  prefill = {},
  onComplete,
  onCancel
}) => {
  const steps: FormStep[] = [
    {
      id: 'amount',
      title: 'Amount',
      component: AmountStep,
      prefill: prefill
    },
    {
      id: 'recipient',
      title: 'Recipient',
      component: RecipientStep,
      prefill: prefill
    },
    {
      id: 'confirmation',
      title: 'Confirm',
      component: ConfirmationStep
    }
  ];

  const handleSubmit = async (formData: any) => {
    try {
      // Extract data from form steps
      const amountData = formData.amount;
      const recipientData = formData.recipient;
      const confirmationData = formData.confirmation;

      // Prepare transaction data
      const transactionData = {
        toAddress: recipientData.recipient,
        amount: amountData.amount,
        asset: amountData.asset,
        memo: confirmationData.memo || ''
      };

      // Send transaction via API
      const response = await apiService.sendPayment(
        transactionData.toAddress,
        transactionData.amount,
        transactionData.asset,
        transactionData.memo
      );

      if (response.success) {
        onComplete({
          success: true,
          transactionHash: response.data?.transactionHash,
          message: 'Transaction sent successfully!',
          data: transactionData
        });
      } else {
        throw new Error(response.message || 'Failed to send transaction');
      }
    } catch (error) {
      onComplete({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to send transaction'
      });
    }
  };

  return (
    <div className="token-send-form-container">
      <MultiStepForm
        steps={steps}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        title="Send Tokens"
        className="token-send-form chat-context"
      />
    </div>
  );
};

export default TokenSendForm; 