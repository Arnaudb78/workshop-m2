"use server";

import { cookies } from "next/headers";

export async function LogoutAction() {
    const cookieStore = await cookies();

    await cookieStore.delete("account");
}