import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { faker } from '@faker-js/faker';
import { titleCase } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Tooltip } from "@/components/util";

export const BulkTeamGen = () => {
    const [toGenerate, setToGenerate] = useState(1);
    const [teams, setTeams] = useState<{ username: string; displayName: string; password: string }[]>([]);
    const [currentTeamPage, setCurrentTeamPage] = useState(0);

    const generate = () => {
        setTeams(old => [...old, ...Array.from({ length: Math.max(0, Math.min(100 - old.length, toGenerate)) }, randomTeam)]);
    };

    const randomTeam = () => {
        const adj = faker.word.adjective();
        const noun = faker.word.noun();

        const pwdAdj = faker.word.adjective({ length: { min: 1, max: 5 } });
        const pwdNoun = faker.word.noun({ length: { min: 1, max: 5 } });

        return {
            username: `${adj}-${noun}`,
            displayName: `${titleCase(adj)} ${titleCase(noun)}`,
            password: `${pwdAdj}-${pwdNoun}`,
        }
    };

    const regenTeam = (index: number) => {
        setTeams(old => old.map((t, i) => i === index ? randomTeam() : t));
    };

    const removeTeam = (index: number) => {
        setTeams(old => old.filter((_, i) => i !== index));
    };

    const add = async () => {
        console.log(teams);
    };

    const totalPages = Math.ceil(teams.length / 10);

    return (
        <div className="p-2">
            <h1 className="text-2xl">Generate Teams</h1>
            <div className="w-full flex flex-col items-center space-y-4">
                <div className="w-1/3">
                    <Label htmlFor="num-teams">Number of teams to generate</Label>
                    <div className="flex flex-row w-full space-x-2">
                        <Input id="num-teams" type="number" min={1} max={100} value={toGenerate} onChange={s => setToGenerate(+s.target.value)} />
                        <Tooltip tooltip="Up to 100 teams may be added at a time" disabled={teams.length < 100}>
                            <Button variant="secondary" onClick={generate} disabled={teams.length >= 100}>Generate</Button>
                        </Tooltip>
                    </div>
                </div>

                {teams.length !== 0 &&
                    (
                        <div className="w-5/6 mx-auto flex flex-col space-y-4">
                            <Table>
                                <TableCaption>
                                    <div className="flex flex-row justify-between items-center">
                                        Page {currentTeamPage + 1} out of {totalPages}
                                        <div className="flex space-x-2 px-2">
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                disabled={currentTeamPage === 0}
                                                onClick={() => setCurrentTeamPage(c => c - 1)}
                                            >
                                                <ChevronLeft />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                disabled={currentTeamPage === totalPages - 1}
                                                onClick={() => setCurrentTeamPage(c => c + 1)}
                                            >
                                                <ChevronRight />
                                            </Button>
                                        </div>
                                    </div>
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/4">Username</TableHead>
                                        <TableHead className="w-1/4">Display Name</TableHead>
                                        <TableHead className="w-1/4">Password</TableHead>
                                        <TableHead className="w-1/6" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teams.slice(currentTeamPage * 10, (currentTeamPage + 1) * 10).map((team, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{team.username}</TableCell>
                                            <TableCell>{team.displayName}</TableCell>
                                            <TableCell>{team.password}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button type="button" variant="secondary" size="icon" onClick={() => regenTeam(i + currentTeamPage * 10)}>
                                                    <RefreshCw />
                                                </Button>
                                                <Button type="button" variant="secondary" size="icon" onClick={() => removeTeam(i + currentTeamPage * 10)}>
                                                    <Trash2 />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button onClick={add}>
                                <span className="flex gap-2">
                                    <Plus /> Add Teams
                                </span>
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
};
