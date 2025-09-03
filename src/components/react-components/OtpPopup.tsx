import { useCallback, useEffect, useState } from "react";

// CONPONENTS //
import Popup from "../Popup";

// SERVICES //
import { verifyOtpRequest } from "../../services/api/auth.api.service";

type OtpPopupProps = {
  showPopup: boolean;
  closePopup: () => void;
  email: string;
  setError: any;
  onVerified: () => void;
};

/** Export the Otp Popup Component */
export const OtpPopup: React.FC<OtpPopupProps> = ({
  showPopup,
  closePopup,
  email,
  setError,
  onVerified,
}) => {
  // Define States
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Lock/unlock page scroll while popup is open
  useEffect(() => {
    const root = document.documentElement;
    if (showPopup) {
      root.classList.add("overflow-y-hidden");
    } else {
      root.classList.remove("overflow-y-hidden");
    }
    return () => {
      root.classList.remove("overflow-y-hidden");
      setOtpError("");
      setOtp("");
    };
  }, [showPopup]);

  // Define Helper Functions
  /** Reset the errors */
  const resetErrors = () => {
    setError();
  };

  /** Handle Close Popup */
  const handleClose = () => {
    // Reset Errors
    resetErrors();
    setOtp("");

    // Close Popup
    closePopup();
  };

  /** Verify the OTP */
  const handleVerifyOtp = useCallback(async () => {
    // Reset Errors
    resetErrors();

    const trimmedEmail = email.trim();
    const code = otp.trim();

    if (!trimmedEmail || !code) {
      setOtpError("You need to enter an OTP");
      return;
    }

    try {
      setIsLoading(true);

      // Make the API Call
      const response = await verifyOtpRequest(trimmedEmail, code);

      if (response.status) {
        // Notify parent that email is verified
        onVerified();
        handleClose();
      } else {
        setOtpError(response.message);
      }
    } catch (err) {
      console.error(err);
      setOtpError("Error Occured. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email, otp, setError, onVerified]);

  return (
    <Popup isOpen={showPopup} onClose={handleClose}>
      <div className="px-6 flex flex-col items-center gap-10">
        {/* <!-- Content Column --> */}
        <div className="flex flex-col gap-2 w-full">
          {/* <!-- Email Verification Title --> */}
          <h1 className="section-title">Email Verification</h1>

          {/* <!-- Description Text --> */}
          <p className="text-sm font-medium leading-[22px] text-center text-n-400 w-full">
            We have sent an OTP to your Email ID.
            <br />
            Check your inbox or spam/junk.
          </p>
        </div>

        {/* <!-- OTP Input with Line --> */}
        <div className="w-[90%]">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border-n-950 border-b bg-transparent outline-none text-[20px] font-medium pb-2 text-center placeholder-n-950"
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
          />
          {otpError && (
            <p className="mt-1 text-base font-medium text-red-500">
              {otpError}
            </p>
          )}
        </div>

        {/* <!-- Verify Button --> */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleVerifyOtp}
            className="btn-cta flex justify-between w-full py-6"
          >
            <span className="text-xl font-bold leading-none">
              {isLoading ? "Checking..." : "Verify Email"}
            </span>
            <img
              src="/images/right-arrow.svg"
              alt="Arrow"
              className="w-8 h-auto"
            />
          </button>
        </div>
      </div>
    </Popup>
  );
};
