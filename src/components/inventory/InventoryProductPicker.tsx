import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Search, Package, ChevronDown } from 'lucide-react';
import { InventoryItem } from '@/hooks/useInventory';
import { cn } from '@/lib/utils';

interface InventoryProductPickerProps {
  items: InventoryItem[];
  onSelect: (item: InventoryItem) => void;
  placeholder?: string;
  disabled?: boolean;
}

const InventoryProductPicker = ({
  items,
  onSelect,
  placeholder = 'Pick from inventory...',
  disabled = false,
}: InventoryProductPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }, [items, search]);

  const handleSelect = (item: InventoryItem) => {
    onSelect(item);
    setOpen(false);
    setSearch('');
  };

  const statusColor = (status: string) => {
    if (status === 'in_stock') return 'bg-accent/20 text-accent';
    if (status === 'low_stock') return 'bg-warning/20 text-warning';
    return 'bg-destructive/20 text-destructive';
  };

  const statusLabel = (status: string) => {
    if (status === 'in_stock') return 'In Stock';
    if (status === 'low_stock') return 'Low';
    return 'Out';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-1.5 text-xs text-muted-foreground whitespace-nowrap"
        >
          <Package size={12} />
          {placeholder}
          <ChevronDown size={12} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 h-8 text-xs"
              autoFocus
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No inventory items found
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors text-left',
                  item.status === 'out_of_stock' && 'opacity-50 cursor-not-allowed'
                )}
                disabled={item.status === 'out_of_stock'}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.sku} · {item.category} · ₹{item.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  <span className="text-xs text-muted-foreground">×{item.stock}</span>
                  <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded', statusColor(item.status))}>
                    {statusLabel(item.status)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InventoryProductPicker;
