import url from 'url'

// https://github.com/vendia/serverless-express/tree/v4.10.4#eventsource

export const ASYNC_API_GATEWAY_EVENT_SOURCE_NAME = 'ASYNC_API_GATEWAY'
export const asyncApiGateway = {
  getRequest: (obj) => {
    const { event } = obj

    const searchParams = new URLSearchParams(event.query)
    const path = url.format({
      pathname: event.requestPath.replace(/{(\w+)}/g, (_, key) => event.path[key]),
      search: searchParams.toString(),
    })

    const body = JSON.stringify(event.body)
    const headers = {}

    Object.entries(event.headers).forEach(([headerKey, headerValue]) => {
      headers[headerKey.toLowerCase()] = headerValue
    })

    headers['content-length'] = Buffer.byteLength(body, 'utf8')

    const response = {
      method: event.method.toLowerCase(),
      headers,
      body: Buffer.from(body),
      remoteAddress: event.identity.sourceIp,
      path,
    }

    return response
  },
  getResponse: ({ statusCode, body, headers }) => ({
    statusCode,
    body,
    headers,
  }),
}
