import babel from "@babel/core";
import fs from "fs";
import plugin from "../index.js";
import path from "path";

const folder = import.meta.dirname;

const files = ["transform", "no-transform"];

files.forEach((file) => {
  const input = path.join(folder, file + ".js");
  const output = path.join(folder, file + ".out.js");

  babel.transformFile(
    input,
    {
      plugins: [plugin],
      code: true,
      ast: false,
    },
    (error, { code }) => {
      if (error) {
        console.error(error);
        return;
      }

      fs.writeFileSync(output, code + "\n");
    },
  );
});
