context("index.html", () => {
  beforeEach(() => {
    cy.visit("http://127.0.0.1:8080");
  });

  it("Layout is not broken", () => {
    cy.matchImageSnapshot();
  });
});