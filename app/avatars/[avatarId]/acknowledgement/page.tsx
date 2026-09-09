import { notFound } from "next/navigation";
import ConversationAcknowledgementView from "@/components/ConversationAcknowledgementView";
import { directory, getDirectoryEntry } from "@/lib/avatars";

export function generateStaticParams() {
  return directory.map((avatar) => ({ avatarId: avatar.id }));
}

export default async function AcknowledgementPage(
  props: PageProps<"/avatars/[avatarId]/acknowledgement">,
) {
  const { avatarId } = await props.params;
  const avatar = getDirectoryEntry(avatarId);
  if (!avatar) {
    notFound();
  }
  return <ConversationAcknowledgementView avatar={avatar} />;
}
