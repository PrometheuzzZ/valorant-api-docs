# POST QRCode_AuthenticateSession

Confirm a QR login session from the mobile app, allowing the PC client to complete sign-in.

Method: `POST`  
URL: `https://authenticate.riotgames.com/api/v1/session/authentication`  
Headers:
 - `Authorization`: `Bearer {Riot token}`
 - `X-Riot-Entitlements-JWT`: `{Entitlements token}`
 - `x-riot-clientid`: `{Client ID}`
 - `X-Riot-ClientPlatform`: `{Client Platform}`
 - `User-Agent`: `RiotGamesApi/5.3.0 ritoplus (Android;14;;, arm64)`

Variables:
 - `{Riot token}`: Read [Common Components - Riot Token](../common-components.md#riot-token)
 - `{Entitlements token}`: Read [Common Components - Entitlements Token](../common-components.md#entitlements-token)
 - `{Client ID}`: The Riot client identifier (e.g. `riotmobile`), obtained from `/rso-auth/configuration/v3/client-id`
 - `{Client Platform}`: Base64-encoded JSON describing the device platform (see below)

### X-Riot-ClientPlatform

Base64 encoding of the following JSON:
```json
{
    "platformType": "RIOT_CLIENT",
    "platformOS": "Android",
    "platformOSVersion": "14",
    "platformChipset": "Unknown"
}
```

### Body Format:
```ts
type QRCodeAuthenticateSessionBody = {
    /** Session UUID from the QR code */
    suuid: string;
    /** Server cluster from the QR code (e.g. "eu", "na", "ap") */
    cluster: string;
    /** Whether to remember this device */
    remember: boolean;
};
```

### Response Format:
```ts
type QRCodeAuthenticateSessionResponse = {
    type: 'authenticated';
};
```
