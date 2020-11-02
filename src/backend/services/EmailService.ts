import fs from "fs";
import mjml2html from "mjml";
import path from "path";

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
