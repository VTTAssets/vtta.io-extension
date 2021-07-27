const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const package = JSON.parse(fs.readFileSync("./package.json"));
if (!package || !package.version) process.exit(1);

const DIST_PATH = "dist";
const targets = fs
  .readdirSync(DIST_PATH)
  .filter((file) => fs.statSync(path.join(DIST_PATH, file)).isDirectory());

// Remove the .key field used in development
const removeKeyFromManifest = (target) => {
  const manifestPath = path.resolve(DIST_PATH, target, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath), {
    encoding: "utf-8",
  });
  delete manifest.key;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 3), {
    encoding: "utf-8",
  });
};

targets.forEach((target) => {
  removeKeyFromManifest(target);

  const targetFilename = path.resolve(
    DIST_PATH,
    `vtta.io-extension-${target}-v${package.version}.zip`
  );
  console.log(
    "Creating archive for target " + target + " at " + targetFilename
  );

  const output = fs.createWriteStream(targetFilename);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  // pipe archive data to the file
  archive.pipe(output);
  const source = path.resolve(DIST_PATH, target);
  console.log("Adding directory " + source);
  archive.directory(source, false);
  archive.finalize();
});
