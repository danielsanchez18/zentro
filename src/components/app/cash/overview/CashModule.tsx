"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { CashSession } from "@/lib/mock/cash";
import { useCashStore } from "@/stores/cash-store";
import { CashHeader } from "./CashHeader";
import { CashKpis } from "./CashKpis";
import { CashSessions } from "./CashSessions";
import { CashMovements } from "./CashMovements";
import { CashSessionsHistory } from "./CashSessionsHistory";
import { OpenCashDialog } from "../dialogs/OpenCashDialog";
import { RegisterMovementDialog } from "../dialogs/RegisterMovementDialog";
import { CloseCashDialog } from "../dialogs/CloseCashDialog";

export function CashModule() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const sessions = useCashStore((state) => state.sessions);
  const movements = useCashStore((state) => state.movements);
  const [openDialog, setOpenDialog] = useState(false);
  const [movementDialog, setMovementDialog] = useState(false);
  const [closing, setClosing] = useState<CashSession | null>(null);
  return (
    <div className="w-full space-y-7 px-5 py-7 md:px-7 xl:px-10">
      <CashHeader
        onOpen={() => setOpenDialog(true)}
        onMovement={() => setMovementDialog(true)}
        onSettings={() => router.push(`/app/${params.slug}/caja/configuracion`)}
      />
      <CashKpis sessions={sessions} movements={movements} />
      <CashSessions
        sessions={sessions}
        movements={movements}
        onClose={setClosing}
      />
      <CashMovements sessions={sessions} movements={movements} />
      <CashSessionsHistory sessions={sessions} />
      <OpenCashDialog open={openDialog} onOpenChange={setOpenDialog} />
      <RegisterMovementDialog
        open={movementDialog}
        onOpenChange={setMovementDialog}
      />
      {closing && (
        <CloseCashDialog
          key={closing.id}
          session={closing}
          onOpenChange={(value) => !value && setClosing(null)}
        />
      )}
    </div>
  );
}
