import { useRef, useState, useEffect, useCallback } from 'react';
import { Trash2, Download, Upload, PenTool, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface SignaturePadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}

type Mode = 'draw' | 'upload';

const SignaturePad = ({ value, onChange, label = 'Signature' }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>(value && !value.startsWith('data:') ? 'upload' : 'draw');
  const [drawing, setDrawing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    setDrawing(true);
    lastPos.current = getPos(e, canvas);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e, canvas);
    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    lastPos.current = pos;
    setHasDrawing(true);
  }, [drawing]);

  const endDraw = useCallback(() => {
    setDrawing(false);
    lastPos.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    onChange('');
  }, [onChange]);

  const saveSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawing) return;
    const dataUrl = canvas.toDataURL('image/png');
    onChange(dataUrl);
    toast({ title: 'Signature saved' });
  }, [hasDrawing, onChange]);

  const handleUpload = async (file: File) => {
    if (!user?.id) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/signature-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('company-assets').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('company-assets').getPublicUrl(path);
      onChange(data.publicUrl);
      toast({ title: 'Signature uploaded' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs text-muted-foreground">{label}</label>}

      <div className="flex gap-1 p-1 bg-muted/20 rounded-lg w-fit border border-border">
        <button
          type="button"
          onClick={() => setMode('draw')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${mode === 'draw' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <PenTool size={12} /> Draw
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${mode === 'upload' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <ImageIcon size={12} /> Upload
        </button>
      </div>

      {mode === 'draw' && (
        <div className="space-y-2">
          <div className="relative border-2 border-dashed border-border rounded-lg bg-white overflow-hidden" style={{ height: '120px' }}>
            <canvas
              ref={canvasRef}
              width={500}
              height={120}
              className="w-full h-full cursor-crosshair touch-none"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
            {!hasDrawing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-xs text-gray-400">Draw your signature here</p>
              </div>
            )}
            <div className="absolute bottom-1 right-1 w-24 border-b border-gray-300" />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Trash2 size={12} /> Clear
            </button>
            <button
              type="button"
              onClick={saveSignature}
              disabled={!hasDrawing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Download size={12} /> Save Signature
            </button>
          </div>
          {value && value.startsWith('data:') && (
            <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg border border-accent/20">
              <img src={value} alt="Saved signature" className="h-10 object-contain" />
              <span className="text-xs text-accent">Signature saved</span>
            </div>
          )}
        </div>
      )}

      {mode === 'upload' && (
        <div className="space-y-2">
          {value && !value.startsWith('data:') ? (
            <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/20">
              <img src={value} alt="Signature" className="h-12 object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
              <button
                type="button"
                onClick={() => { onChange(''); }}
                className="text-xs text-destructive hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-50"
            >
              {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Uploading...' : 'Click to upload signature image'}
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }}
          />
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
