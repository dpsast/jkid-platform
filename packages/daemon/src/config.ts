import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface AppConfig {
  sqliteUrl: string;
  http: {
    port: number;
  };
  basePath: string;
  publicBaseUrl: string;
  tsinghuaGit: {
    oauthAppId: string;
    oauthAppSecret: string;
    oauthRedirectUri: string;
  };
  zitadel: {
    baseUrl: string;
    organizationId: string;
    token: string;
  };
  adminToken: string;
}

const defaultConfig: AppConfig = {
  sqliteUrl: '',
  http: {
    port: 8000,
  },
  basePath: '',
  publicBaseUrl: 'http://localhost:8000',
  tsinghuaGit: {
    oauthAppId: '',
    oauthAppSecret: '',
    oauthRedirectUri: '',
  },
  zitadel: {
    baseUrl: '',
    organizationId: '',
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
const basePath = (process.env.BASE_PATH ?? localConfig.basePath ?? defaultConfig.basePath).replace(/\/$/, '');
const publicBaseUrl = (process.env.PUBLIC_BASE_URL ?? localConfig.publicBaseUrl ?? defaultConfig.publicBaseUrl).replace(
  /\/$/,
);

const config: AppConfig = {
  sqliteUrl: envString('SQLITE_URL', localConfig.sqliteUrl ?? defaultConfig.sqliteUrl),
  http: {
    port: envNumber('PORT', localConfig.http?.port ?? defaultConfig.http.port),
  },
  basePath,
  publicBaseUrl,
  tsinghuaGit: {
    oauthAppId: envString(
      'TSINGHUA_GIT_OAUTH_APP_ID',
      localConfig.tsinghuaGit?.oauthAppId ?? defaultConfig.tsinghuaGit.oauthAppId,
    ),
    oauthAppSecret: envString(
      'TSINGHUA_GIT_OAUTH_APP_SECRET',
      localConfig.tsinghuaGit?.oauthAppSecret ?? defaultConfig.tsinghuaGit.oauthAppSecret,
    ),
    oauthRedirectUri:
      process.env.TSINGHUA_GIT_OAUTH_REDIRECT_URI ??
      localConfig.tsinghuaGit?.oauthRedirectUri ??
      `${publicBaseUrl}/api/register/callback`,
  },
  zitadel: {
    baseUrl: envString('ZITADEL_URL', localConfig.zitadel?.baseUrl ?? defaultConfig.zitadel.baseUrl),
    organizationId: envString(
      'ZITADEL_ORGANIZATION_ID',
      localConfig.zitadel?.organizationId ?? defaultConfig.zitadel.organizationId,
    ),
    token: envString('ZITADEL_TOKEN', localConfig.zitadel?.token ?? defaultConfig.zitadel.token),
  },
  adminToken: envString('ADMIN_TOKEN', localConfig.adminToken ?? defaultConfig.adminToken),
};

export default config;
