import { Link } from "react-router-dom";
import AuthHeader from "../../components/shared/AuthHeader";


export default function SelectRole() {
  return (
       <div className="w-full max-w-md bg-white border-gray-300 border rounded-xl grid gap-4 py-10 px-4  shadow-lg">

         <div className="mb-8">
        <AuthHeader
          role="Admin Access"
          titleClass="text-primary-color text-4xl lg:text-6xl"
          heading="Welcome back, Admin!"
          description="Please log in to manage your exams, view student reports, and configure your dashboard settings."
        />
      </div>

          <p className="text-center text-xl font-bold text-gray-500">
            Admin Access
          </p>

          <p className="text-center text-sm font-bold">
            Welcome back, Admin!
          </p>

           <p className="text-center text-sm text-gray-500">
            Please log in to manage your exams, view student reports, and configure your dashboard settings.
          </p>

           {/* Button */}
          <div className="w-full grid items-center justify-center gap-y-4 mt-2">
          <button className="bg-blue-800 text-white px-10 py-2 rounded-md">
            login as Teacher
          </button>
                      
             <Link
              to="/register"
              className="border border-blue-800 text-blue-800 px-10 py-2 rounded-md font-semibold text-center hover:bg-blue-50 transition-colors"
              >
              login as  Educational Center
            </Link>


          </div>
    </div>
  );
}