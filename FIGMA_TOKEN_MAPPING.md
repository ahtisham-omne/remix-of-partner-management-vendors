# Omne Design System v2.0 — Token Mapping Reference

> **Figma File:** [Omne Design System v2.0](https://www.figma.com/design/4XilIqpnxtWLQis7bRwvOc)  
> **Last synced:** April 15, 2026

---

## Architecture

```
Figma                          Code
─────────────────────────────  ─────────────────────────
1. Primitives (451 vars)   →   Tailwind default palette
2. Theme (221 vars)        →   tailwind.config.ts extend
3. Mode – Light/Dark (36)  →   :root / .dark CSS vars
4. Custom (26 vars)        →   Responsive overrides
5. Icon Library (5)        →   lucide-react
```

---

## Color Token Mapping (Figma M3 → ShadCN)

| Figma Token (3. Mode) | CSS Variable | Light Value | Dark Value |
|---|---|---|---|
| `base/surface` | `--background` | `0 0% 98%` | `0 0% 4%` |
| `base/on-surface` | `--foreground` | `0 0% 4%` | `0 0% 98%` |
| `base/surface-container` | `--card`, `--popover` | `0 0% 100%` | `0 0% 9%` |
| `base/on-surface-container` | `--card-foreground`, `--popover-foreground` | `0 0% 4%` | `0 0% 98%` |
| `base/primary` | `--primary` | `213 100% 52%` | `213 100% 52%` |
| `base/on-primary` | `--primary-foreground` | `0 0% 98%` | `0 0% 98%` |
| `base/secondary` | `--secondary` | `0 0% 96%` | `0 0% 15%` |
| `base/on-secondary` | `--secondary-foreground` | `0 0% 9%` | `0 0% 98%` |
| `base/surface-variant` | `--muted` | `0 0% 96%` | `0 0% 15%` |
| `base/on-surface-variant` | `--muted-foreground` | `0 0% 45%` | `0 0% 64%` |
| `base/error` | `--destructive` | `351 60% 49%` | `353 78% 63%` |
| `base/on-error` | `--destructive-foreground` | `353 81% 96%` | `353 81% 96%` |
| `base/outline` | `--border`, `--input` | `0 0% 90%` | `0 0% 15%` |
| `base/focus-indicator` | `--ring` | `0 0% 64%` | `0 0% 45%` |
| *Colors/blue/50* (derived) | `--accent` | `211 100% 96%` | `213 80% 15%` |
| *Colors/blue/700* (derived) | `--accent-foreground` | `214 93% 41%` | `210 100% 75%` |

### Extended Semantic Colors (Figma base/*)

| Figma Token | CSS Variable | Light | Dark |
|---|---|---|---|
| `base/success` | `--success` | `159 60% 33%` | `163 48% 51%` |
| `base/warning` | `--warning` | `35 68% 50%` | `36 92% 62%` |
| `base/orange` | `--orange` | `24 83% 47%` | `22 100% 62%` |
| `base/purple` | `--purple` | `243 71% 59%` | `244 93% 72%` |
| `base/violet` | `--violet` | `262 83% 58%` | `255 92% 76%` |
| `base/fuchsia` | `--fuchsia` | `293 69% 49%` | `292 91% 73%` |

---

## Border Radius (Figma radius/* → Tailwind)

| Figma Token | Value | Tailwind Class | CSS |
|---|---|---|---|
| `radius/xs` | 2px | `rounded-xs` | `0.125rem` |
| `radius/sm` | 6px | `rounded-sm` | `calc(var(--radius) - 4px)` |
| `radius/md` | 8px | `rounded-md` | `calc(var(--radius) - 2px)` |
| `radius/lg` | 10px | `rounded-lg` | `var(--radius)` = `0.625rem` |
| `radius/xl` | 14px | `rounded-xl` | `0.875rem` |
| `radius/2xl` | 16px | `rounded-2xl` | `1rem` |
| `radius/3xl` | 24px | `rounded-3xl` | `1.5rem` |
| `radius/4xl` | 32px | `rounded-4xl` | `2rem` |

---

## Typography (Figma text/* → Tailwind)

| Figma Token | Font Size | Line Height | Tailwind Class |
|---|---|---|---|
| `text/xs` | 12px | 16px | `text-xs` |
| `text/sm` | 14px | 20px | `text-sm` |
| `text/base` | 16px | 24px | `text-base` |
| `text/lg` | 18px | 28px | `text-lg` |
| `text/xl` | 20px | 28px | `text-xl` |
| `text/2xl` | 24px | 32px | `text-2xl` |
| `text/3xl` | 30px | 36px | `text-3xl` |
| `text/4xl` | 36px | 40px | `text-4xl` |
| `text/5xl` | 48px | 48px | `text-5xl` |

---

## Font Weight (Figma font-weight/*)

| Figma Token | Value | Tailwind Class |
|---|---|---|
| `font-weight/thin` | 100 | `font-thin` |
| `font-weight/extralight` | 200 | `font-extralight` |
| `font-weight/light` | 300 | `font-light` |
| `font-weight/normal` | 400 | `font-normal` |
| `font-weight/medium` | 500 | `font-medium` |
| `font-weight/semibold` | 600 | `font-semibold` |
| `font-weight/bold` | 700 | `font-bold` |
| `font-weight/extrabold` | 800 | `font-extrabold` |
| `font-weight/black` | 900 | `font-black` |

---

## Key Decisions

1. **Palette base = neutral** (not slate). Figma DS uses pure gray scale. `components.json` updated accordingly.
2. **--background uses neutral/50** (`0 0% 98%`) instead of pure white to maintain card/surface visual hierarchy.
3. **--accent** derived from `Colors/blue/50` and `Colors/blue/700` since Figma M3 has no direct accent token.
4. **--radius = 0.625rem (10px)** maps to Figma `radius/lg`, making ShadCN's `lg/md/sm` = Figma's `lg(10)/md(8)/sm(6)`.
5. **Sidebar tokens** derived from surface + primary tokens since Figma has no dedicated sidebar variable collection.
