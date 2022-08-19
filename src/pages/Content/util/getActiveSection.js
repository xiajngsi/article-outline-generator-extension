export default function getActiveSection(data, boundryTop, boundryBottom) {
  let activeSection;
  for (const section of data) {
    if (section.offsetTop < boundryBottom) {
      if (!activeSection && section.offsetTop > boundryTop) {
        activeSection = section;
        break;
      }
    }
  }

  if (activeSection && activeSection.subSections.length) {
    let activeSubSection;

    activeSubSection = getActiveSection(
      activeSection.subSections,
      boundryTop,
      boundryBottom
    );

    if (activeSubSection) {
      activeSection = activeSubSection;
    }
  }

  return activeSection;
}
