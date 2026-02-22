"use client";

import {
  User,
  Mail,
  Phone,
  Globe,
  Heart,
  Link as LinkIcon,
  Info,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import { toast } from "sonner";

import { PersonalInfoDto } from "@/types/application/application";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is invalid"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
  nationality: z.string().min(2, "Nationality is required"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
  socialLinks: z.string().optional(),
  additionalInformation: z.string().optional(),
});

type PersonalInfoSchemaType = z.infer<typeof personalInfoSchema>;

interface Props {
  initialData?: PersonalInfoDto;
  onNext: (data: PersonalInfoDto) => void;
  saving: boolean;
}

const COUNTRY_CODES = [
  { code: "+250", label: "🇷🇼 Rwanda (+250)" },
  { code: "+254", label: "🇰🇪 Kenya (+254)" },
  { code: "+256", label: "🇺🇬 Uganda (+256)" },
  { code: "+255", label: "🇹🇿 Tanzania (+255)" },
  { code: "+257", label: "🇧🇮 Burundi (+257)" },
  { code: "+1", label: "🇺🇸 USA (+1)" },
];

export default function PersonalInfoStep({
                                           initialData,
                                           onNext,
                                           saving,
                                         }: Props) {
  const getInitialPhone = () => {
    if (initialData?.phone) {
      const matchedCode = COUNTRY_CODES.find((c) =>
          initialData.phone.startsWith(c.code)
      );
      if (matchedCode) {
        return {
          code: matchedCode.code,
          number: initialData.phone.replace(matchedCode.code, ""),
        };
      }
      return { code: "+250", number: initialData.phone };
    }
    return { code: "+250", number: "" };
  };

  const initialPhoneState = getInitialPhone();

  const [data, setData] = useState<PersonalInfoDto>({
    fullName: "",
    email: "",
    phone: "",
    gender: "MALE",
    nationality: "Rwandan",
    maritalStatus: "SINGLE",
    socialLinks: "",
    additionalInformation: "",
    ...initialData,
  });

  const [phoneCode, setPhoneCode] = useState(initialPhoneState.code);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneState.number);
  const [errors, setErrors] =
      useState<Partial<Record<keyof PersonalInfoSchemaType, string>>>({});

  const handleSubmit = () => {
    const fullPhone = `${phoneCode}${phoneNumber.replace(/^0+/, "")}`;
    const payload = { ...data, phone: fullPhone };

    const result = personalInfoSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      Object.keys(fieldErrors).forEach((key) => {
        const messages = fieldErrors[key as keyof typeof fieldErrors];
        if (messages?.length) newErrors[key] = messages[0];
      });

      setErrors(newErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    if (!isValidPhoneNumber(fullPhone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Invalid phone number format",
      }));
      toast.error("Please enter a valid phone number.");
      return;
    }

    onNext(payload);
  };

  const inputBase =
      "w-full h-12 sm:h-[56px] px-4 bg-gray-50 border rounded-xl sm:rounded-2xl outline-none transition-all duration-200 text-sm sm:text-base";

  return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <User size={14} /> Full Name *
              </label>
              <input
                  className={`${inputBase} ${
                      errors.fullName
                          ? "border-red-500 bg-red-50 focus:ring-red-400"
                          : "border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                  value={data.fullName}
                  onChange={(e) => {
                    setData({ ...data, fullName: e.target.value });
                    setErrors({ ...errors, fullName: "" });
                  }}
              />
              {errors.fullName && (
                  <p className="text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Mail size={14} /> Email *
              </label>
              <input
                  className={`${inputBase} ${
                      errors.email
                          ? "border-red-500 bg-red-50 focus:ring-red-400"
                          : "border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                  }`}
                  value={data.email}
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
              />
              {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Phone size={14} /> Phone *
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="w-full sm:w-[150px]">
                  <Select value={phoneCode} onValueChange={setPhoneCode}>
                    <SelectTrigger className="h-12 sm:h-[56px] bg-gray-50 border-gray-200 rounded-xl sm:rounded-2xl text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_CODES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.label}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <input
                    type="tel"
                    className={`${inputBase} ${
                        errors.phone
                            ? "border-red-500 bg-red-50 focus:ring-red-400"
                            : "border-gray-200 focus:ring-emerald-500 focus:border-emerald-500"
                    }`}
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""));
                      setErrors({ ...errors, phone: "" });
                    }}
                />
              </div>

              {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Nationality */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Globe size={14} /> Nationality *
              </label>
              <input
                  className={`${inputBase} border-gray-200 focus:ring-emerald-500`}
                  value={data.nationality}
                  onChange={(e) =>
                      setData({ ...data, nationality: e.target.value })
                  }
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <User size={14} /> Gender *
              </label>
              <Select
                  value={data.gender}
                  onValueChange={(val) =>
                      setData({ ...data, gender: val as PersonalInfoSchemaType["gender"] })
                  }
              >
                <SelectTrigger className="h-12 sm:h-[56px] bg-gray-50 border-gray-200 rounded-xl sm:rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                  <SelectItem value="PREFER_NOT_TO_SAY">
                    Prefer not to say
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Heart size={14} /> Marital Status *
              </label>
              <Select
                  value={data.maritalStatus}
                  onValueChange={(val) =>
                      setData({ ...data, maritalStatus: val as PersonalInfoSchemaType["maritalStatus"] })
                  }
              >
                <SelectTrigger className="h-12 sm:h-[56px] bg-gray-50 border-gray-200 rounded-xl sm:rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MARRIED">Married</SelectItem>
                  <SelectItem value="DIVORCED">Divorced</SelectItem>
                  <SelectItem value="WIDOWED">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Social Links */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <LinkIcon size={14} /> LinkedIn / Portfolio
              </label>
              <input
                  className={`${inputBase} border-gray-200 focus:ring-emerald-500`}
                  value={data.socialLinks || ""}
                  onChange={(e) =>
                      setData({ ...data, socialLinks: e.target.value })
                  }
              />
            </div>

            {/* Additional Info */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Info size={14} /> Additional Information
              </label>
              <textarea
                  rows={4}
                  className="w-full min-h-[120px] px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm sm:text-base"
                  value={data.additionalInformation || ""}
                  onChange={(e) =>
                      setData({
                        ...data,
                        additionalInformation: e.target.value,
                      })
                  }
              />
            </div>
          </div>

          {/* Button Section */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full sm:w-auto h-12 sm:h-[56px] px-8 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {saving ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      Saving...
                    </>
                ) : (
                    <>
                      Save & Continue
                      <ArrowRight size={18} />
                    </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}