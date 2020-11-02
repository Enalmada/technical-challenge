// might be interesting: https://stackoverflow.com/questions/54937425/trying-to-make-cypress-typescript-and-istanbuljs-work-together

describe("Index page", () => {
    it("loads", () => {
        cy.visit("/");
        cy.location("pathname", { timeout: 10000 }).should("equal", "/");
        cy.get("h1").should("have.text", "We keep track of your todos so you don't have to");
    });
});
