import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "./content-types";
import { DEFAULT_CONTENT } from "./default-content";
import { filesystemReadOnlyMessage, hasBlobStore, readContentBlob, writeContentBlob } from "./storage";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

function mergeContent(partial: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    navigation: { ...DEFAULT_CONTENT.navigation, ...partial?.navigation },
    projects: {
      ...DEFAULT_CONTENT.projects,
      ...partial?.projects,
      items: partial?.projects?.items ?? DEFAULT_CONTENT.projects.items,
    },
    services: {
      ...DEFAULT_CONTENT.services,
      ...partial?.services,
      items: partial?.services?.items ?? DEFAULT_CONTENT.services.items,
    },
    contact: { ...DEFAULT_CONTENT.contact, ...partial?.contact },
    footer: { ...DEFAULT_CONTENT.footer, ...partial?.footer },
  };
}

function parseContent(raw: string) {
  return mergeContent(JSON.parse(raw) as Partial<SiteContent>);
}

async function readLocalContent() {
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  return parseContent(raw);
}

export async function getContent(): Promise<SiteContent> {
  if (hasBlobStore()) {
    try {
      const raw = await readContentBlob();
      if (raw) return parseContent(raw);
    } catch (error) {
      console.error("Failed to read blob content", error);
    }
  }

  try {
    return await readLocalContent();
  } catch {
    try {
      await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
      await fs.writeFile(CONTENT_PATH, JSON.stringify(DEFAULT_CONTENT, null, 2), "utf8");
    } catch {
      // Filesystem may be read-only in some hosts.
    }
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(content: SiteContent): Promise<SiteContent> {
  const merged = mergeContent(content);
  const json = JSON.stringify(merged, null, 2);

  if (hasBlobStore()) {
    await writeContentBlob(json);
    try {
      await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
      await fs.writeFile(CONTENT_PATH, json, "utf8");
    } catch {
      // Local write is optional when blob storage is the source of truth.
    }
    return merged;
  }

  if (process.env.VERCEL) {
    throw new Error(filesystemReadOnlyMessage());
  }

  try {
    await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
    await fs.writeFile(CONTENT_PATH, json, "utf8");
    return merged;
  } catch (error) {
    const failure = error instanceof Error ? error : new Error(filesystemReadOnlyMessage());
    failure.message = filesystemReadOnlyMessage();
    throw failure;
  }
}
