import logger from "../logging/index";

const createRequest = (
  requestType: "GET" | "POST",
  bearer?: string,
  json?: any
): RequestInit => {
  let request: RequestInit = {
    method: requestType,
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearer ? `Bearer ${bearer}` : null,
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: requestType === "POST" && json ? JSON.stringify(json) : null,
  };
  logger.info(`[${requestType}]`, request);
  return request;
};

const handleErrors = (response: Response) => {
  if (!response.ok) {
    logger.error("Response is not okay", response);
    throw Error(response.statusText);
  }
  return response;
};

const Query = (hostname: string, token: string): QueryInterface => {
  logger.info(`[QUERY:Init] ${hostname}, auth: ${token}`);
  return {
    get: (url: string): Promise<any> => {
      const query = url.indexOf("/") === 0 ? url : "/" + url;
      return new Promise((resolve, reject) => {
        // creating the request
        const request = createRequest("GET", token);

        logger.info("[GET] from " + hostname + query, request);

        // executing the request, includes error handling
        fetch(hostname + query, request)
          .then(handleErrors)
          .then((response) => {
            return response.json();
          })
          .then((json) => resolve(json))
          .catch((error) => {
            console.error("Query failed");
            console.error(error);
            reject(error);
          });
      });
    },
    post: (url: string, input: any): Promise<any> => {
      // logger.info("[POST] " + url, input);
      const query = url.indexOf("/") === 0 ? url : "/" + url;
      return new Promise((resolve, reject) => {
        // creating the request
        const request = createRequest("POST", token, input);

        logger.info("[POST] to " + hostname + query, request);
        // executing the request, includes error handling
        fetch(hostname + query, request)
          .then(handleErrors)
          .then((response) => {
            // logger.info("RESPONSE", response);
            return response.json();
          })
          .then((json) => {
            // logger.info("JSON", json);
            resolve(json);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  };
};

export default Query;
