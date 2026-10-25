"use client";

import { useDashboardStore } from "@/stores/dashboard-store";
import { dashboardPlans, dashboardSubscriptions, ZENTRO_ISSUER } from "@/lib/mock/dashboard";
import { daysUntil, formatLongDate, formatMoney, formatMonthYear } from "@/lib/format/dates";
import type { Invoice, Subscription } from "@/components/dashboard/suscripciones/types";

/**
 * Adaptadores de la página de Suscripciones: convierten las entidades del
 * store/mock (montos en céntimos, fechas ISO) en los modelos de vista.
 * TODO(0.2): reemplazar por `GET /users/me/subscriptions` y `GET /users/me/invoices`.
 */
export const useSubscriptionsData = (): { subscriptions: Subscription[]; invoices: Invoice[] } => {
  const dashboard = useDashboardStore();
  const { organizations, memberships, branches } = dashboard;

  const subscriptions: Subscription[] = dashboard.getSubscriptionSummaries().map((summary) => {
    const subscription = dashboardSubscriptions.find((item) => item.id === summary.id)!;
    const plan = dashboardPlans.find((item) => item.id === subscription.planId)!;
    const organization = organizations.find((item) => item.id === subscription.organizationId)!;
    const isTrial = subscription.status === "TRIAL";
    const usedMembers = memberships.filter((item) => item.organizationId === organization.id && item.status === "ACTIVE").length;
    const usedBranches = branches.filter((item) => item.organizationId === organization.id && item.status === "ACTIVE").length;

    return {
      id: subscription.id,
      orgName: organization.name,
      slug: organization.slug,
      plan: plan.name,
      status: subscription.status,
      period:
        isTrial && subscription.trialEndsAt
          ? `Prueba: quedan ${daysUntil(subscription.trialEndsAt)} días`
          : `${formatLongDate(subscription.currentPeriodStart, organization.timezone)} – ${formatLongDate(subscription.currentPeriodEnd, organization.timezone)}`,
      price: formatMoney(isTrial ? 0 : plan.priceInMinorUnits, plan.currencyCode),
      nextCharge: formatLongDate(subscription.currentPeriodEnd, organization.timezone),
      usage: {
        users: { used: usedMembers, limit: plan.limits.members ?? usedMembers },
        branches: { used: usedBranches, limit: plan.limits.branches ?? usedBranches },
      },
    };
  });

  const invoices: Invoice[] = dashboard.getInvoices().map((invoice) => {
    const organization = organizations.find((item) => item.id === invoice.organizationId)!;
    const subscription = dashboardSubscriptions.find((item) => item.id === invoice.subscriptionId);
    const plan = subscription ? dashboardPlans.find((item) => item.id === subscription.planId) : undefined;
    const primaryBranch = branches.find((item) => item.organizationId === organization.id && item.isPrimary);
    const money = (value: number) => formatMoney(value, invoice.currencyCode);
    const period = formatMonthYear(invoice.periodStart, organization.timezone);

    return {
      id: invoice.id,
      number: invoice.number,
      orgName: organization.name,
      period,
      amount: money(invoice.totalInMinorUnits),
      status: invoice.status,
      dueDate: formatLongDate(invoice.dueAt, organization.timezone),
      pdfUrl: invoice.pdfUrl ?? undefined,
      detail: {
        seriesNumber: invoice.seriesNumber,
        issuedDate: formatLongDate(invoice.issuedAt, organization.timezone),
        dueDateFull: formatLongDate(invoice.dueAt, organization.timezone),
        periodFull: period,
        currency: invoice.currencyCode === "PEN" ? "Soles (PEN)" : invoice.currencyCode,
        issuer: ZENTRO_ISSUER,
        client: {
          name: organization.legalName ?? organization.name,
          taxId: organization.taxId ? `RUC ${organization.taxId}` : "Sin RUC registrado",
          address: primaryBranch?.address ?? "Dirección fiscal por completar",
        },
        items: [
          {
            description: `Suscripción plan ${plan?.name ?? ""} · ${period}`.trim(),
            quantity: 1,
            unitPrice: money(invoice.subtotalInMinorUnits),
            amount: money(invoice.subtotalInMinorUnits),
          },
        ],
        subtotal: money(invoice.subtotalInMinorUnits),
        taxLabel: invoice.taxLabel,
        taxAmount: money(invoice.taxInMinorUnits),
        total: money(invoice.totalInMinorUnits),
        paymentMethod: invoice.paymentMethod ?? "Pago pendiente",
        notes: invoice.notes ?? undefined,
      },
    };
  });

  return { subscriptions, invoices };
};
