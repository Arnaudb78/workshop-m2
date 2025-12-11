"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "dc-metrics-cookie-consent";

export default function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Vérifier si le consentement a déjà été donné
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Afficher le bandeau après un court délai pour une meilleure UX
            setTimeout(() => {
                setShowBanner(true);
            }, 1000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
        setShowBanner(false);
    };

    const handleReject = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
        setShowBanner(false);
    };

    const handleClose = () => {
        setShowBanner(false);
    };

    if (!mounted || !showBanner) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="mx-auto max-w-7xl px-4 pb-4">
                <div className="rounded-lg border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-lg p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <Cookie className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold mb-1">Gestion des cookies</h3>
                                <p className="text-sm text-muted-foreground">
                                    Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant à naviguer, vous acceptez notre{" "}
                                    <Link href="/privacy" className="text-primary hover:underline">
                                        politique de confidentialité
                                    </Link>
                                    .
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Button variant="outline" size="sm" onClick={handleReject}>
                                Refuser
                            </Button>
                            <Button size="sm" onClick={handleAccept}>
                                Accepter
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose} title="Fermer">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
