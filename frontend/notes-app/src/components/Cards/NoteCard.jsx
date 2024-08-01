import React from 'react'
import { MdOutlinePushPin } from "react-icons/md";
import moment from 'moment';
import { MdCreate , MdDelete } from 'react-icons/md';
const NoteCard = ({
    title , 
    date ,
    content ,
    tags ,
    isPinned ,
    onEdit ,
    onDelete ,
    onPinNote ,
 }) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
        <div className="flex justify-between items-center">
        <div>
            <h6 className="text-sm font-medium">{title}</h6>
            <span className="text-xs  text-slate-500">{moment(date).format("MMMM Do YYYY")}</span>

        </div>
        <MdOutlinePushPin
      className={`text-2xl cursor-pointer transition-transform duration-300 ease-in-out ${
        isPinned ? 'text-blue-600' : 'text-gray-400'
      } hover:text-blue-500 hover:scale-110 active:scale-105 active:shadow-lg`}
      onClick={onPinNote}
      aria-label={isPinned ? 'Unpin Note' : 'Pin Note'}/>

        </div>

        
        <p className='text-xs text-slate-600 mt-2 '>
            {content?.slice(0,60)}
        </p>

        <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-slate-500 ">{tags.map((items)=>`#${items} `)}</div>
            <div className="flex items-center gap-2">
                <MdCreate
                className='icon-btn hover:text-green-600'
                onClick={onEdit}
                />

                <MdDelete
                className='icon-btn hover:text-red-600'
                onClick={onDelete}
                />
            </div>
        </div>
    </div>
  )
}

export default NoteCard