import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";

import { MarkdownRenderer } from "@/components/markdown-renderer";
import * as Button from "@/components/ui/button";
import { PROJECT } from "@/constants/project";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste below
// 3. Replace the data with your own (if needed)
// 4. Copy the markdown-formatted answer directly into the privacyPolicyContent variable

/*
You are an excellent lawyer specializing in privacy policies for TypeScript applications.

I need your help to write a privacy policy for my website. Here is some context:
- Website: https://${PROJECT.DOMAIN}
- Name: ${PROJECT.NAME}
- Description: ${PROJECT.DESCRIPTION}
- Company: ${PROJECT.COMPANY}
- User data collected: name, email and payment information
- Non-personal data collection: web cookies, TypeScript error logs
- Purpose of Data Collection: Order processing, error tracking
- Data sharing: we do not share the data with any third parties except for essential service providers
- Children's Privacy: we do not collect any data from children
- Updates to the Privacy Policy: users will be updated by email
- Contact information: ${PROJECT.HELP_EMAIL}

Please write a privacy policy that follows these formatting rules:
1. Use ### for main section titles
2. Use #### for subsections
3. Use ##### for sub-subsections if needed
4. Use proper markdown formatting:
   - **bold** for emphasis
   - - for bullet points
   - > for important notes/quotes
   - ``` for code examples if needed
5. Add the current date in YYYY-MM-DD format
6. Format all headings in Title Case

The policy should be clear, concise, and directly usable as markdown content. Do not add any explanations outside the policy itself.
*/

const privacyPolicyContent = `# Privacy Policy

**Effective Date: 2025-01-27**

Welcome to ${PROJECT.NAME}. Your privacy is important to us, and this Privacy Policy explains how we collect, use, and protect your information when you visit our website at https://${PROJECT.DOMAIN}.

## Information We Collect

### Personal Data
We collect the following personal information from you:
- **Name**
- **Email Address**
- **Payment Information**

### Non-Personal Data
We also collect non-personal data, including:
- **Web Cookies**
- **TypeScript Error Logs**

## Purpose Of Data Collection

We collect and use your data for the following purposes:
- **Order Processing**: To fulfill and manage your orders.
- **Error Tracking**: To identify and resolve technical issues to improve our services.

## Data Sharing

We respect your privacy and do not share your data with third parties except:
- **Essential Service Providers**: These include payment processors and hosting providers necessary to operate our services.

> We do not sell or rent your personal data to any third parties.

## Children's Privacy

Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children.

## Updates To This Privacy Policy

We may update this Privacy Policy from time to time. When we make changes, we will notify users by email. Please review the Privacy Policy periodically to stay informed.

## Contact Us

If you have any questions or concerns about this Privacy Policy, you can reach us at:
- **Email**: ${PROJECT.HELP_EMAIL}

By using ${PROJECT.NAME}, you agree to this Privacy Policy.`;

export default function PrivacyPolicy() {
    return (
        <main className="max-w-3xl mx-auto">
            <div className="p-5">
                <Button.Root variant="neutral" mode="ghost" asChild>
                    <Link href="/">
                        <RiArrowLeftLine className="w-5 h-5" />
                        Back
                    </Link>
                </Button.Root>

                <MarkdownRenderer>{privacyPolicyContent}</MarkdownRenderer>
            </div>
        </main>
    );
}
