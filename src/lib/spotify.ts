import { useApiKeyStore } from "./store/api-key.store";
import { ExtraProvider, SpotifyCredentials } from "~/types";

export class SpotifyClient {
  private accessToken: string | null = null;
  private tokenExpireTime: number = 0;

  constructor(private config?: SpotifyCredentials) {}

  private async getStoredCredentials(): Promise<SpotifyCredentials> {
    const apiKeys = useApiKeyStore.getState().apiKeys;
    const credentials = apiKeys[ExtraProvider.SPOTIFY] as SpotifyCredentials;

    if (!credentials.clientId) {
      throw new Error("Spotify clientID not found!");
    }
    if (!credentials.clientSecret) {
      throw new Error("Spotify clientSecret not found!")
    }
    
    return credentials;
  }

  private async getConfig(): Promise<SpotifyCredentials> {
    if (this.config) {
      return this.config;
    }
    return await this.getStoredCredentials();
  }

  private async refreshAccessToken(): Promise<void> {
    const config = await this.getConfig();
    const authString = btoa(`${config.clientId}:${config.clientSecret}`);

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(`Failed to get Spotify access token: ${response.statusText}`);
    }

    const data = await response.json() as { access_token: string; expires_in: number };
    this.accessToken = data.access_token;
    this.tokenExpireTime = Date.now() * 1000 + (data.expires_in);
  }

  private isValidToken(): boolean {
    return this.accessToken !== null && Date.now() * 1000 < this.tokenExpireTime;
  }

  public async searchItem(item: string, type: string, limit: number) {
    if (!this.isValidToken()) await this.refreshAccessToken();
    const query = encodeURIComponent(item);
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    if (!searchResponse.ok) throw new Error(`Error searching for ${type} ${item}: ${searchResponse.statusText}`);
    const searchData: any = await searchResponse.json();
    
    return searchData;
  }

  public async getAlbum(searchData: any) {
    if (!this.isValidToken()) await this.refreshAccessToken();
    const albumId = searchData.albums?.items[0]?.id;

    if (albumId == null) throw new Error(`GET -- Album ID is null`);
    const albumResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });
    if (!albumResponse.ok) throw new Error (`Failed to get album data: ${albumResponse.statusText}`);
    const albumData: any = await albumResponse.json();
    
    return albumData;
  }
}
