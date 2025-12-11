import RoomsList from "../rooms-list";

export default async function RoomsPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Salles</h1>
                <p className="text-muted-foreground">Consultez les informations des salles de classe et leurs conditions environnementales.</p>
            </div>

            <RoomsList />
        </div>
    );
}
