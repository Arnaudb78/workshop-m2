import RoomStatsCards from "./room-stats-cards";

export default async function DashboardStudentPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Vue d&apos;ensemble des statistiques des salles de classe.</p>
            </div>

            <RoomStatsCards />
        </div>
    );
}
