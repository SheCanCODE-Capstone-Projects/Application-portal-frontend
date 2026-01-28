import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";


export default function SystemReport() {
    const dataValues = [130, 190, 110, 140, 180, 230, 210, 150, 170, 210, 220, 170];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (
        <Card className="lg:col-span-2 border-gray-300 border text-black">
            <CardHeader>
                <CardTitle className="text-lg">Monthly Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full flex items-end justify-between gap-2 pt-4">
                    {dataValues.map((val, i) => (
                        <div key={i} className="flex flex-col items-center flex-1 gap-2">
                            <div
                                className="w-full bg-[#3b82f6] rounded-t-sm transition-all hover:bg-blue-400"
                                style={{ height: `${(val / 250) * 100}%` }}
                            />
                            <span className="text-[10px] text-black uppercase">{months[i]}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
