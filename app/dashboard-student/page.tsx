export default async function DashboardStudentPage() {
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Tableau de bord étudiant</h1>
                <p className="text-muted-foreground">
                    Consultez les informations des salles de classe et leurs conditions environnementales.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <section className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Informations disponibles</h2>
                    <p className="text-sm text-muted-foreground">
                        En tant qu&apos;étudiant, vous pouvez consulter les métriques environnementales des salles de classe.
                    </p>
                </section>

                <section className="rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Métriques des salles</h2>
                    <p className="text-sm text-muted-foreground">
                        Température, humidité, CO2 et statut d&apos;occupation des salles de classe.
                    </p>
                </section>
            </div>
        </div>
    );
}

