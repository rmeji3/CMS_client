import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaPlus, FaChevronDown } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import MenuItem from "./components/MenuItem";

type MenuProps = {
  setUnsavedChanges: (unsaved: boolean) => void;
};

type MenuItemData = {
  id: string;
  hasImage: boolean;
  name: string;
  price: string;
  description: string;
};

type MenuSection = {
  id: string; // stable key/slug, e.g., "appetizers"
  title: string; // display title, e.g., "Appetizers"
  expanded: boolean;
  items: MenuItemData[];
};

const Menu: React.FC<MenuProps> = ({ setUnsavedChanges }) => {
  const defaultItem = (): MenuItemData => ({
    id: uuidv4(),
    hasImage: false,
    name: "",
    price: "",
    description: "",
  });

  const [sections, setSections] = useState<MenuSection[]>([
    { id: "appetizers", title: "Appetizers", expanded: false, items: [defaultItem()] },
    { id: "mains", title: "Mains", expanded: false, items: [defaultItem()] },
    { id: "desserts", title: "Desserts", expanded: false, items: [defaultItem()] },
    { id: "drinks", title: "Drinks", expanded: false, items: [defaultItem()] },
  ]);

  const [resetToken, setResetToken] = useState<number>(0);
  const lastItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const headerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isResettingRef = useRef<boolean>(false);

  const listDirty = (list: MenuItemData[]) => {
    if (!list || list.length === 0) return false;
    if (list.length > 1) return true;
    const only = list[0];
    return (
      !!only.hasImage ||
      (only.name?.trim().length ?? 0) > 0 ||
      (only.price?.trim().length ?? 0) > 0 ||
      (only.description?.trim().length ?? 0) > 0
    );
  };

  const anyDirty = (s: MenuSection[]) => s.some((sec) => listDirty(sec.items));

  const setDirtyFrom = (updater: (prev: MenuSection[]) => MenuSection[]) => {
    setSections((prev) => {
      const next = updater(prev);
      if (!isResettingRef.current) setUnsavedChanges(anyDirty(next));
      return next;
    });
  };

  const toggleSection = (id: string) => {
    setSections((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, expanded: !s.expanded } : s
      );
      // scroll on expand
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
    if (sec.items.some((i) => !i.hasImage)) {
      alert("Please upload an image for the current item before adding a new one.");
      return;
    }
    setDirtyFrom((prev) => {
      const next = prev.map((s) =>
        s.id === id ? { ...s, items: [...s.items, defaultItem()] } : s
      );
      setTimeout(() => lastItemRefs.current[id]?.scrollIntoView({ behavior: "smooth" }), 0);
      return next;
    });
  };

  const removeItem = (sectionId: string, id: string) => {
    setDirtyFrom((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: s.items.filter((i) => i.id !== id) } : s
      )
    );
  };

  const updateHasImage = (sectionId: string, id: string, hasImage: boolean) => {
    setDirtyFrom((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.map((i) => (i.id === id ? { ...i, hasImage } : i)) }
          : s
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
        s.id === sectionId
          ? { ...s, items: s.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)) }
          : s
      )
    );
  };

  const discardChanges = () => {
    const confirmDiscard = window.confirm(
      "Are you sure you want to discard all changes? This cannot be undone."
    );
    if (!confirmDiscard) return;

    isResettingRef.current = true;
    setResetToken((n) => n + 1);
    setSections([
      { id: "appetizers", title: "Appetizers", expanded: false, items: [defaultItem()] },
      { id: "mains", title: "Mains", expanded: false, items: [defaultItem()] },
      { id: "desserts", title: "Desserts", expanded: false, items: [defaultItem()] },
      { id: "drinks", title: "Drinks", expanded: false, items: [defaultItem()] },
    ]);
    setUnsavedChanges(false);
    setTimeout(() => {
      isResettingRef.current = false;
    }, 0);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {sections.map((section) => {
        return (
          <div
            key={section.id}
            ref={(el: HTMLDivElement | null) => {
              headerRefs.current[section.id] = el;
            }}
            className="w-full border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            {/* Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
            >
              <span className="text-lg font-semibold">{section.title}</span>
              <FaChevronDown
                className={`transition-transform duration-300 ${section.expanded ? "rotate-180" : "rotate-0"}`}
              />
            </button>

            {/* Collapsible body */}
            <div
              className={`overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-in-out ${
                section.expanded
                  ? "max-h-[3000px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <div className="px-4 pb-4 flex flex-col gap-4">
                {section.items.map(({ id }, index) => (
                  <div
                    key={id}
                    ref={
                      index === section.items.length - 1
                        ? (el: HTMLDivElement | null) => {
                            lastItemRefs.current[section.id] = el;
                          }
                        : undefined
                    }
                    className="w-full flex flex-col gap-3"
                  >
                    {section.items.length > 1 && (
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeItem(section.id, id)}
                          className="bg-gray-100 border border-gray-300 shadow-md rounded-full p-1 cursor-pointer"
                        >
                          <RxCross2 className="text-red-500 w-5 h-5" />
                        </button>
                      </div>
                    )}

                    <MenuItem
                      uniqueId={`menu-item-${section.id}-${id}`}
                      resetToken={resetToken}
                      onImageChange={(has) => updateHasImage(section.id, id, has)}
                      onNameChange={(v) => updateField(section.id, id, "name", v)}
                      onPriceChange={(v) => updateField(section.id, id, "price", v)}
                      onDescriptionChange={(v) => updateField(section.id, id, "description", v)}
                    />

                    <hr className="my-4 border-gray-300" />
                  </div>
                ))}

                <div className="flex justify-start w-full items-center">
                  <button
                    onClick={() => addItem(section.id)}
                    className="px-6 py-2 w-[40px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    <span className="flex items-center justify-center">
                      <FaPlus />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end w-full items-center gap-3">
        <button
          onClick={discardChanges}
          className="px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-red-500 via-pink-500 to-pink-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
        >
          Discard
        </button>
        <button
          type="submit"
          className="px-6 py-2 w-[170px] h-[40px] flex justify-center items-center gap-2 font-bold rounded-lg text-white bg-gradient-to-r from-purple-500 via-blue-500 to-blue-400 bg-[length:200%_200%] bg-left transition-all duration-700 hover:bg-right shadow-lg disabled:opacity-50 cursor-pointer"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default Menu;
