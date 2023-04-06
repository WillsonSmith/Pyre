export default () => {
  return {
    input: 'src',
    output: {
      dir: 'pyre',
    },
    watch: {
      assetStrategy: 'symlink', // symlink, copy, none
      output: {
        dir: 'pyre',
      },
    },
    build: {
      assetStrategy: 'copy', // symlink, copy, none
    },
  };
};
