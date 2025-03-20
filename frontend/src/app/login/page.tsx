import LoginForm from "@/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
    return (
      <div className="min-h-screen flex flex-col items-center  bg-background px-4">
        <Image src="/img/logo250.webp" alt="Logo" width={250} height={250} />
        <LoginForm />
      </div>
    )
  }
  