import React, { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    onClick: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'danger';
}

const variantStyles = {
    primary: 'bg-blue-primary text-white border-blue-secondary',
    secondary: 'bg-blue-secondary text-white border-gray-700',
    danger: 'bg-red text-white border-red-700',
};

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', variant = 'primary' }) => {
    const variantClass = variantStyles[variant];

    return (
        <button
            className={`px-6 py-2 rounded-md font-semibold transition-transform duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${variantClass} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;