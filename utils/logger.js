const requestLogger = (request, response, next) => {
  console.info('Method:', request.method)
  console.info('Path:  ', request.path)
  console.info('---')
  next()
}

export {requestLogger}