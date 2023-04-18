export const environment = {
  production: true
};

export const IS_SELFHOST = true;

export const ENABLE_ANALYTICS = false;

export const STRIPE_PK = '';

export const API_BASE_URL = `${window.location.origin}/api/`;

export const CORS_PROXY_BASE_URL = process.env.PROXY_BASE_URL ? process.env.PROXY_BASE_URL : null;
export const GRIP_WS_URL = null;

export const SENTRY_SAMPLE_RATE = 0;
