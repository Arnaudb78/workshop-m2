import { getAccountFromCookie } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReportIssueForm from "./report-issue-form";

export default async function SupportPage() {
    const account = await getAccountFromCookie();

    if (!account) {
        return null;
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Support</h1>
                <p className="text-muted-foreground">Remontez un problème concernant une salle ou consultez les ressources disponibles.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Signaler un problème</CardTitle>
                        <CardDescription>
                            Décrivez le problème que vous avez rencontré dans une salle. Notre équipe vous répondra dans les plus brefs délais.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ReportIssueForm account={account} />
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Pour toute question ou problème, n&apos;hésitez pas à utiliser le formulaire ci-dessus pour nous contacter.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>FAQ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Consultez les questions fréquemment posées pour trouver rapidement des réponses à vos questions.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
