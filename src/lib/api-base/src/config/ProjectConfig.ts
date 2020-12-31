export interface ProjectConfig {
  readonly name: string;
  readonly version: string;
  readonly config: {
    readonly port: number;
  };
}

export const getProjectConfig = (): ProjectConfig => {
  return {
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
    config: {
      port: parseInt(process.env.npm_package_config_port ?? '80', 10),
    },
  } as ProjectConfig;
};
