import { visit } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";
import { authenticateSession } from "ember-simple-auth/test-support";
import { MirageTestContext, setupMirage } from "ember-cli-mirage/test-support";
import { getPageTitle } from "ember-page-title/test-support";

interface AuthenticatedResultsRouteTestContext extends MirageTestContext {}

module("Acceptance | authenticated/results", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    await authenticateSession({});
  });

  test("the page title is correct", async function (this: AuthenticatedResultsRouteTestContext, assert) {
    await visit("/results");
    assert.equal(getPageTitle(), "Search Results | Hermes");
  });

  test("product badges have the correct hrefs", async function (this: AuthenticatedResultsRouteTestContext, assert) {
    this.server.createList("document", 10);

    await visit("/results");

    assert
      .dom(".product-link")
      .hasAttribute("href", "/documents?product=%5B%22Vault%22%5D");
  });
});
