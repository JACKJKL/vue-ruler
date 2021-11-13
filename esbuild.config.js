const vuePlugin = require("esbuild-vue");
const PackageJson = require("./package.json");

require("esbuild")
  .build({
    entryPoints: ["./src/index.js"],
    bundle: true,
    outfile: PackageJson.main,
    format: "esm", // cjs iife esm
    minify: true,
    plugins: [
      vuePlugin({
        extractCss: false,
        workers: false,
        onReadFile: path => {
          console.error("The following dependency was used:", path);
        }
      })
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify("development")
    }
  })
  .then(() => {
    console.log("Build completed");
  })
  .catch(() => process.exit(1));
