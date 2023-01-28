const serverError = () => {
  return {
    status: false,
    message: 'Server side error!'
  }
}


module.exports = {
  serverError
}