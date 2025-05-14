'use client';
import React, { useState } from 'react';
import Leaderboard from '@/components/Leaderboard';
import { useAtom } from 'jotai';
import { ipOrGameCodeAtom } from '@/lib/services/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    const GameCodeModal = () => {
        const [openModal, setOpenModal] = useState(false);
        const [gameCode] = useAtom(ipOrGameCodeAtom);

        return (
            <>
                <div>
                    <Button variant="outline" onClick={() => setOpenModal((prev) => !prev)}>
                        Game Code
                    </Button>
                </div>
                {openModal && (
                    <Dialog open={openModal} onOpenChange={() => setOpenModal(false)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Game Code</DialogTitle>
                            </DialogHeader>
                            {gameCode}
                        </DialogContent>
                    </Dialog>
                )}
            </>
        );
    };

    return (
        <div className="flex h-screen flex-col">
            <div className="m-2">
                <Button variant="ghost" onClick={() => router.push('/')}>
                    <ArrowLeft /> Back
                </Button>
            </div>
            <Leaderboard />
            <div className="mx-2 mb-2 mt-auto flex justify-end">
                <GameCodeModal />
            </div>
        </div>
    );
}
