import OpenapiValidator from 'openapi-validator-middleware'

import { ValidationError } from '~/errors'

OpenapiValidator.init('openapi-schema.yaml', {
  ajvConfigBody: {
    coerceTypes: true,
  },
  errorFormatter: (errors) => new ValidationError(errors),
})

export const validationMiddleware = OpenapiValidator.validate.bind(OpenapiValidator)
