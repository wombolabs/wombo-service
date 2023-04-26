import * as Sentry from '@sentry/serverless'
import { isOffline } from '~/config'

export const axiosLoggerError = (error) => {
  if (isOffline) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('[axios] errorData=', error.response.data)
      console.log('[axios] errorStatus=', error.response.status)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log('[axios] errorRequest=', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('[axios] error=', error.message)
    }
  }
  Sentry.captureException(error)
}
