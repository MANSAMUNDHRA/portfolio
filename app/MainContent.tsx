// components/MainContent.tsx
"use client";

import { useState } from "react";
import NavBar from "./NavBar";
import AboutPage from "./AboutPage";
import SkillsPage from "./SkillsPage";
import ToolsPage from "./ToolPage";
import ProjectsPage from "./ProjectsPage";
import ContactPage from "./ContactPage";
import ExperiencePage from "./ExperiencePage";

export default function MainContent() {
  const [activePage, setActivePage] = useState("about");
  
  const renderPage = () => {
    switch(activePage) {
      case "about": return <AboutPage />;
      case "skills": return <SkillsPage />;
      case "tools": return <ToolsPage activePage={activePage} />;
      case "projects": return <ProjectsPage />;
      case "experience": return <ExperiencePage />;
      case "contact": return <ContactPage />;
      default: return <AboutPage />;
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <NavBar activePage={activePage} onNavigate={setActivePage} />
      {renderPage()}
    </div>
  );
}