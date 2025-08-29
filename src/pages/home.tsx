import React from "react";

//import components
import Analytics from "../components/home/analytics";
import Editor from "../components/home/editor";

const viewsData = [10, 20, 30, 11, 41, 100, 110];
const Home: React.FC = () => {
    return (
        <main className="min-h-screen flex flex-col items-center bg-gray-100">
            {/* gradient circles */}
            <div className="absolute top-40 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-40 blur-2xl z-0"  aria-hidden="true" role="presentation"/>
            <div className="absolute top-20 left-3/4 w-[300px] h-[300px] bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-30 blur-2xl z-0"  aria-hidden="true" role="presentation"/>
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-gradient-to-tl from-purple-300 to-blue-300 rounded-full opacity-20 blur-2xl z-0" aria-hidden="true" role="presentation"/>

            {/* Analytics card */}
            <Analytics weeklyViews={viewsData}/>
            
            {/* editor card */}
            <Editor buttonLabels={['Info', 'Carousel', 'Menu']} />

        </main>
    );
};

export default Home;
