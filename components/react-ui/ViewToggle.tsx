//components/react-ui/ViewToggle.tsx

import { LayoutGrid, List as ListIcon } from "lucide-react";

export function ViewToggle({ view, setView }: { view: 'grid' | 'list'; setView: (v: 'grid' | 'list') => void }) {
  return (
    <div className="flex items-center space-x-2">
      <button
        className={`p-2 rounded ${view === 'grid' ? 'bg-zinc-500 text-zinc-500-foreground' : 'bg-zinc-100'}`}
        onClick={() => setView('grid')}
        aria-label="Grid view"
        type="button"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        className={`p-2 rounded ${view === 'list' ? 'bg-zinc-500 text-zinc-500-foreground' : 'bg-zinc-100'}`}
        onClick={() => setView('list')}
        aria-label="List view"
        type="button"
      >
        <ListIcon className="h-4 w-4" />
      </button>
    </div>
  );
} 