import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Upload, Trash2, Loader2, Image as ImageIcon, Video, GripVertical, Eye, EyeOff, ExternalLink, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { logAudit } from "../lib/audit";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const photoCategories = ["Bedrooms", "Living Room", "Dining Area", "Kitchen", "Bathrooms", "Views", "Exterior"];

interface Asset {
  id: string;
  storage_path: string;
  public_url: string;
  kind: "image" | "video";
  filename: string;
  alt_text: string | null;
  show_in_gallery: boolean;
  is_published: boolean;
  gallery_category: string | null;
  gallery_sort_order: number;
  published_at: string | null;
}

const GalleryManager = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<"all" | "in_gallery" | "published" | "hidden">("all");
  const [kindFilter, setKindFilter] = useState<"all" | "image" | "video">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const load = async () => {
    const { data, error } = await (supabase.from("media_assets") as any)
      .select("id, storage_path, public_url, kind, filename, alt_text, show_in_gallery, is_published, gallery_category, gallery_sort_order, published_at")
      .order("gallery_sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setAssets((data as Asset[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = (files: FileList) => {
    const list = Array.from(files);
    if (inputRef.current) inputRef.current.value = "";
    setUploading(true);
    toast.info(`Uploading ${list.length} file${list.length === 1 ? "" : "s"}…`);

    const userPromise = supabase.auth.getUser();
    const baseSort = (assets[assets.length - 1]?.gallery_sort_order ?? 0) + 10;

    const tasks = list.map(async (file, idx) => {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) { toast.error(`${file.name}: unsupported type`); return; }
      const maxBytes = isVideo ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxBytes) { toast.error(`${file.name}: max ${isVideo ? "100MB" : "50MB"}`); return; }

      const folder = isVideo ? "videos" : "images";
      const ext = file.name.split(".").pop();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, cacheControl: "3600" });
      if (upErr) { toast.error(`${file.name}: ${upErr.message}`); return; }

      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      const { data: { user } } = await userPromise;

      return {
        storage_path: path,
        public_url: publicUrl,
        kind: (isVideo ? "video" : "image") as "image" | "video",
        filename: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: user?.id,
        show_in_gallery: true,
        is_published: false,
        gallery_sort_order: baseSort + idx * 10,
      };
    });

    Promise.allSettled(tasks).then(async (results) => {
      const uploaded = results.flatMap((r) => r.status === "fulfilled" && r.value ? [r.value] : []);
      if (uploaded.length > 0) {
        const { error: dbErr } = await supabase.from("media_assets").insert(uploaded);
        if (dbErr) toast.error(dbErr.message);
        else uploaded.forEach((item) => void logAudit("upload_gallery_media", "media_asset", item.storage_path, { filename: item.filename }));
      }
      setUploading(false);
      toast.success(uploaded.length > 0 ? `${uploaded.length} uploaded` : "No files uploaded");
      load();
    });
  };

  const updateAsset = async (id: string, changes: Partial<Asset>) => {
    setAssets((curr) => curr.map((a) => a.id === id ? { ...a, ...changes } : a));
    const payload: any = { ...changes };
    if (changes.is_published === true) payload.published_at = new Date().toISOString();
    if (changes.is_published === false) payload.published_at = null;
    const { error } = await (supabase.from("media_assets") as any).update(payload).eq("id", id);
    if (error) { toast.error(error.message); load(); return; }
    await logAudit("update_gallery_media", "media_asset", id, changes);
  };

  const remove = async (asset: Asset) => {
    if (!confirm(`Delete ${asset.filename}? This cannot be undone.`)) return;
    await supabase.storage.from("media").remove([asset.storage_path]);
    await supabase.from("media_assets").delete().eq("id", asset.id);
    await logAudit("delete_gallery_media", "media_asset", asset.id, { filename: asset.filename });
    toast.success("Deleted");
    setAssets((curr) => curr.filter((a) => a.id !== asset.id));
  };

  const replace = async (asset: Asset, file: File) => {
    if (file.size > 50 * 1024 * 1024) { toast.error("Max 50MB"); return; }
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) { toast.error("Unsupported file type"); return; }
    if ((isVideo ? "video" : "image") !== asset.kind) {
      toast.error(`Replacement must be the same type (${asset.kind})`);
      return;
    }
    toast.info("Replacing…");
    const folder = isVideo ? "videos" : "images";
    const ext = file.name.split(".").pop();
    const newPath = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("media").upload(newPath, file, { contentType: file.type, cacheControl: "3600" });
    if (upErr) { toast.error(upErr.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(newPath);
    const { error: dbErr } = await (supabase.from("media_assets") as any).update({
      storage_path: newPath,
      public_url: publicUrl,
      filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    }).eq("id", asset.id);
    if (dbErr) {
      await supabase.storage.from("media").remove([newPath]);
      toast.error(dbErr.message);
      return;
    }
    // Best-effort cleanup of the previous file
    await supabase.storage.from("media").remove([asset.storage_path]);
    await logAudit("replace_gallery_media", "media_asset", asset.id, { old: asset.filename, new: file.name });
    setAssets((curr) => curr.map((a) => a.id === asset.id ? { ...a, storage_path: newPath, public_url: publicUrl, filename: file.name } : a));
    toast.success("Replaced");
  };

  const autoCaption = async (asset: Asset): Promise<string | null> => {
    const { data, error } = await supabase.functions.invoke("auto-caption", {
      body: { image_url: asset.public_url, category: asset.gallery_category },
    });
    if (error) { toast.error(error.message ?? "Caption failed"); return null; }
    const caption = (data as { caption?: string })?.caption?.trim();
    if (!caption) { toast.error("No caption returned"); return null; }
    await updateAsset(asset.id, { alt_text: caption });
    toast.success("Caption generated");
    return caption;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = assets.findIndex((a) => a.id === active.id);
    const newIdx = assets.findIndex((a) => a.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;

    const reordered = arrayMove(assets, oldIdx, newIdx);
    // Reassign sort orders in steps of 10
    const updated = reordered.map((a, i) => ({ ...a, gallery_sort_order: (i + 1) * 10 }));
    setAssets(updated);

    // Persist all changed orders in parallel
    const writes = updated.map((a) =>
      (supabase.from("media_assets") as any).update({ gallery_sort_order: a.gallery_sort_order }).eq("id", a.id)
    );
    const results = await Promise.all(writes);
    const failure = results.find((r: any) => r.error);
    if (failure) { toast.error("Failed to save order"); load(); }
    else toast.success("Order saved");
  };

  const visible = assets.filter((a) => {
    if (kindFilter !== "all" && a.kind !== kindFilter) return false;
    if (filter === "in_gallery") return a.show_in_gallery;
    if (filter === "published") return a.is_published;
    if (filter === "hidden") return !a.show_in_gallery;
    return true;
  });

  const stats = {
    total: assets.length,
    inGallery: assets.filter((a) => a.show_in_gallery).length,
    published: assets.filter((a) => a.is_published).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Gallery Manager</h1>
          <p className="text-muted-foreground mt-1">Upload, reorder, categorise and publish photos & videos for the public gallery.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="/gallery" target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" /> Preview
            </a>
          </Button>
          <input ref={inputRef} type="file" multiple accept="image/*,video/*" hidden
            onChange={(e) => e.target.files && handleUpload(e.target.files)} />
          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Total assets</p>
          <p className="font-display text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">In gallery</p>
          <p className="font-display text-2xl font-bold">{stats.inGallery}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Published live</p>
          <p className="font-display text-2xl font-bold text-primary">{stats.published}</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "in_gallery", "published", "hidden"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f === "all" ? "All" : f === "in_gallery" ? "In gallery" : f === "published" ? "Published" : "Hidden"}
          </Button>
        ))}
        <div className="w-px bg-border mx-1" />
        {(["all", "image", "video"] as const).map((k) => (
          <Button key={k} variant={kindFilter === k ? "default" : "outline"} size="sm" onClick={() => setKindFilter(k)}>
            {k === "all" ? "All media" : k === "image" ? "Photos" : "Videos"}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid place-items-center py-20"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : visible.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="size-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold">No media yet</p>
          <p className="text-sm text-muted-foreground mt-1">Click Upload to add your first gallery photo or video.</p>
        </Card>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visible.map((a) => a.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visible.map((a) => (
                <SortableAssetCard key={a.id} asset={a} onUpdate={updateAsset} onRemove={remove} onReplace={replace} onAutoCaption={autoCaption} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <p className="text-xs text-muted-foreground">
        Tip: drag the <GripVertical className="inline size-3" /> handle to reorder. Toggle <strong>In gallery</strong> to include an asset, then <strong>Published</strong> to make it visible to visitors.
      </p>
    </div>
  );
};

interface CardProps {
  asset: Asset;
  onUpdate: (id: string, changes: Partial<Asset>) => void;
  onRemove: (asset: Asset) => void;
  onReplace: (asset: Asset, file: File) => Promise<void>;
  onAutoCaption: (asset: Asset) => Promise<string | null>;
}

const SortableAssetCard = ({ asset, onUpdate, onRemove, onReplace, onAutoCaption }: CardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: asset.id });
  const [altText, setAltText] = useState(asset.alt_text ?? "");
  const [captioning, setCaptioning] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setAltText(asset.alt_text ?? ""); }, [asset.alt_text]);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="overflow-hidden">
      <div className="aspect-video bg-muted relative">
        {asset.kind === "image" ? (
          <img src={asset.public_url} alt={asset.alt_text ?? asset.filename} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <video src={asset.public_url} className="w-full h-full object-cover" preload="metadata" />
        )}
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 size-8 grid place-items-center rounded-md bg-background/90 backdrop-blur cursor-grab active:cursor-grabbing hover:bg-background"
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </button>
        <div className="absolute top-2 right-2 flex gap-1">
          {asset.kind === "video" && <Badge variant="secondary" className="gap-1"><Video className="size-3" /> Video</Badge>}
          {asset.is_published ? (
            <Badge className="gap-1"><Eye className="size-3" /> Live</Badge>
          ) : asset.show_in_gallery ? (
            <Badge variant="outline" className="gap-1 bg-background/90"><EyeOff className="size-3" /> Draft</Badge>
          ) : null}
        </div>
      </div>

      <div className="p-3 space-y-3">
        <p className="text-xs font-medium truncate" title={asset.filename}>{asset.filename}</p>

        {asset.kind === "image" && (
          <select
            value={asset.gallery_category ?? ""}
            onChange={(e) => onUpdate(asset.id, { gallery_category: e.target.value || null })}
            className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="">No category</option>
            {photoCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        )}

        <div className="flex gap-1">
          <Input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            onBlur={() => { if ((altText || null) !== asset.alt_text) onUpdate(asset.id, { alt_text: altText || null }); }}
            placeholder="Alt text (caption)"
            className="h-8 text-xs"
          />
          {asset.kind === "image" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-2 shrink-0"
              title="Auto-generate caption with AI"
              disabled={captioning}
              onClick={async () => {
                setCaptioning(true);
                const c = await onAutoCaption(asset);
                if (c) setAltText(c);
                setCaptioning(false);
              }}
            >
              {captioning ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
            </Button>
          )}
        </div>

        <div className="rounded-md bg-secondary/60 p-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`gal-${asset.id}`} className="text-xs">In gallery</Label>
            <Switch
              id={`gal-${asset.id}`}
              checked={asset.show_in_gallery}
              onCheckedChange={(v) => onUpdate(asset.id, { show_in_gallery: v, is_published: v ? asset.is_published : false })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor={`pub-${asset.id}`} className="text-xs">Published</Label>
            <Switch
              id={`pub-${asset.id}`}
              checked={asset.is_published}
              disabled={!asset.show_in_gallery}
              onCheckedChange={(v) => onUpdate(asset.id, { is_published: v })}
            />
          </div>
        </div>

        <input
          ref={replaceInputRef}
          type="file"
          accept={asset.kind === "video" ? "video/*" : "image/*"}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (replaceInputRef.current) replaceInputRef.current.value = "";
            if (f) onReplace(asset, f);
          }}
        />
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => replaceInputRef.current?.click()}
          >
            <RefreshCw className="size-3" /> Replace
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onRemove(asset)}
          >
            <Trash2 className="size-3" /> Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GalleryManager;
