"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCohortApplication } from "@/hooks/me/useCohortApplication";
import { Cohort } from "@/types/cohort/cohort";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { AuroraBackground } from "@/components/background/page";
import { Navbar } from "@/components/share/Navbar";

// Array of local frontend images for random assignment
const cohortImages = [
    "/images/13211.jpg",
    "/images/2517915.jpg",
    "/images/4882464.jpg",
    "/images/7040859.jpg",
    "/images/backend_text_1.jpg",
];

export default function OnboardingPage() {
    const router = useRouter();
    const { user, isAuthenticated, hasCohort, checkAuth, refreshProfile } =
        useAuth();
    const { cohorts, loading, applying, fetchCohorts, applyToCohort } =
        useCohortApplication();

    const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
    const [initialized, setInitialized] = useState(false);

    // Assign a random image to each cohort
    const getRandomImage = () =>
        cohortImages[Math.floor(Math.random() * cohortImages.length)];

    const cohortImagesMap: Record<string, string> = {};
    cohorts.forEach((c) => {
        if (!cohortImagesMap[c.id]) cohortImagesMap[c.id] = getRandomImage();
    });

    /* -------------------- AUTH -------------------- */
    React.useEffect(() => {
        checkAuth().then(() => setInitialized(true));
    }, [checkAuth]);

    React.useEffect(() => {
        if (initialized && !isAuthenticated)
            router.push("/login?redirect=/applicant/onboarding");
    }, [initialized, isAuthenticated, router]);

    React.useEffect(() => {
        if (initialized && user?.role === "ADMIN") router.push("/admin");
    }, [initialized, user, router]);

    React.useEffect(() => {
        if (initialized && hasCohort) router.push("/applicant/apply");
    }, [initialized, hasCohort, router]);

    React.useEffect(() => {
        if (initialized && isAuthenticated && !hasCohort) fetchCohorts();
    }, [initialized, isAuthenticated, hasCohort, fetchCohorts]);

    /* -------------------- APPLY -------------------- */
    const handleApply = async () => {
        if (!selectedCohort) return;
        const result = await applyToCohort(selectedCohort.id);
        if (result) {
            await refreshProfile();
            router.push("/applicant/apply");
        }
    };

    /* -------------------- LOADING -------------------- */
    if (!initialized || (loading && cohorts.length === 0))
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-10 h-10 rounded-full border-4 border-green-500 border-t-transparent" />
            </div>
        );

    return (
        <AuroraBackground className="px-4">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center"
            >
                {/* Navbar */}
                <Navbar className="w-full max-w-6xl" />

                {/* Header */}
                <section className="text-center mt-5 mb-6 max-w-3xl">
                    <p className="text-2xl font-bold text-green-700 mb-2">
                        Onboarding To a Cohort
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                        What kind of cohort would you like to join?
                    </h1>
                    <p className="text-slate-800 text-center max-w-xl mb-10">
                        Choose the program that best fits your goals and start learning with
                        a focused cohort.
                    </p>
                </section>

                {/* Cohort Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {cohorts.map((cohort, index) => {
                        const isActive = selectedCohort?.id === cohort.id;
                        const imgSrc = cohortImagesMap[cohort.id];

                        return (
                            <motion.button
                                key={cohort.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedCohort(cohort)}
                                className={`group relative h-72 w-full rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                                    isActive ? "border-green-500" : "border-slate-200"
                                }`}
                            >
                                {/* Image */}
                                <Image
                                    src={imgSrc}
                                    alt={cohort.name}
                                    fill
                                    className="absolute inset-0 object-cover"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/65 group-hover:bg-black/40 transition-all" />

                                {/* Info */}
                                <div className="absolute inset-x-0 bottom-0 p-3">
                                    <h3 className="text-white text-lg font-bold text-center text-shadow-lg">
                                        {cohort.name}
                                    </h3>

                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Cohort Preview Modal */}
                <AnimatePresence>
                    {selectedCohort && (
                        <motion.div
                            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-xl p-6 overflow-y-auto max-h-[80vh]"
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                transition={{
                                    duration: 0.2,
                                    type: "spring",
                                    stiffness: 600,
                                    damping: 32,
                                }}
                            >
                                {/* Close */}
                                <button
                                    className="absolute top-6 right-5 text-gray-700 hover:text-gray-900 rounded-full border border-gray-300 shadow"
                                    onClick={() => setSelectedCohort(null)}
                                >
                                    <X size={20} />
                                </button>

                                {/* Cohort Info */}
                                <h2 className="text-2xl font-bold mb-3">{selectedCohort.name}</h2>
                                <p className="text-gray-700 mb-6">
                                    {selectedCohort.description || "No description provided."}
                                </p>

                                {/* Apply Button */}
                                <button
                                    onClick={handleApply}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full w-full"
                                >
                                    Continue to Application{" "}
                                    <ArrowRight className="inline w-4 h-4 ml-2" />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AuroraBackground>
    );
}
