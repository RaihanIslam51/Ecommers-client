import React from 'react';
import Image from 'next/image';

const CustomerAvatar = ({ name, image, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl'
    };

    const sizePixels = {
        sm: 32,
        md: 40,
        lg: 48,
        xl: 64
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const colors = [
        'bg-gray-200',
        'bg-gray-300',
        'bg-gray-200',
        'bg-gray-300',
        'bg-gray-200',
        'bg-gray-300',
        'bg-gray-200',
        'bg-gray-300'
    ];

    const getColorFromName = (name) => {
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    if (image) {
        return (
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden relative`}>
                <Image
                    src={image}
                    alt={name}
                    width={sizePixels[size]}
                    height={sizePixels[size]}
                    className="rounded-full object-cover"
                />
            </div>
        );
    }

    return (
        <div 
            className={`${sizeClasses[size]} ${getColorFromName(name)} rounded-full flex items-center justify-center text-black font-semibold`}
        >
            {getInitials(name)}
        </div>
    );
};

export default CustomerAvatar;
