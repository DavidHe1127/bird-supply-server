import auth from '../auth';
import { UnauthorizedError, UnauthenticatedError } from '../errors' ;

const data = {
  type: 'AUTH'
};

const directiveResolvers = {
  isAuthenticated: (next, source, args, context) => {
    const token = context.headers.Authorization;
    if (!token) {
      throw new UnauthenticatedError({
        message: 'You must supply a JWT for authorization!',
        data
      });
    }

    try {
      const decoded = auth.verify(token.slice(7));
      context.user = decoded;
      return next();
    } catch (err) {
      throw new UnauthenticatedError({
        message: err.message,
        data
      });
    }
  },

  hasScope: (next, source, args, context) => {
    const token = context.headers.Authorization;
    const expectedScopes = args.scope;
    if (!token) {
      throw new AuthorizationError({
        message: 'You must supply a JWT for authorization!'
      });
    }
    try {
      const decoded = auth.verify(token);
      const scopes = decoded.scope.split(' ');
      if (expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
        return next();
      }
    } catch (err) {
      return Promise.reject(
        new AuthorizationError({
          message: `You are not authorized. Expected scopes: ${expectedScopes.join(
            ', '
          )}`
        })
      );
    }
  }
};

export default directiveResolvers;
