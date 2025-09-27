import { extraProviderInformation, toolTips } from "@/lib/constants";
import { useApiKeyStore } from "@/lib/store/api-key.store";
import { ExtraProvider, SpotifyCredentials } from "@/types";
import { Globe } from "lucide-react";

/**
 * TODO: Make this more generic for other potential API settings.
 */
export const SpotifySettings = () => {
  const apiKeysStore = useApiKeyStore();
  const spotifyConfig = (apiKeysStore.apiKeys[ExtraProvider.SPOTIFY] || { clientId: "", clientSecret: "" }) as SpotifyCredentials;
  const { clientId, clientSecret } = spotifyConfig;

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex flex-row items-center gap-2.5">
        <h3 className="text-md font-bold text-white">
          {extraProviderInformation.spotify.title}
        </h3>
        <div className="w-8 h-8 flex items-center justify-center">
          {extraProviderInformation.spotify.logo()}
        </div>
      </div>

      <label
        className="text-xs font-bold text-white flex flex-row items-center gap-2"
        htmlFor="spotify-client-id"
      >
        <a
          className="flex items-center justify-center gap-2 h-10 rounded-full drop-shadow-2xl cursor-pointer hover:underline"
          href={extraProviderInformation.spotify.registerUrl}
          target="_blank"
        >
          <p>Client ID</p>
          <Globe className="w-4 h-4 text-white" />
        </a>
      </label>
      <input
        className="w-full p-2 bg-[#4a4a4a] border-none rounded text-white cursor-pointer hover:bg-[#5a5a5a]"
        type="password"
        placeholder="Enter your Client ID"
        id="spotify-client-id"
        value={clientId}
        onChange={(e) => {
          apiKeysStore.setApiKeys({
            [ExtraProvider.SPOTIFY]: {
              ...spotifyConfig,
              clientId: e.target.value,
            },
          });
        }}
      />

      <label
        className="text-xs font-bold text-white flex flex-row items-center gap-2"
        htmlFor="spotify-client-secret"
      >
        <p>Client Secret</p>
      </label>
      <input
        className="w-full p-2 bg-[#4a4a4a] border-none rounded text-white cursor-pointer hover:bg-[#5a5a5a]"
        type="password"
        placeholder="Enter your Client Secret"
        id="spotify-client-secret"
        value={clientSecret}
        onChange={(e) => {
          apiKeysStore.setApiKeys({
            [ExtraProvider.SPOTIFY]: {
              ...spotifyConfig,
              clientSecret: e.target.value,
            },
          });
        }}
      />

      <a
        className="text-sm mt-1 flex gap-2 h-10 hover:underline cursor-pointer flex items-center"
        href={extraProviderInformation.spotify.docsUrl}
        target="_blank"
      >
        <span>API Documentation</span>
        <span>
          <Globe className="w-4 h-4 text-white" />
        </span>
      </a>
      <hr className="w-full border-gray-400 py-0 my-0 h-1" />
    </div>
  );
};