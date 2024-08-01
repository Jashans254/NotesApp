import React from 'react';
import { Link } from 'react-router-dom';
import { MdNoteAdd, MdLogin } from 'react-icons/md';
import { AiOutlineArrowRight } from 'react-icons/ai';
import NoteTakingImg from '../../assets/images/note-taking.svg';
const Welcome = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-200 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto text-center p-5">
       

        {/* Welcome Text */}
        <div className="flex items-center justify-center ">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4109/4109577.png"
          alt="NotesApp Logo"
          className="w-12 h-12 mx-auto mb-4 animate-bounce"
        />
        <h1 className="text-5xl font-bold text-blue-800 mb-4">
             {/* Logo */}
       
            Welcome to NotesApp</h1>
        </div>
        
        <p className="text-lg text-gray-700 mb-8">
          Your ultimate solution for organizing thoughts, ideas, and to-dos in one place.
        </p>

        {/* Illustration */}
        <img
          src={NoteTakingImg}
          alt="Note Taking Illustration"
          className="w-full max-w-xs h-auto mb-8 rounded-lg shadow-lg mx-auto"
        />

        {/* Features List */}
        <ul className="text-left text-lg text-gray-800 mb-8 space-y-2">
          <li className="flex items-center">
            <AiOutlineArrowRight className="text-blue-500 mr-2" />
            Easily create and organize notes
          </li>
          <li className="flex items-center">
            <AiOutlineArrowRight className="text-blue-500 mr-2" />
            Pin important notes for quick access
          </li>
          <li className="flex items-center">
            <AiOutlineArrowRight className="text-blue-500 mr-2" />
            Search notes quickly with advanced filtering
          </li>
          <li className="flex items-center">
            <AiOutlineArrowRight className="text-blue-500 mr-2" />
            Secure your notes with industry-grade encryption
          </li>
        </ul>

        {/* Call to Action */}
        <div className="flex justify-center space-x-4">
          <Link to="/signup" className="cta-btn bg-blue-500 text-white">
            <MdNoteAdd className="inline-block mr-2" />
            Sign Up
          </Link>
          <Link to="/login" className="cta-btn bg-gray-800 text-white">
            <MdLogin className="inline-block mr-2 " />
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
