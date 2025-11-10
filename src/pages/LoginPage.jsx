import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../features/movies/moviesSlice";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authSlice";

import bgImage from "../assets/netflix_login.jpg";
import logoImage from "../assets/netflix_logo.png";
import net1 from "../assets/1net.png";
import net2 from "../assets/2net.png";
import net3 from "../assets/3net.png";
import net4 from "../assets/4net.png";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loginType, setLoginType] = useState("email");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: movies, status } = useSelector((state) => state.movies);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMovies());
    }
  }, [status, dispatch]);

  // ---------- Email Login ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please enter email and password.");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(login(userCredential.user)); // store in redux + localStorage
      alert("Login successful!");
      setShowModal(false);
      navigate("/"); // redirect to homepage
    } catch (error) {
      alert("Error logging in: " + error.message);
    }
  };

  // ---------- Send OTP ----------
  const sendOtp = async () => {
    if (!phoneNumber) return alert("Enter a valid phone number (e.g., +91...)");
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      setOtpSent(true);
      alert("OTP sent successfully!");
    } catch (error) {
      alert("Error sending OTP: " + error.message);
    }
  };

  // ---------- Verify OTP ----------
  const verifyOtp = async () => {
    if (!otp) return alert("Please enter the OTP.");
    try {
      const result = await confirmationResult.confirm(otp);
      dispatch(login(result.user)); // store in redux + localStorage
      alert("Phone verified successfully!");
      setShowModal(false);
      navigate("/"); // redirect to homepage
    } catch (error) {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <>
      {/* Background Section */}
      <div
        className="relative min-h-screen bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/80" />

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center px-5 md:px-20 lg:px-[145px] py-3">
          <img src={logoImage} alt="Netflix Logo" className="w-32 md:w-56" />
          <div className="flex items-center gap-3 md:gap-4">
            <select className="bg-black/70 border border-gray-500 px-2 md:px-3 py-1 rounded text-sm md:text-base">
              <option>English</option>
              <option>हिन्दी</option>
            </select>
            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold text-sm md:text-base"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-[80vh] text-center px-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight mt-8">
            Unlimited movies, TV <br /> shows and more
          </h1>
          <p className="text-lg md:text-xl mb-4">
            Starts at ₹149. Cancel at any time.
          </p>
          <p className="mb-4 text-sm md:text-base">
            Ready to watch? Enter your email to create or restart your
            membership.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-[600px]">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 p-3 md:p-4 rounded bg-black/60 border border-gray-400 focus:outline-none w-full"
            />
            <button className="bg-red-600 hover:bg-red-700 text-lg font-semibold px-6 py-3 rounded w-full sm:w-auto">
              Get Started &gt;
            </button>
          </div>
        </div>

        {/* Sign In Modal */}
        {showModal && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-8 text-white transition-transform transform hover:scale-[1.02] duration-300">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-gray-300 text-2xl hover:text-white transition"
              >
                ✕
              </button>

              {/* Title */}
              <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wide">
                Sign In
              </h2>

              {/* Login Type Toggle */}
              <div className="flex justify-center mb-6 bg-white/10 rounded-lg overflow-hidden backdrop-blur-md">
                <button
                  className={`px-4 py-2 font-semibold transition-all ${
                    loginType === "email"
                      ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setLoginType("email")}
                >
                  Email
                </button>
                <button
                  className={`px-4 py-2 font-semibold transition-all ${
                    loginType === "phone"
                      ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setLoginType("phone")}
                >
                  Phone
                </button>
              </div>

              {/* Email Login */}
              {loginType === "email" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-gray-300 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-gray-300 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 font-semibold shadow-lg hover:shadow-red-700/30 transition-all"
                  >
                    Sign In
                  </button>
                </form>
              ) : (
                // Phone OTP Login
                <div className="space-y-4">
                  {!otpSent ? (
                    <>
                      <input
                        type="text"
                        placeholder="Phone number (+91...)"
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-gray-300 text-white"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <div id="recaptcha-container"></div>
                      <button
                        onClick={sendOtp}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 font-semibold shadow-lg hover:shadow-red-700/30 transition-all"
                      >
                        Send OTP
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-gray-300 text-white"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button
                        onClick={verifyOtp}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 font-semibold shadow-lg hover:shadow-red-700/30 transition-all"
                      >
                        Verify OTP
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Trending Now Section */}
      <div className="bg-black text-white py-12 relative">
        <h2 className="px-5 md:px-20 lg:px-[145px] text-2xl font-bold mb-6">
          Trending Now
        </h2>

        <div className="relative px-5 md:px-20 lg:px-[145px]">
          {/* Scroll Buttons (hidden on small screens) */}
          <button
            onClick={() => {
              document
                .getElementById("movieRow")
                .scrollBy({ left: -500, behavior: "smooth" });
            }}
            className="hidden md:block absolute left-[20px] lg:left-[100px] top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black text-white p-3 rounded-full z-20"
          >
            &#8249;
          </button>

          <button
            onClick={() => {
              document
                .getElementById("movieRow")
                .scrollBy({ left: 500, behavior: "smooth" });
            }}
            className="hidden md:block absolute right-[20px] lg:right-[100px] top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black text-white p-3 rounded-full z-20"
          >
            &#8250;
          </button>

          {/* Movie Row */}
          <div
            id="movieRow"
            className="overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-4 sm:gap-6">
              {status === "loading" && <p>Loading movies...</p>}
              {status === "succeeded" &&
                movies.map((movie, index) => (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedMovie(movie)}
                    className="relative flex-shrink-0 w-[150px] sm:w-[200px] cursor-pointer hover:scale-110 transition-transform duration-300"
                  >
                    <img
                      src={movie.poster_path}
                      alt={movie.title}
                      className="rounded-md w-full h-[220px] sm:h-[300px] object-cover"
                    />
                    <div className="absolute -left-4 sm:-left-6 bottom-2 sm:bottom-4 text-[60px] sm:text-[80px] font-extrabold text-black opacity-80 drop-shadow-[2px_2px_2px_white]">
                      {index + 1}
                    </div>
                    <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 flex flex-col justify-center items-center text-center p-3 transition-opacity duration-300 rounded-md">
                      <h3 className="font-semibold text-base sm:text-lg mb-1">
                        {movie.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300">
                        {movie.genre}
                      </p>
                      <p className="text-xs sm:text-sm mt-1 text-gray-400">
                        ⭐ {movie.rating} | {movie.release_date.split("-")[0]}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Movie Modalss */}
        {selectedMovie && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-30 px-4">
            <div className="bg-black text-white rounded-lg p-6 max-w-lg w-full relative">
              <button
                onClick={() => setSelectedMovie(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
              <img
                src={selectedMovie.poster_path}
                alt={selectedMovie.title}
                className="w-full h-[300px] sm:h-[350px] object-cover rounded mb-4"
              />
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                {selectedMovie.title}
              </h2>
              <p className="text-gray-300 mb-1">{selectedMovie.genre}</p>
              <p className="text-gray-400 mb-2">
                ⭐ {selectedMovie.rating} |{" "}
                {selectedMovie.release_date.split("-")[0]}
              </p>
              <p className="text-gray-300 text-sm">{selectedMovie.plot}</p>
            </div>
          </div>
        )}
      </div>

      {/* More Reasons to Join */}
      <div className="bg-black text-white py-16">
        <div className="px-5 md:px-20 lg:px-[145px]">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            More reasons to join
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Enjoy on your TV",
                desc: "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.",
                img: net1,
              },
              {
                title: "Download your shows to watch offline",
                desc: "Save your favourites easily and always have something to watch.",
                img: net2,
              },
              {
                title: "Watch everywhere",
                desc: "Stream unlimited movies and TV shows on your phone, tablet, laptop and TV.",
                img: net3,
              },
              {
                title: "Create profiles for kids",
                desc: "Send kids on adventures with their favourite characters in a space made just for them — free with your membership.",
                img: net4,
              },
            ].map((card, index) => (
              <div
                key={index}
                className="relative bg-gradient-to-b from-[#170c31] via-[#37076d] to-[#b6009b] rounded-2xl p-6 h-56 flex flex-col justify-between shadow-lg hover:scale-105 transition-transform duration-300 overflow-hidden"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-12 h-12 rounded-full border border-gray-500 shadow-lg object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-black text-white py-16">
        <div className="px-5 md:px-20 lg:px-[145px]">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What is Netflix?",
                a: "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more – on thousands of devices.",
              },
              {
                q: "How much does Netflix cost?",
                a: "Watch Netflix on any device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month. No extra costs, no contracts.",
              },
              {
                q: "Where can I watch?",
                a: "Watch anywhere, anytime — on the web, smart TVs, phones, tablets, or consoles. You can also download shows for offline viewing.",
              },
              {
                q: "How do I cancel?",
                a: "Netflix is flexible. No contracts. Cancel anytime online in two clicks without fees.",
              },
              {
                q: "Is Netflix good for kids?",
                a: "Yes. Netflix Kids gives parents control and lets kids enjoy safe, family-friendly entertainment with PIN-protected parental settings.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-[#2d2d2d] rounded-lg overflow-hidden"
              >
                <summary className="cursor-pointer text-lg font-medium p-6 flex justify-between items-center">
                  <span>{faq.q}</span>
                  <span className="text-3xl leading-none">+</span>
                </summary>
                <div className="p-6 text-gray-300 text-base md:text-lg">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <section className="bg-black text-gray-300 py-10 px-5 md:px-20">
        <div className="text-center mb-8">
          <h2 className="text-lg md:text-2xl font-medium mb-4">
            Ready to watch? Enter your email to create or restart your
            membership.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent border border-gray-500 px-4 py-3 w-full sm:w-96 text-white rounded-md focus:outline-none"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-semibold">
              Get Started →
            </button>
          </div>
        </div>

        <div className="text-center md:text-left text-gray-400 space-y-8">
          <p className="text-sm">
            Questions? Call{" "}
            <span className="underline cursor-pointer">000-800-919-1743</span>
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
            {[
              "FAQ",
              "Help Centre",
              "Account",
              "Media Centre",
              "Investor Relations",
              "Jobs",
              "Ways to Watch",
              "Terms of Use",
              "Privacy",
              "Cookie Preferences",
              "Corporate Information",
              "Contact Us",
              "Speed Test",
              "Legal Notices",
              "Only on Netflix",
            ].map((link, index) => (
              <a key={index} href="#" className="underline hover:text-white">
                {link}
              </a>
            ))}
          </div>

          <div className="mt-6">
            <select className="bg-transparent border border-gray-600 px-3 py-2 rounded-md text-white">
              <option>English</option>
              <option>हिन्दी</option>
            </select>
            <p className="mt-4 text-sm">Netflix India</p>
          </div>
            {/* Page End */}
          <p className="text-xs mt-6 text-gray-500 mb-10">
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot.
            <a href="#" className="underline ml-1">
              Learn more.
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
