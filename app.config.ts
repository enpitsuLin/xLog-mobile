import type { ExpoConfig, ConfigContext } from "expo/config";

import setAppConfigEnv from "./scripts/set-app-config-env.js";

const { appConfig, environment, decreasedVersion } = setAppConfigEnv();

const config = appConfig;

const postPublish = [];

if (environment !== "development") {
  postPublish.push({
    file: "sentry-expo/upload-sourcemaps",
    config: {
      setCommit: true,
      organization: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
  });
}

export default (_: ConfigContext): ExpoConfig => {
  return {
    name: config.name,
    description: "The first on-chain and open-source blogging platform for everyone",
    slug: "xlog",
    version: decreasedVersion,
    scheme: config.scheme,
    orientation: "portrait",
    icon: config.icon,
    userInterfaceStyle: "automatic",
    hooks: {
      postPublish,
    },
    plugins: [
      "react-native-compressor",
      [
        "expo-image-picker",
        {
          photosPermission: "Allow $(PRODUCT_NAME) to access your photos so you can select images when posting articles.",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera so you can take photos and use them when posting articles.",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 33,
            targetSdkVersion: 33,
            minSdkVersion: 23,
            buildToolsVersion: "33.0.0",
            kotlinVersion: "1.8.0",
          },
          ios: {
            deploymentTarget: "13.0",
            flipper: true,
          },
        },
      ],
      [
        "expo-media-library",
        {
          photosPermission: "Allow $(PRODUCT_NAME) to access your photos so you can select images when posting articles.",
          savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos so you can store your favorite images when browsing articles.",
          isAccessMediaLocationEnabled: true,
        },
      ],
      "expo-localization",
      "sentry-expo",
      ...process.env.USING_GOOGLE_SERVICES === "true" ? ["@react-native-firebase/app"] : [],
      "./plugins/with-react-native-firebase.js",
    ],
    splash: {
      image: "./assets/splash-light.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: [
      "**/*",
    ],
    updates: {
      url: process.env.UPDATES_URL,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    ios: {
      appStoreUrl: "https://apps.apple.com/app/xlog-on-chain-blogging/id6449499296",
      supportsTablet: true,
      bundleIdentifier: config.scheme,
      infoPlist: {
        LSApplicationQueriesSchemes: [
          "metamask",
          "trust",
          "safe",
          "rainbow",
          "uniswap",
        ],
      },
      associatedDomains: [
        `applinks:${config.host}`,
        `applinks:oia.${config.host}`,
      ],
      googleServicesFile: config.iosGoogleServicesFile,
    },
    android: {
      playStoreUrl: "https://play.google.com/store/apps/details?id=com.crossbell.xlog",
      package: config.scheme,
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: `${config.host}`,
              pathPrefix: "/",
            },
            {
              scheme: "https",
              host: `oia.${config.host}`,
              pathPrefix: "/",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
      googleServicesFile: config.androidGoogleServicesFile,
    },
    extra: {
      WALLET_PROJECT_ID: process.env.WALLET_PROJECT_ID,
      INFURA_ID: process.env.INFURA_ID,
      CSB_SCAN: process.env.CSB_SCAN,
      CSB_XCHAR: process.env.CSB_XCHAR,
      SENTRY_DSN: process.env.SENTRY_DSN,
      APP_HOST: config.host,
      ENV: environment,
      eas: {
        projectId: process.env.EXPO_PROJECT_ID,
      },
    },
    owner: process.env.OWNER,
  };
};
