/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,tsx,jsx}"],
    theme: {
        extend: {
            gridTemplateColumns: {
                autofit: "repeat(auto-fit, minmax(300px, 1fr))",
                autofill: "repeat(auto-fill, minmax(calc(50% - 10px), 300px))",
            },
        },
    },
    plugins: [],
};
