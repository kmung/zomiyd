// components/DonorInfoInput.tsx

interface DonorInfoInputProps {
  name: string;
  email: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
}

const DonorInfoInput: React.FC<DonorInfoInputProps> = ({ name, email, onNameChange, onEmailChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="donorName" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="donorName"
          name="donorName"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-primary focus:border-blue-primary sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="donorEmail" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="donorEmail"
          name="donorEmail"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-primary focus:border-blue-primary sm:text-sm"
        />
      </div>
    </div>
  );
};

export default DonorInfoInput;
