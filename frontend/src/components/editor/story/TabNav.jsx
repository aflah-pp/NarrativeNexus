import { motion } from "framer-motion";

const TabNav = ({ activeTab, setActiveTab, chapterCount }) => {
  const tabs = ["overview", "chapters"];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8 relative">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-1 font-medium text-sm relative transition-colors ${
              activeTab === tab
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {tab === "overview" ? "Overview" : `Chapters (${chapterCount})`}
            {activeTab === tab && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                layoutId="tab-underline"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </nav>
    </div>
  );
};

export default TabNav;