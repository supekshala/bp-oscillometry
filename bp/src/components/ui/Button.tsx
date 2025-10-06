import { forwardRef, ButtonHTMLAttributes } from 'react';

const buttonVariants = {
    default: 'bg-primary-blue text-white hover:bg-primary-blue-dark',
    ghost: 'hover:bg-gray-100 hover:text-text-primary',
};

const sizeVariants = {
    default: 'h-10 py-2 px-4',
    icon: 'h-10 w-10',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonVariants;
    size?: keyof typeof sizeVariants;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                className={`inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue disabled:opacity-50 disabled:pointer-events-none ${buttonVariants[variant]} ${sizeVariants[size]} ${className}`}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
