/**
 * Transform the HTML from the detail view of an equipment item into the /more-äinfo data structure in order to
 * make parsing easier on the backend
 * @param element Equipment Detail element
 * @returns
 */

export const transform = (element: HTMLElement) => {
  const content = $(element)
    .find(".details-container-content-description-text")
    .last()
    .html()
    .trim();
  const tags = $(element)
    .find("div.tag")
    .toArray()
    .map((tag) => `<div class="tag">${$(tag).text().trim()}</div>`)
    .join("");

  const moreInfo = `<div class="more-info">
    <div class="more-info-body">
        <div class="more-info-body-description">${content}</div>
    </div>
    <div class="more-info-footer">
        <div class="more-info-footer-details-button">
            <a class="button button-items" href="${
              new URL(document.URL).pathname
            }">
                View Details Page
            </a>
        </div>
        <div class="more-info-footer-tags">
                <div class="label">Tags: </div>${tags}</div>
        <div class="more-info-footer-source">
            Basic Rules
        </div>
    </div>
</div>`;

  return moreInfo;
};
