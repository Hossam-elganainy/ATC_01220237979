"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DOMPurify from "dompurify"; // Import DOMPurify
import no_report from "../../public/no_report.png";
import { Eye, Star, X } from "lucide-react";
import { useRouter } from 'next/navigation';
import { getApiUrl, API_ROUTES, getAuthHeaders } from "../config/api.config";

export default function Page() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const token = Cookies.get("token");
  const [reports, setReports] = useState([]);
  const [id, setId] = useState(null);
  const [openrate, setOpenRate] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedstar, setSelectedStar] = useState(0);
  
  const timesmap = (time) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      // timeZoneName: "short",
    }).format(new Date(time));
  };
  
  useEffect(() => {
    // Check for authentication
    if (!token) {
      router.push('/');
      return;
    }

    async function fetchReports() {
      try {
        const response = await fetch(getApiUrl(API_ROUTES.REPORTS), {
          headers: getAuthHeaders(token)
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            Cookies.remove('token');
            router.push('/');
            return;
          }
          throw new Error('Failed to fetch reports');
        }
        
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    }

    fetchReports();
  }, [token, router]);

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setOpen(true);
  };

  

  
  const fetch_rate = async () => {
    if (!id || selectedstar === 0) {
      console.error("Error: Missing report_id or rating is 0.");
      return;
    }
  
    try {
      const response = await fetch(getApiUrl(API_ROUTES.RATINGS), {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ rating: selectedstar, report_id: id })
      });
  
      if (!response.ok) {
        console.log(`Failed to send rating: ${response.status}`);
        return;
      }
  
      
      // ✅ تحديث حالة التقارير مباشرة بدون إعادة تحميل الصفحة
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === id ? { ...report, is_rated: true, rating: selectedstar } : report
        )
      );
  
      setOpenRate(false); // إغلاق المودال بعد الإرسال
  
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };



  return (
    <div className="container mx-auto px-4 my-20 mb-80">
      {reports.length > 0 ? (
        <div className="grid min-w-full gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl w-full shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={()=>{setId(report.id)}}
            >
              <div className="flex flex-col items-center group">
                <div className="relative w-full h-[250px] overflow-hidden">
                  <Image
                    src={report.image || "/report.jpg"}
                    alt={report.title || "report_image"}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 bg-sky-600 text-white text-xs px-3 py-1 rounded-full">
                    {timesmap(report.created_at).split(',')[0]}
                  </div>
                </div>
                <div className='flex flex-col gap-3 p-6 w-full bg-white'>
                  <div className='flex items-center justify-between'>
                  <h1 className="text-teal-700 text-xl font-bold line-clamp-2 mb-2 group-hover:text-sky-500 transition duration-300">
                    {report.title}
                  </h1>
                  {/* {report.is_rated === false ?(
                      <button className="text-sky-600 hover:text-teal-800 bg-black/10 px-4 py-2 rounded-md cursor-pointer font-medium text-sm flex items-center">قيم الان</button>
                  ):(
                    <p className="flex items-center gap-1">
                    { `(${report.rating})`}
                    <Star size={20} weight="fill" className="text-yellow-500" />
                  </p>
                  )} */}
                  {report.is_rated === false &&(
                   <button className="text-sky-600 hover:text-teal-800 bg-black/10 px-4 py-2 rounded-md cursor-pointer font-medium text-sm flex items-center" onClick = {()=>{setOpenRate(true),setId(report.id)}}>قيم الان</button>
                  )}
                  {openrate && id === report.id && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black opacity-50"></div>
                      <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-lg z-10">
                        <X 
                          className="absolute top-3 right-3 cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenRate(false);
                          }}
                        />
                        <div className="flex items-center justify-center gap-4 my-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              onMouseEnter={()=>setHoveredStar(star)}
                              onMouseLeave={()=>setHoveredStar(0)}
                              size={24}
                              className={`cursor-pointer ${star<=hoveredStar?'text-yellow-500' :'text-gray-300'} ${star <= selectedstar ? 'fill-yellow-300 text-yellow-300 ':''}  `}
                              onClick={() => {setSelectedStar(star)}}
                            />
                          ))}
                        </div>
                        <button className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-teal-700 cursor-pointer" onClick ={()=>fetch_rate()}>
                          إرسال التقييم
                        </button>
                      </div>
                    </div>
                  )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-500 text-sm">
                      {timesmap(report.created_at).split(',')[1]}
                    </span>
                    <button className="text-sky-600 hover:text-teal-800 bg-black/10 px-4 py-2 rounded-md cursor-pointer font-medium text-sm flex items-center" onClick={() => handleReportClick(report)}>
                      عرض التقرير <Eye className="w-4 h-4 mr-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center gap-8 py-12">
          <div className="w-full max-w-[500px]">
            <Image src={no_report} alt="no reports" width={500} height={300} className="w-full h-auto" />
          </div>
          <h1 className="text-4xl md:text-6xl text-center text-sky-600 font-bold">لا يوجد تقارير</h1>
        </div>
      )}

      {/* Modal */}
      {open && selectedReport && (
       
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className="bg-white rounded-lg py-6 px-8 flex flex-col gap-6 scrollbar-thin items-center shadow-lg w-[90%] mx-auto h-[80%] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-4 left-4 cursor-pointer text-sky-600 hover:text-teal-800 transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>
            <h1 className="text-4xl md:text-6xl text-teal-800 text-center font-bold mt-8">
              {selectedReport.title}
            </h1>
            {/* Render rich text safely */}
            {/* Show the Attachment */}
            {/* {selectedReport.attachment && (
              <div className="flex flex-col gap-2 border-b border-gray-300 pb-4 w-full">
                <a href={selectedReport.attachment} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:text-teal-700">
                  <button className="bg-sky-600 flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:bg-teal-700 cursor-pointer transition-colors">معاينة <Eye className="w-4 h-4" /></button>
                </a>
              </div>
            )} */}
            <h1 className="text-2xl w-full font-bold text-sky-600 text-right">
              الوصف :
            </h1> 
            <div className="flex w-full text-right flex-wrap items-center justify-between gap-4">

            <div
              className="prose prose-lg  text-right rtl border-b border-gray-300 pb-4"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedReport.description) }}
            />
            {selectedReport.attachment && (
                <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
                    <iframe 
                        src={`${selectedReport.attachment}`}
                        className="w-full h-[50vh] border-0"
                        type="application/pdf"
                        title="PDF Viewer"
                        allow="fullscreen"
                    >
                        <p>
                            Your browser doesn't support PDF viewing.{' '}
                            <a 
                                href={selectedReport.attachment} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:text-teal-800"
                            >
                                Download PDF
                            </a>
                        </p>
                    </iframe>
                </div>
            )}
            </div>
            <button
              className="px-6 py-2 cursor-pointer bg-sky-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
              onClick={() => setOpen(false)}
            >
              إغلاق
            </button>
          </div>
        </div>
        
      )}
    </div>
  );
}
