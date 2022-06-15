/* eslint-disable max-classes-per-file */

class RequestError extends Error {
  constructor(message = 'Bad request.', statusCode = 400) {
    super()
    this.name = 'RequestError'
    this.message = message
    this.statusCode = statusCode
    Error.captureStackTrace(this, RequestError)
  }
}

class InsufficientDataError extends RequestError {
  constructor(...args) {
    super(...args)
    this.name = 'InsufficientDataError'
    this.message = 'Insufficient data to fulfill the request.'
    this.statusCode = 400
    Error.captureStackTrace(this, InsufficientDataError)
  }
}

class ForbiddenDataError extends RequestError {
  constructor(...args) {
    super(...args)
    this.name = 'ForbiddenDataError'
    this.message = 'Forbidden data in request.'
    this.statusCode = 400
    Error.captureStackTrace(this, ForbiddenDataError)
  }
}

class ResourceNotFoundError extends RequestError {
  constructor(...args) {
    super(...args)
    this.name = 'ResourceNotFoundError'
    this.message = 'The requested resource does not exist.'
    this.statusCode = 404
    Error.captureStackTrace(this, ResourceNotFoundError)
  }
}

export class DuplicateResourceError extends RequestError {
  constructor(message = 'Resource already exists.', statusCode = 409) {
    super()
    this.name = 'DuplicateResourceError'
    this.message = message
    this.statusCode = statusCode
    Error.captureStackTrace(this, DuplicateResourceError)
  }
}

class UnsupportedMediaTypeError extends RequestError {
  constructor(...args) {
    super(...args)
    this.name = 'UnsupportedMediaTypeError'
    this.message = 'Media type not supported.'
    this.statusCode = 415
    Error.captureStackTrace(this, UnsupportedMediaTypeError)
  }
}

export { RequestError, ForbiddenDataError, ResourceNotFoundError, InsufficientDataError, UnsupportedMediaTypeError }
