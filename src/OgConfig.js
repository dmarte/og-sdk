import { set, get } from "lodash";

export default class OgConfig {
  constructor() {
    this.$items = {
      API_URL: "",
      API_HEADERS: {}
    };

    this.set("API_HEADERS.Accept", "application/json");
    this.set("API_HEADERS.Content-Type", "application/json");
  }

  set(path, value) {
    set(this.$items, path, value);
    return this;
  }

  get(path, defaultValue = null) {
    return get(this.$items, path, defaultValue);
  }

  get API_URL() {
    return this.get("API_URL");
  }

  get API_HEADERS() {
    return this.get("API_HEADERS", {});
  }
}
