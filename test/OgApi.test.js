import Api from "/src/Http/OgApi";
import Config from "/src/OgConfig";

const config = new Config();
config.set("API_URL", "https://kw3dd.csb.app/");

const api = new Api(config);

it("Test URL path", () => {
  expect(api.url("json/document.json")).toBe(
    [config.get("API_URL"), "json/document.json"].join("/")
  );
});

it("Test get request", async () => {
  const data = await api.get("json/document.json");
  console.log(data.$response);
});
