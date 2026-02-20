import eventsData from '../data/events.json';

export const getNavigationStructure = () => {
  const structure = {
    Technical: [],
    Entrepreneurial: [],
    Miscellaneous: []
  };

  Object.entries(eventsData).forEach(([key, value]) => {
    const category = value.category;
    if (structure[category]) {
      // Find the overview item to get the description
      const overviewItem = value.data.find(item => item.flag && item.flag.content === 'overview');
      const description = overviewItem ? overviewItem.desc.content : '';

      // Find the first item with an image (usually a competition)
      const imageItem = value.data.find(item => item.flag && item.flag.content === 'comp' && item.image);
      const image = imageItem ? imageItem.image : null;

      structure[category].push({
        id: key,
        title: value.title,
        description: description,
        image: image, // Add image to the structure
        link: `/competitions/${category.toLowerCase()}/${key}`
      });
    }
  });

  return structure;
};
