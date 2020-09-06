module.exports = {
  purge: ['./src/**/*.ejs', './src/**/*.md'],
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ['responsive', 'hover'],
    borderColor: ['responsive', 'hover'],
    borderStyle: ['responsive', 'last', 'hover'],
    borderWidth: ['responsive', 'hover'],
    transform: ['responsive', 'hover'],
  },
  plugins: [],
};
