import { expect, test, type ConsoleMessage, type Page, type Request } from "@playwright/test";

import { getConsoleValidationRoutes } from "./console-validation-routes";

type ConsoleError = {
  text: string;
  location: string;
};

type NetworkIssue = {
  method: string;
  status?: number;
  url: string;
  reason: string;
};

function getMessageUrl(message: ConsoleMessage) {
  const locationUrl = message.location().url;

  if (locationUrl) {
    return locationUrl;
  }

  const match = message.text().match(/https?:\/\/\S+/);

  return match?.[0];
}

function isSameOrigin(page: Page, url: string) {
  return new URL(url).origin === new URL(page.url()).origin;
}

function isExpectedDocument404(page: Page, path: string, message: ConsoleMessage) {
  return path === "/this-route-does-not-exist" && getMessageUrl(message) === page.url();
}

function formatConsoleMessage(message: ConsoleMessage) {
  const location = message.location();
  const locationText = [location.url, location.lineNumber, location.columnNumber]
    .filter((value) => value !== undefined && value !== "")
    .join(":");

  return {
    text: message.text(),
    location: locationText || "unknown",
  };
}

function formatRequestFailure(request: Request) {
  return {
    method: request.method(),
    url: request.url(),
    reason: request.failure()?.errorText ?? "request failed",
  };
}

test.describe("Console and network validation", () => {
  for (const { path, label } of getConsoleValidationRoutes()) {
    test(`${label} has no route console or same-origin network errors`, async ({ page }, testInfo) => {
      const consoleErrors: ConsoleError[] = [];
      const externalConsoleErrors: ConsoleError[] = [];
      const sameOriginNetworkIssues: NetworkIssue[] = [];
      const externalNetworkIssues: NetworkIssue[] = [];

      page.on("console", (message) => {
        if (message.type() !== "error" || isExpectedDocument404(page, path, message)) {
          return;
        }

        const messageUrl = getMessageUrl(message);

        if (messageUrl && !isSameOrigin(page, messageUrl)) {
          externalConsoleErrors.push(formatConsoleMessage(message));
          return;
        }

        consoleErrors.push(formatConsoleMessage(message));
      });

      page.on("requestfailed", (request) => {
        if (request.failure()?.errorText === "net::ERR_ABORTED") {
          return;
        }

        const issue = formatRequestFailure(request);

        if (isSameOrigin(page, request.url())) {
          sameOriginNetworkIssues.push(issue);
          return;
        }

        externalNetworkIssues.push(issue);
      });

      page.on("response", (response) => {
        const request = response.request();

        if (!isSameOrigin(page, response.url())) {
          if (response.status() >= 400) {
            externalNetworkIssues.push({
              method: request.method(),
              status: response.status(),
              url: response.url(),
              reason: response.statusText(),
            });
          }
          return;
        }

        if (response.status() >= 400 && response.url() !== new URL(path, page.url()).toString()) {
          sameOriginNetworkIssues.push({
            method: request.method(),
            status: response.status(),
            url: response.url(),
            reason: response.statusText(),
          });
        }
      });

      await page.goto(path, { waitUntil: "load" });

      if (externalConsoleErrors.length > 0 || externalNetworkIssues.length > 0) {
        await testInfo.attach("external-network-issues.json", {
          body: JSON.stringify(
            {
              console: externalConsoleErrors,
              network: externalNetworkIssues,
            },
            null,
            2,
          ),
          contentType: "application/json",
        });
      }

      expect(consoleErrors, "console.error messages").toEqual([]);
      expect(sameOriginNetworkIssues, "same-origin network failures").toEqual([]);
    });
  }
});
