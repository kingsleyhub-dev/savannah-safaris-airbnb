import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Loader2, ReceiptText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type Profile = { id: string; user_id: string; full_name: string | null; email: string | null; created_at: string };
type ReceiptDownload = { id: string; user_id: string; booking_id: string; downloaded_at: string };

const UsersPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [downloads, setDownloads] = useState<ReceiptDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: profileData, error: profileError }, { data: downloadData, error: downloadError }] = await Promise.all([
        supabase.from("profiles").select("id, user_id, full_name, email, created_at").order("created_at", { ascending: false }),
        (supabase.from("receipt_downloads" as any) as any).select("id, user_id, booking_id, downloaded_at").order("downloaded_at", { ascending: false }),
      ]);

      if (profileError || downloadError) toast.error("Could not load users");
      setProfiles((profileData as Profile[]) ?? []);
      setDownloads((downloadData as ReceiptDownload[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const counts = useMemo(() => downloads.reduce<Record<string, number>>((acc, item) => {
    acc[item.user_id] = (acc[item.user_id] ?? 0) + 1;
    return acc;
  }, {}), [downloads]);

  const filtered = profiles.filter((profile) => {
    const query = search.toLowerCase();
    return (profile.full_name ?? "").toLowerCase().includes(query) || (profile.email ?? "").toLowerCase().includes(query);
  });

  const selectedDownloads = selected ? downloads.filter((download) => download.user_id === selected.user_id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground mt-1">Review registered guests and receipt download history.</p>
      </div>

      <Card className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name or email…" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        {loading ? (
          <div className="grid place-items-center py-20"><Loader2 className="size-6 animate-spin text-primary" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Joined</TableHead>
                <TableHead>Receipts Downloaded</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((profile) => (
                <TableRow key={profile.id} className="cursor-pointer" onClick={() => setSelected(profile)}>
                  <TableCell className="font-medium">{profile.full_name || "Guest"}</TableCell>
                  <TableCell>{profile.email || "—"}</TableCell>
                  <TableCell>{format(new Date(profile.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell><Badge variant="secondary">{counts[profile.user_id] ?? 0}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{selected?.full_name || "Guest"}</SheetTitle>
            <SheetDescription>{selected?.email}</SheetDescription>
          </SheetHeader>
          {selected && (
            <div className="mt-6 space-y-6">
              <div className="rounded-lg border border-border p-4 text-sm">
                <p><span className="text-muted-foreground">User ID:</span> {selected.user_id}</p>
                <p><span className="text-muted-foreground">Joined:</span> {format(new Date(selected.created_at), "PPpp")}</p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">Receipt downloads</h3>
                {selectedDownloads.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No receipts downloaded yet.</p>
                ) : selectedDownloads.map((download) => (
                  <div key={download.id} className="flex gap-3 rounded-lg border border-border p-3 text-sm">
                    <ReceiptText className="mt-0.5 size-4 text-primary" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">Booking {download.booking_id}</p>
                      <p className="text-muted-foreground">{format(new Date(download.downloaded_at), "PPpp")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default UsersPage;