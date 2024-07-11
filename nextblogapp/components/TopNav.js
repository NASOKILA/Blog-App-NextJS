import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useSearch } from '@/context/search'

export default function TopNav() {

    const { data, status } = useSession();
    const { searchQuery, setSearchQuery, fetchSearchResults, searchResults } = useSearch();
    
    const userIsLoggedIn = status === 'authenticated'

    return (
        <nav className='nav shadow p-2 justify-content-between mb-3'>
            <Link className='nav-link' href='/'>BLOG</Link>

            <form onSubmit={fetchSearchResults} role="search" onClick={fetchSearchResults} className='d-flex'>
                <input 
                    type='search'
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className='form-control' 
                    placeholder='Search...'
                    aria-label='Search'
                />    
            </form>
            <button className='btn'> &#128270;</button>

            {!userIsLoggedIn ? (
                <div className='d-flex'>
                    <Link className='nav-link' href='/login'>Login</Link>
                    <Link className='nav-link' href='/register'>Register</Link>
                </div>
            ) : (
                <div className='d-flex'>
                    <Link className='nav-link' href={`/dashboard/${data?.user?.role ==="admin" ? "admin": "user"}`}>{data?.user?.name} ({data?.user?.role})</Link>
                    <button className='nav-link pointer' onClick={() => signOut({callbackUrl: "/login"})}>Logout</button>
                </div>
            )}
        </nav>
    )
}