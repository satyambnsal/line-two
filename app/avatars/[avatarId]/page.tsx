import { notFound } from "next/navigation";
import AvatarProfileView from "@/components/AvatarProfileView";
import { directory, getDirectoryEntry } from "@/lib/avatars";

export function generateStaticParams() {
  return directory.map((avatar) => ({ avatarId: avatar.id }));
}

export default async function AvatarProfilePage(
  props: PageProps<"/avatars/[avatarId]">,
) {
  const { avatarId } = await props.params;
  const avatar = getDirectoryEntry(avatarId);
  if (!avatar) {
    notFound();
  }
  return <AvatarProfileView avatar={avatar} />;
}
