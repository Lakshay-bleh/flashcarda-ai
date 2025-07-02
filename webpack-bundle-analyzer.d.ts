// types/webpack-bundle-analyzer.d.ts
declare module 'webpack-bundle-analyzer' {
  import { Plugin } from 'webpack';

  export class BundleAnalyzerPlugin extends Plugin {
    constructor(options?: {
      analyzerMode?: 'server' | 'static' | 'disabled';
      analyzerHost?: string;
      analyzerPort?: number | 'auto';
      reportFilename?: string;
      defaultSizes?: 'parsed' | 'stat' | 'gzip';
      openAnalyzer?: boolean;
      generateStatsFile?: boolean;
      statsFilename?: string;
      statsOptions?: unknown;
      logLevel?: 'info' | 'warn' | 'error' | 'silent';
    });
  }
}
