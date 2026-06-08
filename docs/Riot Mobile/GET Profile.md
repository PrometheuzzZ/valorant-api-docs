# GET Profile

Get player profile data including rank, match history, and top agents.  
Used by the **Riot Mobile** app.

Method: `GET`  
URL: `https://z7kaz9b169.execute-api.us-west-2.amazonaws.com/v4/profile/{puuid}`  
Headers:
 - `Authorization`: `Bearer {RSO access token}`
 - `Origin`: `shared_riotmobile`

Query Parameters:
 - `products`: Comma-separated list of `{game}-{shard}` pairs (e.g. `val-eu`, `val-na,lol-eu`)
 - `locale`: Locale string (e.g. `en_US`, `ru_RU`)

Variables:
 - `{puuid}`: Read [Common Components - PUUID](../common-components.md#puuid)
 - `{RSO access token}`: Riot Sign-On OAuth2 access token (obtained via RSO auth flow)
 - `{game}`: Game identifier — `val` (Valorant), `lol` (League of Legends), `tft` (TFT), etc.
 - `{shard}`: Read [Common Components - Shard](../common-components.md#shard)

> **Note:** The base URL may be overridden via Statsig Remote Config key `profile_urls`.  
> Dev URL: `https://7qr3cfv9bg.execute-api.us-west-2.amazonaws.com/v4`

### Response Format:
```ts
type ProfileResponse = {
    valMatchHistory: {
        valAgent: {
            /** Player UUID */
            puuid: string;
            /** URL to player card image */
            playerProfile: string;
            /** URL to player background image */
            playerBackground: string;
            gameName: string;
            tagLine: string;
            locale: string;
            accountLevel: number;
            rank: {
                /** Competitive tier (3–27, matches ValorantIconsKt rank mapping) */
                rank: number;
                rankName: string;
            };
        };
        valHistory: {
            wins: number;
            loses: number;
        };
        valMatches: Array<{
            matchId: string;
            /** Queue type (e.g. "competitive", "unrated") */
            queueType: string;
            gameLengthMillis: number;
            gameStartMillis: number;
            /** "Win" | "Loss" | "Draw" */
            matchResult: string;
            /** Localization key for map name */
            mapTitleLoc: string;
            /** URL to map background image */
            mapBackground: string;
            wins: number;
            loses: number;
            participants: Array<{
                playerPUUID: string;
                playerName: string;
                rank: number;
                accountLevel: number;
                /** URL to agent icon */
                agentIcon: string;
                /** Localization key for agent name */
                agentNameLoc: string;
                /** "Red" | "Blue" */
                team: string;
                flair: string | null;
                /** "kills/deaths/assists" formatted string */
                kda: string;
                score: number;
                econRating: number;
                plants: number;
                defuses: number;
                firstBlood: number;
            }>;
        }>;
        valTopAgents: Array<{
            /** URL to agent portrait */
            characterURL: string;
            kdRatio: number;
            /** 0.0–1.0 */
            kdPercentage: number;
            /** Human-readable KD description */
            kdPercentageDescription: string;
        }>;
    };
};
```

### Rank Tier Mapping:
| Rank Value | Tier |
|------------|------|
| 3 | Iron 1 |
| 4 | Iron 2 |
| 5 | Iron 3 |
| 6 | Bronze 1 |
| 7 | Bronze 2 |
| 8 | Bronze 3 |
| 9 | Silver 1 |
| 10 | Silver 2 |
| 11 | Silver 3 |
| 12 | Gold 1 |
| 13 | Gold 2 |
| 14 | Gold 3 |
| 15 | Platinum 1 |
| 16 | Platinum 2 |
| 17 | Platinum 3 |
| 18 | Diamond 1 |
| 19 | Diamond 2 |
| 20 | Diamond 3 |
| 21 | Ascendant 1 |
| 22 | Ascendant 2 |
| 23 | Ascendant 3 |
| 24 | Immortal 1 |
| 25 | Immortal 2 |
| 26 | Immortal 3 |
| 27 | Radiant |
