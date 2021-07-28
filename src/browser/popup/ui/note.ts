/**
 *
 * @param type
 * @param title
 * @param body
 * @param timeout
 */
const display = (
  type: MessageType,
  title: string,
  body: string | null,
  timeout = 3000
) => {
  const msg = $(`<div class="ui ${type} message" style="margin-bottom: 1rem">
        <i class="close icon"></i>
        <div class="header">
          ${title}
        </div>
        ${body !== null ? `<p>${body}</p>` : ""}
      </div>`);

  $("#message").prepend(msg);
  $("body").css("height", "auto");

  $(msg).on("click", (event) => {
    console.log(event.target);
    if (event.target.tagName === "A") {
      const href = $(event.target).attr("href");
      if (href) {
        chrome.tabs.create({ url: href });
        return;
      }
    }
    $(msg).fadeOut(function () {
      $(this).remove();
      $("body").css("height", "auto");
    });
  });

  if (timeout)
    setTimeout(() => {
      $(msg).fadeOut(function () {
        $(this).remove();
        $("body").css("height", "auto");
      });
    }, timeout);
};

/**
 * Clears all messages
 */
const clear = () => {
  $("#message").empty();
};

export default { display, clear };
