import 'dotenv/config';

export interface AppConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  logLevel: 'info' | 'debug' | 'warn' | 'error';
}

export function loadConfig(): AppConfig {
  return {
    port: Number(process.env.PORT ?? 3000),
    nodeEnv: (process.env.NODE_ENV ?? 'development') as AppConfig['nodeEnv'],
    logLevel: (process.env.LOG_LEVEL ?? 'info') as AppConfig['logLevel'],
  };
}
