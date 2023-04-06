export interface PyreConfigObject {
  srcDir: string;
  dest: {
    dir: string;
  };
  assetStrategy: 'symlink' | 'copy' | 'none';
}

export type PyreConfig = () => Promise<PyreConfigObject>;
