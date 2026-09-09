import { notFound } from "next/navigation";
import ConversationSessionView from "@/components/ConversationSessionView";
import { directory, getDirectoryEntry } from "@/lib/avatars";

export function generateStaticParams() {
  return directory.map((avatar) => ({ avatarId: avatar.id }));
}

export default async function ConversationPage(
  props: PageProps<"/avatars/[avatarId]/conversation">,
) {
  const { avatarId } = await props.params;
  const avatar = getDirectoryEntry(avatarId);
  if (!avatar) {
    notFound();
  }
  return <ConversationSessionView avatar={avatar} />;
}
