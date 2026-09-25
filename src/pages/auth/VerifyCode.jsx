import { useRef } from "react";
import AuthHeader from "../../components/shared/AuthHeader";
import { Link } from "react-router-dom";

export default function VerifyCode() {

  const inputs = useRef([]);

  const handleChange = (e, index) => {

    if(e.target.value.length === 1 && index < 3){
      inputs.current[index+1].focus();
    }

  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-8">

      <AuthHeader
        role="Admin Access"
        titleClass="text-primary-color text-4xl lg:text-6xl"
        heading="Verification"
        description="We Have Sent A Code To Your Email Address"
      />

      <div className="flex justify-center gap-3 mt-10">

        {[0,1,2,3].map((item,index)=>(
          <input
            key={index}
            ref={(el)=>inputs.current[index]=el}
            maxLength={1}
            onChange={(e)=>handleChange(e,index)}
            className="w-14 h-14 border rounded-lg text-center text-2xl font-bold outline-none focus:border-primary-color"
          />
        ))}

      </div>

      <div className="flex justify-between mt-6 text-sm">

        <button className="text-primary-color hover:underline">
          Resend
        </button>

        <span className="text-gray-500">
          1:30
        </span>

      </div>

               <div className="w-full grid items-center justify-center gap-y-4 mt-2">

      <Link to="/reset-password"
        className="w-full mt-8 py-3 px-8 rounded-lg bg-primary-color text-white font-semibold"
      >
        Confirm
      </Link>
    </div>
    </div>
  );
}