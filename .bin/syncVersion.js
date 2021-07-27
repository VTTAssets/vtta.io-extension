const fs = require("fs");
const path = require("path");

const package = JSON.parse(fs.readFileSync("./package.json"));
if (!package || !package.version) process.exit(1);
const CONFIG_PATH = "config";
const targets = fs
  .readdirSync(CONFIG_PATH)
  .filter((file) => fs.statSync(path.join(CONFIG_PATH, file)).isDirectory());

targets.forEach((target) => {
  console.log("Updating manifest for target " + target + "...");
  const manifestPath = path.resolve(CONFIG_PATH, target, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath));
  manifest.version = package.version;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 3));
});
