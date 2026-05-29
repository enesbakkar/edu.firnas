# FiCo Studio

**FiCo Studio** is a Scratch-like visual block coding interface for the FiCo (Firnas Copter) programmable education drone, developed by **Firnas Teknoloji**. Designed for students aged 10–18, the app lets users build drone flight programs by dragging and connecting blocks, then simulate execution with live telemetry feedback.

## Tech Stack

- React 19 + TypeScript + Vite
- @dnd-kit/core + @dnd-kit/sortable for drag-and-drop
- lucide-react for icons
- Pure CSS custom properties (no Tailwind classes used at runtime)

## Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Folder Structure

```
src/
  types.ts                      # Shared TypeScript types
  i18n.ts                       # TR/EN/AR translation map
  App.tsx                       # Root component, DnD context, state
  index.css                     # Global CSS, custom properties, animations
  main.tsx                      # React 18 mount point

  hooks/
    useTelemetry.ts             # Live telemetry simulation state
    useDroneSimulation.ts       # Block execution engine

  components/
    FirnasLogo.tsx              # Firnas Teknoloji SVG monogram
    TopBar.tsx                  # 64px header: logo, tabs, lang, status
    Sidebar.tsx                 # Category list + Run/Stop buttons
    Workspace.tsx               # Drop zone + block list + code view tab
    CodeView.tsx                # Python-like pseudocode generator

    Blocks/
      blockDefinitions.ts       # BLOCK_DEFS array + CATEGORY_META
      Block.tsx                 # Single block: drag, params, children
      BlockPalette.tsx          # Draggable block picker panel

    TelemetryPanel/
      TelemetryPanel.tsx        # Right 340px panel
      CameraFeed.tsx            # Fake 16:9 HUD camera view
      MetricCard.tsx            # Reusable metric + progress bar
      CompassWidget.tsx         # SVG compass rose with heading
```

## Adding New Blocks

1. Open `src/components/Blocks/blockDefinitions.ts`
2. Add a new entry to `BLOCK_DEFS`:

```typescript
{
  id: 'my_block',
  category: 'motion',       // events | motion | control | logic | sensors
  label: 'Yeni Blok',
  params: [{ name: 'speed', defaultValue: 3, unit: 'm/s' }],
}
```

3. If the block needs simulation behavior, add a `case 'my_block':` to the switch in `src/hooks/useDroneSimulation.ts`.

## Brand Colors

| Variable | Value |
|---|---|
| `--firnas-teal` | `#2BA8B8` |
| `--firnas-navy` | `#1A2B3E` |
| `--firnas-navy-deep` | `#0F1E2E` |
| `--block-motion` | `#4A90E2` |
| `--block-control` | `#E8A33D` |
| `--block-logic` | `#50C878` |
| `--block-sensor` | `#7B6FE0` |
| `--block-end` | `#C75D5D` |

---

*Firnas Teknoloji — Geleceği Kodla, Gökyüzünü Keşfet*
