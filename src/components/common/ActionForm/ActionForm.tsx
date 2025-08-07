import React from 'react';
import TokenSendForm from '../../forms/TokenSendForm';
import './ActionForm.css';

export interface ActionData {
  type: string;
  component: string;
  formData?: {
    steps?: any[];
    validation?: any;
    prefill?: any;
  };
}

interface ActionFormProps {
  action: ActionData;
  onComplete: (result: any) => void;
  onCancel: () => void;
}

const ActionForm: React.FC<ActionFormProps> = ({
  action,
  onComplete,
  onCancel
}) => {
  const renderForm = () => {
    switch (action.component) {
      case 'TokenSendForm':
        return (
          <TokenSendForm
            prefill={action.formData?.prefill}
            onComplete={onComplete}
            onCancel={onCancel}
          />
        );
      
      // Add more form types here as needed
      // case 'TokenSwapForm':
      //   return <TokenSwapForm ... />;
      // case 'PaymentLinkForm':
      //   return <PaymentLinkForm ... />;
      
      default:
        return (
          <div className="action-form-error">
            <h3>Unsupported Action</h3>
            <p>The requested action type "{action.component}" is not yet supported.</p>
            <button className="btn-secondary" onClick={onCancel}>
              Close
            </button>
          </div>
        );
    }
  };

  return (
    <div className="action-form chat-context">
      {renderForm()}
    </div>
  );
};

export default ActionForm; 