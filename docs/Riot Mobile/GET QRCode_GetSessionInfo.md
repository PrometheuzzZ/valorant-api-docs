# GET QRCode_GetSessionInfo

Get QR login session information (geolocation, timestamp) by the mobile app after scanning the QR code.

Method: `GET`  
URL: `https://authenticate.riotgames.com/api/v1/session/info`  
Headers:
 - `Authorization`: `Bearer {Riot token}`
 - `X-Riot-Entitlements-JWT`: `{Entitlements token}`
 - `x-riot-clientid`: `{Client ID}`

Query Parameters:
 - `suuid`: Session UUID extracted from the QR code
 - `cluster`: Server cluster extracted from the QR code (e.g. `eu`, `na`, `ap`)

Variables:
 - `{Riot token}`: Read [Common Components - Riot Token](../common-components.md#riot-token)
 - `{Entitlements token}`: Read [Common Components - Entitlements Token](../common-components.md#entitlements-token)
 - `{Client ID}`: The Riot client identifier (e.g. `riotmobile`), obtained from `/rso-auth/configuration/v3/client-id`

### QR Code URL format

The QR code displayed on the PC encodes the following URL:
```
https://qrlogin.riotgames.com/riotmobile?suuid=<uuid>&cluster=<region>&timestamp=<unix_ms>
```

| Parameter | Example | Description |
|-----------|---------|-------------|
| `suuid` | `a1b2c3d4-...` | Session UUID |
| `cluster` | `eu`, `na`, `ap` | Server region |
| `timestamp` | `1712345678000` | Session creation time (ms) |

### Response Format:
```ts
type QRCodeSessionInfoResponse = {
    request: {
        suuid: string;
        cluster: string;
        geolocation: {
            country: string;
            city: string;
        };
        /** Milliseconds since epoch */
        timestamp: number;
    };
};
```
