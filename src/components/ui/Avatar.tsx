import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  colorClass?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
};

export default function Avatar({ name, colorClass = 'bg-indigo-500', size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        sizeStyles[size],
        colorClass,
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
