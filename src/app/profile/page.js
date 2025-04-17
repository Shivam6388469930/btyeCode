"use client";

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Image from "next/image"; // Import the Image component from Next.js

export default function Page() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'tam',
    email: 'ram',
    gender: 'Male/Female',
    mobile: '5252513516',
    address: 'xyz',
  });

  // Load name/email from localStorage once
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'xyz';
    const storedEmail = localStorage.getItem('userEmail') || 'xyz@gmail.com';

    setFormData(prev => ({
      ...prev,
      fullName: storedName,
      email: storedEmail,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fullName' || name === 'email') return; // prevent editing
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 h-[80vh] mt-32">
      {/* Heading */}
      <div className='text-center mb-12'>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold"
        >
          Your Profile
        </motion.h1>
      </div>

      {/* Profile & Details Section */}
      <div className="flex gap-4">
        {/* Profile Card */}
        <div className="w-1/3 h-[60vh] flex flex-col items-center justify-center text-black bg-white border border-gray-300 shadow-2xl rounded-xl p-4 gap-4">
          <div className="w-40 h-40 border-2 border-black rounded-full overflow-hidden">
            <Image 
              src="/avter.png" 
              alt="Avatar" 
              width={160} 
              height={160} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h1 className="text-xl font-semibold">{formData.fullName}</h1>
          <h1 className="text-md text-gray-600">{formData.email}</h1>
          <div className="flex gap-3">
            <button className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-light px-6 py-2 rounded-lg transition duration-300 ease-in-out">
              Follow
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-light px-6 py-2 rounded-lg transition duration-300 ease-in-out">
              Message
            </button>
          </div>
        </div>

        {/* Details Card */}
        <div className="w-2/3 h-[60vh] flex flex-col text-black bg-white border border-gray-300 shadow-2xl rounded-xl overflow-y-auto">
          {[
            ["Full Name", "fullName"],
            ["Email", "email"],
            ["Gender", "gender"],
            ["Mobile No.", "mobile"],
            ["Address", "address"]
          ].map(([label, key], index) => {
            const isReadOnly = key === 'fullName' || key === 'email';
            return (
              <div key={index} className="flex gap-8 px-4 py-2 pt-3 text-2xl mb-3 ml-3 border-b-2 border-black items-center">
                <label className="w-40">{label}</label>
                <input
                  type="text"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  disabled={!isEditing || isReadOnly}
                  className={`border border-gray-300 rounded-md px-2 py-1 w-full text-lg bg-transparent ${
                    isEditing && !isReadOnly ? 'bg-white' : 'bg-gray-100 cursor-not-allowed'
                  }`}
                />
              </div>
            );
          })}

          <div className="px-4 ml-3 my-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-light px-6 py-2 rounded-lg transition duration-300 ease-in-out"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
