import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import './MultiStepForm.css';

export interface FormStep {
  id: string;
  title: string;
  component: React.ComponentType<StepProps>;
  validation?: ValidationRules;
  prefill?: any;
}

export interface StepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  prefill?: any;
}

export interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface MultiStepFormProps {
  steps: FormStep[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  title: string;
  className?: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  initialData = {},
  onSubmit,
  onCancel,
  title,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const validateStep = (): boolean => {
    // No validation for now - always return true
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (isLastStep) {
        onSubmit(formData);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUpdate = (data: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [currentStepData.id]: data
    }));
  };

  const CurrentStepComponent = currentStepData.component;

  return (
    <div className={`multi-step-form ${className}`}>
      <div className="form-header">
        <h3 className="form-title">{title}</h3>
        <button className="form-close-btn" onClick={onCancel}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="form-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="step-indicators">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={`step-indicator ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              {index < currentStep ? (
                <Check size={16} />
              ) : (
                <span className="step-number">{index + 1}</span>
              )}
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="form-content">
        <CurrentStepComponent
          data={formData[currentStepData.id]}
          onUpdate={handleUpdate}
          onNext={handleNext}
          onBack={handleBack}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          prefill={currentStepData.prefill}
        />
      </div>

      {/* Error display removed for now */}

      <div className="form-actions">
        {!isFirstStep && (
          <button 
            className="form-btn form-btn-secondary"
            onClick={handleBack}
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}
        
        <div className="form-actions-right">
          <button 
            className="form-btn form-btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="form-btn form-btn-primary"
            onClick={handleNext}
          >
            {isLastStep ? 'Submit' : 'Next'}
            {!isLastStep && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm; 