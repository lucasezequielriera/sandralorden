import AdminShell from "@/components/admin/AdminShell";
import MediaKitSettingsContent from "@/components/admin/MediaKitSettingsContent";
import { getMediaKitSettings } from "@/lib/media-kit-settings";

export default async function AdminMediaKitPage() {
  const settings = await getMediaKitSettings();

  return (
    <AdminShell>
      <MediaKitSettingsContent initialSettings={settings} />
    </AdminShell>
  );
}
