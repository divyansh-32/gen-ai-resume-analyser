import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/schemas/auth";
import { useAuth } from "@/hooks/useAuth";
import Headers from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type LoginForm = z.infer<typeof signUpSchema>;

export default function Login() {
  const { registerMethod } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      registerMethod(data);
    } catch (err: any) {
      console.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
    <Headers />
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[350px] p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <Input placeholder="Name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

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

          <Button className="w-full" variant="outline" size="sm">Sign Up</Button>
        </form>
      </Card>
    </div>
    </>
  );
}