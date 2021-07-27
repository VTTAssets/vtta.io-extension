import Note from "./note";
import CONFIG from "../../../config/index";

export default (environment: string) => {
  let env = CONFIG.environments.find((env) => env.name === environment);
  if (env === undefined) {
    $("#profile-environment")
      .find("img")
      .attr(
        "src",
        chrome.runtime.getURL("/assets/icons/icon-env-unconfigured-48x48.png")
      );
    $("#profile-environment").attr(
      "data-tooltip",
      "Connecting a user sets a valid parser environment"
    );
  } else {
    $("#profile-environment")
      .find("img")
      .attr("src", chrome.runtime.getURL(env.icon));
    $("#profile-environment").attr("data-tooltip", env.description);
  }

  $("#profile-environment").on("click", (event) => {
    let table = `
    <table>
  <tbody>${CONFIG.environments
    .filter((env) => env.isDisplayed)
    .map((env) => {
      return `<tr>
      <td style="text-align: center;
    width: 60px;
}">
        <img style="width: 24px" src="${chrome.runtime.getURL(
          env.icon
        )}"/> <a href="https://www.${env.host}">${env.host}</a>
      </td>
      <td style="vertical-align: top;"><b>${env.name}</b>: ${
        env.description
      }</td>
    </tr>`;
    })
    .join("")}</tbody></table>`;

    Note.display(
      "note",
      "Parser Environment",
      `<p>The parsing environment used is set by visiting the linked website and visit the profile page of your VTTA.io user account.</p>` +
        table,
      null
    );
  });
};
