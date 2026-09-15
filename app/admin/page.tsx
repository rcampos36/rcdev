import { getContent } from "@/lib/content";
import ContentEditor from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getContent();
  return <ContentEditor initialContent={content} />;
}
