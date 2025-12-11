import GlobalMetrics from "./global-metrics";

export default async function DashboardPage() {
    return (
        <div className="space-y-6">
            <GlobalMetrics />
            <div className="grid gap-6 lg:grid-cols-3">
                <section className="col-span-2 rounded-lg border bg-card p-4 shadow-sm">
                    <h2 className="text-lg font-semibold">Activité récente</h2>
                    <p className="text-sm text-muted-foreground">Branche tes capteurs pour commencer à visualiser les métriques.</p>
                </section>
                <section className="rounded-lg border bg-card p-4 shadow-sm">
                    <h2 className="text-lg font-semibold">Résumé</h2>
                    <p className="text-sm text-muted-foreground">Ajoute des cartes ici (statuts, alertes, etc.).</p>
                </section>
            </div>
        </div>
    );
}
