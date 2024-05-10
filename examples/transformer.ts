import { transformFile } from "@babel/core";
import { writeFileSync } from "fs";
import plugin from "..";
import { join } from "path";

const folder = import.meta.dirname;

const files = ["transform", "no-transform"];

files.forEach((file) => {
  const input = join(folder, file + ".js");
  const output = join(folder, file + ".out.js");

  transformFile(
    input,
    {
      plugins: [plugin],
      code: true,
      ast: false,
    },
    (error, data) => {
      if (error || !data) {
        console.error(error);
        return;
      }

      writeFileSync(output, data.code + "\n");
    },
  );
});
