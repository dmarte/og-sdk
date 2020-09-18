import OgConfig from "../OgConfig";

export default class OgApi {
  constructor(config = new OgConfig()) {
    this.$config = config;
  }

  get config() {
    return this.$config;
  }
}
