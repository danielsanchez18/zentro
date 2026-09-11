"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Camera,
  Keyboard,
  Minus,
  Package,
  Plus,
  ScanBarcode,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export interface ScannedProduct {
  key: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantLabel?: string;
  code: string;
  price: number;
  stock: number;
  quantity: number;
}

type Mode = "manual" | "camera";
type Detector = {
  detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
};
type DetectorConstructor = new (options?: { formats?: string[] }) => Detector;

const money = (cents: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    cents / 100,
  );

export function BarcodeScannerDialog({
  open,
  onOpenChange,
  onResolve,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: (code: string) => Omit<ScannedProduct, "quantity"> | undefined;
  onConfirm: (products: ScannedProduct[]) => void;
}) {
  const [mode, setMode] = useState<Mode>("manual");
  const [code, setCode] = useState("");
  const [products, setProducts] = useState<ScannedProduct[]>([]);
  const [cameraMessage, setCameraMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | undefined>(undefined);
  const frameRef = useRef<number | undefined>(undefined);
  const lastCodeRef = useRef("");

  const queueCode = useCallback(
    (rawCode: string) => {
      const resolved = onResolve(rawCode);
      if (!resolved) return;
      setProducts((current) => {
        const existing = current.find((item) => item.key === resolved.key);
        if (existing)
          return current.map((item) =>
            item.key === resolved.key
              ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
              : item,
          );
        return [...current, { ...resolved, quantity: 1 }];
      });
    },
    [onResolve],
  );

  const stopCamera = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = undefined;
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraMessage("");
    const DetectorApi = (
      window as unknown as { BarcodeDetector?: DetectorConstructor }
    ).BarcodeDetector;
    if (!DetectorApi) {
      setCameraMessage(
        "Este navegador no admite lectura de códigos por cámara. Usa Chrome compatible o un lector conectado.",
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      const detector = new DetectorApi({
        formats: ["ean_13", "ean_8", "code_128", "qr_code", "upc_a", "upc_e"],
      });
      const detect = async () => {
        if (video.readyState >= 2) {
          const results = await detector.detect(video).catch(() => []);
          const detected = results[0]?.rawValue;
          if (detected && detected !== lastCodeRef.current) {
            lastCodeRef.current = detected;
            queueCode(detected);
            window.setTimeout(() => {
              lastCodeRef.current = "";
            }, 1200);
          }
        }
        frameRef.current = requestAnimationFrame(detect);
      };
      detect();
    } catch {
      setCameraMessage(
        "No se pudo abrir la cámara. Revisa el permiso del navegador y usa HTTPS o localhost.",
      );
    }
  }, [queueCode, stopCamera]);

  useEffect(() => {
    if (open && mode === "camera") queueMicrotask(() => void startCamera());
    else stopCamera();
    return stopCamera;
  }, [mode, open, startCamera, stopCamera]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;
    queueCode(code.trim());
    setCode("");
  };
  const changeQuantity = (key: string, quantity: number) =>
    setProducts((current) =>
      current.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) }
          : item,
      ),
    );
  const close = (next: boolean) => {
    if (!next) {
      stopCamera();
      setMode("manual");
      setCode("");
      setProducts([]);
    }
    onOpenChange(next);
  };
  const units = products.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="h-dvh max-h-dvh w-screen max-w-none overflow-hidden rounded-none flex flex-col sm:h-[min(90vh,760px)] sm:max-h-[90vh] sm:max-w-xl sm:rounded-xl">
        <DialogHeader>
          <DialogTitle>Escanear productos</DialogTitle>
          <DialogDescription>
            Busca por código o SKU, usa un lector conectado o abre la cámara.
            Revisa todos los productos antes de agregarlos al carrito.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          <div className="flex items-center gap-1.5">
            {(
              [
                { id: "manual", label: "Código, SKU o lector", icon: Keyboard },
                { id: "camera", label: "Abrir cámara", icon: Camera },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 leading-none text-sm font-medium transition-colors border border-border ${
                  mode === id
                    ? "text-background bg-primary border-primary"
                    : "hover:bg-muted hover:text-primary"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
          {mode === "camera" ? (
            <div className="relative min-h-64 overflow-hidden rounded-xl border bg-black">
              <video
                ref={videoRef}
                muted
                playsInline
                className="h-64 w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-8 rounded-xl border border-white/70" />
              {cameraMessage ? (
                <div className="absolute inset-0 flex items-center justify-center bg-background/95 p-8 text-center text-sm text-muted-foreground">
                  {cameraMessage}
                </div>
              ) : null}
            </div>
          ) : (
            <form onSubmit={submit} className="grid grid-cols-[1fr_auto] gap-2">
              <div className="relative min-w-0 flex-1">
                <ScanBarcode className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Código de barras, QR o SKU"
                  className="pl-9 font-mono h-fit py-2"
                />
              </div>
              <Button type="submit" disabled={!code.trim()} className="h-full">
                Buscar
              </Button>
            </form>
          )}
          {mode === "manual" ? (
            <p className="rounded-lg border border-dashed px-3 py-2 text-sm font-heading text-muted-foreground">
              También puedes mantener este campo enfocado y usar un lector USB,
              Bluetooth, RFID o NFC que emule teclado y envíe Enter.
            </p>
          ) : null}
          <section>
            <div className="mt-2 mb-5 flex items-center justify-between">
              <h3 className="text-sm font-medium">Productos encontrados</h3>
              <span className="text-sm text-muted-foreground">
                {units} unidades
              </span>
            </div>
            {products.length ? (
              <div className="divide-y rounded-xl border">
                {products.map((item) => (
                  <article
                    key={item.key}
                    className="flex items-center gap-3 p-3 font-heading"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Package className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.productName}
                        {item.variantLabel ? ` · ${item.variantLabel}` : ""}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                        {item.code} · {money(item.price)} · stock {item.stock}
                      </p>
                    </div>
                    <div className="flex items-center rounded-lg border">
                      <button
                        type="button"
                        onClick={() =>
                          changeQuantity(item.key, item.quantity - 1)
                        }
                        className="p-2 text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          changeQuantity(item.key, item.quantity + 1)
                        }
                        className="p-2 text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setProducts((current) =>
                          current.filter((product) => product.key !== item.key),
                        )
                      }
                      className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Quitar ${item.productName}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-10 text-center">
                <span className="mb-2 rounded-lg bg-primary/10 p-3">
                  <ScanBarcode className="size-5 text-primary" />
                </span>
                <p className="text-base font-medium font-heading">
                  Aún no has escaneado productos
                </p>
                <p className="text-sm text-muted-foreground">
                  Puedes combinar varios códigos en esta sesión.
                </p>
              </div>
            )}
          </section>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => close(false)}
            className="rounded-full"
          >
            Cancelar
          </Button>
          <Button
            disabled={!products.length}
            onClick={() => {
              onConfirm(products);
              close(false);
            }}
            className="rounded-full"
          >
            Agregar {units || ""} al carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
