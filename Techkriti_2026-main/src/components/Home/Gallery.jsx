const Gallery = () => {
    // Total Grid Units needed: 28 (7 columns x 4 rows)
    // Distribution:
    // 2 Large (2x2) = 8 units
    // 1 CENTER Large (2x2) = 4 units -> The Water Image
    // Remaining Large: 1
    // Total Items: 16 (approx)

    // Position Logic:
    // Row 1: 7 cols
    // Row 2-3: Center is cols 3-4 (or 4-5).
    // Let's explicitly place the water image.

    const images = [
        { src: "/gallery/army1.jpg", title: "Armed Forces 1", size: "large" },
        { src: "/gallery/drill.jpg", title: "Drill 1", size: "tall" },
        { src: "/gallery/air.jpg", title: "Air Force", size: "wide" },
        { src: "/gallery/robo6.jpg", title: "Robotics 1", size: "normal" },
        { src: "/gallery/guns1.jpg", title: "Weapons", size: "normal" },

        { src: "/gallery/cds_inauguration.jpg", title: "CDS Inauguration", size: "center-large" },

        { src: "/gallery/drill_.jpeg", title: "Drill 2", size: "wide" },
        { src: "/gallery/PAT00619.jpg", title: "Event 1", size: "wide" },
        { src: "/gallery/drill_1.jpeg", title: "Drill 3", size: "normal" },
        { src: "/gallery/robo3.jpg", title: "Robotics 2", size: "large" },

        { src: "/gallery/generator.png", title: "Generator", size: "normal" },
        { src: "/gallery/image.png", title: "Exhibit 1", size: "wide" },
        { src: "/gallery/image copy.png", title: "Exhibit 2", size: "wide" },
    ];

    // Check coverage:
    // Row 1: Large(2) + Tall(1) + Wide(2) + Norm(1) + Norm(1) = 2+1+2+1+1 = 7. OK.
    // Row 2: Large(cont) + Tall(cont) + WATER(2) + Wide(2) .. wait.
    // Row 2 Start: Col 1-2 blocked. Col 3 blocked. 
    // Water at Col 4-5.
    // Wide at Col 6-7.
    // Row 2 Full? 2(blocked)+1(blocked)+2+2 = 7. OK.

    // Row 3:
    // Wide(2) at Col 1-2.
    // Norm(1) at Col 3.
    // Water(cont) at Col 4-5.
    // Large(2) at Col 6-7.
    // Row 3 Full? 2+1+2(blocked)+2 = 7. OK.

    // Row 4:
    // Norm(1) at Col 1.
    // Wide(2) at Col 2-3.
    // Wide(2) at Col 4-5.
    // Large(cont) at Col 6-7.
    // Row 4 Full? 1+2+2+2(blocked) = 7. OK.

    // Total Items: 13 defined manually to be perfect.

    return (
        <section id="gallery" className="section">
            <div className="container">
                <h2 className="section-title">Gallery</h2>
                <div className="gallery-perfect-bento">
                    {images.map((img, index) => (
                        <div key={index} className={`gallery-item ${img.size}`}>
                            <img src={img.src} alt={img.title} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
