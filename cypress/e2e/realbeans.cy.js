describe("RealBeans Shopify Store - Chapter 2 Cypress Tests", () => {

  const storeUrl = "https://r0924672-realbeans.myshopify.com/"
  const password = "chefro"

  beforeEach(() => {
    cy.visit(storeUrl)
    cy.get('input[type="password"]').type(password)
    cy.get('button[type="submit"]').click()
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

    cy.get("body").should("contain", "Roasted coffee beans")
    cy.get("body").should("contain", "Blended coffee")
  })

  it("checks that sorting products by price changes the catalog order setting", () => {
    cy.visit(`${storeUrl}collections/all?sort_by=price-ascending`)

    cy.url().should("include", "sort_by=price-ascending")
    cy.get("body").should("contain", "Roasted coffee beans")
    cy.get("body").should("contain", "Blended coffee")
  })

  it("checks that sorting products by price changes their order", () => {
  cy.visit(`${storeUrl}collections/all`)

  cy.get("body").should("contain", "Roasted coffee beans")
  cy.get("body").should("contain", "Blended coffee")

  cy.visit(`${storeUrl}collections/all?sort_by=price-descending`)

  cy.url().should("include", "sort_by=price-descending")
  cy.get("body").then(($body) => {
    const pageText = $body.text()
    const blendedIndex = pageText.indexOf("Blended coffee")
    const roastedIndex = pageText.indexOf("Roasted coffee beans")

    expect(blendedIndex).to.be.lessThan(roastedIndex)
  })
})

  it("checks the Roasted coffee product detail page description, price, and image name", () => {
    cy.visit(`${storeUrl}products/roasted-coffee-beans-5kg`)

    cy.get("body").should("contain", "Roasted coffee beans")
    cy.get("body").should("contain", "Our best and sustainable real roasted beans.")
    cy.get("body").should("contain", "40")
    cy.get("body").should("contain", "RealBeansRoastedBag")
  })

  it("checks the Blended coffee product detail page description, price, and image name", () => {
    cy.visit(`${storeUrl}products/blended-coffee-5kg`)

    cy.get("body").should("contain", "Blended coffee")
    cy.get("body").should("contain", "RealBeans coffee, ready to brew.")
    cy.get("body").should("contain", "55")
    cy.get("body").should("contain", "RealBeansBlendBag")
  })

  it("checks that the About page includes the required history paragraph", () => {
    cy.visit(`${storeUrl}pages/about`)

    cy.get("body").should(
      "contain",
      "From a small Antwerp grocery to a European coffee staple, RealBeans honors tradition while innovating for the future. Our beans are roasted in-house, shipped from Antwerp or Stockholm, and loved across the continent."
    )
  })

})