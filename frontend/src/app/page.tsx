import { protectRoute } from "@/actions/protected-route-guard";
import { redirect } from "next/navigation";


export default async function Home() {
  
  const isAuthorized = await protectRoute();

  if (!isAuthorized) {
    redirect('/login')
  }else{
    redirect('/posts')
  }

}

