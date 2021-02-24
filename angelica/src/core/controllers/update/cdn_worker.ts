/*
 * Copyright (c) A11yWatch, LLC. and its affiliates.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 **/

import fetch from "node-fetch";
import { SCRIPTS_CDN_URL } from "@app/config";
import { log, setConfig as setLogConfig } from "@a11ywatch/log";

setLogConfig({ container: "angelica" });

process.on(
  "message",
  async ({
    scriptBody: scriptBuffer,
    cdnSourceStripped,
    domain,
    screenshot,
    screenshotStill,
  }) => {
    const body = JSON.stringify({
      scriptBuffer,
      cdnSourceStripped,
      domain,
      screenshot,
      screenshotStill,
    });

    const apiEndpoint =
      typeof screenshot !== "undefined" ? "add-screenshot" : "add-script";

    try {
      await fetch(`${SCRIPTS_CDN_URL}/${apiEndpoint}`, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      log(e, { type: "error" });
    } finally {
      process.send("close");
    }
  }
);
