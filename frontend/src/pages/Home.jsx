import { PostCard } from "../components/PostCard";
import { PostData } from "../context/PostContext"

export const Home = () => {
    const { posts } = PostData();
    return (
        <main className="max-w-117.5 mx-auto pt-14 md:pt-6 pb-20 md:pb-6">
            {posts && posts.map(post => (
                <PostCard key={post._id} post={post} />
            ))}
        </main>
    )
}
