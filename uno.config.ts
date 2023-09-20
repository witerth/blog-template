// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from "unocss";

export default defineConfig({
  rules: [
    // ...custom rules
    ["flex-center", { display: "flex", "justify-content": "center", "align-items": "center" }],
  ],
  presets: [
    presetAttributify({
      /* preset options */
    }),
    presetUno(),
    // ...custom presets
  ],
});
