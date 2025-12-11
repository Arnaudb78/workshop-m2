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
import { GetStudentsAction } from "@/app/actions/get-students.action";
import { DeleteStudentAction } from "@/app/actions/delete-student.action";
import { Trash2 } from "lucide-react";

type Student = {
    _id: string;
    name: string;
    lastname: string;
    mail: string;
    createdAt: string | null;
};

export default function Students() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchStudents = async () => {
        setLoading(true);
        const result = await GetStudentsAction();
        if (result.success && result.data) {
            setStudents(result.data as Student[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (studentId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce compte étudiant ?")) {
            return;
        }

        setDeleting(studentId);
        const result = await DeleteStudentAction({ studentId });

        if (result.success) {
            await fetchStudents();
        } else {
            alert(result.message || "Erreur lors de la suppression");
        }
        setDeleting(null);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold">Gestion des étudiants</h2>
                <p className="text-muted-foreground">Liste de tous les comptes étudiants</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <p className="text-muted-foreground">Chargement...</p>
                </div>
            ) : students.length === 0 ? (
                <div className="flex justify-center py-8">
                    <p className="text-muted-foreground">Aucun étudiant trouvé.</p>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Prénom</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Date de création</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student._id}>
                                <TableCell className="font-medium">{student.lastname}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.mail}</TableCell>
                                <TableCell>{formatDate(student.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(student._id)}
                                        disabled={deleting === student._id}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
