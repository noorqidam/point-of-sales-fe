import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";

import { theme } from "@/theme";

//get all NEXT_PUBLIC_ variables from process.env and put them to env object
const nextPublicENV = Object.keys(process.env)
  .filter((key) => key.startsWith("NEXT_PUBLIC_"))
  .reduce((environment, key) => {
    environment[key] = process.env[key] ?? "";
    return environment;
  }, {} as { [key: string]: string });

nextPublicENV.NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? "";
nextPublicENV.DEPLOYMENT_ENVIRONMENT = process.env.DEPLOYMENT_ENVIRONMENT ?? "";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="id" translate="no">
        <Head />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                      console.table(${JSON.stringify(nextPublicENV)});
											window.process = window.process || {};
											window.process.env = window.process.env || {};
											Object.assign(window.process.env, ${JSON.stringify(nextPublicENV)});
                  `,
          }}
        ></script>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
