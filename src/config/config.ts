import dotenv from 'dotenv';

dotenv.config();

class Config {
  private keys: NodeJS.Dict<string>;

  constructor(keys: NodeJS.Dict<string>) {
    this.keys = keys;
  }

  /**
   * Adds a set of config keys to the config.
   * @param keys Keys to ad
   */
  addKeys(keys: NodeJS.Dict<string>): void {
    this.keys = { ...this.keys, ...keys };
  }

  /**
   * Ensure that a set of config keys are present.
   * If any keys are missing, an error is thrown.
   * @param values Values to ensure exist
   */
  ensureValues(...values: string[]): void {
    values.forEach((value) => {
      if (!this.keys[value]) {
        throw new Error(`Missing config value: ${value}`);
      }
    });
  }

  /**
   * Gets the value of a config key.
   * @param key Key to get
   * @returns Value of the key
   */
  get(key: string): string {
    const value = this.keys[key];
    if (!value) {
      throw new Error(`Missing config value: ${key}`);
    }
    return value;
  }
}

const config = new Config(process.env);

config.ensureValues(
  // Mongo
  'MONGO_URL',

  // JWT
  'JWT_SECRET',
);

export default config;
