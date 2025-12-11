import RoomStatsCards from "./room-stats-cards";
import RoomsList from "./rooms-list";

export default async function DashboardStudentPage() {
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Tableau de bord étudiant</h1>
                <p className="text-muted-foreground">Consultez les informations des salles de classe et leurs conditions environnementales.</p>
            </div>

            <RoomStatsCards />

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Liste des salles</h2>
                <p className="text-sm text-muted-foreground">Cliquez sur une salle pour voir ses métriques environnementales détaillées.</p>
                <RoomsList />
            </div>
        </div>
    );
}
