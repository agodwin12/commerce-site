import { useEffect } from 'react';

const TawkToChat = () => {
    useEffect(() => {
        // Declare Tawk_API on window object to avoid conflicts
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        (function(){
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/68dee5047cc62b1950a04107/1j6jat8rm';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1, s0);
        })();

        return () => {
            // Cleanup
            const tawkScript = document.querySelector('script[src*="tawk.to"]');
            if (tawkScript && tawkScript.parentNode) {
                tawkScript.parentNode.removeChild(tawkScript);
            }
        };
    }, []);

    return null;
};

export default TawkToChat;