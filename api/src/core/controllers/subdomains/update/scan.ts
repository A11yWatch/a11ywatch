/*
 * Copyright (c) A11yWatch, LLC. and its affiliates.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 **/

import validUrl from "valid-url";

import { sourceBuild } from "@app/core/utils";
import { ApiResponse, responseModel, makeWebsite } from "@app/core/models";

import { WebsitesController } from "../../websites";
import { generateWebsiteAverage } from "./domain";
import { fetchPuppet, extractPageData } from "./utils";

export const scanWebsite = async ({
  userId: userIdMap,
  url: urlMap,
  firstPage,
  lastPage,
  shared,
}: any) => {
  const userId = Number(!userIdMap && userIdMap !== 0 ? -1 : userIdMap);
  console.log(`SCANNING:`, urlMap, `user_id:${userId}`);

  if (!urlMap || !validUrl.isUri(urlMap)) {
    return responseModel({ msgType: ApiResponse.NotFound });
  }

  const { url, domain, pageUrl } = sourceBuild(urlMap);

  if (
    process.env.NODE_ENV === "production" &&
    pageUrl.includes("http://localhost:")
  ) {
    throw new Error("Cannot use localhost, please use a valid web url.");
  }

  let [website, websiteCollection] = await WebsitesController().findWebsite(
    {
      domain,
      userId,
    },
    true
  );

  if (!website) {
    website = makeWebsite({ url, domain });
  }

  return await new Promise(async (resolve, reject) => {
    try {
      const dataSource = await fetchPuppet({
        pageHeaders: website?.pageHeaders,
        url: urlMap,
        userId: userId,
        firstPage: firstPage,
        lastPage: lastPage,
        shared: shared,
        authed: false,
      });

      if (dataSource) {
        if (!dataSource?.webPage) {
          resolve({
            website: null,
            code: 300,
            success: false,
            message:
              "Website timeout exceeded threshhold for free scan, website rendered to slow under 15000 ms",
          });
        }
        let {
          issues,
          webPage,
          // issuesInfo,
          pageHasCdn,
          // errorCount,
          // noticeCount,
          // warningCount,
          // adaScore,
        } = extractPageData(dataSource);

        const avgScore = await generateWebsiteAverage(
          {
            domain,
            // cdnConnected: pageHasCdn,
            userId,
            url: null,
          },
          [website, websiteCollection]
        );

        const updateWebsiteProps = Object.assign(
          {},
          {
            issuesInfo: webPage?.issuesInfo || {},
            lastScanDate: webPage?.lastScanDate,
            avgScore,
            adaScore: avgScore,
            cdnConnected: !!website?.cdnConnected,
            pageLoadTime: null,
            online: !!website?.online || null,
          }
        );

        // BIND ALL PROPS FROM WEBPAGE
        if (website?.url === pageUrl) {
          updateWebsiteProps.cdnConnected = pageHasCdn;
          updateWebsiteProps.pageLoadTime = webPage?.pageLoadTime;
          updateWebsiteProps.online = true;
        }

        const slicedIssue =
          issues?.issues?.slice(
            issues?.issues.length -
              Math.max(Math.round(issues?.issues.length / 4), 2)
          ) || [];

        if (updateWebsiteProps.issuesInfo) {
          updateWebsiteProps.issuesInfo.limitedCount = slicedIssue.length;
        }

        resolve(
          responseModel({
            website: {
              ...website,
              issue: slicedIssue,
              ...updateWebsiteProps,
              script: null,
            },
          })
        );
      } else {
        resolve(responseModel());
      }
    } catch (e) {
      console.error(e);
      // reject(e);
    }
  });
};