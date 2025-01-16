import nodemailer, { Transporter } from "nodemailer";
import path from "path";
import { env } from "../../config";
import handlebars from "handlebars";
import fs from "fs/promises";

export class MailService {
  private transporter: Transporter;
  private templatesDir: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env().MAIL_USER,
        pass: env().MAIL_PASSWORD,
      },
    });

    this.templatesDir = path.resolve(__dirname, "./templates");
  }

  private async renderTemplate(
    templateName: string,
    context: object,
  ): Promise<string> {
    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);

    // Read the template file
    const templateSource = await fs.readFile(templatePath, "utf-8");

    // Compile the template
    const compiledTemplate = handlebars.compile(templateSource);

    // Return the rendered template
    return compiledTemplate(context);
  }

  public async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    context: object,
  ): Promise<void> {
    try {
      const html = await this.renderTemplate(templateName, context);

      const mailOptions = {
        from: `"Your App" <${env().MAIL_USER}>`,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
