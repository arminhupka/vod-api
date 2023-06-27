import * as process from 'process';

export const isDev = (): boolean => {
  return process.env.NODE_ENV !== 'prod';
};

export const protocol = (): string => {
  if (!isDev()) {
    return 'https://';
  }

  return 'http://';
};

export const NODE_ENV = process.env.NODE_ENV;
