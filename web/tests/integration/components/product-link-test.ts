import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { TestContext, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

interface ProductLinkComponentTestContext extends TestContext {}

module("Integration | Component | product-link", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders with the correct attributes", async function (this: ProductLinkComponentTestContext, assert) {
    await render<ProductLinkComponentTestContext>(hbs`
      <ProductLink class="foo" @product="Cloud Platform" />
      <ProductLink class="bar" @product="Terraform" />
      <ProductLink class="baz" />
    `);

    assert
      .dom(".hds-badge")
      .exists({ count: 3 }, "renders as a badge by default");

    assert
      .dom(".foo")
      .hasAttribute("href", "/documents?product=%5B%22Cloud%20Platform%22%5D")
      .hasText("HCP");

    assert
      .dom(".bar")
      .hasAttribute("href", "/documents?product=%5B%22Terraform%22%5D")
      .hasText("Terraform");

    assert.dom(".baz").hasAttribute("href", "/documents").hasText("Unknown");
  });

  test("it can render a custom block", async function (this: ProductLinkComponentTestContext, assert) {
    await render<ProductLinkComponentTestContext>(hbs`
      <ProductLink @product="Cloud Platform">
        <div data-test-custom-block />
      </ProductLink>
    `);

    assert.dom("a [data-test-custom-block]").exists();
  });
});
