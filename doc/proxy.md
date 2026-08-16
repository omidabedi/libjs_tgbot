# Telegram proxy

Proxy support follows grammY's Node.js proxy recommendation and injects a `SocksProxyAgent` into `client.baseFetchConfig.agent`.

```env
TG_PROXY_URL=socks5://127.0.0.1:1080
```

Supported protocols:

- `socks4://`
- `socks4a://`
- `socks5://`
- `socks5h://`

The proxy is used for Telegram API requests only. MongoDB and Redis continue using their own connection settings.

The proxy dependency is loaded lazily. Direct connections do not require proxy configuration. Install dependencies before enabling the proxy:

```sh
npm install
```

Proxy credentials can be included in the URL, but should preferably be supplied through a secret manager:

```env
TG_PROXY_URL=socks5://username:password@proxy.example:1080
```

Invalid URLs and non-SOCKS protocols fail during bot creation with a clear configuration error.
