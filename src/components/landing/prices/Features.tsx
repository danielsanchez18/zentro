import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Features() {
    return (
        <section className="py-20 space-y-5">

            <h3 className="text-2xl md:text-3xl font-semibold text-center">Compare las características de los planes</h3>

            {/* Table for SM */}
            <div className="relative hidden sm:block">

                {/* Header */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-10 border-b border-border py-10 sticky top-0 bg-card">
                    <div>
                        <h4 className="text-lg font-semibold text-foreground">Características</h4>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-foreground">Free</h4>
                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">Gratis para siempre</p>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-foreground">Startup</h4>
                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">S/. 39 al mes, facturado anualmente</p>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-foreground">Team</h4>
                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">S/. 89 al mes, facturado anualmente</p>
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-foreground">Enterprise</h4>
                        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">S/. 149 al mes, facturado anualmente</p>
                    </div>
                </div>

                {/* Grid 1 */}
                <div className="grid py-5">
                    <h4 className="text-lg font-semibold text-foreground my-5">General</h4>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Number of seats</p>
                        <p className="py-3 border-b border-border text-foreground">1</p>
                        <p className="py-3 border-b border-border text-foreground">Up to 3</p>
                        <p className="py-3 border-b border-border text-foreground">Up to 10</p>
                        <p className="py-3 border-b border-border text-foreground">Unlimited</p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Storage</p>
                        <p className="py-3 border-b border-border text-foreground">15 GB</p>
                        <p className="py-3 border-b border-border text-foreground">1 TB</p>
                        <p className="py-3 border-b border-border text-foreground">15 TB</p>
                        <p className="py-3 border-b border-border text-foreground">Unlimited</p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Email sharing</p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Any time, anywhere access</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                </div>

                {/* Grid 2 */}
                <div className="grid py-5">
                    <h4 className="text-lg font-semibold text-foreground mb-5">Financial data</h4>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Open/High/Low/Close</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Price-volume difference indicator</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                </div>

                {/* Grid 3 */}
                <div className="grid py-5">
                    <h4 className="text-lg font-semibold text-foreground mb-5">On-chain data</h4>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Network growth</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Average gamzn age consumed</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Exchange flow</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Total ERC20 exchange funds flow</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Transaction volume</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Total circulation (beta)</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Velocity of tokens (beta)</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">ETH gas used</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                </div>

                {/* Grid 4 */}
                <div className="grid py-5">
                    <h4 className="text-lg font-semibold text-foreground mb-5">Social data</h4>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Dev activity</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Topic search</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p className="py-3 text-foreground">Relative social dominance</p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Minus className="text-foreground size-5" /></p>
                        <p className="py-3 border-b border-border"><Check className="text-primary size-5" /></p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="grid pt-5">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-x-5 text-sm">
                        <p></p>
                        <Button variant="outline" size="lg" className="gap-x-1.5 py-2 h-fit rounded-full">Empezar<span className="max-lg:hidden">ahora</span></Button>
                        
                        <Button className="gap-x-1.5 py-2 h-fit rounded-full">Empezar<span className="max-lg:hidden">ahora</span></Button>
                        <Button className="gap-x-1.5 py-2 h-fit rounded-full">Empezar<span className="max-lg:hidden">ahora</span></Button>
                        <Button className="gap-x-1.5 py-2 h-fit rounded-full">Empezar<span className="max-lg:hidden">ahora</span></Button>
                    </div>
                </div>
            </div>
            {/* End Table for SM */}

            {/* Table for Mobile */}
            <div className="sm:hidden space-y-5 w-full">

                {/* General */}
                <div className="grid">
                    <h4 className="p-5 font-semibold text-foreground">General</h4>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Number of seats</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5 text-foreground">1</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5 text-foreground">Up to 3</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5 text-foreground">Up to 10</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5 text-foreground">Unlimited</p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Storage</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5 text-foreground">15 GB</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5 text-foreground">1 TB</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5 text-foreground">15 TB</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5 text-foreground">Unlimited</p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Email sharing</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Any time, anywhere access</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                </div>
                {/* End General */}

                {/* Financial data */}
                <div className="grid">
                    <h4 className="p-5 font-semibold text-foreground">Financial data</h4>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Open/High/Low/Close</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Price-volume difference indicator</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                </div>
                {/* End Financial Data */}

                {/* On-chain data */}
                <div className="grid">
                    <h4 className="p-5 font-semibold text-foreground">On-chain data</h4>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Network growth</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Average gamzn age consumed</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-gray-800 size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Exchange flow</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Total ERC20 exchange funds flow</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Transaction volume</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Total circulation (beta)</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Total circulation (beta)</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">ETH gas used</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                </div>
                {/* End Financial Data */}

                {/* Social data */}
                <div className="grid">
                    <h4 className="p-5 font-semibold text-foreground">Social data</h4>

                    <h4 className="px-5 py-2 text-sm border border-border bg-gray-100 font-semibold text-gray-900 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-800">Dev activity</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Topic search</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>

                    <h4 className="px-5 py-2 text-sm bg-muted font-semibold text-foreground">Relative social dominance</h4>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Free</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Startup</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm border-b border-border">
                        <p className="py-2 px-5 text-foreground">Team</p>
                        <p className="py-2 px-5"><Minus className="text-foreground size-5" /></p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 text-sm mb-5">
                        <p className="py-2 px-5 text-foreground">Enterprise</p>
                        <p className="py-2 px-5"><Check className="text-primary size-5" /></p>
                    </div>
                </div>
                {/* End Social Data */}

            </div>
            {/* End Table for Mobile */}
        </section>
    )
}