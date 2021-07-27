import logger from "../utilities/logging/index";
import Storage from "../utilities/storage/index";

interface FoundryConnectionResponse {
  success: boolean;
  data: {
    system: {
      label: string;
      version: string;
    };
    core: {
      world: string;
      version: string;
    };
    module: {
      version: string;
    };
  };
}

const checkCoreAvailability = async (): Promise<FoundryConnectionResponse> => {
  const POLL_TIMEOUT = 10; // How long do we poll until we finally reject the connection attempt?
  const POLL_QUERY = "vtta-ddb.query";
  const POLL_EXPECTED_RESPONSE = "vtta-ddb.available";

  const { user, environment } = await Storage.sync.get(["user", "environment"]);
  const manifest = chrome.runtime.getManifest();
  const eventData = {
    detail: {
      extension: {
        name: manifest.name,
        version: manifest.version,
        environment: environment,
      },
      user: user,
    },
  };
  logger.info("Checking for vtta availability", eventData);
  const POLL_QUERY_EVENT = new CustomEvent(POLL_QUERY, eventData);

  logger.info(`Querying for vtta-ddb`);
  let success = false;

  return new Promise((resolve, reject) => {
    logger.info(
      `[POLL] Starting to poll for the vtta-ddb with a timeout of ${POLL_TIMEOUT} seconds..`
    );

    const availabilityQueryHandler = (event: CustomEvent) => {
      success = true;
      // remove self from the event listeners
      window.removeEventListener(
        POLL_EXPECTED_RESPONSE,
        availabilityQueryHandler
      );
      resolve({
        success: success,
        data: event.detail,
      });
    };

    // add the event listener to the window-object
    window.addEventListener(POLL_EXPECTED_RESPONSE, availabilityQueryHandler);

    let passedSeconds = 0;
    const countingInterval = setInterval(() => {
      if (success === false) {
        passedSeconds++;
        logger.info("[POLL] Polling since " + passedSeconds + "s...");
        // dispatch the query event
        window.dispatchEvent(POLL_QUERY_EVENT);
      }
    }, 1000);

    // do not wait forever for a reply, run into a timeout
    setTimeout(() => {
      clearInterval(countingInterval);
      if (!success) {
        logger.info(
          "I will abort now, there does not seem to be a connection possible"
        );
      }

      window.removeEventListener(
        POLL_EXPECTED_RESPONSE,
        availabilityQueryHandler
      );
    }, POLL_TIMEOUT * 1000);

    logger.info("Dispatching event " + POLL_QUERY);
    // dispatch the query event
    window.dispatchEvent(POLL_QUERY_EVENT);
  });
};

export default checkCoreAvailability;
