/**
 * unified eco and its peer deps both are using pure ESM
 * so that need add to transformIngorePatterns array
 */
const esmDepsPatterns = [
  "property-information",
  "direction",
  "comma-separated-tokens",
  "space-separated-tokens",
  "zwitch",
  "bcp-47-match",
  "html-void-elements",
  "micromark-util-character",
  "stringify-entities",
  "character-entities-legacy",
  "character-entities-html4",
  "ccount",
  "fault",
  "micromark-extension-frontmatter",
  "decode-named-character-reference",
  "character-entities",
  "trim-lines",
  "bail",
  "is-plain-obj",
  "trough",
  "vfile",
  "(.*)?(rehype|remark|micromark|unified)(.*)?",
  "(.*)?(mdast|unist|hast)-util-(.*)(.*)?",
];

/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts", "tsx"],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    `node_modules/(?!${esmDepsPatterns.join("|")}|((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)`,
  ],
};
