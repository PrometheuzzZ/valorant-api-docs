# Riot Mobile

Endpoints used by the Riot Mobile app (Android/iOS) to confirm QR-based login sessions on PC or console clients.

## QR Login Flow

1. **PC creates a QR session** — `POST /rso-authenticator/v1/authentication/qrcode` (LCU local API) and begins polling for confirmation.
2. **Mobile scans the QR code** — extracts `suuid` and `cluster` from the URL, then fetches session details via [`GET QRCode_GetSessionInfo`](GET%20QRCode_GetSessionInfo.md).
3. **Mobile confirms the login** — sends approval via [`POST QRCode_AuthenticateSession`](POST%20QRCode_AuthenticateSession.md).
4. **PC receives confirmation** — polling returns success and the PC completes sign-in.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/session/info` | Get session geolocation and metadata |
| POST | `/api/v1/session/authentication` | Confirm the QR login from the mobile device |
