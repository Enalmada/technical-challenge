import fs from "fs";
import mjml2html from "mjml";
import path from "path";

/*
    mjml makes generating responsive email easy
    Templates with potential layout: https://mjml.io/templates
    Editor: https://mjml.io/try-it-live/templates/welcome-email
 */
export default class EmailService {
    static async emailHtml(template: string) {
        const options = {};
        const input = fs.readFileSync(
            path.resolve("src/backend/email/templates/", `${template}.mjml`),
            "utf8"
        );
        const htmlOutput = mjml2html(input, options);
        return htmlOutput;
    }
}
