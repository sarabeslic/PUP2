import React from "react";
import StartBar from "../components/startBar";



    const Bye = () => {
        return (
          <div className="bg-cover bg-center h-screen flex flex-col" style={{ backgroundImage: 'url(/tiredDog.gif)' }}>
            <StartBar />
            <div className="flex flex-col items-center justify-start flex-grow pt-5">
              <h1 className="text-4xl text-center mt-10">Sorry to see you go...</h1>
              <h2 className="text-2xl text-center mt-2">We hope you come back!</h2>
            </div>
          </div>
        );
      };
      
      export default Bye;