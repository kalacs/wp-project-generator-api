// FYI: https://prettier.io/docs/en/configuration.html

module.exports = {
  printWidth: 100,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'all',
  quoteProps: 'as-needed',
  overrides: [
    {
      files: '.eslintrc.js',
      options: {
        printWidth: 999,
        singleQuote: true,
        quoteProps: 'preserve',
        trailingComma: 'all',
      },
    },
  ],
};
