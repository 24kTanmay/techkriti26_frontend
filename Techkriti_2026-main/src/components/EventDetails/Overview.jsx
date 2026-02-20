
import ReactMarkdown from "react-markdown";

export const Overview = ({
	content,
	title,
	competitions,
	handleCompetitionClick,
	slug,
}) => {
	return (
		<div className="details-content-box">
			<h3 className="details-title">
				{title}
			</h3>
			<div className="details-prose">
				<ReactMarkdown>{content}</ReactMarkdown>
			</div>
			{slug !== "MnM" && (
				<div className="mt-8" style={{ marginTop: '2rem' }}>
					<h2 className="details-subtitle">
						Competitions
					</h2>
					<ul className="comp-list">
						{competitions?.map((comp) => (
							<li key={comp.name}>
								<button
									onClick={() => handleCompetitionClick(comp.name)}
									className="comp-list-btn"
								>
									{comp.name}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
