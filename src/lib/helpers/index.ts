import xss from "xss";

export const sanitize = (input: string): string => {
  return xss(input);
};

export function verifyUUID(uuid: string) {
  const regex = new RegExp(
    "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
  );
  return regex.test(uuid);
}
