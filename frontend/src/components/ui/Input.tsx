import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string;
    containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, label, containerClassName, ...props }, ref) => {
        return (
            <div className={cn('space-y-1', containerClassName)}>
                {label && <label className="text-sm font-medium dark:text-gray-200">{label}</label>}
                <div className="relative flex items-center">
                    {icon && (
                        <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'w-full bg-white dark:bg-card-dark border dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white placeholder:text-slate-400',
                            icon ? 'pl-10 pr-4' : 'px-4',
                            'py-3 text-sm',
                            className
                        )}
                        {...props}
                    />
                </div>
            </div>
        );
    }
);
Input.displayName = 'Input';
