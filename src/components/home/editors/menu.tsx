import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaChevronDown } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import MenuItem from "./components/MenuItem";
import type { MenuPatchDto } from "../../../services/types";
import {
  useGetMenuQuery,
  usePatchMenuMutation,
  useUploadMenuImageMutation,
} from "../../../services/menu/menu";

// ----- Local UI types (map to/from API DTOs) -----
type MenuProps = { setUnsavedChanges: (unsaved: boolean) => void };

type MenuItemData = {
  id: string;            // local UUID for UI
  hasImage: boolean;
  imageUrl?: string;     // set after upload
  name: string;
  price: string;
  description: string;
};

type MenuSection = {
  id: string;            // local stable key/slug
  title: string;         // category name
  expanded: boolean;
  items: MenuItemData[];
};

const defaultItem = (): MenuItemData => ({
  id: uuidv4(),
  hasImage: false,
  imageUrl: undefined,
  name: "",
  price: "",
  description: "",
});

const Menu: React.FC<MenuProps> = ({ setUnsavedChanges }) => {
  // --- server state
  const { data: serverMenu, isFetching, isLoading, refetch } = useGetMenuQuery();
  const [patchMenu, { isLoading: isSaving }] = usePatchMenuMutation();
  const [uploadImage] = useUploadMenuImageMutation();

  // --- local UI state (sections mirror categories)
  const [sections, setSections] = useState<MenuSection[]>([]);
  // Baseline snapshot of server state for accurate unsaved-change detection
  const baselineRef = useRef<string>("");

  // Add Category UI state
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const addCategoryInputRef = useRef<HTMLInputElement | null>(null);

  const [resetToken, setResetToken] = useState<number>(0);
  const lastItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const headerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isResettingRef = useRef<boolean>(false);

  // Resolve image URLs (same as other components)
  const resolveImageUrl = (url: string | undefined) => {
    if (!url?.trim()) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    const HOST = 'https://localhost:7108';
    return `${HOST}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // ----- helpers -----
  const normalizeSections = (s: MenuSection[]) =>
    s.map((sec, si) => ({
      title: sec.title,
      sortOrder: si,
      items: sec.items.map((it, ii) => ({
        imageUrl: it.imageUrl || undefined,
        name: it.name.trim(),
        price: it.price.trim(),
        description: (it.description || "").trim(),
        sortOrder: ii,
      })),
    }));
  const setDirtyFrom = (updater: (prev: MenuSection[]) => MenuSection[]) => {
    setSections(updater);
  };

  const slugify = (name: string) =>
    (name || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  // Track unsaved changes by diffing against baseline snapshot
  useEffect(() => {
    if (isResettingRef.current) return;
    const sig = JSON.stringify(normalizeSections(sections));
    setUnsavedChanges(sig !== baselineRef.current);
  }, [sections, setUnsavedChanges]);

  // Optional: focus input on mount
  useEffect(() => {
    setTimeout(() => addCategoryInputRef.current?.focus(), 0);
  }, []);

  // ----- map server -> ui on first load or refresh -----
  useEffect(() => {
    if (!serverMenu) return;
    // Build sections from server categories
    if (serverMenu.categories?.length) {
      const s: MenuSection[] = [...serverMenu.categories]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((c, idx) => ({
          id: c.name.toLowerCase().replace(/\s+/g, "-") || `cat-${idx}`,
          title: c.name,
          expanded: false,
          items: [...c.items]
            .sort((a, b) => (a as any).sortOrder - (b as any).sortOrder)
            .map((i) => ({
              id: uuidv4(),
              hasImage: !!i.imageUrl,
              imageUrl: resolveImageUrl(i.imageUrl),
              name: i.name ?? "",
              price: i.price ?? "",
              description: i.description ?? "",
            })),
        }));
      baselineRef.current = JSON.stringify(normalizeSections(s));
      setSections(s);
    } else {
      // If no categories exist on server, start with empty array
      const empty: MenuSection[] = [];
      baselineRef.current = JSON.stringify(normalizeSections(empty));
      setSections(empty);
    }
  }, [serverMenu]);

  // Reset unsaved changes when server data loads (baseline set above)
  useEffect(() => {
    if (serverMenu) {
      setUnsavedChanges(false);
    }
  }, [serverMenu, setUnsavedChanges]);

  // ----- UI actions -----
  const toggleSection = (id: string) => {
    setSections((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s));
      const willExpand = !prev.find((s) => s.id === id)?.expanded;
      if (willExpand) {
        setTimeout(() => headerRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
      }
      return next;
    });
  };

  const addItem = (id: string) => {
    const sec = sections.find((s) => s.id === id);
    if (!sec) return;
    setDirtyFrom((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, items: [...s.items, defaultItem()] } : s));
      setTimeout(() => lastItemRefs.current[id]?.scrollIntoView({ behavior: "smooth" }), 0);
      return next;
    });
  };

  const deleteCategory = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const confirmDelete = window.confirm(
      `Delete category "${section?.title ?? ""}" and all its items?`
    );
    if (!confirmDelete) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    delete lastItemRefs.current[sectionId];
    delete headerRefs.current[sectionId];
  };

  const addCategoryFromName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const baseId = slugify(trimmed) || `cat-${sections.length + 1}`;
    // Ensure unique id
    const uniqueId = sections.some((s) => s.id === baseId)
      ? `${baseId}-${uuidv4().slice(0, 8)}`
      : baseId;
    const newSection: MenuSection = {
      id: uniqueId,
      title: trimmed,
      expanded: true,
      items: [defaultItem()],
    };
  setSections((prev) => [...prev, newSection]);
    setNewCategoryName("");
  addCategoryInputRef.current?.focus();
    setTimeout(() => headerRefs.current[uniqueId]?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const removeItem = (sectionId: string, id: string) => {
    setDirtyFrom((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== id) } : s))
    );
  };

  const updateHasImage = (sectionId: string, id: string, hasImage: boolean) => {
    setDirtyFrom((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.map((i) => (i.id === id ? { ...i, hasImage } : i)) } : s
      )
    );
  };

  const updateField = <K extends keyof Omit<MenuItemData, "id" | "hasImage">>(
    sectionId: string,
    id: string,
    field: K,
    value: MenuItemData[K]
  ) => {
    setDirtyFrom((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)) } : s
      )
    );
  };

  const updateImageFile = async (sectionId: string, id: string, file: File | null) => {
    if (!file) {
      setDirtyFrom((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, items: s.items.map((i) => (i.id === id ? { ...i, imageUrl: undefined, hasImage: false } : i)) }
            : s
        )
      );
      return;
    }
    try {
      const res = await uploadImage(file).unwrap();
      setDirtyFrom((prev) =>
        prev.map((s) =>
          s.id === sectionId
            ? { ...s, items: s.items.map((i) => (i.id === id ? { ...i, imageUrl: res.imageUrl, hasImage: true } : i)) }
            : s
        )
      );
    } catch (e: any) {
      alert(e?.data ?? e?.message ?? "Upload failed");
    }
  };

  const discardChanges = () => {
    const confirmDiscard = window.confirm("Are you sure you want to discard all changes? This cannot be undone.");
    if (!confirmDiscard) return;
    isResettingRef.current = true;
    setResetToken((n) => n + 1);
    
    // Reset to server data instead of hardcoded categories
    if (serverMenu?.categories?.length) {
      const s: MenuSection[] = [...serverMenu.categories]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((c, idx) => ({
          id: c.name.toLowerCase().replace(/\s+/g, "-") || `cat-${idx}`,
          title: c.name,
          expanded: false,
          items: [...c.items]
            .sort((a, b) => (a as any).sortOrder - (b as any).sortOrder)
            .map((i) => ({
              id: uuidv4(),
              hasImage: !!i.imageUrl,
              imageUrl: resolveImageUrl(i.imageUrl),
              name: i.name ?? "",
              price: i.price ?? "",
              description: i.description ?? "",
            })),
        }));
      baselineRef.current = JSON.stringify(normalizeSections(s));
      setSections(s);
    } else {
      // If no server data, reset to empty
      const empty: MenuSection[] = [];
      baselineRef.current = JSON.stringify(normalizeSections(empty));
      setSections(empty);
    }
    
    setTimeout(() => {
      isResettingRef.current = false;
      setUnsavedChanges(false);
    }, 0);
  };

  // ----- build PATCH + save -----
  const buildPatchPayload = (s: MenuSection[]): MenuPatchDto => ({
    categories: s.map((sec, si) => ({
      name: sec.title,
      sortOrder: si,
      isVisible: true,
      items: sec.items
        .filter((i) => (i.name.trim() || i.price.trim()))
        .map((i, ii) => ({
          // imageUrl is optional
          ...(i.imageUrl ? { imageUrl: i.imageUrl } : {}),
          name: i.name.trim(),
          price: i.price.trim(),
          description: i.description?.trim() || "",
          sortOrder: ii,
          isVisible: true,
        })),
    })),
  });

  const applyChanges = async () => {
    try {
      const payload = buildPatchPayload(sections);
      await patchMenu(payload).unwrap();
  baselineRef.current = JSON.stringify(normalizeSections(sections));
  setUnsavedChanges(false);
      alert("Menu saved!");
      void refetch();
    } catch (e: any) {
      alert(e?.data ?? e?.message ?? "Save failed");
    }
  };

  // ----- render -----
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {(isLoading || isFetching) && (
        <div className="w-full p-3 text-sm text-gray-500">Loading menu…</div>
      )}

      {sections.map((section) => (
        <div
          key={section.id}
          ref={(el) => { headerRefs.current[section.id] = el; }}
          className="w-full border border-gray-200 rounded-lg shadow-sm bg-white"
        >
          {/* Header */}
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
          >
            <span className="text-lg font-semibold">{section.title}</span>
            <FaChevronDown className={`transition-transform duration-300 ${section.expanded ? "rotate-180" : "rotate-0"}`} />
          </button>

          {/* Collapsible body */}
          <div
            className={`overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-in-out ${
              section.expanded ? "max-h-[3000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
            }`}
          >
            <div className="px-4 pb-4 flex flex-col gap-4">
              <div className="text-xs text-gray-500">
                Tip: Image upload is optional. You can add items without images.
              </div>
              {section.items.map((item, index) => (
                <div
                  key={item.id}
                  ref={
                    index === section.items.length - 1
                      ? (el: HTMLDivElement | null) => { lastItemRefs.current[section.id] = el; }
                      : undefined
                  }
                  className="w-full flex flex-col gap-3"
                >
                  {section.items.length > 1 && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeItem(section.id, item.id)}
                        className="bg-gray-100 border border-gray-300 shadow-md rounded-full p-1 cursor-pointer"
                      >
                        <RxCross2 className="text-red-500 w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <MenuItem
                    uniqueId={`menu-item-${section.id}-${item.id}`}
                    resetToken={resetToken}
                    onImageChange={(has) => updateHasImage(section.id, item.id, has)}
                    onImageFileChange={(file: File | null) => void updateImageFile(section.id, item.id, file)}
                    onNameChange={(v) => updateField(section.id, item.id, "name", v)}
                    onPriceChange={(v) => updateField(section.id, item.id, "price", v)}
                    onDescriptionChange={(v) => updateField(section.id, item.id, "description", v)}
                    initialName={item.name}
                    initialPrice={item.price}
                    initialDescription={item.description}
                    initialImageUrl={item.imageUrl}
                  />

                  <hr className="my-4 border-gray-300" />
                </div>
              ))}

              {/* Footer actions: left delete, right add item */}
              <div className="flex justify-between w-full items-center mt-2">
                <button
                  onClick={() => deleteCategory(section.id)}
                  className="px-5 py-2 h-[36px] flex justify-center items-center font-semibold rounded-lg text-white whitespace-nowrap bg-gradient-to-r from-red-500 via-pink-500 to-pink-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-md disabled:opacity-50 cursor-pointer"
                >
                  Delete Category
                </button>

                <button
                  onClick={() => addItem(section.id)}
                  className="px-6 py-2 w-[40px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <span className="flex items-center justify-center">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Show helpful message when no categories exist */}
      {sections.length === 0 && !isLoading && !isFetching && (
        <div className="w-full p-8 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-gray-500 text-lg mb-4">No menu categories found.</p>
          <p className="text-gray-400 text-sm">Categories will appear here when they exist in your menu data.</p>
        </div>
      )}

      <div className="flex justify-between w-full items-center gap-3">
        {/* Left: Add Category */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => addCategoryFromName(newCategoryName)}
            className="px-5 py-2 h-[40px] flex justify-center items-center font-bold rounded-lg text-white whitespace-nowrap bg-gradient-to-r from-green-500 via-emerald-500 to-emerald-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <span>Add Category</span>
          </button>
          <input
            ref={addCategoryInputRef}
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCategoryFromName(newCategoryName);
              }
            }}
            placeholder="New category name"
            className="p-2 border border-gray-300 rounded w-[260px]"
          />
        </div>

        {/* Right: Discard / Apply */}
        <button
          onClick={discardChanges}
          className="px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-red-500 via-pink-500 to-pink-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={applyChanges}
          disabled={isSaving}
          className="px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? "Saving…" : "Apply Changes"}
        </button>
      </div>
    </div>
  );
};

export default Menu;
