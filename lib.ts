"use server"
import * as jose from "jose";
import { cookies } from "next/headers";


const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jose.jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}


export async function setCookie(cokkieData:any){
  const expires = new Date(Date.now() + 10 * 1000);
  const session = await encrypt({ cokkieData, expires });
  cookies().set("session", session, { expires, httpOnly: true });
}

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return undefined;
    return await decrypt(session);
  }

  export async function removeSession() {
    cookies().set("session", "", { expires: new Date(0) });
  }