"use client"
import { createContext, useState, useContext } from "react"
import { useRouter } from "next/router"
import { set } from "mongoose"

export const SearchContext = createContext()

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const fetchSearchResults = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${process.env.API}/search?searchQuery=${searchQuery}`);
            if (response.ok) {
                const data = await response.json();
                console.log("SEARCH RESULTS => ", data);
                setSearchResults(data);
            } else {
                console.log("An error occured, try again.")
                throw new Error("An error occured, try again.")
            }
        } catch (error) {
            console.log(error);
            console.log("An error occured, try again.")
        }
    }

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            searchResults,
            setSearchResults,
            fetchSearchResults
        }}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearch = () => useContext(SearchContext);