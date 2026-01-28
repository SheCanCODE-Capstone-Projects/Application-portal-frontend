import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {AlertTriangle} from "lucide-react";

export default function SystemRejects() {
    const systemRejects = [
        { id: "REJ-001", name: "John Doe", reason: "Age requirement not met", date: "2025-01-10" },
    ];

    return (
        <Card className="lg:col-span-1  border-gray-300 text-black">
            <CardHeader className="flex flex-row items-center gap-2">
                <AlertTriangle className="h-8 w-8 text-rose-500" />
                <CardTitle className="text-md">Recent System Rejects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {systemRejects.map((rej) => (
                    <div key={rej.id} className="p-3 bg-red-300 rounded-lg border border-rose-500/20 flex justify-between gap-8">
                        <div>
                            <p className="text-md font-medium"><span className="font-bold">Name:</span> {rej.name}</p>
                            <p className="text-md text-blakc mt-1"><span className="font-bold">Reason:</span> {rej.reason}</p>
                        </div>
                        <div>
                            <p className="text-sm text-white mt-2">{rej.date}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}