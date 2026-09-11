module.exports = {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md}', './src/content/posts/**/*.md'],
  theme: {
    extend: {
      colors: {
        primary: '#60a5fa',
        bg: '#0f1720'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.700'),
            a: { color: 'var(--accent)', textDecoration: 'none', '&:hover': { color: theme('colors.indigo.600') } },
            h1: { fontWeight: '700' },
            h2: { fontWeight: '700' },
            h3: { fontWeight: '700' },
            'code': { backgroundColor: theme('colors.slate.800'), color: theme('colors.slate.100'), padding: '0.125rem 0.25rem', borderRadius: '6px' },
            pre: { backgroundColor: theme('colors.slate.800'), color: theme('colors.slate.100'), padding: '1rem', borderRadius: '8px' },
            'blockquote': { color: theme('colors.slate.600'), borderLeftColor: theme('colors.slate.700') },
            '.lead': { fontSize: '1.125rem', color: theme('colors.slate.600') }
          }
        },
        dark: {
          css: {
            color: theme('colors.slate.300'),
            a: { color: 'var(--accent)', '&:hover': { color: theme('colors.indigo.400') } },
            h1: { fontWeight: '700' },
            h2: { fontWeight: '700' },
            h3: { fontWeight: '700' },
            code: { backgroundColor: theme('colors.slate.800'), color: theme('colors.slate.100') },
            pre: { backgroundColor: theme('colors.slate.900'), color: theme('colors.slate.100') },
            blockquote: { color: theme('colors.slate.400'), borderLeftColor: theme('colors.slate.700') },
            '.lead': { fontSize: '1.125rem', color: theme('colors.slate.400') }
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
