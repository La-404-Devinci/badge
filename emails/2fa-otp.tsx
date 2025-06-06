import { PROJECT } from "@/constants/project";

import { Card } from "./components/card";
import { EmailButton } from "./components/email-button";
import { EmailLayout } from "./components/email-layout";
import { EmailFooter, EmailHeading, EmailText } from "./components/email-text";
import { OtpDisplay } from "./components/otp-display";

interface TwoFactorOTPTemplateProps {
    otp: string;
    host?: string;
    name?: string;
}

function TwoFactorOTPTemplate({
    otp,
    host = PROJECT.DOMAIN,
    name,
}: TwoFactorOTPTemplateProps) {
    return (
        <EmailLayout previewText={`Your temporary password for ${host}`}>
            <Card>
                <EmailHeading>
                    {name ? `Hi ${name},` : "Hi there,"}
                </EmailHeading>

                <EmailText>
                    {
                        "Copy over your temporary password or use the automatic sign in button."
                    }
                </EmailText>

                <EmailButton href={`https://${host}/login?code=${otp}`}>
                    {"Sign In"}
                </EmailButton>

                <EmailText>
                    {"Your temporary password is "}
                    <strong>{"valid for one hour."}</strong>
                </EmailText>

                <OtpDisplay otp={otp} />

                <EmailText>
                    {"Thanks,"}
                    <br />
                    {`The ${PROJECT.COMPANY} Team`}
                </EmailText>
            </Card>

            <EmailFooter />
        </EmailLayout>
    );
}

TwoFactorOTPTemplate.PreviewProps = {
    otp: "123456",
    host: PROJECT.DOMAIN,
    name: "Leonard",
} as TwoFactorOTPTemplateProps;

export default TwoFactorOTPTemplate;
