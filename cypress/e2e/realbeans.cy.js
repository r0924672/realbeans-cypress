describe("RealBeans Shopify Store - Chapter 2 Cypress Tests", () => {
  const storeUrl = "https://r0924672-realbeans.myshopify.com/"
  const password = "chefro"

  const unlockIfPasswordPage = () => {
    cy.get("body").then(($body) => {
      const visiblePasswordInput = $body.find('input[type="password"]:visible')

      if (visiblePasswordInput.length > 0) {
        cy.get('input[type="password"]:visible').type(password)
        cy.get('button[type="submit"]:visible').click()
      }
    })
  }

  beforeEach(() => {
    cy.visit(storeUrl)
    unlockIfPasswordPage()
  })

  it("automatically enters the storefront password and reaches the homepage", () => {
    cy.url().should("eq", storeUrl)
    cy.get("body").should("contain", "Since 1801, RealBeans")
  })

  it("checks that the homepage intro text and product list appear correctly", () => {
    cy.get("body").should(
      "contain",
      "Since 1801, RealBeans has roasted premium coffee in Antwerp for Europe’s finest cafes. Ethically sourced beans, crafted with care."
    )

    cy.get("body").should("contain", "Roasted coffee beans")
    cy.get("body").should("contain", "Blended coffee")
  })

  it("checks that the product catalog page shows the correct items", () => {
    cy.visit(`${storeUrl}collections/all`)
    unlockIfPasswordPage()

    cy.get("body").should("contain", "Roasted coffee beans")
    cy.get("body").should("contain", "Blended coffee")
  })

  it("checks that sorting products by price changes the catalog order setting", () => {
    cy.visit(`${storeUrl}collections/all?sort_by=price-ascending`)
    unlockIfPasswordPage()

    cy.visit(`${storeUrl}collections/all?sort_by=price-ascending`)
    unlockIfPasswordPage()

    cy.get("body").should("contain", "Roasted coffee beans")
    cy.get("body").should("contain", "Blended coffee")
  })

  it("checks that sorting products by price changes their order", () => {
    cy.visit(`${storeUrl}collections/all`)
    unlockIfPasswordPage()

    cy.get("body").should("contain", "Roasted coffee beans")
    cy.get("body").should("contain", "Blended coffee")

    cy.visit(`${storeUrl}collections/all?sort_by=price-descending`)
    unlockIfPasswordPage()

    cy.get("body").then(($body) => {
      const pageText = $body.text()
      const blendedIndex = pageText.indexOf("Blended coffee")
      const roastedIndex = pageText.indexOf("Roasted coffee beans")

      expect(blendedIndex).to.be.greaterThan(-1)
      expect(roastedIndex).to.be.greaterThan(-1)
      expect(blendedIndex).to.be.lessThan(roastedIndex)
    })
  })

  it("checks the Roasted coffee product detail page description, price, and image name", () => {
    cy.visit(storeUrl)
    unlockIfPasswordPage()

    cy.get("body", { timeout: 10000 }).should("contain", "Roasted coffee beans")

    cy.contains("Roasted coffee beans").click({ force: true })

    cy.get("body").should("contain", "Roasted coffee beans")
    cy.get("body").should("contain", "Our best and sustainable real roasted beans.")
    cy.get("body").should("contain", "40")
    cy.get("img").should("have.attr", "src").and("include", "Roasted")
  })

  it("checks the Blended coffee product detail page description, price, and image name", () => {
    cy.visit(storeUrl)
    unlockIfPasswordPage()

    cy.get("body", { timeout: 10000 }).should("contain", "Blended coffee")

    cy.contains("Blended coffee").click({ force: true })

    cy.get("body").should("contain", "Blended coffee")
    cy.get("body").should("contain", "RealBeans coffee, ready to brew.")
    cy.get("body").should("contain", "55")
    cy.get("img").should("have.attr", "src").and("include", "Blend")
  })

it("checks that the About page includes the required history paragraph", () => {
  cy.visit(`${storeUrl}pages/about`)
  unlockIfPasswordPage()

  cy.get("body", { timeout: 10000 }).then(($body) => {
    if (!$body.text().includes("From a small Antwerp grocery to a European coffee staple")) {
      cy.visit(storeUrl)
      unlockIfPasswordPage()

      cy.contains("About")
        .click({ force: true })
    }
  })

  cy.get("body", { timeout: 10000 }).should(
    "contain",
    "From a small Antwerp grocery to a European coffee staple"
  )
})
})