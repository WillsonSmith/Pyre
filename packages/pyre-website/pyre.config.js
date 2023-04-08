export default () => {
  return {
    input: 'src',
    output: {
      dir: 'pyre',
    },
    assetStrategy: 'symlink',
    markdownEnabledComponents: ['pyre-button', 'pyre-card', 'pyre-checkbox', 'pyre-chip'],
  };
};
