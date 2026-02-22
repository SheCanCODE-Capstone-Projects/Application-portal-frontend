"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCohortApplication } from "@/hooks/me/useCohortApplication";
import { Cohort } from "@/types/cohort/cohort";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X, Loader2 } from "lucide-react";
import { AuroraBackground } from "@/components/background/page";
import { Navbar } from "@/components/share/Navbar";

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

  const { cohorts = [], loading, applying, fetchCohorts, applyToCohort } =
      useCohortApplication();

  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [cohortImagesMap, setCohortImagesMap] = useState<
      Record<string, string>
  >({});

  // 🔹 Assign random image per cohort (stable per session)
  const getCohortImage = (id: string) => {
    if (!cohortImagesMap[id]) {
      setCohortImagesMap((prev) => ({
        ...prev,
        [id]:
            cohortImages[Math.floor(Math.random() * cohortImages.length)],
      }));
    }
    return cohortImagesMap[id];
  };

  // 🔹 Initialize auth
  useEffect(() => {
    checkAuth().then(() => setInitialized(true));
  }, [checkAuth]);

  // 🔹 Redirect if not authenticated
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/login?redirect=/applicant/onboarding");
    }
  }, [initialized, isAuthenticated, router]);

  // 🔹 Redirect admin
  useEffect(() => {
    if (initialized && user?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [initialized, user, router]);

  // 🔹 Redirect if already in cohort
  useEffect(() => {
    if (initialized && hasCohort) {
      router.replace("/applicant");
    }
  }, [initialized, hasCohort, router]);

  // 🔹 Fetch cohorts if needed
  useEffect(() => {
    if (initialized && isAuthenticated && !hasCohort) {
      fetchCohorts();
    }
  }, [initialized, isAuthenticated, hasCohort, fetchCohorts]);

  const handleApply = async () => {
    if (!selectedCohort || applying) return;

    const success = await applyToCohort(selectedCohort.id);

    if (success) {
      await refreshProfile();
      router.push("/applicant");
    }
  };

  // 🔹 Loading Screen
  if (!initialized || loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-green-600" />
        </div>
    );
  }

  return (
      <AuroraBackground className="px-4">
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center pb-20"
        >
          <Navbar className="w-full max-w-6xl" />

          {/* 🔹 Header */}
          <section className="text-center mt-8 mb-10 max-w-3xl px-4">
            <p className="text-2xl font-bold text-green-700 mb-2">
              Program Selection
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Choose Your Path
            </h1>
            <p className="text-slate-800 max-w-xl mb-10 mx-auto text-lg">
              Select the cohort that aligns with your career goals to begin your
              application.
            </p>
          </section>

          {/* 🔹 EMPTY STATE */}
          {cohorts.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center text-center py-20">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-10 max-w-xl">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    No Cohorts Available
                  </h2>
                  <p className="text-slate-700 text-lg mb-3">
                    There are currently no open cohorts.
                  </p>
                  <p className="text-slate-600">
                    New programs will be announced soon. Please check back later.
                  </p>

                  <button
                      onClick={fetchCohorts}
                      className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Refresh
                  </button>
                </div>
              </div>
          ) : (
              /* 🔹 COHORT GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {cohorts.map((cohort, index) => {
                  const isActive = selectedCohort?.id === cohort.id;
                  const imgSrc = getCohortImage(cohort.id);

                  return (
                      <motion.div
                          key={cohort.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setSelectedCohort(cohort)}
                          className={`group relative h-80 w-full rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl ${
                              isActive
                                  ? "border-green-500 ring-2 ring-green-500"
                                  : "border-slate-200"
                          }`}
                      >
                        <Image
                            src={imgSrc}
                            alt={cohort.name}
                            fill
                            className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all" />

                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                          <h3 className="text-xl font-bold text-center drop-shadow-md mb-1">
                            {cohort.name}
                          </h3>
                          <p className="text-xs text-center text-gray-200 opacity-80">
                            Click to select
                          </p>
                        </div>

                        {isActive && (
                            <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                              <ArrowRight size={20} />
                            </div>
                        )}
                      </motion.div>
                  );
                })}
              </div>
          )}

          {/* 🔹 MODAL */}
          <AnimatePresence>
            {selectedCohort && (
                <motion.div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => !applying && setSelectedCohort(null)}
                >
                  <motion.div
                      className="relative w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 overflow-y-auto max-h-[85vh] shadow-2xl"
                      initial={{ scale: 0.95, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 20 }}
                      onClick={(e) => e.stopPropagation()}
                  >
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => setSelectedCohort(null)}
                        disabled={applying}
                    >
                      <X size={24} />
                    </button>

                    <h2 className="text-3xl font-bold mb-4 text-gray-900">
                      {selectedCohort.name}
                    </h2>

                    <div className="text-gray-600 mb-8">
                      <p>
                        {selectedCohort.description ||
                            "No description provided for this cohort."}
                      </p>
                    </div>

                    <button
                        onClick={handleApply}
                        disabled={applying}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition ${
                            applying
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                        }`}
                    >
                      {applying ? (
                          <>
                            <Loader2 className="animate-spin h-5 w-5" />
                            Joining Cohort...
                          </>
                      ) : (
                          <>
                            Continue to Application
                            <ArrowRight className="h-5 w-5" />
                          </>
                      )}
                    </button>
                  </motion.div>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AuroraBackground>
  );
}