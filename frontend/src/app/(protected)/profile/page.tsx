import PostsList from "@/components/posts/posts-list";
import ProfileForm from "@/components/profile/profile-form";

export default function ProfilePage() {
    return (
      <div className="max-w-2xl mx-auto">
        <ProfileForm/>
        <h2 className="my-8 text-2xl" >Mis publicaciones</h2>
        <PostsList myPostsOnly={true} />
        
      </div>
    )
  }
  
  