export default () => {
  return {
    input: 'src',
    output: {
      dir: 'pyre',
    },
    watch: {
      assetStrategy: 'symlink', // symlink, copy, none
      output: {},
    },
    build: {
      assetStrategy: 'symlink', // symlink, copy, none
    },
    markdownEnabledComponents: ['pyre-button', 'pyre-card', 'pyre-checkbox', 'pyre-chip'],
  };
};
