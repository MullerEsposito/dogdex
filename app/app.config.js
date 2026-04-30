module.exports = ({ config }) => {
  const isDev = (process.env.APP_ENV || '').trim() === 'development';

  return {
    ...config,
    name: isDev ? `${config.name} (Dev)` : config.name,
    android: {
      ...config.android,
      package: isDev 
        ? `${config.android.package}.dev` 
        : config.android.package,
      config: {
        ...config.android.config,
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      }
    },
    ios: {
      ...config.ios,
      bundleIdentifier: isDev 
        ? `${config.android.package}.dev` 
        : config.android.package
    },
    plugins: [
      "expo-secure-store",
      "expo-web-browser",
      "expo-audio"
    ],
    extra: {
      ...config.extra,
      apiUrl: isDev ? process.env.EXPO_PUBLIC_API_URL : 'https://dogdex-backend.onrender.com',
    }
  };
};
