import React, {useState} from 'react'

import { IoIosArrowDown } from "react-icons/io";

interface FAQItem {
    question: string,
    answer: string
}
interface AccordionProps {
    faqList: FAQItem[]
}
const Accordion: React.FC<AccordionProps> = ({faqList}) => {
  const [openId, setOpenId] = useState<number | null>(null)  
  const clickHandler = (id: number): void => {
    if(id === openId)setOpenId(null)
    else setOpenId(id)    
  }
  return (
    <>
    <ul className='list-none m-4 pt-4 rounded-md w-fit flex flex-col justify-center items-center'>
        {
            faqList.map((faqItem, id) => { 
                return <li className='mb-4 bg-[#fafafa] rounded-md p-px' key={id}>
                    <button className={`flex items-center justify-between relative w-full border-0 pt-7 pb-7 px-5 shadow-md rounded-md text-[16px] md:text-[22px] text-left cursor-pointer text-[#3e5175] font-bold transition ${id === openId ? "bg-[#cfd6ff]" : "bg-white"}`} onClick={() => {clickHandler(id)}}>{faqItem.question} <IoIosArrowDown className={`rotate-0 transition ${id === openId ? "rotate-180" : ""}`}/></button>
                    <div className={`h-0 overflow-hidden transition duration-300 ${id === openId ? "h-auto" : ""}`}>
                        <div className='pt-7.5 pr-15 pb-7.5 pl-7.5 rounded-bl-md rounded-br-md text-[14px] md:text-[20px] text-[#393939] font-medium'>{faqItem.answer}</div>
                    </div>
                </li>
            })
        }
    </ul>
    </>
  )
}

export default Accordion