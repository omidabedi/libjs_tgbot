
/**
 * Build grammY's Node.js HTTP client options.
 *
 * grammY passes `baseFetchConfig` to `node-fetch`. The SOCKS agent is only
 * created when a proxy URL is configured, so normal deployments retain the
 * default direct connection.
 *
 * @param {string|undefined} proxyUrl
 * @returns {Promise<{baseFetchConfig: {agent?: object, compress: boolean}}>} 
 */
export async function createTelegramClientOptions(proxyUrl) {
  if (!proxyUrl) return { baseFetchConfig: { compress: true } };
  let parsed;
  try {
    parsed = new URL(proxyUrl);
  } catch (error) {
    throw new Error(`TG_PROXY_URL is not a valid URL: ${proxyUrl}`, { cause: error });
  }
  if (!['socks4:', 'socks4a:', 'socks5:', 'socks5h:'].includes(parsed.protocol)) {
    throw new Error('TG_PROXY_URL must use socks4, socks4a, socks5, or socks5h protocol');
  }
  let SocksProxyAgent;
  try {
    ({ SocksProxyAgent } = await import('socks-proxy-agent'));
  } catch (error) {
    throw new Error('Telegram SOCKS proxy support requires the "socks-proxy-agent" package', { cause: error });
  }
  return { baseFetchConfig: { agent: new SocksProxyAgent(parsed), compress: true } };
}
