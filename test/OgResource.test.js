import OgResource from "../src/Resources/OgResource";
import OgResourceCast from "../src/Resources/OgResourceCast";
import OgApi from "../src/Http/OgApi";
import OgConfig from "../src/OgConfig";

const config = new OgConfig();
const api = new OgApi(config);

it("Has default resource definitions.", () => {
  const resource = new OgResource(api);
  expect(resource).toBeInstanceOf(OgResource);
  expect(resource.$api).toBeInstanceOf(OgApi);
  expect(resource.$casts).toBeDefined();
  expect(resource.$attributes).toBeDefined();
  expect(resource.$fillable).toBeDefined();
});

it("[CAST] Set a cast property.", () => {
  const resource = new OgResource(api);
  resource.cast("status.enabled", OgResourceCast.TYPE_BOOLEAN);
  resource.cast("id", OgResourceCast.TYPE_INTEGER);
  expect(resource.$casts["status.enabled"]).toBe(OgResourceCast.TYPE_BOOLEAN);
  expect(resource.$casts["id"]).toBe(OgResourceCast.TYPE_INTEGER);
});

it("[CAST] Define a group of casts properties.", () => {
  const resource = new OgResource(api);

  resource.define({
    id: OgResourceCast.TYPE_INTEGER,
    "name.first": OgResourceCast.TYPE_STRING,
    "name.last": OgResourceCast.TYPE_STRING
  });

  expect(resource.SCHEMA).toMatchObject({
    id: 0,
    name: {
      first: "",
      last: ""
    }
  });
});

it("[SCHEMA] Get default schema.", () => {
  const resource = new OgResource(api);
  resource.cast("id", OgResourceCast.TYPE_INTEGER);
  resource.cast("name.full", OgResourceCast.TYPE_STRING);
  resource.cast("name.first", OgResourceCast.TYPE_STRING);
  resource.cast("name.last", OgResourceCast.TYPE_STRING);
  resource.cast("active", OgResourceCast.TYPE_BOOLEAN);
  expect(resource.SCHEMA).toMatchObject({
    id: 0,
    name: {
      full: "",
      first: "",
      last: ""
    },
    active: false
  });
});

it("[FILLABLE] Check values are fillable.", () => {
  const resource = new OgResource(api);
  expect(resource.fillable("id").fillable("name.first")).toBeInstanceOf(
    OgResource
  );
  expect(resource.$fillable.includes("id")).toBeTruthy();
  expect(resource.$fillable.includes("name.first")).toBeTruthy();
});

it("[FILLABLE] Not fillable values could be added.", () => {
  const resource = new OgResource(api);
  expect(resource.fillable("id")).toBeInstanceOf(OgResource);
  expect(resource.set("id", 1).get("id")).toBe(1);
  expect(resource.set("name.first", "John").get("name.first")).toBeNull();
});

it("[FILLABLE] Attribures row.", () => {
  const resource = new OgResource(api);
  expect(resource.fillable("id").fill({ id: 1 })).toBeInstanceOf(OgResource);
  expect(resource.ATTRIBUTES).toMatchObject({ id: 1 });
});

it("[FILL] Fills a property", () => {
  const resource = new OgResource(api);
  resource.define({
    id: OgResourceCast.TYPE_INTEGER,
    "name.first": OgResourceCast.TYPE_STRING,
    "name.last": OgResourceCast.TYPE_STRING
  });

  resource.fill({ id: 1 });
  resource.fill({ name: { first: "John" } });
  resource.fill({ name: { last: "Doe" } });
  resource.fill({ gender: "male" });

  expect(resource.get("id")).toBe(1);
  expect(resource.get("name.first")).toMatch("John");
  expect(resource.get("name.last")).toMatch("Doe");
  expect(resource.get("gender")).toBeNull();
});
