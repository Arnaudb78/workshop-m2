"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GetMessagesAction } from "@/app/actions/get-messages.action";
import { Mail } from "lucide-react";

type Message = {
    _id: string;
    title: string;
    description: string;
    studentMail: string;
    roomId: string | null;
    roomName: string;
    createdAt: string | null;
};

export default function SupportAdmin() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchMessages = async () => {
        setLoading(true);
        const result = await GetMessagesAction();
        if (result.success && result.data) {
            setMessages(result.data as Message[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleReply = (message: Message) => {
        const subject = encodeURIComponent(`Re: ${message.title}`);
        const body = encodeURIComponent(
            `Bonjour,\n\nConcernant votre message du ${formatDate(message.createdAt)} à propos de la salle "${message.roomName}":\n\n${message.description}\n\n`
        );
        const mailtoLink = `mailto:${message.studentMail}?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
    };

    const handleDescriptionClick = (message: Message) => {
        setSelectedMessage(message);
        setDialogOpen(true);
    };

    const isDescriptionLong = (description: string) => {
        return description.length > 70;
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold">Messages de support</h2>
                <p className="text-muted-foreground">Liste des messages remontés par les étudiants</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            ) : messages.length === 0 ? (
                <div className="flex justify-center py-8">
                    <p className="text-muted-foreground">Aucun message trouvé.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Étudiant</TableHead>
                            <TableHead>Salle</TableHead>
                            <TableHead>Titre</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.map((message) => (
                            <TableRow key={message._id}>
                                <TableCell className="font-medium">{message.studentMail}</TableCell>
                                <TableCell>{message.roomName}</TableCell>
                                <TableCell>{message.title}</TableCell>
                                <TableCell>
                                    {isDescriptionLong(message.description) ? (
                                        <button
                                            onClick={() => handleDescriptionClick(message)}
                                            className="max-w-md truncate text-left hover:underline cursor-pointer text-primary"
                                            title="Cliquez pour voir le message complet"
                                        >
                                            {message.description}
                                        </button>
                                    ) : (
                                        <div className="max-w-md truncate" title={message.description}>
                                            {message.description}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>{formatDate(message.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleReply(message)}
                                        title={`Répondre à ${message.studentMail}`}
                                    >
                                        <Mail className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedMessage?.title}</DialogTitle>
                        <DialogDescription>
                            Message de {selectedMessage?.studentMail} concernant la salle {selectedMessage?.roomName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Date</div>
                            <div className="text-sm">{formatDate(selectedMessage?.createdAt || null)}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Étudiant</div>
                            <div className="text-sm">{selectedMessage?.studentMail}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Salle</div>
                            <div className="text-sm">{selectedMessage?.roomName}</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Description</div>
                            <div className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-md">
                                {selectedMessage?.description}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Fermer
                        </Button>
                        <Button onClick={() => selectedMessage && handleReply(selectedMessage)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Répondre par email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}