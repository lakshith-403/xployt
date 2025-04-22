const RELOAD_TIMEOUT = 60 * 1000 * 3600;

/**
 * Checks if the cache has timed out based on the last updated timestamp.
 *
 * @param {number} lastUpdated - The timestamp of the last update.
 * @returns {boolean} True if the cache has timed out, false otherwise.
 */
export function isCacheTimeout(lastUpdated: number): boolean {
  return new Date().getTime() - lastUpdated > RELOAD_TIMEOUT;
}

/**
 * Abstract class representing a cache object.
 *
 * @template T - The type of data to be cached.
 */
export abstract class CacheObject<T> {
  protected data?: T;
  protected lastUpdated: number;

  constructor() {
    this.lastUpdated = 0;
  }

  /**
   * Abstract method to load data into the cache.
   * This method will call the network to fetch the data.
   *
   * @param {...any[]} args - Arguments required to load the data.
   * @returns {Promise<T>} A promise that resolves to the loaded data.
   */
  abstract load(...args: any[]): Promise<T>;

  /**
   * Retrieves the cached data, loading it if necessary.
   *
   * @param {boolean} [isRefresh=false] - Whether to force a refresh of the cache.
   * @param {...any[]} args - Arguments required to load the data.
   * @returns {Promise<T>} A promise that resolves to the cached data.
   */
  async get(isRefresh = false, ...args: any[]): Promise<T> {
    if (this.data == null || isCacheTimeout(this.lastUpdated)) {
      this.data = await this.load(...args);
      this.lastUpdated = new Date().getTime();
    }

    return this.data;
  }

  /**
   * Invalidates the cache, removing the cached data.
   */
  invalidate_cache(): void {
    delete this.data;
  }
}

/**
 * Class representing a data failure error.
 * This error is thrown when an operation fails to load or process data.
 */
export class DataFailure extends Error {
  /**
   * Creates an instance of DataFailure.
   *
   * @param {string} operation - The operation that failed.
   * @param {string} message - The error message.
   */
  constructor(operation: string, message: string) {
    super(message);
    this.name = 'DataFailure';
    this.message = `Failed to ${operation}: ${message}`;
  }
}
