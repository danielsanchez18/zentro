import { Button } from "@base-ui/react";
import { BriefcaseBusiness, ChartNoAxesCombined, ChartPie, MessagesSquare, ShoppingBag, Wallet } from "lucide-react";

export function Demo() {
    return (
        <section className="flex flex-col gap-y-5">

            {/* Buttons */}
            <div className="flex items-center gap-x-1 overflow-x-auto scrollbar-hide">
                <Button className="cursor-pointer text-sm rounded-full flex items-center gap-x-2 px-3 py-2 bg-accent">
                    <ChartNoAxesCombined className="size-4" />
                    <p>Dashboard</p>
                </Button>
                <Button className="cursor-pointer text-sm rounded-full flex items-center gap-x-2 px-3 py-2 hover:bg-accent">
                    <BriefcaseBusiness className="size-4" />
                    <p>Workspace</p>
                </Button>
                <Button className="cursor-pointer text-sm rounded-full flex items-center gap-x-2 px-3 py-2 hover:bg-accent">
                    <Wallet className="size-4" />
                    <p>Payment</p>
                </Button>
                <Button className="cursor-pointer text-sm rounded-full flex items-center gap-x-2 px-3 py-2 hover:bg-accent">
                    <ChartPie className="size-4" />
                <p>Analytics</p>
                </Button>
                <Button className="cursor-pointer text-sm rounded-full flex items-center gap-x-2 px-3 py-2 hover:bg-accent">
                    <MessagesSquare className="size-4" />
                    <p>Messages</p>
                </Button>
                <Button className="cursor-pointer text-sm rounded-full flex items-center gap-x-2 px-3 py-2 hover:bg-accent">
                    <ShoppingBag className="size-4" />
                    <p>Ecommerce</p>
                </Button>
            </div>

            {/* Preview */}
            <div className="border border-white/20 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-lg w-full p-2 md:p-4 flex flex-col shadow-xl">
                <div className="flex items-center gap-x-2 px-2 sm:px-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                <div className="w-full h-full flex items-center justify-center rounded-lg mt-2 sm:mt-3 bg-white overflow-hidden">
                    <img src="https://preline.co/assets/img/pro/startup/img1.webp"
                        alt="Vista previa de la aplicación Zentro"
                        className="w-full min-h-100 object-cover"
                        loading="lazy" />
                </div>
            </div>
        </section>   
    )
}