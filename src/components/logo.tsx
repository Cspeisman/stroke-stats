export default function GolfFlagLogo() {
    return (
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Pole */}
            <rect x="240" y="80" width="32" height="360" fill="#8B4513" />

            {/* Flag - Geometric Style */}
            <polygon points="272,80 272,200 400,140" fill="#4CAF50" />

            {/* Hole */}
            <circle cx="256" cy="460" r="20" fill="#333" />

            {/* Base */}
            <rect x="216" y="440" width="80" height="20" rx="5" fill="#555" />
        </svg>
    )
}
