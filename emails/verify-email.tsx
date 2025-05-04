import { PROJECT } from "@/constants/project";

import { Card } from "./components/card";
import { EmailButton } from "./components/email-button";
import { EmailLayout } from "./components/email-layout";
import { EmailFooter, EmailHeading, EmailText } from "./components/email-text";
import { OtpDisplay } from "./components/otp-display";

interface VerifyEmailTemplateProps {
    otp: string;
    host: string;
    email: string;
    name?: string;
}

export default function VerifyEmailTemplate({
    otp,
    host,
    email,
    name,
}: VerifyEmailTemplateProps) {
    return (
        <EmailLayout previewText={`Your verification code for ${host}`}>
            <Card>
                <EmailHeading>
                    {name ? `Hi ${name},` : "Hi there,"}
                </EmailHeading>

                <EmailText>
                    {
                        "Please use the following code to verify your email address:"
                    }
                </EmailText>

                <OtpDisplay otp={otp} />

                <EmailButton
                    href={`https://${host}/verification?otp=${otp}&email=${email}`}
                >
                    {"Verify Email"}
                </EmailButton>

                <EmailText>
                    {
                        "If you didn't request this code, you can safely ignore this email."
                    }
                </EmailText>

                <EmailText>
                    {"Thanks,"}
                    <br />
                    {`The ${PROJECT.NAME} Team`}
                </EmailText>
            </Card>

            <EmailFooter />
        </EmailLayout>
    );
}

VerifyEmailTemplate.PreviewProps = {
    otp: "123456",
    host: PROJECT.DOMAIN,
    email: "test@test.com",
    name: "Leonard",
} as VerifyEmailTemplateProps;
