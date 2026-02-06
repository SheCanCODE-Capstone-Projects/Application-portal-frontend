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
  ArrowRight
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
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
    message: "Please select a gender",
  }),
  nationality: z.string().min(2, "Nationality is required"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"], {
    message: "Please select a marital status",
  }),
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

export default function PersonalInfoStep({ initialData, onNext, saving }: Props) {
  const getInitialPhone = () => {
    if (initialData?.phone) {
      const matchedCode = COUNTRY_CODES.find((c) => initialData.phone.startsWith(c.code));
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

  const [data, setData] = useState<PersonalInfoDto>(() => ({
    fullName: "",
    email: "",
    phone: "",
    gender: "MALE",
    nationality: "Rwandan",
    maritalStatus: "SINGLE",
    socialLinks: "",
    additionalInformation: "",
    ...initialData,
  }));

  const [phoneCode, setPhoneCode] = useState(initialPhoneState.code);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneState.number);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfoSchemaType, string>>>({});

  const handleSubmit = () => {
    const fullPhone = `${phoneCode}${phoneNumber.replace(/^0+/, "")}`;
    const payload = { ...data, phone: fullPhone };

    const result = personalInfoSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      (Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>).forEach((key) => {
        const messages = fieldErrors[key];
        if (messages && messages.length > 0) {
          newErrors[key] = messages[0];
        }
      });

      setErrors(newErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    if (!isValidPhoneNumber(fullPhone)) {
      setErrors((prev) => ({ ...prev, phone: "Invalid phone number format" }));
      toast.error("Please enter a valid phone number.");
      return;
    }

    onNext(payload);
  };

  return (
      <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Full Name *
            </label>
            <input
                className={`w-full p-3 sm:p-4 bg-gray-50 border ${
                    errors.fullName ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm sm:text-base`}
                placeholder="e.g. Keza Teta"
                value={data.fullName}
                onChange={(e) => {
                  setData({ ...data, fullName: e.target.value });
                  setErrors({ ...errors, fullName: "" });
                }}
            />
            {errors.fullName && (
                <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
              <Mail size={14} /> Email Address *
            </label>
            <input
                className={`w-full p-3 sm:p-4 bg-gray-50 border ${
                    errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm sm:text-base`}
                placeholder="name@example.com"
                value={data.email}
                onChange={(e) => {
                  setData({ ...data, email: e.target.value });
                  setErrors({ ...errors, email: "" });
                }}
            />
            {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
              <Phone size={14} /> Phone Number *
            </label>
            <div className="flex gap-2">
              <div className="w-[100px] sm:w-[140px]">
                <Select value={phoneCode} onValueChange={setPhoneCode}>
                  <SelectTrigger className="h-12 sm:h-[58px] bg-gray-50 border-gray-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm">
                    <SelectValue placeholder="+250" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 z-[9999]">
                    {COUNTRY_CODES.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="text-xs sm:text-sm">
                          {c.label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <input
                  className={`flex-1 p-3 sm:p-4 bg-gray-50 border ${
                      errors.phone ? "border-red-500 bg-red-50" : "border-gray-200"
                  } rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm sm:text-base`}
                  placeholder="788 123 456"
                  value={phoneNumber}
                  type="tel"
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""));
                    setErrors({ ...errors, phone: "" });
                  }}
              />
            </div>
            {errors.phone && (
                <p className="text-xs text-red-500 font-medium">{errors.phone}</p>
            )}
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> Nationality *
            </label>
            <input
                className={`w-full p-3 sm:p-4 bg-gray-50 border ${
                    errors.nationality ? "border-red-500 bg-red-50" : "border-gray-200"
                } rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm sm:text-base`}
                placeholder="Rwandan"
                value={data.nationality}
                onChange={(e) => setData({ ...data, nationality: e.target.value })}
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Gender *
            </label>
            <Select
                value={data.gender}
                onValueChange={(val) => setData({ ...data, gender: val as PersonalInfoDto["gender"] })}
            >
              <SelectTrigger className="w-full h-12 sm:h-[58px] bg-gray-50 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-100 z-[9999]">
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
                <SelectItem value="PREFER_NOT_TO_SAY">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
                <p className="text-xs text-red-500 font-medium">{errors.gender}</p>
            )}
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
              <Heart size={14} /> Marital Status *
            </label>
            <Select
                value={data.maritalStatus}
                onValueChange={(val) =>
                    setData({ ...data, maritalStatus: val as PersonalInfoDto["maritalStatus"] })
                }
            >
              <SelectTrigger className="w-full h-12 sm:h-[58px] bg-gray-50 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-100 z-[9999]">
                <SelectItem value="SINGLE">Single</SelectItem>
                <SelectItem value="MARRIED">Married</SelectItem>
                <SelectItem value="DIVORCED">Divorced</SelectItem>
                <SelectItem value="WIDOWED">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Social Links */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
              <LinkIcon size={14} /> LinkedIn / Portfolio URL
            </label>
            <input
                className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm sm:text-base"
                placeholder="https://linkedin.com/in/..."
                value={data.socialLinks || ""}
                onChange={(e) => setData({ ...data, socialLinks: e.target.value })}
            />
          </div>

          {/* Additional Info */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-2">
              <Info size={14} /> Additional Information
            </label>
            <textarea
                rows={3}
                className="w-full p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none text-sm sm:text-base"
                placeholder="Any other details we should know about..."
                value={data.additionalInformation || ""}
                onChange={(e) =>
                    setData({ ...data, additionalInformation: e.target.value })
                }
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-emerald-700 text-white rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {saving ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" /> Saving...
                </>
            ) : (
                <>
                  Save & Continue <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                </>
            )}
          </button>
        </div>
      </div>
  );
}