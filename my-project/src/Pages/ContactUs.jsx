import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../Compontnts/Header";
import Footer from "../Compontnts/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaPlus, FaQuestionCircle, FaCheckCircle } from "react-icons/fa";
import bannerImg3 from "../assets/images/baner3.jpg";
import { fetchAllContent } from "../redux/slices/contentSlice";
import { api } from "../redux/api";

const ContactUs = () => {
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const [openIndex, setOpenIndex] = useState(null);
    const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error
    const [errorMsg, setErrorMsg] = useState("");
    const [contactData, setContactData] = useState(null);
    const [faqs, setFaqs] = useState([]);

    // Get content from Redux store
    const { contents, loading } = useSelector((state) => state.contents);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fetchAllContent());
    }, [dispatch]);

    // Process contact data when contents are loaded
    useEffect(() => {
        if (contents && contents.length > 0) {
            // Find the contact page content by type
            const contactContent = contents.find(item => item.type === "contact");

            if (contactContent && contactContent.content) {
                try {
                    // Parse the content if it's a string
                    let parsedData;
                    if (typeof contactContent.content === 'string') {
                        // Handle the complex structure with multiple parts
                        const contentStr = contactContent.content;

                        // Extract contact info
                        const contactMatch = contentStr.match(/"contact":\s*\{([^}]+)\}/);
                        if (contactMatch) {
                            const contactInfo = JSON.parse(`{${contactMatch[0]}}`);
                            setContactData(contactInfo.contact);
                        }

                        // Extract FAQs using regex
                        const faqMatches = contentStr.matchAll(/\{\s*q:\s*"([^"]+)",\s*a:\s*"([^"]+)"\s*\}/g);
                        const extractedFaqs = [];
                        for (const match of faqMatches) {
                            extractedFaqs.push({
                                q: match[1],
                                a: match[2]
                            });
                        }

                        if (extractedFaqs.length > 0) {
                            setFaqs(extractedFaqs);
                        }
                    } else if (typeof contactContent.content === 'object') {
                        // If it's already an object
                        if (contactContent.content.contact) {
                            setContactData(contactContent.content.contact);
                        }
                        if (contactContent.content.faqs) {
                            setFaqs(contactContent.content.faqs);
                        }
                    }
                } catch (error) {
                    console.error('Error parsing contact content:', error);
                    // Set fallback data
                    setContactData({
                        email: "aweindias@gmail.com",
                        phone: "+91 6280 422 290",
                        location: "Gujarat, India",
                        arena: "Ring Bell"
                    });
                }
            }
        }
    }, [contents]);

    // Fallback FAQs in case API data is not available
    const defaultFaqs = [
        {
            q: "How can I contact the support team?",
            a: "You can reach us through the contact form below or email our support team. We usually respond within 24–48 hours."
        },
        {
            q: "How can I report a bug or glitch?",
            a: "Select 'Bug Report' in the subject field and include screenshots or screen recordings if possible."
        },
        {
            q: "Can I suggest new wrestlers, matches, or features?",
            a: "Yes! We love community ideas. Choose 'Feature Request' in the form and share your suggestions."
        },
        {
            q: "How do I participate in tournaments or events?",
            a: "All tournaments are listed on our Events page. For registration questions, feel free to contact us."
        },
        {
            q: "Can I collaborate or partner with your platform?",
            a: "Yes! For collaborations or partnerships, select 'Business / Collaboration' in the contact form."
        },
        {
            q: "Is my personal information safe?",
            a: "Absolutely. Your data is secure and used only to help resolve your request."
        },
    ];

    // Use API data or fallback to defaults
    const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;
    const contactInfo = contactData || {
        email: "aweindias@gmail.com",
        phone: "+91 6280 422 290",
        location: "Gujarat, India",
        arena: "Ring Bell"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        setFormStatus("sending");
        setErrorMsg("");

        try {
            const payload = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                subject: form.subject.value,
                message: form.message.value.trim(),
            };

            await api.post("/contact", payload);
            setFormStatus("success");
            form.reset();
            setTimeout(() => setFormStatus("idle"), 4000);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || "Something went wrong. Please try again.");
            setFormStatus("error");
            setTimeout(() => setFormStatus("idle"), 4000);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans overflow-x-hidden">
            <Header />

            {/* 1. CINEMATIC HERO */}
            <div className="relative h-[40vh] sm:h-[50vh] flex items-center justify-center overflow-hidden">
                <motion.div
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.4 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${bannerImg3})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60" />

                <div className="relative z-10 text-center px-4">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-orange-500 font-black tracking-[.3em] sm:tracking-[.5em] uppercase text-[10px] mb-4 block"
                    >
                        Get In The Ring
                    </motion.span>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-8xl font-[1000] italic uppercase tracking-tighter leading-none"
                    >
                        CONTACT <span className="text-orange-500">AWE</span>
                    </motion.h1>
                </div>
            </div>

            {/* 2. CONTACT GRID */}
            <div className="container mx-auto px-4 sm:px-6 -mt-12 sm:-mt-20 relative z-20 pb-20 sm:pb-32">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* INFO SIDEBAR */}
                    <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-neutral-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5"
                        >
                            <h2 className="text-2xl sm:text-3xl font-black italic uppercase mb-8">
                                Fan <br className="hidden sm:block" />Support
                            </h2>

                            <div className="space-y-6 sm:space-y-8">
                                <ContactMethod
                                    icon={<FaEnvelope />}
                                    title="Email Arena"
                                    value={contactInfo.email}
                                />
                                <ContactMethod
                                    icon={<FaPhone />}
                                    title={contactInfo.arena || "Ring Bell"}
                                    value={contactInfo.phone}
                                />
                                <ContactMethod
                                    icon={<FaMapMarkerAlt />}
                                    title="Headquarters"
                                    value={contactInfo.location}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-orange-600 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center gap-4"
                        >
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping" />
                            <p className="font-black uppercase italic text-[10px] sm:text-xs tracking-widest">
                                System Status: All Systems Go
                            </p>
                        </motion.div>
                    </div>

                    {/* FORM */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-8 bg-white text-black p-8 sm:p-16 rounded-[2rem] sm:rounded-[3rem] shadow-2xl order-1 lg:order-2"
                    >
                        <div className="mb-8 sm:mb-12">
                            <h3 className="text-3xl sm:text-4xl font-[1000] italic uppercase tracking-tighter mb-2">
                                Send a Transmission
                            </h3>
                            <p className="text-neutral-500 font-medium text-sm sm:text-base">
                                Have a business proposal or a bug report? Our team is on standby.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                                <FloatingInput label="Your Name" type="text" name="name" required />
                                <FloatingInput label="Email Address" type="email" name="email" required />
                            </div>

                            <div className="relative">
                                <select
                                    name="subject"
                                    className="w-full border-b-2 border-neutral-200 py-4 focus:outline-none focus:border-orange-500 font-bold uppercase text-[10px] sm:text-xs tracking-widest appearance-none bg-transparent cursor-pointer"
                                >
                                    <option>General Inquiry</option>
                                    <option>Partnership / Business</option>
                                    <option>Talent Application</option>
                                    <option>Bug Report</option>
                                    <option>Feature Request</option>
                                    <option>Media & Press</option>
                                </select>
                                <div className="absolute right-0 bottom-5 pointer-events-none text-xs text-neutral-400">
                                    ▼
                                </div>
                            </div>

                            <div className="relative">
                                <textarea
                                    name="message"
                                    rows="4"
                                    className="w-full border-b-2 border-neutral-200 py-4 focus:outline-none focus:border-orange-500 placeholder:text-neutral-300 transition-all resize-none text-sm sm:text-base"
                                    placeholder="HOW CAN WE HELP YOU, CHAMP?"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={formStatus === "sending"}
                                className={`w-full py-5 sm:py-6 rounded-xl sm:rounded-2xl font-[1000] uppercase italic tracking-[.2em] sm:tracking-[.3em] transition-all flex items-center justify-center gap-4 text-sm sm:text-base ${formStatus === "success"
                                        ? 'bg-green-500 text-white'
                                        : formStatus === "error"
                                            ? 'bg-red-500 text-white'
                                            : formStatus === "sending"
                                                ? 'bg-neutral-400 text-white cursor-not-allowed'
                                                : 'bg-black text-white hover:bg-orange-600'
                                    }`}
                            >
                                {formStatus === "idle" && (
                                    <>
                                        <FaPaperPlane /> Dispatch Message
                                    </>
                                )}
                                {formStatus === "sending" && "Transmitting..."}
                                {formStatus === "success" && <><FaCheckCircle /> Message Received!</>}
                                {formStatus === "error" && "Failed — Try Again"}
                            </button>
                            {formStatus === "error" && errorMsg && (
                                <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* 3. FAQ SECTION */}
            <section className="bg-neutral-900/30 py-20 sm:py-32 border-t border-white/5">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 sm:mb-20"
                    >
                        <FaQuestionCircle className="text-orange-500 text-3xl sm:text-4xl mx-auto mb-6" />
                        <h2 className="text-4xl sm:text-7xl font-[1000] italic uppercase tracking-tighter">
                            Common <span className="text-orange-500">Inquiries</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {displayFaqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                faq={faq}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

/* SUB-COMPONENTS */

const ContactMethod = ({ icon, title, value }) => (
    <motion.div
        whileHover={{ x: 5 }}
        className="group flex items-center gap-4 sm:gap-6"
    >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center text-orange-500 text-lg sm:text-xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">
                {title}
            </p>
            <p className="text-base sm:text-lg font-bold text-white group-hover:text-orange-500 transition-colors truncate">
                {value}
            </p>
        </div>
    </motion.div>
);

const FloatingInput = ({ label, ...props }) => (
    <div className="relative group">
        <input
            {...props}
            placeholder=" "
            className="peer w-full border-b-2 border-neutral-200 py-4 focus:outline-none focus:border-orange-500 transition-all bg-transparent text-sm sm:text-base"
        />
        <label className="absolute left-0 top-4 text-neutral-400 font-bold uppercase text-[9px] sm:text-[10px] tracking-widest transition-all peer-focus:-top-2 peer-focus:text-orange-500 peer-[:not(:placeholder-shown)]:-top-2">
            {label}
        </label>
    </div>
);

const FAQItem = ({ faq, isOpen, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`border rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-500 ${isOpen ? 'bg-orange-600 border-transparent shadow-2xl' : 'bg-white/5 border-white/10'
            }`}
    >
        <button
            onClick={onClick}
            className="w-full px-6 py-6 sm:px-8 sm:py-8 flex justify-between items-center text-left group"
        >
            <span className="text-lg sm:text-xl font-black italic uppercase tracking-tight pr-4 group-hover:text-orange-500 transition-colors">
                {faq.q}
            </span>
            <motion.div
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className={`flex-shrink-0 ${isOpen ? 'text-white' : 'text-orange-500'}`}
            >
                <FaPlus size={18} />
            </motion.div>
        </button>

        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="px-6 pb-6 sm:px-8 sm:pb-8 text-white/80 font-medium text-sm sm:text-base leading-relaxed border-t border-white/10 pt-6">
                        {faq.a}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

const LoadingState = () => (
    <div className="h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

export default ContactUs;