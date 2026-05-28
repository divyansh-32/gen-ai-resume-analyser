// src/pages/Login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/schemas/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
      login(data);
  };

  return (
    <>
    <Header />
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[350px] p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Input placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button className="w-full" variant="outline">Login</Button>
        </form>
      </Card>
    </div>
    </>
  );
}