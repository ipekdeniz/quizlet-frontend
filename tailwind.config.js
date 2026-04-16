export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:    '#09090f',
        surf:  '#111118',
        surf2: '#19191f',
        bord:  '#1f2030',
        bord2: '#2d2f45',
        gold:  '#c9a96e',
        goldb: '#e4c98a',
        teal:  '#4ecdc4',
        ruby:  '#e05c5c',
        ink:   '#e2ddd6',
        muted: '#5d607a',
        faint: '#2b2d3e',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['"Syne"', 'system-ui', 'sans-serif'],
        mono:  ['"IBM Plex Mono"', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
