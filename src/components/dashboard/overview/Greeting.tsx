import { getCurrentDashboardUser } from "@/lib/mock/dashboard";

export const Greeting = () => {
  const user = getCurrentDashboardUser();
  return (
    <div data-demo="greeting" className="space-y-1">
        <h1 className="font-medium font-sans text-xl">Buenos días, {user.name}</h1>
        <p className="text-sm text-muted-foreground">Aquí están las actividades que tienes pendientes para hoy.</p>
    </div>
  )
}
