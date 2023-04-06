export default () => {
  return {
    input: 'src',
    output: {
      dir: 'dist',
    },
    assetStrategy: 'symlink', // symlink, copy, none
  };
};
