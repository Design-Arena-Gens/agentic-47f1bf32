import localforage from "localforage";

const db = localforage.createInstance({ name: "bbai-tool" });

export async function saveUrl(url: string) {
  const existing = (await db.getItem<string[]>("urls")) || [];
  if (!existing.includes(url)) {
    existing.unshift(url);
    await db.setItem("urls", existing.slice(0, 100));
  }
}

export async function getUrls(): Promise<string[]> {
  return ((await db.getItem<string[]>("urls")) || []);
}
