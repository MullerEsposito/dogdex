module.exports = ({ config }) => {
  const isDev = (process.env.APP_ENV || '').trim() === 'development';

  return {
    ...config,
    name: isDev ? `${config.name} (Dev)` : config.name,
    android: {
      ...config.android,
      package: isDev 
        ? `${config.android.package}.dev` 
        : config.android.package
    },
    ios: {
      ...config.ios,
      bundleIdentifier: isDev 
        ? `${config.android.package}.dev` 
        : config.android.package
    },
    plugins: [
      "expo-secure-store",
      "expo-web-browser"
    ],
    extra: {
      ...config.extra,
      apiUrl: isDev ? process.env.EXPO_PUBLIC_API_URL : 'https://dogdex-backend.onrender.com',
    }
  };
};
