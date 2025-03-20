import RegisterForm from "@/components/auth/register-form";
import Image from "next/image";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col items-center  bg-background px-4">
            <Image src="/img/logo250.webp" alt="Logo" width={250} height={250} />
            <RegisterForm />    
        </div>
    )
}

