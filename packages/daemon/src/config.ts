import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface AppConfig {
  sqliteUrl: string;
  http: {
    port: number;
  };
  tsinghuaGit: {
    oauthAppId: string;
    oauthAppSecret: string;
    oauthRedirectUri: string;
  };
  gitea: {
    baseUrl: string;
    token: string;
  };
  adminToken: string;
}

const defaultConfig: AppConfig = {
  sqliteUrl: '',
  http: {
    port: 8000,
  },
  tsinghuaGit: {
    oauthAppId: '',
    oauthAppSecret: '',
    oauthRedirectUri: 'http://localhost:8000/api/register/callback',
  },
  gitea: {
    baseUrl: 'http://localhost:3000/api/v1/',
    token: '',
  },
  adminToken: '',
};

function readLocalConfig(): Partial<AppConfig> {
  const configPath = resolve(import.meta.dirname, '../config.json');
  if (!existsSync(configPath)) {
    return {};
  }

  return JSON.parse(readFileSync(configPath, 'utf8')) as Partial<AppConfig>;
}

function envString(name: string, fallback: string) {
  if (fallback) {
    return process.env[name] ?? fallback;
  } else {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Environment variable ${name} is required but not set`);
    }
    return value;
  }
}

function envNumber(name: string, fallback: number) {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

const localConfig = readLocalConfig();

const config: AppConfig = {
  sqliteUrl: envString('SQLITE_URL', localConfig.sqliteUrl ?? defaultConfig.sqliteUrl),
  http: {
    port: envNumber('PORT', localConfig.http?.port ?? defaultConfig.http.port),
  },
  tsinghuaGit: {
    oauthAppId: envString(
      'TSINGHUA_GIT_OAUTH_APP_ID',
      localConfig.tsinghuaGit?.oauthAppId ?? defaultConfig.tsinghuaGit.oauthAppId,
    ),
    oauthAppSecret: envString(
      'TSINGHUA_GIT_OAUTH_APP_SECRET',
      localConfig.tsinghuaGit?.oauthAppSecret ?? defaultConfig.tsinghuaGit.oauthAppSecret,
    ),
    oauthRedirectUri: envString(
      'TSINGHUA_GIT_OAUTH_REDIRECT_URI',
      localConfig.tsinghuaGit?.oauthRedirectUri ?? defaultConfig.tsinghuaGit.oauthRedirectUri,
    ),
  },
  gitea: {
    baseUrl: envString('GITEA_BASE_URL', localConfig.gitea?.baseUrl ?? defaultConfig.gitea.baseUrl),
    token: envString('GITEA_TOKEN', localConfig.gitea?.token ?? defaultConfig.gitea.token),
  },
  adminToken: envString('ADMIN_TOKEN', localConfig.adminToken ?? defaultConfig.adminToken),
};

export default config;
