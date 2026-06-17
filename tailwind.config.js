var config = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    deep: '#09345B',
                    primary: '#005B96',
                    accent: '#C08A2B',
                    soft: '#EEF3F8'
                }
            },
            boxShadow: {
                panel: '0 10px 30px rgba(9, 52, 91, 0.12)'
            }
        }
    },
    plugins: []
};
export default config;
