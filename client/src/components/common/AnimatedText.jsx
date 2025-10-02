// src/components/common/AnimatedText.jsx
import React, { useEffect, useState } from 'react';

const AnimatedText = ({
                          children,
                          direction = 'left',
                          delay = 0,
                          duration = 0.8
                      }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    const getTransform = () => {
        if (!isVisible) {
            switch (direction) {
                case 'left':
                    return 'translateX(-100px)';
                case 'right':
                    return 'translateX(100px)';
                case 'top':
                    return 'translateY(-100px)';
                case 'bottom':
                    return 'translateY(100px)';
                default:
                    return 'translateX(-100px)';
            }
        }
        return 'translate(0, 0)';
    };

    return (
        <div
            style={{
                transform: getTransform(),
                opacity: isVisible ? 1 : 0,
                transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
        >
            {children}
        </div>
    );
};

export default AnimatedText;