/**
 * Utility functions for object manipulation and cleaning
 */

import { FeaturebaseApiConfig } from "./apiHelpers.ts";

/**
 * Removes undefined values from an object to clean up API parameters.
 * Modifies the object in place and also returns it for convenience.
 *
 * @param obj - The object to clean
 * @returns The cleaned object (same reference as input)
 */
export function cleanParams<T extends Record<string, any>>(obj: T): T {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}

/**
 * Creates a standardized Featurebase API configuration object.
 *
 * @param appConfig - The app configuration object containing apiKey and baseUrl
 * @returns Featurebase API configuration object
 */
export function createApiConfig(appConfig: any): FeaturebaseApiConfig {
  return {
    apiKey: appConfig.apiKey,
    baseUrl: appConfig.baseUrl,
  };
}
