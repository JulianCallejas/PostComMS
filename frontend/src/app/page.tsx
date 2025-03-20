import { useAuthStore } from "@/stores/auth-store";
import { redirect } from "next/navigation";


export default function Home() {
  
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    redirect('/login')
  }else{
    redirect('/posts')
  }
  
}

