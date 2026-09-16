"use client";

import { useState } from "react";
import { DateTimePicker } from "@/components/ui/date-time-picker";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toastMsg } from "@/components/ui/toast-message";
import {
  agendaServices,
  type Appointment,
  type AppointmentModality,
} from "@/lib/mock/agenda";
import { teamMembers } from "@/lib/mock/team";
import { useCrmStore } from "@/stores/crm-store";

const addMinutes = (value: string, minutes: number) => {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() + minutes);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export function CreateAppointmentDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (appointment: Appointment) => void;
}) {
  const customers = useCrmStore((state) => state.customers).filter(
    (customer) => customer.status === "activo",
  );
  const professionals = teamMembers.filter(
    (member) => member.status === "activo",
  );
  const [customerId, setCustomerId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [responsibleId, setResponsibleId] = useState("unassigned");
  const [modality, setModality] =
    useState<AppointmentModality>("presencial");
  const [startsAt, setStartsAt] = useState("");

  const close = () => {
    setCustomerId("");
    setGuestName("");
    setGuestPhone("");
    setServiceId("");
    setResponsibleId("unassigned");
    setModality("presencial");
    setStartsAt("");
    onOpenChange(false);
  };

  const create = () => {
    const customer = customers.find((item) => item.id === customerId);
    const service = agendaServices.find((item) => item.id === serviceId);
    const responsible = professionals.find(
      (item) => item.id === responsibleId,
    );
    if ((!customer && !guestName.trim()) || !service || !startsAt) {
      toastMsg.error(
        "Completa la cita",
        "Selecciona o ingresa un cliente, servicio y fecha.",
      );
      return;
    }
    if (!customer && !guestPhone.trim()) {
      toastMsg.error(
        "Falta el teléfono",
        "Ingresa un contacto para la persona invitada.",
      );
      return;
    }
    const now = new Date().toISOString();
    const identifier = now.replace(/\D/g, "").slice(-12);
    onCreate({
      id: `appointment_${identifier}`,
      number: `CIT-${identifier.slice(-4)}`,
      customerId: customer?.id,
      customerName: customer?.name ?? guestName.trim(),
      customerEmail: customer?.email,
      customerPhone: customer?.phone ?? guestPhone.trim(),
      serviceId: service.id,
      serviceName: service.name,
      durationMinutes: service.durationMinutes,
      price: service.price,
      responsibleId: responsible?.id,
      responsibleName: responsible?.name,
      locationId: modality === "presencial" ? "location_1" : undefined,
      locationName: modality === "presencial" ? "Monsefú" : undefined,
      modality,
      status: "pendiente_confirmacion",
      paymentStatus: "sin_pago",
      paidAmount: 0,
      origin: "manual",
      startsAt,
      endsAt: addMinutes(startsAt, service.durationMinutes),
      createdAt: now,
      updatedAt: now,
    });
    toastMsg.success(
      "Cita creada",
      "Se agregó a la agenda sin exigir un pago.",
    );
    close();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) =>
        nextOpen ? onOpenChange(true) : close()
      }
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Nueva cita</DialogTitle>
          <DialogDescription>
            Programa la atención. El responsable y el pago pueden completarse
            después.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label>Cliente registrado</Label>
            <Select
              value={customerId}
              onValueChange={(value) => setCustomerId(String(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar cliente o registrar invitado" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {!customerId && (
            <>
              <div className="flex flex-col gap-2">
                <Label>Nombre del invitado</Label>
                <Input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Teléfono</Label>
                <Input
                  value={guestPhone}
                  onChange={(event) => setGuestPhone(event.target.value)}
                />
              </div>
            </>
          )}
          <div className="flex flex-col gap-2">
            <Label>Servicio</Label>
            <Select
              value={serviceId}
              onValueChange={(value) => setServiceId(String(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar servicio" />
              </SelectTrigger>
              <SelectContent>
                {agendaServices
                  .filter((service) => service.status === "activo")
                  .map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} · {service.durationMinutes} min
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Responsable</Label>
            <Select
              value={responsibleId}
              onValueChange={(value) => setResponsibleId(String(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Asignar después</SelectItem>
                {professionals.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Modalidad</Label>
            <Select
              value={modality}
              onValueChange={(value) =>
                setModality(value as AppointmentModality)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="domicilio">A domicilio</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Fecha y hora</Label>
            <DateTimePicker value={startsAt} onChange={setStartsAt} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close} className="rounded-full">
            Cancelar
          </Button>
          <Button onClick={create} className="rounded-full">
            Crear cita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
