export default {
  messages: {
    // Browser action has been pressed
    ACTION: "TRIGGER_ACTION",

    // Query is FVTT tab is alive
    FVTT_PING: "PING",
    FVTT_PONG: "PONG",
    FVTT_QUERY_CONNECTION_STATUS: "QUERY_CONNECTION_STATUS",
    FVTT_MESSAGE: "FVTT_MESSAGE",
    FVTT_RELAY_MESSAGE: "FVTT_RELAY_MESSAGE",
    FVTT_CUSTOMEVENT_TAG: "CMD_SEND_FOUNDRY_MESSAGE",
    FVTT_CONNECTION_ESTABLISHED: "FVTT_CONNECTION_ESTABLISHED",
    FVTT_IMPORT_SUCCESS: "FVTT_IMPORT_SUCCESS",

    // user/profile from vtta.io/.dev has been accessed and sends over the token to retrieve the user info
    // EXTERNAL_PROFILE_CONNECT: "TRIGGER_EXTERNAL_PROFILE_CONNECT",
    EXTERNAL_PROFILE_CONNECT: "MESSAGE_TYPE_ACTION_EXTERNAL_PROFILE_CONNECT",
  },
  environments: [
    {
      name: "STAGING",
      isDefault: false,
      isDisplayed: true,
      label: "Staging",
      host: "vtta.dev",
      icon: "/assets/icons/icon-env-staging-48x48.png",
      description:
        "All new features are tested in the staging environment first. The staging requirements is aimed at developers that install the tools directly from their respective GitHub repositories.",
      parser: {
        items: "https://parser.vtta.dev",
        monsters: "https://parser.vtta.dev",
        sources: "https://parser.vtta.dev",
        spells: "https://parser.vtta.dev",
      },
      api: {
        default: "https://api.vtta.dev",
      },
    },
    {
      name: "PRODUCTION",
      isDefault: true,
      isDisplayed: true,
      label: "Production",
      host: "vtta.io",
      icon: "/assets/icons/icon-env-production-48x48.png",
      description:
        "Recommended for the average user, to be used with all released modules and tools.",
      parser: {
        items: "https://parser.vtta.io",
        monsters: "https://parser.vtta.io",
        sources: "https://parser.vtta.io",
        spells: "https://parser.vtta.io",
      },
      api: {
        default: "https://api.vtta.io",
      },
    },
    {
      name: "LOCAL",
      isDefault: false,
      isDisplayed: true,
      label: "Local",
      icon: "/assets/icons/icon-env-local-48x48.png",
      host: "localhost",
      description: "Local development environment",
      parser: {
        items: "http://localhost",
        monsters: "http://localhost",
        sources: "http://localhost",
        spells: "http://localhost",
      },
      api: {
        default: "http://localhost",
      },
    },
    {
      name: "UNCONFIGURED",
      isDefault: false,
      isDisplayed: false,
      label: "Not configured",
      icon: "/assets/icons/icon-env-unconfigured-48x48.png",
      host: null,
      description:
        "Connecting a users sets a valid parser environment. You are currently not able to import anything.",
      parser: {
        items: "http://localhost",
        monsters: "http://localhost",
        sources: "http://localhost",
        spells: "http://localhost",
      },
      api: {
        default: "http://localhost",
      },
    },
  ],
};
