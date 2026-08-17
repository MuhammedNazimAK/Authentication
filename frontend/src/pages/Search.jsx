import { useEffect, useState } from "react";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../components/icons";

export const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { searchResults, searchUsers } = UserData();

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            searchUsers(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`)
    }

    return (
        <>
        <div className="flex flex-col justify-center items-center mt-6 mx-6">
        <div className="relative w-full md:max-w-xl lg:max-w-2xl">
            
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <SearchIcon />
            </div>
            <input 
                className="w-full border rounded-2xl border-border bg-surface p-2 pr-6 pl-12"
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
            />
        </div>
    </div>
        <div className="w-full md:max-w-xl lg:max-w-2xl mx-auto mt-6">
            <ul>
                {searchResults?.map((item) => 
                <li className="flex items-center gap-3 text-text p-3 hover:bg-border/20 cursor-pointer transition-colors" 
                    key={item._id}
                    onClick={() => handleUserClick(item._id)}
                    >
                        <img src={item.profilePic.url} 
                            alt={item.name} 
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    <span className="font-medium">{item.name}</span>
                </li>
                )}
            </ul>
        </div>
        </>
    )
}
