// components/DonationAmountInput.tsx
import { useState } from 'react';

interface DonationAmountInputProps {
  onAmountChange: (amount: number | null) => void;
  currency?: string;
  isDisabled?: boolean;
  initialAmount?: number | null;
}

const predefinedAmounts = [10, 25, 50, 100, 250, 500];

const DonationAmountInput: React.FC<DonationAmountInputProps> = ({ onAmountChange, currency = 'USD', isDisabled, initialAmount = null }) => {
  const [customAmount, setCustomAmount] = useState<string>(initialAmount && !predefinedAmounts.includes(initialAmount) ? String(initialAmount) : '');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(initialAmount && predefinedAmounts.includes(initialAmount) ? initialAmount : null);

  // Effect to set initial amount if provided and not already set
  // This is simplified as initialAmount is now part of useState initialization.
  // If initialAmount could change dynamically AFTER mount and you wanted to reflect that,
  // an useEffect would be needed. For one-time initialization, useState is sufficient.

  const handlePredefinedAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    onAmountChange(amount);
  };

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
      const numericValue = parseFloat(value);
      onAmountChange(isNaN(numericValue) ? null : numericValue);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {predefinedAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handlePredefinedAmountClick(amount)}
            className={`px-4 py-3 rounded-md border text-center font-medium transition-colors
                        ${selectedAmount === amount 
                          ? 'bg-blue-primary text-white border-blue-primary' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            {currency}{amount}
          </button>
        ))}
      </div>
      <div>
        <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Or enter custom amount ({currency})
        </label>
        <input
          type="text"
          id="customAmount"
          name="customAmount"
          value={customAmount}
          onChange={handleCustomAmountChange}
          placeholder="e.g., 75"
          disabled={isDisabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-primary focus:border-blue-primary"
        />
      </div>
    </div>
  );
};

export default DonationAmountInput;
