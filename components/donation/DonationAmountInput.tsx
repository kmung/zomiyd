
import { useState, useEffect } from 'react';

interface DonationAmountInputProps {
  onAmountChange: (amount: number | null) => void;
  currency?: string;
  isDisabled?: boolean;
  value: number | null; // Changed from initialAmount to value
}

const predefinedAmounts = [10, 25, 50, 100, 250, 500];

const DonationAmountInput: React.FC<DonationAmountInputProps> = ({ onAmountChange, currency = 'USD', isDisabled, value }) => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  useEffect(() => {
    // Sync with external value prop
    if (value === null) {
      setSelectedAmount(null);
      setCustomAmount('');
    } else if (predefinedAmounts.includes(value)) {
      setSelectedAmount(value);
      setCustomAmount('');
    } else {
      setSelectedAmount(null);
      setCustomAmount(String(value));
    }
  }, [value]);

  const handlePredefinedAmountClick = (amountValue: number) => {
    // setSelectedAmount(amountValue); // Handled by useEffect via prop change
    // setCustomAmount(''); // Handled by useEffect
    onAmountChange(amountValue);
  };

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(inputValue)) {
      // setCustomAmount(inputValue); // Handled by useEffect via prop change
      // setSelectedAmount(null); // Handled by useEffect
      const numericValue = parseFloat(inputValue);
      onAmountChange(isNaN(numericValue) ? null : numericValue);
    } else if (inputValue === '') { // Allow clearing the input
      // setCustomAmount(''); // Handled by useEffect
      // setSelectedAmount(null); // Handled by useEffect
      onAmountChange(null);
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
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'}`}
            disabled={isDisabled}
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
