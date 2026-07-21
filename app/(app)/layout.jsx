import AppShell from "@/components/shell/AppShell";
import StreamCallCenter from "@/components/stream/StreamCallCenter";

export default function AppGroupLayout({ children }) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <StreamCallCenter />
    </>
  );
}
