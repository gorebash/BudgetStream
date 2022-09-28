import { AzureFunction, Context } from '@azure/functions';
import * as jwt from 'express-jwt';
import * as jwks from 'jwks-rsa';
import {
  AuthMiddlewareOptions,
  AuthReqest,
  MiddleWareRequest,
} from './AuthMiddleware.types';

const DEFAULT_OPTIONS: AuthMiddlewareOptions = {
  domain: process.env.AUTH_DOMAIN,
  audience: process.env.AUTH_AUDIENCE,
};

export interface AuthMiddlewareProps {
  options?: AuthMiddlewareOptions;
  next: AzureFunction;
}

/**
 * To use this middleware you will need to set some env variables
 *
 * AUTH_DOMAIN=<the auth0 domain this is tied to>
 * AUTH_AUDIENCE=<the api identifier in auth0>
 *
 */
export class AuthMiddleware {
  private options: AuthMiddlewareOptions;
  private next: AzureFunction;

  private get domainUrl(): string {
    return `https://${this.options.domain}`;
  }

  private get middleware(): jwt.RequestHandler {
    const options = this.options;
    const domainUrl = this.domainUrl;

    return jwt({
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 15,
        jwksUri: `${domainUrl}/.well-known/jwks.json`,
      }),
      issuer: `${domainUrl}/`,
      audience: options.audience,
      algorithms: ['A256GCM', 'RS256'],
    });
  }

  /**
   * Export this function as the authenticated azure function
   *
   * e.g.
   * ...
   * const authed = new AuthMiddleware({
   *  next: someAzureFunctionToCallIfAuthenticated,
   * });
   *
   * export default authed.func;
   * ...
   *
   * The request here used AuthRequest which adds 2 properties
   * to the request: user, userId.
   */
  func = (context: Context, req: AuthReqest) =>
    this.middleware(req as MiddleWareRequest, null, (err: any) => {
      if (err) {
        context.res = {
          status: err.status || 500,
          body: {
            message: err.message,
          },
        };

        console.log(err);
        return context.done();
      }

      // Set userId apart from user
      req.userId = req.user.sub;

      return this.next(context, req);
    });

  /**
   * @param param0 options: required options, defaults to values set in the env
   * ************* next: the function to call next
   *
   * Options are validated during instantiation of this class.
   */
  constructor({ options = DEFAULT_OPTIONS, next }: AuthMiddlewareProps) {
    try {
      this.validateOptions(options);
      this.next = next;
      this.options = options;
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }

  private validateOptions(options: AuthMiddlewareOptions): boolean {
    if (!options || !(options instanceof Object)) {
      throw new Error('The options must be an object.');
    }

    if (!options.audience || options.audience.length === 0) {
      throw new Error('The Auth0 Client ID has to be provided.');
    }

    if (!options.domain || options.domain.length === 0) {
      throw new Error('The Auth0 Domain has to be provided.');
    }

    return true;
  }
}
