import React from 'react'

const SearchLocation = (props) => {
  return (
    <div>
        <input className='text-sm py-2 px-3 mt-1 rounded-md border border-gray-300 focus:ring focus:ring-indigo-200 focus:border-indigo-300' type="search" name="search" id="sloc" placeholder='Search location'/>
    </div>
  )
}

export default SearchLocation