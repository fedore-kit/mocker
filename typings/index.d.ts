import { Middleware, Context } from 'koa';

export interface MockerOption {
  prefix?: string;
}


export interface MockOption {
  path: string;
  method?: string;
  mock?: any;
  middlewares?: Middleware[];
}

export interface MockerConstructor {
  new(options?: MockerOption): Instance;
}

export interface Instance {
  mock(options: MockOption): void;
  routes(): Middleware;
  loadDir(path: string, deep?: boolean, encoding?: string): void;
}

export const Mocker: MockerConstructor;
