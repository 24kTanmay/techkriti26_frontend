
import ReactMarkdown from "react-markdown";

export const Guidelines = ({ guidelines }) => {
  return (
    // A container with a subtle background and border to make the section distinct
    <div className="details-content-box">
      <div className="details-prose guidelines-list">
        {guidelines ? (
          <ReactMarkdown
            components={{
              ul: ({node, ...props}) => <ul className="guidelines-list" {...props} />,
              li: ({node, ...props}) => <li className="guidelines-item" {...props} />
            }}
          >
            {guidelines}
          </ReactMarkdown>
        ) : (
          <p>Guidelines coming soon.</p>
        )}
      </div>
    </div>
  );
};
