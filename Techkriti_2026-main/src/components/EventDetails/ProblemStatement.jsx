
import ReactMarkdown from "react-markdown";

export const ProblemStatement = ({ content, link }) => {
  return (
    <div className="details-content-box">
      <div className="details-prose problem-statement">
        {content ? (
          <>
            <ReactMarkdown>{content}</ReactMarkdown>
            {link && (
              <div className="mt-6 flex justify-center">
                <a 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors duration-200"
                >
                  View Problem Statements
                </a>
              </div>
            )}
          </>
        ) : (
          <p>Problem statements coming soon.</p>
        )}
      </div>
    </div>
  );
};
