module.exports = {
  /**
   * Create absolute url by simply concataning protocol, host and url
   * @param  {JSON} ctx app context
   * @param  {String} url relative url
   * @return {String}     absolute url
   */
  toAbsoluteUrl: function (ctx, url) {
    return ctx.protocol + '://' + ctx.host + url;
  }
};
