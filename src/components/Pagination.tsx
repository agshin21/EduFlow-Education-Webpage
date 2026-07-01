const Pagination = (data: {
  enabled?: any;
  changePageNo?: any;
  courses?: any;
  coursesPerPage?: any;
  currentPage?: any;
}) => {
  const numbers = []
  for(let i = 1; i <= Math.ceil(data.courses/data.coursesPerPage); i++) {
    numbers.push(i)
  }
  return (
    <div className="flex justify-center mt-5 gap-3">
    {
      data.enabled > 0 ?
        (<></>) :
        numbers && numbers.map((no) => { 
         return <div>
          <button className={
          data.currentPage === no ? 
         'py-1 px-4 text-white text-xl md:text-3xl max-w-11 md:max-w-15 w-full min-h-8 text-center md:min-h-16 font-bold transition bg-[#212b79] hover:cursor-pointer rounded-lg border' : 
         'py-1 px-4 text-white text-xl md:text-3xl max-w-11 md:max-w-15 w-full min-h-8 text-center md:min-h-16 font-bold transition bg-[#445aff] hover:cursor-pointer rounded-lg border'} key={no}
         onClick={() => {
            data.changePageNo(no)
         }}>{no}</button> 
          </div>  
        })
    }
    </div>
  )
}

export default Pagination