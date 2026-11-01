import type { Template } from "tinacms";
import { codeLanguages, darkThemes, lightThemes } from "../../components/magicui/script-copy-options";

export const scriptCopyBlockSchema: Template = {
  name: "scriptCopyBlock",
  label: "Script Copy Block",
  ui: {
    defaultItem: {
      codeLanguage: "bash",
      lightTheme: "catppuccin-latte",
      darkTheme: "catppuccin-mocha",
      commandMap: 
        "npm|npm install\n"+
        "pnpm|pnpm install\n"+
        "yarn|yarn install\n"+
        "bun|bun install",
    }
  },
  fields: [
    {
      name: "codeLanguage",
      label: "Code Language",
      type: "string",
      options: codeLanguages,
      description: "The language used for syntax highlighting.",
    },
    {
      name: "lightTheme",
      label: "Light Theme",
      type: "string",
      options: lightThemes,
      description: "The light theme used for syntax highlighting.",
    },
    {
      name: "darkTheme",
      label: "Dark Theme",
      type: "string",
      options: darkThemes,
      description: "The dark theme used for syntax highlighting.",
    },
    {
      name: "commandMap",
      label: "Command Map",
      type: "string",
      description:
        'A list of package managers and their corresponding commands, separated by "|". Example:\n"npm|npm install\npnpm|pnpm install"',
      ui: {
        component: "textarea",
      },
    },
  ]
};
