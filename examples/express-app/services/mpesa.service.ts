import { Mpesa } from "@tashie/mpesa-sdk";
import type { ClientConfig } from "@tashie/mpesa-sdk";

/**
 * MPesa Service with Token Management
 * 
 * Best Practice: Cache access tokens and refresh them automatically
 * to avoid unnecessary API calls and improve performance.
 */
class MpesaService {
  private mpesa: Mpesa;
  private tokenCache: {
    token: string;
    expiresAt: number;
  } | null = null;

  constructor(config: ClientConfig) {
    this.mpesa = new Mpesa(config);
  }

  /**
   * Get access token with caching
   * Automatically refreshes token if expired or about to expire
   */
  async getValidToken(): Promise<string> {
    const now = Date.now();
    const bufferTime = 60000; // 1 minute buffer before expiry

    // Check if we have a valid cached token
    if (
      this.tokenCache &&
      this.tokenCache.expiresAt > now + bufferTime
    ) {
      return this.tokenCache.token;
    }

    // Fetch new token
    try {
      const authResponse = await this.mpesa.getAccessToken();
      const expiresIn = parseInt(authResponse.expires_in) * 1000; // Convert to milliseconds
      
      this.tokenCache = {
        token: authResponse.access_token,
        expiresAt: now + expiresIn,
      };

      return authResponse.access_token;
    } catch (error) {
      // Clear cache on error
      this.tokenCache = null;
      throw new Error(`Failed to get access token: ${error}`);
    }
  }

  /**
   * Ensure token is valid before making API calls
   */
  private async ensureToken(): Promise<void> {
    await this.getValidToken();
  }

  // Wrapper methods that ensure token is valid
  async sendSTKPush(params: Parameters<Mpesa["sendSTKPush"]>[0]) {
    await this.ensureToken();
    return this.mpesa.sendSTKPush(params);
  }

  async registerUrls(params: Parameters<Mpesa["registerUrls"]>[0]) {
    await this.ensureToken();
    return this.mpesa.registerUrls(params);
  }

  async B2C(params: Parameters<Mpesa["B2C"]>[0]) {
    await this.ensureToken();
    return this.mpesa.B2C(params);
  }

  async getAccountBalance(params: Parameters<Mpesa["getAccountBalance"]>[0]) {
    await this.ensureToken();
    return this.mpesa.getAccountBalance(params);
  }
}

// Singleton instance
let mpesaServiceInstance: MpesaService | null = null;

export function getMpesaService(config?: ClientConfig): MpesaService {
  if (!mpesaServiceInstance) {
    if (!config) {
      throw new Error("MPesa service not initialized. Provide config on first call.");
    }
    mpesaServiceInstance = new MpesaService(config);
  }
  return mpesaServiceInstance;
}

export { MpesaService };

