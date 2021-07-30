import logger from "../../../utilities/logging/index";

// const general = async (dataUrl: string): Promise<string> => {
//   const query = dataUrl.indexOf("/") !== 0 ? "/" + dataUrl : dataUrl;
//   return new Promise((resolve, reject) => {
//     const url = `https://www.dndbeyond.com${query}`;
//     fetch(url)
//       .then((response) => {
//         if (response.ok) {
//           return response.text();
//         } else {
//           throw response.status;
//         }
//       })
//       .then((body) => {
//         if (
//           body.indexOf("ddb-blocked-content") !== -1 ||
//           body.indexOf("/marketplace") !== -1
//         ) {
//           return reject(403);
//         }
//         return resolve(body);
//       })
//       .catch((error) => console.log(error));
//   });
// };

// const equipment = async (dataUrl: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const url = `https://www.dndbeyond.com${dataUrl}`;
//     fetch(url)
//       .then((response) => {
//         if (response.ok) {
//           return response.text();
//         } else {
//           throw response.status;
//         }
//       })
//       .then((body) => {
//         resolve(body);
//       })
//       .catch((error) => console.log(error));
//   });
// };

// export default { general, equipment };

export default async (dataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    logger.info("[LOADCONTENT] Retrieving content from " + dataUrl);
    const url = `https://www.dndbeyond.com${dataUrl}`;
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          logger.warn(
            "[LOADCONTENT] Error retrieving content from " +
              dataUrl +
              ": HTTP Error " +
              response.status
          );
          throw response.status;
        }
      })
      .then((body) => {
        if (
          body.indexOf("ddb-blocked-content") !== -1 ||
          body.indexOf("/marketplace") !== -1
        ) {
          logger.debug("[LOADCONTENT] Unlicensed content: " + dataUrl);
          return reject(403);
        }

        // remove any script tags because they bloat the data that is transferred unnecessarily
        const html = $(`<div>${body}</div>`);
        if (html.find(".more-info").length) {
          let moreInfo = html.find(".more-info").wrap("<p/>").parent().html();
          moreInfo = moreInfo.replace(/\r?\n\s*|\r\s*/g, "");
          resolve(moreInfo);
        } else {
          console.warn(
            `${dataUrl}: Unable to retrieve more-info, skipping analysis...`
          );
          reject(400);
        }
      })
      .catch((error) => {
        console.error("[LOADCONTENT] Unexpected error: ", error);
        reject(400);
      });
  });
};
