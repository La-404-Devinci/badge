import { redirect } from "next/navigation";

import { PAGES } from "@/constants/pages";

export default function AdminPage() {
    redirect(PAGES.ADMIN_USERS);
}
