'use client';
import React, { useState } from 'react';
import Leaderboard from '@/components/Leaderboard';
import { useAtom } from 'jotai';
import { ipOrGameCodeAtom } from '@/lib/services/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LeaderboardMenu from './LeaderboardMenu';

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
            <div className="relative m-2 flex">
                <div className="duration-250 absolute left-0 top-0 opacity-0 transition-opacity hover:opacity-100">
                    <Button variant="ghost" asChild className="font-bold">
                        <Link href="/">
                            <ArrowLeft /> Back
                        </Link>
                    </Button>
                </div>
                <div className="pr-2 pt-2">
                    <LeaderboardMenu />
                </div>
            </div>
            <Leaderboard />
            <div className="absolute bottom-0 right-0 pb-2 pr-2">
                <GameCodeModal />
            </div>
        </div>
    );
}
