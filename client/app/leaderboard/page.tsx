'use client';
import React, { useState } from 'react';
import Leaderboard from '@/components/Leaderboard';
import { useAtom } from 'jotai';
import { ipOrGameCodeAtom } from '@/lib/services/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
    const GameCodeModal = () => {
        const [openModal, setOpenModal] = useState(false);
        const [gameCode] = useAtom(ipOrGameCodeAtom);

        return (
            <>
                <div>
                    <Button variant="link" onClick={() => setOpenModal((prev) => !prev)}>
                        <p className="text-xl font-bold">{gameCode}</p>
                    </Button>
                </div>
                {openModal && (
                    <Dialog open={openModal} onOpenChange={() => setOpenModal(false)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Game Code</DialogTitle>
                            </DialogHeader>
                            <p className="text-4xl font-bold">{gameCode}</p>
                        </DialogContent>
                    </Dialog>
                )}
            </>
        );
    };

    return (
        <div className="flex h-screen flex-col">
            <div className="m-2">
                <Button
                    variant="ghost"
                    asChild
                    className="opacity-0 transition-opacity duration-100 hover:opacity-100"
                >
                    <Link href="/">
                        <ArrowLeft /> Back
                    </Link>
                </Button>
            </div>
            <Leaderboard />
            <div className="mx-2 mb-2 mt-auto flex justify-end">
                <GameCodeModal />
            </div>
        </div>
    );
}
