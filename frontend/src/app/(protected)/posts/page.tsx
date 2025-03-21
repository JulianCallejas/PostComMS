import CreatePostForm from "@/components/posts/create-post-form";
import PostsList from "@/components/posts/posts-list";


export default function PostsPage() {
    return (
      <div className="max-w-2xl mx-auto animate-fade">
        <CreatePostForm />
        <PostsList />
      </div>
    )
  }