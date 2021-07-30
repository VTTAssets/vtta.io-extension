import Storage from "../../utilities/storage/index";

console.log("[OPTIONS] hello");
const LOG_LEVELS = [
  {
    value: 0,
    label: "Debug",
  },
  {
    value: 1,
    label: "Info",
  },
  {
    value: 2,
    label: "Warning",
  },
  {
    value: 4,
    label: "Error",
  },
  {
    value: 8,
    label: "Off",
  },
];

const init = async () => {
  let { logLevel } = await Storage.local.get(["logLevel"]);
  if (!logLevel) {
    logLevel = 2;
    await Storage.local.set({ logLevel: 2 });
  }
  console.log("Log Level set to " + logLevel);

  LOG_LEVELS.map((setting) => {
    $("#logLevels").append(
      ` <div class="field">
              <div class="ui radio checkbox">
                <input
                  type="radio"
                  name="logLevel"
                  tabindex="0"
                  ${setting.value === logLevel ? "checked" : ""}
                  class="hidden"
                  data-value="${setting.value}"
                />
                <label>${setting.label}</label>
              </div>
            </div>`
    );
  });

  // set verbosity
  $("#logLevels input[name='logLevel']").on("change", async (event) => {
    const { value } = $(event.target).data();
    await Storage.local.set({ logLevel: value });
    console.log("Log Level set to " + value);
  });

  $(".ui.radio.checkbox").checkbox();
};

init();

// close the options page
$("#close").on("click", () => {
  window.close();
});
