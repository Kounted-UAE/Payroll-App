import { LayoutGrid, List as ListIcon } from "lucide-react";

export function ViewToggle({ view, setView }: { view: 'grid' | 'list'; setView: (v: 'grid' | 'list') => void }) {
  return (
    <div className="flex items-center space-x-2">
      <button
        className={`p-2 rounded ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        onClick={() => setView('grid')}
        aria-label="Grid view"
        type="button"
      >
        <LayoutGrid className="h-5 w-5" />
      </button>
      <button
        className={`p-2 rounded ${view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
        onClick={() => setView('list')}
        aria-label="List view"
        type="button"
      >
        <ListIcon className="h-5 w-5" />
      </button>
    </div>
  );
} 