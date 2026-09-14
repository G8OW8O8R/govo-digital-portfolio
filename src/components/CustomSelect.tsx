import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface CustomSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: string[];
  defaultValue?: string;
  required?: boolean;
}

export function CustomSelect({
  name,
  label,
  placeholder = "Choose an option",
  options,
  defaultValue = "",
  required,
}: CustomSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const [highlighted, setHighlighted] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedIndex = options.indexOf(selected);

  useEffect(() => {
    if (open) {
      setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
      // Focus the first focusable item in the list for a11y
      const first = listRef.current?.querySelector('[role="option"]') as HTMLElement | null;
      first?.focus();
    }
  }, [open, selectedIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlighted((i) => Math.min(i + 1, options.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlighted((i) => Math.max(i - 1, 0));
          break;
        case "Home":
          e.preventDefault();
          setHighlighted(0);
          break;
        case "End":
          e.preventDefault();
          setHighlighted(options.length - 1);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          select(options[highlighted]);
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
          break;
        case "Tab":
          setOpen(false);
          break;
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("mousedown", onClick);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("mousedown", onClick);
      };
    }
  }, [open, highlighted, options]);

  const select = (value: string) => {
    setSelected(value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-foreground/50"
        >
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 text-left text-sm transition focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 hover:border-primary/40"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-foreground/40 transition duration-300 ${open ? "rotate-180 text-primary" : "group-hover:text-foreground/70"}`}
        />
      </button>

      <input type="hidden" name={name} value={selected} required={required} />

      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-activedescendant={`${id}-option-${highlighted}`}
          className="absolute z-50 mt-2 w-full origin-top overflow-hidden rounded-2xl border border-border bg-card/95 p-1.5 shadow-soft backdrop-blur-xl animate-scale-in"
        >
          {options.map((opt, i) => {
            const isSelected = opt === selected;
            const isHighlighted = i === highlighted;
            return (
              <div
                key={opt}
                id={`${id}-option-${i}`}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => select(opt)}
                className={`flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-sm transition ${
                  isHighlighted || isSelected
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-primary/5 hover:text-foreground"
                }`}
              >
                <span>{opt}</span>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
