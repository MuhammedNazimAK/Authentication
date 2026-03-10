import { PostCard } from "../components/PostCard";
import { postData } from "../context/PostContext"

export const Home = () => {

    const { posts, reels } = postData();

    const feed = [...posts, ...reels].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    return (
        <main className="max-w-[470px] mx-auto pt-14 md:pt-6 pb-20 md:pb-6">
            {feed.map(post => (
                <PostCard key={post._id} post={post} />
            ))}
        </main>
    )
}