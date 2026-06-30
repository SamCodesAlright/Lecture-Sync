import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "../common/Button.jsx";
import Card from "../common/Card.jsx";
import Input from "../common/Input.jsx";
import authService from "../../services/authService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ email, password }) => {
    setServerError("");

    try {
      const response = await authService.login(email, password);
      login(response.token, response.user);
      toast.success("Logged in successfully.");

      if (response.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/instructor/dashboard", { replace: true });
      }
    } catch (error) {
      const message =
        error?.message ||
        error?.error ||
        "Unable to login. Please check your credentials and try again.";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <Card
      padded={false}
      className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-xl"
    >
      <div className="space-y-6 px-8 py-10 sm:px-10">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-sm">
            <Mail className="h-8 w-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              LectureSync
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Sign in to your account
            </h1>
          </div>
        </div>

        {serverError && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {serverError}
          </div>
        )}

        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            autoComplete="email"
            required
            disabled={isSubmitting}
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <span className="text-xs text-slate-500">
                Minimum 6 characters
              </span>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                icon={Lock}
                required
                autoComplete="current-password"
                disabled={isSubmitting}
                error={errors.password?.message}
                className="pr-12"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {/* {errors.password?.message && (
              <p className="text-sm text-rose-600">{errors.password.message}</p>
            )} */}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default LoginForm;
