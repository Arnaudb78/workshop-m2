import { cookies } from "next/headers";

export type AccountCookie = {
  _id: string;
  name: string;
  lastname: string;
  mail: string;
  accessLevel: "ADMIN" | "STUDENT";
};

export async function getAccountFromCookie(): Promise<AccountCookie | null> {
  try {
    const cookieStore = await cookies();
    const accountCookie = cookieStore.get("account");

    if (!accountCookie?.value) {
      return null;
    }

    return JSON.parse(accountCookie.value) as AccountCookie;
  } catch (error) {
    console.error("[getAccountFromCookie] error parsing cookie", error);
    return null;
  }
}

