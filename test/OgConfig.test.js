import OgConfig from "../src/OgConfig";

const config = new OgConfig();

it("Has default settings", () => {
  expect(config).toBeInstanceOf(OgConfig);
  expect(config.$items).toBeDefined();
});

it("Has app settings getters.", () => {
  expect(config.API_URL).toBeDefined();
});
