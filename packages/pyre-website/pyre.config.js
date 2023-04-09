export default () => {
  return {
    input: 'src',
    output: {
      dir: 'pyre',
    },
    assetStrategy: 'symlink',
    build: {
      assetStrategy: 'copy',
    },
    markdownEnabledComponents: ['pyre-button', 'pyre-card', 'pyre-checkbox', 'pyre-chip'],
  };
};
