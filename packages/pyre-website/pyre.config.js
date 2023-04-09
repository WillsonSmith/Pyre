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
  };
};
