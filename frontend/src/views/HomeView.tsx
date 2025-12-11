import Header from "../components/Header";
import SearchForm from "../components/SearchForm";

export default function HomeView() {
  return (
    <>
        <Header />

        <main className="bg-slate-100 py-10 min-h-screen lg:bg-home lg:bg-home-xl bg-no-repeat bg-right-top">
            <div className=" max-w-5xl mx-auto mt-10">
                <div className="lg:w-1/2 px-10 lg:p-0 space-y-8">
                    <h1 className="text-6xl font-black text-slate-900 leading-tight">
                        Todas tus <span className="text-cyan-500 block">Redes Sociales </span>
                        en un enlace
                    </h1>

                    <p className="text-slate-600 text-xl leading-relaxed">Únete a más de 200 mil developers compartiendo sus redes sociales, comparte tu perfil de TikTok, Facebook, Instagram, YouTube, Github y más</p>

                    <div className="bg-white p-2 rounded-lg shadow-lg max-w-md mb-10">
                         <SearchForm />
                    </div>
                </div>

                {/* Informational Cards Section */}
                <div className="mt-24 px-10 lg:px-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-purple-500 transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Análisis en tiempo real</h3>
                            <p className="text-slate-500 leading-relaxed">Conoce cuántas personas visitan tu perfil y optimiza tu alcance digital con métricas precisas.</p>
                         </div>

                         <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-cyan-500 transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-cyan-600">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.85 6.361a15.996 15.996 0 00-4.647 4.763m0 0c-.37.37-.66.82-.855 1.312M4.664 12c-.37.37-.66.82-.855 1.312M12 12a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Personalización Total</h3>
                            <p className="text-slate-500 leading-relaxed">Ajusta los colores, el orden y el estilo para que coincida perfectamente con tu marca personal.</p>
                         </div>
                         
                         <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-pink-500 transform hover:-translate-y-2 transition-transform duration-300">
                             <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-pink-600">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Comparte en todos lados</h3>
                            <p className="text-slate-500 leading-relaxed">Un solo enlace para tu bio de Instagram, Twitter, TikTok y cualquier otra plataforma.</p>
                         </div>
                    </div>
                </div>
            </div>
        </main>
    </>
  )
}
