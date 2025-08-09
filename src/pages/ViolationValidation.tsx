import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchValidationImages,
  removeDetailFromImage,
  submitValidationForImage,
  ValidationImage,
} from "@/store/validationSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image as ImageIcon, CheckCircle2, XCircle, Loader2, Plus } from "lucide-react";
import { BASEURL } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const ViolationValidation: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { items, loading, error, hasMore, page, limit } = useSelector(
    (s: RootState) => s.validation
  );
  const profile = useSelector((s: RootState) => s.user.profile);

  const [openId, setOpenId] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = "Violation Validation | Admin";
  }, []);

  useEffect(() => {
    // initial fetch
    if (!items.length) {
      dispatch(fetchValidationImages({ page: 1, limit: 30 }));
    }
  }, [dispatch]);

  const selectedImage: ValidationImage | undefined = useMemo(
    () => items.find((it) => it._id === openId),
    [items, openId]
  );

  const humanAddedPairs = useMemo(() => {
    if (!selectedImage) return [] as Array<{ index: number; label: string; description: string }>;
    return selectedImage.details
      .map((d, idx) => ({ d, idx }))
      .filter(({ d }) => !!d.isHumanAdded)
      .map(({ d, idx }) => ({ index: idx, label: d.violationName, description: d.description }));
  }, [selectedImage]);

  const onOpenModal = (id?: string) => setOpenId(id);

  const handleInvalid = (index: number) => {
    if (!selectedImage?._id) return;
    dispatch(removeDetailFromImage({ imageId: selectedImage._id, index }));
  };

  const handleSave = async () => {
    if (!selectedImage) return;
    try {
      await dispatch(submitValidationForImage({ image: selectedImage })).unwrap();
      toast({ title: "Saved", description: "Validation submitted successfully." });
      setOpenId(undefined);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "Failed to submit validation.",
        variant: "destructive",
      });
    }
  };

  const handleFetchMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchValidationImages({ page: page + 1, limit }));
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Violation Validation</h1>
        <p className="text-sm opacity-80">Review and validate human-added violations.</p>
      </header>

      {error && (
        <div className="mb-4 text-red-500">{error}</div>
      )}

      <section aria-label="Validation grid" className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {items.map((image) => {
          const humanCount = image.details.filter((d) => d.isHumanAdded).length;
          return (
            <Card key={image._id || image.imageName} className="cursor-pointer hover:shadow-md transition" onClick={() => onOpenModal(image._id)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm truncate" title={image.imageName}>
                  {image.imageName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] w-full bg-muted/30 rounded overflow-hidden flex items-center justify-center">
                  <img
                    src={`${BASEURL}/boundingBox/${image.employeeId}/${image.imagePath}`}
                    alt={`Annotated ${image.imageName}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 text-xs flex items-center justify-between">
                  <span className="inline-flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" /> {image.imageSize.width}×{image.imageSize.height}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Plus className="h-4 w-4" /> {humanCount} to review
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="flex justify-center mt-6">
        {hasMore && (
          <Button onClick={handleFetchMore} disabled={loading} variant="secondary">
            {loading ? (
              <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</span>
            ) : (
              "Fetch more"
            )}
          </Button>
        )}
      </div>

      {/* Modal */}
      <Dialog open={!!openId} onOpenChange={(v) => setOpenId(v ? openId : undefined)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div>
              <DialogHeader>
                <DialogTitle>{selectedImage.imageName}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="rounded overflow-hidden border">
                  <img
                    src={`${BASEURL}/boundingBox/${selectedImage.employeeId}/${selectedImage.imagePath}`}
                    alt={`Annotated ${selectedImage.imageName}`}
                    className="w-full h-auto"
                  />
                </div>
                <div>
                  <h2 className="font-medium mb-2">Human-added violations</h2>
                  <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
                    {humanAddedPairs.length === 0 && (
                      <div className="text-sm opacity-70">No human-added violations to validate.</div>
                    )}
                    {humanAddedPairs.map((item, idx) => (
                      <div key={`${item.index}-${item.label}`} className="border rounded p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">{item.label}</div>
                            <div className="text-xs opacity-80">{item.description}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="gap-1">
                              <CheckCircle2 className="h-4 w-4" /> Valid
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleInvalid(item.index)}>
                              <XCircle className="h-4 w-4" /> Invalid
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => setOpenId(undefined)}>
                      Close
                    </Button>
                    <Button onClick={handleSave} disabled={loading || humanAddedPairs.length === 0}>
                      {loading ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving…</span> : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViolationValidation;
