import type { ChangeEvent, FormEvent } from "react";
import {
  getCurrentUser,
  updateUser,
  uploadAvatar,
} from "../services/authService";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { AppUser } from "../@types/types";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'>` +
      `<rect width='96' height='96' rx='48' fill='%23251cd5'/>` +
      `<text x='50%' y='54%' text-anchor='middle' font-family='Arial,sans-serif' ` +
      `font-size='40' fill='white' dominant-baseline='middle'>?</text>` +
      `</svg>`
  );

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
}

const Settings: React.FC = () => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState<AppUser | null>(() => getCurrentUser());
  const [form, setForm] = useState<ProfileForm>({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.avatar ?? ""
  );
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
    });
    setAvatarPreview(user.avatar ?? "");
  }, [user]);

  const initials = useMemo(() => {
    const f = (form.firstName || user?.firstName || "").trim();
    const l = (form.lastName || user?.lastName || "").trim();
    if (f || l) return `${f[0] ?? ""}${l[0] ?? ""}`.toUpperCase() || "U";
    const email = form.email || user?.email || "";
    if (email) return email[0]?.toUpperCase() || "U";
    return "U";
  }, [form, user]);

  if (!user) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center bg-[url('/bg-img.jpg')] bg-no-repeat">
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            theme === "dark"
              ? "bg-black/60 backdrop-blur-md"
              : "backdrop-blur-md bg-transparent"
          }`}
        />
        <div
          className={`relative z-10 mt-24 w-full max-w-md rounded-2xl p-10 text-center shadow-2xl backdrop-blur-xl transition-colors duration-500 ${
            theme === "dark"
              ? "bg-gray-900/40 text-white"
              : "bg-white/30 text-gray-900"
          }`}
        >
          <h1 className="text-2xl font-bold">You're not signed in</h1>
          <p className="mt-2 text-sm opacity-80">
            Please log in to manage your profile and avatar.
          </p>
          <a
            href="/login"
            className="mt-6 inline-block rounded-xl bg-[#251cd5] px-6 py-3 font-semibold text-white transition hover:bg-[#150f7e]"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const handleFieldChange =
    (key: keyof ProfileForm) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handlePickAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await uploadAvatar(file);
      setPendingAvatar(dataUrl);
      setAvatarPreview(dataUrl);
    } catch {
      // toast handled in service
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setPendingAvatar("");
    setAvatarPreview("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedFirst = form.firstName.trim();
    const trimmedLast = form.lastName.trim();
    if (!trimmedFirst || !trimmedLast) {
      toast.error("First name and last name cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: { firstName: string; lastName: string; avatar?: string } = {
        firstName: trimmedFirst,
        lastName: trimmedLast,
      };
      if (pendingAvatar !== null) payload.avatar = pendingAvatar;

      const updated = await updateUser(payload);
      setUser(updated);
      setPendingAvatar(null);
      setAvatarPreview(updated.avatar ?? "");
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayAvatar = avatarPreview || DEFAULT_AVATAR;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center bg-[url('/bg-img.jpg')] bg-no-repeat pt-28 pb-16">
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          theme === "dark"
            ? "bg-black/60 backdrop-blur-md"
            : "backdrop-blur-md bg-transparent"
        }`}
      />

      <div
        className={`relative z-10 w-full max-w-3xl rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl transition-colors duration-500 ${
          theme === "dark"
            ? "bg-gray-900/40 text-white"
            : "bg-white/30 text-gray-900"
        }`}
      >
        <header className="mb-8">
          <p
            className={`text-sm font-semibold uppercase tracking-widest ${
              theme === "dark" ? "text-blue-300" : "text-blue-700"
            }`}
          >
            Account settings
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold">
            Edit your profile
          </h1>
          <p
            className={`mt-2 text-sm sm:text-base ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Update your name and profile picture. Changes are saved to your
            account immediately.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 md:grid-cols-[260px_1fr] md:items-start"
          noValidate
        >
          {/* Avatar column */}
          <div className="flex flex-col items-center gap-4">
            <div
              className={`relative h-44 w-44 overflow-hidden rounded-full ring-4 transition-all duration-500 ${
                theme === "dark" ? "ring-blue-400/40" : "ring-blue-600/40"
              } shadow-xl`}
            >
              {avatarPreview ? (
                <img
                  src={displayAvatar}
                  alt="Profile avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#251cd5] to-[#005bbf] text-5xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={handlePickAvatar}
                className="w-full rounded-xl bg-[#251cd5] py-2.5 font-semibold text-white transition hover:bg-[#150f7e]"
              >
                Upload new avatar
              </button>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className={`w-full rounded-xl py-2.5 font-semibold transition ${
                    theme === "dark"
                      ? "bg-gray-700/60 text-white hover:bg-gray-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Remove avatar
                </button>
              )}
              <p
                className={`text-center text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                PNG, JPG, GIF or WEBP. Max 2 MB.
              </p>
            </div>
          </div>

          {/* Name column */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider mb-1.5">
                First name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={handleFieldChange("firstName")}
                placeholder="Enter your first name"
                className={`block w-full rounded-lg border px-4 py-2.5 outline-none transition duration-500 focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-blue-600/20"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider mb-1.5">
                Last name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={handleFieldChange("lastName")}
                placeholder="Enter your last name"
                className={`block w-full rounded-lg border px-4 py-2.5 outline-none transition duration-500 focus:ring-2 ${
                  theme === "dark"
                    ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                    : "bg-white/60 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600 focus:ring-blue-600/20"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                disabled
                placeholder="you@example.com"
                className={`block w-full rounded-lg border px-4 py-2.5 outline-none cursor-not-allowed ${
                  theme === "dark"
                    ? "bg-gray-800/30 border-gray-700 text-gray-400"
                    : "bg-gray-100 border-gray-200 text-gray-500"
                }`}
              />
              <p
                className={`mt-1 text-xs ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Email is locked to your account.
              </p>
            </div>

            <div
              className={`rounded-xl p-4 text-sm ${
                theme === "dark"
                  ? "bg-gray-800/40 text-gray-300"
                  : "bg-white/50 text-gray-700"
              }`}
            >
              <p className="font-semibold mb-1">Preview</p>
              <p>
                Hi,{" "}
                <span className="font-bold">
                  {(form.firstName || user.firstName || "Anonymous").trim()}{" "}
                  {(form.lastName || user.lastName || "").trim()}
                </span>{" "}
                — your changes will be visible across the dashboard once saved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-[#251cd5] py-3 font-semibold text-white transition hover:bg-[#150f7e] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
              <a
                href="/dashboard"
                className={`flex-1 text-center rounded-xl py-3 font-semibold transition ${
                  theme === "dark"
                    ? "bg-gray-700/60 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Cancel
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;