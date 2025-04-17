import React from 'react'

const Footer = () => {
  return (
    <div className=" container z-30 bg-gray-100 text-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-t-2 border-gray-400 px-6 py-10">
        {/* Left Column */}
        <div className="md:w-1/3">
          <h3 className="text-2xl font-bold mb-2">
            <span className="text-emerald-300">Byte</span>Code
          </h3>
          <p className="text-sm">
            Where ideas meet innovation. Dive into a world of insightful articles written by passionate thinkers and industry experts.
          </p>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Stay Updated</h4>
            <input
              type="text"
              placeholder="Enter your email"
              className="text-base p-2 w-full md:w-auto border border-gray-300 rounded mb-2"
            />
            <button className="w-full md:w-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              Subscribe
            </button>
          </div>
        </div>

        {/* Middle Column */}
        <div className="md:w-1/4">
          <h3 className="text-xl font-bold mb-2">Explore</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#">All Articles</a></li>
            <li><a href="#">Topics</a></li>
            <li><a href="#">Authors</a></li>
            <li><a href="#">Podcasts</a></li>
          </ul>
        </div>

        {/* Right Column */}
        <div className="md:w-1/4">
          <h3 className="text-xl font-bold mb-2">Legal</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms Of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Licenses</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Footer
