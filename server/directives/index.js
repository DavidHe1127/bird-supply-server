const {AuthorizationError} = require('../errors');
const cognito = require('../cognito');

export const isAuthenticated = (next, source, args, context) => {
  const token = context.headers.authorization;
  if (!token) {
    throw new AuthorizationError({
      message: 'You must supply a JWT for authorization!',
    });
  }
  try {
    const decoded = cognito.verify(token);

    context.user = decoded;
    return next();
  } catch (err) {
    throw new AuthorizationError({
      message: 'You are not authorized.',
    });
  }
};

export const hasScope = (next, source, args, context) => {
  const token = context.headers.authorization;
  const expectedScopes = args.scope;
  if (!token) {
    throw new AuthorizationError({
      message: 'You must supply a JWT for authorization!',
    });
  }
  try {
    const decoded = cognito.verify(token);
    const scopes = decoded.scope.split(' ');
    if (expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
      return next();
    }
  } catch (err) {
    return Promise.reject(
      new AuthorizationError({
        message: `You are not authorized. Expected scopes: ${expectedScopes.join(
          ', ',
        )}`,
      }),
    );
  }
};