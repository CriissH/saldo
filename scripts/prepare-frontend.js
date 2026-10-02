const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const destination = path.join(root, "dist");
const files = ["index.html", "styles.css", "version.json"];

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(path.join(destination, "scripts"), { recursive: true });
for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(destination, file));
}
for (const file of fs.readdirSync(path.join(root, "scripts"))) {
  if (file.endsWith(".js") && file !== "prepare-frontend.js") {
    fs.copyFileSync(path.join(root, "scripts", file), path.join(destination, "scripts", file));
  }
}

console.log(`Frontend preparado en ${path.relative(root, destination)}`);
