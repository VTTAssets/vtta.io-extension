import logger from "../logging/index";

const doFetch = async (url: string, request: RequestInit) => {
  const RETRIES = 3;
  let tries = 0;

  let response: Response;
  do {
    tries++;
    response = <Response>await fetch(url, request);
    if (!response.ok) {
      logger.warn(`[FETCH] ${url}, #${tries} failed: ${response.status}`);
    }
  } while (!response.ok && tries < RETRIES);

  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    throw new Error(
      "Three failures to request " +
        url +
        " (Status: " +
        response.statusText +
        ")"
    );
  }
};

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
  logger.debug(`[${requestType}]`, request);
  return request;
};

const Query = (hostname: string, token: string): QueryInterface => {
  logger.debug(`[QUERY:Init] ${hostname}, auth: ${token}`);
  return {
    // get: async (url: string): Promise<any> => {
    get: async (url: string): Promise<any> => {
      const query =
        url.indexOf("/") === 0 ? `${hostname}${url}` : `${hostname}/${url}`;

      // creating the request
      const request = createRequest("GET", token);

      logger.debug("[GET] " + query);

      // executing the request, includes error handling

      try {
        const json = await doFetch(query, request);
        return json;
      } catch (error) {
        console.error("Request to " + query + "failed", error);
      }
    },
    post: async (url: string, input: any): Promise<any> => {
      const query =
        url.indexOf("/") === 0 ? `${hostname}${url}` : `${hostname}/${url}`;
      logger.debug("[POST] " + query, input);

      const request = createRequest("POST", token, input);

      try {
        const json = await doFetch(query, request);
        console.log(json);
        return json;
      } catch (error) {
        console.error("Request to " + query + "failed", error);
      }
    },
  };
};

export default Query;
